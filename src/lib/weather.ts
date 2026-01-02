export interface WeatherData {
  location: string;
  locationHindi: string;
  temperature: number;
  humidity: number;
  condition: string;
  conditionHindi: string;
  icon: string;
  windSpeed: number;
  rainfall: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  dayHindi: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  conditionHindi: string;
  icon: string;
  rainChance: number;
}

export interface FarmingTip {
  id: string;
  condition: string;
  tip: string;
  tipHindi: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock weather data - in real app, this would come from a weather API
export const getMockWeatherData = (region: string = 'Delhi'): WeatherData => {
  const weatherConditions = [
    { condition: 'Sunny', conditionHindi: 'धूप', icon: '☀️' },
    { condition: 'Partly Cloudy', conditionHindi: 'आंशिक बादल', icon: '⛅' },
    { condition: 'Cloudy', conditionHindi: 'बादल', icon: '☁️' },
    { condition: 'Rainy', conditionHindi: 'बारिश', icon: '🌧️' },
    { condition: 'Thunderstorm', conditionHindi: 'आंधी-तूफान', icon: '⛈️' },
  ];
  
  const randomCondition = weatherConditions[Math.floor(Math.random() * 3)]; // Mostly good weather
  
  return {
    location: region,
    locationHindi: region === 'Delhi' ? 'दिल्ली' : region,
    temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    condition: randomCondition.condition,
    conditionHindi: randomCondition.conditionHindi,
    icon: randomCondition.icon,
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    rainfall: randomCondition.condition === 'Rainy' ? Math.floor(Math.random() * 50) + 10 : 0,
    forecast: generateForecast(),
  };
};

const generateForecast = (): ForecastDay[] => {
  const days = [
    { day: 'Mon', dayHindi: 'सोम' },
    { day: 'Tue', dayHindi: 'मंगल' },
    { day: 'Wed', dayHindi: 'बुध' },
    { day: 'Thu', dayHindi: 'गुरु' },
    { day: 'Fri', dayHindi: 'शुक्र' },
    { day: 'Sat', dayHindi: 'शनि' },
    { day: 'Sun', dayHindi: 'रवि' },
  ];
  
  const conditions = [
    { condition: 'Sunny', conditionHindi: 'धूप', icon: '☀️' },
    { condition: 'Partly Cloudy', conditionHindi: 'आंशिक बादल', icon: '⛅' },
    { condition: 'Rainy', conditionHindi: 'बारिश', icon: '🌧️' },
  ];
  
  const today = new Date().getDay();
  
  return Array.from({ length: 5 }, (_, i) => {
    const dayIndex = (today + i) % 7;
    const cond = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = 28 + Math.floor(Math.random() * 10);
    
    return {
      day: days[dayIndex].day,
      dayHindi: days[dayIndex].dayHindi,
      tempHigh: baseTemp + 5,
      tempLow: baseTemp - 3,
      condition: cond.condition,
      conditionHindi: cond.conditionHindi,
      icon: cond.icon,
      rainChance: cond.condition === 'Rainy' ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 20),
    };
  });
};

