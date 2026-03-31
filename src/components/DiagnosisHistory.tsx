import { useState, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { History, Trash2, ChevronDown, ChevronUp, Loader2, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/translations';
import { cacheDiagnosisHistory, getCachedDiagnosisHistory, isOnline } from '@/lib/offlineStorage';

interface DiagnosisRecord {
  id: string;
  crop_id: string;
  crop_name: string;
  image_url: string | null;
  diagnosis: string;
  language: string;
  created_at: string;
}

interface DiagnosisHistoryProps {
  language: Language;
  onSelectDiagnosis?: (diagnosis: DiagnosisRecord) => void;
}

// Translations for all supported languages
const getHistoryTranslations = (langCode: string) => {
  const translations: Record<string, { title: string; noHistory: string; delete: string; loading: string }> = {
    hi: { title: 'पिछली जाँच', noHistory: 'कोई पिछली जाँच नहीं', delete: 'हटाएं', loading: 'लोड हो रहा है...' },
    en: { title: 'Diagnosis History', noHistory: 'No previous diagnoses', delete: 'Delete', loading: 'Loading...' },
    ta: { title: 'முந்தைய ஆய்வுகள்', noHistory: 'முந்தைய ஆய்வுகள் இல்லை', delete: 'நீக்கு', loading: 'ஏற்றுகிறது...' },
    te: { title: 'మునుపటి పరీక్షలు', noHistory: 'మునుపటి పరీక్షలు లేవు', delete: 'తొలగించు', loading: 'లోడ్ అవుతోంది...' },
    kn: { title: 'ಹಿಂದಿನ ಪರೀಕ್ಷೆಗಳು', noHistory: 'ಹಿಂದಿನ ಪರೀಕ್ಷೆಗಳಿಲ್ಲ', delete: 'ಅಳಿಸಿ', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' },
    ml: { title: 'മുൻ പരിശോധനകൾ', noHistory: 'മുൻ പരിശോധനകൾ ഇല്ല', delete: 'ഇല്ലാതാക്കുക', loading: 'ലോഡ് ചെയ്യുന്നു...' },
    bn: { title: 'আগের পরীক্ষা', noHistory: 'কোন আগের পরীক্ষা নেই', delete: 'মুছুন', loading: 'লোড হচ্ছে...' },
    gu: { title: 'અગાઉની તપાસ', noHistory: 'કોઈ અગાઉની તપાસ નથી', delete: 'કાઢી નાખો', loading: 'લોડ થઈ રહ્યું છે...' },
    mr: { title: 'मागील तपासण्या', noHistory: 'मागील तपासण्या नाहीत', delete: 'हटवा', loading: 'लोड होत आहे...' },
    pa: { title: 'ਪਿਛਲੀਆਂ ਜਾਂਚਾਂ', noHistory: 'ਕੋਈ ਪਿਛਲੀਆਂ ਜਾਂਚਾਂ ਨਹੀਂ', delete: 'ਮਿਟਾਓ', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...' },
    or: { title: 'ପୂର୍ବ ପରୀକ୍ଷା', noHistory: 'କୌଣସି ପୂର୍ବ ପରୀକ୍ଷା ନାହିଁ', delete: 'ବିଲୋପ କରନ୍ତୁ', loading: 'ଲୋଡ୍ ହେଉଛି...' },
    as: { title: 'পূৰ্বৰ পৰীক্ষা', noHistory: 'কোনো পূৰ্বৰ পৰীক্ষা নাই', delete: 'মচি পেলাওক', loading: 'লোড হৈ আছে...' },
  };
  return translations[langCode] || translations['en'];
};

export const DiagnosisHistory = ({ language, onSelectDiagnosis }: DiagnosisHistoryProps) => {
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const texts = getHistoryTranslations(language.code);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diagnosis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diagnosis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success(texts.delete);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(texts.delete);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language.code === 'hi' ? 'hi-IN' : 
                   language.code === 'ta' ? 'ta-IN' :
                   language.code === 'te' ? 'te-IN' :
                   language.code === 'kn' ? 'kn-IN' :
                   language.code === 'ml' ? 'ml-IN' :
                   language.code === 'bn' ? 'bn-IN' :
                   language.code === 'gu' ? 'gu-IN' :
                   language.code === 'mr' ? 'mr-IN' :
                   language.code === 'pa' ? 'pa-IN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="glass-card rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">{texts.title}</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{texts.loading}</span>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {texts.noHistory}
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="border border-border rounded-xl overflow-hidden bg-card/50"
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/5"
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  {record.image_url && (
                    <img
                      src={record.image_url}
                      alt={record.crop_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{record.crop_name}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(record.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedId === record.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedId === record.id && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <div className="prose prose-sm max-w-none text-foreground">
                      <div className="whitespace-pre-wrap text-sm">
                        {record.diagnosis.slice(0, 500)}
                        {record.diagnosis.length > 500 && '...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
