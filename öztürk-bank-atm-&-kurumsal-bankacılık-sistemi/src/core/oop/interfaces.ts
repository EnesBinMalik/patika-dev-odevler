/**
 * Öztürk Bank - Core Interfaces & Abstractions
 * S.O.L.I.D - Interface Segregation Principle (ISP) & Dependency Inversion (DIP)
 * Mimar: Enes Öztürk
 */

import { Optional } from './Optional';
import { UserRole, AccountType, TransactionType, TransactionStatus, Currency, LogLevel, LogAction } from '../enums';

export interface IEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPageable {
  page: number;      // 0-indexed veya 1-indexed
  size: number;      // sayfa başına eleman
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IRepository<T extends IEntity> {
  save(entity: T): T;
  findById(id: string): Optional<T>;
  findAll(): T[];
  findAllPaged(pageable: IPageable): IPage<T>;
  deleteById(id: string): boolean;
  existsById(id: string): boolean;
  count(): number;
}

export interface IUserEntity extends IEntity {
  tcNo: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string; // Hashlenmiş / maskeli şifre
  role: UserRole;
  isBlocked: boolean;
  failedLoginAttempts: number; // 3 deneme limiti için
  lastLoginDate?: string;
  adminId?: string; // Admin (1) - User (N) ilişkisi
}

export interface IAccountEntity extends IEntity {
  userId: string;       // Foreign Key: User (1) - Account (N)
  accountNumber: string;
  iban: string;
  accountType: AccountType;
  currency: Currency;
  balance: number;
  isActive: boolean;
  dailyWithdrawLimit: number;
  withdrawnToday: number;
  cardPinHash: string; // 4 haneli kart şifresi (hashlenmiş)
  cardNumber: string;  // 16 haneli kart numarası
}

export interface ITransactionEntity extends IEntity {
  transactionNumber: string;
  sourceAccountId: string;
  targetAccountId?: string;
  targetIban?: string;
  targetRecipientName?: string;
  amount: number;
  fee: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  description: string;
  balanceAfter: number;
  executedByUserId: string;
}

export interface IAuditLogEntity extends IEntity {
  action: LogAction;
  level: LogLevel;
  userId?: string;
  userRole?: UserRole;
  ipAddress: string;
  details: string;
  timestamp: string;
}

export interface ILoginSessionEntity extends IEntity {
  userId: string;
  fullName: string;
  role: UserRole;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

// Strategy Pattern: İşlem Ücreti ve Limit Stratejisi
export interface IFeeStrategy {
  calculateFee(amount: number, type: TransactionType): number;
  getName(): string;
}

// Observer Pattern: Olay Dinleyici ve Yayınlayıcı
export interface IBankEventListener {
  onBankEvent(event: { type: string; payload: unknown; timestamp: string }): void;
}
