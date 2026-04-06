import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RequestSchema = z.object({
  message: z.string().min(1).max(2000),
  cropName: z.string().min(1).max(100),
  cropNameHindi: z.string().max(100).optional().default(''),
  language: z.string().regex(/^[a-z]{2}$/, 'Invalid language code'),
  previousDiagnosis: z.string().max(20000).optional().default(''),
});

const languageNames: Record<string, string> = {
  'hi': 'Hindi', 'en': 'English', 'ta': 'Tamil', 'te': 'Telugu',
  'kn': 'Kannada', 'ml': 'Malayalam', 'bn': 'Bengali', 'gu': 'Gujarati',
  'mr': 'Marathi', 'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese',
};

const sanitize = (s: string) => s.replace(/[<>"']/g, '').slice(0, 100);

const getSystemPrompt = (language: string, cropName: string, cropNameHindi: string, previousDiagnosis: string) => {
  const langName = languageNames[language] || 'English';
  if (language === 'hi') {
    return `आप एक विशेषज्ञ कृषि सलाहकार हैं जो ${cropNameHindi || cropName} की खेती में किसानों की मदद करते हैं। 
पिछला निदान: ${previousDiagnosis || 'कोई नहीं'}
किसान के सवालों का जवाब हिंदी में दें। संक्षिप्त लेकिन पूर्ण जवाब दें।`;
  }
  return `You are an expert agricultural advisor helping farmers with ${cropName} cultivation.
Previous diagnosis: ${previousDiagnosis || 'None'}
Answer in ${langName} with clear, practical advice. Keep responses concise but complete.
IMPORTANT: Respond entirely in ${langName}.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Input validation
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, language, previousDiagnosis } = parsed.data;
    const cropName = sanitize(parsed.data.cropName);
    const cropNameHindi = sanitize(parsed.data.cropNameHindi || '');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    console.log(`Chat query for crop: ${cropName}, language: ${language}`);
    const systemPrompt = getSystemPrompt(language, cropName, cropNameHindi, previousDiagnosis);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in crop-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
