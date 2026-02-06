import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import KioskHeader from './KioskHeader';
import AlertTicker from './AlertTicker';
import LoginScreen from './LoginScreen';
import ServiceModules from './ServiceModules';
import BillPaymentModule from './BillPaymentModule';
import ComplaintModule from './ComplaintModule';
import NewServiceModule from './NewServiceModule';
import TrackStatusModule from './TrackStatusModule';
import DocumentsModule from './DocumentsModule';
import AlertsModule from './AlertsModule';
import WasteModule from './WasteModule';
import VoiceCommander from './VoiceCommander';
import { useAuth } from '@/context/AuthContext';

type ModuleType = 'home' | 'bills' | 'complaint' | 'newService' | 'track' | 'documents' | 'alerts' | 'waste';

const KioskLayout: React.FC = () => {
  const { isAuthenticated, sessionTimeout } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleType>('home');
  const warningShownRef = useRef(false);
  const prevAuthRef = useRef(isAuthenticated);

  // Session timeout warning and logout notification
  useEffect(() => {
    if (!isAuthenticated) {
      // Check if we just logged out
      if (prevAuthRef.current) {
        toast.info('Session Ended', {
          description: 'You have been logged out due to inactivity.',
        });
      }
      prevAuthRef.current = false;
      warningShownRef.current = false;
      return;
    }

    prevAuthRef.current = true;

    // Warning at 30 seconds
    if (sessionTimeout < 30000 && !warningShownRef.current) {
      toast.warning('Session expiring soon', {
        description: 'You will be logged out in 30 seconds due to inactivity.',
        duration: 5000,
      });
      warningShownRef.current = true;
    }
    
    // Reset warning flag if user becomes active
    if (sessionTimeout > 30000) {
      warningShownRef.current = false;
    }
  }, [sessionTimeout, isAuthenticated]);

  const handleModuleSelect = (module: string) => {
    setCurrentModule(module as ModuleType);
  };

  const handleBack = () => {
    setCurrentModule('home');
  };

  const renderModule = () => {
    if (!isAuthenticated) {
      return <LoginScreen onSuccess={() => setCurrentModule('home')} />;
    }

    switch (currentModule) {
      case 'bills':
        return <BillPaymentModule onBack={handleBack} />;
      case 'complaint':
        return <ComplaintModule onBack={handleBack} />;
      case 'newService':
        return <NewServiceModule onBack={handleBack} />;
      case 'track':
        return <TrackStatusModule onBack={handleBack} />;
      case 'documents':
        return <DocumentsModule onBack={handleBack} />;
      case 'alerts':
        return <AlertsModule onBack={handleBack} />;
      case 'waste':
        return <WasteModule onBack={handleBack} />;
      default:
        return <ServiceModules onModuleSelect={handleModuleSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <KioskHeader />
      <AlertTicker />
      <VoiceCommander onNavigate={handleModuleSelect} />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-3 px-6 text-center text-sm">
        <div className="flex items-center justify-between">
          <span>© 2026 SUVIDHA - Government of India</span>
          <span className="opacity-70">Powered by Smart City Mission</span>
          <span className="opacity-70">Version 1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
