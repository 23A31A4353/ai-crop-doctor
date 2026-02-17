import { useState, useRef, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Loader2, Leaf, Pill, Droplets, Film } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { ChatMessage, Message } from './ChatMessage';
import { getTranslations } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  language: Language;
  crop: Crop;
  imageData: string;
}

export const ChatInterface = ({ language, crop, imageData }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');
  const [diagnosisSaved, setDiagnosisSaved] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [progressionImage, setProgressionImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking, startListening, stopListening, isListening } = useSpeech({ 
    lang: language.speechCode 
  });
  const { user } = useAuth();
  const t = getTranslations(language);

  const getLocalizedText = (en: string, hi: string) => {
    return language.code === 'hi' ? hi : en;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save diagnosis to history
  const saveDiagnosis = async (diagnosis: string) => {
    if (!user || diagnosisSaved) return;
    
    try {
      const { error } = await supabase
        .from('diagnosis_history')
        .insert({
          user_id: user.id,
          crop_id: crop.id,
          crop_name: getLocalizedText(crop.name, crop.nameHindi),
          image_url: imageData.startsWith('data:') ? null : imageData,
          diagnosis: diagnosis,
          language: language.code,
        });

      if (error) throw error;
      setDiagnosisSaved(true);
    } catch (error) {
      console.error('Error saving diagnosis:', error);
    }
  };

  // Generate disease progression visualization
  const generateDiseaseProgression = async () => {
    if (!currentDiagnosis) {
      toast.error(getLocalizedText(
        'Please wait for diagnosis to complete',
        'कृपया निदान पूरा होने की प्रतीक्षा करें'
      ));
      return;
    }

    setIsGeneratingVideo(true);
    toast.info(getLocalizedText(
      'Generating disease progression visualization...',
      'रोग प्रगति दृश्य बनाया जा रहा है...'
    ));

    try {
      const { data, error } = await supabase.functions.invoke('generate-disease-video', {
        body: {
          imageBase64: imageData,
          cropName: crop.name,
          diseaseName: 'detected disease',
          language: language.code
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setProgressionImage(data.imageUrl);
        
        const progressMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getLocalizedText(
            '🎬 Disease Progression Visualization\n\nThis 4-panel visualization shows:\n1. Early Stage - Initial symptoms\n2. Progression - Disease spreading\n3. Advanced Stage - Severe damage\n4. Recovery - After treatment\n\n' + (data.description || ''),
            '🎬 रोग प्रगति दृश्य\n\nयह 4-पैनल दृश्य दिखाता है:\n1. प्रारंभिक चरण - शुरुआती लक्षण\n2. प्रगति - रोग फैलना\n3. उन्नत चरण - गंभीर क्षति\n4. ठीक होना - उपचार के बाद\n\n' + (data.description || '')
          ),
          timestamp: new Date(),
          imageUrl: data.imageUrl,
        };
        setMessages(prev => [...prev, progressMessage]);
        
        toast.success(getLocalizedText(
          'Visualization generated!',
          'दृश्य बनाया गया!'
        ));
      }
    } catch (error: any) {
      console.error('Error generating visualization:', error);
      toast.error(getLocalizedText(
        'Failed to generate visualization',
        'दृश्य बनाने में विफल'
      ));
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Initial AI diagnosis when component mounts
  useEffect(() => {
    const analyzeCrop = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('analyze-crop', {
          body: {
            imageBase64: imageData,
            cropName: crop.name,
            cropNameHindi: crop.nameHindi,
            language: language.code
          }
        });

        if (error) throw error;

        if (data.error) {
          throw new Error(data.error);
        }

        const diagnosis = data.analysis;
        setCurrentDiagnosis(diagnosis);
        
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: diagnosis,
          timestamp: new Date(),
        };
        setMessages([assistantMessage]);
        
        // Save diagnosis for logged-in users
        await saveDiagnosis(diagnosis);
        
        // Auto-speak the completion message in selected language
        const completionMsg = getLocalizedText(
          `Analysis complete for ${crop.name}`,
          `${crop.nameHindi} का विश्लेषण पूरा हुआ`
        );
        speak(completionMsg);
        
      } catch (error: any) {
        console.error('Error analyzing crop:', error);
        
        const errorMsg = error?.message || '';
        const is402 = errorMsg.includes('402') || errorMsg.includes('credits');
        const is429 = errorMsg.includes('429') || errorMsg.includes('Rate limit');
        
        let userErrorText: string;
        if (is402) {
          userErrorText = getLocalizedText(
            '⚠️ AI credits are exhausted. Please add credits in Settings → Workspace → Usage to continue using crop analysis.',
            '⚠️ AI क्रेडिट समाप्त हो गए हैं। फसल विश्लेषण जारी रखने के लिए कृपया सेटिंग्स → वर्कस्पेस → उपयोग में क्रेडिट जोड़ें।'
          );
        } else if (is429) {
          userErrorText = getLocalizedText(
            '⏳ Too many requests. Please wait a moment and try again.',
            '⏳ बहुत सारे अनुरोध। कृपया कुछ समय प्रतीक्षा करें और पुनः प्रयास करें।'
          );
        } else {
          userErrorText = getLocalizedText(
            'Sorry, there was an issue analyzing the crop. Please try again.',
            'माफ़ करें, फसल का विश्लेषण करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          );
        }
        
        toast.error(is402 ? getLocalizedText('Credits exhausted', 'क्रेडिट समाप्त') : getLocalizedText('Analysis failed', 'विश्लेषण में त्रुटि'));
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: userErrorText,
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeCrop();
  }, [crop, language, imageData]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('crop-chat', {
        body: {
          message: userQuery,
          cropName: crop.name,
          cropNameHindi: crop.nameHindi,
          language: language.code,
          previousDiagnosis: currentDiagnosis
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error('Error getting response:', error);
      toast.error(getLocalizedText('Failed to get response', 'जवाब प्राप्त करने में त्रुटि'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getLocalizedText(
          'Sorry, there was an issue getting a response. Please try again.',
          'माफ़ करें, जवाब प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
        ),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            {getLocalizedText(crop.name, crop.nameHindi)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t.aiAssistant}
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

      {/* Disease Progression Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={generateDiseaseProgression}
          disabled={isGeneratingVideo || isLoading}
        >
          {isGeneratingVideo ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {getLocalizedText('Generating...', 'बनाया जा रहा है...')}
            </>
          ) : (
            <>
              <Film className="w-4 h-4 mr-2" />
              {getLocalizedText('View Disease Progression', 'रोग प्रगति देखें')}
            </>
          )}
        </Button>
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
                <span className="text-muted-foreground">{t.analyzing}</span>
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
          placeholder={t.typeQuestion}
          className="flex-1 h-12 text-lg"
          disabled={isLoading}
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
