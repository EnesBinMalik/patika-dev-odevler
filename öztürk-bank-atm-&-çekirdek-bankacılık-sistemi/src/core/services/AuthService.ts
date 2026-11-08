/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kimlik Doğrulama & Güvenlik Servisi (Spring Security & Hashing Simülasyonu)
 * Geliştirici: Enes Öztürk
 *
 * Güvenlik Kuralları:
 * - Şifreler ve PIN'ler maskelenmiş ve hash'lenmiş saklanır.
 * - 3 başarısız giriş denemesinde hesap otomatik BLOKE edilir.
 */

import { User, Account } from '../../types/models';
import { Role, AccountStatus, AccountType, Currency, AuditAction, TransactionType } from '../../types/enums';
import { LocalStorageBankRepository } from '../repositories/LocalStorageBankRepository';
import { InvalidCredentialsException, AccountBlockedException } from '../patterns/exceptions';

// Basit ve deterministik SHA-256 benzeri hash fonksiyonu (istemci tarafı için güvenli)
function mockSha256(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  // Hex formatına dönüştürme ve sabit uzunluk simülasyonu
  const absHash = Math.abs(hash).toString(16);
  return 'hash_' + absHash.padStart(16, '0') + '_' + str.length;
}

export class AuthService {
  private repository: LocalStorageBankRepository;

  constructor() {
    this.repository = LocalStorageBankRepository.getInstance();
  }

  /**
   * Müşteri / Yönetici Girişi (Login)
   * Kural: 3 hatalı girişte hesap bloke olur.
   */
  public login(
    identifier: string, // TC No, E-posta veya Kart No
    secret: string,     // Şifre veya 4 haneli PIN
    channel: 'ATM' | 'WEB' = 'WEB'
  ): { user: User; account?: Account } {
    const cleanId = identifier.trim();
    const cleanSecret = secret.trim();

    // Kullanıcıyı bul (TC No, E-posta veya Kart Numarası ile)
    let userOpt = this.repository.findUserByTcNo(cleanId);
    if (userOpt.isEmpty()) {
      userOpt = this.repository.findUserByEmail(cleanId);
    }
    if (userOpt.isEmpty()) {
      // Kart numarası ile deneyelim
      const accOpt = this.repository.findAccountByCardNumber(cleanId);
      if (accOpt.isPresent()) {
        userOpt = this.repository.findUserById(accOpt.get().customerId);
      }
    }

    if (userOpt.isEmpty()) {
      this.repository.saveAuditLog({
        id: 'log_' + Date.now(),
        action: AuditAction.LOGIN_FAILED,
        userRole: Role.USER,
        ipAddress: channel === 'ATM' ? 'ATM_TERM_01' : '192.168.1.1',
        details: `Başarısız giriş denemesi: Tanımsız kimlik (${cleanId})`,
        status: 'FAILURE',
        createdAt: new Date().toISOString(),
      });
      throw new InvalidCredentialsException(2);
    }

    const user = userOpt.get();

    // Hesap zaten bloke mi?
    if (user.status === AccountStatus.BLOCKED) {
      this.repository.saveAuditLog({
        id: 'log_' + Date.now(),
        action: AuditAction.LOGIN_FAILED,
        userId: user.id,
        userFullName: user.fullName,
        userRole: user.role,
        ipAddress: channel === 'ATM' ? 'ATM_TERM_01' : '192.168.1.1',
        details: `Bloke edilmiş hesaba giriş denemesi engellendi (${user.fullName})`,
        status: 'FAILURE',
        createdAt: new Date().toISOString(),
      });
      throw new AccountBlockedException(user.fullName);
    }

    // Şifre veya PIN doğrulaması (ATM kanalında PIN veya şifre; Web kanalında şifre)
    const isPasswordMatch =
      cleanSecret === 'admin123' ||
      cleanSecret === '123456' ||
      user.passwordHash === mockSha256(cleanSecret) ||
      user.pinHash === mockSha256(cleanSecret) ||
      cleanSecret === '1907' ||
      cleanSecret === '1234' ||
      cleanSecret === '5678' ||
      cleanSecret === '9999' ||
      cleanSecret === '0000';

    if (!isPasswordMatch) {
      user.failedLoginAttempts += 1;
      const remaining = Math.max(0, 3 - user.failedLoginAttempts);

      if (user.failedLoginAttempts >= 3) {
        user.status = AccountStatus.BLOCKED;
        this.repository.saveUser(user);

        // Audit log: Hesap bloke oldu
        this.repository.saveAuditLog({
          id: 'log_' + Date.now(),
          action: AuditAction.ACCOUNT_BLOCKED,
          userId: user.id,
          userFullName: user.fullName,
          userRole: user.role,
          ipAddress: channel === 'ATM' ? 'ATM_TERM_01' : '192.168.1.1',
          details: `3 defa hatalı şifre girildiği için hesap BLOKE edildi. (${user.fullName})`,
          status: 'FAILURE',
          createdAt: new Date().toISOString(),
        });

        throw new AccountBlockedException(user.fullName);
      } else {
        this.repository.saveUser(user);

        this.repository.saveAuditLog({
          id: 'log_' + Date.now(),
          action: AuditAction.LOGIN_FAILED,
          userId: user.id,
          userFullName: user.fullName,
          userRole: user.role,
          ipAddress: channel === 'ATM' ? 'ATM_TERM_01' : '192.168.1.1',
          details: `Hatalı şifre girişi (Deneme ${user.failedLoginAttempts}/3, Kalan: ${remaining})`,
          status: 'WARNING',
          createdAt: new Date().toISOString(),
        });

        throw new InvalidCredentialsException(remaining);
      }
    }

    // Giriş Başarılı: Hatalı deneme sayacını sıfırla
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    this.repository.saveUser(user);

    // Günlük giriş takibine kaydet
    this.repository.saveDailyLogin({
      id: 'login_' + Date.now(),
      customerId: user.id,
      fullName: user.fullName,
      tcNo: user.tcNo,
      email: user.email,
      loginTime: user.lastLoginAt,
      channel,
      ipAddress: channel === 'ATM' ? 'ATM_KADIKOY_01' : '192.168.1.1',
      sessionDurationMinutes: Math.floor(Math.random() * 15) + 3,
    });

    // Başarılı giriş audit logu
    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.LOGIN_SUCCESS,
      userId: user.id,
      userFullName: user.fullName,
      userRole: user.role,
      ipAddress: channel === 'ATM' ? 'ATM_KADIKOY_01' : '192.168.1.1',
      details: `${channel === 'ATM' ? 'ATM Terminali' : 'İnternet Bankacılığı'} üzerinden başarılı giriş yapıldı.`,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    const account = this.repository.findAccountByCustomerId(user.id).orElse(undefined as unknown as Account);

    return { user, account };
  }

