import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  bills as initialBills, 
  complaints as initialComplaints, 
  serviceRequests as initialRequests,
  integrityRecords as initialRecords,
  generateHash,
  generateReferenceNumber,
  generateTransactionId,
  type Bill,
  type Complaint,
  type ServiceRequest,
  type IntegrityRecord
} from '@/lib/mockData';

interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  timestamp: string;
}

interface KioskContextType {
  bills: Bill[];
  complaints: Complaint[];
  serviceRequests: ServiceRequest[];
  integrityRecords: IntegrityRecord[];
  
  // Bill Operations
  payBill: (billId: string, method: string) => Promise<PaymentResult>;
  
  // Complaint Operations
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'integrityHash'>) => Promise<string>;
  
  // Service Request Operations
  submitServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'referenceNumber' | 'status'>) => Promise<string>;
  
  // Tracking
  getComplaintStatus: (complaintId: string) => Complaint | undefined;
  getRequestStatus: (requestId: string) => ServiceRequest | undefined;
  
  // Integrity
  verifyIntegrity: (recordId: string) => boolean;

  // TTS
  ttsEnabled: boolean;
  toggleTTS: () => void;
  speak: (text: string) => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialRequests);
  const [integrityRecords, setIntegrityRecords] = useState<IntegrityRecord[]>(initialRecords);
  
  // TTS State
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find the best voice
    const currentLang = i18n.language; // 'en' or 'hi'
    
    // Preference: 1. Exact Region (IN), 2. Language Match, 3. Default
    let targetVoice = voices.find(v => v.lang === (currentLang === 'hi' ? 'hi-IN' : 'en-IN'));
    
    if (!targetVoice) {
      targetVoice = voices.find(v => v.lang.startsWith(currentLang));
    }
    
    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang;
    } else {
      // Fallback
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled, i18n.language, voices]);

  const toggleTTS = useCallback(() => {
    setTtsEnabled(prev => {
      if (prev) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  }, []);

  const payBill = async (billId: string, method: string): Promise<PaymentResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
    
    const bill = bills.find(b => b.id === billId);
    if (!bill) {
      return { success: false, transactionId: '', amount: 0, timestamp: '' };
    }

    const transactionId = generateTransactionId();
    const timestamp = new Date().toISOString();

    // Update bill status
    setBills(prev => prev.map(b => 
      b.id === billId 
        ? { 
            ...b, 
            status: 'paid' as const,
            previousPayments: [
              { date: timestamp.split('T')[0], amount: b.amount, transactionId },
              ...b.previousPayments
            ]
          }
        : b
    ));

    // Add integrity record
    const lastHash = integrityRecords.length > 0 
      ? integrityRecords[integrityRecords.length - 1].hash 
      : '0'.repeat(64);
    
    const newRecord: IntegrityRecord = {
      id: `IR${Date.now()}`,
      recordType: 'payment',
      recordId: transactionId,
      hash: generateHash(`${transactionId}${bill.amount}${timestamp}${lastHash}`),
      timestamp,
      previousHash: lastHash,
      verified: true
    };
    
    setIntegrityRecords(prev => [...prev, newRecord]);

    return {
      success: true,
      transactionId,
      amount: bill.amount,
      timestamp
    };
  };

  const submitComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'integrityHash'>): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const timestamp = new Date().toISOString();
    const complaintId = `COMP${Date.now().toString().slice(-6)}`;
    
    const lastHash = integrityRecords.length > 0 
      ? integrityRecords[integrityRecords.length - 1].hash 
      : '0'.repeat(64);
    
    const integrityHash = generateHash(`${complaintId}${complaintData.category}${timestamp}${lastHash}`);
    
    const newComplaint: Complaint = {
      ...complaintData,
      id: complaintId,
      createdAt: timestamp,
      updatedAt: timestamp,
      integrityHash
    };
    
    setComplaints(prev => [...prev, newComplaint]);

    // Add integrity record
    const newRecord: IntegrityRecord = {
      id: `IR${Date.now()}`,
      recordType: 'complaint',
      recordId: complaintId,
      hash: integrityHash,
      timestamp,
      previousHash: lastHash,
      verified: true
    };
    
    setIntegrityRecords(prev => [...prev, newRecord]);

    return complaintId;
  };

  const submitServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'referenceNumber' | 'status'>): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const timestamp = new Date().toISOString();
    const referenceNumber = generateReferenceNumber(requestData.type);
    
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `REQ${Date.now().toString().slice(-6)}`,
      referenceNumber,
      status: 'submitted',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setServiceRequests(prev => [...prev, newRequest]);

    // Add integrity record
    const lastHash = integrityRecords.length > 0 
      ? integrityRecords[integrityRecords.length - 1].hash 
      : '0'.repeat(64);
    
    const newRecord: IntegrityRecord = {
      id: `IR${Date.now()}`,
      recordType: 'request',
      recordId: referenceNumber,
      hash: generateHash(`${referenceNumber}${requestData.type}${timestamp}${lastHash}`),
      timestamp,
      previousHash: lastHash,
      verified: true
    };
    
    setIntegrityRecords(prev => [...prev, newRecord]);

    return referenceNumber;
  };

  const getComplaintStatus = (complaintId: string): Complaint | undefined => {
    return complaints.find(c => c.id === complaintId);
  };

  const getRequestStatus = (requestId: string): ServiceRequest | undefined => {
    return serviceRequests.find(r => r.referenceNumber === requestId || r.id === requestId);
  };

  const verifyIntegrity = (recordId: string): boolean => {
    const record = integrityRecords.find(r => r.recordId === recordId);
    return record?.verified ?? false;
  };

  return (
    <KioskContext.Provider
      value={{
        bills,
        complaints,
        serviceRequests,
        integrityRecords,
        payBill,
        submitComplaint,
        submitServiceRequest,
        getComplaintStatus,
        getRequestStatus,
        verifyIntegrity,
        ttsEnabled,
        toggleTTS,
        speak
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
