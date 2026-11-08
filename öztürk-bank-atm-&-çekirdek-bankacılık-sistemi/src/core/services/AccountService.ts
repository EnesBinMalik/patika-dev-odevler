/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Hesap ve Para İşlemleri Servisi (Account & Transaction Service)
 * Geliştirici: Enes Öztürk
 *
 * Kurallar:
 * - Para çekme: Bakiye yoksa işlem iptal edilir ("Validation: Eğer Müşterinin parası yoksa para çekemez").
 * - Para ekleme: Parasına eklenir.
 * - Havale/EFT: Alıcı ve gönderici bakiyeleri anlık güncellenir.
 * - Her işlem denetim (audit) loguna kaydedilir.
 */

import { Account, Transaction, User } from '../../types/models';
import { TransactionType, AuditAction } from '../../types/enums';
import { LocalStorageBankRepository } from '../repositories/LocalStorageBankRepository';
import {
  WithdrawalValidationStrategy,
  TransferValidationStrategy,
} from '../patterns/strategies';
import { TransactionFactory } from '../patterns/factories';
import { AccountNotFoundException } from '../patterns/exceptions';

export class AccountService {
  private repository: LocalStorageBankRepository;
  private withdrawalStrategy: WithdrawalValidationStrategy;
  private transferStrategy: TransferValidationStrategy;

  constructor() {
    this.repository = LocalStorageBankRepository.getInstance();
    this.withdrawalStrategy = new WithdrawalValidationStrategy();
    this.transferStrategy = new TransferValidationStrategy();
  }

  /**
   * Para Yatırma (Deposit)
   */
  public deposit(
    accountId: string,
    amount: number,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH' = 'ATM_TERMINAL',
    notes?: string
  ): { updatedAccount: Account; transaction: Transaction } {
    const account = this.repository
      .findAccountById(accountId)
      .orElseThrow(() => new AccountNotFoundException(accountId));

    if (amount <= 0) {
      throw new Error('Yatırılacak tutar en az 10 ₺ olmalıdır.');
    }

    const prevBalance = account.balance;
    account.balance += amount;
    this.repository.saveAccount(account);

    const transaction = TransactionFactory.createDeposit(
      account.id,
      account.customerId,
      amount,
      prevBalance,
      channel,
      notes
    );
    this.repository.saveTransaction(transaction);

    // Audit Log
    const user = this.repository.findUserById(account.customerId).orElse(undefined as unknown as User);
    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.DEPOSIT,
      userId: account.customerId,
      userFullName: user?.fullName || 'Müşteri',
      userRole: user?.role || ('USER' as any),
      ipAddress: channel === 'ATM_TERMINAL' ? 'ATM_TERM_01' : '192.168.1.1',
      details: `${channel === 'ATM_TERMINAL' ? 'ATM' : 'İnternet Şubesi'} üzerinden ${amount.toLocaleString('tr-TR')} ₺ nakit yatırıldı. Yeni bakiye: ${account.balance.toLocaleString('tr-TR')} ₺`,
      amount,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return { updatedAccount: account, transaction };
  }

  /**
   * Para Çekme (Withdraw)
   * Doğrulama: Bakiye kontrolü, günlük limit kontrolü.
   */
  public withdraw(
    accountId: string,
    amount: number,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH' = 'ATM_TERMINAL'
  ): { updatedAccount: Account; transaction: Transaction } {
    const account = this.repository
      .findAccountById(accountId)
      .orElseThrow(() => new AccountNotFoundException(accountId));

    // Strateji Deseni ile Doğrulama (Bakiye kontrolü burada zorunlu çalışır)
    this.withdrawalStrategy.validate({ account, amount });

    const prevBalance = account.balance;
    account.balance -= amount;
    account.todayWithdrawnAmount += amount;
    this.repository.saveAccount(account);

    const transaction = TransactionFactory.createWithdrawal(
      account.id,
      account.customerId,
      amount,
      prevBalance,
      channel
    );
    this.repository.saveTransaction(transaction);

    // Audit Log
    const user = this.repository.findUserById(account.customerId).orElse(undefined as unknown as User);
    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.WITHDRAW,
      userId: account.customerId,
      userFullName: user?.fullName || 'Müşteri',
      userRole: user?.role || ('USER' as any),
      ipAddress: channel === 'ATM_TERMINAL' ? 'ATM_TERM_01' : '192.168.1.1',
      details: `${channel === 'ATM_TERMINAL' ? 'ATM' : 'İnternet Şubesi'} üzerinden ${amount.toLocaleString('tr-TR')} ₺ nakit çekildi. Kalan bakiye: ${account.balance.toLocaleString('tr-TR')} ₺`,
      amount,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return { updatedAccount: account, transaction };
  }

