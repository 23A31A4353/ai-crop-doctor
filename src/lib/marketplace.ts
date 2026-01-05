export interface Shop {
  id: string;
  name: string;
  nameHindi: string;
  type: 'fertilizer' | 'pesticide' | 'seeds' | 'equipment' | 'multi';
  rating: number;
  distance: string;
  distanceHindi: string;
  address: string;
  addressHindi: string;
  phone: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: 'fertilizer' | 'pesticide' | 'organic' | 'seeds';
  brand: string;
  price: number;
  unit: string;
  unitHindi: string;
  description: string;
  descriptionHindi: string;
  inStock: boolean;
  shopId: string;
  image: string;
}

export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Kisan Seva Kendra',
    nameHindi: 'किसान सेवा केंद्र',
    type: 'multi',
    rating: 4.5,
    distance: '1.2 km',
    distanceHindi: '1.2 किमी',
    address: 'Main Market, Near Bus Stand, Vijayawada',
    addressHindi: 'मुख्य बाजार, बस स्टैंड के पास, विजयवाड़ा',
    phone: '+91 98765 43210',
    isOpen: true,
    openTime: '8:00 AM',
    closeTime: '8:00 PM',
    latitude: 16.5062,
    longitude: 80.6480,
  },
  {
    id: 'shop-2',
    name: 'Krishi Inputs Store',
    nameHindi: 'कृषि इनपुट स्टोर',
    type: 'fertilizer',
    rating: 4.2,
    distance: '2.5 km',
    distanceHindi: '2.5 किमी',
    address: 'Agricultural Market Yard, Guntur',
    addressHindi: 'कृषि मंडी परिसर, गुंटूर',
    phone: '+91 98765 43211',
    isOpen: true,
    openTime: '7:00 AM',
    closeTime: '7:00 PM',
    latitude: 16.3067,
    longitude: 80.4365,
  },
  {
    id: 'shop-3',
    name: 'Organic Farm Solutions',
    nameHindi: 'जैविक खेती समाधान',
    type: 'pesticide',
    rating: 4.8,
    distance: '3.8 km',
    distanceHindi: '3.8 किमी',
    address: 'New Colony, Sector 5, Visakhapatnam',
    addressHindi: 'न्यू कॉलोनी, सेक्टर 5, विशाखापत्तनम',
    phone: '+91 98765 43212',
    isOpen: false,
    openTime: '9:00 AM',
    closeTime: '6:00 PM',
    latitude: 17.6868,
    longitude: 83.2185,
  },
  {
    id: 'shop-4',
    name: 'Seed Hub India',
    nameHindi: 'सीड हब इंडिया',
    type: 'seeds',
    rating: 4.6,
    distance: '4.2 km',
    distanceHindi: '4.2 किमी',
    address: 'Industrial Area, Phase 2, Tirupati',
    addressHindi: 'औद्योगिक क्षेत्र, फेज 2, तिरुपति',
    phone: '+91 98765 43213',
    isOpen: true,
    openTime: '8:30 AM',
    closeTime: '7:30 PM',
    latitude: 13.6288,
    longitude: 79.4192,
  },
  {
    id: 'shop-5',
    name: 'Farm Equipment Depot',
    nameHindi: 'फार्म उपकरण डिपो',
    type: 'equipment',
    rating: 4.3,
    distance: '5.0 km',
    distanceHindi: '5.0 किमी',
    address: 'Highway Road, Km 5, Kakinada',
    addressHindi: 'हाईवे रोड, किमी 5, काकीनाडा',
    phone: '+91 98765 43214',
    isOpen: true,
    openTime: '8:00 AM',
    closeTime: '8:00 PM',
    latitude: 16.9891,
    longitude: 82.2475,
  },
];

