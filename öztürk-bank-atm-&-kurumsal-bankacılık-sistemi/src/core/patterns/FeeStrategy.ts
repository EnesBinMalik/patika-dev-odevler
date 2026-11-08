/**
 * Design Pattern: Strategy Pattern
 * Para Transferi & İşlem Ücreti Hesaplama Stratejileri
 * Mimar: Enes Öztürk
 */

import { IFeeStrategy } from '../oop/interfaces';
import { TransactionType } from '../enums';

export class StandardFeeStrategy implements IFeeStrategy {
  public getName(): string {
    return 'Standart Bankacılık Tarifesi';
  }

  public calculateFee(amount: number, type: TransactionType): number {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 0; // Para yatırma her zaman ücretsiz
      case TransactionType.WITHDRAW:
        return 0; // Kendi ATM'mizden para çekme ücretsiz
      case TransactionType.TRANSFER_OUT:
        // 5000 ₺ altı ücretsiz, üzeri için %0.05 (maks 15 ₺)
        if (amount <= 5000) return 0;
        return Math.min(15, Math.round(amount * 0.0005 * 100) / 100);
      default:
        return 0;
    }
  }
}

export class FastTransferFeeStrategy implements IFeeStrategy {
  public getName(): string {
    return 'FAST (7/24 Anlık Fon Transferi) Tarifesi';
  }

  public calculateFee(amount: number, type: TransactionType): number {
    if (type === TransactionType.TRANSFER_OUT) {
      // FAST Transfer için sabit sembolik 2.50 ₺
      return 2.50;
    }
    return 0;
  }
}

export class VipFeeStrategy implements IFeeStrategy {
  public getName(): string {
    return 'Öztürk Bank VIP Özel Müşteri Tarifesi';
  }

  public calculateFee(): number {
    return 0; // VIP müşteriler için tüm işlemler tamamen masrafsız
  }
}
