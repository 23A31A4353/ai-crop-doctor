import { ArrowLeft, Home } from 'lucide-react';
import logoImg from '@/assets/ai_crop_doctor_logo.jpg';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { Language } from '@/lib/languages';

interface HeaderProps {
  currentStep: number;
  onBack: () => void;
  onHome: () => void;
  language?: Language;
  onViewHistory?: () => void;
}

export const Header = ({ currentStep, onBack, onHome, language, onViewHistory }: HeaderProps) => {
  return (
    <header className="w-full bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-foreground">
                AI CROP DOCTOR
              </h1>
              <p className="text-xs text-muted-foreground">फसल चिकित्सक</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button variant="ghost" size="icon" onClick={onHome}>
              <Home className="w-5 h-5" />
            </Button>
          )}
          <UserMenu language={language} onViewHistory={onViewHistory} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
    </header>
  );
};