export const mockProducts: Product[] = [
  // Fertilizers
  {
    id: 'prod-1',
    name: 'NPK 10:26:26',
    nameHindi: 'एनपीके 10:26:26',
    category: 'fertilizer',
    brand: 'IFFCO',
    price: 1350,
    unit: '50 kg bag',
    unitHindi: '50 किग्रा बैग',
    description: 'Balanced fertilizer for all crops, excellent for root development',
    descriptionHindi: 'सभी फसलों के लिए संतुलित उर्वरक, जड़ विकास के लिए उत्कृष्ट',
    inStock: true,
    shopId: 'shop-1',
    image: '🌱',
  },
  {
    id: 'prod-2',
    name: 'Urea',
    nameHindi: 'यूरिया',
    category: 'fertilizer',
    brand: 'NFL',
    price: 266,
    unit: '45 kg bag',
    unitHindi: '45 किग्रा बैग',
    description: 'High nitrogen content for vegetative growth',
    descriptionHindi: 'वानस्पतिक वृद्धि के लिए उच्च नाइट्रोजन',
    inStock: true,
    shopId: 'shop-1',
    image: '🧪',
  },
  {
    id: 'prod-3',
    name: 'DAP',
    nameHindi: 'डीएपी',
    category: 'fertilizer',
    brand: 'Coromandel',
    price: 1350,
    unit: '50 kg bag',
    unitHindi: '50 किग्रा बैग',
    description: 'Diammonium phosphate for strong root system',
    descriptionHindi: 'मजबूत जड़ प्रणाली के लिए डाइअमोनियम फॉस्फेट',
    inStock: true,
    shopId: 'shop-2',
    image: '💊',
  },
  {
    id: 'prod-4',
    name: 'MOP (Muriate of Potash)',
    nameHindi: 'एमओपी (पोटाश)',
    category: 'fertilizer',
    brand: 'IPL',
    price: 850,
    unit: '50 kg bag',
    unitHindi: '50 किग्रा बैग',
    description: 'Potassium fertilizer for fruit quality and disease resistance',
    descriptionHindi: 'फल गुणवत्ता और रोग प्रतिरोध के लिए पोटाश',
    inStock: false,
    shopId: 'shop-2',
    image: '🧂',
  },
  // Pesticides
  {
    id: 'prod-5',
    name: 'Imidacloprid 17.8% SL',
    nameHindi: 'इमिडाक्लोप्रिड 17.8% SL',
    category: 'pesticide',
    brand: 'Bayer',
    price: 450,
    unit: '250 ml',
    unitHindi: '250 मिली',
    description: 'Systemic insecticide for sucking pests',
    descriptionHindi: 'रस चूसने वाले कीटों के लिए प्रणालीगत कीटनाशक',
    inStock: true,
    shopId: 'shop-1',
    image: '🔬',
  },
  {
    id: 'prod-6',
    name: 'Chlorpyriphos 20% EC',
    nameHindi: 'क्लोरपाइरीफॉस 20% EC',
    category: 'pesticide',
    brand: 'UPL',
    price: 380,
    unit: '1 liter',
    unitHindi: '1 लीटर',
    description: 'Broad spectrum insecticide for soil and foliar pests',
    descriptionHindi: 'मिट्टी और पत्ती कीटों के लिए व्यापक स्पेक्ट्रम कीटनाशक',
    inStock: true,
    shopId: 'shop-3',
    image: '💧',
  },
  {
    id: 'prod-7',
    name: 'Mancozeb 75% WP',
    nameHindi: 'मैंकोज़ेब 75% WP',
    category: 'pesticide',
    brand: 'Indofil',
    price: 520,
    unit: '1 kg',
    unitHindi: '1 किग्रा',
    description: 'Protective fungicide for blight and leaf spot diseases',
    descriptionHindi: 'झुलसा और पत्ती धब्बा रोगों के लिए सुरक्षात्मक फफूंदनाशक',
    inStock: true,
    shopId: 'shop-1',
    image: '🛡️',
  },
  // Organic
  {
    id: 'prod-8',
    name: 'Neem Oil',
    nameHindi: 'नीम का तेल',
    category: 'organic',
    brand: 'Khadi',
    price: 280,
    unit: '1 liter',
    unitHindi: '1 लीटर',
    description: 'Natural pesticide and fungicide for organic farming',
    descriptionHindi: 'जैविक खेती के लिए प्राकृतिक कीटनाशक और फफूंदनाशक',
    inStock: true,
    shopId: 'shop-3',
    image: '🌿',
  },
  {
    id: 'prod-9',
    name: 'Vermicompost',
    nameHindi: 'वर्मीकम्पोस्ट',
    category: 'organic',
    brand: 'Local',
    price: 10,
    unit: '1 kg',
    unitHindi: '1 किग्रा',
    description: 'Rich organic manure for soil health improvement',
    descriptionHindi: 'मिट्टी स्वास्थ्य सुधार के लिए समृद्ध जैविक खाद',
    inStock: true,
    shopId: 'shop-3',
    image: '🪱',
  },
  {
    id: 'prod-10',
    name: 'Trichoderma viride',
    nameHindi: 'ट्राइकोडर्मा विरिडी',
    category: 'organic',
    brand: 'IARI',
    price: 180,
    unit: '1 kg',
    unitHindi: '1 किग्रा',
    description: 'Biological fungicide for root rot and wilt control',
    descriptionHindi: 'जड़ सड़न और मुरझान नियंत्रण के लिए जैविक फफूंदनाशक',
    inStock: true,
    shopId: 'shop-3',
    image: '🧬',
  },
];

export const productCategories = [
  { id: 'all', name: 'All Products', nameHindi: 'सभी उत्पाद', icon: '🛒' },
  { id: 'fertilizer', name: 'Fertilizers', nameHindi: 'उर्वरक', icon: '🌱' },
  { id: 'pesticide', name: 'Pesticides', nameHindi: 'कीटनाशक', icon: '🔬' },
  { id: 'organic', name: 'Organic', nameHindi: 'जैविक', icon: '🌿' },
  { id: 'seeds', name: 'Seeds', nameHindi: 'बीज', icon: '🌾' },
];

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return mockProducts;
  return mockProducts.filter(p => p.category === category);
};

export const getShopById = (shopId: string): Shop | undefined => {
  return mockShops.find(s => s.id === shopId);
};

export const getRecommendedProducts = (cropId: string): Product[] => {
  // In a real app, this would return products based on crop diagnosis
  return mockProducts.slice(0, 4);
};
