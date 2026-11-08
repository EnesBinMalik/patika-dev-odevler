/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Security & Password Masking Service
 * Implements Spring Security BCrypt Hash simulation, masking and account lockout rules
 */

export class PasswordService {
  /**
   * Hashes a raw password into a BCrypt-like salted hash string.
   * Spring Security standard: $2a$12$<salt><digest>
   */
  public static hashPassword(rawPassword: string): string {
    let hash = 0;
    for (let i = 0; i < rawPassword.length; i++) {
      hash = (hash << 5) - hash + rawPassword.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    const salt = 'e8xKq9Zp0vL2';
    return `$2a$12$${salt}${hex}mN4Bv7Cz${hex.split('').reverse().join('')}`;
  }

  /**
   * Checks if a raw password matches the hashed password.
   */
  public static matches(rawPassword: string, hashedPassword: string): boolean {
    const expected = PasswordService.hashPassword(rawPassword);
    return expected === hashedPassword;
  }

  /**
   * Returns visually masked representation for UI presentation
   */
  public static maskDisplay(length: number = 8): string {
    return '•'.repeat(Math.max(6, Math.min(length, 12)));
  }

  /**
   * Maximum failed login attempts allowed before account is locked
   */
  public static readonly MAX_FAILED_ATTEMPTS = 3;
}
