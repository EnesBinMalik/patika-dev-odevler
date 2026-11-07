import { IKrediKartiJSON } from '../types/banking';

export class KrediKarti {
  private kartId: string;
  private kartNumarasi: string;
  private kartSahibi: string;
  private sonKullanma: string;
  private cvv: string;
  private limit: number;
  private guncelBorc: number;
  private ekstreBorcu: number;
  private asgariOdemeOrani: number; // varsayılan 0.20
  private kesimGunu: number;
  private durum: 'Aktif' | 'Kilitli';
  private kartTipi: 'Mastercard' | 'Visa';

  constructor(
    kartId: string,
    kartNumarasi: string,
    kartSahibi: string,
    sonKullanma: string,
    cvv: string,
    limit: number,
    guncelBorc: number = 0,
    ekstreBorcu: number = 0,
    asgariOdemeOrani: number = 0.2,
    kesimGunu: number = 15,
    durum: 'Aktif' | 'Kilitli' = 'Aktif',
    kartTipi: 'Mastercard' | 'Visa' = 'Mastercard'
  ) {
    this.kartId = kartId;
    this.kartNumarasi = kartNumarasi;
    this.kartSahibi = kartSahibi;
    this.sonKullanma = sonKullanma;
    this.cvv = cvv;
    this.limit = limit;
    this.guncelBorc = guncelBorc;
    this.ekstreBorcu = ekstreBorcu;
    this.asgariOdemeOrani = asgariOdemeOrani;
    this.kesimGunu = kesimGunu;
    this.durum = durum;
    this.kartTipi = kartTipi;
  }

  // Getters
  public getKartId(): string {
    return this.kartId;
  }

  public getKartNumarasi(): string {
    return this.kartNumarasi;
  }

  public getMaskeliKartNo(): string {
    const clean = this.kartNumarasi.replace(/\s+/g, '');
    if (clean.length < 16) return this.kartNumarasi;
    return `${clean.slice(0, 4)} **** **** ${clean.slice(12)}`;
  }

  public getKartSahibi(): string {
    return this.kartSahibi;
  }

  public getSonKullanma(): string {
    return this.sonKullanma;
  }

  public getCvv(): string {
    return this.cvv;
  }

  public getLimit(): number {
    return this.limit;
  }

  public getGuncelBorc(): number {
    return this.guncelBorc;
  }

  public getEkstreBorcu(): number {
    return this.ekstreBorcu;
  }

  public getAsgariOdemeOrani(): number {
    return this.asgariOdemeOrani;
  }

  public getKesimGunu(): number {
    return this.kesimGunu;
  }

  public getDurum(): 'Aktif' | 'Kilitli' {
    return this.durum;
  }

  public getKartTipi(): 'Mastercard' | 'Visa' {
    return this.kartTipi;
  }

  public getKullanilabilirLimit(): number {
    return Math.max(0, Number((this.limit - this.guncelBorc).toFixed(2)));
  }

  public getAsgariOdemeTutari(): number {
    const bazBorc = this.ekstreBorcu > 0 ? this.ekstreBorcu : this.guncelBorc;
    return Number((bazBorc * this.asgariOdemeOrani).toFixed(2));
  }

  // OOP İşlem Metotları
  public harcamaYap(tutar: number): boolean {
    if (this.durum === 'Kilitli') {
      throw new Error('Kartınız güvenlik nedeniyle kilitlidir. Lütfen kart kilidini açınız.');
    }
    if (tutar <= 0) {
      throw new Error('Harcama tutarı sıfırdan büyük olmalıdır.');
    }
    if (tutar > this.getKullanilabilirLimit()) {
      throw new Error(
        `Kredi kartı limiti yetersiz! Kullanılabilir limit: ${this.getKullanilabilirLimit().toLocaleString('tr-TR')} TL`
      );
    }
    this.guncelBorc = Number((this.guncelBorc + tutar).toFixed(2));
    return true;
  }

  /**
   * Kullanıcı bankaya kredi kartı ekstresi / borcu öder
   */
  public borcOde(tutar: number): { odenenTutar: number; kalanBorc: number } {
    if (tutar <= 0) {
      throw new Error('Ödeme tutarı sıfırdan büyük olmalıdır.');
    }
    if (this.guncelBorc <= 0 && this.ekstreBorcu <= 0) {
      throw new Error('Kartınıza ait herhangi bir borç bulunmamaktadır.');
    }

    const odenen = Math.min(tutar, this.guncelBorc);
    this.guncelBorc = Number((this.guncelBorc - odenen).toFixed(2));

    // Ekstre borcunu da orantılı düşür
    if (this.ekstreBorcu > 0) {
      this.ekstreBorcu = Number(Math.max(0, this.ekstreBorcu - odenen).toFixed(2));
    }

    return {
      odenenTutar: odenen,
      kalanBorc: this.guncelBorc,
    };
  }

  public limitGuncelle(yeniLimit: number): void {
    if (yeniLimit < this.guncelBorc) {
      throw new Error(
        `Yeni limit mevcut kart borcunuzdan (${this.guncelBorc.toLocaleString('tr-TR')} TL) düşük olamaz.`
      );
    }
    this.limit = yeniLimit;
  }

  public toggleDurum(): void {
    this.durum = this.durum === 'Aktif' ? 'Kilitli' : 'Aktif';
  }

  public toJSON(): IKrediKartiJSON {
    return {
      kartId: this.kartId,
      kartNumarasi: this.kartNumarasi,
      kartSahibi: this.kartSahibi,
      sonKullanma: this.sonKullanma,
      cvv: this.cvv,
      limit: this.limit,
      guncelBorc: this.guncelBorc,
      ekstreBorcu: this.ekstreBorcu,
      asgariOdemeOrani: this.asgariOdemeOrani,
      kesimGunu: this.kesimGunu,
      durum: this.durum,
      kartTipi: this.kartTipi,
    };
  }

  public static fromJSON(data: IKrediKartiJSON): KrediKarti {
    return new KrediKarti(
      data.kartId,
      data.kartNumarasi,
      data.kartSahibi,
      data.sonKullanma,
      data.cvv,
      data.limit,
      data.guncelBorc,
      data.ekstreBorcu,
      data.asgariOdemeOrani,
      data.kesimGunu,
      data.durum,
      data.kartTipi
    );
  }
}
