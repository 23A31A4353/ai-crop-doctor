import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language code to language name mapping
const languageNames: Record<string, string> = {
  'hi': 'Hindi',
  'en': 'English',
  'ta': 'Tamil',
  'te': 'Telugu',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'bn': 'Bengali',
  'gu': 'Gujarati',
  'mr': 'Marathi',
  'pa': 'Punjabi',
  'or': 'Odia',
  'as': 'Assamese',
};

const getSystemPrompt = (language: string, cropName: string, cropNameHindi: string) => {
  const langName = languageNames[language] || 'English';
  
  if (language === 'hi') {
    return `आप एक विशेषज्ञ कृषि वैज्ञानिक और फसल रोग विशेषज्ञ हैं। आपको फसल की तस्वीर का विश्लेषण करना है और निम्नलिखित जानकारी हिंदी में देनी है:

1. **रोग की पहचान**: रोग का नाम और प्रकार
2. **लक्षण**: दिखाई देने वाले लक्षणों का विस्तृत विवरण
3. **कारण**: रोग के कारण (फफूंद, बैक्टीरिया, वायरस, कीट आदि)
4. **उपचार**: 
   - रासायनिक उपचार (दवाइयों के नाम और मात्रा)
   - जैविक/प्राकृतिक उपचार
5. **उर्वरक सिफारिश**: 
   - उर्वरक का नाम
   - अनुमानित कीमत (₹ में)
   - उपयोग की विधि
6. **रोकथाम**: भविष्य में रोग से बचाव के उपाय

यदि पत्ता स्वस्थ दिखता है, तो इसकी पुष्टि करें और स्वस्थ फसल बनाए रखने के लिए सुझाव दें।`;
  }
  
  return `You are an expert agricultural scientist and crop disease specialist. Analyze the crop image and provide the following information in ${langName} language:

1. **Disease Identification**: Name and type of disease detected
2. **Symptoms**: Detailed description of visible symptoms
3. **Causes**: Root cause of the disease (fungal, bacterial, viral, pest, etc.)
4. **Treatment**:
   - Chemical treatments (pesticide/fungicide names and dosage)
   - Organic/natural remedies
5. **Fertilizer Recommendations**:
   - Fertilizer name
   - Approximate price (in ₹)
   - Application method
6. **Prevention**: Steps to prevent future occurrence

If the leaf appears healthy, confirm this and provide tips for maintaining crop health.

IMPORTANT: Respond entirely in ${langName} language.`;
};

const getUserPrompt = (language: string, cropName: string, cropNameHindi: string) => {
  if (language === 'hi') {
    return `यह ${cropNameHindi || cropName} की तस्वीर है। कृपया इसका विश्लेषण करें और किसी भी रोग या समस्या की पहचान करें।`;
  }
  
  const langName = languageNames[language] || 'English';
  return `This is an image of ${cropName}. Please analyze it and identify any diseases or issues. Respond in ${langName}.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, cropName, cropNameHindi, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing crop: ${cropName} in language: ${language}`);

    const systemPrompt = getSystemPrompt(language, cropName, cropNameHindi);
    const userPrompt = getUserPrompt(language, cropName, cropNameHindi);

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
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                } 
              }
            ]
          }
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
    const analysis = data.choices[0].message.content;

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-crop function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
