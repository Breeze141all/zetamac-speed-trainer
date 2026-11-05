export type Operator = '+' | '-' | '*' | '/';

export interface Problem {
  id: string;
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
  displayOperator: string;
  displayStr: string;
}

export interface ProblemResult {
  problem: Problem;
  timeSpentSec: number;
}

export interface GameSettings {
  durationSec: number;
  targetScore: number;
  operators: {
    add: boolean;
    sub: boolean;
    mul: boolean;
    div: boolean;
  };
  addRange1: [number, number];
  addRange2: [number, number];
  mulRange1: [number, number];
  mulRange2: [number, number];
  sound: boolean;
  haptics: boolean;
  numpadLayout: 'phone' | 'calculator'; // phone: 1-2-3 top, calculator: 7-8-9 top
}

export interface GameSummary {
  id: string;
  timestamp: number;
  dateKey: string; // YYYY-MM-DD
  score: number;
  targetScore: number;
  durationSec: number;
  results: ProblemResult[];
  avgTimeSec: number;
  operatorBreakdown: Record<Operator, { count: number; avgTime: number }>;
}

export interface DailyStats {
  streak: number;
  lastDate: string;
  bestScore: number;
  totalDrills: number;
}
