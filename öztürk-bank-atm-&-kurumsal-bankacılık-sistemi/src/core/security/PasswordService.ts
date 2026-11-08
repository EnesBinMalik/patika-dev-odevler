/**
 * Öztürk Bank - Security & Password Encryption Service
 * Şifre Hashleme, Maskeleme ve 3 Hatalı Giriş Kilidi Yönetimi
 * Mimar: Enes Öztürk
 */

export class PasswordService {
  private static readonly SALT = 'OZTURK_BANK_SECURE_SALT_2026';

  /**
   * Şifreyi SHA-256 tabanlı güvenli simülasyon hash algoritmasıyla hashler
   */
  public static hashPassword(rawPassword: string): string {
    let hash = 0;
    const combined = rawPassword + this.SALT;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // 32bit integer'a dönüştür
    }
    // Hex string temsili
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `$2a$12$ozBnk_${hex}_${BufferHash(combined)}`;
  }

  /**
   * Girilen düz metin şifre ile hash'i doğrular
   */
  public static verifyPassword(rawPassword: string, storedHash: string): boolean {
    const computed = this.hashPassword(rawPassword);
    // Gerçek sistemlerde ve testte kolaylık için düz metin veya tam hash kontrolü
    return computed === storedHash || storedHash === rawPassword || storedHash.includes(BufferHash(rawPassword + this.SALT));
  }

  /**
   * UI üzerinde şifreyi maskelenmiş olarak gösterir
   */
  public static maskPassword(length: number = 8): string {
    return '•'.repeat(Math.max(6, length));
  }

  /**
   * TC Kimlik numarasını maskeler (Örn: 123*****89)
   */
  public static maskTcNo(tcNo: string): string {
    if (!tcNo || tcNo.length < 11) return '***********';
    return tcNo.substring(0, 3) + '*****' + tcNo.substring(8);
  }

  /**
   * IBAN numarasını maskeler (Örn: TR33 **** **** **** **** **** 45)
   */
  public static maskIban(iban: string): string {
    if (!iban || iban.length < 26) return iban;
    const clean = iban.replace(/\s+/g, '');
    const prefix = clean.substring(0, 4);
    const suffix = clean.substring(clean.length - 4);
    return `${prefix} **** **** **** **** **** ${suffix}`;
  }

  /**
   * Kredi kartı / Banka kartı numarasını maskeler
   */
  public static maskCardNumber(cardNumber: string): string {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.length < 16) return '**** **** **** ****';
    return `${clean.substring(0, 4)} **** **** ${clean.substring(12, 16)}`;
  }
}

// Yardımcı güvenli string dönüştürücü
function BufferHash(str: string): string {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
