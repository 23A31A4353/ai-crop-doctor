import { useState } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Header } from '@/components/Header';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CropSelector } from '@/components/CropSelector';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';

type AppStep = 'welcome' | 'language' | 'crop' | 'image' | 'chat';

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
          <div className="pt-4">
            <ChatInterface
              language={selectedLanguage}
              crop={selectedCrop}
              imageData={uploadedImage}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
