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
        return 'bg-red-600 text-white animate-pulse border-2 border-red-400 font-bold shadow-lg';
      case 'warning':
        return 'bg-yellow-500 text-black border-2 border-yellow-600 font-semibold';
      case 'maintenance':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const activeAlerts = civicAlerts.filter(
    alert => new Date(alert.expiresAt) > new Date()
  );

  if (activeAlerts.length === 0) return null;

  // Determine global severity for the ticker bar background
  const hasCritical = activeAlerts.some(a => a.severity === 'critical');
  const tickerBg = hasCritical ? 'bg-red-950/90 border-b border-red-500' : 'bg-slate-900/90 border-b border-slate-700';

  return (
    <div className={`alert-ticker overflow-hidden sticky top-16 z-40 backdrop-blur-sm ${tickerBg}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`text-xs font-bold uppercase tracking-wider shrink-0 px-2 py-1 rounded ${hasCritical ? 'bg-red-600 text-white animate-bounce' : 'bg-primary text-primary-foreground'}`}>
          {language === 'en' ? '📢 ALERTS' : '📢 अलर्ट'}
        </span>
        <div className="overflow-hidden flex-1 group">
          <div className="animate-marquee flex items-center gap-12 group-hover:[animation-play-state:paused]">
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
