import {
  Customer,
  AnyAccount,
  CheckingAccount,
  SavingsAccount,
  BankTransaction,
  QueueTicket,
  CreditCalculationInput,
  CreditEvaluationResult,
  AuditLogEntry,
  GitCommit,
  RiskRating,
} from '../types/banking';

export class BankingEngine {
  private customers: Customer[] = [];
  private undoStack: BankTransaction[] = [];
  private redoStack: BankTransaction[] = [];
  private branchQueue: QueueTicket[] = [];
  private activeDesks: { deskId: number; name: string; currentTicket: QueueTicket | null }[] = [
    { deskId: 1, name: 'Vezne 1 (Bireysel İşlemler)', currentTicket: null },
    { deskId: 2, name: 'Vezne 2 (VIP & Kurumsal)', currentTicket: null },
    { deskId: 3, name: 'Vezne 3 (Kredi & Gişe)', currentTicket: null },
  ];
  private auditLogs: AuditLogEntry[] = [];
  private gitCommits: GitCommit[] = [];
  private ticketCounter = 100;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Initial Customers
    this.customers = [
      {
        id: 'CUST-001',
        fullName: 'Enes Öztürk',
        tckn: '28491048290',
        email: 'enes.ozturk@bank.dev',
        customerType: 'VIP',
        findexScore: 1780, // AAA Grade
        monthlyIncome: 95000,
        existingDebts: 8500,
        accounts: [
          {
            accountNumber: 'TR-1001-CHK',
            iban: 'TR34 0006 1000 0000 1001 0001 23',
            currency: 'TRY',
            type: 'Checking',
            createdDate: '2025-01-15T09:00:00Z',
            isActive: true,
            balance: 145000,
            accountHolderId: 'CUST-001',
            overdraftLimit: 30000,
            utilizedOverdraft: 0,
            transactionFee: 0,
          } as CheckingAccount,
          {
            accountNumber: 'TR-1002-SAV',
            iban: 'TR34 0006 1000 0000 1002 0001 45',
            currency: 'TRY',
            type: 'Savings',
            createdDate: '2025-02-01T10:30:00Z',
            isActive: true,
            balance: 350000,
            accountHolderId: 'CUST-001',
            interestRateAnnual: 46.5,
            maturityDays: 92,
            depositDate: '2025-02-01T10:30:00Z',
            accruedInterest: 41040,
            earlyWithdrawalPenaltyRate: 100,
          } as SavingsAccount,
        ],
      },
      {
        id: 'CUST-002',
        fullName: 'Ahmet Yılmaz',
        tckn: '19382019482',
        email: 'ahmet.yilmaz@email.com',
        customerType: 'Bireysel',
        findexScore: 1420, // AA Grade
        monthlyIncome: 48000,
        existingDebts: 12000,
        accounts: [
          {
            accountNumber: 'TR-2001-CHK',
            iban: 'TR34 0006 1000 0000 2001 0002 88',
            currency: 'TRY',
            type: 'Checking',
            createdDate: '2025-03-10T11:15:00Z',
            isActive: true,
            balance: 32500,
            accountHolderId: 'CUST-002',
            overdraftLimit: 15000,
            utilizedOverdraft: 0,
            transactionFee: 2.5,
          } as CheckingAccount,
        ],
      },
      {
        id: 'CUST-003',
        fullName: 'Elif Demir',
        tckn: '49281039481',
        email: 'elif.demir@corp.com',
        customerType: 'Kurumsal',
        findexScore: 1260, // A Grade
        monthlyIncome: 120000,
        existingDebts: 45000,
        accounts: [
          {
            accountNumber: 'TR-3001-CHK',
            iban: 'TR34 0006 1000 0000 3001 0003 12',
            currency: 'TRY',
            type: 'Checking',
            createdDate: '2025-01-20T14:00:00Z',
            isActive: true,
            balance: 84000,
            accountHolderId: 'CUST-003',
            overdraftLimit: 50000,
            utilizedOverdraft: 0,
            transactionFee: 5.0,
          } as CheckingAccount,
        ],
      },
      {
        id: 'CUST-004',
        fullName: 'Mert Aksoy',
        tckn: '58291039485',
        email: 'mert.aksoy@domain.org',
        customerType: 'Bireysel',
        findexScore: 820, // High Risk / Reject Grade
        monthlyIncome: 24000,
        existingDebts: 16000,
        accounts: [
          {
            accountNumber: 'TR-4001-CHK',
            iban: 'TR34 0006 1000 0000 4001 0004 99',
            currency: 'TRY',
            type: 'Checking',
            createdDate: '2025-04-05T16:20:00Z',
            isActive: true,
            balance: 4200,
            accountHolderId: 'CUST-004',
            overdraftLimit: 5000,
            utilizedOverdraft: 2100,
            transactionFee: 2.5,
          } as CheckingAccount,
        ],
      },
    ];

