import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, cropName, cropNameHindi, language, previousDiagnosis } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Chat query for crop: ${cropName}, message: ${message}`);

    const systemPrompt = language === 'hi'
      ? `आप एक विशेषज्ञ कृषि सलाहकार हैं जो ${cropNameHindi || cropName} की खेती में किसानों की मदद करते हैं। 

पिछला निदान: ${previousDiagnosis || 'कोई नहीं'}

किसान के सवालों का जवाब हिंदी में दें। जवाब में शामिल करें:
- स्पष्ट और व्यावहारिक सलाह
- उर्वरक/दवाइयों के नाम और कीमत (₹ में)
- कदम-दर-कदम निर्देश
- स्थानीय बाजार में उपलब्ध उत्पादों के नाम

संक्षिप्त लेकिन पूर्ण जवाब दें।`
      : `You are an expert agricultural advisor helping farmers with ${cropName} cultivation.

Previous diagnosis: ${previousDiagnosis || 'None'}

Answer the farmer's questions with:
- Clear and practical advice
- Specific fertilizer/pesticide names and prices (in ₹)
- Step-by-step instructions
- Names of products available in local markets

Keep responses concise but complete.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in crop-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
