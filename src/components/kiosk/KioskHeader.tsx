
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, LogOut, Clock, User, Eye, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KioskHeader: React.FC = () => {
  const { isAuthenticated, citizen, language, setLanguage, logout, sessionTimeout } = useAuth();
  const { ttsEnabled, toggleTTS } = useKiosk();
  const { t, i18n } = useTranslation();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

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

  return (
    <header className="kiosk-header relative shadow-lg z-50">
      {/* Decorative Top Border (Tricolor) */}
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,#FF9933_0%,#FFFFFF_50%,#138808_100%)]" />
      
      <div className="flex items-center justify-between px-6 py-4 bg-[hsl(220,90%,30%)] text-white shadow-sm">
        {/* Left: Government Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide font-serif">
                {t('header.title')}
              </h1>
              <p className="text-xs text-blue-100 uppercase tracking-widest opacity-80">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/20 mx-4" />
          <div className="text-blue-50 text-sm">
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
        <div className="flex items-center gap-4">
          {/* Accessibility Controls */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 border border-white/20">
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
            size="sm"
            onClick={toggleTTS}
            className={`text-white hover:bg-white/10 gap-2 ${
              ttsEnabled ? 'bg-white/20 ring-2 ring-white/30' : ''
            }`}
            aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {ttsEnabled ? 'TTS On' : 'TTS Off'}
            </span>
          </Button>
          
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-white hover:bg-white/10 gap-2 border border-white/20"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </Button>

          {isAuthenticated && citizen && (
            <>
              {/* Session Timer */}
              <div className="flex items-center gap-2 text-white px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                <Clock className="w-4 h-4 text-blue-200" />
                <span className="font-mono text-sm">{formatTime(sessionTimeout)}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{citizen.name}</span>
                  <span className="text-xs text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online | 🪙 {citizen.points || 0} Pts
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 shadow-sm text-white">
                  <User className="w-6 h-6" />
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="gap-2 shadow-sm border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                {t('header.logout')}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