    // 2. Initial Stack transactions (LIFO)
    const seedTransactions: BankTransaction[] = [
      {
        id: 'TX-901',
        accountNumber: 'TR-1001-CHK',
        type: 'Deposit',
        amount: 25000,
        balanceAfter: 145000,
        timestamp: '2025-05-10T10:14:00Z',
        description: 'Maaş Transferi Geliri',
        canUndo: true,
      },
      {
        id: 'TX-902',
        accountNumber: 'TR-2001-CHK',
        type: 'Withdrawal',
        amount: 3500,
        balanceAfter: 32500,
        timestamp: '2025-05-10T11:02:00Z',
        description: 'Şube ATM Nakit Çekim',
        canUndo: true,
      },
      {
        id: 'TX-903',
        accountNumber: 'TR-1001-CHK',
        type: 'TransferOut',
        amount: 10000,
        balanceAfter: 135000,
        timestamp: '2025-05-10T12:30:00Z',
        description: 'Kira Ödemesi',
        targetAccount: 'TR-2001-CHK',
        canUndo: true,
      },
    ];
    this.undoStack = [...seedTransactions];

    // 3. Initial Queue tickets (FIFO)
    this.branchQueue = [
      {
        ticketNumber: 'VIP-101',
        customerId: 'CUST-001',
        customerName: 'Enes Öztürk',
        ticketType: 'VIP',
        issueTime: '10:45:12',
        status: 'Waiting',
      },
      {
        ticketNumber: 'B-102',
        customerId: 'CUST-002',
        customerName: 'Ahmet Yılmaz',
        ticketType: 'Bireysel',
        issueTime: '10:48:05',
        status: 'Waiting',
      },
      {
        ticketNumber: 'B-103',
        customerId: 'CUST-003',
        customerName: 'Elif Demir',
        ticketType: 'Kurumsal',
        issueTime: '10:51:30',
        status: 'Waiting',
      },
    ];

    // 4. Initial Audit Logs
    this.auditLogs = [
      {
        id: 'LOG-001',
        timestamp: '2025-05-10 10:14:01',
        level: 'INFO',
        module: 'AccountManager',
        message: 'TR-1001-CHK hesabına 25.000,00 TRY para yatırıldı (Bakiye: 145.000,00 TRY)',
      },
      {
        id: 'LOG-002',
        timestamp: '2025-05-10 10:14:02',
        level: 'INFO',
        module: 'TransactionStack',
        message: 'Yığıt (Stack LIFO): TX-901 PUSH edildi. Stack derinliği: 1',
      },
      {
        id: 'LOG-003',
        timestamp: '2025-05-10 10:45:12',
        level: 'INFO',
        module: 'BranchQueue',
        message: 'Kuyruk (Queue FIFO): VIP-101 fişi ENQUEUE edildi. Sıra derinliği: 3',
      },
      {
        id: 'LOG-004',
        timestamp: '2025-05-10 11:02:00',
        level: 'INFO',
        module: 'AccountManager',
        message: 'TR-2001-CHK hesabından 3.500,00 TRY nakit çekildi (Bakiye: 32.500,00 TRY)',
      },
    ];

