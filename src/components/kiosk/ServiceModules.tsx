
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
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/20 hover:shadow-blue-300 dark:hover:shadow-blue-900/40 border-blue-400/20';
      case 'secondary':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/20 hover:shadow-purple-300 dark:hover:shadow-purple-900/40 border-purple-400/20';
      case 'accent':
        return 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-200 dark:shadow-amber-900/20 hover:shadow-amber-300 dark:hover:shadow-amber-900/40 border-amber-400/20';
      default:
        return 'bg-gradient-to-br from-slate-500 to-slate-600 text-white';
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
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 border shadow-xl ${getColorClasses(module.color)}`}
            onClick={() => onModuleSelect(module.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center min-h-[220px] relative overflow-hidden group">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500" />
              
              <div className="mb-5 relative z-10">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-300">
                  <module.icon className="w-12 h-12" />
                </div>
                {module.subIcons && (
                  <div className="flex gap-1 absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10 shadow-sm">
                    {module.subIcons.map((SubIcon, index) => (
                      <SubIcon key={index} className="w-3.5 h-3.5" />
                    ))}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 z-10 tracking-tight">{module.title}</h3>
              <p className="text-sm opacity-90 z-10 leading-relaxed max-w-[85%]">{module.description}</p>
              
              {ttsEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 hover:bg-white/20 text-white border border-white/20 z-10"
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
