import { useState, useCallback, useTransition } from 'react';
import type { GameSettings, GameSummary, Operator, ProblemResult } from './types';
import {
  loadSettings,
  saveSettings,
  loadDailyStats,
  loadSessions,
  saveSession,
} from './utils/storage';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryModal } from './components/SummaryModal';
import { SettingsModal } from './components/SettingsModal';
import { DailyStatsModal } from './components/DailyStatsModal';

export function App() {
  const [view, setView] = useState<'start' | 'game' | 'summary'>('start');
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [dailyStats, setDailyStats] = useState(() => loadDailyStats());
  const [sessions, setSessions] = useState(() => loadSessions());
  const [currentSummary, setCurrentSummary] = useState<GameSummary | null>(null);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);

  // Restart key generator for GameScreen remounting
  const [gameKey, setGameKey] = useState<number>(0);

  const [, startTransition] = useTransition();

  const handleStartDrill = useCallback(() => {
    setGameKey((prev) => prev + 1);
    startTransition(() => {
      setView('game');
    });
  }, []);

  const handleRestartDrill = useCallback(() => {
    setGameKey((prev) => prev + 1);
  }, []);

  const handleFinishDrill = useCallback(
    (results: ProblemResult[], durationSec: number) => {
      const score = results.length;
      const totalTime = durationSec;
      const avgTimeSec = score > 0 ? totalTime / score : 0;

      // Calculate operator breakdown
      const ops: Operator[] = ['+', '-', '*', '/'];
      const breakdown = {} as Record<Operator, { count: number; avgTime: number }>;
      ops.forEach((op) => {
        const opResults = results.filter((r) => r.problem.operator === op);
        const count = opResults.length;
        const totalOpTime = opResults.reduce((acc, cur) => acc + cur.timeSpentSec, 0);
        breakdown[op] = {
          count,
          avgTime: count > 0 ? totalOpTime / count : 0,
        };
      });

      const todayStr = new Date().toISOString().split('T')[0];
      const summary: GameSummary = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        dateKey: todayStr,
        score,
        targetScore: settings.targetScore,
        durationSec,
        results,
        avgTimeSec,
        operatorBreakdown: breakdown,
      };

      saveSession(summary);
      setCurrentSummary(summary);
      setDailyStats(loadDailyStats());
      setSessions(loadSessions());

      startTransition(() => {
        setView('summary');
      });
    },
    [settings.targetScore]
  );

  const handleToggleSound = useCallback(() => {
    setSettings((prev) => {
      const updated = { ...prev, sound: !prev.sound };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const handleSaveSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleClearHistory = useCallback(() => {
    localStorage.removeItem('zetamac_mobile_sessions');
    localStorage.removeItem('zetamac_mobile_stats');
    setSessions([]);
    setDailyStats({ streak: 0, lastDate: '', bestScore: 0, totalDrills: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans antialiased overflow-x-hidden">
      <Header
        isPlaying={view === 'game'}
        soundEnabled={settings.sound}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setShowSettings(true)}
        onOpenStats={() => setShowStats(true)}
        onRestart={handleRestartDrill}
        dailyStats={dailyStats}
      />

      <main className="flex-1 flex flex-col">
        {view === 'start' && (
          <StartScreen
            settings={settings}
            dailyStats={dailyStats}
            onStart={handleStartDrill}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        {view === 'game' && (
          <GameScreen
            key={gameKey}
            settings={settings}
            onFinish={handleFinishDrill}
            onRestart={handleRestartDrill}
          />
        )}

        {view === 'summary' && currentSummary && (
          <SummaryModal
            summary={currentSummary}
            onRetry={handleStartDrill}
            onHome={() => setView('start')}
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Daily Stats Modal */}
      {showStats && (
        <DailyStatsModal
          dailyStats={dailyStats}
          sessions={sessions}
          onClose={() => setShowStats(false)}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}

export default App;