    // 5. Git Commit History (Signed by Enes Öztürk)
    this.gitCommits = [
      {
        hash: '7f9a2b1',
        author: 'Enes Öztürk <enes.ozturk@bank.dev>',
        date: '2025-05-09 18:42:10',
        branch: 'main',
        message: 'feat(domain): implement encapsulation and polymorphic accounts (Account, Checking, Savings)',
        changedFiles: [
          'src/Domain/Entities/Account.cs',
          'src/Domain/Entities/CheckingAccount.cs',
          'src/Domain/Entities/SavingsAccount.cs',
        ],
      },
      {
        hash: 'c4e81d0',
        author: 'Enes Öztürk <enes.ozturk@bank.dev>',
        date: '2025-05-09 20:15:45',
        branch: 'main',
        message: 'feat(stack): implement LIFO transaction stack with bidirectional rollback engine',
        changedFiles: [
          'src/Domain/DataStructures/TransactionStack.cs',
          'src/Domain/Entities/BankTransaction.cs',
        ],
      },
      {
        hash: '8a3d5e2',
        author: 'Enes Öztürk <enes.ozturk@bank.dev>',
        date: '2025-05-10 09:30:00',
        branch: 'main',
        message: 'feat(queue): add FIFO branch teller ticket manager with VIP priority queueing',
        changedFiles: [
          'src/Domain/DataStructures/BranchTellerQueue.cs',
          'src/Domain/Entities/QueueTicket.cs',
        ],
      },
      {
        hash: 'e2b904f',
        author: 'Enes Öztürk <enes.ozturk@bank.dev>',
        date: '2025-05-10 11:10:30',
        branch: 'main',
        message: 'feat(risk-engine): build dynamic interest rate algorithm with BDDK DTI limits & Findex scoring',
        changedFiles: [
          'src/Application/Services/CreditRiskEngine.cs',
          'src/Application/DTOs/CreditEvaluationResult.cs',
        ],
      },
      {
        hash: '5d1a89c',
        author: 'Enes Öztürk <enes.ozturk@bank.dev>',
        date: '2025-05-10 12:45:00',
        branch: 'main',
        message: 'feat(infrastructure): add JSON/TXT file audit logging and interactive Spectre.Console UI',
        changedFiles: [
          'src/Infrastructure/Logging/FileAuditLogger.cs',
          'src/ConsoleUI/Program.cs',
        ],
      },
    ];
  }

  // ==========================================
  // MODULE 1: CUSTOMERS & ACCOUNTS (OOP)
  // ==========================================

  public getCustomers(): Customer[] {
    return this.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  public getAccountByNumber(accountNumber: string): { account: AnyAccount; customer: Customer } | null {
    for (const cust of this.customers) {
      const acc = cust.accounts.find((a) => a.accountNumber === accountNumber);
      if (acc) return { account: acc, customer: cust };
    }
    return null;
  }

  public getAllAccounts(): { account: AnyAccount; customerName: string; customerId: string }[] {
    const list: { account: AnyAccount; customerName: string; customerId: string }[] = [];
    for (const c of this.customers) {
      for (const a of c.accounts) {
        list.push({ account: a, customerName: c.fullName, customerId: c.id });
      }
    }
    return list;
  }

  public createAccount(
    customerId: string,
    type: 'Checking' | 'Savings',
    currency: 'TRY' | 'USD' | 'EUR',
    initialBalance: number,
    options?: { overdraftLimit?: number; interestRate?: number; maturityDays?: number }
  ): AnyAccount {
    const customer = this.getCustomerById(customerId);
    if (!customer) throw new Error('Müşteri bulunamadı.');

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const suffix = type === 'Checking' ? 'CHK' : 'SAV';
    const accountNumber = `TR-${randomNum}-${suffix}`;
    const iban = `TR34 0006 1000 0000 ${randomNum} 000${customer.accounts.length + 1} 12`;

    let newAccount: AnyAccount;

    if (type === 'Checking') {
      newAccount = {
        accountNumber,
        iban,
        currency,
        type: 'Checking',
        createdDate: new Date().toISOString(),
        isActive: true,
        balance: initialBalance,
        accountHolderId: customerId,
        overdraftLimit: options?.overdraftLimit ?? 10000,
        utilizedOverdraft: 0,
        transactionFee: 2.5,
      };
    } else {
      const rate = options?.interestRate ?? 45.0;
      const days = options?.maturityDays ?? 32;
      const interest = Math.round((initialBalance * rate * days) / 36500);
      newAccount = {
        accountNumber,
        iban,
        currency,
        type: 'Savings',
        createdDate: new Date().toISOString(),
        isActive: true,
        balance: initialBalance,
        accountHolderId: customerId,
        interestRateAnnual: rate,
        maturityDays: days,
        depositDate: new Date().toISOString(),
        accruedInterest: interest,
        earlyWithdrawalPenaltyRate: 100,
      };
    }

    customer.accounts.push(newAccount);

    this.addAuditLog(
      'INFO',
      'AccountManager',
      `Yeni ${type === 'Checking' ? 'Vadesiz' : 'Vadeli'} hesap açıldı: ${accountNumber} (${customer.fullName}) - Başlangıç: ${initialBalance.toLocaleString('tr-TR')} ${currency}`
    );

    return newAccount;
  }

  // Encapsulated Deposit
  public deposit(accountNumber: string, amount: number, note: string = 'Nakit Yatırma'): BankTransaction {
    if (amount <= 0) throw new Error('Yatırılacak tutar sıfırdan büyük olmalıdır.');
    const found = this.getAccountByNumber(accountNumber);
    if (!found) throw new Error('Hesap bulunamadı.');

    const { account } = found;

    if (account.type === 'Checking') {
      const chk = account as CheckingAccount;
      if (chk.utilizedOverdraft > 0) {
        if (amount >= chk.utilizedOverdraft) {
          const excess = amount - chk.utilizedOverdraft;
          chk.utilizedOverdraft = 0;
          chk.balance += excess;
        } else {
          chk.utilizedOverdraft -= amount;
        }
      } else {
        chk.balance += amount;
      }
    } else {
      const sav = account as SavingsAccount;
      sav.balance += amount;
      sav.accruedInterest = Math.round((sav.balance * sav.interestRateAnnual * sav.maturityDays) / 36500);
    }

    const tx: BankTransaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber,
      type: 'Deposit',
      amount,
      balanceAfter: account.balance,
      timestamp: new Date().toISOString(),
      description: note,
      canUndo: true,
    };

    this.pushToStack(tx);
    this.addAuditLog(
      'INFO',
      'AccountManager',
      `[DEPOSIT] ${accountNumber} hesabına +${amount.toLocaleString('tr-TR')} ${account.currency} yatırıldı. Güncel Bakiye: ${account.balance.toLocaleString('tr-TR')} ${account.currency}`
    );

    return tx;
  }

  // Encapsulated Withdraw
  public withdraw(accountNumber: string, amount: number, note: string = 'Nakit Çekim'): BankTransaction {
    if (amount <= 0) throw new Error('Çekilecek tutar sıfırdan büyük olmalıdır.');
    const found = this.getAccountByNumber(accountNumber);
    if (!found) throw new Error('Hesap bulunamadı.');

    const { account } = found;

    if (account.type === 'Checking') {
      const chk = account as CheckingAccount;
      const available = chk.balance + (chk.overdraftLimit - chk.utilizedOverdraft);
      if (amount > available) {
        throw new Error(`Yetersiz Bakiye ve KMH Limiti! Kullanılabilir: ${available.toLocaleString('tr-TR')} ${chk.currency}`);
      }

      if (amount <= chk.balance) {
        chk.balance -= amount;
      } else {
        const remaining = amount - chk.balance;
        chk.balance = 0;
        chk.utilizedOverdraft += remaining;
      }
    } else {
      const sav = account as SavingsAccount;
      if (amount > sav.balance) {
        throw new Error(`Vadeli hesapta yetersiz bakiye! Mevcut: ${sav.balance.toLocaleString('tr-TR')} ${sav.currency}`);
      }
      sav.balance -= amount;
      // Vade bozulma uyarısı
      sav.accruedInterest = 0;
    }

    const tx: BankTransaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber,
      type: 'Withdrawal',
      amount,
      balanceAfter: account.balance,
      timestamp: new Date().toISOString(),
      description: note,
      canUndo: true,
    };

    this.pushToStack(tx);
    this.addAuditLog(
      'INFO',
      'AccountManager',
      `[WITHDRAW] ${accountNumber} hesabından -${amount.toLocaleString('tr-TR')} ${account.currency} çekildi. Kalan Bakiye: ${account.balance.toLocaleString('tr-TR')} ${account.currency}`
    );

    return tx;
  }

  // Encapsulated Transfer
  public transfer(sourceAccountNumber: string, targetAccountNumber: string, amount: number, note: string): BankTransaction {
    if (amount <= 0) throw new Error('Transfer tutarı sıfırdan büyük olmalıdır.');
    if (sourceAccountNumber === targetAccountNumber) throw new Error('Kaynak ve hedef hesap aynı olamaz.');

    const source = this.getAccountByNumber(sourceAccountNumber);
    const target = this.getAccountByNumber(targetAccountNumber);

    if (!source) throw new Error('Kaynak hesap bulunamadı.');
    if (!target) throw new Error('Hedef hesap bulunamadı.');

    // Withdraw from source
    this.withdraw(sourceAccountNumber, amount, `Havale/EFT -> ${targetAccountNumber} (${note})`);

    // Deposit to target (bypassing extra stack push to keep transaction atomic in stack)
    if (target.account.type === 'Checking') {
      const chk = target.account as CheckingAccount;
      chk.balance += amount;
    } else {
      target.account.balance += amount;
    }

    const tx: BankTransaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber: sourceAccountNumber,
      type: 'TransferOut',
      amount,
      balanceAfter: source.account.balance,
      timestamp: new Date().toISOString(),
      description: `Transfer: ${sourceAccountNumber} -> ${targetAccountNumber} (${note})`,
      targetAccount: targetAccountNumber,
      canUndo: true,
    };

    // Replace the last withdrawal on stack with this complete transfer transaction
    this.undoStack.pop();
    this.pushToStack(tx);

    this.addAuditLog(
      'INFO',
      'AccountManager',
      `[TRANSFER] ${sourceAccountNumber} -> ${targetAccountNumber}: ${amount.toLocaleString('tr-TR')} ${source.account.currency} (${note})`
    );

    return tx;
  }

  // ==========================================
  // MODULE 2: DATA STRUCTURES (STACK & QUEUE)
  // ==========================================

  // Stack: Push
  private pushToStack(tx: BankTransaction) {
    this.undoStack.push(tx);
    this.redoStack = []; // Clear redo on new action
    this.addAuditLog('INFO', 'TransactionStack', `Yığıt (Stack LIFO): [PUSH] ${tx.id} - ${tx.type} ${tx.amount} TL. Yığıt derinliği: ${this.undoStack.length}`);
  }

  // Stack: Pop & Rollback (Undo)
  public undoLastTransaction(): { revertedTx: BankTransaction; description: string } {
    if (this.undoStack.length === 0) {
      throw new Error('Geri alınabilecek finansal işlem bulunamadı (Stack Empty).');
    }

    const tx = this.undoStack.pop()!;
    const foundSource = this.getAccountByNumber(tx.accountNumber);

    let undoDesc = '';

    if (foundSource) {
      const acc = foundSource.account;

      if (tx.type === 'Deposit') {
        // Reverse deposit -> withdraw
        acc.balance -= tx.amount;
        undoDesc = `${tx.accountNumber} hesabına yapılan +${tx.amount.toLocaleString('tr-TR')} TL yatırma iptal edildi.`;
      } else if (tx.type === 'Withdrawal') {
        // Reverse withdrawal -> deposit back
        acc.balance += tx.amount;
        undoDesc = `${tx.accountNumber} hesabından çekilen -${tx.amount.toLocaleString('tr-TR')} TL hesaba iade edildi.`;
      } else if (tx.type === 'TransferOut' && tx.targetAccount) {
        // Reverse transfer: return to source, deduct from target
        acc.balance += tx.amount;
        const foundTarget = this.getAccountByNumber(tx.targetAccount);
        if (foundTarget) {
          foundTarget.account.balance -= tx.amount;
        }
        undoDesc = `${tx.accountNumber} -> ${tx.targetAccount} arasındaki ${tx.amount.toLocaleString('tr-TR')} TL transfer geri alındı.`;
      }
    }

    this.redoStack.push(tx);
    this.addAuditLog(
      'WARN',
      'TransactionStack',
      `Yığıt (Stack LIFO): [POP & ROLLBACK] ${tx.id} geri alındı. Kalan Yığıt derinliği: ${this.undoStack.length}. Sebep: Geri Alma (Undo)`
    );

    return { revertedTx: tx, description: undoDesc };
  }

  public getUndoStack(): BankTransaction[] {
    return [...this.undoStack].reverse(); // Show top of stack first
  }

  public getStackDepth(): number {
    return this.undoStack.length;
  }

  // Queue: Enqueue (Fiş Al)
  public enqueueCustomer(customerId: string, ticketType: 'Bireysel' | 'Kurumsal' | 'VIP' | 'Gişe'): QueueTicket {
    const customer = this.getCustomerById(customerId);
    const customerName = customer ? customer.fullName : 'Misafir Müşteri';
    this.ticketCounter++;

    const prefix = ticketType === 'VIP' ? 'VIP' : ticketType === 'Kurumsal' ? 'K' : 'B';
    const ticketNumber = `${prefix}-${this.ticketCounter}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const ticket: QueueTicket = {
      ticketNumber,
      customerId,
      customerName,
      ticketType,
      issueTime: timeStr,
      status: 'Waiting',
    };

    // Priority insertion: VIP tickets go before standard tickets, or into FIFO
    if (ticketType === 'VIP') {
      // Insert after last VIP ticket, ahead of regular
      const lastVipIndex = this.branchQueue.map((t) => t.ticketType).lastIndexOf('VIP');
      if (lastVipIndex >= 0) {
        this.branchQueue.splice(lastVipIndex + 1, 0, ticket);
      } else {
        this.branchQueue.unshift(ticket);
      }
    } else {
      this.branchQueue.push(ticket);
    }

    this.addAuditLog(
      'INFO',
      'BranchQueue',
      `Kuyruk (Queue FIFO): [ENQUEUE] ${ticket.ticketNumber} (${customerName}) sıraya girdi. Bekleyen kişi sayısı: ${this.branchQueue.length}`
    );

    return ticket;
  }

  // Queue: Dequeue (Sıradaki Müşteriyi Gişeye Çağır)
  public callNextCustomer(deskId: number): QueueTicket | null {
    if (this.branchQueue.length === 0) {
      return null;
    }

    const nextTicket = this.branchQueue.shift()!;
    nextTicket.status = 'Serving';
    nextTicket.serviceDesk = deskId;

    const desk = this.activeDesks.find((d) => d.deskId === deskId);
    if (desk) {
      desk.currentTicket = nextTicket;
    }

    this.addAuditLog(
      'INFO',
      'BranchQueue',
      `Kuyruk (Queue FIFO): [DEQUEUE] ${nextTicket.ticketNumber} (${nextTicket.customerName}) Gişe #${deskId}'ye çağrıldı. Kalan sıra: ${this.branchQueue.length}`
    );

    return nextTicket;
  }

  public completeService(deskId: number): void {
    const desk = this.activeDesks.find((d) => d.deskId === deskId);
    if (desk && desk.currentTicket) {
      desk.currentTicket.status = 'Completed';
      this.addAuditLog(
        'INFO',
        'BranchQueue',
        `Gişe #${deskId} işlemi tamamlandı: ${desk.currentTicket.ticketNumber} (${desk.currentTicket.customerName})`
      );
      desk.currentTicket = null;
    }
  }

  public getBranchQueue(): QueueTicket[] {
    return this.branchQueue;
  }

  public getActiveDesks() {
    return this.activeDesks;
  }

  // ==========================================
  // MODULE 3: CREDIT RISK & INTEREST ENGINE
  // ==========================================

  public evaluateCredit(input: CreditCalculationInput): CreditEvaluationResult {
    const reasons: string[] = [];

    // 1. Debt-to-Income (DTI) - BDDK %50 kuralı
    const currentDti = input.monthlyIncome > 0 ? (input.existingMonthlyDebt / input.monthlyIncome) : 1;

    // 2. Risk Rating & Dynamic Interest
    let riskRating: RiskRating = 'C';
    let baseRate = 3.69; // %3.69 aylık baz faiz
    let riskMargin = 0;
    let findexCategory = 'Çok Riskli';

    if (input.findexScore >= 1500) {
      riskRating = 'AAA';
      riskMargin = -0.40; // %3.29'a düşer
      findexCategory = 'Mükemmel (AAA)';
    } else if (input.findexScore >= 1300) {
      riskRating = 'AA';
      riskMargin = -0.15;
      findexCategory = 'Çok İyi (AA)';
    } else if (input.findexScore >= 1100) {
      riskRating = 'A';
      riskMargin = 0.20;
      findexCategory = 'İyi (A)';
    } else if (input.findexScore >= 950) {
      riskRating = 'BBB';
      riskMargin = 0.65;
      findexCategory = 'Orta / Riskli (BBB)';
    } else if (input.findexScore >= 800) {
      riskRating = 'BB';
      riskMargin = 1.10;
      findexCategory = 'Az Riskli (BB)';
    } else {
      riskRating = 'REJECT';
      riskMargin = 2.0;
      findexCategory = 'Kritik Risk / Kara Liste';
      reasons.push(`Findeks kredi notu (${input.findexScore}) asgari baraj olan 950 puanın altındadır.`);
    }

    const appliedMonthlyRate = Math.max(2.89, baseRate + riskMargin);
    const appliedAnnualRate = appliedMonthlyRate * 12;
    const r = appliedMonthlyRate / 100;
    const n = input.maturityMonths;

    // Annuity Formula: A = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + r, n);
    const monthlyPrincipalAndInterest = (input.requestedAmount * (r * factor)) / (factor - 1);

    // KKDF (%15) + BSMV (%5) = %20 Vergi oranı (Konut kredisinde KKDF/BSMV muafiyeti vardır)
    const taxRate = input.loanType === 'Konut' ? 0 : 0.20;
    const monthlyPayment = Math.round(monthlyPrincipalAndInterest * (1 + taxRate * 0.5));
    const totalRepayment = monthlyPayment * n;
    const totalInterest = Math.round(totalRepayment - input.requestedAmount);
    const totalTax = Math.round(totalInterest * (taxRate / (1 + taxRate)));

    // New projected DTI
    const projectedMonthlyDebt = input.existingMonthlyDebt + monthlyPayment;
    const projectedDti = input.monthlyIncome > 0 ? (projectedMonthlyDebt / input.monthlyIncome) * 100 : 100;

    let isApproved = false;
    let approvalStatus: 'ONAYLANDI' | 'ŞARTLI ONAY' | 'REDDEDİLDİ' = 'REDDEDİLDİ';

    if (riskRating === 'REJECT') {
      approvalStatus = 'REDDEDİLDİ';
      isApproved = false;
    } else if (projectedDti > 50) {
      reasons.push(
        `Kredi taksiti dahil toplam borç/gelir oranı (%${projectedDti.toFixed(1)}), yasal üst sınır olan %50'yi aşmaktadır.`
      );
      if (projectedDti <= 60 && input.findexScore >= 1200) {
        approvalStatus = 'ŞARTLI ONAY';
        reasons.push('Ek kefil veya gayrimenkul ipoteği teminatı ile onaylanabilir.');
        isApproved = true;
      } else {
        approvalStatus = 'REDDEDİLDİ';
        isApproved = false;
      }
    } else {
      isApproved = true;
      approvalStatus = 'ONAYLANDI';
      reasons.push('Müşteri gelir durumu, Findeks skoru ve BDDK mevzuatına uygun bulunmuştur.');
    }

    // Maximum eligible amount based on 50% DTI limit
    const maxInstallmentCapacity = Math.max(0, input.monthlyIncome * 0.5 - input.existingMonthlyDebt);
    const maxEligibleAmount = Math.round((maxInstallmentCapacity * (factor - 1)) / (r * factor * 1.1));

    // Generate Amortization Schedule
    const amortizationPlan: CreditEvaluationResult['amortizationPlan'] = [];
    let remaining = input.requestedAmount;
    const principalPerMonth = input.requestedAmount / n;

    for (let m = 1; m <= Math.min(n, 12); m++) {
      const monthInterest = Math.round(remaining * r);
      const monthTax = Math.round(monthInterest * taxRate);
      const monthPrincipal = Math.round(monthlyPayment - monthInterest - monthTax);
      remaining = Math.max(0, remaining - monthPrincipal);

      amortizationPlan.push({
        month: m,
        payment: monthlyPayment,
        principal: monthPrincipal,
        interest: monthInterest,
        tax: monthTax,
        remainingBalance: remaining,
      });
    }

    this.addAuditLog(
      isApproved ? 'INFO' : 'WARN',
      'CreditEngine',
      `Kredi Risk Analizi: ${input.requestedAmount.toLocaleString('tr-TR')} TL (${input.maturityMonths} Ay) -> Karar: ${approvalStatus} | Risk Notu: ${riskRating} | Findeks: ${input.findexScore} | DTI: %${projectedDti.toFixed(1)}`
    );

    return {
      isApproved,
      approvalStatus,
      riskRating,
      findexScore: input.findexScore,
      findexCategory,
      debtToIncomeRatio: Math.round(projectedDti * 10) / 10,
      appliedMonthlyRate,
      appliedAnnualRate: Math.round(appliedAnnualRate * 100) / 100,
      monthlyPayment,
      totalInterest,
      totalTax,
      totalRepayment,
      maxEligibleAmount: Math.max(0, maxEligibleAmount),
      reasons,
      amortizationPlan,
    };
  }

  // ==========================================
  // MODULE 4: FILE LOGS & GIT SYSTEM
  // ==========================================

  public addAuditLog(level: AuditLogEntry['level'], module: AuditLogEntry['module'], message: string): void {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const entry: AuditLogEntry = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: dateStr,
      level,
      module,
      message,
    };

    this.auditLogs.unshift(entry); // Newest first
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  public getGitCommits(): GitCommit[] {
    return this.gitCommits;
  }

  public generateAuditLogTxt(): string {
    const header = [
      '================================================================================',
      ' SMARTBANKING AUDIT LOG SYSTEM - DEVELOPER: ENES ÖZTÜRK',
      ' .NET 9 Clean Architecture / In-Memory & File Operations',
      ` Export Generated: ${new Date().toISOString()}`,
      '================================================================================',
      '',
    ].join('\n');

    const lines = this.auditLogs
      .map((log) => `[${log.timestamp}] [${log.level.padEnd(5)}] [${log.module.padEnd(16)}] ${log.message}`)
      .join('\n');

    return header + lines;
  }

  public generateTransactionsJson(): string {
    const payload = {
      system: 'SmartBanking.Core',
      developer: 'Enes Öztürk',
      version: '9.0.1-preview',
      exportedAt: new Date().toISOString(),
      activeCustomersCount: this.customers.length,
      stackDepth: this.undoStack.length,
      queuePending: this.branchQueue.length,
      transactions: this.undoStack,
      recentAuditLogs: this.auditLogs.slice(0, 25),
    };
    return JSON.stringify(payload, null, 2);
  }

  public downloadFile(filename: string, content: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const bankingEngineInstance = new BankingEngine();
