import { Language, indianLanguages } from '@/lib/languages';
import { Button } from '@/components/ui/button';
import { Globe, Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onSelectLanguage: (language: Language) => void;
}

export const LanguageSelector = ({ selectedLanguage, onSelectLanguage }: LanguageSelectorProps) => {
  const { speak, isSpeaking } = useSpeech();

  const handleSelectWithVoice = (language: Language) => {
    onSelectLanguage(language);
    speak(`${language.nativeName} selected`, language.speechCode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Select Your Language
        </h2>
        <p className="text-muted-foreground text-lg">
          अपनी भाषा चुनें • உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {indianLanguages.map((language) => (
          <Button
            key={language.code}
            variant="outline"
            className={`h-auto py-4 flex-col gap-2 bg-card border-2 border-border hover:border-primary hover:bg-primary/5 shadow-sm ${
              selectedLanguage?.code === language.code 
                ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                : ''
            }`}
            onClick={() => handleSelectWithVoice(language)}
          >
            <span className="text-xl font-bold">{language.nativeName}</span>
            <span className="text-sm text-muted-foreground">{language.name}</span>
            {selectedLanguage?.code === language.code && (
              <Volume2 className={`w-4 h-4 mt-1 text-primary ${isSpeaking ? 'animate-pulse' : ''}`} />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
