/**
 * Transaction Entity
 * Mimar: Enes Öztürk
 * Para Yatırma, Çekme, Havale/EFT kayıtları
 */

import { BaseEntity } from '../oop/abstracts';
import { ITransactionEntity } from '../oop/interfaces';
import { TransactionType, TransactionStatus } from '../enums';

export class Transaction extends BaseEntity implements ITransactionEntity {
  public transactionNumber: string;
  public sourceAccountId: string;
  public targetAccountId?: string;
  public targetIban?: string;
  public targetRecipientName?: string;
  public amount: number;
  public fee: number;
  public transactionType: TransactionType;
  public status: TransactionStatus;
  public description: string;
  public balanceAfter: number;
  public executedByUserId: string;

  constructor(
    transactionNumber: string,
    sourceAccountId: string,
    amount: number,
    transactionType: TransactionType,
    status: TransactionStatus,
    description: string,
    balanceAfter: number,
    executedByUserId: string,
    fee: number = 0,
    targetAccountId?: string,
    targetIban?: string,
    targetRecipientName?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this.transactionNumber = transactionNumber;
    this.sourceAccountId = sourceAccountId;
    this.amount = amount;
    this.transactionType = transactionType;
    this.status = status;
    this.description = description;
    this.balanceAfter = balanceAfter;
    this.executedByUserId = executedByUserId;
    this.fee = fee;
    this.targetAccountId = targetAccountId;
    this.targetIban = targetIban;
    this.targetRecipientName = targetRecipientName;
  }

  public static generateTransactionNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TRX-${timestamp}-${random}`;
  }

  public isTransfer(): boolean {
    return this.transactionType === TransactionType.TRANSFER_OUT || this.transactionType === TransactionType.TRANSFER_IN;
  }

  public static fromJSON(json: Record<string, unknown>): Transaction {
    return new Transaction(
      String(json.transactionNumber || ''),
      String(json.sourceAccountId || ''),
      Number(json.amount || 0),
      (json.transactionType as TransactionType) || TransactionType.DEPOSIT,
      (json.status as TransactionStatus) || TransactionStatus.SUCCESS,
      String(json.description || ''),
      Number(json.balanceAfter || 0),
      String(json.executedByUserId || ''),
      Number(json.fee || 0),
      json.targetAccountId ? String(json.targetAccountId) : undefined,
      json.targetIban ? String(json.targetIban) : undefined,
      json.targetRecipientName ? String(json.targetRecipientName) : undefined,
      json.id ? String(json.id) : undefined,
      json.createdAt ? String(json.createdAt) : undefined,
      json.updatedAt ? String(json.updatedAt) : undefined
    );
  }
}
