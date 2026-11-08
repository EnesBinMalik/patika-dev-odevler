/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OOP Prensibi: Soyut Sınıf (Abstract Class) & Kalıtım (Inheritance) & Polimorfizm
 * Geliştirici: Enes Öztürk
 */

import { Account, AccountType, Currency } from '../../types';

export interface IAccountOperations {
  deposit(amount: number): number;
  withdraw(amount: number): number;
  getBalance(): number;
  canWithdraw(amount: number): boolean;
  calculateInterest?(): number;
}

export abstract class AbstractAccount implements Account, IAccountOperations {
  public id: string;
  public createdAt: string;
  public updatedAt?: string;
  public accountNumber: string;
  public iban: string;
  public cardNumber: string;
  public cardExpiry: string;
  public cardCvv: string;
  public abstract accountType: AccountType;
  public currency: Currency;
  public balance: number;
  public dailyWithdrawalLimit: number;
  public todayWithdrawnAmount: number;
  public customerId: string;

  constructor(data: Account) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.accountNumber = data.accountNumber;
    this.iban = data.iban;
    this.cardNumber = data.cardNumber;
    this.cardExpiry = data.cardExpiry;
    this.cardCvv = data.cardCvv;
    this.currency = data.currency;
    this.balance = data.balance;
    this.dailyWithdrawalLimit = data.dailyWithdrawalLimit;
    this.todayWithdrawnAmount = data.todayWithdrawnAmount;
    this.customerId = data.customerId;
  }

  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): number {
    if (amount <= 0) {
      throw new Error('Yatırılacak tutar pozitif bir değer olmalıdır.');
    }
    this.balance += amount;
    this.updatedAt = new Date().toISOString();
    return this.balance;
  }

  public abstract canWithdraw(amount: number): boolean;

  public withdraw(amount: number): number {
    if (!this.canWithdraw(amount)) {
      throw new Error('Para çekme koşulları sağlanamadı.');
    }
    this.balance -= amount;
    this.todayWithdrawnAmount += amount;
    this.updatedAt = new Date().toISOString();
    return this.balance;
  }
}

// Vadesiz Hesap (Checking Account)
export class CheckingAccount extends AbstractAccount {
  public accountType = AccountType.CHECKING;

  public canWithdraw(amount: number): boolean {
    return amount > 0 && this.balance >= amount && (this.todayWithdrawnAmount + amount <= this.dailyWithdrawalLimit);
  }
}

// Vadeli / Birikim Hesabı (Savings Account)
export class SavingsAccount extends AbstractAccount {
  public accountType = AccountType.SAVINGS;
  public interestRate: number = 0.45; // %45 Yıllık Faiz

  public canWithdraw(amount: number): boolean {
    // Vadeli hesaptan vadesi dolmadan çekimde bakiye kontrolü
    return amount > 0 && this.balance >= amount;
  }

  public calculateInterest(): number {
    return (this.balance * this.interestRate) / 12; // Aylık getiri
  }
}
