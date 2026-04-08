import wheatImg from '@/assets/crops/wheat.png';
import pearlMilletImg from '@/assets/crops/pearl-millet.png';
import sorghumImg from '@/assets/crops/sorghum.png';
import chickpeaImg from '@/assets/crops/chickpea.png';
import pigeonPeaImg from '@/assets/crops/pigeon-pea.png';
import lentilImg from '@/assets/crops/lentil.png';
import mungBeanImg from '@/assets/crops/mung-bean.png';
import blackGramImg from '@/assets/crops/black-gram.png';
import soybeanImg from '@/assets/crops/soybean.png';
import mustardImg from '@/assets/crops/mustard.png';
import sunflowerImg from '@/assets/crops/sunflower.png';

export interface Crop {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  image?: string;
  category: 'cereals' | 'pulses' | 'vegetables' | 'fruits' | 'oilseeds' | 'spices' | 'cash';
}

export const indianCrops: Crop[] = [
  // Cereals
  { id: 'rice', name: 'Rice', nameHindi: 'चावल', icon: '🌾', category: 'cereals' },
  { id: 'wheat', name: 'Wheat', nameHindi: 'गेहूं', icon: '🌾', image: wheatImg, category: 'cereals' },
  { id: 'maize', name: 'Maize', nameHindi: 'मक्का', icon: '🌽', category: 'cereals' },
  { id: 'bajra', name: 'Pearl Millet', nameHindi: 'बाजरा', icon: '🌾', image: pearlMilletImg, category: 'cereals' },
  { id: 'jowar', name: 'Sorghum', nameHindi: 'ज्वार', icon: '🌾', image: sorghumImg, category: 'cereals' },
  
  // Pulses
  { id: 'chickpea', name: 'Chickpea', nameHindi: 'चना', icon: '🫘', image: chickpeaImg, category: 'pulses' },
  { id: 'pigeon-pea', name: 'Pigeon Pea', nameHindi: 'अरहर', icon: '🫘', image: pigeonPeaImg, category: 'pulses' },
  { id: 'lentil', name: 'Lentil', nameHindi: 'मसूर', icon: '🫘', image: lentilImg, category: 'pulses' },
  { id: 'mung', name: 'Mung Bean', nameHindi: 'मूंग', icon: '🫘', image: mungBeanImg, category: 'pulses' },
  { id: 'urad', name: 'Black Gram', nameHindi: 'उड़द', icon: '🫘', image: blackGramImg, category: 'pulses' },
  
  // Vegetables
  { id: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', icon: '🍅', category: 'vegetables' },
  { id: 'potato', name: 'Potato', nameHindi: 'आलू', icon: '🥔', category: 'vegetables' },
  { id: 'onion', name: 'Onion', nameHindi: 'प्याज', icon: '🧅', category: 'vegetables' },
  { id: 'brinjal', name: 'Brinjal', nameHindi: 'बैंगन', icon: '🍆', category: 'vegetables' },
  { id: 'okra', name: 'Okra', nameHindi: 'भिंडी', icon: '🥒', category: 'vegetables' },
  { id: 'cabbage', name: 'Cabbage', nameHindi: 'पत्तागोभी', icon: '🥬', category: 'vegetables' },
  { id: 'cauliflower', name: 'Cauliflower', nameHindi: 'फूलगोभी', icon: '🥦', category: 'vegetables' },
  { id: 'chili', name: 'Chili', nameHindi: 'मिर्च', icon: '🌶️', category: 'vegetables' },
  
  // Fruits
  { id: 'mango', name: 'Mango', nameHindi: 'आम', icon: '🥭', category: 'fruits' },
  { id: 'banana', name: 'Banana', nameHindi: 'केला', icon: '🍌', category: 'fruits' },
  { id: 'orange', name: 'Orange', nameHindi: 'संतरा', icon: '🍊', category: 'fruits' },
  { id: 'papaya', name: 'Papaya', nameHindi: 'पपीता', icon: '🍈', category: 'fruits' },
  { id: 'grapes', name: 'Grapes', nameHindi: 'अंगूर', icon: '🍇', category: 'fruits' },
  { id: 'apple', name: 'Apple', nameHindi: 'सेब', icon: '🍎', category: 'fruits' },
  
  // Oilseeds
  { id: 'groundnut', name: 'Groundnut', nameHindi: 'मूंगफली', icon: '🥜', category: 'oilseeds' },
  { id: 'mustard', name: 'Mustard', nameHindi: 'सरसों', icon: '🌻', image: mustardImg, category: 'oilseeds' },
  { id: 'sunflower', name: 'Sunflower', nameHindi: 'सूरजमुखी', icon: '🌻', image: sunflowerImg, category: 'oilseeds' },
  { id: 'soybean', name: 'Soybean', nameHindi: 'सोयाबीन', icon: '🫘', image: soybeanImg, category: 'oilseeds' },
  
  // Cash Crops
  { id: 'cotton', name: 'Cotton', nameHindi: 'कपास', icon: '🌿', category: 'cash' },
  { id: 'sugarcane', name: 'Sugarcane', nameHindi: 'गन्ना', icon: '🎋', category: 'cash' },
  { id: 'tea', name: 'Tea', nameHindi: 'चाय', icon: '🍃', category: 'cash' },
  { id: 'coffee', name: 'Coffee', nameHindi: 'कॉफ़ी', icon: '☕', category: 'cash' },
  
  // Spices
  { id: 'turmeric', name: 'Turmeric', nameHindi: 'हल्दी', icon: '🧡', category: 'spices' },
  { id: 'ginger', name: 'Ginger', nameHindi: 'अदरक', icon: '🫚', category: 'spices' },
  { id: 'garlic', name: 'Garlic', nameHindi: 'लहसुन', icon: '🧄', category: 'spices' },
  { id: 'cardamom', name: 'Cardamom', nameHindi: 'इलायची', icon: '🌿', category: 'spices' },
];

export const cropCategories = [
  { id: 'cereals', name: 'Cereals', nameHindi: 'अनाज' },
  { id: 'pulses', name: 'Pulses', nameHindi: 'दालें' },
  { id: 'vegetables', name: 'Vegetables', nameHindi: 'सब्जियां' },
  { id: 'fruits', name: 'Fruits', nameHindi: 'फल' },
  { id: 'oilseeds', name: 'Oilseeds', nameHindi: 'तिलहन' },
  { id: 'cash', name: 'Cash Crops', nameHindi: 'नकदी फसलें' },
  { id: 'spices', name: 'Spices', nameHindi: 'मसाले' },
];
