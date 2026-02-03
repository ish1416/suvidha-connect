import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { civicAlerts } from '@/lib/mockData';
import { AlertTriangle, Info, CloudRain, Wrench } from 'lucide-react';

const AlertTicker: React.FC = () => {
  const { language } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      case 'weather':
        return <CloudRain className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const activeAlerts = civicAlerts.filter(
    alert => new Date(alert.expiresAt) > new Date()
  );

  if (activeAlerts.length === 0) return null;

  return (
    <div className="alert-ticker overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20">
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider shrink-0">
          {language === 'en' ? '📢 ALERTS' : '📢 अलर्ट'}
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex items-center gap-8">
            {activeAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm shrink-0 ${getSeverityClass(alert.severity)}`}
              >
                {getIcon(alert.type)}
                <span className="font-medium">
                  {language === 'en' ? alert.title : alert.titleHindi}:
                </span>
                <span className="opacity-90">
                  {language === 'en' 
                    ? alert.message.substring(0, 80) + '...'
                    : alert.messageHindi.substring(0, 60) + '...'}
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {activeAlerts.map((alert) => (
              <div
                key={`${alert.id}-dup`}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm shrink-0 ${getSeverityClass(alert.severity)}`}
              >
                {getIcon(alert.type)}
                <span className="font-medium">
                  {language === 'en' ? alert.title : alert.titleHindi}:
                </span>
                <span className="opacity-90">
                  {language === 'en' 
                    ? alert.message.substring(0, 80) + '...'
                    : alert.messageHindi.substring(0, 60) + '...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTicker;
