import React from 'react';
import { Play, Flame, Award, Zap, Crosshair } from 'lucide-react';
import type { DailyStats, GameSettings } from '../types';

interface StartScreenProps {
  settings: GameSettings;
  dailyStats: DailyStats;
  onStart: () => void;
  onOpenSettings: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  settings,
  dailyStats,
  onStart,
  onOpenSettings,
}) => {
  const activeOpsList = [
    settings.operators.add ? '+' : null,
    settings.operators.sub ? '−' : null,
    settings.operators.mul ? '×' : null,
    settings.operators.div ? '÷' : null,
  ].filter(Boolean);

  const reqSpeedSec = (settings.durationSec / settings.targetScore).toFixed(2);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 max-w-md mx-auto w-full">
      {/* Target & Benchmark Card */}
      <div className="space-y-4 pt-2">
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <span className="text-xs font-mono-numbers text-zinc-500 uppercase tracking-wider">
              DRILL SPECIFICATION
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-mono-numbers px-2 py-0.5 bg-zinc-900 text-white rounded-sm">
              <Crosshair className="w-3 h-3" strokeWidth={2} />
              <span>TARGET ≥{settings.targetScore}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white border border-zinc-200 p-2.5 rounded-sm">
              <span className="text-[10px] uppercase font-mono-numbers text-zinc-500 block">
                Time Limit
              </span>
              <span className="text-xl font-mono-numbers font-semibold text-zinc-900">
                {settings.durationSec}s
              </span>
            </div>
            <div className="bg-white border border-zinc-200 p-2.5 rounded-sm">
              <span className="text-[10px] uppercase font-mono-numbers text-zinc-500 block">
                Required Pace
              </span>
              <span className="text-xl font-mono-numbers font-semibold text-zinc-900">
                ≤{reqSpeedSec}s/ans
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 bg-white border border-zinc-200 p-2.5 rounded-sm font-mono-numbers">
            <span>OPERATORS ({activeOpsList.length}/4):</span>
            <span className="font-semibold text-zinc-900 tracking-widest">
              {activeOpsList.join('  ')}
            </span>
          </div>
        </div>

        {/* Daily Performance Stats */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4">
          <div className="text-xs font-mono-numbers text-zinc-500 uppercase tracking-wider mb-2.5">
            DAILY DRILL TRACKER
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border border-zinc-200 p-2 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-0.5">
                <Flame className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <div className="text-lg font-mono-numbers font-semibold text-zinc-900">
                {dailyStats.streak}d
              </div>
              <div className="text-[9px] uppercase font-mono-numbers text-zinc-500">Streak</div>
            </div>

            <div className="bg-white border border-zinc-200 p-2 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-0.5">
                <Award className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <div className="text-lg font-mono-numbers font-semibold text-zinc-900">
                {dailyStats.bestScore}
              </div>
              <div className="text-[9px] uppercase font-mono-numbers text-zinc-500">Best Score</div>
            </div>

            <div className="bg-white border border-zinc-200 p-2 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-0.5">
                <Zap className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <div className="text-lg font-mono-numbers font-semibold text-zinc-900">
                {dailyStats.totalDrills}
              </div>
              <div className="text-[9px] uppercase font-mono-numbers text-zinc-500">Total Drills</div>
            </div>
          </div>
        </div>

        {/* Tactical Guidance */}
        <div className="border border-zinc-200 rounded-md p-3 text-xs text-zinc-600 space-y-1.5 bg-white">
          <div className="font-semibold text-zinc-900 font-mono-numbers text-[11px] uppercase">
            Execution Rules:
          </div>
          <div className="space-y-1 text-[11px] leading-relaxed text-zinc-600">
            <div>• Auto-advance on correct number — no Enter key needed.</div>
            <div>• Target 45 answers requires solving 1 problem every 2.66s.</div>
            <div>• Use physical keyboard (0-9) or dedicated touch numpad below.</div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 pb-2 space-y-2">
        <button
          type="button"
          onClick={onStart}
          className="w-full h-14 bg-zinc-900 hover:bg-black active:bg-zinc-800 text-white rounded-md font-mono-numbers font-medium text-base flex items-center justify-center space-x-2 transition-colors cursor-pointer select-none"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START 120s DRILL</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full py-2 text-xs font-mono-numbers text-zinc-500 hover:text-zinc-900 text-center transition-colors cursor-pointer"
        >
          Configure Operators & Ranges →
        </button>
      </div>
    </div>
  );
};
