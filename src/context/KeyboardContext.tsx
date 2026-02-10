import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface KeyboardContextType {
  isVisible: boolean;
  showKeyboard: () => void;
  hideKeyboard: () => void;
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  handleKeyPress: (key: string) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  
  // Keep track of the input we are focused on
  const handleFocus = useCallback((e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const input = target as HTMLInputElement | HTMLTextAreaElement;
      // Don't show for hidden, submit, button, etc
      if (input.tagName === 'INPUT') {
        const type = (input as HTMLInputElement).type;
        if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file'].includes(type)) return;
      }
      
      setActiveInput(input);
      // setIsVisible(true); // Disabled auto-show
    }
  }, []);

  // Handle outside clicks to close keyboard (optional, might be annoying in kiosk)
  // For kiosk, maybe we only close explicitly or when focus is lost? 
  // Let's keep it simple: manual close or blur.
  
  useEffect(() => {
    document.addEventListener('focusin', handleFocus);
    return () => {
      document.removeEventListener('focusin', handleFocus);
    };
  }, [handleFocus]);

  const showKeyboard = () => setIsVisible(true);
  const hideKeyboard = () => setIsVisible(false);

  const handleKeyPress = (key: string) => {
    if (!activeInput) return;

    const input = activeInput;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const value = input.value;

    let newValue = value;
    let newCursorPos = start;

    if (key === 'Backspace') {
      if (start === end && start > 0) {
        newValue = value.slice(0, start - 1) + value.slice(end);
        newCursorPos = start - 1;
      } else {
        newValue = value.slice(0, start) + value.slice(end);
        newCursorPos = start;
      }
    } else if (key === 'Enter') {
      // Maybe submit? Or just hide? Or newline for textarea?
      if (input.tagName === 'TEXTAREA') {
        newValue = value.slice(0, start) + '\n' + value.slice(end);
        newCursorPos = start + 1;
      } else {
        // For inputs, Enter usually submits or moves next.
        // For now, let's just hide keyboard
        hideKeyboard();
        return;
      }
    } else if (key === 'Space') {
       newValue = value.slice(0, start) + ' ' + value.slice(end);
       newCursorPos = start + 1;
    } else {
      newValue = value.slice(0, start) + key + value.slice(end);
      newCursorPos = start + 1;
    }

    // Trigger React change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    
    // Fallback for textarea
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

    const setter = input.tagName === 'TEXTAREA' ? nativeTextAreaValueSetter : nativeInputValueSetter;
    
    if (setter) {
      setter.call(input, newValue);
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }

    // Restore focus and cursor (often lost after setting value)
    // We need to wait a tick for React to process
    setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <KeyboardContext.Provider value={{ isVisible, showKeyboard, hideKeyboard, activeInput, handleKeyPress }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};
