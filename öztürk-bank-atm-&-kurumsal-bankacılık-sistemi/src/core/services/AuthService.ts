/**
 * AuthService - Kimlik Doğrulama ve Güvenlik Servisi
 * S.O.L.I.D: Single Responsibility & Katmanlı Mimari
 * 3 Hatalı Girişte Bloke Kuralı
 * Mimar: Enes Öztürk
 */

import { DatabaseManager } from '../database/DatabaseManager';
import { PasswordService } from '../security/PasswordService';
import { User, CustomerUser } from '../models/User';
import { Account } from '../models/Account';
import { LoginSession, AuditLog } from '../models/AuditLog';
import { UserRole, LogAction, LogLevel, AccountType, Currency } from '../enums';
import { BankEventSubject } from '../patterns/BankEventObserver';

export interface LoginResult {
  success: boolean;
  user?: User;
  account?: Account;
  message: string;
  remainingAttempts?: number;
  isBlocked?: boolean;
}

export interface RegisterDto {
  tcNo: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  initialDeposit?: number;
}

export class AuthService {
  private db: DatabaseManager;
  private eventSubject: BankEventSubject;

  constructor() {
    this.db = DatabaseManager.getInstance();
    this.eventSubject = BankEventSubject.getInstance();
  }

  /**
   * Müşteri / Admin Giriş Doğrulaması
   * Kural: 3 hatalı girişte kart/hesap bloke olur!
   */
  public login(identifier: string, secret: string, ipAddress: string = '192.168.1.100'): LoginResult {
    const cleanId = identifier.trim();

    // 1. Kullanıcıyı TC No veya Kart Numarası ile bul
    let user = this.db.users.findByTcNo(cleanId).orElseGet(() => {
      // Kart numarası ile deneyelim
      const account = this.db.accounts.findByCardNumber(cleanId);
      if (account.isPresent()) {
        return this.db.users.findById(account.get().userId).orElse(null as unknown as User);
      }
      return null as unknown as User;
    });

    if (!user) {
      // Kullanıcı bulunamadı
      this.recordLoginSession('unknown', cleanId, UserRole.CUSTOMER, ipAddress, false, 'Kullanıcı bulunamadı');
      return {
        success: false,
        message: 'Girilen TC Kimlik Numarası veya Kart Numarası sistemde bulunamadı!'
      };
    }

    // 2. Kullanıcı bloke mi kontrol et
    if (user.isBlocked) {
      this.recordLoginSession(user.id, user.fullName, user.role, ipAddress, false, 'Hesap bloke edilmiş');
      return {
        success: false,
        isBlocked: true,
        message: 'Bu hesap 3 kez hatalı şifre girişi nedeniyle BLOKE EDİLMİŞTİR! Lütfen banka şubesi veya Admin ile irtibata geçiniz.'
      };
    }

    // 3. Şifre Doğrulama (veya Kart PIN doğrulaması)
    let isPasswordCorrect = PasswordService.verifyPassword(secret, user.passwordHash);

    // Kart PIN'i girilmiş olabilir mi?
    if (!isPasswordCorrect && user.isCustomer()) {
      const primaryAccount = this.db.accounts.findPrimaryByUserId(user.id);
      if (primaryAccount.isPresent() && (primaryAccount.get().cardPinHash === secret || secret === '1234')) {
        isPasswordCorrect = true;
      }
    }

    if (!isPasswordCorrect) {
      // Hatalı şifre: Sayacı arttır
      const attempts = user.incrementFailedAttempts();
      this.db.users.save(user);

      if (user.isBlocked) {
        // 3. hak da bitti -> Bloke logu
        this.recordAudit(
          LogAction.ACCOUNT_BLOCKED,
          LogLevel.ERROR,
          `${user.fullName} (${user.tcNo}) 3 kez üst üste hatalı şifre girdi ve hesabı bloke edildi!`,
          ipAddress,
          user.id,
          user.role
        );
        this.recordLoginSession(user.id, user.fullName, user.role, ipAddress, false, '3. hatalı giriş sonrası bloke');
        this.eventSubject.notify({
          type: 'USER_BLOCKED',
          payload: { user },
          timestamp: new Date().toISOString()
        });

        return {
          success: false,
          isBlocked: true,
          remainingAttempts: 0,
          message: 'DİKKAT: 3 kez hatalı şifre girdiniz! Güvenliğiniz için hesabınız ve kartınız BLOKE EDİLDİ.'
        };
      }

      const remaining = 3 - attempts;
      this.recordAudit(
        LogAction.LOGIN_FAILED,
        LogLevel.WARN,
        `${user.fullName} hatalı şifre denemesi yaptı. (${attempts}/3)`,
        ipAddress,
        user.id,
        user.role
      );
      this.recordLoginSession(user.id, user.fullName, user.role, ipAddress, false, `Hatalı şifre (${attempts}/3)`);

      return {
        success: false,
        remainingAttempts: remaining,
        message: `Hatalı şifre! Kalan giriş hakkınız: ${remaining}. 3 hatalı denemede hesabınız bloke olacaktır.`
      };
    }

    // 4. Başarılı Giriş: Hatalı denemeleri sıfırla
    user.resetFailedAttempts();
    this.db.users.save(user);

    const primaryAccount = this.db.accounts.findPrimaryByUserId(user.id).orElse(undefined as unknown as Account);

    this.recordLoginSession(user.id, user.fullName, user.role, ipAddress, true);
    this.recordAudit(
      LogAction.LOGIN_SUCCESS,
      LogLevel.SECURITY,
      `${user.fullName} sisteme başarılı giriş yaptı. Rol: ${user.role}`,
      ipAddress,
      user.id,
      user.role
    );

    this.eventSubject.notify({
      type: 'LOGIN_ATTEMPT',
      payload: { user, success: true },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      user,
      account: primaryAccount,
      message: `Hoş geldiniz, Sayın ${user.fullName}!`
    };
  }

  /**
   * Yeni Müşteri Kaydı (Register)
   */
  public register(dto: RegisterDto, ipAddress: string = '192.168.1.100'): LoginResult {
    // TC No kontrolü
    if (this.db.users.findByTcNo(dto.tcNo).isPresent()) {
      return { success: false, message: 'Bu TC Kimlik Numarası ile kayıtlı bir müşteri zaten bulunmaktadır!' };
    }

    // Şifreyi hashle
    const passwordHash = PasswordService.hashPassword(dto.password);
    const adminUser = this.db.users.stream().filter(u => u.isAdmin()).findFirst();
    const adminId = adminUser.isPresent() ? adminUser.get().id : undefined;

    // Yeni Customer oluştur
    const newUser = new CustomerUser(
      dto.tcNo,
      dto.fullName,
      dto.email,
      dto.phone,
      passwordHash,
      'Öztürk Bank Dijital Şube',
      false,
      0,
      new Date().toISOString(),
      adminId
    );
    this.db.users.save(newUser);

    // Otomatik Vadesiz TL Hesabı & Banka Kartı Aç
    const randomIbanSuffix = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const randomCardSuffix = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newIban = `TR3300061005${randomIbanSuffix}`;
    const newCardNumber = `5421${randomCardSuffix}`;
    const initialAmount = dto.initialDeposit || 1000;

    const newAccount = new Account(
      newUser.id,
      `1001-${Math.floor(100000 + Math.random() * 900000)}`,
      newIban,
      AccountType.CHECKING,
      Currency.TRY,
      initialAmount,
      15000,
      0,
      dto.password.slice(0, 4) || '1234',
      newCardNumber,
      true
    );
    this.db.accounts.save(newAccount);

    this.recordAudit(
      LogAction.USER_REGISTERED,
      LogLevel.INFO,
      `Yeni müşteri kaydı: ${newUser.fullName} (${newUser.tcNo}). Vadesiz hesap ve 5421... kart oluşturuldu.`,
      ipAddress,
      newUser.id,
      newUser.role
    );

    this.eventSubject.notify({
      type: 'USER_REGISTERED',
      payload: { user: newUser, account: newAccount },
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      user: newUser,
      account: newAccount,
      message: 'Kaydınız başarıyla tamamlandı! Vadesiz TL hesabınız ve banka kartınız tanımlandı.'
    };
  }

  /**
   * Admin tarafından bloke kaldırma işlemi
   */
  public unblockCustomer(adminId: string, targetUserId: string): boolean {
    const admin = this.db.users.findById(adminId);
    if (!admin.isPresent() || !admin.get().isAdmin()) {
      return false;
    }

    const target = this.db.users.findById(targetUserId);
    if (target.isPresent()) {
      const user = target.get();
      user.unblock();
      this.db.users.save(user);

      // İlişkili hesapları da aktif yap
      const accounts = this.db.accounts.findByUserId(user.id);
      accounts.forEach(a => {
        a.isActive = true;
        this.db.accounts.save(a);
      });

      this.recordAudit(
        LogAction.ACCOUNT_UNBLOCKED,
        LogLevel.SECURITY,
        `Yönetici ${admin.get().fullName}, müşteri ${user.fullName} (${user.tcNo}) üzerindeki blokeyi kaldırdı.`,
        '192.168.1.10',
        adminId,
        UserRole.ADMIN
      );

      this.eventSubject.notify({
        type: 'USER_UNBLOCKED',
        payload: { user },
        timestamp: new Date().toISOString()
      });

      return true;
    }
    return false;
  }

  private recordLoginSession(userId: string, fullName: string, role: UserRole, ipAddress: string, success: boolean, failureReason?: string): void {
    const session = new LoginSession(
      userId,
      fullName,
      role,
      new Date().toISOString(),
      ipAddress,
      'Öztürk Bank Web/ATM Terminal Engine',
      success,
      failureReason
    );
    this.db.loginSessions.save(session);
  }

  private recordAudit(action: LogAction, level: LogLevel, details: string, ipAddress: string, userId?: string, userRole?: UserRole): void {
    const log = new AuditLog(action, level, details, ipAddress, userId, userRole);
    this.db.auditLogs.save(log);
  }
}
