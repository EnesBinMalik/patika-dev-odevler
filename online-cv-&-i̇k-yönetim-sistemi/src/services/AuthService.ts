/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility - Spring Security Benzetimli Kimlik Doğrulama Servisi
 * 3 Hatalı Giriş Bloke Mekanizması & Şifre Maskeleme
 */

import { IAuthService, AuthResult, RegisterDTO } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ICVRepository } from '../repositories/interfaces/ICVRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CVRepository } from '../repositories/CVRepository';
import { UserEntity } from '../types/models';
import { Role, MilitaryStatus, ApplicationStatus, LogLevel } from '../types/enums';
import { SecurityService } from '../patterns/SecurityService';
import { CVBuilder } from '../patterns/CVBuilder';
import { Optional } from '../core/Optional';
import { AuditLogService } from './AuditLogService';

export class AuthService implements IAuthService {
  private static instance: AuthService | null = null;
  private userRepository: IUserRepository;
  private cvRepository: ICVRepository;
  private auditService: AuditLogService;
  private currentUser: UserEntity | null = null;
  private readonly CURRENT_USER_KEY = 'ONLINE_CV_CURRENT_USER_V2';

  private constructor() {
    this.userRepository = new UserRepository();
    this.cvRepository = new CVRepository();
    this.auditService = AuditLogService.getInstance();
    this.restoreSession();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const opt = this.userRepository.findById(u.id);
        if (opt.isPresent()) {
          this.currentUser = opt.get();
        }
      } catch (err) {
        console.warn('Oturum geri yüklenemedi:', err);
      }
    }
  }

  public async login(usernameOrEmail: string, rawPassword: string): Promise<AuthResult> {
    const trimmedInput = usernameOrEmail.trim();

    // 1. Kullanıcıyı bul (Kullanıcı Adı veya E-Posta ile)
    let userOpt = this.userRepository.findByUsername(trimmedInput);
    if (userOpt.isEmpty()) {
      userOpt = this.userRepository.findByEmail(trimmedInput);
    }

    if (userOpt.isEmpty()) {
      this.auditService.log(
        'BAŞARISIZ_GİRİŞ',
        `Var olmayan kullanıcı adı/email ile giriş denemesi: '${trimmedInput}'`,
        LogLevel.WARN
      );
      return {
        success: false,
        message: 'Kullanıcı adı veya e-posta adresi bulunamadı!',
      };
    }

    const user = userOpt.get();

    // 2. Bloke Kontrolü (3 denemeden sonra bloke)
    if (user.isBlocked || user.failedLoginAttempts >= 3) {
      user.isBlocked = true;
      this.userRepository.update(user);

      this.auditService.log(
        'BLOKE_GİRİŞ_ENGELİ',
        `Bloke edilmiş hesaba yetkisiz giriş engellendi: ${user.username}`,
        LogLevel.SECURITY,
        { id: user.id, username: user.username, role: user.role }
      );

      return {
        success: false,
        message: 'Hesabınız 3 kez hatalı şifre denemesi nedeniyle BLOKE EDİLMİŞTİR! Lütfen İnsan Kaynakları (Admin) ile iletişime geçiniz.',
        isBlocked: true,
      };
    }

    // 3. Şifre Doğrulama (Spring Security BCrypt benzeri salted hash)
    const isPasswordValid = SecurityService.verifyPassword(rawPassword, user.passwordHash);

    if (!isPasswordValid) {
      // Hatalı giriş sayısını artır
      user.failedLoginAttempts += 1;
      const remaining = 3 - user.failedLoginAttempts;

      if (user.failedLoginAttempts >= 3) {
        user.isBlocked = true;
        this.userRepository.update(user);

        this.auditService.log(
          'HESAP_BLOKE_EDİLDİ',
          `Kullanıcı ${user.username} 3 kez hatalı şifre girdiği için hesabı otomatik olarak BLOKE EDİLDİ!`,
          LogLevel.SECURITY,
          { id: user.id, username: user.username, role: user.role }
        );

        return {
          success: false,
          message: 'Hatalı şifre! 3 giriş hakkınız dolduğu için hesabınız bloke edildi. İnsan Kaynakları yetkilisi ile görüşünüz.',
          remainingAttempts: 0,
          isBlocked: true,
        };
      } else {
        this.userRepository.update(user);

        this.auditService.log(
          'HATALI_ŞİFRE',
          `Kullanıcı ${user.username} için hatalı şifre denendi. Kalan hak: ${remaining}/3`,
          LogLevel.WARN,
          { id: user.id, username: user.username, role: user.role }
        );

        return {
          success: false,
          message: `Hatalı şifre! Kalan giriş hakkınız: ${remaining}. 3 hatalı denemede hesabınız bloke olacaktır.`,
          remainingAttempts: remaining,
        };
      }
    }

    // 4. Başarılı Giriş: Hatalı deneme sayacını sıfırla
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    this.userRepository.update(user);
    this.currentUser = user;

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    this.auditService.log(
      'BAŞARILI_GİRİŞ',
      `Kullanıcı başarıyla oturum açtı: ${user.username} (Rol: ${user.role})`,
      LogLevel.INFO,
      { id: user.id, username: user.username, role: user.role }
    );

    return {
      success: true,
      message: 'Giriş başarılı! Yönlendiriliyorsunuz...',
      user: user,
    };
  }

  public async register(dto: RegisterDTO): Promise<AuthResult> {
    const trimmedUsername = dto.username.trim();
    const trimmedEmail = dto.email.trim();

    // 1. Validasyonlar
    if (!trimmedUsername || !trimmedEmail || !dto.password) {
      return { success: false, message: 'Lütfen zorunlu alanları (Kullanıcı Adı, E-Posta, Şifre) doldurunuz!' };
    }

    const passCheck = SecurityService.validatePasswordStrength(dto.password);
    if (!passCheck.isValid) {
      return { success: false, message: passCheck.message || 'Şifre yetersiz.' };
    }

    // 2. Benzersizlik Kontrolü
    if (this.userRepository.findByUsername(trimmedUsername).isPresent()) {
      return { success: false, message: 'Bu kullanıcı adı zaten kullanılmaktadır!' };
    }

    if (this.userRepository.findByEmail(trimmedEmail).isPresent()) {
      return { success: false, message: 'Bu e-posta adresi ile zaten kayıtlı bir hesap var!' };
    }

    // 3. Şifre Maskeleme & Hashing (Veritabanına maskeli/hashli kayıt)
    const passwordHash = SecurityService.hashPassword(dto.password);

    // Spring Data @OneToMany / @ManyToOne: Adayları birincil İK Adminine bağla
    const adminOpt = this.userRepository.findByRole(Role.ADMIN);
    const assignedAdminId = adminOpt.length > 0 ? adminOpt[0].id : null;

    // 4. User Entity Oluşturma
    const newUser = new UserEntity({
      username: trimmedUsername,
      email: trimmedEmail,
      passwordHash: passwordHash,
      role: dto.role,
      isBlocked: false,
      failedLoginAttempts: 0,
      adminId: assignedAdminId,
      lastLoginAt: new Date().toISOString(),
    });

    this.userRepository.save(newUser);

    // 5. Aday İse Otomatik CV Taslağı Oluştur (Builder Pattern)
    if (dto.role === Role.USER) {
      const cv = new CVBuilder(newUser.id)
        .setPersonalDetails(
          dto.firstName || trimmedUsername,
          dto.lastName || 'Aday',
          trimmedEmail,
          dto.phone || '+90 5XX XXX XX XX',
          'İstanbul'
        )
        .setProfessionalTitle('Yazılım Geliştirici (Aday)', 'Henüz profesyonel özet eklenmedi.')
        .setMilitaryStatus(MilitaryStatus.DONE)
        .setExperienceYears(1)
        .setApplicationStatus(ApplicationStatus.NEW)
        .build();

      this.cvRepository.save(cv);
    }

    this.auditService.log(
      'YENİ_KULLANICI_KAYDI',
      `Yeni üyelik oluşturuldu: ${newUser.username} (Rol: ${newUser.role}, Maskelenmiş Şifre Hash: ${passwordHash.substring(0, 16)}...)`,
      LogLevel.INFO,
      { id: newUser.id, username: newUser.username, role: newUser.role }
    );

    // Otomatik oturum aç
    this.currentUser = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    }

    return {
      success: true,
      message: 'Kayıt işlemi başarıyla tamamlandı! Sisteme hoş geldiniz.',
      user: newUser,
    };
  }

  public logout(): void {
    if (this.currentUser) {
      this.auditService.log(
        'OTURUM_KAPATILDI',
        `Kullanıcı çıkış yaptı: ${this.currentUser.username}`,
        LogLevel.INFO,
        { id: this.currentUser.id, username: this.currentUser.username, role: this.currentUser.role }
      );
    }
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  public getCurrentUser(): Optional<UserEntity> {
    if (!this.currentUser) {
      this.restoreSession();
    }
    return Optional.ofNullable(this.currentUser);
  }

  public unblockUser(userId: string): boolean {
    const userOpt = this.userRepository.findById(userId);
    if (userOpt.isPresent()) {
      const u = userOpt.get();
      u.isBlocked = false;
      u.failedLoginAttempts = 0;
      this.userRepository.update(u);

      this.auditService.log(
        'BLOKE_KALDIRILDI',
        `Kullanıcı ${u.username} üzerindeki bloke ve hatalı deneme sayacı İK Admin tarafından sıfırlandı.`,
        LogLevel.SECURITY
      );
      return true;
    }
    return false;
  }
}
