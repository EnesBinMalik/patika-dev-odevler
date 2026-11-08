export type AccountType = 'Checking' | 'Savings';

export type Currency = 'TRY' | 'USD' | 'EUR';

export interface BankTransaction {
  id: string;
  accountNumber: string;
  type: 'Deposit' | 'Withdrawal' | 'TransferIn' | 'TransferOut' | 'InterestAccrual';
  amount: decimalNumber;
  balanceAfter: decimalNumber;
  timestamp: string;
  description: string;
  targetAccount?: string;
  canUndo: boolean;
}

export type decimalNumber = number;

export interface BaseAccount {
  accountNumber: string;
  iban: string;
  currency: Currency;
  type: AccountType;
  createdDate: string;
  isActive: boolean;
  balance: decimalNumber;
  // Encapsulation demonstration property
  accountHolderId: string;
}

export interface CheckingAccount extends BaseAccount {
  type: 'Checking';
  overdraftLimit: decimalNumber; // KMH Limiti (Kredili Mevduat Hesabı)
  utilizedOverdraft: decimalNumber;
  transactionFee: decimalNumber;
}

export interface SavingsAccount extends BaseAccount {
  type: 'Savings';
  interestRateAnnual: number; // e.g. 45.0 for %45
  maturityDays: number; // 32, 92, 181, 365
  depositDate: string;
  accruedInterest: decimalNumber;
  earlyWithdrawalPenaltyRate: number; // % penalty if withdrawn before maturity
}

export type AnyAccount = CheckingAccount | SavingsAccount;

export interface Customer {
  id: string;
  fullName: string;
  tckn: string;
  email: string;
  customerType: 'Bireysel' | 'Kurumsal' | 'VIP';
  findexScore: number; // 1 - 1900
  monthlyIncome: decimalNumber;
  existingDebts: decimalNumber;
  accounts: AnyAccount[];
}

export interface QueueTicket {
  ticketNumber: string;
  customerId: string;
  customerName: string;
  ticketType: 'Bireysel' | 'Kurumsal' | 'VIP' | 'Gişe';
  issueTime: string;
  serviceStartTime?: string;
  status: 'Waiting' | 'Serving' | 'Completed';
  serviceDesk?: number;
}

export type RiskRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'C' | 'REJECT';

export interface CreditCalculationInput {
  customerId: string;
  loanType: 'İhtiyaç' | 'Konut' | 'Taşıt' | 'Ticari';
  requestedAmount: decimalNumber;
  maturityMonths: number; // 3, 6, 12, 24, 36, 48
  monthlyIncome: decimalNumber;
  existingMonthlyDebt: decimalNumber;
  findexScore: number;
}

export interface CreditEvaluationResult {
  isApproved: boolean;
  approvalStatus: 'ONAYLANDI' | 'ŞARTLI ONAY' | 'REDDEDİLDİ';
  riskRating: RiskRating;
  findexScore: number;
  findexCategory: string;
  debtToIncomeRatio: number; // DTI %
  appliedMonthlyRate: number; // %
  appliedAnnualRate: number; // %
  monthlyPayment: decimalNumber;
  totalInterest: decimalNumber;
  totalTax: decimalNumber; // KKDF + BSMV
  totalRepayment: decimalNumber;
  maxEligibleAmount: decimalNumber;
  reasons: string[];
  amortizationPlan: {
    month: number;
    payment: decimalNumber;
    principal: decimalNumber;
    interest: decimalNumber;
    tax: decimalNumber;
    remainingBalance: decimalNumber;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  module: 'AccountManager' | 'TransactionStack' | 'BranchQueue' | 'CreditEngine' | 'FileSystem';
  message: string;
  metadata?: Record<string, unknown>;
}

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  branch: string;
  changedFiles: string[];
}
