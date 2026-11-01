/**
 * @author Enes Öztürk
 * Sigorta Yönetim Sistemi - Veri Modelleri ve Tipler
 */

export interface Address {
  getAddressInfo(): string;
  getAddressType(): 'HOME' | 'BUSINESS';
  getCity(): string;
  getDistrict(): string;
  getDetail(): string;
  getPostalCode(): string;
}

export class HomeAddress implements Address {
  constructor(
    public street: string,
    public buildingNo: string,
    public apartmentNo: string,
    public district: string,
    public city: string,
    public postalCode: string,
    public residentName?: string
  ) {}

  getAddressType(): 'HOME' | 'BUSINESS' {
    return 'HOME';
  }

  getCity(): string {
    return this.city;
  }

  getDistrict(): string {
    return this.district;
  }

  getDetail(): string {
    return `${this.street} No:${this.buildingNo} Daire:${this.apartmentNo}`;
  }

  getPostalCode(): string {
    return this.postalCode;
  }

  getAddressInfo(): string {
    return `[Ev Adresi] ${this.street} No:${this.buildingNo}/${this.apartmentNo}, ${this.district} / ${this.city} (${this.postalCode})`;
  }
}

export class BusinessAddress implements Address {
  constructor(
    public companyName: string,
    public plazaOrStreet: string,
    public floorAndOffice: string,
    public district: string,
    public city: string,
    public postalCode: string,
    public taxNumber?: string
  ) {}

  getAddressType(): 'HOME' | 'BUSINESS' {
    return 'BUSINESS';
  }

  getCity(): string {
    return this.city;
  }

  getDistrict(): string {
    return this.district;
  }

  getDetail(): string {
    return `${this.companyName} - ${this.plazaOrStreet} Kat/Ofis: ${this.floorAndOffice}`;
  }

  getPostalCode(): string {
    return this.postalCode;
  }

  getAddressInfo(): string {
    return `[İş Adresi] ${this.companyName}, ${this.plazaOrStreet} Ofis:${this.floorAndOffice}, ${this.district} / ${this.city} (${this.postalCode})`;
  }
}

export class AddressManager {
  /**
   * User nesnesinin adres listesine eleman ekler
   */
  public static addAddress(user: User, address: Address): void {
    if (!user.addressList) {
      user.addressList = [];
    }
    user.addressList.push(address);
  }

  /**
   * User nesnesinin adres listesinden belirtilen elemanı çıkarır
   */
  public static removeAddress(user: User, address: Address): boolean {
    if (!user.addressList || user.addressList.length === 0) {
      return false;
    }
    const index = user.addressList.findIndex(
      (a) => a.getAddressInfo() === address.getAddressInfo()
    );
    if (index !== -1) {
      user.addressList.splice(index, 1);
      return true;
    }
    return false;
  }
}

export class User {
  public firstName: string;
  public lastName: string;
  public email: string;
  public passwordHash: string; // Gerçekte şifre (String)
  public occupation: string;
  public age: number;
  public addressList: Address[];
  public lastLoginDate: Date | null;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    occupation: string,
    age: number,
    addressList: Address[] = [],
    lastLoginDate: Date | null = null
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = password;
    this.occupation = occupation;
    this.age = age;
    this.addressList = addressList;
    this.lastLoginDate = lastLoginDate;
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export enum AuthenticationStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export class InvalidAuthenticationException extends Error {
  constructor(message: string = 'Geçersiz email veya şifre! Giriş başarısız.') {
    super(message);
    this.name = 'InvalidAuthenticationException';
  }
}

export abstract class Insurance {
  public name: string;
  public price: number;
  public startDate: Date;
  public endDate: Date;
  public durationDays: number;
  public category: 'HEALTH' | 'RESIDENCE' | 'TRAVEL' | 'CAR';

  constructor(
    name: string,
    startDate: Date,
    endDate: Date,
    category: 'HEALTH' | 'RESIDENCE' | 'TRAVEL' | 'CAR'
  ) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.category = category;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    this.durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 365;
    this.price = 0; // calculate ile doldurulur
  }

  /**
   * Soyut hesaplama fonksiyonu.
   * Alt sınıflar kendi dinamiklerine göre override eder.
   */
  public abstract calculate(): number;
}

export class HealthInsurance extends Insurance {
  constructor(
    name: string,
    startDate: Date,
    endDate: Date,
    public userAge: number,
    public hasChronicDisease: boolean = false,
    public coveragePlan: 'STANDARD' | 'VIP' = 'STANDARD'
  ) {
    super(name, startDate, endDate, 'HEALTH');
    this.price = this.calculate();
  }

  public calculate(): number {
    let baseRate = 6500;
    // Yaşa göre katsayı
    if (this.userAge > 50) {
      baseRate += (this.userAge - 50) * 180;
    } else if (this.userAge > 30) {
      baseRate += (this.userAge - 30) * 80;
    }
    // Kronik hastalık riski
    if (this.hasChronicDisease) {
      baseRate *= 1.35;
    }
    // VIP Kapsam
    if (this.coveragePlan === 'VIP') {
      baseRate *= 1.45;
    }
    return Math.round(baseRate);
  }
}

