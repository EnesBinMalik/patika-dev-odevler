/**
 * Concrete Repositories implementing Data Access Layer (DAL)
 * Spring Data JPA Repository Pattern Karşılığı
 * Mimar: Enes Öztürk
 */

import { AbstractRepository } from '../oop/abstracts';
import { User, CustomerUser, AdminUser } from '../models/User';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { AuditLog, LoginSession } from '../models/AuditLog';
import { Optional } from '../oop/Optional';
import { Stream } from '../oop/Stream';

export class UserRepository extends AbstractRepository<User> {
  constructor() {
    super('ozturk_bank_users_db');
  }

  protected deserialize(raw: unknown): User {
    return User.fromJSON(raw as Record<string, unknown>);
  }

  public findByTcNo(tcNo: string): Optional<User> {
    const clean = tcNo.trim();
    return this.stream()
      .filter(u => u.tcNo === clean)
      .findFirst();
  }

  public findByEmail(email: string): Optional<User> {
    const clean = email.trim().toLowerCase();
    return this.stream()
      .filter(u => u.email.toLowerCase() === clean)
      .findFirst();
  }

  public findCustomers(): User[] {
    return this.stream()
      .filter(u => u.isCustomer())
      .toList();
  }

  public findBlockedUsers(): User[] {
    return this.stream()
      .filter(u => u.isBlocked)
      .toList();
  }
}

export class AccountRepository extends AbstractRepository<Account> {
  constructor() {
    super('ozturk_bank_accounts_db');
  }

  protected deserialize(raw: unknown): Account {
    return Account.fromJSON(raw as Record<string, unknown>);
  }

  public findByUserId(userId: string): Account[] {
    return this.stream()
      .filter(a => a.userId === userId)
      .toList();
  }

  public findPrimaryByUserId(userId: string): Optional<Account> {
    return this.stream()
      .filter(a => a.userId === userId && a.isActive)
      .findFirst();
  }

  public findByIban(iban: string): Optional<Account> {
    const clean = iban.replace(/\s+/g, '').toUpperCase();
    return this.stream()
      .filter(a => a.iban.replace(/\s+/g, '').toUpperCase() === clean)
      .findFirst();
  }

  public findByAccountNumber(accNum: string): Optional<Account> {
    const clean = accNum.trim();
    return this.stream()
      .filter(a => a.accountNumber === clean)
      .findFirst();
  }

  public findByCardNumber(cardNum: string): Optional<Account> {
    const clean = cardNum.replace(/\s+/g, '');
    return this.stream()
      .filter(a => a.cardNumber.replace(/\s+/g, '') === clean)
      .findFirst();
  }

  public getTotalDeposits(): number {
    return this.stream()
      .map(a => a.balance)
      .reduce((sum, b) => sum + b, 0)
      .orElse(0);
  }
}

export class TransactionRepository extends AbstractRepository<Transaction> {
  constructor() {
    super('ozturk_bank_transactions_db');
  }

  protected deserialize(raw: unknown): Transaction {
    return Transaction.fromJSON(raw as Record<string, unknown>);
  }

  public findByAccountId(accountId: string): Transaction[] {
    return this.stream()
      .filter(t => t.sourceAccountId === accountId || t.targetAccountId === accountId)
      .sorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .toList();
  }

  public findRecent(limitCount: number = 20): Transaction[] {
    return this.stream()
      .sorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .limit(limitCount)
      .toList();
  }
}

export class AuditLogRepository extends AbstractRepository<AuditLog> {
  constructor() {
    super('ozturk_bank_audit_logs_db');
  }

  protected deserialize(raw: unknown): AuditLog {
    return AuditLog.fromJSON(raw as Record<string, unknown>);
  }

  public findLatestLogs(limitCount: number = 50): AuditLog[] {
    return this.stream()
      .sorted((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .limit(limitCount)
      .toList();
  }
}

export class LoginSessionRepository extends AbstractRepository<LoginSession> {
  constructor() {
    super('ozturk_bank_login_sessions_db');
  }

  protected deserialize(raw: unknown): LoginSession {
    return LoginSession.fromJSON(raw as Record<string, unknown>);
  }

  public findTodaySessions(): LoginSession[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.stream()
      .filter(s => s.loginTime.startsWith(today))
      .sorted((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime())
      .toList();
  }
}
