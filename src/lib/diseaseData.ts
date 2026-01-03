import { Language } from './languages';
import { Crop } from './crops';

export interface Disease {
  id: string;
  name: string;
  nameHindi: string;
  symptoms: string[];
  symptomsHindi: string[];
  causes: string[];
  causesHindi: string[];
  treatments: string[];
  treatmentsHindi: string[];
  preventions: string[];
  preventionsHindi: string[];
  fertilizers: Fertilizer[];
}

export interface Fertilizer {
  name: string;
  nameHindi: string;
  dosage: string;
  dosageHindi: string;
  image: string;
  price: string;
}

export const diseases: Record<string, Disease[]> = {
  rice: [
    {
      id: 'rice_blast',
      name: 'Rice Blast Disease',
      nameHindi: 'धान का झुलसा रोग',
      symptoms: [
        'Spindle-shaped lesions on leaves',
        'Gray-green to white spots with brown margins',
        'Neck blast causing grain damage',
        'Nodes turning blackish brown'
      ],
      symptomsHindi: [
        'पत्तियों पर तकुआ-आकार के घाव',
        'भूरे किनारों वाले धूसर-हरे से सफेद धब्बे',
        'गर्दन झुलसा से दाने खराब',
        'गांठों का काला-भूरा होना'
      ],
      causes: [
        'Fungus Magnaporthe oryzae',
        'High nitrogen fertilization',
        'Continuous flooding',
        'Dense planting'
      ],
      causesHindi: [
        'मैग्नापोर्थ ऑर्यज़ी फफूंद',
        'अधिक नाइट्रोजन उर्वरक',
        'लगातार जलभराव',
        'घनी रोपाई'
      ],
      treatments: [
        'Apply Tricyclazole 75% WP @ 0.6g/L',
        'Spray Carbendazim 50% WP @ 1g/L',
        'Use Isoprothiolane 40% EC @ 1.5ml/L',
        'Drain water and let field dry for 2-3 days'
      ],
      treatmentsHindi: [
        'ट्राइसाइक्लाज़ोल 75% WP @ 0.6g/L लगाएं',
        'कार्बेन्डाज़िम 50% WP @ 1g/L छिड़काव करें',
        'आइसोप्रोथियोलेन 40% EC @ 1.5ml/L उपयोग करें',
        'पानी निकालें और 2-3 दिन खेत सूखने दें'
      ],
      preventions: [
        'Use resistant varieties like Pusa Basmati 1',
        'Avoid excessive nitrogen',
        'Maintain proper plant spacing',
        'Remove crop residues'
      ],
      preventionsHindi: [
        'पूसा बासमती 1 जैसी प्रतिरोधी किस्में उपयोग करें',
        'अधिक नाइट्रोजन से बचें',
        'उचित पौध दूरी रखें',
        'फसल अवशेष हटाएं'
      ],
      fertilizers: [
        {
          name: 'Tricyclazole 75% WP',
          nameHindi: 'ट्राइसाइक्लाज़ोल 75% WP',
          dosage: '0.6g per liter water',
          dosageHindi: '0.6 ग्राम प्रति लीटर पानी',
          image: '🧪',
          price: '₹280/100g'
        },
        {
          name: 'NPK 20:20:0',
          nameHindi: 'NPK 20:20:0',
          dosage: '40 kg per acre',
          dosageHindi: '40 किलो प्रति एकड़',
          image: '🌱',
          price: '₹450/bag'
        },
        {
          name: 'Zinc Sulphate',
          nameHindi: 'जिंक सल्फेट',
          dosage: '5 kg per acre',
          dosageHindi: '5 किलो प्रति एकड़',
          image: '⚗️',
          price: '₹120/kg'
        }
      ]
    }
  ],
  wheat: [
    {
      id: 'wheat_rust',
      name: 'Wheat Yellow Rust',
      nameHindi: 'गेहूं का पीला रतुआ',
      symptoms: [
        'Yellow-orange pustules in stripes on leaves',
        'Premature leaf drying',
        'Reduced grain filling',
        'Stunted growth in severe cases'
      ],
      symptomsHindi: [
        'पत्तियों पर पीले-नारंगी फफोले की धारियाँ',
        'समय से पहले पत्तियों का सूखना',
        'दाने भरने में कमी',
        'गंभीर मामलों में रुका हुआ विकास'
      ],
      causes: [
        'Fungus Puccinia striiformis',
        'Cool and humid conditions (10-15°C)',
        'Late sowing',
        'Susceptible varieties'
      ],
      causesHindi: [
        'पुक्सिनिया स्ट्राइफॉर्मिस फफूंद',
        'ठंडी और नम परिस्थितियाँ (10-15°C)',
        'देर से बुवाई',
        'संवेदनशील किस्में'
      ],
      treatments: [
        'Spray Propiconazole 25% EC @ 1ml/L',
        'Apply Tebuconazole 25.9% EC @ 1ml/L',
        'Use Mancozeb 75% WP @ 2.5g/L',
        'Repeat spray after 15 days if needed'
      ],
      treatmentsHindi: [
        'प्रोपिकोनाज़ोल 25% EC @ 1ml/L छिड़काव करें',
        'टेबुकोनाज़ोल 25.9% EC @ 1ml/L लगाएं',
        'मैन्कोज़ेब 75% WP @ 2.5g/L उपयोग करें',
        'जरूरत हो तो 15 दिन बाद दोहराएं'
      ],
      preventions: [
        'Grow resistant varieties like HD 2967',
        'Timely sowing in November',
        'Avoid dense sowing',
        'Scout fields regularly'
      ],
      preventionsHindi: [
        'HD 2967 जैसी प्रतिरोधी किस्में उगाएं',
        'नवंबर में समय पर बुवाई',
        'घनी बुवाई से बचें',
        'नियमित रूप से खेत की जांच करें'
      ],
      fertilizers: [
        {
          name: 'Propiconazole 25% EC',
          nameHindi: 'प्रोपिकोनाज़ोल 25% EC',
          dosage: '1ml per liter water',
          dosageHindi: '1ml प्रति लीटर पानी',
          image: '🧴',
          price: '₹350/250ml'
        },
        {
          name: 'DAP (18:46:0)',
          nameHindi: 'डीएपी (18:46:0)',
          dosage: '50 kg per acre at sowing',
          dosageHindi: 'बुवाई पर 50 किलो प्रति एकड़',
          image: '🌾',
          price: '₹1350/bag'
        }
      ]
    }
  ],
  tomato: [
    {
      id: 'tomato_blight',
      name: 'Early Blight',
      nameHindi: 'अगेती झुलसा रोग',
      symptoms: [
        'Brown-black target-like spots on leaves',
        'Yellowing around spots',
        'Lower leaves affected first',
        'Fruit with dark sunken spots'
      ],
      symptomsHindi: [
        'पत्तियों पर भूरे-काले निशान जैसे धब्बे',
        'धब्बों के चारों ओर पीलापन',
        'पहले नीचे की पत्तियाँ प्रभावित',
        'फलों पर काले धंसे हुए धब्बे'
      ],
      causes: [
        'Fungus Alternaria solani',
        'Warm humid weather (24-29°C)',
        'Overhead irrigation',
        'Poor air circulation'
      ],
      causesHindi: [
        'अल्टरनेरिया सोलानी फफूंद',
        'गर्म नम मौसम (24-29°C)',
        'ऊपर से सिंचाई',
        'खराब वायु संचार'
      ],
      treatments: [
        'Spray Mancozeb 75% WP @ 2.5g/L',
        'Apply Chlorothalonil 75% WP @ 2g/L',
        'Use Copper Oxychloride 50% WP @ 3g/L',
        'Remove and destroy infected leaves'
      ],
      treatmentsHindi: [
        'मैन्कोज़ेब 75% WP @ 2.5g/L छिड़काव करें',
        'क्लोरोथालोनिल 75% WP @ 2g/L लगाएं',
        'कॉपर ऑक्सीक्लोराइड 50% WP @ 3g/L उपयोग करें',
        'संक्रमित पत्तियों को हटाकर नष्ट करें'
      ],
      preventions: [
        'Rotate crops every 2-3 years',
        'Use drip irrigation',
        'Maintain plant spacing',
        'Mulch around plants'
      ],
      preventionsHindi: [
        'हर 2-3 साल में फसल चक्र अपनाएं',
        'ड्रिप सिंचाई का उपयोग करें',
        'पौध दूरी बनाए रखें',
        'पौधों के चारों ओर मल्चिंग करें'
      ],
      fertilizers: [
        {
          name: 'Mancozeb 75% WP',
          nameHindi: 'मैन्कोज़ेब 75% WP',
          dosage: '2.5g per liter water',
          dosageHindi: '2.5 ग्राम प्रति लीटर पानी',
          image: '🧪',
          price: '₹180/250g'
        },
        {
          name: 'NPK 19:19:19',
          nameHindi: 'NPK 19:19:19',
          dosage: '5g per liter for foliar spray',
          dosageHindi: 'फोलियर स्प्रे के लिए 5g प्रति लीटर',
          image: '🌱',
          price: '₹95/kg'
        },
        {
          name: 'Calcium Nitrate',
          nameHindi: 'कैल्शियम नाइट्रेट',
          dosage: '25 kg per acre',
          dosageHindi: '25 किलो प्रति एकड़',
          image: '⚗️',
          price: '₹850/25kg'
        }
      ]
    }
  ],
  cotton: [
    {
      id: 'cotton_bollworm',
      name: 'Cotton Bollworm',
      nameHindi: 'कपास की डोडा इल्ली',
      symptoms: [
        'Holes in bolls and squares',
        'Larvae inside bolls feeding',
        'Premature boll dropping',
        'Damaged and stained lint'
      ],
      symptomsHindi: [
        'डोडों और कलियों में छेद',
        'डोडों के अंदर लार्वा खाते हुए',
        'समय से पहले डोडे गिरना',
        'क्षतिग्रस्त और दागदार रूई'
      ],
      causes: [
        'Helicoverpa armigera moth',
        'Warm humid conditions',
        'Continuous cotton cultivation',
        'No natural predators'
      ],
      causesHindi: [
        'हेलिकोवरपा आर्मिजेरा कीट',
        'गर्म नम परिस्थितियाँ',
        'लगातार कपास की खेती',
        'प्राकृतिक शत्रुओं की कमी'
      ],
      treatments: [
        'Apply Emamectin Benzoate 5% SG @ 0.4g/L',
        'Spray Spinosad 45% SC @ 0.3ml/L',
        'Use Neem oil 5ml/L',
        'Install pheromone traps'
      ],
      treatmentsHindi: [
        'इमामेक्टिन बेंजोएट 5% SG @ 0.4g/L लगाएं',
        'स्पिनोसैड 45% SC @ 0.3ml/L छिड़काव करें',
        'नीम तेल 5ml/L उपयोग करें',
        'फेरोमोन ट्रैप लगाएं'
      ],
      preventions: [
        'Grow Bt cotton varieties',
        'Early sowing',
        'Inter-cropping with pigeon pea',
        'Destroy crop residues'
      ],
      preventionsHindi: [
        'बीटी कपास किस्में उगाएं',
        'जल्दी बुवाई करें',
        'अरहर के साथ मिश्रित फसल',
        'फसल अवशेष नष्ट करें'
      ],
      fertilizers: [
        {
          name: 'Emamectin Benzoate 5% SG',
          nameHindi: 'इमामेक्टिन बेंजोएट 5% SG',
          dosage: '0.4g per liter water',
          dosageHindi: '0.4 ग्राम प्रति लीटर पानी',
          image: '🧴',
          price: '₹180/100g'
        },
        {
          name: 'Neem Oil',
          nameHindi: 'नीम तेल',
          dosage: '5ml per liter water',
          dosageHindi: '5ml प्रति लीटर पानी',
          image: '🌿',
          price: '₹250/L'
        }
      ]
    }
  ]
};

