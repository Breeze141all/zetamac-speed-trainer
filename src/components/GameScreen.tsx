import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { GameSettings, Problem, ProblemResult } from '../types';
import { generateProblem } from '../utils/mathGenerator';
import { playSuccessSound, triggerHaptic, playFinishSound } from '../utils/soundHaptics';
import { Numpad } from './Numpad';

interface GameScreenProps {
  settings: GameSettings;
  onFinish: (results: ProblemResult[], durationSec: number) => void;
  onRestart: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  onFinish,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(settings.durationSec);
  const [currentProblem, setCurrentProblem] = useState<Problem>(() => generateProblem(settings));
  const [inputVal, setInputVal] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [flashSuccess, setFlashSuccess] = useState<boolean>(false);

  // References for tracking timing precisely without re-render drift
  const resultsRef = useRef<ProblemResult[]>([]);
  const problemStartTimeRef = useRef<number>(performance.now());
  const gameStartTimeRef = useRef<number>(performance.now());
  const timerIntervalRef = useRef<number | null>(null);

  // Timer loop
  useEffect(() => {
    gameStartTimeRef.current = performance.now();
    problemStartTimeRef.current = performance.now();

    timerIntervalRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - gameStartTimeRef.current) / 1000;
      const remaining = Math.max(0, settings.durationSec - Math.floor(elapsed));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        playFinishSound(settings.sound);
        onFinish(resultsRef.current, settings.durationSec);
      }
    }, 200);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [settings.durationSec, settings.sound, onFinish]);

  // Handle digit / answer evaluation
  const handleDigit = useCallback((digit: string) => {
    setInputVal((prev) => {
      const nextVal = prev + digit;
      const numAnswer = parseInt(nextVal, 10);

      if (!isNaN(numAnswer) && numAnswer === currentProblem.answer) {
        // Correct answer!
        const timeSpent = (performance.now() - problemStartTimeRef.current) / 1000;
        resultsRef.current.push({
          problem: currentProblem,
          timeSpentSec: timeSpent,
        });

        playSuccessSound(settings.sound);
        triggerHaptic(settings.haptics, 16);

        setScore((s) => s + 1);
        setFlashSuccess(true);
        setTimeout(() => setFlashSuccess(false), 120);

        // Prep next question
        problemStartTimeRef.current = performance.now();
        setCurrentProblem(generateProblem(settings));
        return '';
      }

      return nextVal;
    });
  }, [currentProblem, settings]);

  const handleBackspace = useCallback(() => {
    setInputVal((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setInputVal('');
  }, []);

  // Keyboard support for desktop / laptop / iPad keyboards
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleBackspace, handleClear]);

  // Calculate live pace
  const elapsedSec = Math.max(1, settings.durationSec - timeLeft);
  const livePace = ((score / elapsedSec) * settings.durationSec).toFixed(1);
  const expectedAtCurrentTime = (settings.targetScore * (elapsedSec / settings.durationSec));
  const paceDelta = Math.round(score - expectedAtCurrentTime);

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const progressPercent = ((settings.durationSec - timeLeft) / settings.durationSec) * 100;

  return (
    <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full select-none">
      {/* Top Hairline Progress Bar */}
      <div className="w-full bg-zinc-100 h-1 relative overflow-hidden">
        <div
          className="h-full bg-zinc-900 transition-all duration-200 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Live Status HUD */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Timer Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-2 text-center">
            <span className="text-[10px] font-mono-numbers uppercase text-zinc-500 block">
              Time Left
            </span>
            <span
              className={`text-2xl font-mono-numbers font-semibold ${
                timeLeft <= 15 ? 'text-red-600' : 'text-zinc-900'
              }`}
            >
              {timeFormatted}
            </span>
          </div>

          {/* Score Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-2 text-center">
            <span className="text-[10px] font-mono-numbers uppercase text-zinc-500 block">
              Score / Target
            </span>
            <span className="text-2xl font-mono-numbers font-semibold text-zinc-900">
              {score}
              <span className="text-xs text-zinc-500 font-normal">/{settings.targetScore}</span>
            </span>
          </div>

          {/* Live Pace */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-2 text-center">
            <span className="text-[10px] font-mono-numbers uppercase text-zinc-500 block">
              Live Pace
            </span>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-xl font-mono-numbers font-semibold text-zinc-900">
                {livePace}
              </span>
              <span
                className={`text-[10px] font-mono-numbers px-1 rounded-xs font-semibold ${
                  paceDelta >= 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {paceDelta >= 0 ? `+${paceDelta}` : `${paceDelta}`}
              </span>
            </div>
          </div>
        </div>

        {/* Target Benchmark Hairline Bar */}
        <div className="bg-white border border-zinc-200 px-3 py-1.5 rounded-sm flex items-center justify-between text-[11px] font-mono-numbers text-zinc-600">
          <span>REQUIRED SPEED: ≤{(settings.durationSec / settings.targetScore).toFixed(2)}s/ans</span>
          <span className="font-semibold text-zinc-900">
            {score >= settings.targetScore ? 'TARGET REACHED!' : `${settings.targetScore - score} left`}
          </span>
        </div>
      </div>

      {/* Main Problem Display Container */}
      <div className="px-4 py-2 flex-1 flex flex-col items-center justify-center">
        <div
          className={`w-full max-w-xs p-6 bg-zinc-50 border rounded-md text-center transition-colors duration-100 ${
            flashSuccess ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200'
          }`}
        >
          {/* Question Equation */}
          <div className="text-3xl sm:text-4xl font-mono-numbers font-semibold text-zinc-900 tracking-tight">
            {currentProblem.displayStr}
          </div>

          {/* Answer Slot */}
          <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-center">
            <div className="min-w-[120px] h-14 bg-white border border-zinc-300 rounded-sm px-4 flex items-center justify-center font-mono-numbers text-3xl font-bold text-zinc-900">
              {inputVal.length > 0 ? (
                inputVal
              ) : (
                <span className="w-0.5 h-6 bg-zinc-400 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Numpad */}
      <Numpad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onClear={handleClear}
        layout={settings.numpadLayout}
        sound={settings.sound}
        haptics={settings.haptics}
      />
    </div>
  );
};
