/**
 * Design Pattern: Factory Method Pattern
 * İşlem (Transaction) Nesnelerinin Standart ve Güvenli Oluşturulması
 * Mimar: Enes Öztürk
 */

import { Transaction } from '../models/Transaction';
import { TransactionType, TransactionStatus } from '../enums';
import { IFeeStrategy } from '../oop/interfaces';
import { StandardFeeStrategy } from './FeeStrategy';

export class TransactionFactory {
  private static defaultFeeStrategy: IFeeStrategy = new StandardFeeStrategy();

  public static setFeeStrategy(strategy: IFeeStrategy): void {
    this.defaultFeeStrategy = strategy;
  }

  public static createDeposit(
    sourceAccountId: string,
    amount: number,
    balanceAfter: number,
    executedByUserId: string,
    description: string = 'ATM Nakit Para Yatırma'
  ): Transaction {
    const fee = this.defaultFeeStrategy.calculateFee(amount, TransactionType.DEPOSIT);
    return new Transaction(
      Transaction.generateTransactionNumber(),
      sourceAccountId,
      amount,
      TransactionType.DEPOSIT,
      TransactionStatus.SUCCESS,
      description,
      balanceAfter,
      executedByUserId,
      fee
    );
  }

  public static createWithdraw(
    sourceAccountId: string,
    amount: number,
    balanceAfter: number,
    executedByUserId: string,
    description: string = 'ATM Nakit Para Çekme'
  ): Transaction {
    const fee = this.defaultFeeStrategy.calculateFee(amount, TransactionType.WITHDRAW);
    return new Transaction(
      Transaction.generateTransactionNumber(),
      sourceAccountId,
      amount,
      TransactionType.WITHDRAW,
      TransactionStatus.SUCCESS,
      description,
      balanceAfter,
      executedByUserId,
      fee
    );
  }

  public static createTransferOut(
    sourceAccountId: string,
    targetIban: string,
    targetRecipientName: string,
    amount: number,
    balanceAfter: number,
    executedByUserId: string,
    customDescription?: string,
    targetAccountId?: string,
    feeStrategy?: IFeeStrategy
  ): Transaction {
    const strategy = feeStrategy || this.defaultFeeStrategy;
    const fee = strategy.calculateFee(amount, TransactionType.TRANSFER_OUT);
    const desc = customDescription || `Havale / FAST Transfer: ${targetRecipientName} (${targetIban})`;

    return new Transaction(
      Transaction.generateTransactionNumber(),
      sourceAccountId,
      amount,
      TransactionType.TRANSFER_OUT,
      TransactionStatus.SUCCESS,
      desc,
      balanceAfter,
      executedByUserId,
      fee,
      targetAccountId,
      targetIban,
      targetRecipientName
    );
  }

  public static createTransferIn(
    targetAccountId: string,
    sourceIban: string,
    senderName: string,
    amount: number,
    balanceAfter: number,
    targetUserId: string,
    customDescription?: string,
    sourceAccountId?: string
  ): Transaction {
    const desc = customDescription || `Gelen Havale: ${senderName} tarafından`;

    return new Transaction(
      Transaction.generateTransactionNumber(),
      targetAccountId, // hedef hesap için ana hesap
      amount,
      TransactionType.TRANSFER_IN,
      TransactionStatus.SUCCESS,
      desc,
      balanceAfter,
      targetUserId,
      0, // Alıcı için masraf 0
      sourceAccountId,
      sourceIban,
      senderName
    );
  }
}
