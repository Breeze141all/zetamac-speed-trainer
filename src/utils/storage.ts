import type { DailyStats, GameSettings, GameSummary } from '../types';

export const DEFAULT_SETTINGS: GameSettings = {
  durationSec: 120,
  targetScore: 45,
  operators: {
    add: true,
    sub: true,
    mul: true,
    div: true,
  },
  addRange1: [2, 100],
  addRange2: [2, 100],
  mulRange1: [2, 12],
  mulRange2: [2, 100],
  sound: true,
  haptics: true,
  numpadLayout: 'phone', // 1-2-3 on top for intuitive mobile typing
};

const SETTINGS_KEY = 'zetamac_mobile_settings';
const SESSIONS_KEY = 'zetamac_mobile_sessions';
const STATS_KEY = 'zetamac_mobile_stats';

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function loadSessions(): GameSummary[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSession(summary: GameSummary): void {
  try {
    const sessions = loadSessions();
    sessions.unshift(summary);
    // Keep max 100 sessions to avoid unbounded memory growth
    const trimmed = sessions.slice(0, 100);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
    updateDailyStats(summary);
  } catch {
    // Ignore
  }
}

export function loadDailyStats(): DailyStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return { streak: 0, lastDate: '', bestScore: 0, totalDrills: 0 };
    }
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastDate: '', bestScore: 0, totalDrills: 0 };
  }
}

function updateDailyStats(summary: GameSummary): void {
  try {
    const stats = loadDailyStats();
    const today = summary.dateKey;

    let newStreak = stats.streak;
    if (stats.lastDate === today) {
      // Already trained today, keep streak
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (stats.lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const updated: DailyStats = {
      streak: newStreak,
      lastDate: today,
      bestScore: Math.max(stats.bestScore, summary.score),
      totalDrills: stats.totalDrills + 1,
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}
