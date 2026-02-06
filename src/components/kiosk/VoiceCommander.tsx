import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommanderProps {
  onNavigate: (module: string) => void;
}

const VoiceCommander: React.FC<VoiceCommanderProps> = ({ onNavigate }) => {
  const [isListening, setIsListening] = useState(false);
  const { t, i18n } = useTranslation();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      // Set language based on current i18n language
      recognitionInstance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice Command:', transcript);
        processCommand(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error(t('voice_error') || 'Voice command failed. Try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [i18n.language]);

  const processCommand = (command: string) => {
    // Navigation Commands
    if (command.includes('electricity') || command.includes('power') || command.includes('bijli')) {
      onNavigate('bills');
      toast.success('Opening Electricity Bills');
    } else if (command.includes('water') || command.includes('pani')) {
      onNavigate('bills'); // Usually bills covers water too
      toast.success('Opening Water Bills');
    } else if (command.includes('waste') || command.includes('garbage') || command.includes('kachra')) {
      onNavigate('waste');
      toast.success('Opening Waste Management');
    } else if (command.includes('complaint') || command.includes('shikayat')) {
      onNavigate('complaint');
    } else if (command.includes('home') || command.includes('back') || command.includes('wapas')) {
      onNavigate('home');
    } 
    // Language Commands
    else if (command.includes('hindi') || command.includes('hindustani')) {
      i18n.changeLanguage('hi');
      toast.success('Language switched to Hindi');
    } else if (command.includes('english') || command.includes('angrezi')) {
      i18n.changeLanguage('en');
      toast.success('Language switched to English');
    } else {
      toast('Command not recognized', { description: `You said: "${command}"` });
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast.info('Listening...', { description: 'Say "Electricity", "Waste", "Hindi", etc.' });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!recognition) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        variant={isListening ? "destructive" : "default"}
        className={`rounded-full w-16 h-16 shadow-lg transition-all duration-300 ${isListening ? 'animate-pulse scale-110' : ''}`}
        onClick={toggleListening}
      >
        {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
      </Button>
    </div>
  );
};

export default VoiceCommander;
