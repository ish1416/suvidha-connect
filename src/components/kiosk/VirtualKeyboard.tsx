import React from 'react';
import { useKeyboard } from '@/context/KeyboardContext';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, Delete, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const VirtualKeyboard: React.FC = () => {
  const { isVisible, showKeyboard, hideKeyboard, handleKeyPress } = useKeyboard();

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 h-14 w-14 rounded-full shadow-xl border-2 border-primary/20 bg-background/90 backdrop-blur-md hover:bg-primary/10 hover:scale-105 transition-all duration-300"
        onClick={showKeyboard}
        title="Show Virtual Keyboard"
      >
        <Keyboard className="h-6 w-6 text-primary" />
      </Button>
    );
  }

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-2xl z-50 p-4 pb-8 animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="text-sm font-medium text-muted-foreground">Virtual Keyboard</div>
        <Button variant="ghost" size="sm" onClick={hideKeyboard}>
          <ChevronDown className="w-4 h-4 mr-1" />
          Hide
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-w-5xl mx-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-12 w-10 sm:w-14 text-lg font-medium active:scale-95 transition-transform"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
        
        {/* Bottom row */}
        <div className="flex justify-center gap-1.5 mt-1">
           <Button
            variant="secondary"
            className="h-12 px-6"
            onClick={() => handleKeyPress('Space')}
          >
            Space
          </Button>
          <Button
            variant="destructive"
            className="h-12 px-4"
            onClick={() => handleKeyPress('Backspace')}
          >
            <Delete className="w-5 h-5" />
          </Button>
          <Button
            variant="default"
            className="h-12 px-6 bg-primary"
            onClick={() => handleKeyPress('Enter')}
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
