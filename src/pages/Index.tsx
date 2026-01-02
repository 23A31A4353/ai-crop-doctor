import { useState } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Header } from '@/components/Header';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CropSelector } from '@/components/CropSelector';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { CropCareCalendar } from '@/components/CropCareCalendar';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Marketplace } from '@/components/Marketplace';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Cloud, Store } from 'lucide-react';

type AppStep = 'welcome' | 'language' | 'crop' | 'image' | 'chat';
type DashboardTab = 'chat' | 'calendar' | 'weather' | 'marketplace';

const ChatDashboard = ({ language, crop, imageData }: { language: Language; crop: Crop; imageData: string }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('chat');
  const isHindi = language.code === 'hi';

  const tabs = [
    { id: 'chat' as const, icon: MessageSquare, label: isHindi ? 'चैट' : 'Chat' },
    { id: 'calendar' as const, icon: Calendar, label: isHindi ? 'कैलेंडर' : 'Calendar' },
    { id: 'weather' as const, icon: Cloud, label: isHindi ? 'मौसम' : 'Weather' },
    { id: 'marketplace' as const, icon: Store, label: isHindi ? 'बाज़ार' : 'Shop' },
  ];

  return (
    <div className="pt-4">
      {/* Tab Navigation */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto px-4">
        {activeTab === 'chat' && (
          <ChatInterface language={language} crop={crop} imageData={imageData} />
        )}
        {activeTab === 'calendar' && (
          <CropCareCalendar language={language} crop={crop} />
        )}
        {activeTab === 'weather' && (
          <WeatherWidget language={language} crop={crop} />
        )}
        {activeTab === 'marketplace' && (
          <Marketplace language={language} crop={crop} />
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const stepIndex = {
    welcome: 0,
    language: 1,
    crop: 2,
    image: 3,
    chat: 4,
  };

  const handleBack = () => {
    const steps: AppStep[] = ['welcome', 'language', 'crop', 'image', 'chat'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleHome = () => {
    setCurrentStep('welcome');
    setSelectedLanguage(null);
    setSelectedCrop(null);
    setUploadedImage(null);
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setTimeout(() => setCurrentStep('crop'), 500);
  };

  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop);
    setTimeout(() => setCurrentStep('image'), 500);
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setCurrentStep('chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep !== 'welcome' && (
        <Header
          currentStep={stepIndex[currentStep]}
          onBack={handleBack}
          onHome={handleHome}
        />
      )}

      <main className="pb-8">
        {currentStep === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentStep('language')} />
        )}

        {currentStep === 'language' && (
          <div className="pt-8">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={handleLanguageSelect}
            />
          </div>
        )}

        {currentStep === 'crop' && selectedLanguage && (
          <div className="pt-8">
            <CropSelector
              selectedCrop={selectedCrop}
              onSelectCrop={handleCropSelect}
              language={selectedLanguage}
            />
          </div>
        )}

        {currentStep === 'image' && selectedLanguage && selectedCrop && (
          <div className="pt-8">
            <ImageUpload
              language={selectedLanguage}
              crop={selectedCrop}
              onImageUpload={handleImageUpload}
            />
          </div>
        )}

        {currentStep === 'chat' && selectedLanguage && selectedCrop && uploadedImage && (
          <ChatDashboard
            language={selectedLanguage}
            crop={selectedCrop}
            imageData={uploadedImage}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
