
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useKiosk } from '@/context/KioskContext';
import { 
  CreditCard, 
  MessageSquareWarning, 
  FilePlus, 
  Search, 
  FileDown,
  Bell,
  Zap,
  Flame,
  Droplets,
  Trash2,
  Volume2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceModulesProps {
  onModuleSelect: (module: string) => void;
}

const ServiceModules: React.FC<ServiceModulesProps> = ({ onModuleSelect }) => {
  const { t } = useTranslation();
  const { speak, ttsEnabled } = useKiosk();

  const modules = [
    {
      id: 'bills',
      icon: CreditCard,
      title: t('services.bills.title'),
      description: t('services.bills.description'),
      color: 'primary',
      subIcons: [Zap, Flame, Droplets]
    },
    {
      id: 'complaint',
      icon: MessageSquareWarning,
      title: t('services.complaint.title'),
      description: t('services.complaint.description'),
      color: 'secondary'
    },
    {
      id: 'newService',
      icon: FilePlus,
      title: t('services.newService.title'),
      description: t('services.newService.description'),
      color: 'accent'
    },
    {
      id: 'track',
      icon: Search,
      title: t('services.track.title'),
      description: t('services.track.description'),
      color: 'primary'
    },
    {
      id: 'documents',
      icon: FileDown,
      title: t('services.documents.title'),
      description: t('services.documents.description'),
      color: 'secondary'
    },
    {
      id: 'alerts',
      icon: Bell,
      title: t('services.alerts.title'),
      description: t('services.alerts.description'),
      color: 'accent'
    },
    {
      id: 'waste',
      icon: Trash2,
      title: t('services.waste.title'),
      description: t('services.waste.description'),
      color: 'primary'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
      case 'accent':
        return 'bg-accent text-accent-foreground hover:bg-accent/90';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="p-8">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('welcome_title')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('welcome_subtitle')}
        </p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-xl ${getColorClasses(module.color)}`}
            onClick={() => onModuleSelect(module.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center min-h-[200px]">
              <div className="mb-4 relative">
                <module.icon className="w-16 h-16" />
                {module.subIcons && (
                  <div className="flex gap-1 absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                    {module.subIcons.map((SubIcon, index) => (
                      <SubIcon key={index} className="w-4 h-4" />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{module.title}</h3>
              <p className="text-sm opacity-90">{module.description}</p>
              
              {ttsEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 hover:bg-background/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(`${module.title}. ${module.description}`);
                  }}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {t('Speak')}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceModules;
