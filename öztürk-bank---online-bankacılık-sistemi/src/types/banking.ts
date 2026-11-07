export type HesapTuru = 'Vadesiz TL' | 'Vadesiz USD' | 'Vadesiz EUR' | 'Vadeli TL';
export type ParaBirimi = 'TRY' | 'USD' | 'EUR';

export type IslemTuru =
  | 'HAVALE'
  | 'EFT_FAST'
  | 'KREDI_ODEMESI'
  | 'KREDI_KARTI_ODEMESI'
  | 'HESAP_ACMA'
  | 'PARA_YATIRMA'
  | 'PARA_CEKME'
  | 'KART_HARCAMASI'
  | 'FAIZ_GELIRI';

export type KrediTuru = 'İhtiyaç Kredisi' | 'Taşıt Kredisi' | 'Konut Kredisi';

export type KullaniciRolu = 'MUSTERI' | 'YONETICI';

export interface IHesapJSON {
  hesapNo: string;
  iban: string;
  bakiye: number;
  hesapTuru: HesapTuru;
  paraBirimi: ParaBirimi;
  olusturmaTarihi: string;
  ekHesapLimiti?: number;
  // Vadeli hesap parametreleri
  vadeGunu?: number;
  faizOrani?: number;
  vadeBaslangic?: string;
  vadeBitis?: string;
}

export interface IKrediKartiJSON {
  kartId: string;
  kartNumarasi: string;
  kartSahibi: string;
  sonKullanma: string;
  cvv: string;
  limit: number;
  guncelBorc: number;
  ekstreBorcu: number;
  asgariOdemeOrani: number; // örn: 0.20 (%20)
  kesimGunu: number;
  durum: 'Aktif' | 'Kilitli';
  kartTipi: 'Mastercard' | 'Visa';
}

export interface IKrediJSON {
  krediId: string;
  krediTuru: KrediTuru;
  anaPara: number;
  faizOrani: number; // aylık faiz oranı örn: %3.5
  vadeAy: number;
  aylikTaksit: number;
  toplamGeriOdeme: number;
  kalanBorc: number;
  kalanTaksit: number;
  toplamTaksit: number;
  baslangicTarihi: string;
  durum: 'Aktif' | 'Tamamlandı';
}

export interface IIslemJSON {
  id: string;
  referansNo: string;
  tarih: string;
  tur: IslemTuru;
  gonderenTc?: string;
  gonderenAd: string;
  gonderenIban?: string;
  aliciTc?: string;
  aliciAd: string;
  aliciIban?: string;
  tutar: number;
  paraBirimi: ParaBirimi;
  aciklama: string;
  durum: 'Başarılı' | 'Reddedildi';
  kalanBakiye?: number;
}

export interface IKullaniciJSON {
  id: string;
  tcNo: string;
  ad: string;
  soyad: string;
  dogumTarihi: string; // YYYY-MM-DD
  sifre: string;
  telefon: string;
  email: string;
  rol: KullaniciRolu;
  kayitTarihi: string;
  hesaplar: IHesapJSON[];
  krediKartlari: IKrediKartiJSON[];
  krediler: IKrediJSON[];
}

export interface IBankaJSON {
  bankaKodu: string;
  bankaAdi: string;
  genelMudur: string;
  kasaRezervTL: number;
  toplamKrediHacmi: number;
  guncelFaizler: {
    mevduatFaiziYillik: number; // örn: 45
    ihtiyacKredisiAylik: number; // örn: 3.89
    tasitKredisiAylik: number; // örn: 3.49
    konutKredisiAylik: number; // örn: 2.99
    gecikmeFaiziAylik: number; // örn: 4.5
  };
  musteriler: IKullaniciJSON[];
  tumIslemler: IIslemJSON[];
  sonGuncelleme: string;
}
