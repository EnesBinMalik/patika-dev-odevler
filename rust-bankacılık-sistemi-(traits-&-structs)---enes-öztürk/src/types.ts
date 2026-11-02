export interface BankAccountModel {
  account_number: string;
  holder_name: string;
  balance: number;
  initial_balance: number;
  color_gradient: string;
  avatar_bg: string;
  currency: string;
}

export interface Transaction {
  id: string;
  account_number: string;
  holder_name: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  balance_before: number;
  balance_after: number;
  timestamp: string;
  rust_call_expr: string;
  status: 'ok' | 'err';
  error_message?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  type: 'stdout' | 'stderr' | 'cargo' | 'memory' | 'success';
  content: string;
}

export interface ChecklistStep {
  id: number;
  step_title: string;
  description: string;
  rust_code_snippet: string;
  status: 'completed' | 'in_progress';
  test_result?: string;
}
