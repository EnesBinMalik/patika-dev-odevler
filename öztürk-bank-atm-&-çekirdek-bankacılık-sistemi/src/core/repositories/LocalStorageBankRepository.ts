/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Veri Erişim Katmanı (Data Access Layer / JPA Repository Simülasyonu)
 * Geliştirici: Enes Öztürk
 *
 * Spring Data @OneToMany & @ManyToOne ilişkilerinin ve SQL sorgularının simülasyonu
 */

import {
  User,
  Account,
  Transaction,
  AuditLog,
  DailyLoginRecord,
  BankBranch,
  CustomerAccountProjection,
  PageRequest,
  PageResult,
} from '../../types/models';
import { Role, AccountStatus, AccountType, Currency, TransactionType, TransactionStatus, AuditAction } from '../../types/enums';
import { Optional } from '../patterns/Optional';
import { Stream } from '../patterns/Stream';

const DB_STORAGE_KEY = 'ozturk_bank_db_v1';

export interface BankDatabaseState {
  branches: BankBranch[];
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  dailyLogins: DailyLoginRecord[];
}

export class LocalStorageBankRepository {
  private static instance: LocalStorageBankRepository;

  private constructor() {
    this.initializeDatabase();
  }

  public static getInstance(): LocalStorageBankRepository {
    if (!LocalStorageBankRepository.instance) {
      LocalStorageBankRepository.instance = new LocalStorageBankRepository();
    }
    return LocalStorageBankRepository.instance;
  }

