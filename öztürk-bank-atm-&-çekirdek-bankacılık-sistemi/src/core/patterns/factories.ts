/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tasarım Deseni: Factory & Builder Pattern
 * Geliştirici: Enes Öztürk
 */

import { Transaction, TransactionType, TransactionStatus, Currency } from '../../types';

export class TransactionBuilder {
  private transaction: Partial<Transaction> = {
    id: 'txn_' + Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    status: TransactionStatus.SUCCESS,
    currency: Currency.TRY,
  };

  public setTransactionNumber(num?: string): this {
    this.transaction.transactionNumber =
      num || `TXN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    return this;
  }

  public setAccountId(accountId: string): this {
    this.transaction.accountId = accountId;
    return this;
  }

  public setCustomerId(customerId: string): this {
    this.transaction.customerId = customerId;
    return this;
  }

  public setType(type: TransactionType): this {
    this.transaction.type = type;
    return this;
  }

  public setAmount(amount: number): this {
    this.transaction.amount = amount;
    return this;
  }

  public setBalances(prev: number, current: number): this {
    this.transaction.previousBalance = prev;
    this.transaction.newBalance = current;
    return this;
  }

  public setDescription(desc: string): this {
    this.transaction.description = desc;
    return this;
  }

  public setChannel(channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH' | 'ADMIN_CONSOLE'): this {
    this.transaction.channel = channel;
    return this;
  }

  public setTarget(iban?: string, title?: string): this {
    this.transaction.targetIban = iban;
    this.transaction.targetAccountTitle = title;
    return this;
  }

  public build(): Transaction {
    if (!this.transaction.transactionNumber) {
      this.setTransactionNumber();
    }
    return this.transaction as Transaction;
  }
}

export class TransactionFactory {
  public static createDeposit(
    accountId: string,
    customerId: string,
    amount: number,
    prevBalance: number,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH',
    note?: string
  ): Transaction {
    return new TransactionBuilder()
      .setAccountId(accountId)
      .setCustomerId(customerId)
      .setType(TransactionType.DEPOSIT)
      .setAmount(amount)
      .setBalances(prevBalance, prevBalance + amount)
      .setDescription(note || (channel === 'ATM_TERMINAL' ? 'ATM Nakit Yatırma' : 'İnternet Şubesi Para Yatırma'))
      .setChannel(channel)
      .build();
  }

  public static createWithdrawal(
    accountId: string,
    customerId: string,
    amount: number,
    prevBalance: number,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH'
  ): Transaction {
    return new TransactionBuilder()
      .setAccountId(accountId)
      .setCustomerId(customerId)
      .setType(TransactionType.WITHDRAW)
      .setAmount(amount)
      .setBalances(prevBalance, prevBalance - amount)
      .setDescription(channel === 'ATM_TERMINAL' ? 'ATM Nakit Para Çekme' : 'Şube / Online Para Çekme')
      .setChannel(channel)
      .build();
  }

  public static createTransferOut(
    accountId: string,
    customerId: string,
    amount: number,
    prevBalance: number,
    targetIban: string,
    targetTitle: string,
    description: string,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH'
  ): Transaction {
    return new TransactionBuilder()
      .setAccountId(accountId)
      .setCustomerId(customerId)
      .setType(TransactionType.TRANSFER_OUT)
      .setAmount(amount)
      .setBalances(prevBalance, prevBalance - amount)
      .setTarget(targetIban, targetTitle)
      .setDescription(`Havale/EFT Gönderimi: ${targetTitle} - ${description}`)
      .setChannel(channel)
      .build();
  }

  public static createTransferIn(
    accountId: string,
    customerId: string,
    amount: number,
    prevBalance: number,
    senderIban: string,
    senderTitle: string,
    description: string,
    channel: 'ATM_TERMINAL' | 'ONLINE_BRANCH'
  ): Transaction {
    return new TransactionBuilder()
      .setAccountId(accountId)
      .setCustomerId(customerId)
      .setType(TransactionType.TRANSFER_IN)
      .setAmount(amount)
      .setBalances(prevBalance, prevBalance + amount)
      .setTarget(senderIban, senderTitle)
      .setDescription(`Gelen Havale/EFT: ${senderTitle} - ${description}`)
      .setChannel(channel)
      .build();
  }
}
