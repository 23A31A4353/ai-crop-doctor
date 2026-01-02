import { useState, useRef } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  language: Language;
  crop: Crop;
  onImageUpload: (imageData: string) => void;
}

export const ImageUpload = ({ language, crop, onImageUpload }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (previewUrl) {
      onImageUpload(previewUrl);
    }
  };

  const texts = {
    title: language.code === 'hi' ? 'फसल की तस्वीर अपलोड करें' : 'Upload Crop Image',
    subtitle: language.code === 'hi' 
      ? `${crop.nameHindi} की समस्या वाली तस्वीर दिखाएं`
      : `Show the problem in your ${crop.name}`,
    dragDrop: language.code === 'hi' 
      ? 'तस्वीर यहाँ खींचें और छोड़ें'
      : 'Drag and drop image here',
    or: language.code === 'hi' ? 'या' : 'or',
    camera: language.code === 'hi' ? 'कैमरा' : 'Camera',
    gallery: language.code === 'hi' ? 'गैलरी' : 'Gallery',
    analyze: language.code === 'hi' ? 'समस्या का विश्लेषण करें' : 'Analyze Problem',
    change: language.code === 'hi' ? 'तस्वीर बदलें' : 'Change Image',
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
          <Camera className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {texts.title}
        </h2>
        <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
          <span className="text-2xl">{crop.icon}</span>
          {texts.subtitle}
        </p>
      </div>

      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`glass-card rounded-2xl p-8 md:p-12 border-2 border-dashed transition-all duration-300 ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-6">
                <ImageIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground">{texts.dragDrop}</p>
                <p className="text-muted-foreground my-4">{texts.or}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => cameraInputRef.current?.click()}
                  className="gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {texts.camera}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {texts.gallery}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-4 md:p-6">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img
              src={previewUrl}
              alt="Crop preview"
              className="w-full h-64 md:h-80 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={clearImage}
              className="flex-1"
            >
              {texts.change}
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-glow hover:-translate-y-1 active:translate-y-0"
            >
              {texts.analyze}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
