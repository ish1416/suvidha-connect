import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citizens, type Citizen } from '@/lib/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  citizen: Citizen | null;
  language: 'en' | 'hi';
  loginWithOTP: (mobile: string, otp: string) => Promise<boolean>;
  loginWithConsumerId: (consumerId: string, pin: string) => Promise<boolean>;
  logout: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  sessionTimeout: number;
  resetSessionTimer: () => void;
  updateCitizen: (data: Partial<Citizen>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 180000; // 3 minutes for kiosk

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [sessionTimeout, setSessionTimeout] = useState(SESSION_TIMEOUT);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCitizen(null);
    setSessionTimeout(SESSION_TIMEOUT);
  }, []);

  const resetSessionTimer = useCallback(() => {
    setLastActivity(Date.now());
    setSessionTimeout(SESSION_TIMEOUT);
  }, []);

  const updateCitizen = useCallback((data: Partial<Citizen>) => {
    setCitizen(prev => prev ? { ...prev, ...data } : null);
  }, []);

  // Session timeout logic
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = SESSION_TIMEOUT - elapsed;
      
      if (remaining <= 0) {
        logout();
      } else {
        setSessionTimeout(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity, logout]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      resetSessionTimer();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isAuthenticated, resetSessionTimer]);

  const loginWithOTP = async (mobile: string, otp: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo: Accept any 6-digit OTP for demo purposes
    if (otp.length !== 6) return false;
    
    const foundCitizen = citizens.find(c => c.mobile === mobile);
    if (foundCitizen || mobile === '9876543210') {
      setCitizen(foundCitizen || citizens[0]);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    // For demo, accept any valid mobile with OTP "123456"
    if (mobile.length === 10 && otp === '123456') {
      setCitizen(citizens[0]);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    return false;
  };

  const loginWithConsumerId = async (consumerId: string, pin: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundCitizen = citizens.find(c => c.consumerId === consumerId && c.pin === pin);
    if (foundCitizen) {
      setCitizen(foundCitizen);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    // Demo: Accept ELEC2024001 with PIN 1234
    if (consumerId === 'ELEC2024001' && pin === '1234') {
      setCitizen(citizens[0]);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        citizen,
        language,
        loginWithOTP,
        loginWithConsumerId,
        logout,
        setLanguage,
        sessionTimeout,
        resetSessionTimer,
        updateCitizen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
