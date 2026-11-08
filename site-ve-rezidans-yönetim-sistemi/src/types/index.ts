export interface Daire {
  id: string;
  blok: string; // 'A Blok', 'B Blok', 'C Blok'
  daireNo: string; // '1', '2', '10'
  kat: string; // 'Zemin', '1. Kat', '2. Kat'
  tip: string; // '1+1', '2+1', '3+1', '4+1 Dubleks'
  durum: 'Dolu' | 'Boş';
  mulkTipi: 'Ev Sahibi' | 'Kiracı';
  atananKullaniciId?: string;
  alanM2: number;
}

export interface Kullanici {
  id: string;
  adSoyad: string;
  tcNo: string;
  eposta: string;
  telefon: string;
  plakaNo?: string;
  sifre: string; // Otomatik oluşturulan güvenli şifre
  rol: 'Admin' | 'Kullanici';
  daireId?: string;
  kayitTarihi: string;
}

export type FaturaTuru = 'Aidat' | 'Elektrik' | 'Su' | 'Doğalgaz';

export interface FaturaAidat {
  id: string;
  daireId: string;
  kullaniciId?: string;
  tur: FaturaTuru;
  donemAy: string; // Örn: 'Kasım 2026'
  donemKod: string; // Örn: '2026-11'
  tutar: number;
  sonOdemeTarihi: string;
  durum: 'Ödenmedi' | 'Ödendi' | 'Gecikmede';
  tahakkukTarihi: string;
  odemeTarihi?: string;
  odemeId?: string;
  aciklama?: string;
}

export interface Odeme {
  id: string;
  faturaId: string;
  daireId: string;
  kullaniciId: string;
  kullaniciAdi: string;
  faturaTuru: FaturaTuru;
  donemAy: string;
  tutar: number;
  odemeTarihi: string;
  kartSahibi: string;
  kartSon4: string;
  makbuzNo: string;
  islemDurumu: 'Onaylandı' | 'Reddedildi';
  bankaReferansNo: string;
}

export interface MesajYanit {
  gonderen: 'Admin' | 'Kullanici';
  gonderenAdi: string;
  mesaj: string;
  tarih: string;
}

export interface Mesaj {
  id: string;
  kullaniciId: string;
  kullaniciAdi: string;
  daireNo: string;
  blok: string;
  kategori: 'Aidat/Fatura' | 'Arıza/Bakım' | 'Temizlik' | 'Otopark/Güvenlik' | 'Genel';
  aciliyet: 'Düşük' | 'Normal' | 'Yüksek' | 'Acil';
  konu: string;
  icerik: string;
  tarih: string;
  durum: 'Beklemede' | 'İnceleniyor' | 'Cevaplandı' | 'Kapatıldı';
  yanitlar: MesajYanit[];
}

export interface TestBankaKarti {
  kartNo: string;
  kartSahibi: string;
  sktAy: string;
  sktYil: string;
  cvv: string;
  bakiye: number;
  limit: number;
  kullanilanLimit?: number;
  kartTipi: string;
  bankaAdi: string;
  aciklama: string;
}
