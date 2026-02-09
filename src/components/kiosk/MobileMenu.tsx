import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Eye, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useKiosk } from '@/context/KioskContext';

interface MobileMenuProps {
  highContrast: boolean;
  largeText: boolean;
  onToggleHighContrast: () => void;
  onToggleLargeText: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  highContrast,
  largeText,
  onToggleHighContrast,
  onToggleLargeText
}) => {
  const { language } = useAuth();
  const { ttsEnabled, toggleTTS } = useKiosk();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle>{language === 'en' ? 'Accessibility' : 'सुलभता'}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'High Contrast' : 'उच्च कंट्रास्ट'}</span>
            </div>
            <Button
              variant={highContrast ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleHighContrast}
            >
              {highContrast ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">A+</span>
              <span className="text-sm">{language === 'en' ? 'Large Text' : 'बड़ा टेक्स्ट'}</span>
            </div>
            <Button
              variant={largeText ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleLargeText}
            >
              {largeText ? 'ON' : 'OFF'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm">{language === 'en' ? 'Text-to-Speech' : 'टेक्स्ट-टू-स्पीच'}</span>
            </div>
            <Button
              variant={ttsEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={toggleTTS}
            >
              {ttsEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
