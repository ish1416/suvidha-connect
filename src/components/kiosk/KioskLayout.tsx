import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import KioskHeader from './KioskHeader';
import LoginScreen from './LoginScreen';
import ServiceModules from './ServiceModules';
import BillPaymentModule from './BillPaymentModule';
import ComplaintModule from './ComplaintModule';
import NewServiceModule from './NewServiceModule';
import TrackStatusModule from './TrackStatusModule';
import DocumentsModule from './DocumentsModule';
import AlertsModule from './AlertsModule';
import WasteModule from './WasteModule';
import AppointmentModule from './AppointmentModule';
import RewardsModule from './RewardsModule';
import VoiceCommander from './VoiceCommander';
import ChatAssistant from './ChatAssistant';
import { useAuth } from '@/context/AuthContext';

type ModuleType = 'home' | 'bills' | 'complaint' | 'newService' | 'track' | 'documents' | 'alerts' | 'waste' | 'appointment' | 'rewards';

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
      case 'appointment':
        return <AppointmentModule onBack={handleBack} />;
      case 'rewards':
        return <RewardsModule onBack={handleBack} />;
      default:
        return <ServiceModules onModuleSelect={handleModuleSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <KioskHeader />
      <VoiceCommander onNavigate={handleModuleSelect} />
      <ChatAssistant onNavigate={handleModuleSelect} />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-3 md:py-4 px-4 md:px-6 text-center text-xs border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-[10px] md:text-xs">SYSTEM ONLINE • v1.0.0</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6 opacity-80 text-[10px] md:text-xs">
            <span>© 2026 SUVIDHA - Govt of India</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Powered by Smart City Mission</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] uppercase tracking-wider opacity-60">
             <span>SECURE CONNECTION</span>
             <span className="hidden md:inline">DPDP COMPLIANT</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