export class ResidenceInsurance extends Insurance {
  constructor(
    name: string,
    startDate: Date,
    endDate: Date,
    public squareMeters: number,
    public buildingAge: number,
    public earthquakeRiskZone: 1 | 2 | 3 = 1
  ) {
    super(name, startDate, endDate, 'RESIDENCE');
    this.price = this.calculate();
  }

  public calculate(): number {
    const basePerSqm = 35;
    let base = this.squareMeters * basePerSqm;
    // Bina yaşı riski
    if (this.buildingAge > 20) {
      base *= 1.4;
    } else if (this.buildingAge > 10) {
      base *= 1.2;
    }
    // Deprem risk bölgesi
    base *= this.earthquakeRiskZone === 1 ? 1.3 : this.earthquakeRiskZone === 2 ? 1.15 : 1.0;
    return Math.round(base);
  }
}

export class TravelInsurance extends Insurance {
  constructor(
    name: string,
    startDate: Date,
    endDate: Date,
    public destination: 'EUROPE_SCHENGEN' | 'WORLDWIDE' | 'DOMESTIC',
    public travelerCount: number = 1
  ) {
    super(name, startDate, endDate, 'TRAVEL');
    this.price = this.calculate();
  }

  public calculate(): number {
    const dailyRate =
      this.destination === 'WORLDWIDE' ? 180 : this.destination === 'EUROPE_SCHENGEN' ? 120 : 60;
    const total = this.durationDays * dailyRate * this.travelerCount;
    return Math.max(800, Math.round(total));
  }
}

export class CarInsurance extends Insurance {
  constructor(
    name: string,
    startDate: Date,
    endDate: Date,
    public vehicleValue: number,
    public modelYear: number,
    public hasPastAccident: boolean = false
  ) {
    super(name, startDate, endDate, 'CAR');
    this.price = this.calculate();
  }

  public calculate(): number {
    // Kasko prim oranı %2.5 taban
    let premium = this.vehicleValue * 0.025;
    const currentYear = 2026;
    const carAge = Math.max(0, currentYear - this.modelYear);
    premium += carAge * 450;
    if (this.hasPastAccident) {
      premium *= 1.3;
    }
    return Math.round(premium);
  }
}

export abstract class Account {
  public authenticationStatus: AuthenticationStatus = AuthenticationStatus.FAIL;
  public user: User; // Aggregation ilişkisi
  public insuranceList: Insurance[] = [];
  public accountType: 'INDIVIDUAL' | 'ENTERPRISE';

  constructor(user: User, accountType: 'INDIVIDUAL' | 'ENTERPRISE') {
    this.user = user;
    this.accountType = accountType;
  }

  /**
   * Email ve şifre doğrulaması yapar.
   * Başarısızlık durumunda InvalidAuthenticationException fırlatır.
   */
  public login(email: string, password: string): void {
    if (this.user.email.toLowerCase() === email.trim().toLowerCase() && this.user.passwordHash === password) {
      this.authenticationStatus = AuthenticationStatus.SUCCESS;
      this.user.lastLoginDate = new Date();
    } else {
      this.authenticationStatus = AuthenticationStatus.FAIL;
      throw new InvalidAuthenticationException(
        `Giriş başarısız! [${email}] için şifre uyuşmuyor.`
      );
    }
  }

  public logout(): void {
    this.authenticationStatus = AuthenticationStatus.FAIL;
  }

  public getAuthenticationStatus(): AuthenticationStatus {
    return this.authenticationStatus;
  }

  /**
   * Soyut olmayan fonksiyon: Adres ekleme
   */
  public addAddress(address: Address): void {
    AddressManager.addAddress(this.user, address);
  }

  /**
   * Soyut olmayan fonksiyon: Adres çıkarma
   */
  public removeAddress(address: Address): boolean {
    return AddressManager.removeAddress(this.user, address);
  }

