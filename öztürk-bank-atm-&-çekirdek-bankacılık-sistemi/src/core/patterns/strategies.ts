/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tasarım Deseni: Strategy Pattern (Strateji Deseni) & S.O.L.I.D Açık/Kapalı Prensibi
 * Geliştirici: Enes Öztürk
 */

import { Account } from '../../types';
import {
  InsufficientBalanceException,
  DailyLimitExceededException,
  InvalidAmountException,
} from './exceptions';

export interface IValidationStrategy<TContext> {
  validate(context: TContext): void;
}

export interface WithdrawalContext {
  account: Account;
  amount: number;
}

export interface TransferContext {
  sourceAccount: Account;
  targetAccount?: Account;
  targetIban: string;
  amount: number;
}

// Para Çekme Doğrulama Stratejisi
export class WithdrawalValidationStrategy implements IValidationStrategy<WithdrawalContext> {
  public validate(context: WithdrawalContext): void {
    const { account, amount } = context;

    if (!amount || amount <= 0) {
      throw new InvalidAmountException('Çekilecek tutar 0 veya negatif olamaz!');
    }

    if (amount % 10 !== 0) {
      throw new InvalidAmountException('ATM yalnızca 10 TL ve katları şeklinde banknot verebilir!');
    }

    // "Validation: Eğer Müşterinin parası yoksa para çekemez"
    if (account.balance < amount) {
      throw new InsufficientBalanceException(account.balance, amount);
    }

    // Günlük limit kontrolü
    if (account.todayWithdrawnAmount + amount > account.dailyWithdrawalLimit) {
      throw new DailyLimitExceededException(
        account.dailyWithdrawalLimit,
        account.todayWithdrawnAmount,
        amount
      );
    }
  }
}

// Para Transferi (Havale/EFT) Doğrulama Stratejisi
export class TransferValidationStrategy implements IValidationStrategy<TransferContext> {
  public validate(context: TransferContext): void {
    const { sourceAccount, targetAccount, targetIban, amount } = context;

    if (!amount || amount <= 0) {
      throw new InvalidAmountException('Transfer tutarı 0 veya negatif olamaz!');
    }

    if (sourceAccount.balance < amount) {
      throw new InsufficientBalanceException(sourceAccount.balance, amount);
    }

    if (sourceAccount.iban.replace(/\s+/g, '') === targetIban.replace(/\s+/g, '')) {
      throw new InvalidAmountException('Kendi hesabınıza havale yapamazsınız!');
    }

    if (!targetIban.startsWith('TR') || targetIban.replace(/\s+/g, '').length < 15) {
      throw new InvalidAmountException('Geçerli bir Türkiye IBAN numarası giriniz (TR ile başlamalıdır).');
    }
  }
}
