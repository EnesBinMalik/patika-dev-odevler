import {
  IKullaniciJSON,
  KullaniciRolu,
  IHesapJSON,
  IKrediKartiJSON,
  IKrediJSON,
} from '../types/banking';
import { Hesap } from './Hesap';
import { VadeliHesap } from './VadeliHesap';
import { KrediKarti } from './KrediKarti';
import { Kredi } from './Kredi';

export class Kullanici {
  private id: string;
  private tcNo: string;
  private ad: string;
  private soyad: string;
  private dogumTarihi: string; // YYYY-MM-DD formatında
  private sifre: string;
  private telefon: string;
  private email: string;
  private rol: KullaniciRolu;
  private kayitTarihi: string;
  private hesaplar: Hesap[];
  private krediKartlari: KrediKarti[];
  private krediler: Kredi[];

  constructor(
    id: string,
    tcNo: string,
    ad: string,
    soyad: string,
    dogumTarihi: string,
    sifre: string,
    telefon: string,
    email: string,
    rol: KullaniciRolu = 'MUSTERI',
    kayitTarihi: string = new Date().toISOString(),
    hesaplar: Hesap[] = [],
    krediKartlari: KrediKarti[] = [],
    krediler: Kredi[] = []
  ) {
    this.id = id;
    this.tcNo = tcNo;
    this.ad = ad;
    this.soyad = soyad;
    this.dogumTarihi = dogumTarihi;
    this.sifre = sifre;
    this.telefon = telefon;
    this.email = email;
    this.rol = rol;
    this.kayitTarihi = kayitTarihi;
    this.hesaplar = hesaplar;
    this.krediKartlari = krediKartlari;
    this.krediler = krediler;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getTcNo(): string {
    return this.tcNo;
  }

  public getAd(): string {
    return this.ad;
  }

  public getSoyad(): string {
    return this.soyad;
  }

  public getTamAd(): string {
    return `${this.ad} ${this.soyad}`;
  }

  public getDogumTarihi(): string {
    return this.dogumTarihi;
  }

  public getTelefon(): string {
    return this.telefon;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRol(): KullaniciRolu {
    return this.rol;
  }

  public getKayitTarihi(): string {
    return this.kayitTarihi;
  }

  public getHesaplar(): Hesap[] {
    return this.hesaplar;
  }

  public getKrediKartlari(): KrediKarti[] {
    return this.krediKartlari;
  }

  public getKrediler(): Kredi[] {
    return this.krediler;
  }

  public sifreDogrula(girilenSifre: string): boolean {
    return this.sifre === girilenSifre;
  }

  /**
   * ZORUNLU GÜVENLİK KURALI:
   * "Şifre içerisinde doğum tarihi olmayacak."
   * Kullanıcının doğum yılı, gün-ay kombinasyonları, ters veya düz tarih dizilimleri
   * şifre içinde kesinlikle barındırılamaz.
   */
  public static sifreDogumTarihiIceriyorMu(
    dogumTarihi: string,
    sifre: string
  ): { iceriyor: boolean; mesaj?: string } {
    if (!dogumTarihi || !sifre) {
      return { iceriyor: false };
    }

    const temizSifre = sifre.toLowerCase().replace(/[\s\-_.]/g, '');

    // Doğum tarihi bileşenlerini ayrıştır (örn: "1994-06-25")
    const parts = dogumTarihi.split('-');
    if (parts.length < 3) {
      return { iceriyor: false };
    }

    const [yil, ay, gun] = parts; // '1994', '06', '25'
    const yilKisa = yil.slice(2); // '94'
    const aySayi = String(parseInt(ay, 10)); // '6'
    const gunSayi = String(parseInt(gun, 10)); // '25'

    // Yasaklı tarih kalıpları
    const yasakliKombinasyonlar: { kalip: string; aciklama: string }[] = [
      { kalip: yil, aciklama: `Doğum yılınız (${yil})` },
      { kalip: `${gun}${ay}`, aciklama: `Doğum gününüz ve ayınız (${gun}${ay})` },
      { kalip: `${ay}${gun}`, aciklama: `Doğum ayınız ve gününüz (${ay}${gun})` },
      { kalip: `${gunSayi}${aySayi}`, aciklama: `Doğum günü/ay (${gunSayi}${aySayi})` },
      { kalip: `${yil}${ay}${gun}`, aciklama: `Tam doğum tarihiniz (${yil}${ay}${gun})` },
      { kalip: `${gun}${ay}${yil}`, aciklama: `Tam doğum tarihiniz (${gun}${ay}${yil})` },
      { kalip: `${yilKisa}${ay}${gun}`, aciklama: `Kısa doğum tarihiniz (${yilKisa}${ay}${gun})` },
      { kalip: `${gun}${ay}${yilKisa}`, aciklama: `Kısa doğum tarihiniz (${gun}${ay}${yilKisa})` },
    ];

    for (const item of yasakliKombinasyonlar) {
      if (item.kalip.length >= 4 && temizSifre.includes(item.kalip.toLowerCase())) {
        return {
          iceriyor: true,
          mesaj: `Güvenlik İhlali: Şifreniz doğum tarihinizi (${item.aciklama}) içeremez!`,
        };
      }
    }

    // Ayrıca 1900-2026 arası doğum yılı direkt şifrede geçiyorsa
    if (temizSifre.includes(yil)) {
      return {
        iceriyor: true,
        mesaj: `Güvenlik İhlali: Şifreniz doğum yılınızı (${yil}) içeremez!`,
      };
    }

    return { iceriyor: false };
  }

  public sifreGuncelle(yeniSifre: string): void {
    const kontrol = Kullanici.sifreDogumTarihiIceriyorMu(this.dogumTarihi, yeniSifre);
    if (kontrol.iceriyor) {
      throw new Error(kontrol.mesaj);
    }
    if (yeniSifre.length < 6) {
      throw new Error('Şifre en az 6 karakter uzunluğunda olmalıdır.');
    }
    this.sifre = yeniSifre;
  }

  // Hesap & Varlık Yönetimi
  public getToplamVarlikTL(): number {
    return this.hesaplar.reduce((toplam, h) => {
      if (h.getParaBirimi() === 'TRY') {
        return toplam + h.getBakiye();
      }
      // Basit kur simülasyonu
      if (h.getParaBirimi() === 'USD') return toplam + h.getBakiye() * 36.5;
      if (h.getParaBirimi() === 'EUR') return toplam + h.getBakiye() * 39.5;
      return toplam;
    }, 0);
  }

  public getToplamBorcTL(): number {
    const kartBorcu = this.krediKartlari.reduce((t, k) => t + k.getGuncelBorc(), 0);
    const krediBorcu = this.krediler.reduce((t, k) => t + k.getKalanBorc(), 0);
    return Number((kartBorcu + krediBorcu).toFixed(2));
  }

  public hesapBul(iban: string): Hesap | undefined {
    return this.hesaplar.find((h) => h.getIban().replace(/\s+/g, '') === iban.replace(/\s+/g, ''));
  }

  public varsayilanVadesizHesap(): Hesap | undefined {
    return this.hesaplar.find((h) => h.getHesapTuru() === 'Vadesiz TL') || this.hesaplar[0];
  }

  public hesapEkle(hesap: Hesap): void {
    this.hesaplar.push(hesap);
  }

  public krediKartiEkle(kart: KrediKarti): void {
    this.krediKartlari.push(kart);
  }

  public krediEkle(kredi: Kredi): void {
    this.krediler.push(kredi);
  }

  public toJSON(): IKullaniciJSON {
    return {
      id: this.id,
      tcNo: this.tcNo,
      ad: this.ad,
      soyad: this.soyad,
      dogumTarihi: this.dogumTarihi,
      sifre: this.sifre,
      telefon: this.telefon,
      email: this.email,
      rol: this.rol,
      kayitTarihi: this.kayitTarihi,
      hesaplar: this.hesaplar.map((h) => h.toJSON()),
      krediKartlari: this.krediKartlari.map((k) => k.toJSON()),
      krediler: this.krediler.map((k) => k.toJSON()),
    };
  }

  public static fromJSON(data: IKullaniciJSON): Kullanici {
    const hesaplar = (data.hesaplar || []).map((hJSON: IHesapJSON) => {
      if (hJSON.hesapTuru === 'Vadeli TL' || hJSON.vadeGunu) {
        return VadeliHesap.fromJSON(hJSON);
      }
      return Hesap.fromJSON(hJSON);
    });

    const krediKartlari = (data.krediKartlari || []).map((kJSON: IKrediKartiJSON) =>
      KrediKarti.fromJSON(kJSON)
    );

    const krediler = (data.krediler || []).map((cJSON: IKrediJSON) => Kredi.fromJSON(cJSON));

    return new Kullanici(
      data.id,
      data.tcNo,
      data.ad,
      data.soyad,
      data.dogumTarihi,
      data.sifre,
      data.telefon,
      data.email,
      data.rol,
      data.kayitTarihi,
      hesaplar,
      krediKartlari,
      krediler
    );
  }
}
