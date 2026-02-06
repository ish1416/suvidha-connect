import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { civicAlerts, type CivicAlert } from '@/lib/mockData';
import { AlertTriangle, Info, CloudRain, Wrench, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const AlertTicker: React.FC = () => {
  const { language } = useAuth();
  const [alerts, setAlerts] = useState<CivicAlert[]>(civicAlerts);

  // Simulate real-time data streaming
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAlert: CivicAlert = {
        id: `ALERT_LIVE_${Date.now()}`,
        type: 'emergency',
        title: 'Flash Flood Alert',
        titleHindi: 'बाढ़ की चेतावनी',
        message: 'Heavy rain expected in Sector 62. Avoid low lying areas.',
        messageHindi: 'सेक्टर 62 में भारी बारिश की संभावना। निचले इलाकों से बचें।',
        severity: 'critical',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        zones: ['Zone 1']
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 5000); // Add after 5 seconds

    return () => clearTimeout(timer);
  }, []);

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

  const activeAlerts = alerts.filter(
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

        {/* View All / Details Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`shrink-0 h-7 text-xs font-medium ml-2 border-l pl-3 hover:bg-white/10 ${hasCritical ? 'text-white border-red-400' : 'text-slate-200 border-slate-600'}`}
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-slate-700">
            <DialogHeader className="p-6 pb-2 border-b border-border/50">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">📢</span>
                {language === 'en' ? 'Active Alerts & Notifications' : 'सक्रिय अलर्ट और सूचनाएं'}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 p-6 pt-2">
              <div className="space-y-4 mt-4">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-xl border-l-4 shadow-sm ${
                      alert.severity === 'critical' ? 'bg-red-50 border-l-red-600 dark:bg-red-950/30' :
                      alert.severity === 'warning' ? 'bg-yellow-50 border-l-yellow-500 dark:bg-yellow-950/30' :
                      'bg-blue-50 border-l-blue-500 dark:bg-blue-950/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {getIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-lg leading-tight">
                            {language === 'en' ? alert.title : alert.titleHindi}
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 bg-black/5 px-2 py-0.5 rounded">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed mb-3">
                          {language === 'en' ? alert.message : alert.messageHindi}
                        </p>
                        <div className="flex items-center justify-between text-xs opacity-60 border-t border-black/5 pt-2 mt-2">
                          <span>📍 {alert.zones.join(', ')}</span>
                          <span>🕒 Exp: {new Date(alert.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                  <div className="text-center py-12 opacity-50">
                    <Info className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No active alerts at this moment.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlertTicker;
