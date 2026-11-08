/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 */

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  SUSPENDED = 'SUSPENDED',
}

export enum AccountType {
  CHECKING = 'CHECKING', // Vadesiz Mevduat Hesabı
  SAVINGS = 'SAVINGS',   // Vadeli / Birikim Hesabı
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',       // Para Yatırma
  WITHDRAW = 'WITHDRAW',     // Para Çekme
  TRANSFER_OUT = 'TRANSFER_OUT', // Giden Havale / EFT
  TRANSFER_IN = 'TRANSFER_IN',   // Gelen Havale / EFT
  SYSTEM_ADJUST = 'SYSTEM_ADJUST', // Banka Yetkilisi Müdahalesi
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED',
  ACCOUNT_UNBLOCKED = 'ACCOUNT_UNBLOCKED',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  PIN_CHANGED = 'PIN_CHANGED',
  CUSTOMER_REGISTERED = 'CUSTOMER_REGISTERED',
  BALANCE_ADJUSTED = 'BALANCE_ADJUSTED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_IMPORTED = 'DATA_IMPORTED',
}

export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
}
