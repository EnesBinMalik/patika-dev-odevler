export type ThreadStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED' | 'ERROR';

export interface ThreadWorker {
  id: number;
  name: string;
  rangeStart: number;
  rangeEnd: number;
  totalItems: number;
  processedCount: number;
  currentNumber: number | null;
  status: ThreadStatus;
  oddFound: number;
  evenFound: number;
  color: string;
  badgeBg: string;
  progressPercent: number;
  lostCount?: number; // In unsafe race condition mode
}

export interface ThreadLog {
  id: string;
  timestamp: string;
  threadId: number;
  threadName: string;
  message: string;
  type: 'info' | 'odd' | 'even' | 'warning' | 'success';
}

export type CodeTab = 'single' | 'oop' | 'executor';
export type AppTab = 'simulation' | 'code' | 'terminal' | 'report' | 'architecture';
