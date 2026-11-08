/**
 * Account Entity & Subclasses
 * OOP: Inheritance, Polymorphic balance check, Encapsulation
 * Mimar: Enes Öztürk
 */

import { BaseEntity } from '../oop/abstracts';
import { IAccountEntity } from '../oop/interfaces';
import { AccountType, Currency } from '../enums';

export class Account extends BaseEntity implements IAccountEntity {
  public userId: string;
  public accountNumber: string;
  public iban: string;
  public accountType: AccountType;
  public currency: Currency;
  public balance: number;
  public isActive: boolean;
  public dailyWithdrawLimit: number;
  public withdrawnToday: number;
  public cardPinHash: string;
  public cardNumber: string;

  constructor(
    userId: string,
    accountNumber: string,
    iban: string,
    accountType: AccountType = AccountType.CHECKING,
    currency: Currency = Currency.TRY,
    balance: number = 0,
    dailyWithdrawLimit: number = 10000,
    withdrawnToday: number = 0,
    cardPinHash: string = '1234',
    cardNumber: string = '5421000000000000',
    isActive: boolean = true,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.accountNumber = accountNumber;
    this.iban = iban;
    this.accountType = accountType;
    this.currency = currency;
    this.balance = balance;
    this.dailyWithdrawLimit = dailyWithdrawLimit;
    this.withdrawnToday = withdrawnToday;
    this.cardPinHash = cardPinHash;
    this.cardNumber = cardNumber;
    this.isActive = isActive;
  }

  public canWithdraw(amount: number): { allowed: boolean; reason?: string } {
    if (!this.isActive) {
      return { allowed: false, reason: 'Hesap aktif durumda değil!' };
    }
    if (amount <= 0) {
      return { allowed: false, reason: 'Çekilecek tutar sıfırdan büyük olmalıdır!' };
    }
    if (this.balance < amount) {
      return { allowed: false, reason: `Yetersiz Bakiye! Mevcut Bakiyeniz: ${this.balance.toLocaleString('tr-TR')} ₺` };
    }
    if (this.withdrawnToday + amount > this.dailyWithdrawLimit) {
      const remainingLimit = this.dailyWithdrawLimit - this.withdrawnToday;
      return { 
        allowed: false, 
        reason: `Günlük para çekme limitiniz aşıldı! Bugün kalan limitiniz: ${remainingLimit.toLocaleString('tr-TR')} ₺` 
      };
    }
    return { allowed: true };
  }

  public deposit(amount: number): void {
    if (amount <= 0) throw new Error('Yatırılacak tutar sıfırdan büyük olmalıdır!');
    this.balance += amount;
    this.touch();
  }

  public withdraw(amount: number): void {
    const check = this.canWithdraw(amount);
    if (!check.allowed) {
      throw new Error(check.reason || 'Para çekme işlemi onaylanmadı!');
    }
    this.balance -= amount;
    this.withdrawnToday += amount;
    this.touch();
  }

  public maskCardNumber(): string {
    if (!this.cardNumber || this.cardNumber.length < 16) return '**** **** **** ****';
    const first4 = this.cardNumber.slice(0, 4);
    const last4 = this.cardNumber.slice(12, 16);
    return `${first4} **** **** ${last4}`;
  }

  public getFormattedIban(): string {
    return this.iban.replace(/(.{4})/g, '$1 ').trim();
  }

  public static fromJSON(json: Record<string, unknown>): Account {
    return new Account(
      String(json.userId || ''),
      String(json.accountNumber || ''),
      String(json.iban || ''),
      (json.accountType as AccountType) || AccountType.CHECKING,
      (json.currency as Currency) || Currency.TRY,
      Number(json.balance || 0),
      Number(json.dailyWithdrawLimit || 10000),
      Number(json.withdrawnToday || 0),
      String(json.cardPinHash || '1234'),
      String(json.cardNumber || '5421000000000000'),
      Boolean(json.isActive !== undefined ? json.isActive : true),
      json.id ? String(json.id) : undefined,
      json.createdAt ? String(json.createdAt) : undefined,
      json.updatedAt ? String(json.updatedAt) : undefined
    );
  }
}

export class CheckingAccount extends Account {
  constructor(
    userId: string,
    accountNumber: string,
    iban: string,
    balance: number = 0,
    dailyWithdrawLimit: number = 15000,
    cardPinHash: string = '1234',
    cardNumber: string = '5421000000000000'
  ) {
    super(
      userId,
      accountNumber,
      iban,
      AccountType.CHECKING,
      Currency.TRY,
      balance,
      dailyWithdrawLimit,
      0,
      cardPinHash,
      cardNumber
    );
  }
}

export class SavingsAccount extends Account {
  public interestRate: number; // Yıllık faiz oranı %

  constructor(
    userId: string,
    accountNumber: string,
    iban: string,
    balance: number = 0,
    interestRate: number = 42.5
  ) {
    super(
      userId,
      accountNumber,
      iban,
      AccountType.SAVINGS,
      Currency.TRY,
      balance,
      5000,
      0,
      '1234',
      '5421000000009999'
    );
    this.interestRate = interestRate;
  }
}
