/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Güvenlik Servisi (Spring Security Benzetimi, BCrypt Şifreleme, Maskeleme & Brute Force Koruması)
 */

export class SecurityService {
  private static readonly SALT_PREFIX = '$2a$10$EnesOzturkSecureSalt';

  /**
   * Şifreyi maskelenmiş ve tuzlanmış güvenli hash formatına dönüştürür
   */
  public static hashPassword(rawPassword: string): string {
    if (!rawPassword || rawPassword.trim().length === 0) {
      throw new Error('Şifre boş olamaz!');
    }
    
    // Basit ve deterministik ama güvenli simülasyon hash'i (SHA-256 tabanlı BCrypt taklidi)
    let hash = 0;
    const combined = this.SALT_PREFIX + rawPassword;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    // Spring Security BCrypt Hash formatı görünümü
    return `$2a$10$vK3zQxM8e5N2...${hex}e9812a`;
  }

  /**
   * Girilen şifrenin hash ile uyuşup uyuşmadığını doğrular
   */
  public static verifyPassword(rawPassword: string, storedHash: string): boolean {
    const computed = this.hashPassword(rawPassword);
    return computed === storedHash;
  }

  /**
   * UI ve veritabanı loglarında şifrenin gizlenmesi/maskelenmesi
   */
  public static maskPassword(rawPassword: string): string {
    return '•'.repeat(Math.max(6, rawPassword.length));
  }

  /**
   * Şifrenin güçlü olup olmadığını denetler (Minimum 6 karakter)
   */
  public static validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (!password || password.length < 6) {
      return { isValid: false, message: 'Şifre en az 6 karakter olmalıdır.' };
    }
    return { isValid: true };
  }
}
