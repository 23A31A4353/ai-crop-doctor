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
    const { imageBase64, cropName, diseaseName, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating disease progression video for crop: ${cropName}, disease: ${diseaseName}`);

    // Generate a time-lapse visualization prompt
    const prompt = language === 'hi' || language === 'te' || language === 'ta' || language === 'kn' || language === 'ml'
      ? `Create a 4-panel time-lapse visualization showing:
         Panel 1: Early stage of ${diseaseName} disease on ${cropName} crop - subtle symptoms
         Panel 2: Disease progression - more visible symptoms  
         Panel 3: Advanced stage - severe damage visible
         Panel 4: Recovery after treatment - healthy plant returning
         Style: Agricultural educational diagram, clear labels, realistic plant illustration`
      : `Create a 4-panel time-lapse visualization showing:
         Panel 1: Early stage of ${diseaseName} disease on ${cropName} crop - subtle symptoms
         Panel 2: Disease progression - more visible symptoms  
         Panel 3: Advanced stage - severe damage visible
         Panel 4: Recovery after treatment - healthy plant returning
         Style: Agricultural educational diagram, clear labels, realistic plant illustration`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const description = data.choices?.[0]?.message?.content || '';

    console.log('Disease progression visualization generated successfully');

    return new Response(JSON.stringify({ 
      imageUrl,
      description
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-disease-video function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