export const getDefaultDisease = (cropId: string): Disease => {
  const cropDiseases = diseases[cropId];
  if (cropDiseases && cropDiseases.length > 0) {
    return cropDiseases[0];
  }
  
  // Default generic disease
  return {
    id: 'generic_leaf_spot',
    name: 'Leaf Spot Disease',
    nameHindi: 'पत्ती धब्बा रोग',
    symptoms: [
      'Brown spots on leaves',
      'Yellowing of foliage',
      'Wilting of leaves',
      'Stunted growth'
    ],
    symptomsHindi: [
      'पत्तियों पर भूरे धब्बे',
      'पत्तियों का पीला पड़ना',
      'पत्तियों का मुरझाना',
      'विकास रुकना'
    ],
    causes: [
      'Fungal infection',
      'High humidity',
      'Poor drainage',
      'Overcrowding'
    ],
    causesHindi: [
      'फफूंद संक्रमण',
      'अधिक नमी',
      'खराब जल निकासी',
      'भीड़भाड़'
    ],
    treatments: [
      'Remove affected leaves immediately',
      'Apply Copper Oxychloride 50% WP @ 3g/L',
      'Improve air circulation',
      'Reduce watering frequency'
    ],
    treatmentsHindi: [
      'प्रभावित पत्तियों को तुरंत हटाएं',
      'कॉपर ऑक्सीक्लोराइड 50% WP @ 3g/L लगाएं',
      'वायु संचार सुधारें',
      'पानी देने की आवृत्ति कम करें'
    ],
    preventions: [
      'Maintain proper spacing',
      'Water at soil level',
      'Remove crop debris',
      'Use disease-resistant varieties'
    ],
    preventionsHindi: [
      'उचित दूरी बनाए रखें',
      'मिट्टी स्तर पर पानी दें',
      'फसल मलबा हटाएं',
      'रोग प्रतिरोधी किस्में उपयोग करें'
    ],
    fertilizers: [
      {
        name: 'Copper Oxychloride 50% WP',
        nameHindi: 'कॉपर ऑक्सीक्लोराइड 50% WP',
        dosage: '3g per liter water',
        dosageHindi: '3 ग्राम प्रति लीटर पानी',
        image: '🧪',
        price: '₹150/250g'
      },
      {
        name: 'NPK 10:26:26',
        nameHindi: 'NPK 10:26:26',
        dosage: '50 kg per acre',
        dosageHindi: '50 किलो प्रति एकड़',
        image: '🌱',
        price: '₹600/bag'
      },
      {
        name: 'Urea',
        nameHindi: 'यूरिया',
        dosage: '25 kg per acre',
        dosageHindi: '25 किलो प्रति एकड़',
        image: '⚗️',
        price: '₹270/bag'
      },
      {
        name: 'Zinc Sulphate',
        nameHindi: 'जिंक सल्फेट',
        dosage: '5 kg per acre',
        dosageHindi: '5 किलो प्रति एकड़',
        image: '💊',
        price: '₹120/kg'
      }
    ]
  };
};

