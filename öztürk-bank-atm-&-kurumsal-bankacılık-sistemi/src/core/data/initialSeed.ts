/**
 * Öztürk Bank - Initial Database Seeding
 * Mimar: Enes Öztürk
 * İlk çalıştırmada gerçekçi bankacılık veritabanını hazırlar
 */

import { UserRole, AccountType, Currency, LogLevel, LogAction, TransactionType, TransactionStatus } from '../enums';
import { PasswordService } from '../security/PasswordService';
import { User, AdminUser, CustomerUser } from '../models/User';
import { Account, CheckingAccount, SavingsAccount } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { AuditLog, LoginSession } from '../models/AuditLog';

export function getInitialSeedData() {
  const adminId = 'usr-admin-enes';
  const defaultPassHash = PasswordService.hashPassword('123456');
  const customerPassHash = PasswordService.hashPassword('1234');

  // 1. Admin Kullanıcı
  const admin = new AdminUser(
    '10000000000',
    'Enes Öztürk',
    'enes.ozturk@ozturkbank.com.tr',
    '0555 123 4567',
    defaultPassHash,
    'OZ-DIR-001',
    'Banka Yönetim Kurulu & Sistem Baş Mimarı',
    adminId,
    '2026-01-01T08:00:00.000Z',
    '2026-01-01T08:00:00.000Z'
  );

  // 2. Müşteriler (Users) - admin (1) - user (N)
  const customers: CustomerUser[] = [
    new CustomerUser(
      '11111111111',
      'Ahmet Yılmaz',
      'ahmet.yilmaz@gmail.com',
      '0532 111 2233',
      customerPassHash,
      'Öztürk Bank Kadıköy Şubesi',
      false,
      0,
      new Date().toISOString(),
      adminId,
      'usr-cust-ahmet'
    ),
    new CustomerUser(
      '22222222222',
      'Zeynep Kaya',
      'zeynep.kaya@outlook.com',
      '0542 222 3344',
      customerPassHash,
      'Öztürk Bank Beşiktaş Şubesi',
      false,
      0,
      new Date().toISOString(),
      adminId,
      'usr-cust-zeynep'
    ),
    new CustomerUser(
      '33333333333',
      'Mehmet Demir',
      'mehmet.demir@gmail.com',
      '0505 333 4455',
      customerPassHash,
      'Öztürk Bank Çankaya Şubesi',
      true, // Bloke edilmiş müşteri örneği (3 kez hatalı giriş simülasyonu)
      3,
      '2026-11-05T14:20:00.000Z',
      adminId,
      'usr-cust-mehmet'
    ),
    new CustomerUser(
      '44444444444',
      'Ayşe Şahin',
      'ayse.sahin@hotmail.com',
      '0533 444 5566',
      customerPassHash,
      'Öztürk Bank Karşıyaka Şubesi',
      false,
      0,
      new Date().toISOString(),
      adminId,
      'usr-cust-ayse'
    ),
    new CustomerUser(
      '55555555555',
      'Burak Çelik',
      'burak.celik@yahoo.com',
      '0530 555 6677',
      customerPassHash,
      'Öztürk Bank Bursa Merkez Şube',
      false,
      0,
      new Date().toISOString(),
      adminId,
      'usr-cust-burak'
    )
  ];

  // 3. Hesaplar (Accounts) - User (1) - Account (N)
  const accounts: Account[] = [
    // Ahmet Yılmaz Hesapları
    new Account(
      'usr-cust-ahmet',
      '1001-200456',
      'TR330006100511112222333301',
      AccountType.CHECKING,
      Currency.TRY,
      32500,
      15000,
      1500,
      '1234',
      '5421883299101111',
      true,
      'acc-ahmet-tl'
    ),
    new Account(
      'usr-cust-ahmet',
      '1001-990123',
      'TR330006100511112222333302',
      AccountType.SAVINGS,
      Currency.TRY,
      75000,
      5000,
      0,
      '1234',
      '5421883299101112',
      true,
      'acc-ahmet-vadeli'
    ),

    // Zeynep Kaya Hesapları
    new Account(
      'usr-cust-zeynep',
      '2002-300789',
      'TR330006100522223333444401',
      AccountType.CHECKING,
      Currency.TRY,
      58400,
      20000,
      0,
      '1234',
      '5421883299102222',
      true,
      'acc-zeynep-tl'
    ),

    // Mehmet Demir Hesabı (Bloke)
    new Account(
      'usr-cust-mehmet',
      '3003-400123',
      'TR330006100533334444555501',
      AccountType.CHECKING,
      Currency.TRY,
      12150,
      10000,
      0,
      '1234',
      '5421883299103333',
      false, // hesap da pasif
      'acc-mehmet-tl'
    ),

    // Ayşe Şahin Hesapları
    new Account(
      'usr-cust-ayse',
      '4004-500456',
      'TR330006100544445555666601',
      AccountType.CHECKING,
      Currency.TRY,
      94300,
      25000,
      3000,
      '1234',
      '5421883299104444',
      true,
      'acc-ayse-tl'
    ),

    // Burak Çelik Hesabı
    new Account(
      'usr-cust-burak',
      '5005-600789',
      'TR330006100555556666777701',
      AccountType.CHECKING,
      Currency.TRY,
      8750,
      10000,
      0,
      '1234',
      '5421883299105555',
      true,
      'acc-burak-tl'
    )
  ];

  // 4. Geçmiş İşlemler (Transactions)
  const transactions: Transaction[] = [
    new Transaction(
      'TRX-20261105-1021',
      'acc-ahmet-tl',
      5000,
      TransactionType.DEPOSIT,
      TransactionStatus.SUCCESS,
      'ATM Nakit Para Yatırma - Kadıköy Şube ATM #02',
      32500,
      'usr-cust-ahmet',
      0,
      undefined,
      undefined,
      undefined,
      'trx-01',
      '2026-11-05T09:30:00.000Z'
    ),
    new Transaction(
      'TRX-20261105-1088',
      'acc-ahmet-tl',
      1500,
      TransactionType.WITHDRAW,
      TransactionStatus.SUCCESS,
      'ATM Nakit Para Çekme',
      31000,
      'usr-cust-ahmet',
      0,
      undefined,
      undefined,
      undefined,
      'trx-02',
      '2026-11-05T11:15:00.000Z'
    ),
    new Transaction(
      'TRX-20261104-9941',
      'acc-ahmet-tl',
      2500,
      TransactionType.TRANSFER_OUT,
      TransactionStatus.SUCCESS,
      'Havale: Kira Bedeli Kasım 2026',
      28500,
      'usr-cust-ahmet',
      0,
      'acc-zeynep-tl',
      'TR330006100522223333444401',
      'Zeynep Kaya',
      'trx-03',
      '2026-11-04T14:45:00.000Z'
    ),
    new Transaction(
      'TRX-20261104-9942',
      'acc-zeynep-tl',
      2500,
      TransactionType.TRANSFER_IN,
      TransactionStatus.SUCCESS,
      'Gelen Havale: Ahmet Yılmaz tarafından',
      58400,
      'usr-cust-zeynep',
      0,
      'acc-ahmet-tl',
      'TR330006100511112222333301',
      'Ahmet Yılmaz',
      'trx-04',
      '2026-11-04T14:45:00.000Z'
    )
  ];

  // 5. Günün Giriş Oturumları (Login Sessions - Admin gün içinde takip etmesi için)
  const today = new Date().toISOString().slice(0, 10);
  const loginSessions: LoginSession[] = [
    new LoginSession(
      'usr-admin-enes',
      'Enes Öztürk',
      UserRole.ADMIN,
      `${today}T08:15:22.000Z`,
      '192.168.1.10 (Genel Müdürlük)',
      'Chrome 131.0 - Windows 11 Pro',
      true,
      undefined,
      'sess-01'
    ),
    new LoginSession(
      'usr-cust-ahmet',
      'Ahmet Yılmaz',
      UserRole.CUSTOMER,
      `${today}T09:12:04.000Z`,
      '85.105.42.19 (ATM Kadıköy #01)',
      'ATM Terminal Kiosk OS / Firefox',
      true,
      undefined,
      'sess-02'
    ),
    new LoginSession(
      'usr-cust-zeynep',
      'Zeynep Kaya',
      UserRole.CUSTOMER,
      `${today}T10:45:18.000Z`,
      '176.240.12.88 (Mobil Şube)',
      'ÖztürkBank Mobile App iOS 18',
      true,
      undefined,
      'sess-03'
    ),
    new LoginSession(
      'usr-cust-mehmet',
      'Mehmet Demir',
      UserRole.CUSTOMER,
      `${today}T11:02:11.000Z`,
      '88.230.15.91 (ATM Çankaya #04)',
      'ATM Terminal Kiosk OS',
      false,
      'Hatalı şifre girişi (3. deneme - KART BLOKE OLDU)',
      'sess-04'
    )
  ];

  // 6. Denetim ve Güvenlik Logları (Audit Logs)
  const auditLogs: AuditLog[] = [
    new AuditLog(
      LogAction.LOGIN_SUCCESS,
      LogLevel.SECURITY,
      'Sistem Baş Mimarı Enes Öztürk yönetim paneline güvenli giriş yaptı.',
      '192.168.1.10',
      'usr-admin-enes',
      UserRole.ADMIN,
      `${today}T08:15:22.000Z`,
      'log-01'
    ),
    new AuditLog(
      LogAction.LOGIN_SUCCESS,
      LogLevel.INFO,
      'Müşteri Ahmet Yılmaz ATM üzerinden başarıyla oturum açtı.',
      '85.105.42.19',
      'usr-cust-ahmet',
      UserRole.CUSTOMER,
      `${today}T09:12:04.000Z`,
      'log-02'
    ),
    new AuditLog(
      LogAction.MONEY_DEPOSITED,
      LogLevel.INFO,
      'Ahmet Yılmaz hesabına 5.000 ₺ nakit yatırdı. Yeni bakiye: 32.500 ₺',
      '85.105.42.19',
      'usr-cust-ahmet',
      UserRole.CUSTOMER,
      `${today}T09:30:00.000Z`,
      'log-03'
    ),
    new AuditLog(
      LogAction.ACCOUNT_BLOCKED,
      LogLevel.ERROR,
      'Mehmet Demir 3 defa hatalı PIN/şifre girmesi sebebiyle kartı ve hesabı bloke edildi.',
      '88.230.15.91',
      'usr-cust-mehmet',
      UserRole.CUSTOMER,
      `${today}T11:02:11.000Z`,
      'log-04'
    )
  ];

  return {
    users: [admin, ...customers],
    accounts,
    transactions,
    loginSessions,
    auditLogs
  };
}