  /**
   * Müşteri bilgilerini ekrana yazdıran FINAL fonksiyon.
   */
  public showUserInfo(): string[] {
    const lines: string[] = [];
    lines.push('═══════════════════════════════════════════════════════');
    lines.push(` HESAP VE KULLANICI BİLGİLERİ (${this.accountType === 'INDIVIDUAL' ? 'BİREYSEL' : 'KURUMSAL'})`);
    lines.push('═══════════════════════════════════════════════════════');
    lines.push(`Adı Soyadı        : ${this.user.getFullName()}`);
    lines.push(`E-Posta Adresi    : ${this.user.email}`);
    lines.push(`Meslek            : ${this.user.occupation}`);
    lines.push(`Yaş               : ${this.user.age}`);
    lines.push(`Oturum Durumu     : ${this.authenticationStatus}`);
    lines.push(
      `Son Giriş Tarihi  : ${
        this.user.lastLoginDate
          ? this.user.lastLoginDate.toLocaleString('tr-TR')
          : 'Henüz giriş yapılmadı'
      }`
    );
    lines.push('-------------------------------------------------------');
    lines.push(`KAYITLI ADRESLER (${this.user.addressList.length} adet):`);
    if (this.user.addressList.length === 0) {
      lines.push('  - Kayıtlı adres bulunmamaktadır.');
    } else {
      this.user.addressList.forEach((addr, idx) => {
        lines.push(`  ${idx + 1}. ${addr.getAddressInfo()}`);
      });
    }
    lines.push('-------------------------------------------------------');
    lines.push(`POLİÇE PORTFÖYÜ (${this.insuranceList.length} adet):`);
    if (this.insuranceList.length === 0) {
      lines.push('  - Henüz yaptırılmış bir sigorta poliçesi yok.');
    } else {
      let total = 0;
      this.insuranceList.forEach((ins, idx) => {
        lines.push(
          `  ${idx + 1}. [${ins.category}] ${ins.name} | Prim: ${ins.price.toLocaleString('tr-TR')} ₺`
        );
        total += ins.price;
      });
      lines.push(`  Toplam Portföy Tutarı: ${total.toLocaleString('tr-TR')} ₺`);
    }
    lines.push('═══════════════════════════════════════════════════════');
    return lines;
  }

  /**
   * Soyut fonksiyon: Her alt sınıf kendi kar marjına göre poliçe ekler
   */
  public abstract addInsurance(insurance: Insurance): void;

  /**
   * Comparable interface gereği sıralama fonksiyonu (Email bazlı)
   */
  public compareTo(other: Account): number {
    return this.user.email.localeCompare(other.user.email);
  }

  public equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof Account)) return false;
    return this.user.email.toLowerCase() === other.user.email.toLowerCase();
  }

  public hashCode(): number {
    let hash = 0;
    const str = this.user.email.toLowerCase();
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

export class Individual extends Account {
  public static readonly PROFIT_MARGIN: number = 0.20; // Bireysel %20 kar marjı

  constructor(user: User) {
    super(user, 'INDIVIDUAL');
  }

  /**
   * Bireysel müşteriye özel kar marjı uygulanarak poliçe eklenir
   */
  public addInsurance(insurance: Insurance): void {
    const baseCalculatedPrice = insurance.calculate();
    // Bireysel katsayı: taban prim * (1 + kar marjı)
    insurance.price = Math.round(baseCalculatedPrice * (1 + Individual.PROFIT_MARGIN));
    this.insuranceList.push(insurance);
  }
}

export class Enterprise extends Account {
  public static readonly PROFIT_MARGIN: number = 0.08; // Kurumsal toplu müşteri %8 kar marjı
  public companyTaxTitle: string;

  constructor(user: User, companyTaxTitle: string = 'Öztürk Şirketler Grubu A.Ş.') {
    super(user, 'ENTERPRISE');
    this.companyTaxTitle = companyTaxTitle;
  }

  /**
   * Kurumsal müşteriye özel avantajlı kurumsal grup marjı ile poliçe eklenir
   */
  public addInsurance(insurance: Insurance): void {
    const baseCalculatedPrice = insurance.calculate();
    // Kurumsal katsayı: taban prim * (1 + kar marjı)
    insurance.price = Math.round(baseCalculatedPrice * (1 + Enterprise.PROFIT_MARGIN));
    this.insuranceList.push(insurance);
  }
}

export class AccountManager {
  // TreeSet sıralı kümesini simüle eden liste
  private accounts: Account[] = [];

  constructor() {
    this.accounts = [];
  }

  /**
   * TreeSet davranışına uygun ekleme (Tekil eleman, email bazlı sıralı)
   */
  public addAccount(account: Account): boolean {
    const exists = this.accounts.some((a) => a.equals(account));
    if (exists) {
      return false;
    }
    this.accounts.push(account);
    this.accounts.sort((a, b) => a.compareTo(b));
    return true;
  }

  public getAccounts(): Account[] {
    return [...this.accounts];
  }

  /**
   * Ödev şartnamesi:
   * AccountManager login fonksiyonu TreeSet listesi üzerinde dolaşır,
   * account.login(...) fonksiyonunu çağırır.
   * InvalidAuthenticationException try-catch ile yakalanır.
   */
  public login(email: string, password: string): Account | null {
    for (const account of this.accounts) {
      if (account.user.email.toLowerCase() === email.trim().toLowerCase()) {
        try {
          // Account nesnesi üzerindeki login olma fonksiyonunu çağırır
          account.login(email, password);
          return account;
        } catch (error) {
          if (error instanceof InvalidAuthenticationException) {
            // Şartname gereği burada try-catch mekanizması kurulmuştur
            console.warn(`[AccountManager] Giriş hatası yakalandı: ${error.message}`);
            throw error; // Hatayı çağıran UI/Terminal katmanına ilet
          }
          throw error;
        }
      }
    }
    // E-posta listede hiç yoksa da hata fırlat
    throw new InvalidAuthenticationException(`Sistemde [${email}] adresine ait kayıtlı bir hesap bulunamadı!`);
  }
}
