/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: AuthService (Spring Security AuthenticationManager & UserDetailsService Simulation)
 * Implements 3-failed-attempts Account Lockout policy, Password Masking & Verification
 */

import { DatabaseService } from './DatabaseService.ts';
import { LoggerService } from './LoggerService.ts';
import { User } from '../entities/UserEntity.ts';
import { UserFactory } from '../patterns/Factory.ts';
import { PasswordService } from '../security/PasswordService.ts';
import { Role, MilitaryStatus } from '../types/enums.ts';

export interface ILoginResult {
  success: boolean;
  user?: User;
  errorMessage?: string;
  remainingAttempts?: number;
  isLocked?: boolean;
}

export interface IAuthService {
  login(email: string, rawPassword: string): ILoginResult;
  registerCandidate(params: {
    email: string;
    rawPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    militaryStatus: MilitaryStatus;
    experienceYears: number;
    currentTitle: string;
    skills?: string[];
  }): { success: boolean; user?: User; errorMessage?: string };
  registerCompany(params: {
    email: string;
    rawPassword: string;
    fullName: string;
    phone: string;
    companyName: string;
    industry: string;
    taxNumber: string;
    city: string;
    website?: string;
  }): { success: boolean; user?: User; errorMessage?: string };
  unlockUser(userId: string): boolean;
  resetUserPassword(userId: string, newRawPassword: string): boolean;
}

export class AuthService implements IAuthService {
  private static instance: AuthService | null = null;
  private db: DatabaseService;
  private logger: LoggerService;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login with 3-attempt lockout security policy
   */
  public login(email: string, rawPassword: string): ILoginResult {
    const normalizedEmail = email.toLowerCase().trim();
    const userOpt = this.db.users.findByEmail(normalizedEmail);

    if (userOpt.isEmpty()) {
      this.logger.security('LOGIN_FAILED_NOT_FOUND', `Kayıtsız e-posta adresiyle giriş denemesi: ${normalizedEmail}`, normalizedEmail);
      return {
        success: false,
        errorMessage: 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.',
      };
    }

    const user = userOpt.get();

    // 1. Check if account is locked
    if (user.getIsLocked()) {
      this.logger.security(
        'LOGIN_ATTEMPT_LOCKED_ACCOUNT',
        `Bloke edilmiş hesaba giriş denemesi: ${normalizedEmail} (Kilitlenme Tarihi: ${user.getLockedAt()})`,
        normalizedEmail
      );
      return {
        success: false,
        isLocked: true,
        errorMessage: `Hesabınız 3 hatalı şifre denemesi sebebiyle bloke edilmiştir! Lütfen şirket yöneticiniz ile iletişime geçin veya kilidi açtırın.`,
      };
    }

    // 2. Validate Password
    const isPasswordValid = PasswordService.matches(rawPassword, user.getPasswordHash());

    if (!isPasswordValid) {
      const lockedNow = user.registerFailedAttempt();
      this.db.users.save(user);
      this.db.notify();

      const remaining = Math.max(0, PasswordService.MAX_FAILED_ATTEMPTS - user.getFailedLoginAttempts());

      if (lockedNow) {
        this.logger.security(
          'ACCOUNT_LOCKED',
          `HESAP BLOKE EDİLDİ: ${normalizedEmail} - 3 kez ardışık hatalı şifre girildi!`,
          normalizedEmail
        );
        return {
          success: false,
          isLocked: true,
          remainingAttempts: 0,
          errorMessage: 'Şifrenizi 3 kez ardışık olarak hatalı girdiniz! Güvenlik gereği hesabınız bloke edildi.',
        };
      }

      this.logger.security(
        'LOGIN_PASSWORD_MISMATCH',
        `Hatalı şifre girildi. Kullanıcı: ${normalizedEmail}. Kalan deneme hakkı: ${remaining}`,
        normalizedEmail
      );

      return {
        success: false,
        remainingAttempts: remaining,
        errorMessage: `Hatalı şifre girdiniz! Kalan giriş hakkınız: ${remaining} / ${PasswordService.MAX_FAILED_ATTEMPTS}`,
      };
    }

    // 3. Success -> reset counter and log
    user.resetFailedAttempts();
    this.db.users.save(user);
    this.db.notify();

    this.logger.info(
      'LOGIN_SUCCESS',
      `Kullanıcı başarıyla giriş yaptı: ${user.getFullName()} (${user.getRole()})`,
      { id: user.getId(), email: user.getEmail(), role: user.getRole() }
    );

    return {
      success: true,
      user,
    };
  }

