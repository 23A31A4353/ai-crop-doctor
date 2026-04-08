import { useState } from 'react';
import { Crop, indianCrops, cropCategories } from '@/lib/crops';
import { Language } from '@/lib/languages';
import { Button } from '@/components/ui/button';
import { Leaf, Volume2, Search } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { Input } from '@/components/ui/input';

interface CropSelectorProps {
  selectedCrop: Crop | null;
  onSelectCrop: (crop: Crop) => void;
  language: Language;
}

export const CropSelector = ({ selectedCrop, onSelectCrop, language }: CropSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { speak, isSpeaking } = useSpeech({ lang: language.speechCode });

  const filteredCrops = indianCrops.filter((crop) => {
    const matchesCategory = !selectedCategory || crop.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.nameHindi.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleSelectWithVoice = (crop: Crop) => {
    onSelectCrop(crop);
    const speakText = language.code === 'hi' ? crop.nameHindi : crop.name;
    speak(`${speakText} selected`);
  };

  const speakCropName = (crop: Crop, e: React.MouseEvent) => {
    e.stopPropagation();
    const speakText = language.code === 'hi' ? crop.nameHindi : crop.name;
    speak(speakText);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <Leaf className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {language.code === 'hi' ? 'अपनी फसल चुनें' : 'Select Your Crop'}
        </h2>
        <p className="text-muted-foreground text-lg">
          {language.code === 'hi' ? 'निदान के लिए फसल का चयन करें' : 'Choose a crop for diagnosis'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={language.code === 'hi' ? 'फसल खोजें...' : 'Search crops...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-lg"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          {language.code === 'hi' ? 'सभी' : 'All'}
        </Button>
        {cropCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {language.code === 'hi' ? category.nameHindi : category.name}
          </Button>
        ))}
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCrops.map((crop) => (
          <Button
            key={crop.id}
            variant="outline"
            className={`h-auto py-4 flex-col gap-2 relative group bg-card border-2 border-border hover:border-accent hover:bg-accent/10 shadow-sm hover:shadow-md ${
              selectedCrop?.id === crop.id
                ? 'border-accent bg-accent/15 ring-2 ring-accent/30'
                : ''
            }`}
            onClick={() => handleSelectWithVoice(crop)}
          >
            {crop.image ? (
              <img src={crop.image} alt={crop.name} loading="lazy" width={48} height={48} className="w-12 h-12 object-contain" />
            ) : (
              <span className="text-3xl">{crop.icon}</span>
            )}
            <span className="font-semibold text-sm">
              {language.code === 'hi' ? crop.nameHindi : crop.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {language.code === 'hi' ? crop.name : crop.nameHindi}
            </span>
            <button
              onClick={(e) => speakCropName(crop, e)}
              className="absolute top-2 right-2 p-1 rounded-full bg-primary/10 hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Volume2 className={`w-4 h-4 text-primary ${isSpeaking ? 'animate-pulse' : ''}`} />
            </button>
          </Button>
        ))}
      </div>
    </div>
  );
};
