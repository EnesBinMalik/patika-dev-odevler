/**
 * DatabaseManager - Central Singleton Database & Relational Query Engine
 * Design Patterns: Singleton Pattern, Repository Coordinator
 * Mimar: Enes Öztürk
 */

import { UserRepository, AccountRepository, TransactionRepository, AuditLogRepository, LoginSessionRepository } from '../repositories';
import { getInitialSeedData } from '../data/initialSeed';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { AuditLog, LoginSession } from '../models/AuditLog';
import { Optional } from '../oop/Optional';
import { Stream } from '../oop/Stream';

export interface CustomerAccountJoinRecord {
  userId: string;
  tcNo: string;
  fullName: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  failedLoginAttempts: number;
  lastLoginDate?: string;
  accountId: string;
  accountNumber: string;
  iban: string;
  accountType: string;
  currency: string;
  balance: number;
  isActive: boolean;
  cardNumber: string;
  dailyWithdrawLimit: number;
}

export class DatabaseManager {
  private static instance: DatabaseManager;

  public readonly users: UserRepository;
  public readonly accounts: AccountRepository;
  public readonly transactions: TransactionRepository;
  public readonly auditLogs: AuditLogRepository;
  public readonly loginSessions: LoginSessionRepository;

  private constructor() {
    this.users = new UserRepository();
    this.accounts = new AccountRepository();
    this.transactions = new TransactionRepository();
    this.auditLogs = new AuditLogRepository();
    this.loginSessions = new LoginSessionRepository();

    this.checkAndSeed();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private checkAndSeed(): void {
    if (this.users.count() === 0) {
      this.seedInitialData();
    }
  }

  public seedInitialData(): void {
    const seed = getInitialSeedData();
    this.users.saveAll(seed.users);
    this.accounts.saveAll(seed.accounts);
    this.transactions.saveAll(seed.transactions);
    this.loginSessions.saveAll(seed.loginSessions);
    this.auditLogs.saveAll(seed.auditLogs);
  }

  public resetToFactoryDefaults(): void {
    this.users.clear();
    this.accounts.clear();
    this.transactions.clear();
    this.loginSessions.clear();
    this.auditLogs.clear();
    this.seedInitialData();
  }

  /**
   * SQL INNER JOIN Simülasyonu ve Sorgulama Motoru
   * Eşdeğer SQL:
   * SELECT
   *   u.id as user_id, u.tc_no, u.full_name, u.email, u.phone, u.is_blocked,
   *   a.id as account_id, a.account_number, a.iban, a.account_type, a.balance, a.is_active
   * FROM users u
   * INNER JOIN accounts a ON u.id = a.user_id
   * WHERE u.role = 'CUSTOMER'
   */
  public executeCustomerAccountsInnerJoin(): CustomerAccountJoinRecord[] {
    const customerUsers = this.users.findCustomers();
    const allAccounts = this.accounts.findAll();

    // Stream tabanlı inner join
    const records: CustomerAccountJoinRecord[] = [];

    Stream.of(customerUsers).forEach(user => {
      // ON u.id = a.user_id
      const userAccounts = Stream.of(allAccounts)
        .filter(acc => acc.userId === user.id)
        .toList();

      userAccounts.forEach(acc => {
        records.push({
          userId: user.id,
          tcNo: user.tcNo,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isBlocked: user.isBlocked,
          failedLoginAttempts: user.failedLoginAttempts,
          lastLoginDate: user.lastLoginDate,
          accountId: acc.id,
          accountNumber: acc.accountNumber,
          iban: acc.iban,
          accountType: acc.accountType,
          currency: acc.currency,
          balance: acc.balance,
          isActive: acc.isActive,
          cardNumber: acc.cardNumber,
          dailyWithdrawLimit: acc.dailyWithdrawLimit
        });
      });
    });

    return records;
  }

  /**
   * Müşteri ID'sine göre tüm ilişkili hesapları ve toplam varlığı getirir
   */
  public getCustomerPortfolio(userId: string): { user: Optional<User>; accounts: Account[]; totalBalanceTRY: number } {
    const userOpt = this.users.findById(userId);
    const accounts = this.accounts.findByUserId(userId);
    const totalBalanceTRY = Stream.of(accounts)
      .map(a => a.balance)
      .reduce((sum, b) => sum + b, 0)
      .orElse(0);

    return {
      user: userOpt,
      accounts,
      totalBalanceTRY
    };
  }

  // File I/O: Veritabanını Dışa Aktarma (Export)
  public exportDatabaseToJson(): string {
    const backup = {
      version: '1.0.0',
      system: 'Öztürk Bank Core Banking',
      architect: 'Enes Öztürk',
      exportDate: new Date().toISOString(),
      tables: {
        users: this.users.findAll(),
        accounts: this.accounts.findAll(),
        transactions: this.transactions.findAll(),
        loginSessions: this.loginSessions.findAll(),
        auditLogs: this.auditLogs.findAll()
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  // File I/O: CSV formatında müşteri & hesap dökümü
  public exportCustomersToCsv(): string {
    const records = this.executeCustomerAccountsInnerJoin();
    const headers = ['Müşteri ID', 'TC Kimlik No', 'Ad Soyad', 'E-Posta', 'Telefon', 'Hesap No', 'IBAN', 'Hesap Türü', 'Bakiye (TL)', 'Kart No', 'Durum', 'Bloke'];
    const rows = records.map(r => [
      r.userId,
      r.tcNo,
      `"${r.fullName}"`,
      r.email,
      r.phone,
      r.accountNumber,
      r.iban,
      r.accountType,
      r.balance.toFixed(2),
      r.cardNumber,
      r.isActive ? 'Aktif' : 'Pasif',
      r.isBlocked ? 'BLOKE' : 'Normal'
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // File I/O: Dışarıdan JSON Yükleme (Import)
  public importDatabaseFromJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.tables) {
        if (Array.isArray(parsed.tables.users)) {
          this.users.clear();
          this.users.saveAll(parsed.tables.users.map((u: Record<string, unknown>) => User.fromJSON(u)));
        }
        if (Array.isArray(parsed.tables.accounts)) {
          this.accounts.clear();
          this.accounts.saveAll(parsed.tables.accounts.map((a: Record<string, unknown>) => Account.fromJSON(a)));
        }
        if (Array.isArray(parsed.tables.transactions)) {
          this.transactions.clear();
          this.transactions.saveAll(parsed.tables.transactions.map((t: Record<string, unknown>) => Transaction.fromJSON(t)));
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}
