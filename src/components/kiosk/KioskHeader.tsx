import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, LogOut, Clock, User, Eye, Volume2, VolumeX, Bell, AlertTriangle, CloudRain, Wrench, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { civicAlerts } from '@/lib/mockData';
import MobileMenu from './MobileMenu';

const KioskHeader: React.FC = () => {
  const { isAuthenticated, citizen, language, setLanguage, logout, sessionTimeout } = useAuth();
  const { ttsEnabled, toggleTTS } = useKiosk();
  const { t, i18n } = useTranslation();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  const activeAlerts = civicAlerts.filter(alert => new Date(alert.expiresAt) > new Date());
  const unreadCount = activeAlerts.length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'weather': return CloudRain;
      case 'maintenance': return Wrench;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'warning': return 'text-orange-700 bg-orange-100 border-orange-300';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Sync i18n language with AuthContext language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Toggle high contrast class on body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Toggle large text
  useEffect(() => {
    if (largeText) {
      document.documentElement.style.fontSize = '125%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  }, [largeText]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'CRITICAL';
      case 'warning': return 'WARNING';
      default: return 'INFO';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <header className="kiosk-header relative shadow-lg z-50">
      {/* Decorative Top Border (Tricolor) */}
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,#FF9933_0%,#FFFFFF_50%,#138808_100%)]" />
      
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-[hsl(220,90%,30%)] text-white shadow-sm">
        {/* Left: Government Branding */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Shield className="w-5 h-5 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-sm md:text-2xl font-bold text-white tracking-wide font-serif">
                {t('header.title')}
              </h1>
              <p className="text-[10px] md:text-xs text-blue-100 uppercase tracking-widest opacity-80 hidden sm:block">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/20 mx-2 md:mx-4 hidden lg:block" />
          <div className="text-blue-50 text-xs md:text-sm hidden lg:block">
            <span className="font-bold tracking-tight">
              {language === 'en' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'}
            </span>
            <br />
            <span className="text-xs opacity-75 font-medium text-blue-100">
              {language === 'en' ? 'Unified Civic Services Kiosk' : 'एकीकृत नागरिक सेवा कियोस्क'}
            </span>
          </div>
        </div>

        {/* Center: Date/Time & Kiosk ID */}
        <div className="text-center text-white hidden xl:block">
          <div className="text-xl font-mono font-bold tracking-tight">
            {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-60 bg-white/10 text-blue-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-white/10">
            Kiosk ID: KIOSK-SEC5-001
          </div>
        </div>

        {/* Right: Language, User, Logout */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* Mobile Menu */}
          <MobileMenu
            highContrast={highContrast}
            largeText={largeText}
            onToggleHighContrast={() => setHighContrast(!highContrast)}
            onToggleLargeText={() => setLargeText(!largeText)}
          />

          {/* Accessibility Controls */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg p-1 border border-white/20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHighContrast(!highContrast)}
              className={`h-8 w-8 text-blue-100 hover:bg-white/20 hover:text-white ${highContrast ? 'bg-white text-blue-900 shadow-sm' : ''}`}
              title={t('header.highContrast') || "High Contrast"}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLargeText(!largeText)}
              className={`h-8 w-8 text-blue-100 hover:bg-white/20 hover:text-white ${largeText ? 'bg-white text-blue-900 shadow-sm' : ''}`}
              title={t('header.largeText') || "Large Text"}
            >
              <span className="text-xs font-bold">A+</span>
            </Button>
          </div>

          {/* TTS Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTTS}
            className={`text-white hover:bg-white/10 h-8 w-8 md:h-auto md:w-auto md:px-3 ${
              ttsEnabled ? 'bg-white/20 ring-2 ring-white/30' : ''
            }`}
            aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline md:ml-2">
              {ttsEnabled ? 'TTS On' : 'TTS Off'}
            </span>
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 h-10 w-10">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[hsl(220,90%,30%)] animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 mr-4 shadow-xl border-slate-200" align="end">
              <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    {unreadCount} New
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-slate-500 hover:text-blue-600" onClick={() => toast.success("All notifications marked as read")}>
                    Mark all read
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                {activeAlerts.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100">
                    {activeAlerts.map((alert) => {
                      const Icon = getAlertIcon(alert.type);
                      const colorClass = getSeverityColor(alert.severity);
                      return (
                        <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${colorClass.replace('bg-opacity-20', 'bg-opacity-10')}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                                  {language === 'en' ? alert.title : alert.titleHindi}
                                </p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                  {formatTimeAgo(alert.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {language === 'en' ? alert.message : alert.messageHindi}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  alert.severity === 'critical' ? 'text-red-700 bg-red-50 border-red-100' :
                                  alert.severity === 'warning' ? 'text-orange-700 bg-orange-50 border-orange-100' :
                                  'text-blue-700 bg-blue-50 border-blue-100'
                                }`}>
                                  {alert.severity === 'critical' && <AlertTriangle className="w-3 h-3" />}
                                  {getSeverityLabel(alert.severity)}
                                </span>
                                <span className="text-[10px] text-slate-400 border-l pl-2 border-slate-200">
                                  {alert.zones.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-8 text-center text-slate-500 bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Bell className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="font-semibold text-slate-700 mb-1">No New Notifications</h4>
                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                      You are all caught up! Check back later for civic updates and announcements.
                    </p>
                  </div>
                )}
              </ScrollArea>
              <div className="p-3 border-t bg-slate-50 text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-white hover:bg-white/10 border border-white/20 h-8 w-8 md:h-auto md:w-auto md:px-3"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline md:ml-2">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </Button>

          {isAuthenticated && citizen && (
            <>
              {/* Session Timer */}
              <div className="hidden sm:flex items-center gap-2 text-white px-2 md:px-3 py-1.5 md:py-2 bg-white/10 rounded-lg border border-white/20">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
                <span className="font-mono text-xs md:text-sm">{formatTime(sessionTimeout)}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{citizen.name}</span>
                  <span className="text-xs text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online | 🪙 {citizen.points || 0} Pts
                  </span>
                </div>
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 shadow-sm text-white">
                  <User className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="destructive"
                size="icon"
                onClick={logout}
                className="shadow-sm border border-white/20 h-8 w-8 md:h-auto md:w-auto md:px-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline md:ml-2">{t('header.logout')}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