export const getFarmingTips = (weather: WeatherData, cropId: string): FarmingTip[] => {
  const tips: FarmingTip[] = [];
  
  // Temperature-based tips
  if (weather.temperature > 35) {
    tips.push({
      id: 'high-temp',
      condition: 'high_temperature',
      tip: 'High temperature detected. Water crops early morning or evening to prevent evaporation.',
      tipHindi: 'उच्च तापमान है। वाष्पीकरण रोकने के लिए सुबह जल्दी या शाम को पानी दें।',
      icon: '🌡️',
      priority: 'high',
    });
  }
  
  if (weather.temperature < 15) {
    tips.push({
      id: 'low-temp',
      condition: 'low_temperature',
      tip: 'Cold weather alert. Cover sensitive crops with mulch or plastic sheets.',
      tipHindi: 'ठंड का मौसम है। संवेदनशील फसलों को पलवार या प्लास्टिक शीट से ढकें।',
      icon: '❄️',
      priority: 'high',
    });
  }
  
  // Humidity-based tips
  if (weather.humidity > 70) {
    tips.push({
      id: 'high-humidity',
      condition: 'high_humidity',
      tip: 'High humidity increases fungal disease risk. Monitor for leaf spots and apply fungicide if needed.',
      tipHindi: 'उच्च नमी से फफूंद रोग का खतरा बढ़ता है। पत्ती धब्बों की निगरानी करें।',
      icon: '💨',
      priority: 'medium',
    });
  }
  
  // Rainfall-based tips
  if (weather.rainfall > 0 || weather.condition === 'Rainy') {
    tips.push({
      id: 'rainy',
      condition: 'rainfall',
      tip: 'Rain expected. Skip irrigation and ensure proper field drainage.',
      tipHindi: 'बारिश की संभावना है। सिंचाई न करें और खेत में जल निकासी सुनिश्चित करें।',
      icon: '🌧️',
      priority: 'high',
    });
    
    tips.push({
      id: 'rainy-pest',
      condition: 'rainfall_pest',
      tip: 'Post-rain pest activity increases. Scout fields after rain stops.',
      tipHindi: 'बारिश के बाद कीट गतिविधि बढ़ती है। बारिश रुकने के बाद खेत का निरीक्षण करें।',
      icon: '🐛',
      priority: 'medium',
    });
  }
  
  // Wind-based tips
  if (weather.windSpeed > 15) {
    tips.push({
      id: 'windy',
      condition: 'windy',
      tip: 'Strong winds today. Avoid spraying pesticides as they may drift.',
      tipHindi: 'तेज हवा है। कीटनाशक छिड़काव से बचें क्योंकि वे उड़ सकते हैं।',
      icon: '💨',
      priority: 'medium',
    });
  }
  
  // Default good weather tip
  if (tips.length === 0) {
    tips.push({
      id: 'good-weather',
      condition: 'favorable',
      tip: 'Favorable conditions for farming activities. Good day for spraying or transplanting.',
      tipHindi: 'खेती के लिए अनुकूल मौसम है। छिड़काव या रोपाई के लिए अच्छा दिन है।',
      icon: '✅',
      priority: 'low',
    });
  }
  
  return tips;
};

export const indianRegions = [
  { id: 'delhi', name: 'Delhi NCR', nameHindi: 'दिल्ली एनसीआर' },
  { id: 'punjab', name: 'Punjab', nameHindi: 'पंजाब' },
  { id: 'haryana', name: 'Haryana', nameHindi: 'हरियाणा' },
  { id: 'up', name: 'Uttar Pradesh', nameHindi: 'उत्तर प्रदेश' },
  { id: 'mp', name: 'Madhya Pradesh', nameHindi: 'मध्य प्रदेश' },
  { id: 'maharashtra', name: 'Maharashtra', nameHindi: 'महाराष्ट्र' },
  { id: 'karnataka', name: 'Karnataka', nameHindi: 'कर्नाटक' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', nameHindi: 'तमिलनाडु' },
  { id: 'andhra', name: 'Andhra Pradesh', nameHindi: 'आंध्र प्रदेश' },
  { id: 'telangana', name: 'Telangana', nameHindi: 'तेलंगाना' },
  { id: 'gujarat', name: 'Gujarat', nameHindi: 'गुजरात' },
  { id: 'rajasthan', name: 'Rajasthan', nameHindi: 'राजस्थान' },
  { id: 'bengal', name: 'West Bengal', nameHindi: 'पश्चिम बंगाल' },
  { id: 'bihar', name: 'Bihar', nameHindi: 'बिहार' },
  { id: 'odisha', name: 'Odisha', nameHindi: 'ओडिशा' },
];
