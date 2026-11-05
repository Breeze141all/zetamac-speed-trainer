import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { GameSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';

interface SettingsModalProps {
  settings: GameSettings;
  onSave: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [local, setLocal] = React.useState<GameSettings>({ ...settings });

  const handleToggleOp = (op: keyof GameSettings['operators']) => {
    // Prevent unchecking all operators
    const nextOps = { ...local.operators, [op]: !local.operators[op] };
    const hasAtLeastOne = Object.values(nextOps).some(Boolean);
    if (!hasAtLeastOne) return;
    setLocal({ ...local, operators: nextOps });
  };

  const handleResetDefaults = () => {
    setLocal({ ...DEFAULT_SETTINGS });
  };

  const handleSaveAndClose = () => {
    onSave(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-none flex items-center justify-center p-3 select-none">
      <div className="bg-white border border-zinc-200 rounded-md max-w-sm w-full max-h-[90vh] flex flex-col shadow-sm">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <span className="font-mono-numbers text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            DRILL PARAMETERS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Target Score & Time */}
          <div className="space-y-2">
            <span className="font-mono-numbers text-zinc-500 uppercase tracking-wider block text-[10px]">
              Target & Duration
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-600 font-mono-numbers block mb-1">Target Score:</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={local.targetScore}
                  onChange={(e) => setLocal({ ...local, targetScore: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2 py-1.5 font-mono-numbers text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="text-zinc-600 font-mono-numbers block mb-1">Time (seconds):</label>
                <input
                  type="number"
                  min={10}
                  max={600}
                  step={10}
                  value={local.durationSec}
                  onChange={(e) => setLocal({ ...local, durationSec: Math.max(10, parseInt(e.target.value, 10) || 120) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-2 py-1.5 font-mono-numbers text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Active Operators */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <span className="font-mono-numbers text-zinc-500 uppercase tracking-wider block text-[10px]">
              Arithmetic Operators
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'add', label: 'Addition (+)' },
                { key: 'sub', label: 'Subtraction (–)' },
                { key: 'mul', label: 'Multiplication (×)' },
                { key: 'div', label: 'Division (÷)' },
              ].map(({ key, label }) => {
                const isChecked = local.operators[key as keyof GameSettings['operators']];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleOp(key as keyof GameSettings['operators'])}
                    className={`px-2.5 py-2 rounded-sm border font-mono-numbers text-xs flex items-center justify-between transition-colors ${
                      isChecked
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <span>{label}</span>
                    <span>{isChecked ? 'ON' : 'OFF'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ergonomics & Numpad */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <span className="font-mono-numbers text-zinc-500 uppercase tracking-wider block text-[10px]">
              Ergonomic Controls
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-700 font-mono-numbers">Numpad Layout</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setLocal({ ...local, numpadLayout: 'phone' })}
                    className={`px-2 py-1 rounded-sm border text-[11px] font-mono-numbers ${
                      local.numpadLayout === 'phone'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    1-2-3 Top
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocal({ ...local, numpadLayout: 'calculator' })}
                    className={`px-2 py-1 rounded-sm border text-[11px] font-mono-numbers ${
                      local.numpadLayout === 'calculator'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    7-8-9 Top
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-700 font-mono-numbers">Audio Clicks</span>
                <button
                  type="button"
                  onClick={() => setLocal({ ...local, sound: !local.sound })}
                  className={`px-2 py-1 rounded-sm border text-[11px] font-mono-numbers ${
                    local.sound
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {local.sound ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-700 font-mono-numbers">Haptic Vibration</span>
                <button
                  type="button"
                  onClick={() => setLocal({ ...local, haptics: !local.haptics })}
                  className={`px-2 py-1 rounded-sm border text-[11px] font-mono-numbers ${
                    local.haptics
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {local.haptics ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-200 flex items-center justify-between space-x-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 text-zinc-600 hover:text-zinc-900 text-xs font-mono-numbers flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-mono-numbers font-medium rounded-sm cursor-pointer"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
