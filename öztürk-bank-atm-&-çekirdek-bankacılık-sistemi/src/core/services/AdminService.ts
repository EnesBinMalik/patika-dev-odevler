/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Banka Yetkilisi (Admin) Yönetim Servisi
 * Geliştirici: Enes Öztürk
 *
 * Görevler:
 * - Gün içinde sisteme giren müşterileri takip etme.
 * - SQL INNER JOIN ile müşteri ve hesap bakiyelerine erişim.
 * - Bloke hesapları kaldırma (Unblock).
 * - Bakiye düzeltme ve şube likidite takibi.
 */

import { LocalStorageBankRepository } from '../repositories/LocalStorageBankRepository';
import { CustomerAccountProjection, DailyLoginRecord, User, Account } from '../../types/models';
import { AccountStatus, Role, AuditAction } from '../../types/enums';

export class AdminService {
  private repository: LocalStorageBankRepository;

  constructor() {
    this.repository = LocalStorageBankRepository.getInstance();
  }

  /**
   * Gün içinde sisteme giren müşterilerin listesi
   */
  public getDailyLogins(): DailyLoginRecord[] {
    return this.repository.findDailyLogins();
  }

  /**
   * Müşteri ve Hesap Bilgileri (SQL INNER JOIN projeksiyonu)
   */
  public getCustomerAccountProjections(): CustomerAccountProjection[] {
    return this.repository.findCustomerAccountProjections();
  }

  /**
   * Bloke Olan Müşterinin Engelini Kaldırma (Unblock)
   */
  public unblockCustomer(customerId: string, adminFullName: string = 'Enes Öztürk'): User {
    const userOpt = this.repository.findUserById(customerId);
    if (userOpt.isEmpty()) {
      throw new Error('Müşteri bulunamadı.');
    }

    const user = userOpt.get();
    user.status = AccountStatus.ACTIVE;
    user.failedLoginAttempts = 0;
    this.repository.saveUser(user);

    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.ACCOUNT_UNBLOCKED,
      userId: user.id,
      userFullName: user.fullName,
      userRole: Role.ADMIN,
      ipAddress: 'ADMIN_CONSOLE_SECURE',
      details: `Müşteri blokesi yönetici (${adminFullName}) tarafından kaldırıldı ve deneme hakları sıfırlandı.`,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return user;
  }

  /**
   * Yönetici Bakiye Müdahalesi (Manuel Düzeltme)
   */
  public adjustCustomerBalance(
    customerId: string,
    amount: number,
    isCredit: boolean, // true = ekle, false = düş
    reason: string,
    adminFullName: string = 'Enes Öztürk'
  ): { updatedAccount: Account } {
    const accOpt = this.repository.findAccountByCustomerId(customerId);
    if (accOpt.isEmpty()) {
      throw new Error('Müşteriye ait hesap bulunamadı.');
    }

    const account = accOpt.get();
    const prevBalance = account.balance;

    if (isCredit) {
      account.balance += amount;
    } else {
      if (account.balance < amount) {
        throw new Error('Hesap bakiyesi belirtilen düşüm tutarından az olamaz.');
      }
      account.balance -= amount;
    }

    this.repository.saveAccount(account);

    const user = this.repository.findUserById(customerId).orElse(undefined as unknown as User);

    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.BALANCE_ADJUSTED,
      userId: customerId,
      userFullName: user?.fullName || 'Müşteri',
      userRole: Role.ADMIN,
      ipAddress: 'ADMIN_CONSOLE_SECURE',
      details: `Yönetici (${adminFullName}) bakiye düzeltmesi yaptı: ${isCredit ? '+' : '-'}${amount.toLocaleString('tr-TR')} ₺. Neden: ${reason}. Önceki: ${prevBalance.toLocaleString('tr-TR')} ₺, Yeni: ${account.balance.toLocaleString('tr-TR')} ₺`,
      amount,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return { updatedAccount: account };
  }

  /**
   * Banka Genel Analitikleri
   */
  public getBankAnalytics() {
    return this.repository.getBankAnalytics();
  }
}