export const formatDiagnosis = (disease: Disease, crop: Crop, language: Language): string => {
  const isHindi = language.code === 'hi';
  const cropName = isHindi ? crop.nameHindi : crop.name;
  
  if (isHindi) {
    return `🔍 **${cropName} की समस्या का विश्लेषण**

मैंने आपकी तस्वीर का विश्लेषण किया है। यहाँ मेरे निष्कर्ष हैं:

**🦠 संभावित समस्या:** ${disease.nameHindi}

**📋 लक्षण पहचाने गए:**
${disease.symptomsHindi.map(s => `• ${s}`).join('\n')}

**⚠️ कारण:**
${disease.causesHindi.map(c => `• ${c}`).join('\n')}

**💊 उपचार के तरीके:**
${disease.treatmentsHindi.map((t, i) => `${i + 1}. ${t}`).join('\n')}

**🛡️ रोकथाम के उपाय:**
${disease.preventionsHindi.map(p => `• ${p}`).join('\n')}

**🌱 सुझाए गए उर्वरक और दवाइयाँ:**
${disease.fertilizers.map(f => `${f.image} **${f.nameHindi}** - ${f.dosageHindi} (${f.price})`).join('\n')}

क्या आप किसी उपचार के बारे में और जानकारी चाहते हैं? आप बोलकर भी पूछ सकते हैं!`;
  }

  return `🔍 **Analysis of ${cropName} Problem**

I've analyzed your image. Here are my findings:

**🦠 Likely Issue:** ${disease.name}

**📋 Symptoms Detected:**
${disease.symptoms.map(s => `• ${s}`).join('\n')}

**⚠️ Causes:**
${disease.causes.map(c => `• ${c}`).join('\n')}

**💊 Treatment Methods:**
${disease.treatments.map((t, i) => `${i + 1}. ${t}`).join('\n')}

**🛡️ Prevention Measures:**
${disease.preventions.map(p => `• ${p}`).join('\n')}

**🌱 Recommended Fertilizers & Pesticides:**
${disease.fertilizers.map(f => `${f.image} **${f.name}** - ${f.dosage} (${f.price})`).join('\n')}

Would you like more details about any treatment? You can also ask by voice!`;
};

