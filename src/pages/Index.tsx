import { AuthProvider } from '@/context/AuthContext';
import { KioskProvider } from '@/context/KioskContext';
import KioskLayout from '@/components/kiosk/KioskLayout';

const Index = () => {
  return (
    <AuthProvider>
      <KioskProvider>
        <KioskLayout />
      </KioskProvider>
    </AuthProvider>
  );
};

export default Index;
