import { IIslemJSON, IslemTuru, ParaBirimi } from '../types/banking';

export class Islem {
  private id: string;
  private referansNo: string;
  private tarih: string;
  private tur: IslemTuru;
  private gonderenTc?: string;
  private gonderenAd: string;
  private gonderenIban?: string;
  private aliciTc?: string;
  private aliciAd: string;
  private aliciIban?: string;
  private tutar: number;
  private paraBirimi: ParaBirimi;
  private aciklama: string;
  private durum: 'Başarılı' | 'Reddedildi';
  private kalanBakiye?: number;

  constructor(
    id: string,
    referansNo: string,
    tarih: string,
    tur: IslemTuru,
    gonderenAd: string,
    aliciAd: string,
    tutar: number,
    paraBirimi: ParaBirimi = 'TRY',
    aciklama: string = '',
    durum: 'Başarılı' | 'Reddedildi' = 'Başarılı',
    gonderenTc?: string,
    gonderenIban?: string,
    aliciTc?: string,
    aliciIban?: string,
    kalanBakiye?: number
  ) {
    this.id = id;
    this.referansNo = referansNo;
    this.tarih = tarih;
    this.tur = tur;
    this.gonderenAd = gonderenAd;
    this.aliciAd = aliciAd;
    this.tutar = tutar;
    this.paraBirimi = paraBirimi;
    this.aciklama = aciklama;
    this.durum = durum;
    this.gonderenTc = gonderenTc;
    this.gonderenIban = gonderenIban;
    this.aliciTc = aliciTc;
    this.aliciIban = aliciIban;
    this.kalanBakiye = kalanBakiye;
  }

  public getId(): string {
    return this.id;
  }

  public getReferansNo(): string {
    return this.referansNo;
  }

  public getTarih(): string {
    return this.tarih;
  }

  public getTur(): IslemTuru {
    return this.tur;
  }

  public getGonderenAd(): string {
    return this.gonderenAd;
  }

  public getAliciAd(): string {
    return this.aliciAd;
  }

  public getTutar(): number {
    return this.tutar;
  }

  public getParaBirimi(): ParaBirimi {
    return this.paraBirimi;
  }

  public getAciklama(): string {
    return this.aciklama;
  }

  public getDurum(): 'Başarılı' | 'Reddedildi' {
    return this.durum;
  }

  public getGonderenIban(): string | undefined {
    return this.gonderenIban;
  }

  public getAliciIban(): string | undefined {
    return this.aliciIban;
  }

  public getKalanBakiye(): number | undefined {
    return this.kalanBakiye;
  }

  public getTurBasligi(): string {
    switch (this.tur) {
      case 'HAVALE':
        return 'Hesaba Havale Transferi';
      case 'EFT_FAST':
        return 'FAST / EFT Para Transferi';
      case 'KREDI_ODEMESI':
        return 'Kredi Taksit Ödemesi';
      case 'KREDI_KARTI_ODEMESI':
        return 'Kredi Kartı Borç / Ekstre Ödemesi';
      case 'HESAP_ACMA':
        return 'Yeni Hesap Açılışı';
      case 'PARA_YATIRMA':
        return 'Hesaba Nakit Yatırma';
      case 'PARA_CEKME':
        return 'Hesaptan Nakit Çekme';
      case 'KART_HARCAMASI':
        return 'Kredi Kartı Harcaması';
      case 'FAIZ_GELIRI':
        return 'Mevduat Faiz Geliri';
      default:
        return 'Banka İşlemi';
    }
  }

  public static referansNoUret(): string {
    const yil = new Date().getFullYear();
    const rastgele = Math.floor(10000000 + Math.random() * 90000000);
    return `OZB-${yil}-${rastgele}`;
  }

  public toJSON(): IIslemJSON {
    return {
      id: this.id,
      referansNo: this.referansNo,
      tarih: this.tarih,
      tur: this.tur,
      gonderenTc: this.gonderenTc,
      gonderenAd: this.gonderenAd,
      gonderenIban: this.gonderenIban,
      aliciTc: this.aliciTc,
      aliciAd: this.aliciAd,
      aliciIban: this.aliciIban,
      tutar: this.tutar,
      paraBirimi: this.paraBirimi,
      aciklama: this.aciklama,
      durum: this.durum,
      kalanBakiye: this.kalanBakiye,
    };
  }

  public static fromJSON(data: IIslemJSON): Islem {
    return new Islem(
      data.id,
      data.referansNo,
      data.tarih,
      data.tur,
      data.gonderenAd,
      data.aliciAd,
      data.tutar,
      data.paraBirimi,
      data.aciklama,
      data.durum,
      data.gonderenTc,
      data.gonderenIban,
      data.aliciTc,
      data.aliciIban,
      data.kalanBakiye
    );
  }
}
