export type CalculatorTab = 'calculator' | 'calculus' | 'java-code' | 'terminal' | 'algorithms';

export interface HistoryItem {
  id: string;
  operation: string;
  expression: string;
  result: string | number;
  steps?: string[];
  timestamp: string;
}

export interface PolynomialTerm {
  degree: number;
  coefficient: number;
}

export interface CalculusResult {
  original: string;
  derivative: string;
  derivativeSteps: string[];
  integral: string;
  integralSteps: string[];
  derivativeEvaluated?: { x: number; result: number };
  definiteIntegral?: { a: number; b: number; result: number };
}

export interface SquareRootStep {
  iteration: number;
  guess: number;
  nextGuess: number;
  difference: number;
}