export const getFollowUpResponse = (question: string, crop: Crop, language: Language): string => {
  const isHindi = language.code === 'hi';
  const cropName = isHindi ? crop.nameHindi : crop.name;
  const lowerQuestion = question.toLowerCase();
  
  // Check for fertilizer-related questions
  if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('उर्वरक') || lowerQuestion.includes('खाद')) {
    if (isHindi) {
      return `🌱 **${cropName} के लिए उर्वरक सिफारिश:**

**मुख्य उर्वरक:**
• **यूरिया (46% N)** - 50-60 किग्रा/एकड़
  💰 कीमत: ₹270/बैग (45 किग्रा)
  ⏰ समय: 2-3 बार बांटकर दें

• **DAP (18:46:0)** - 40-50 किग्रा/एकड़
  💰 कीमत: ₹1350/बैग
  ⏰ समय: बुवाई के समय

• **MOP (0:0:60)** - 25-30 किग्रा/एकड़
  💰 कीमत: ₹950/बैग
  ⏰ समय: बुवाई और फूल आने पर

**सूक्ष्म पोषक तत्व:**
⚗️ जिंक सल्फेट - 5 किग्रा/एकड़ (₹120/किग्रा)
⚗️ बोरॉन - 500 ग्राम/एकड़ (₹180/किग्रा)

क्या आप जानना चाहते हैं कि ये कहाँ मिलेंगे?`;
    }
    return `🌱 **Fertilizer Recommendations for ${cropName}:**

**Primary Fertilizers:**
• **Urea (46% N)** - 50-60 kg/acre
  💰 Price: ₹270/bag (45 kg)
  ⏰ Apply in 2-3 split doses

• **DAP (18:46:0)** - 40-50 kg/acre
  💰 Price: ₹1350/bag
  ⏰ Apply at sowing

• **MOP (0:0:60)** - 25-30 kg/acre
  💰 Price: ₹950/bag
  ⏰ Apply at sowing and flowering

**Micronutrients:**
⚗️ Zinc Sulphate - 5 kg/acre (₹120/kg)
⚗️ Boron - 500g/acre (₹180/kg)

Would you like to know where to buy these?`;
  }

  // Check for treatment/cure questions
  if (lowerQuestion.includes('treat') || lowerQuestion.includes('cure') || lowerQuestion.includes('उपचार') || lowerQuestion.includes('इलाज')) {
    if (isHindi) {
      return `💊 **${cropName} का विस्तृत उपचार:**

**तुरंत करें:**
1. 🌿 प्रभावित पत्तियों को हटाएं और जला दें
2. 💧 सिंचाई कम करें, खेत सूखने दें
3. 🧪 कॉपर ऑक्सीक्लोराइड (3g/L) का छिड़काव करें

**7 दिन बाद:**
4. 🧴 मैन्कोज़ेब 75% WP (2.5g/L) छिड़काव करें
5. 🌱 जड़ों में 10g ट्राइकोडर्मा/पौधा डालें

**15 दिन बाद:**
6. 🔄 प्रोपिकोनाज़ोल (1ml/L) का छिड़काव करें
7. ✅ पौधों की जांच करें

**सावधानी:**
⚠️ छिड़काव सुबह या शाम करें
⚠️ मास्क और दस्ताने पहनें
⚠️ दवाइयाँ बच्चों से दूर रखें

और कोई सवाल?`;
    }
    return `💊 **Detailed Treatment for ${cropName}:**

**Immediate Actions:**
1. 🌿 Remove affected leaves and burn them
2. 💧 Reduce irrigation, let field dry
3. 🧪 Spray Copper Oxychloride (3g/L)

**After 7 Days:**
4. 🧴 Spray Mancozeb 75% WP (2.5g/L)
5. 🌱 Apply Trichoderma 10g/plant at roots

**After 15 Days:**
6. 🔄 Spray Propiconazole (1ml/L)
7. ✅ Inspect plants for improvement

**Safety Precautions:**
⚠️ Spray in morning or evening
⚠️ Wear mask and gloves
⚠️ Keep chemicals away from children

Any other questions?`;
  }

  // Check for watering/irrigation questions
  if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigat') || lowerQuestion.includes('पानी') || lowerQuestion.includes('सिंचाई')) {
    if (isHindi) {
      return `💧 **${cropName} के लिए सिंचाई सुझाव:**

**सामान्य नियम:**
• सुबह जल्दी पानी दें (6-8 बजे)
• मिट्टी की ऊपरी 2-3 इंच सूखने पर पानी दें
• अधिक पानी से बचें - जड़ सड़न का खतरा

**बीमारी के दौरान:**
⚠️ पानी 50% कम करें
⚠️ ड्रिप सिंचाई बेहतर है
⚠️ पत्तियों पर पानी न डालें

**मौसम के अनुसार:**
☀️ गर्मी: हर 2-3 दिन
🌧️ बारिश: जरूरत के अनुसार
❄️ सर्दी: हर 5-7 दिन

और जानना है?`;
    }
    return `💧 **Irrigation Tips for ${cropName}:**

**General Guidelines:**
• Water early morning (6-8 AM)
• Water when top 2-3 inches of soil is dry
• Avoid overwatering - risk of root rot

**During Disease:**
⚠️ Reduce water by 50%
⚠️ Drip irrigation is better
⚠️ Avoid wetting leaves

**According to Season:**
☀️ Summer: Every 2-3 days
🌧️ Rainy: As needed
❄️ Winter: Every 5-7 days

Need more information?`;
  }

  // Default helpful response
  if (isHindi) {
    return `धन्यवाद आपके सवाल के लिए! 

**${cropName} की देखभाल के लिए सुझाव:**

🌱 नियमित खेत की जांच करें
💧 सही समय पर सिंचाई करें
🧪 संतुलित उर्वरक दें
🐛 कीट-रोग का जल्दी पता लगाएं

**मदद के लिए पूछें:**
• "उर्वरक कौन सा दूं?"
• "इलाज कैसे करें?"
• "पानी कब दूं?"
• "कीड़े कैसे भगाएं?"

आप बोलकर भी पूछ सकते हैं! 🎤`;
  }

  return `Thank you for your question!

**Tips for ${cropName} care:**

🌱 Regularly inspect your field
💧 Irrigate at the right time
🧪 Apply balanced fertilizers
🐛 Detect pests/diseases early

**Ask me about:**
• "Which fertilizer to use?"
• "How to treat the disease?"
• "When to water?"
• "How to control pests?"

You can also ask by voice! 🎤`;
};
