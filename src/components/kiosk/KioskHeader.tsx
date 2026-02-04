
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

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="kiosk-header">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Government Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground tracking-wide">
                {t('header.title')}
              </h1>
              <p className="text-xs text-primary-foreground/80">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          <div className="h-10 w-px bg-primary-foreground/30 mx-4" />
          <div className="text-primary-foreground/90 text-sm">
            <span className="font-medium">
              {language === 'en' ? 'Government of India' : 'भारत सरकार'}
            </span>
            <br />
            <span className="text-xs opacity-80">
              {language === 'en' ? 'Unified Civic Services Kiosk' : 'एकीकृत नागरिक सेवा कियोस्क'}
            </span>
          </div>
        </div>

        {/* Center: Date/Time & Kiosk ID */}
        <div className="text-center text-primary-foreground">
          <div className="text-lg font-mono">
            {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
          <div className="text-xs opacity-70">Kiosk ID: KIOSK-SEC5-001</div>
        </div>

        {/* Right: Language, User, Logout */}
        <div className="flex items-center gap-4">
          {/* TTS Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTTS}
            className={`text-primary-foreground hover:bg-primary-foreground/10 gap-2 ${
              ttsEnabled ? 'bg-primary-foreground/20 ring-2 ring-primary-foreground' : ''
            }`}
            aria-label={ttsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {ttsEnabled ? 'TTS On' : 'TTS Off'}
            </span>
          </Button>

          {/* High Contrast Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHighContrast(!highContrast)}
            className={`text-primary-foreground hover:bg-primary-foreground/10 gap-2 ${
              highContrast ? 'bg-primary-foreground/20 ring-2 ring-primary-foreground' : ''
            }`}
            aria-label={highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">
              {highContrast ? 'Normal' : 'High Contrast'}
            </span>
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </Button>

          {isAuthenticated && citizen && (
            <>
              {/* Session Timer */}
              <div className="flex items-center gap-2 text-primary-foreground/90 px-3 py-2 bg-primary-foreground/10 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(sessionTimeout)}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 text-primary-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{citizen.name}</span>
              </div>

              {/* Logout */}
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="gap-2"
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
