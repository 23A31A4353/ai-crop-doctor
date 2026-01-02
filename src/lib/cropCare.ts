import { Crop } from './crops';

export interface CareTask {
  id: string;
  type: 'watering' | 'fertilizing' | 'pestControl';
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  frequency: string;
  frequencyHindi: string;
  icon: string;
}

export interface CropCareSchedule {
  cropId: string;
  tasks: CareTask[];
}

export const careTasks: Record<string, CareTask[]> = {
  rice: [
    { id: 'rice-water-1', type: 'watering', title: 'Flood Irrigation', titleHindi: 'बाढ़ सिंचाई', description: 'Maintain 2-5cm water level in field', descriptionHindi: 'खेत में 2-5 सेमी पानी का स्तर बनाए रखें', frequency: 'Daily', frequencyHindi: 'रोज़ाना', icon: '💧' },
    { id: 'rice-fert-1', type: 'fertilizing', title: 'NPK Application', titleHindi: 'NPK उपयोग', description: 'Apply NPK 10:26:26 at 50kg/acre', descriptionHindi: 'NPK 10:26:26 50 किग्रा/एकड़ डालें', frequency: 'Every 3 weeks', frequencyHindi: 'हर 3 सप्ताह', icon: '🌱' },
    { id: 'rice-pest-1', type: 'pestControl', title: 'Stem Borer Control', titleHindi: 'तना छेदक नियंत्रण', description: 'Apply Chlorpyriphos spray if infestation found', descriptionHindi: 'संक्रमण पाए जाने पर क्लोरपाइरीफॉस स्प्रे करें', frequency: 'As needed', frequencyHindi: 'आवश्यकतानुसार', icon: '🐛' },
  ],
  wheat: [
    { id: 'wheat-water-1', type: 'watering', title: 'Crown Root Irrigation', titleHindi: 'मुकुट जड़ सिंचाई', description: 'First irrigation 20-25 days after sowing', descriptionHindi: 'बुवाई के 20-25 दिन बाद पहली सिंचाई', frequency: '5-6 times per crop', frequencyHindi: '5-6 बार प्रति फसल', icon: '💧' },
    { id: 'wheat-fert-1', type: 'fertilizing', title: 'Urea Top Dressing', titleHindi: 'यूरिया टॉप ड्रेसिंग', description: 'Apply 25kg Urea per acre after first irrigation', descriptionHindi: 'पहली सिंचाई के बाद 25 किग्रा यूरिया प्रति एकड़', frequency: 'After each irrigation', frequencyHindi: 'प्रत्येक सिंचाई के बाद', icon: '🌱' },
    { id: 'wheat-pest-1', type: 'pestControl', title: 'Aphid Control', titleHindi: 'माहू नियंत्रण', description: 'Spray Imidacloprid for aphid control', descriptionHindi: 'माहू नियंत्रण के लिए इमिडाक्लोप्रिड स्प्रे करें', frequency: 'When observed', frequencyHindi: 'जब दिखाई दे', icon: '🐛' },
  ],
  tomato: [
    { id: 'tomato-water-1', type: 'watering', title: 'Drip Irrigation', titleHindi: 'ड्रिप सिंचाई', description: 'Water at root level, avoid wetting leaves', descriptionHindi: 'जड़ स्तर पर पानी दें, पत्तियों को गीला न करें', frequency: 'Every 2-3 days', frequencyHindi: 'हर 2-3 दिन', icon: '💧' },
    { id: 'tomato-fert-1', type: 'fertilizing', title: 'Calcium Spray', titleHindi: 'कैल्शियम स्प्रे', description: 'Foliar spray of Calcium Nitrate to prevent blossom end rot', descriptionHindi: 'फूल सड़न रोकने के लिए कैल्शियम नाइट्रेट का छिड़काव', frequency: 'Weekly', frequencyHindi: 'साप्ताहिक', icon: '🌱' },
    { id: 'tomato-pest-1', type: 'pestControl', title: 'Fruit Borer Control', titleHindi: 'फल छेदक नियंत्रण', description: 'Install pheromone traps and spray Neem oil', descriptionHindi: 'फेरोमोन जाल लगाएं और नीम तेल का छिड़काव करें', frequency: 'Every 10 days', frequencyHindi: 'हर 10 दिन', icon: '🐛' },
  ],
  potato: [
    { id: 'potato-water-1', type: 'watering', title: 'Ridge Irrigation', titleHindi: 'मेड़ सिंचाई', description: 'Irrigate in furrows, do not wet tubers', descriptionHindi: 'नालियों में सिंचाई करें, कंदों को गीला न करें', frequency: 'Every 10-12 days', frequencyHindi: 'हर 10-12 दिन', icon: '💧' },
    { id: 'potato-fert-1', type: 'fertilizing', title: 'Potash Application', titleHindi: 'पोटाश उपयोग', description: 'Apply MOP at 50kg/acre for better tuber formation', descriptionHindi: 'बेहतर कंद बनाने के लिए 50 किग्रा/एकड़ MOP डालें', frequency: 'At earthing up', frequencyHindi: 'मिट्टी चढ़ाते समय', icon: '🌱' },
    { id: 'potato-pest-1', type: 'pestControl', title: 'Late Blight Control', titleHindi: 'पछेता झुलसा नियंत्रण', description: 'Spray Mancozeb preventively in humid conditions', descriptionHindi: 'नम मौसम में मैंकोज़ेब का निवारक छिड़काव करें', frequency: 'Every 7 days in rainy season', frequencyHindi: 'बारिश में हर 7 दिन', icon: '🐛' },
  ],
  cotton: [
    { id: 'cotton-water-1', type: 'watering', title: 'Critical Stage Irrigation', titleHindi: 'महत्वपूर्ण चरण सिंचाई', description: 'Irrigate at flowering and boll formation stages', descriptionHindi: 'फूल आने और बॉल बनने के समय सिंचाई करें', frequency: 'Every 15-20 days', frequencyHindi: 'हर 15-20 दिन', icon: '💧' },
    { id: 'cotton-fert-1', type: 'fertilizing', title: 'Nitrogen Split Application', titleHindi: 'नाइट्रोजन विभाजित उपयोग', description: 'Apply Urea in 3 splits during crop growth', descriptionHindi: 'फसल वृद्धि के दौरान 3 भागों में यूरिया डालें', frequency: 'At 30, 60, 90 days', frequencyHindi: '30, 60, 90 दिनों पर', icon: '🌱' },
    { id: 'cotton-pest-1', type: 'pestControl', title: 'Bollworm Management', titleHindi: 'बॉलवर्म प्रबंधन', description: 'Use Bt spray or install light traps', descriptionHindi: 'Bt स्प्रे का उपयोग करें या लाइट ट्रैप लगाएं', frequency: 'Monitor weekly', frequencyHindi: 'साप्ताहिक निगरानी', icon: '🐛' },
  ],
  sugarcane: [
    { id: 'sugarcane-water-1', type: 'watering', title: 'Furrow Irrigation', titleHindi: 'नाली सिंचाई', description: 'Maintain adequate moisture during grand growth phase', descriptionHindi: 'बड़ी वृद्धि अवधि में पर्याप्त नमी बनाए रखें', frequency: 'Every 7-10 days', frequencyHindi: 'हर 7-10 दिन', icon: '💧' },
    { id: 'sugarcane-fert-1', type: 'fertilizing', title: 'Trash Mulching', titleHindi: 'पराली पलवार', description: 'Apply organic matter from sugarcane trash', descriptionHindi: 'गन्ने की पराली से जैविक पदार्थ डालें', frequency: 'After harvest', frequencyHindi: 'कटाई के बाद', icon: '🌱' },
    { id: 'sugarcane-pest-1', type: 'pestControl', title: 'Borer Control', titleHindi: 'छेदक नियंत्रण', description: 'Release Trichogramma parasites for biological control', descriptionHindi: 'जैविक नियंत्रण के लिए ट्राइकोग्रामा परजीवी छोड़ें', frequency: 'Every 15 days', frequencyHindi: 'हर 15 दिन', icon: '🐛' },
  ],
};

