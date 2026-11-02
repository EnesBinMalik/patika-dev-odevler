import { BankAccountState, ResultType } from '../types/banking';

export class SimulatedRustAccount {
  accountNumber: string;
  holderName: string;
  private balanceAmount: number;

  constructor(accountNumber: string, holderName: string, initialBalance: f64 = 0) {
    this.accountNumber = accountNumber;
    this.holderName = holderName;
    this.balanceAmount = initialBalance;
  }

  // Corresponds exactly to: fn deposit(&mut self, amount: f64) -> Result<(), String>
  deposit(amount: number): ResultType<void, string> {
    if (amount <= 0) {
      return {
        ok: false,
        error: "Yatırılacak tutar sıfırdan büyük (pozitif) olmalıdır!",
      };
    }
    this.balanceAmount += amount;
    return { ok: true, value: undefined };
  }

  // Corresponds exactly to: fn withdraw(&mut self, amount: f64) -> Result<(), String>
  withdraw(amount: number): ResultType<void, string> {
    if (amount <= 0) {
      return {
        ok: false,
        error: "Çekilecek tutar sıfırdan büyük (pozitif) olmalıdır!",
      };
    }
    if (amount > this.balanceAmount) {
      return {
        ok: false,
        error: `Yetersiz bakiye! Mevcut bakiye: ${this.balanceAmount.toFixed(2)} TL, Talep edilen: ${amount.toFixed(2)} TL`,
      };
    }
    this.balanceAmount -= amount;
    return { ok: true, value: undefined };
  }

  // Corresponds to: fn balance(&self) -> f64
  balance(): number {
    return this.balanceAmount;
  }

  getState(): BankAccountState {
    return {
      accountNumber: this.accountNumber,
      holderName: this.holderName,
      balance: this.balanceAmount,
    };
  }
}
type f64 = number;
