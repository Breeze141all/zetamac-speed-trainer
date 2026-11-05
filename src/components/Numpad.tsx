import React, { useCallback } from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { playKeySound, triggerHaptic } from '../utils/soundHaptics';

interface NumpadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  layout: 'phone' | 'calculator';
  sound: boolean;
  haptics: boolean;
  disabled?: boolean;
}

export const Numpad: React.FC<NumpadProps> = ({
  onDigit,
  onBackspace,
  onClear,
  layout,
  sound,
  haptics,
  disabled = false,
}) => {
  const handlePress = useCallback(
    (action: () => void) => {
      if (disabled) return;
      playKeySound(sound);
      triggerHaptic(haptics, 10);
      action();
    },
    [disabled, sound, haptics]
  );

  const phoneRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  const calcRows = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ];

  const rows = layout === 'phone' ? phoneRows : calcRows;

  return (
    <div className="w-full max-w-sm mx-auto select-none px-3 pb-4 pt-1">
      <div className="grid grid-cols-3 gap-2">
        {rows.flat().map((d) => (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              handlePress(() => onDigit(d));
            }}
            className="h-14 sm:h-16 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 active:scale-[0.97] border border-zinc-200 rounded-md text-2xl font-mono-numbers font-medium text-zinc-900 transition-transform cursor-pointer touch-manipulation focus:outline-none"
          >
            {d}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress(onClear);
          }}
          title="Clear input"
          className="h-14 sm:h-16 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 active:scale-[0.97] border border-zinc-200 rounded-md text-zinc-700 font-mono-numbers text-sm font-semibold transition-transform cursor-pointer touch-manipulation focus:outline-none"
        >
          <span className="flex items-center space-x-1">
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            <span>CLR</span>
          </span>
        </button>

        {/* 0 Button */}
        <button
          type="button"
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress(() => onDigit('0'));
          }}
          className="h-14 sm:h-16 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 active:scale-[0.97] border border-zinc-200 rounded-md text-2xl font-mono-numbers font-medium text-zinc-900 transition-transform cursor-pointer touch-manipulation focus:outline-none"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress(onBackspace);
          }}
          title="Backspace"
          className="h-14 sm:h-16 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 active:scale-[0.97] border border-zinc-200 rounded-md text-zinc-700 transition-transform cursor-pointer touch-manipulation focus:outline-none"
        >
          <Delete className="w-6 h-6" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
