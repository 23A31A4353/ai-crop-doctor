import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const RequestSchema = z.object({
  imageBase64: z.string().min(1).max(10 * 1024 * 1024, 'Image too large'),
  cropName: z.string().min(1).max(100),
  cropNameHindi: z.string().max(100).optional().default(''),
  language: z.string().regex(/^[a-z]{2}$/, 'Invalid language code'),
});

const languageNames: Record<string, string> = {
  'hi': 'Hindi', 'en': 'English', 'ta': 'Tamil', 'te': 'Telugu',
  'kn': 'Kannada', 'ml': 'Malayalam', 'bn': 'Bengali', 'gu': 'Gujarati',
  'mr': 'Marathi', 'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese',
};

const sanitize = (s: string) => s.replace(/[<>"']/g, '').slice(0, 100);

const getSystemPrompt = (language: string, cropName: string, cropNameHindi: string) => {
  const langName = languageNames[language] || 'English';
  if (language === 'hi') {
    return `आप एक विशेषज्ञ कृषि वैज्ञानिक और फसल रोग विशेषज्ञ हैं। आपको फसल की तस्वीर का विश्लेषण करना है और निम्नलिखित जानकारी हिंदी में देनी है:
1. **रोग की पहचान**: रोग का नाम और प्रकार
2. **लक्षण**: दिखाई देने वाले लक्षणों का विस्तृत विवरण
3. **कारण**: रोग के कारण
4. **उपचार**: रासायनिक उपचार और जैविक/प्राकृतिक उपचार
5. **उर्वरक सिफारिश**: उर्वरक का नाम, अनुमानित कीमत (₹ में), उपयोग की विधि
6. **रोकथाम**: भविष्य में रोग से बचाव के उपाय
यदि पत्ता स्वस्थ दिखता है, तो इसकी पुष्टि करें।`;
  }
  return `You are an expert agricultural scientist and crop disease specialist. Analyze the crop image and provide in ${langName}:
1. **Disease Identification**: Name and type
2. **Symptoms**: Detailed description
3. **Causes**: Root cause
4. **Treatment**: Chemical and organic remedies
5. **Fertilizer Recommendations**: Name, price (₹), application method
6. **Prevention**: Steps to prevent future occurrence
If healthy, confirm and provide maintenance tips.
IMPORTANT: Respond entirely in ${langName}.`;
};

const getUserPrompt = (language: string, cropName: string, cropNameHindi: string) => {
  if (language === 'hi') {
    return `यह ${cropNameHindi || cropName} की तस्वीर है। कृपया इसका विश्लेषण करें।`;
  }
  const langName = languageNames[language] || 'English';
  return `This is an image of ${cropName}. Please analyze it. Respond in ${langName}.`;
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

    const { imageBase64, language } = parsed.data;
    const cropName = sanitize(parsed.data.cropName);
    const cropNameHindi = sanitize(parsed.data.cropNameHindi || '');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    console.log(`Analyzing crop: ${cropName} in language: ${language}`);

    const systemPrompt = getSystemPrompt(language, cropName, cropNameHindi);
    const userPrompt = getUserPrompt(language, cropName, cropNameHindi);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` } }
          ]}
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
    const analysis = data.choices[0].message.content;
    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ analysis }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error in analyze-crop function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
