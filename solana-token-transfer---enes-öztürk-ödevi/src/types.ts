export type AssignmentMode = 'initial' | 'step1' | 'optional' | 'custom';

export interface TokenAccount {
  name: string;
  pubkey: string;
  mint: string;
  owner: string;
  amount: number;
  decimals: number;
  symbol: string;
}

export interface TransactionReceipt {
  signature: string;
  slot: number;
  timestamp: string;
  fromPubkey: string;
  toPubkey: string;
  amount: number;
  symbol: string;
  fee: number;
  status: 'confirmed' | 'finalized';
  signer: string;
  signerNote: string;
  instruction: string;
  sourceOldBalance: number;
  sourceNewBalance: number;
  destOldBalance: number;
  destNewBalance: number;
}

export interface CargoTestCase {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  durationMs: number;
  stdout: string;
}

export interface CargoRunOutput {
  command: string;
  timestamp: string;
  compilationTime: string;
  passedCount: number;
  failedCount: number;
  ignoredCount: number;
  totalTime: string;
  tests: CargoTestCase[];
  rawTerminalOutput: string[];
}
