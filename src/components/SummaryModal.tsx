import React, { useState } from 'react';
import { RotateCcw, Home, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { GameSummary, Operator } from '../types';

interface SummaryModalProps {
  summary: GameSummary;
  onRetry: () => void;
  onHome: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  summary,
  onRetry,
  onHome,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const isGoalAchieved = summary.score >= summary.targetScore;

  const operators: Operator[] = ['+', '-', '*', '/'];
  const opSymbols: Record<Operator, string> = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 max-w-md mx-auto w-full select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Score & Verdict Banner */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 text-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-sm text-xs font-mono-numbers mb-2 bg-white border border-zinc-200">
            {isGoalAchieved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" strokeWidth={2} />
                <span className="font-semibold text-zinc-900">GOAL ACHIEVED (≥{summary.targetScore})</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-zinc-600" strokeWidth={2} />
                <span className="font-semibold text-zinc-700">
                  BELOW TARGET ({summary.score - summary.targetScore})
                </span>
              </>
            )}
          </div>

          <div className="text-5xl font-mono-numbers font-bold text-zinc-900 tracking-tight">
            {summary.score}
          </div>
          <div className="text-xs font-mono-numbers text-zinc-500 mt-1">
            correct answers in {summary.durationSec} seconds
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 grid grid-cols-2 gap-2 text-left">
            <div className="bg-white border border-zinc-200 p-2 rounded-sm">
              <span className="text-[10px] uppercase font-mono-numbers text-zinc-500 block">
                Avg Velocity
              </span>
              <span className="text-base font-mono-numbers font-semibold text-zinc-900">
                {summary.avgTimeSec.toFixed(2)}s/ans
              </span>
            </div>

            <div className="bg-white border border-zinc-200 p-2 rounded-sm">
              <span className="text-[10px] uppercase font-mono-numbers text-zinc-500 block">
                Required Benchmark
              </span>
              <span className="text-base font-mono-numbers font-semibold text-zinc-900">
                ≤{(summary.durationSec / summary.targetScore).toFixed(2)}s/ans
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown by Operator */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-3">
          <div className="text-xs font-mono-numbers text-zinc-500 uppercase tracking-wider mb-2">
            OPERATOR PERFORMANCE BREAKDOWN
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {operators.map((op) => {
              const data = summary.operatorBreakdown[op] || { count: 0, avgTime: 0 };
              return (
                <div key={op} className="bg-white border border-zinc-200 p-2 rounded-sm text-center">
                  <div className="text-sm font-semibold text-zinc-900 font-mono-numbers">
                    {opSymbols[op]}
                  </div>
                  <div className="text-base font-mono-numbers font-bold text-zinc-900 mt-0.5">
                    {data.count}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-zinc-500 mt-0.5">
                    {data.count > 0 ? `${data.avgTime.toFixed(1)}s` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problem History Accordion */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-mono-numbers text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <span>LOG OF SOLVED PROBLEMS ({summary.results.length})</span>
            {showHistory ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {showHistory && (
            <div className="border-t border-zinc-200 p-2 max-h-48 overflow-y-auto space-y-1 bg-white">
              {summary.results.map((res, index) => (
                <div
                  key={res.problem.id || index}
                  className="flex items-center justify-between px-2 py-1 text-xs font-mono-numbers border-b border-zinc-100 last:border-none"
                >
                  <span className="text-zinc-500 w-6">#{index + 1}</span>
                  <span className="text-zinc-900 font-medium flex-1 text-left">
                    {res.problem.displayStr} = {res.problem.answer}
                  </span>
                  <span className="text-zinc-600 font-medium">
                    {res.timeSpentSec.toFixed(2)}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 pb-2 space-y-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full h-14 bg-zinc-900 hover:bg-black active:bg-zinc-800 text-white rounded-md font-mono-numbers font-medium text-base flex items-center justify-center space-x-2 transition-colors cursor-pointer select-none"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2} />
          <span>TRY AGAIN (120s)</span>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="w-full h-11 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-md font-mono-numbers text-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer select-none"
        >
          <Home className="w-4 h-4" strokeWidth={1.75} />
          <span>RETURN TO DASHBOARD</span>
        </button>
      </div>
    </div>
  );
};
