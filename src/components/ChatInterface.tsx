import { useState, useRef, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Loader2, Leaf, Pill, Droplets, Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { ChatMessage, Message } from './ChatMessage';
import { getTranslations } from '@/lib/translations';
import { getDefaultDisease, formatDiagnosis, getFollowUpResponse } from '@/lib/diseaseData';

interface ChatInterfaceProps {
  language: Language;
  crop: Crop;
  imageData: string;
}

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

  const t = getTranslations(language);

  // Initial diagnosis when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        const disease = getDefaultDisease(crop.id);
        const diagnosis = formatDiagnosis(disease, crop, language);
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: diagnosis,
          timestamp: new Date(),
        };
        setMessages([assistantMessage]);
        setIsLoading(false);
        // Auto-speak the diagnosis
        speak(language.code === 'hi' ? `${crop.nameHindi} का विश्लेषण पूरा हुआ` : `Analysis complete for ${crop.name}`);
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

    // Generate contextual AI response
    setTimeout(() => {
      const response = getFollowUpResponse(inputText, crop, language);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
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

  const handleSpeakResponse = (text: string) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/[#•🔍🦠📋⚠️💊🛡️🌱⚗️💰⏰]/g, '').replace(/\n+/g, '. ');
    speak(cleanText);
  };

  const texts = {
    placeholder: t.typeQuestion,
    analyzing: t.analyzing,
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
