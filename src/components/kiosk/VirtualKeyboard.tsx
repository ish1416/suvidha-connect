import React, { useState } from 'react';
import { useKeyboard } from '@/context/KeyboardContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, Delete, Space, CornerDownLeft } from 'lucide-react';

const VirtualKeyboard: React.FC = () => {
  const { isVisible, hideKeyboard, handleKeyPress } = useKeyboard();
  const [shift, setShift] = useState(false);

  if (!isVisible) return null;

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const handleKey = (key: string) => {
    const finalKey = shift ? key.toUpperCase() : key;
    handleKeyPress(finalKey);
    if (shift) setShift(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t-2 border-slate-700 shadow-2xl z-50 animate-in slide-in-from-bottom duration-200">
      <div className="flex justify-between items-center px-3 py-2 bg-slate-900 border-b border-slate-700">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Virtual Keyboard</div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={hideKeyboard}
          className="h-7 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          Hide
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 p-2 pb-3 max-w-4xl mx-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-11 min-w-[2.5rem] flex-1 max-w-[3.5rem] text-base font-semibold bg-slate-700 hover:bg-slate-600 text-white border-slate-600 active:scale-95 transition-all shadow-sm"
                onClick={() => handleKey(key)}
              >
                {shift ? key.toUpperCase() : key}
              </Button>
            ))}
          </div>
        ))}
        
        <div className="flex justify-center gap-1 mt-1">
          <Button
            variant="outline"
            className={`h-11 px-4 text-sm font-semibold border-slate-600 active:scale-95 transition-all ${
              shift ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            onClick={() => setShift(!shift)}
          >
            ⇧ Shift
          </Button>
          <Button
            variant="outline"
            className="h-11 flex-1 max-w-xs text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-white border-slate-600 active:scale-95 transition-all"
            onClick={() => handleKeyPress(' ')}
          >
            <Space className="w-4 h-4 mr-2" />
            Space
          </Button>
          <Button
            variant="outline"
            className="h-11 px-4 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white border-red-700 active:scale-95 transition-all"
            onClick={() => handleKeyPress('Backspace')}
          >
            <Delete className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 px-4 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white border-green-700 active:scale-95 transition-all"
            onClick={() => handleKeyPress('Enter')}
          >
            <CornerDownLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
