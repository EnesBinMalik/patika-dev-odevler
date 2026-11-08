/**
 * TransactionService - Bankacılık İşlem Motoru
 * Kurallar: Para yatırma, para çekme, bakiye kontrolü (para yoksa çekemez), havale, tam loglama
 * Mimar: Enes Öztürk
 */

import { DatabaseManager } from '../database/DatabaseManager';
import { TransactionFactory } from '../patterns/TransactionFactory';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { LogAction, LogLevel, UserRole } from '../enums';
import { AuditLog } from '../models/AuditLog';
import { BankEventSubject } from '../patterns/BankEventObserver';

export interface TransactionResult {
  success: boolean;
  transaction?: Transaction;
  message: string;
  balanceAfter?: number;
  sourceAccount?: Account;
}

export class TransactionService {
  private db: DatabaseManager;
  private eventSubject: BankEventSubject;

  constructor() {
    this.db = DatabaseManager.getInstance();
    this.eventSubject = BankEventSubject.getInstance();
  }

  /**
   * Para Yatırma (Deposit)
   * Müşteri hesabına para ekler, bakiye artar, log tutulur
   */
  public deposit(accountId: string, amount: number, executedByUserId: string, note?: string): TransactionResult {
    if (amount <= 0) {
      return { success: false, message: 'Yatırılacak tutar 0 ₺ den büyük olmalıdır!' };
    }

    const accountOpt = this.db.accounts.findById(accountId);
    if (!accountOpt.isPresent()) {
      return { success: false, message: 'İşlem yapılacak hesap bulunamadı!' };
    }

    const account = accountOpt.get();
    if (!account.isActive) {
      return { success: false, message: 'Bu hesap pasif veya bloke durumdadır!' };
    }

    // Para ekleme işlemi
    account.deposit(amount);
    this.db.accounts.save(account);

    // Factory ile Transaction kaydı üret
    const description = note || `ATM Nakit Para Yatırma (+${amount.toLocaleString('tr-TR')} ₺)`;
    const transaction = TransactionFactory.createDeposit(
      account.id,
      amount,
      account.balance,
      executedByUserId,
      description
    );
    this.db.transactions.save(transaction);

    // Denetim Logu
    this.recordAudit(
      LogAction.MONEY_DEPOSITED,
      LogLevel.INFO,
      `Hesap (${account.accountNumber}) içine ${amount.toLocaleString('tr-TR')} ₺ nakit yatırıldı. Yeni bakiye: ${account.balance.toLocaleString('tr-TR')} ₺`,
      'ATM Terminal',
      executedByUserId,
      UserRole.CUSTOMER
    );

    this.eventSubject.notify({
      type: 'TRANSACTION_CREATED',
      payload: { transaction, account },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      transaction,
      balanceAfter: account.balance,
      sourceAccount: account,
      message: `${amount.toLocaleString('tr-TR')} ₺ başarıyla yatırıldı! Yeni bakiyeniz: ${account.balance.toLocaleString('tr-TR')} ₺`
    };
  }

  /**
   * Para Çekme (Withdraw)
   * Kural: Eğer Müşterinin parası yoksa para çekemez!
   * Günlük limit ve bakiye kontrolü yapılır
   */
  public withdraw(accountId: string, amount: number, executedByUserId: string): TransactionResult {
    if (amount <= 0) {
      return { success: false, message: 'Çekilecek tutar 0 ₺ den büyük olmalıdır!' };
    }

    const accountOpt = this.db.accounts.findById(accountId);
    if (!accountOpt.isPresent()) {
      return { success: false, message: 'İşlem yapılacak hesap bulunamadı!' };
    }

    const account = accountOpt.get();

    // 1. Doğrulama: Bakiye yeterli mi?
    const check = account.canWithdraw(amount);
    if (!check.allowed) {
      // Başarısız işlem logu
      this.recordAudit(
        LogAction.MONEY_WITHDRAWN,
        LogLevel.WARN,
        `Yetersiz bakiye / limit aşımı nedeniyle para çekme reddedildi: Tutar: ${amount} ₺, Bakiye: ${account.balance} ₺. Sebep: ${check.reason}`,
        'ATM Terminal',
        executedByUserId,
        UserRole.CUSTOMER
      );

      return {
        success: false,
        message: check.reason || 'Para çekme işlemi reddedildi!'
      };
    }

    // 2. Hesaptan para eksiltme
    account.withdraw(amount);
    this.db.accounts.save(account);

    // 3. Factory ile Transaction kaydı
    const description = `ATM Nakit Para Çekme (-${amount.toLocaleString('tr-TR')} ₺)`;
    const transaction = TransactionFactory.createWithdraw(
      account.id,
      amount,
      account.balance,
      executedByUserId,
      description
    );
    this.db.transactions.save(transaction);

    // 4. Denetim Logu
    this.recordAudit(
      LogAction.MONEY_WITHDRAWN,
      LogLevel.INFO,
      `Hesap (${account.accountNumber}) üzerinden ${amount.toLocaleString('tr-TR')} ₺ nakit çekildi. Kalan bakiye: ${account.balance.toLocaleString('tr-TR')} ₺`,
      'ATM Terminal',
      executedByUserId,
      UserRole.CUSTOMER
    );

    this.eventSubject.notify({
      type: 'TRANSACTION_CREATED',
      payload: { transaction, account },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      transaction,
      balanceAfter: account.balance,
      sourceAccount: account,
      message: `${amount.toLocaleString('tr-TR')} ₺ nakit para başarıyla çekildi. Lütfen para gözünden paranızı alınız.`
    };
  }

  /**
   * Müşteri Para Havale / EFT / FAST
   * Başka müşterinin IBAN'ına veya hesabına aktarım
   */
  public transfer(
    sourceAccountId: string,
    targetIban: string,
    recipientName: string,
    amount: number,
    description: string,
    executedByUserId: string
  ): TransactionResult {
    if (amount <= 0) {
      return { success: false, message: 'Transfer tutarı 0 ₺ den büyük olmalıdır!' };
    }

    const sourceOpt = this.db.accounts.findById(sourceAccountId);
    if (!sourceOpt.isPresent()) {
      return { success: false, message: 'Gönderici hesap bulunamadı!' };
    }

    const sourceAccount = sourceOpt.get();

    // Bakiye kontrolü (tutar + varsa havale masrafı)
    if (sourceAccount.balance < amount) {
      return {
        success: false,
        message: `Yetersiz Bakiye! Hesabınızda ${sourceAccount.balance.toLocaleString('tr-TR')} ₺ bulunmaktadır.`
      };
    }

    // Alıcı hesabı sistemde ara
    const cleanIban = targetIban.replace(/\s+/g, '').toUpperCase();
    const targetAccountOpt = this.db.accounts.findByIban(cleanIban);

    // Kaynaktan düşüş
    sourceAccount.balance -= amount;
    this.db.accounts.save(sourceAccount);

    let targetAccountId: string | undefined = undefined;
    let targetActualName = recipientName;

    if (targetAccountOpt.isPresent()) {
      const targetAccount = targetAccountOpt.get();
      targetAccountId = targetAccount.id;
      // Alıcı bakiyesine ekle!
      targetAccount.balance += amount;
      this.db.accounts.save(targetAccount);

      // Alıcı kullanıcı adını getir
      const targetUser = this.db.users.findById(targetAccount.userId);
      if (targetUser.isPresent()) {
        targetActualName = targetUser.get().fullName;
      }

      // Alıcı için Gelen Havale Transaction'ı oluştur
      const senderUser = this.db.users.findById(executedByUserId);
      const senderName = senderUser.isPresent() ? senderUser.get().fullName : 'Öztürk Bank Müşterisi';

      const transferInTx = TransactionFactory.createTransferIn(
        targetAccount.id,
        sourceAccount.iban,
        senderName,
        amount,
        targetAccount.balance,
        targetAccount.userId,
        description || `Gelen Transfer: ${senderName}`,
        sourceAccount.id
      );
      this.db.transactions.save(transferInTx);
    }

    // Gönderici için Giden Havale Transaction'ı oluştur
    const transferOutTx = TransactionFactory.createTransferOut(
      sourceAccount.id,
      cleanIban,
      targetActualName,
      amount,
      sourceAccount.balance,
      executedByUserId,
      description,
      targetAccountId
    );
    this.db.transactions.save(transferOutTx);

    // Denetim Logu
    this.recordAudit(
      LogAction.TRANSFER_COMPLETED,
      LogLevel.INFO,
      `Hesap (${sourceAccount.accountNumber}) üzerinden ${cleanIban} (${targetActualName}) hesabına ${amount.toLocaleString('tr-TR')} ₺ havale yapıldı.`,
      'İnternet/ATM',
      executedByUserId,
      UserRole.CUSTOMER
    );

    this.eventSubject.notify({
      type: 'TRANSACTION_CREATED',
      payload: { transaction: transferOutTx, account: sourceAccount },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      transaction: transferOutTx,
      balanceAfter: sourceAccount.balance,
      sourceAccount,
      message: `${amount.toLocaleString('tr-TR')} ₺ tutarındaki havale işlemi başarıyla ${targetActualName} adına iletildi!`
    };
  }

  private recordAudit(action: LogAction, level: LogLevel, details: string, ipAddress: string, userId?: string, userRole?: UserRole): void {
    const log = new AuditLog(action, level, details, ipAddress, userId, userRole);
    this.db.auditLogs.save(log);
  }
}