  /**
   * Candidate (Job Seeker) Registration
   */
  public registerCandidate(params: {
    email: string;
    rawPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    militaryStatus: MilitaryStatus;
    experienceYears: number;
    currentTitle: string;
    skills?: string[];
  }): { success: boolean; user?: User; errorMessage?: string } {
    const normalizedEmail = params.email.toLowerCase().trim();

    if (this.db.users.findByEmail(normalizedEmail).isPresent()) {
      return {
        success: false,
        errorMessage: 'Bu e-posta adresi sistemde zaten kayıtlı!',
      };
    }

    if (!params.rawPassword || params.rawPassword.length < 4) {
      return {
        success: false,
        errorMessage: 'Şifre en az 4 karakter olmalıdır.',
      };
    }

    const { user, profile } = UserFactory.createCandidate(params);

    this.db.users.save(user);
    this.db.candidates.save(profile);
    this.db.notify();

    this.logger.audit(
      'CANDIDATE_REGISTERED',
      `Yeni iş arayan aday kayıt oldu: ${user.getFullName()} (${user.getEmail()})`,
      { id: user.getId(), email: user.getEmail(), role: Role.USER }
    );

    return {
      success: true,
      user,
    };
  }

  /**
   * Employer (Company Admin) Registration
   */
  public registerCompany(params: {
    email: string;
    rawPassword: string;
    fullName: string;
    phone: string;
    companyName: string;
    industry: string;
    taxNumber: string;
    city: string;
    website?: string;
  }): { success: boolean; user?: User; errorMessage?: string } {
    const normalizedEmail = params.email.toLowerCase().trim();

    if (this.db.users.findByEmail(normalizedEmail).isPresent()) {
      return {
        success: false,
        errorMessage: 'Bu e-posta adresi sistemde zaten kayıtlı!',
      };
    }

    if (!params.rawPassword || params.rawPassword.length < 4) {
      return {
        success: false,
        errorMessage: 'Şifre en az 4 karakter olmalıdır.',
      };
    }

    const { user, company } = UserFactory.createEmployerAdmin(params);

    this.db.users.save(user);
    this.db.companies.save(company);
    this.db.notify();

    this.logger.audit(
      'COMPANY_REGISTERED',
      `Yeni şirket ve yetkili hesabı açıldı: ${company.getName()} - Yetkili: ${user.getFullName()}`,
      { id: user.getId(), email: user.getEmail(), role: Role.ADMIN }
    );

    return {
      success: true,
      user,
    };
  }

  /**
   * Unlock account (Administrative action)
   */
  public unlockUser(userId: string): boolean {
    const userOpt = this.db.users.findById(userId);
    if (userOpt.isPresent()) {
      const user = userOpt.get();
      user.unlockAccount();
      this.db.users.save(user);
      this.db.notify();

      this.logger.audit(
        'ACCOUNT_UNLOCKED',
        `Kullanıcı hesabının blokesi kaldırıldı: ${user.getEmail()}`,
        { id: user.getId(), email: user.getEmail(), role: user.getRole() }
      );
      return true;
    }
    return false;
  }

  /**
   * Password reset
   */
  public resetUserPassword(userId: string, newRawPassword: string): boolean {
    const userOpt = this.db.users.findById(userId);
    if (userOpt.isPresent()) {
      const user = userOpt.get();
      user.setPassword(newRawPassword);
      user.unlockAccount();
      this.db.users.save(user);
      this.db.notify();

      this.logger.audit(
        'PASSWORD_RESET',
        `Kullanıcı şifresi sıfırlandı: ${user.getEmail()}`,
        { id: user.getId(), email: user.getEmail(), role: user.getRole() }
      );
      return true;
    }
    return false;
  }
}
