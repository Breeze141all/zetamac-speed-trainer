import React from 'react';
import { X, Flame, Award, Zap, Trash2 } from 'lucide-react';
import type { DailyStats, GameSummary } from '../types';

interface DailyStatsModalProps {
  dailyStats: DailyStats;
  sessions: GameSummary[];
  onClose: () => void;
  onClearHistory: () => void;
}

export const DailyStatsModal: React.FC<DailyStatsModalProps> = ({
  dailyStats,
  sessions,
  onClose,
  onClearHistory,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-none flex items-center justify-center p-3 select-none">
      <div className="bg-white border border-zinc-200 rounded-md max-w-sm w-full max-h-[90vh] flex flex-col shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <span className="font-mono-numbers text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            DRILL ARCHIVE & ANALYTICS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-1">
                <Flame className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="text-xl font-mono-numbers font-bold text-zinc-900">
                {dailyStats.streak}d
              </div>
              <div className="text-[10px] uppercase font-mono-numbers text-zinc-500">Streak</div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-1">
                <Award className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="text-xl font-mono-numbers font-bold text-zinc-900">
                {dailyStats.bestScore}
              </div>
              <div className="text-[10px] uppercase font-mono-numbers text-zinc-500">Record</div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-sm text-center">
              <div className="flex justify-center text-zinc-700 mb-1">
                <Zap className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="text-xl font-mono-numbers font-bold text-zinc-900">
                {dailyStats.totalDrills}
              </div>
              <div className="text-[10px] uppercase font-mono-numbers text-zinc-500">Drills</div>
            </div>
          </div>

          {/* Session History List */}
          <div className="space-y-2 pt-2 border-t border-zinc-200">
            <span className="font-mono-numbers text-zinc-500 uppercase tracking-wider block text-[10px]">
              Session Log ({sessions.length})
            </span>

            {sessions.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 font-mono-numbers text-xs">
                No sessions completed yet. Start your first 120s drill!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {sessions.map((sess) => {
                  const passed = sess.score >= sess.targetScore;
                  const dateFormatted = new Date(sess.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={sess.id}
                      className="bg-zinc-50 border border-zinc-200 p-2 rounded-sm flex items-center justify-between font-mono-numbers text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-zinc-900 text-sm">{sess.score}</span>
                          <span
                            className={`text-[9px] px-1 rounded-xs font-semibold ${
                              passed ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {passed ? '≥45 MET' : 'BELOW 45'}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{dateFormatted}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-zinc-700 font-medium">
                          {sess.avgTimeSec.toFixed(2)}s/ans
                        </div>
                        <div className="text-[10px] text-zinc-400">{sess.durationSec}s drill</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 flex items-center justify-between">
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-zinc-500 hover:text-red-600 text-xs font-mono-numbers flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-mono-numbers font-medium rounded-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
