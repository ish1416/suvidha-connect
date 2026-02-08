import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { civicAlerts, type CivicAlert } from '@/lib/mockData';
import { AlertTriangle, Info, CloudRain, Wrench, ChevronRight, Filter, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const activeAlerts = alerts.filter(
    alert => new Date(alert.expiresAt) > new Date()
  );

  const getFilteredAlerts = (category: string) => {
    if (category === 'all') return activeAlerts;
    if (category === 'critical') return activeAlerts.filter(a => a.severity === 'critical');
    if (category === 'warning') return activeAlerts.filter(a => a.severity === 'warning');
    if (category === 'maintenance') return activeAlerts.filter(a => a.type === 'maintenance');
    return activeAlerts;
  };

  if (activeAlerts.length === 0) return null;

  // Determine global severity for the ticker bar background
  const hasCritical = activeAlerts.some(a => a.severity === 'critical');
  const tickerBg = hasCritical ? 'bg-red-600/95 border-b border-red-500' : 'bg-blue-900/95 border-b border-blue-800';

  return (
    <div className={`alert-ticker overflow-hidden sticky top-16 z-40 backdrop-blur-sm ${tickerBg} text-white shadow-md`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`text-xs font-bold uppercase tracking-wider shrink-0 px-2 py-1 rounded ${hasCritical ? 'bg-white text-red-700 animate-pulse' : 'bg-white/20 text-white'}`}>
          {language === 'en' ? '📢 ALERTS' : '📢 अलर्ट'}
        </span>
        <div className="overflow-hidden flex-1 group">
          <div className="animate-marquee flex items-center gap-12 group-hover:[animation-play-state:paused]">
            {activeAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm shrink-0 bg-black/20 border border-white/10`}
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
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm shrink-0 bg-black/20 border border-white/10`}
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
              className={`shrink-0 h-7 text-xs font-medium ml-2 border-l pl-3 hover:bg-white/10 text-white border-white/30`}
            >
              {language === 'en' ? 'View All' : 'सभी देखें'}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-slate-700">
            <DialogHeader className="p-6 pb-2 border-b border-border/50 bg-slate-50">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2 text-xl text-blue-900">
                  <span className="text-2xl">📢</span>
                  {language === 'en' ? 'Active Alerts & Notifications' : 'सक्रिय अलर्ट और सूचनाएं'}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleString(language === 'en' ? 'en-IN' : 'hi-IN', { 
                    weekday: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </DialogHeader>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 pt-4 bg-slate-50/50">
                <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
                  <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">{language === 'en' ? 'All' : 'सभी'}</TabsTrigger>
                  <TabsTrigger value="critical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    {language === 'en' ? 'Critical' : 'गंभीर'}
                  </TabsTrigger>
                  <TabsTrigger value="warning" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    {language === 'en' ? 'Warning' : 'चेतावनी'}
                  </TabsTrigger>
                  <TabsTrigger value="maintenance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    {language === 'en' ? 'Maint.' : 'रखरखाव'}
                  </TabsTrigger>
                </TabsList>
              </div>

              {['all', 'critical', 'warning', 'maintenance'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="flex-1 p-0 m-0 overflow-hidden bg-slate-50/30">
                  <ScrollArea className="h-full p-6 pt-2">
                    <div className="space-y-4 mt-2">
                      {getFilteredAlerts(tabValue).length > 0 ? (
                        getFilteredAlerts(tabValue).map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-4 rounded-xl border shadow-sm transition-all hover:shadow-md bg-white ${
                              alert.severity === 'critical' ? 'border-red-200 hover:border-red-400' :
                              alert.severity === 'warning' ? 'border-orange-200 hover:border-orange-400' :
                              'border-blue-200 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 p-2 rounded-full shrink-0 ${
                                alert.severity === 'critical' ? 'bg-red-50 text-red-600' :
                                alert.severity === 'warning' ? 'bg-orange-50 text-orange-600' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {getIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                  <h3 className="font-bold text-lg leading-tight truncate">
                                    {language === 'en' ? alert.title : alert.titleHindi}
                                  </h3>
                                  <Badge variant="outline" className={`uppercase text-[10px] tracking-wider shrink-0 ${
                                    alert.severity === 'critical' ? 'border-red-500 text-red-600 bg-red-50' :
                                    alert.severity === 'warning' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' :
                                    'border-slate-500 text-slate-600 bg-slate-50'
                                  }`}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm opacity-90 leading-relaxed mb-3">
                                  {language === 'en' ? alert.message : alert.messageHindi}
                                </p>
                                <div className="flex flex-wrap items-center justify-between text-xs opacity-60 border-t border-black/5 pt-2 mt-2 gap-2">
                                  <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {alert.zones.join(', ')}
                                  </span>
                                  <span className="font-mono bg-black/5 px-2 py-0.5 rounded">
                                    EXP: {new Date(alert.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-16 opacity-50 flex flex-col items-center">
                          <div className="bg-muted p-4 rounded-full mb-4">
                            <Filter className="w-8 h-8 opacity-40" />
                          </div>
                          <p className="font-medium">
                            {language === 'en' ? 'No alerts in this category' : 'इस श्रेणी में कोई अलर्ट नहीं है'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === 'en' ? 'Check other categories for updates' : 'अपडेट के लिए अन्य श्रेणियां देखें'}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AlertTicker;
