import { useState, useEffect } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { getMockWeatherData, getFarmingTips, indianRegions, WeatherData, FarmingTip } from '@/lib/weather';
import { Button } from '@/components/ui/button';
import { Cloud, Droplets, Wind, ThermometerSun, MapPin, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface WeatherWidgetProps {
  language: Language;
  crop: Crop;
}

export const WeatherWidget = ({ language, crop }: WeatherWidgetProps) => {
  const [selectedRegion, setSelectedRegion] = useState(indianRegions[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [tips, setTips] = useState<FarmingTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isHindi = language.code === 'hi';

  useEffect(() => {
    loadWeather();
  }, [selectedRegion, crop.id]);

  const loadWeather = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const weatherData = getMockWeatherData(selectedRegion.name);
      setWeather(weatherData);
      setTips(getFarmingTips(weatherData, crop.id));
      setIsLoading(false);
    }, 500);
  };

  const getPriorityIcon = (priority: FarmingTip['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getPriorityBg = (priority: FarmingTip['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 border-destructive/30';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'bg-primary/10 border-primary/30';
    }
  };

  const texts = {
    title: isHindi ? 'मौसम और खेती सलाह' : 'Weather & Farming Tips',
    selectRegion: isHindi ? 'क्षेत्र चुनें' : 'Select Region',
    temperature: isHindi ? 'तापमान' : 'Temperature',
    humidity: isHindi ? 'नमी' : 'Humidity',
    wind: isHindi ? 'हवा' : 'Wind',
    rainfall: isHindi ? 'वर्षा' : 'Rainfall',
    forecast: isHindi ? '5-दिन का पूर्वानुमान' : '5-Day Forecast',
    farmingTips: isHindi ? 'खेती सुझाव' : 'Farming Recommendations',
    refresh: isHindi ? 'ताज़ा करें' : 'Refresh',
    rainChance: isHindi ? 'बारिश' : 'Rain',
  };

  if (isLoading || !weather) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-muted rounded mb-4"></div>
        <div className="h-16 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20">
            <Cloud className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold">{texts.title}</h2>
        </div>
        <Button size="sm" variant="ghost" onClick={loadWeather}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Region Selector */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">
          <MapPin className="w-4 h-4 inline mr-1" />
          {texts.selectRegion}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {indianRegions.slice(0, 6).map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion.id === region.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className="flex-shrink-0"
            >
              {isHindi ? region.nameHindi : region.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{weather.icon}</span>
            <div>
              <div className="text-4xl font-bold">{weather.temperature}°C</div>
              <div className="text-muted-foreground">
                {isHindi ? weather.conditionHindi : weather.condition}
              </div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-blue-500" />
              {weather.humidity}%
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-muted-foreground" />
              {weather.windSpeed} km/h
            </div>
            {weather.rainfall > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Cloud className="w-4 h-4 text-blue-400" />
                {weather.rainfall} mm
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">{texts.forecast}</h3>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day, index) => (
            <div
              key={index}
              className="text-center p-2 rounded-lg bg-card border border-border"
            >
              <div className="text-xs font-medium text-muted-foreground">
                {isHindi ? day.dayHindi : day.day}
              </div>
              <div className="text-2xl my-1">{day.icon}</div>
              <div className="text-sm font-semibold">{day.tempHigh}°</div>
              <div className="text-xs text-muted-foreground">{day.tempLow}°</div>
              {day.rainChance > 30 && (
                <div className="text-xs text-blue-500 mt-1">
                  💧 {day.rainChance}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Farming Tips */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ThermometerSun className="w-5 h-5 text-secondary" />
          {texts.farmingTips}
        </h3>
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`p-3 rounded-lg border ${getPriorityBg(tip.priority)} flex items-start gap-3`}
            >
              <span className="text-xl">{tip.icon}</span>
              <div className="flex-1">
                <p className="text-sm">{isHindi ? tip.tipHindi : tip.tip}</p>
              </div>
              {getPriorityIcon(tip.priority)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
