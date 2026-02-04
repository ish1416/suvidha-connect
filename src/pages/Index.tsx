import { AuthProvider } from '@/context/AuthContext';
import { KioskProvider } from '@/context/KioskContext';
import { KeyboardProvider } from '@/context/KeyboardContext';
import KioskLayout from '@/components/kiosk/KioskLayout';
import VirtualKeyboard from '@/components/kiosk/VirtualKeyboard';

const Index = () => {
  return (
    <AuthProvider>
      <KioskProvider>
        <KeyboardProvider>
          <KioskLayout />
          <VirtualKeyboard />
        </KeyboardProvider>
      </KioskProvider>
    </AuthProvider>
  );
};

export default Index;
