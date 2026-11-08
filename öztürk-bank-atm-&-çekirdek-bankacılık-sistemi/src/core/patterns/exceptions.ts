/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bankacılık Özel Hata Tipleri (Domain Specific Exceptions)
 * Geliştirici: Enes Öztürk
 */

export class BankingException extends Error {
  public readonly code: string;
  public readonly timestamp: string;

  constructor(message: string, code: string = 'BANK_ERR_GENERIC') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InsufficientBalanceException extends BankingException {
  constructor(currentBalance: number, requestedAmount: number) {
    super(
      `Yetersiz Bakiye! Hesabınızda ${currentBalance.toLocaleString('tr-TR')} ₺ bulunmaktadır, çekilmek istenen tutar: ${requestedAmount.toLocaleString('tr-TR')} ₺.`,
      'BANK_ERR_INSUFFICIENT_FUNDS'
    );
  }
}

export class AccountBlockedException extends BankingException {
  constructor(fullName?: string) {
    super(
      `Hesabınız güvenlik nedeniyle BLOKE edilmiştir! (3 kez hatalı şifre girişi). Lütfen şube yöneticiniz (Admin) ile iletişime geçiniz.`,
      'BANK_ERR_ACCOUNT_BLOCKED'
    );
  }
}

export class InvalidCredentialsException extends BankingException {
  public readonly remainingAttempts: number;

  constructor(remainingAttempts: number) {
    super(
      remainingAttempts > 0
        ? `Hatalı şifre veya kimlik bilgisi! Kalan deneme hakkı: ${remainingAttempts}`
        : `Hatalı giriş! Deneme hakkınız bitti, hesabınız bloke edildi.`,
      'BANK_ERR_INVALID_CREDENTIALS'
    );
    this.remainingAttempts = remainingAttempts;
  }
}

export class DailyLimitExceededException extends BankingException {
  constructor(dailyLimit: number, todayWithdrawn: number, requested: number) {
    super(
      `Günlük nakit çekim limiti aşıldı! Günlük limit: ${dailyLimit.toLocaleString('tr-TR')} ₺, bugün çekilen: ${todayWithdrawn.toLocaleString('tr-TR')} ₺, kalan çekilebilir limit: ${(dailyLimit - todayWithdrawn).toLocaleString('tr-TR')} ₺.`,
      'BANK_ERR_DAILY_LIMIT_EXCEEDED'
    );
  }
}

export class AccountNotFoundException extends BankingException {
  constructor(identifier: string) {
    super(`Hesap bulunamadı! Belirtilen IBAN veya Hesap No geçersiz: ${identifier}`, 'BANK_ERR_ACCOUNT_NOT_FOUND');
  }
}

export class InvalidAmountException extends BankingException {
  constructor(msg: string = 'İşlem tutarı 0 veya negatif olamaz! En az 10 ₺ işlem yapabilirsiniz.') {
    super(msg, 'BANK_ERR_INVALID_AMOUNT');
  }
}