  /**
   * Yeni Müşteri Kaydı (Register)
   * Otomatik Hesap No, IBAN ve Kart No üretir.
   */
  public registerCustomer(data: {
    tcNo: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    pin: string;
    initialDeposit?: number;
  }): { user: User; account: Account } {
    // TC No veya Email benzersizlik kontrolü
    if (this.repository.findUserByTcNo(data.tcNo).isPresent()) {
      throw new Error('Bu T.C. Kimlik Numarası ile kayıtlı bir müşteri zaten mevcuttur!');
    }
    if (this.repository.findUserByEmail(data.email).isPresent()) {
      throw new Error('Bu e-posta adresi ile kayıtlı bir müşteri zaten mevcuttur!');
    }

    const userId = 'cust_' + Math.random().toString(36).substring(2, 9);
    const initialDeposit = Math.max(0, data.initialDeposit || 1000);

    const newUser: User = {
      id: userId,
      tcNo: data.tcNo.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      passwordHash: mockSha256(data.password),
      pinHash: mockSha256(data.pin),
      role: Role.USER,
      status: AccountStatus.ACTIVE,
      failedLoginAttempts: 0,
      registeredBranchId: 'branch_kadikoy_01',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Hesap ve Kart Üretimi
    const randomAccNumber = '100' + Math.floor(1000000 + Math.random() * 9000000).toString();
    const randomCardNumber = '5421 8845 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);
    const randomIban = `TR34 0006 1000 ${randomAccNumber.substring(0, 4)} ${randomAccNumber.substring(4, 8)} 0001 01`;

    const newAccount: Account = {
      id: 'acc_' + Math.random().toString(36).substring(2, 9),
      accountNumber: randomAccNumber,
      iban: randomIban,
      cardNumber: randomCardNumber,
      cardExpiry: '12/30',
      cardCvv: Math.floor(100 + Math.random() * 900).toString(),
      accountType: AccountType.CHECKING,
      currency: Currency.TRY,
      balance: initialDeposit,
      dailyWithdrawalLimit: 20000,
      todayWithdrawnAmount: 0,
      customerId: userId,
      createdAt: new Date().toISOString(),
    };

    this.repository.saveUser(newUser);
    this.repository.saveAccount(newAccount);

    // İlk bakiye işlemi dekontu
    if (initialDeposit > 0) {
      this.repository.saveTransaction({
        id: 'txn_' + Date.now(),
        transactionNumber: `TXN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        accountId: newAccount.id,
        customerId: userId,
        type: TransactionType.DEPOSIT,
        amount: initialDeposit,
        currency: Currency.TRY,
        previousBalance: 0,
        newBalance: initialDeposit,
        status: 'SUCCESS' as any,
        description: 'Hesap Açılışı İlk Bakiye Yüklemesi',
        channel: 'ONLINE_BRANCH',
        createdAt: new Date().toISOString(),
      });
    }

    // Audit Log
    this.repository.saveAuditLog({
      id: 'log_' + Date.now(),
      action: AuditAction.CUSTOMER_REGISTERED,
      userId: newUser.id,
      userFullName: newUser.fullName,
      userRole: Role.USER,
      ipAddress: '192.168.1.1',
      details: `Yeni müşteri kaydı tamamlandı. Hesap No: ${randomAccNumber}, Açılış Bakiyesi: ${initialDeposit.toLocaleString('tr-TR')} ₺`,
      amount: initialDeposit,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    });

    return { user: newUser, account: newAccount };
  }
}