// Default care tasks for crops not specifically defined
export const defaultCareTasks: CareTask[] = [
  { id: 'default-water', type: 'watering', title: 'Regular Watering', titleHindi: 'नियमित सिंचाई', description: 'Maintain consistent soil moisture', descriptionHindi: 'मिट्टी में लगातार नमी बनाए रखें', frequency: 'As per soil condition', frequencyHindi: 'मिट्टी की स्थिति अनुसार', icon: '💧' },
  { id: 'default-fert', type: 'fertilizing', title: 'Balanced Fertilization', titleHindi: 'संतुलित उर्वरक', description: 'Apply NPK as per crop requirement', descriptionHindi: 'फसल की आवश्यकता अनुसार NPK डालें', frequency: 'Every 3-4 weeks', frequencyHindi: 'हर 3-4 सप्ताह', icon: '🌱' },
  { id: 'default-pest', type: 'pestControl', title: 'Pest Monitoring', titleHindi: 'कीट निगरानी', description: 'Regular field scouting for pests', descriptionHindi: 'कीटों के लिए नियमित खेत निरीक्षण', frequency: 'Weekly', frequencyHindi: 'साप्ताहिक', icon: '🐛' },
];

export const getCropCareTasks = (cropId: string): CareTask[] => {
  return careTasks[cropId] || defaultCareTasks;
};
