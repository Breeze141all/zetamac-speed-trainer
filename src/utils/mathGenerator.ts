import type { GameSettings, Operator, Problem } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(settings: GameSettings): Problem {
  const activeOps: Operator[] = [];
  if (settings.operators.add) activeOps.push('+');
  if (settings.operators.sub) activeOps.push('-');
  if (settings.operators.mul) activeOps.push('*');
  if (settings.operators.div) activeOps.push('/');

  // Fallback to '+' if none selected
  const op = activeOps.length > 0 
    ? activeOps[Math.floor(Math.random() * activeOps.length)] 
    : '+';

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (op === '+') {
    const a = getRandomInt(settings.addRange1[0], settings.addRange1[1]);
    const b = getRandomInt(settings.addRange2[0], settings.addRange2[1]);
    return {
      id,
      num1: a,
      num2: b,
      operator: '+',
      answer: a + b,
      displayOperator: '+',
      displayStr: `${a} + ${b}`
    };
  }

  if (op === '-') {
    // Zetamac subtraction is the inverse of addition
    const a = getRandomInt(settings.addRange1[0], settings.addRange1[1]);
    const b = getRandomInt(settings.addRange2[0], settings.addRange2[1]);
    const sum = a + b;
    return {
      id,
      num1: sum,
      num2: a,
      operator: '-',
      answer: b,
      displayOperator: '−',
      displayStr: `${sum} − ${a}`
    };
  }

  if (op === '*') {
    const a = getRandomInt(settings.mulRange1[0], settings.mulRange1[1]);
    const b = getRandomInt(settings.mulRange2[0], settings.mulRange2[1]);
    const swap = Math.random() > 0.5;
    const num1 = swap ? b : a;
    const num2 = swap ? a : b;
    return {
      id,
      num1,
      num2,
      operator: '*',
      answer: a * b,
      displayOperator: '×',
      displayStr: `${num1} × ${num2}`
    };
  }

  // op === '/'
  // Division is inverse of multiplication
  const a = getRandomInt(settings.mulRange1[0], settings.mulRange1[1]);
  const b = getRandomInt(settings.mulRange2[0], settings.mulRange2[1]);
  const prod = a * b;
  return {
    id,
    num1: prod,
    num2: a,
    operator: '/',
    answer: b,
    displayOperator: '÷',
    displayStr: `${prod} ÷ ${a}`
  };
}
