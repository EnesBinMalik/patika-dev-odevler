export interface TestAssertion {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  message?: string;
}

export interface TestCaseResult {
  id: string;
  title: string;
  requirementNumber: number;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  durationMs: number;
  assertions: TestAssertion[];
  error?: string;
  codeSnippet: string;
  explanation: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  lastRunAt: string | null;
}
