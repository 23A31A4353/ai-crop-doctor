import { useState, useRef, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Loader2, Leaf, Pill, Droplets } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { ChatMessage, Message } from './ChatMessage';

interface ChatInterfaceProps {
  language: Language;
  crop: Crop;
  imageData: string;
}

// Mock diagnosis response for demo
const getMockDiagnosis = (crop: Crop, language: Language): string => {
  const diagnoses = {
    hi: `🔍 **${crop.nameHindi} की समस्या का विश्लेषण**

मैंने आपकी तस्वीर का विश्लेषण किया है। यहाँ मेरे निष्कर्ष हैं:

**संभावित समस्या:** पत्ती धब्बा रोग (Leaf Spot Disease)

**लक्षण:**
• पत्तियों पर भूरे धब्बे
• पत्तियों का पीला पड़ना
• विकास में रुकावट

**उपचार के तरीके:**
1. 🌿 प्रभावित पत्तियों को हटाएं
2. 💧 सुबह के समय पानी दें
3. 🧪 कॉपर ऑक्सीक्लोराइड का छिड़काव करें

**सुझाए गए उर्वरक:**
• NPK (10:26:26) - 50 किग्रा/एकड़
• यूरिया - 25 किग्रा/एकड़
• जिंक सल्फेट - 5 किग्रा/एकड़

क्या आप अधिक जानकारी चाहते हैं?`,
    en: `🔍 **Analysis of ${crop.name} Problem**

I've analyzed your image. Here are my findings:

**Likely Issue:** Leaf Spot Disease

**Symptoms Detected:**
• Brown spots on leaves
• Yellowing of foliage
• Stunted growth patterns

**Recovery Methods:**
1. 🌿 Remove affected leaves immediately
2. 💧 Water in the morning to allow drying
3. 🧪 Apply Copper Oxychloride spray

**Recommended Fertilizers:**
• NPK (10:26:26) - 50 kg/acre
• Urea - 25 kg/acre
• Zinc Sulphate - 5 kg/acre

Would you like more detailed information on any of these treatments?`,
  };

  return language.code === 'hi' ? diagnoses.hi : diagnoses.en;
};

export const ChatInterface = ({ language, crop, imageData }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking, startListening, stopListening, isListening } = useSpeech({ 
    lang: language.speechCode 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial diagnosis when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        const diagnosis = getMockDiagnosis(crop, language);
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: diagnosis,
          timestamp: new Date(),
        };
        setMessages([assistantMessage]);
        setIsLoading(false);
      }, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, [crop, language]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        hi: `धन्यवाद आपके सवाल के लिए! ${crop.nameHindi} की देखभाल के लिए:

• नियमित सिंचाई करें
• जैविक खाद का उपयोग करें
• कीट नियंत्रण के लिए नीम का तेल उपयोग करें

क्या आपको और सहायता चाहिए?`,
        en: `Thank you for your question! For ${crop.name} care:

• Maintain regular irrigation
• Use organic fertilizers
• Apply neem oil for pest control

Do you need any further assistance?`,
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language.code === 'hi' ? responses.hi : responses.en,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInputText(text);
      });
    }
  };

  const texts = {
    placeholder: language.code === 'hi' ? 'अपना सवाल लिखें...' : 'Type your question...',
    analyzing: language.code === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...',
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 animate-slide-up">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 mb-4 flex items-center gap-4">
        <img
          src={imageData}
          alt="Uploaded crop"
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-2xl">{crop.icon}</span>
            {language.code === 'hi' ? crop.nameHindi : crop.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language.code === 'hi' ? 'AI फसल सहायक' : 'AI Crop Assistant'}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div className="p-2 rounded-lg bg-secondary/10">
            <Pill className="w-5 h-5 text-secondary" />
          </div>
          <div className="p-2 rounded-lg bg-accent/10">
            <Droplets className="w-5 h-5 text-accent" />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="glass-card rounded-2xl p-4 h-[400px] md:h-[500px] overflow-y-auto mb-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSpeak={speak}
            isSpeaking={isSpeaking}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
              🤖
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">{texts.analyzing}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-card rounded-2xl p-3 flex gap-3">
        <Button
          variant={isListening ? "destructive" : "secondary"}
          size="icon"
          onClick={handleVoiceInput}
          className={`flex-shrink-0 rounded-full ${!isListening ? 'bg-gradient-to-r from-secondary to-secondary/80 shadow-lg hover:scale-105 active:scale-95' : ''}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={texts.placeholder}
          className="flex-1 h-12 text-lg"
        />

        <Button
          variant="default"
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          className="flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-glow hover:-translate-y-1 active:translate-y-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
