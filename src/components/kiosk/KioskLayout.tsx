import React, { useState } from 'react';
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
  const { isAuthenticated } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleType>('home');

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
