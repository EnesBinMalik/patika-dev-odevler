export interface BankAccountState {
  accountNumber: string;
  holderName: string;
  balance: number;
}

export type ResultType<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface TransactionRecord {
  id: string;
  timestamp: string;
  accountNumber: string;
  holderName: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  result: ResultType<void, string>;
  matchBranch: 'Ok(())' | 'Err(e)';
  balanceAfter: number;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'system' | 'compile' | 'success' | 'error' | 'info' | 'divider';
  message: string;
}

export interface TaskStep {
  id: number;
  title: string;
  description: string;
  rustCodeSnippet: string;
  lines: [number, number];
  isCompleted: boolean;
}
