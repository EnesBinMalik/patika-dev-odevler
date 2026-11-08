/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 */

import { Role, AccountStatus, AccountType, TransactionType, TransactionStatus, AuditAction, Currency } from './enums';

export interface BaseEntity {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}

// Banka Şubesi / Admin Entity (1 tarafı)
export interface BankBranch extends BaseEntity {
  branchCode: string;
  branchName: string;
  city: string;
  vaultLiquidity: number; // Kasa Rezervi
  adminId: string;
}

// User / Customer Entity (N tarafı)
export interface User extends BaseEntity {
  tcNo: string; // TC Kimlik No
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string; // Maskeli ve Hash'lenmiş şifre
  pinHash: string;      // ATM 4 haneli PIN
  role: Role;           // ADMIN veya USER
  status: AccountStatus;
  failedLoginAttempts: number; // 3 deneme hakkı
  lastLoginAt?: string;
  registeredBranchId: string; // FK -> BankBranch (admin / branch ilişkisi: @ManyToOne)
}

// Müşteri Hesabı (@OneToMany User -> Account)
export interface Account extends BaseEntity {
  accountNumber: string; // 10 haneli hesap no
  iban: string;          // TR... IBAN
  cardNumber: string;    // 16 haneli kart no
  cardExpiry: string;    // MM/YY
  cardCvv: string;
  accountType: AccountType;
  currency: Currency;
  balance: number;       // Bakiye
  dailyWithdrawalLimit: number;
  todayWithdrawnAmount: number;
  customerId: string;    // FK -> User.id
}

// İşlem / Dekont Entity (@OneToMany Account -> Transaction)
export interface Transaction extends BaseEntity {
  transactionNumber: string; // TXN-2026-XXXX
  accountId: string;         // FK -> Account.id
  customerId: string;        // FK -> User.id
  type: TransactionType;
  amount: number;
  currency: Currency;
  previousBalance: number;
  newBalance: number;
  status: TransactionStatus;
  description: string;
  targetIban?: string;
  targetAccountTitle?: string;
  channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH' | 'ADMIN_CONSOLE';
}

// Sistem & Güvenlik Audit Log Entity
export interface AuditLog extends BaseEntity {
  action: AuditAction;
  userId?: string;
  userFullName?: string;
  userRole: Role;
  ipAddress: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  amount?: number;
}

// Günlük Giriş Takip Kaydı (Admin için gün içinde giren müşteriler)
export interface DailyLoginRecord {
  id: string;
  customerId: string;
  fullName: string;
  tcNo: string;
  email: string;
  loginTime: string; // ISO string
  channel: 'ATM' | 'WEB';
  ipAddress: string;
  sessionDurationMinutes?: number;
}

// SQL INNER JOIN Simülasyon Projeksiyonu
// SELECT c.id, c.tcNo, c.fullName, c.email, c.status, a.accountNumber, a.iban, a.balance, a.cardNumber
export interface CustomerAccountProjection {
  customerId: string;
  tcNo: string;
  fullName: string;
  email: string;
  phone: string;
  status: AccountStatus;
  failedAttempts: number;
  accountNumber: string;
  iban: string;
  cardNumber: string;
  cardExpiry: string;
  balance: number;
  accountType: AccountType;
  currency: Currency;
  todayWithdrawn: number;
  dailyLimit: number;
  registeredBranchName: string;
}

// Sayfalama (Paging) Yardımcı Tipleri
export interface PageRequest {
  page: number; // 1-indexed
  size: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// DTOs
export interface DepositRequest {
  accountId: string;
  amount: number;
  channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH';
  notes?: string;
}

export interface WithdrawRequest {
  accountId: string;
  amount: number;
  channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH';
}

export interface TransferRequest {
  sourceAccountId: string;
  targetIbanOrAccount: string;
  targetTitle: string;
  amount: number;
  description: string;
  channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH';
}
