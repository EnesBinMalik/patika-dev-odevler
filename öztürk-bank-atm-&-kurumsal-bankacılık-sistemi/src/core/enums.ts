/**
 * Öztürk Bank - Core System Enums
 * Proje Mimarı: Enes Öztürk
 * S.O.L.I.D & Clean Code Standartlarına Uygun
 */

export enum UserRole {
  ADMIN = 'ADMIN',       // Banka Yöneticisi / Şube Müdürü
  CUSTOMER = 'CUSTOMER'  // Müşteri / Hesap Sahibi
}

export enum AccountType {
  CHECKING = 'CHECKING',       // Vadesiz TL/Döviz Hesabı
  SAVINGS = 'SAVINGS',         // Vadeli Birikim Hesabı
  INVESTMENT = 'INVESTMENT'    // Yatırım Hesabı
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',             // Para Yatırma
  WITHDRAW = 'WITHDRAW',           // Para Çekme
  TRANSFER_OUT = 'TRANSFER_OUT',   // Para Gönderme (Havale/EFT)
  TRANSFER_IN = 'TRANSFER_IN'      // Para Alma (Gelen Havale)
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED'
}

export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR'
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY'
}

export enum LogAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
  ACCOUNT_UNBLOCKED = 'ACCOUNT_UNBLOCKED',
  USER_REGISTERED = 'USER_REGISTERED',
  MONEY_DEPOSITED = 'MONEY_DEPOSITED',
  MONEY_WITHDRAWN = 'MONEY_WITHDRAWN',
  TRANSFER_COMPLETED = 'TRANSFER_COMPLETED',
  TRANSFER_FAILED = 'TRANSFER_FAILED',
  DATABASE_EXPORT = 'DATABASE_EXPORT',
  DATABASE_IMPORT = 'DATABASE_IMPORT'
}
