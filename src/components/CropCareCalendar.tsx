import { useState } from 'react';
import { Language } from '@/lib/languages';
import { Crop } from '@/lib/crops';
import { getCropCareTasks, CareTask } from '@/lib/cropCare';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Calendar, Droplets, Leaf, Bug, Bell, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface CropCareCalendarProps {
  language: Language;
  crop: Crop;
}

export const CropCareCalendar = ({ language, crop }: CropCareCalendarProps) => {
  const [activeType, setActiveType] = useState<'all' | 'watering' | 'fertilizing' | 'pestControl'>('all');
  const tasks = getCropCareTasks(crop.id);
  const t = getTranslations(language);

  const getLocalizedText = (en: string, hi: string) => {
    return language.code === 'hi' ? hi : en;
  };

  const filteredTasks = activeType === 'all' 
    ? tasks 
    : tasks.filter(task => task.type === activeType);

  const getTypeIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return <Droplets className="w-5 h-5" />;
      case 'fertilizing': return <Leaf className="w-5 h-5" />;
      case 'pestControl': return <Bug className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'fertilizing': return 'bg-primary/20 text-primary border-primary/30';
      case 'pestControl': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    }
  };

  const handleSetReminder = (task: CareTask) => {
    const taskTitle = getLocalizedText(task.title, task.titleHindi);
    toast.success(
      language.code === 'hi' 
        ? `${taskTitle} के लिए अनुस्मारक सेट किया गया` 
        : `Reminder set for ${taskTitle}`
    );
  };

  const filterLabels = {
    all: t.all,
    watering: t.watering,
    fertilizing: t.fertilizing,
    pestControl: t.pestControl,
  };

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t.cropCalendar}</h2>
          <p className="text-sm text-muted-foreground">
            {crop.icon} {getLocalizedText(crop.name, crop.nameHindi)} - {t.reminders}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'watering', 'fertilizing', 'pestControl'] as const).map((type) => (
          <Button
            key={type}
            variant={activeType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveType(type)}
            className={`flex-shrink-0 ${activeType === type ? 'bg-primary' : ''}`}
          >
            {type === 'all' ? '📋' : type === 'watering' ? '💧' : type === 'fertilizing' ? '🌱' : '🐛'}
            <span className="ml-2">{filterLabels[type]}</span>
          </Button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border-2 ${getTypeColor(task.type)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{task.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">
                  {getLocalizedText(task.title, task.titleHindi)}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {getLocalizedText(task.description, task.descriptionHindi)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 rounded-full bg-background/50 font-medium">
                    ⏰ {t.frequency}: {getLocalizedText(task.frequency, task.frequencyHindi)}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="flex-shrink-0"
                onClick={() => handleSetReminder(task)}
              >
                <Bell className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">{t.setReminder}</span>
                <ChevronRight className="w-4 h-4 md:hidden" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
