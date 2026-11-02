export interface MemoryVariable {
  name: string;
  type: string;
  scope: 'main' | 'concatenate_strings';
  stackAddress: string;
  ptr?: string;
  len?: number;
  capacity?: number;
  pointsToHeapAddress?: string;
  borrowedFrom?: string;
  isMut: boolean;
  status: 'active' | 'borrowed' | 'moved' | 'dropped';
}

export interface HeapAllocation {
  address: string;
  content: string;
  ownerVar: string;
  allocatedInStep: number;
  freedInStep?: number;
  capacityBytes: number;
  usedBytes: number;
}

export interface ExecutionStep {
  stepNumber: number;
  title: string;
  line: number;
  codeSnippet: string;
  explanation: string;
  activeFunction: 'main' | 'concatenate_strings';
  variables: MemoryVariable[];
  heap: HeapAllocation[];
  stdout?: string;
  borrowCheckerNote?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  requirement: string;
  passed: boolean;
  hint: string;
  details?: string;
}

export interface CompilationResult {
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  isRealPlayground: boolean;
  warnings: string[];
}