  /**
   * Para Havale / EFT / Transfer
   */
  public transfer(
    sourceAccountId: string,
    targetIbanOrAccount: string,
    targetTitle: string,
    amount: number,
    description: string,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH' = 'ONLINE_BRANCH'
  ): { sourceAccount: Account; transaction: Transaction } {
    const sourceAccount = this.repository
      .findAccountById(sourceAccountId)
      .orElseThrow(() => new AccountNotFoundException(sourceAccountId));

    const cleanTarget = targetIbanOrAccount.replace(/\s+/g, '').toUpperCase();

    // Transfer Strateji Kontrolü
    this.transferStrategy.validate({
      sourceAccount,
      targetIban: cleanTarget,
      amount,
    });

    // Gönderici Bakiyesini Düş
    const prevSenderBalance = sourceAccount.balance;
    sourceAccount.balance -= amount;
    this.repository.saveAccount(sourceAccount);

    // Gönderici Dekontu
    const senderTxn = TransactionFactory.createTransferOut(
      sourceAccount.id,
      sourceAccount.customerId,
      amount,
      prevSenderBalance,
      targetIbanOrAccount,
      targetTitle,
      description,
      channel
    );
    this.repository.saveTransaction(senderTxn);

    // Eğer alıcı kendi bankamızın müşterisi ise (Internal Transfer / Havale), alıcı bakiyesini de artır
    let targetAccountOpt = this.repository.findAccountByIban(cleanTarget);
    if (targetAccountOpt.isEmpty()) {
      targetAccountOpt = this.repository.findAccountByNumber(cleanTarget);
    }

    if (targetAccountOpt.isPresent()) {
      const targetAccount = targetAccountOpt.get();
      const prevReceiverBalance = targetAccount.balance;
      targetAccount.balance += amount;
      this.repository.saveAccount(targetAccount);

      // Alıcı için de dekont oluştur
      const receiverUser = this.repository.findUserById(sourceAccount.customerId).orElse(undefined as unknown as User);
      const receiverTxn = TransactionFactory.createTransferIn(
        targetAccount.id,
        targetAccount.customerId,
        amount,
        prevReceiverBalance,
        sourceAccount.iban,
        receiverUser?.fullName || 'Banka Müşterisi',
        description,
        channel
      );
      this.repository.saveTransaction(receiverTxn);
    }

    // Audit Log
    const senderUser = this.repository.findUserById(sourceAccount.customerId).orElse(undefined as unknown as User);
    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.TRANSFER,
      userId: sourceAccount.customerId,
      userFullName: senderUser?.fullName || 'Müşteri',
      userRole: senderUser?.role || ('USER' as any),
      ipAddress: channel === 'ATM_TERMINAL' ? 'ATM_TERM_01' : '192.168.1.1',
      details: `${targetTitle} (${targetIbanOrAccount}) alıcısına ${amount.toLocaleString('tr-TR')} ₺ transfer edildi. Açıklama: ${description}`,
      amount,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return { sourceAccount, transaction: senderTxn };
  }

  /**
   * Hesap Bilgisini Yenile
   */
  public getAccount(accountId: string): Account {
    return this.repository
      .findAccountById(accountId)
      .orElseThrow(() => new AccountNotFoundException(accountId));
  }
}
