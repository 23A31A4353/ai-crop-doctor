import { Leaf, Mic, Camera, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const features = [
    {
      icon: Mic,
      title: 'Voice Support',
      titleHi: 'आवाज़ सहायता',
      description: 'Speak in your language',
    },
    {
      icon: Camera,
      title: 'Image Analysis',
      titleHi: 'तस्वीर विश्लेषण',
      description: 'Upload crop photos',
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot',
      titleHi: 'AI चैटबॉट',
      description: 'Get instant solutions',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/80 mb-6 shadow-glow floating-icon">
          <Leaf className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Crop Doctor
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          फसल चिकित्सक
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          AI-powered crop disease diagnosis & treatment recommendations for Indian farmers
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="glass-card rounded-2xl p-6 text-center animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <feature.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
            <p className="text-sm text-accent font-medium mb-2">{feature.titleHi}</p>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant="default"
        size="lg"
        onClick={onStart}
        className="animate-slide-up gap-3 h-16 px-10 text-xl rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-glow hover:-translate-y-1 active:translate-y-0"
        style={{ animationDelay: '300ms' }}
      >
        <span>Get Started</span>
        <span className="text-primary-foreground/80">•</span>
        <span>शुरू करें</span>
      </Button>

      {/* Language indicator */}
      <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '500ms' }}>
        Available in 12+ Indian languages
      </p>
    </div>
  );
};
