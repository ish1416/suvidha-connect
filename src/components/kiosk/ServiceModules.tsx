import React from 'react';
import { useAuth } from '@/context/AuthContext';
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
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceModulesProps {
  onModuleSelect: (module: string) => void;
}

const ServiceModules: React.FC<ServiceModulesProps> = ({ onModuleSelect }) => {
  const { language } = useAuth();

  const modules = [
    {
      id: 'bills',
      icon: CreditCard,
      title: { en: 'Pay Utility Bill', hi: 'उपयोगिता बिल भुगतान' },
      description: { en: 'Electricity, Gas & Water', hi: 'बिजली, गैस और पानी' },
      color: 'primary',
      subIcons: [Zap, Flame, Droplets]
    },
    {
      id: 'complaint',
      icon: MessageSquareWarning,
      title: { en: 'Register Complaint', hi: 'शिकायत दर्ज करें' },
      description: { en: 'Report issues & grievances', hi: 'समस्याएं और शिकायतें दर्ज करें' },
      color: 'secondary'
    },
    {
      id: 'newService',
      icon: FilePlus,
      title: { en: 'New Service Request', hi: 'नई सेवा अनुरोध' },
      description: { en: 'Apply for new connections', hi: 'नए कनेक्शन के लिए आवेदन करें' },
      color: 'accent'
    },
    {
      id: 'track',
      icon: Search,
      title: { en: 'Track Application', hi: 'आवेदन ट्रैक करें' },
      description: { en: 'Check status of your requests', hi: 'अपने अनुरोधों की स्थिति जांचें' },
      color: 'primary'
    },
    {
      id: 'documents',
      icon: FileDown,
      title: { en: 'Download Documents', hi: 'दस्तावेज़ डाउनलोड करें' },
      description: { en: 'Receipts & certificates', hi: 'रसीदें और प्रमाण पत्र' },
      color: 'secondary'
    },
    {
      id: 'alerts',
      icon: Bell,
      title: { en: 'Civic Alerts', hi: 'नागरिक अलर्ट' },
      description: { en: 'Emergency & maintenance notices', hi: 'आपातकालीन और रखरखाव सूचनाएं' },
      color: 'accent'
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
          {language === 'en' ? 'Welcome to SUVIDHA Services' : 'सुविधा सेवाओं में आपका स्वागत है'}
        </h2>
        <p className="text-lg text-muted-foreground">
          {language === 'en' 
            ? 'Select a service to continue'
            : 'जारी रखने के लिए एक सेवा चुनें'}
        </p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-primary/30 overflow-hidden group"
            onClick={() => onModuleSelect(module.id)}
          >
            <CardContent className="p-0">
              <div className={`${getColorClasses(module.color)} p-6 transition-all`}>
                <module.icon className="w-12 h-12 mx-auto mb-2" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {module.title[language]}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {module.description[language]}
                </p>
                {module.subIcons && (
                  <div className="flex justify-center gap-3 mt-4">
                    {module.subIcons.map((Icon, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-muted rounded-full text-sm text-muted-foreground">
          <span>🔒 {language === 'en' ? 'Secure & Encrypted' : 'सुरक्षित और एन्क्रिप्टेड'}</span>
          <span>•</span>
          <span>📞 {language === 'en' ? 'Helpline: 1800-XXX-XXXX' : 'हेल्पलाइन: 1800-XXX-XXXX'}</span>
          <span>•</span>
          <span>🕐 {language === 'en' ? '24/7 Available' : '24/7 उपलब्ध'}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceModules;
