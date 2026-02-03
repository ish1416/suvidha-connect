import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, AlertTriangle, Info, CloudRain, 
  Wrench, Bell, Calendar, MapPin
} from 'lucide-react';
import { civicAlerts } from '@/lib/mockData';

interface AlertsModuleProps {
  onBack: () => void;
}

const AlertsModule: React.FC<AlertsModuleProps> = ({ onBack }) => {
  const { language } = useAuth();

  const t = {
    en: {
      title: 'Civic Alerts & Notifications',
      subtitle: 'Stay informed about service updates and emergencies',
      activeAlerts: 'Active Alerts',
      noAlerts: 'No active alerts at this time',
      zones: 'Affected Zones',
      validUntil: 'Valid Until',
      backToHome: 'Back to Home'
    },
    hi: {
      title: 'नागरिक अलर्ट और सूचनाएं',
      subtitle: 'सेवा अपडेट और आपात स्थिति के बारे में सूचित रहें',
      activeAlerts: 'सक्रिय अलर्ट',
      noAlerts: 'इस समय कोई सक्रिय अलर्ट नहीं',
      zones: 'प्रभावित क्षेत्र',
      validUntil: 'तक मान्य',
      backToHome: 'होम पर वापस जाएं'
    }
  };

  const text = t[language];

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'weather':
        return CloudRain;
      case 'maintenance':
        return Wrench;
      default:
        return Info;
    }
  };

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          icon: 'text-destructive bg-destructive/20',
          badge: 'bg-destructive text-destructive-foreground'
        };
      case 'warning':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/30',
          icon: 'text-secondary bg-secondary/20',
          badge: 'bg-secondary text-secondary-foreground'
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          icon: 'text-primary bg-primary/20',
          badge: 'bg-primary text-primary-foreground'
        };
    }
  };

  const activeAlerts = civicAlerts.filter(
    alert => new Date(alert.expiresAt) > new Date()
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{text.title}</h2>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {text.activeAlerts}
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {activeAlerts.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{text.noAlerts}</p>
              </div>
            ) : (
              activeAlerts.map((alert) => {
                const Icon = getIcon(alert.type);
                const classes = getSeverityClasses(alert.severity);
                
                return (
                  <div
                    key={alert.id}
                    className={`p-6 rounded-xl border-2 ${classes.bg} ${classes.border}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${classes.icon} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">
                            {language === 'en' ? alert.title : alert.titleHindi}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full uppercase font-semibold ${classes.badge}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {language === 'en' ? alert.message : alert.messageHindi}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{text.zones}: {alert.zones.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{text.validUntil}: {new Date(alert.expiresAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={onBack}>
            {text.backToHome}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertsModule;
