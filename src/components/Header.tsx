import React from 'react';
import { Volume2, VolumeX, Settings, BarChart2, RotateCcw } from 'lucide-react';
import type { DailyStats } from '../types';

interface HeaderProps {
  isPlaying: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onRestart?: () => void;
  dailyStats: DailyStats;
}

export const Header: React.FC<HeaderProps> = ({
  isPlaying,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenStats,
  onRestart,
  dailyStats,
}) => {
  return (
    <header className="w-full bg-white border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between select-none shrink-0">
      <div className="flex items-center space-x-2.5">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-sm tracking-tight text-zinc-900">ZETAMAC</span>
            <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-sm">
              GOAL ≥45
            </span>
          </div>
          {dailyStats.streak > 0 && !isPlaying && (
            <span className="text-[11px] font-mono-numbers text-zinc-500">
              STREAK: {dailyStats.streak}d • BEST: {dailyStats.bestScore}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {isPlaying && onRestart && (
          <button
            type="button"
            onClick={onRestart}
            title="Restart drill"
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 rounded-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 rounded-sm transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <VolumeX className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>

        {!isPlaying && (
          <>
            <button
              type="button"
              onClick={onOpenStats}
              title="Daily statistics & history"
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 rounded-sm transition-colors"
            >
              <BarChart2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              title="Drill settings"
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 rounded-sm transition-colors"
            >
              <Settings className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
