export type OperationVariant = 'Ekleme' | 'Cikarma' | 'Carpma' | 'Bolme';

export interface OperationState {
  num1: number;
  num2: number;
  operation: OperationVariant;
  symbol: '+' | '-' | '*' | '/';
}

export interface StepLog {
  id: string;
  stage: 'input' | 'parse' | 'enum_create' | 'pattern_match' | 'evaluation' | 'output';
  title: string;
  description: string;
  codeSnippet: string;
  data: Record<string, unknown>;
}

export interface TerminalEntry {
  type: 'prompt' | 'input' | 'stdout' | 'stderr' | 'system';
  text: string;
  timestamp: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  input: {
    num1: number;
    op: OperationVariant;
    symbol: string;
    num2: number;
  };
  expectedResult: number | string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  actualResult?: number | string;
  durationMs?: number;
}