  private getInitialData(): BankDatabaseState {
    const defaultBranchId = 'branch_kadikoy_01';
    const adminId = 'user_admin_enes';

    const branch: BankBranch = {
      id: defaultBranchId,
      branchCode: '3401',
      branchName: 'Kadıköy Merkez Şubesi',
      city: 'İstanbul',
      vaultLiquidity: 5000000, // 5 Milyon TL
      adminId: adminId,
      createdAt: '2026-01-01T08:00:00.000Z',
    };

    // Maskelenmiş ve hash simülasyonlu şifreler (SHA256 mock hash)
    const adminUser: User = {
      id: adminId,
      tcNo: '10000000001',
      fullName: 'Enes Öztürk',
      email: 'enes.ozturk@ozturkbank.com.tr',
      phone: '+90 532 100 00 01',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
      pinHash: 'b5a2c94a974b79b90c3065b75b9f9392e22c9c7dfd9620436d4dfc94be232746', // 1907
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
      failedLoginAttempts: 0,
      registeredBranchId: defaultBranchId,
      createdAt: '2026-01-01T08:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
    };

    const customer1: User = {
      id: 'cust_ahmet',
      tcNo: '23456789012',
      fullName: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@gmail.com',
      phone: '+90 542 222 33 44',
      passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123456
      pinHash: '81dc9bdb52d04dc20036dbd8313ed055', // 1234
      role: Role.USER,
      status: AccountStatus.ACTIVE,
      failedLoginAttempts: 0,
      registeredBranchId: defaultBranchId,
      createdAt: '2026-01-10T09:30:00.000Z',
      lastLoginAt: new Date().toISOString(),
    };

    const customer2: User = {
      id: 'cust_ayse',
      tcNo: '34567890123',
      fullName: 'Ayşe Demir',
      email: 'ayse.demir@gmail.com',
      phone: '+90 533 333 44 55',
      passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123456
      pinHash: '674f3c2c1a8a449467657256565f4e04', // 5678
      role: Role.USER,
      status: AccountStatus.ACTIVE,
      failedLoginAttempts: 0,
      registeredBranchId: defaultBranchId,
      createdAt: '2026-01-15T11:20:00.000Z',
      lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    };

    const customer3: User = {
      id: 'cust_mehmet',
      tcNo: '45678901234',
      fullName: 'Mehmet Kaya',
      email: 'mehmet.kaya@gmail.com',
      phone: '+90 555 444 55 66',
      passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123456
      pinHash: '380482fa2425a16d82088f1842fd7ee0', // 9999
      role: Role.USER,
      status: AccountStatus.ACTIVE,
      failedLoginAttempts: 1,
      registeredBranchId: defaultBranchId,
      createdAt: '2026-01-20T14:15:00.000Z',
      lastLoginAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    };

    // Bloke olmuş müşteri örneği (Admin testi için)
    const customer4: User = {
      id: 'cust_zeynep',
      tcNo: '56789012345',
      fullName: 'Zeynep Çelik',
      email: 'zeynep.celik@gmail.com',
      phone: '+90 505 555 66 77',
      passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123456
      pinHash: 'cfcd208495d565ef66e7dff9f98764da', // 0000
      role: Role.USER,
      status: AccountStatus.BLOCKED,
      failedLoginAttempts: 3,
      registeredBranchId: defaultBranchId,
      createdAt: '2026-01-25T16:45:00.000Z',
      lastLoginAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    };

    const account1: Account = {
      id: 'acc_ahmet_01',
      accountNumber: '1002345678',
      iban: 'TR34 0006 1000 2345 6780 0001 01',
      cardNumber: '5421 8845 9012 3456',
      cardExpiry: '11/29',
      cardCvv: '382',
      accountType: AccountType.CHECKING,
      currency: Currency.TRY,
      balance: 38500,
      dailyWithdrawalLimit: 20000,
      todayWithdrawnAmount: 1500,
      customerId: customer1.id,
      createdAt: '2026-01-10T09:35:00.000Z',
    };

    const account2: Account = {
      id: 'acc_ayse_01',
      accountNumber: '1002345679',
      iban: 'TR34 0006 1000 2345 6780 0001 02',
      cardNumber: '5421 8845 9012 7890',
      cardExpiry: '08/28',
      cardCvv: '419',
      accountType: AccountType.CHECKING,
      currency: Currency.TRY,
      balance: 19400,
      dailyWithdrawalLimit: 15000,
      todayWithdrawnAmount: 0,
      customerId: customer2.id,
      createdAt: '2026-01-15T11:25:00.000Z',
    };

    const account3: Account = {
      id: 'acc_mehmet_01',
      accountNumber: '1002345680',
      iban: 'TR34 0006 1000 2345 6780 0001 03',
      cardNumber: '5421 8845 9012 1122',
      cardExpiry: '04/27',
      cardCvv: '803',
      accountType: AccountType.CHECKING,
      currency: Currency.TRY,
      balance: 6200,
      dailyWithdrawalLimit: 10000,
      todayWithdrawnAmount: 500,
      customerId: customer3.id,
      createdAt: '2026-01-20T14:20:00.000Z',
    };

    const account4: Account = {
      id: 'acc_zeynep_01',
      accountNumber: '1002345681',
      iban: 'TR34 0006 1000 2345 6780 0001 04',
      cardNumber: '5421 8845 9012 3344',
      cardExpiry: '09/27',
      cardCvv: '190',
      accountType: AccountType.CHECKING,
      currency: Currency.TRY,
      balance: 1250,
      dailyWithdrawalLimit: 10000,
      todayWithdrawnAmount: 0,
      customerId: customer4.id,
      createdAt: '2026-01-25T16:50:00.000Z',
    };

    const initialTransactions: Transaction[] = [
      {
        id: 'txn_init_01',
        transactionNumber: 'TXN-2026-784102',
        accountId: account1.id,
        customerId: customer1.id,
        type: TransactionType.DEPOSIT,
        amount: 5000,
        currency: Currency.TRY,
        previousBalance: 35000,
        newBalance: 40000,
        status: TransactionStatus.SUCCESS,
        description: 'ATM Nakit Yatırma (Kadıköy Şube ATM 01)',
        channel: 'ATM_TERMINAL',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'txn_init_02',
        transactionNumber: 'TXN-2026-784103',
        accountId: account1.id,
        customerId: customer1.id,
        type: TransactionType.WITHDRAW,
        amount: 1500,
        currency: Currency.TRY,
        previousBalance: 40000,
        newBalance: 38500,
        status: TransactionStatus.SUCCESS,
        description: 'ATM Nakit Para Çekme',
        channel: 'ATM_TERMINAL',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'txn_init_03',
        transactionNumber: 'TXN-2026-784104',
        accountId: account2.id,
        customerId: customer2.id,
        type: TransactionType.DEPOSIT,
        amount: 10000,
        currency: Currency.TRY,
        previousBalance: 9400,
        newBalance: 19400,
        status: TransactionStatus.SUCCESS,
        description: 'İnternet Şubesi EFT Girişi',
        channel: 'ONLINE_BRANCH',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ];

    const initialAuditLogs: AuditLog[] = [
      {
        id: 'log_01',
        action: AuditAction.LOGIN_SUCCESS,
        userId: adminId,
        userFullName: 'Enes Öztürk',
        userRole: Role.ADMIN,
        ipAddress: '192.168.1.100',
        details: 'Admin konsolu yetkili girişi başarılı.',
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'log_02',
        action: AuditAction.DEPOSIT,
        userId: customer1.id,
        userFullName: 'Ahmet Yılmaz',
        userRole: Role.USER,
        ipAddress: 'ATM_TERMINAL_KADIKOY_01',
        details: 'ATM üzerinden 5.000 TL nakit yatırıldı.',
        amount: 5000,
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'log_03',
        action: AuditAction.WITHDRAW,
        userId: customer1.id,
        userFullName: 'Ahmet Yılmaz',
        userRole: Role.USER,
        ipAddress: 'ATM_TERMINAL_KADIKOY_01',
        details: 'ATM üzerinden 1.500 TL nakit çekildi.',
        amount: 1500,
        status: 'SUCCESS',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'log_04',
        action: AuditAction.LOGIN_FAILED,
        userId: customer4.id,
        userFullName: 'Zeynep Çelik',
        userRole: Role.USER,
        ipAddress: 'ATM_TERMINAL_KADIKOY_01',
        details: 'Hatalı PIN girişi yapıldı (Deneme 3/3). Hesap BLOKE edildi.',
        status: 'WARNING',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'log_05',
        action: AuditAction.ACCOUNT_BLOCKED,
        userId: customer4.id,
        userFullName: 'Zeynep Çelik',
        userRole: Role.USER,
        ipAddress: 'SYSTEM_SECURITY_AGENT',
        details: '3 defa başarısız giriş sonrası hesap otomatik bloke edildi.',
        status: 'FAILURE',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ];

    const todayLogins: DailyLoginRecord[] = [
      {
        id: 'login_rec_01',
        customerId: customer1.id,
        fullName: customer1.fullName,
        tcNo: customer1.tcNo,
        email: customer1.email,
        loginTime: new Date(Date.now() - 3600000 * 3).toISOString(),
        channel: 'ATM',
        ipAddress: '192.168.1.101',
        sessionDurationMinutes: 8,
      },
      {
        id: 'login_rec_02',
        customerId: customer2.id,
        fullName: customer2.fullName,
        tcNo: customer2.tcNo,
        email: customer2.email,
        loginTime: new Date(Date.now() - 3600000 * 2).toISOString(),
        channel: 'WEB',
        ipAddress: '88.241.12.98',
        sessionDurationMinutes: 14,
      },
      {
        id: 'login_rec_03',
        customerId: customer3.id,
        fullName: customer3.fullName,
        tcNo: customer3.tcNo,
        email: customer3.email,
        loginTime: new Date(Date.now() - 3600000 * 6).toISOString(),
        channel: 'ATM',
        ipAddress: '192.168.1.102',
        sessionDurationMinutes: 5,
      },
    ];

    return {
      branches: [branch],
      users: [adminUser, customer1, customer2, customer3, customer4],
      accounts: [account1, account2, account3, account4],
      transactions: initialTransactions,
      auditLogs: initialAuditLogs,
      dailyLogins: todayLogins,
    };
  }

  private initializeDatabase(): void {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (!stored) {
        const initial = this.getInitialData();
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {
      // LocalStorage access fallback (sandbox environment)
    }
  }

  private loadState(): BankDatabaseState {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage read error, using fresh in-memory data', e);
    }
    return this.getInitialData();
  }

  private saveState(state: BankDatabaseState): void {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  }

  // User queries
  public findUserById(id: string): Optional<User> {
    const state = this.loadState();
    const user = Stream.of(state.users)
      .filter((u) => u.id === id)
      .findFirst();
    return user;
  }

  public findUserByTcNo(tcNo: string): Optional<User> {
    const state = this.loadState();
    const cleanTc = tcNo.trim();
    return Stream.of(state.users)
      .filter((u) => u.tcNo === cleanTc)
      .findFirst();
  }

  public findUserByEmail(email: string): Optional<User> {
    const state = this.loadState();
    const cleanEmail = email.trim().toLowerCase();
    return Stream.of(state.users)
      .filter((u) => u.email.toLowerCase() === cleanEmail)
      .findFirst();
  }

  public saveUser(user: User): User {
    const state = this.loadState();
    const idx = state.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      state.users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      state.users.push(user);
    }
    this.saveState(state);
    return user;
  }

  public findAllUsers(): User[] {
    return this.loadState().users;
  }

  // Account queries
  public findAccountById(id: string): Optional<Account> {
    const state = this.loadState();
    return Stream.of(state.accounts)
      .filter((a) => a.id === id)
      .findFirst();
  }

  public findAccountByCustomerId(customerId: string): Optional<Account> {
    const state = this.loadState();
    return Stream.of(state.accounts)
      .filter((a) => a.customerId === customerId)
      .findFirst();
  }

  public findAccountByIban(iban: string): Optional<Account> {
    const state = this.loadState();
    const cleanIban = iban.replace(/\s+/g, '').toUpperCase();
    return Stream.of(state.accounts)
      .filter((a) => a.iban.replace(/\s+/g, '').toUpperCase() === cleanIban)
      .findFirst();
  }

  public findAccountByNumber(accountNumber: string): Optional<Account> {
    const state = this.loadState();
    const cleanNo = accountNumber.trim();
    return Stream.of(state.accounts)
      .filter((a) => a.accountNumber === cleanNo)
      .findFirst();
  }

  public findAccountByCardNumber(cardNumber: string): Optional<Account> {
    const state = this.loadState();
    const cleanCard = cardNumber.replace(/\s+/g, '');
    return Stream.of(state.accounts)
      .filter((a) => a.cardNumber.replace(/\s+/g, '') === cleanCard)
      .findFirst();
  }

  public saveAccount(account: Account): Account {
    const state = this.loadState();
    const idx = state.accounts.findIndex((a) => a.id === account.id);
    if (idx >= 0) {
      state.accounts[idx] = { ...account, updatedAt: new Date().toISOString() };
    } else {
      state.accounts.push(account);
    }
    this.saveState(state);
    return account;
  }

  // Transaction queries
  public saveTransaction(transaction: Transaction): Transaction {
    const state = this.loadState();
    state.transactions.unshift(transaction);
    this.saveState(state);
    return transaction;
  }

  public findTransactionsByAccountId(
    accountId: string,
    pageRequest: PageRequest = { page: 1, size: 10 }
  ): PageResult<Transaction> {
    const state = this.loadState();
    const filtered = Stream.of(state.transactions)
      .filter((t) => t.accountId === accountId)
      .sorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .collect();

    return this.paginate(filtered, pageRequest);
  }

  public findAllTransactions(pageRequest: PageRequest = { page: 1, size: 10 }): PageResult<Transaction> {
    const state = this.loadState();
    const sorted = Stream.of(state.transactions)
      .sorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .collect();
    return this.paginate(sorted, pageRequest);
  }

  // Audit Logs
  public saveAuditLog(log: AuditLog): AuditLog {
    const state = this.loadState();
    state.auditLogs.unshift(log);
    this.saveState(state);
    return log;
  }

  public findAllAuditLogs(pageRequest: PageRequest = { page: 1, size: 10 }): PageResult<AuditLog> {
    const state = this.loadState();
    const sorted = Stream.of(state.auditLogs)
      .sorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .collect();
    return this.paginate(sorted, pageRequest);
  }

  // Günlük Giriş Takip (Daily Login Tracker)
  public saveDailyLogin(record: DailyLoginRecord): void {
    const state = this.loadState();
    state.dailyLogins.unshift(record);
    this.saveState(state);
  }

  public findDailyLogins(): DailyLoginRecord[] {
    return this.loadState().dailyLogins;
  }

  /**
   * SQL INNER JOIN Simülasyonu:
   * SELECT
   *   c.id AS customerId, c.tcNo, c.fullName, c.email, c.phone, c.status, c.failedLoginAttempts,
   *   a.accountNumber, a.iban, a.cardNumber, a.cardExpiry, a.balance, a.accountType, a.currency,
   *   a.todayWithdrawnAmount, a.dailyWithdrawalLimit, b.branchName AS registeredBranchName
   * FROM customers c
   * INNER JOIN accounts a ON c.id = a.customerId
   * INNER JOIN bank_branches b ON c.registeredBranchId = b.id
   */
  public findCustomerAccountProjections(): CustomerAccountProjection[] {
    const state = this.loadState();
    const branchesMap = new Map(state.branches.map((b) => [b.id, b.branchName]));
    const accountsMap = new Map(state.accounts.map((a) => [a.customerId, a]));

    return Stream.of(state.users)
      .filter((u) => u.role === Role.USER)
      .map((user) => {
        const account = accountsMap.get(user.id);
        const branchName = branchesMap.get(user.registeredBranchId) || 'Kadıköy Merkez Şubesi';

        return {
          customerId: user.id,
          tcNo: user.tcNo,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          failedAttempts: user.failedLoginAttempts,
          accountNumber: account ? account.accountNumber : 'HESAP_YOK',
          iban: account ? account.iban : 'TR00 0000 0000 0000 0000 0000 00',
          cardNumber: account ? account.cardNumber : '0000 0000 0000 0000',
          cardExpiry: account ? account.cardExpiry : '00/00',
          balance: account ? account.balance : 0,
          accountType: account ? account.accountType : AccountType.CHECKING,
          currency: account ? account.currency : Currency.TRY,
          todayWithdrawn: account ? account.todayWithdrawnAmount : 0,
          dailyLimit: account ? account.dailyWithdrawalLimit : 0,
          registeredBranchName: branchName,
        };
      })
      .collect();
  }

  // Banka Genel İstatistikleri
  public getBankAnalytics() {
    const state = this.loadState();
    const totalCustomerDeposits = Stream.of(state.accounts)
      .map((a) => a.balance)
      .reduce((sum, curr) => sum + curr, 0);

    const totalCustomers = Stream.of(state.users).filter((u) => u.role === Role.USER).count();
    const blockedCustomers = Stream.of(state.users)
      .filter((u) => u.role === Role.USER && u.status === AccountStatus.BLOCKED)
      .count();
    const activeCustomers = totalCustomers - blockedCustomers;

    const totalTransactions = state.transactions.length;
    const todayLoginsCount = state.dailyLogins.length;
    const branchLiquidity = state.branches[0]?.vaultLiquidity || 5000000;

    return {
      vaultLiquidity: branchLiquidity,
      totalCustomerDeposits,
      totalCustomers,
      activeCustomers,
      blockedCustomers,
      totalTransactions,
      todayLoginsCount,
    };
  }

  // Backup / Restore & File I/O
  public exportDatabaseJson(): string {
    return JSON.stringify(this.loadState(), null, 2);
  }

  public importDatabaseJson(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData) as BankDatabaseState;
      if (parsed.users && parsed.accounts && parsed.transactions) {
        this.saveState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import hatası:', e);
    }
    return false;
  }

  public resetToDefault(): void {
    const initial = this.getInitialData();
    this.saveState(initial);
  }

  // Paging Helper
  private paginate<T>(items: T[], pageRequest: PageRequest): PageResult<T> {
    const page = Math.max(1, pageRequest.page || 1);
    const size = Math.max(1, pageRequest.size || 10);
    const totalElements = items.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const content = items.slice(startIndex, endIndex);

    return {
      content,
      totalElements,
      totalPages,
      currentPage: page,
      pageSize: size,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}
