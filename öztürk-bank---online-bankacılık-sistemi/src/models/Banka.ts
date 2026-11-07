import {
  IBankaJSON,
  IIslemJSON,
  IKullaniciJSON,
  HesapTuru,
  ParaBirimi,
  KrediTuru,
} from '../types/banking';
import { Kullanici } from './Kullanici';
import { Hesap } from './Hesap';
import { VadeliHesap } from './VadeliHesap';
import { KrediKarti } from './KrediKarti';
import { Kredi } from './Kredi';
import { Islem } from './Islem';

export class Banka {
  private bankaKodu: string = '0188';
  private bankaAdi: string = 'Öztürk Bank A.Ş.';
  private genelMudur: string = 'Enes Öztürk';
  private kasaRezervTL: number = 250000000; // 250 Milyon TL
  private toplamKrediHacmi: number = 85000000;
  private guncelFaizler = {
    mevduatFaiziYillik: 46.5,
    ihtiyacKredisiAylik: 3.79,
    tasitKredisiAylik: 3.49,
    konutKredisiAylik: 2.89,
    gecikmeFaiziAylik: 4.5,
  };
  private musteriler: Map<string, Kullanici> = new Map();
  private tumIslemler: Islem[] = [];
  private sonGuncelleme: string = new Date().toISOString();

  constructor(jsonData?: IBankaJSON) {
    if (jsonData) {
      this.loadFromJSON(jsonData);
    }
  }

  // Getters
  public getBankaKodu(): string {
    return this.bankaKodu;
  }

  public getBankaAdi(): string {
    return this.bankaAdi;
  }

  public getGenelMudur(): string {
    return this.genelMudur;
  }

  public getKasaRezervTL(): number {
    return this.kasaRezervTL;
  }

  public getToplamKrediHacmi(): number {
    return this.toplamKrediHacmi;
  }

  public getGuncelFaizler() {
    return { ...this.guncelFaizler };
  }

  public getMusteriSayisi(): number {
    return this.musteriler.size;
  }

  public getMusteriler(): Kullanici[] {
    return Array.from(this.musteriler.values());
  }

  public getTumIslemler(): Islem[] {
    return [...this.tumIslemler].reverse();
  }

  public getMusteri(tcNo: string): Kullanici | undefined {
    return this.musteriler.get(tcNo);
  }

  public getMusteriIslemleri(tcNo: string): Islem[] {
    return this.tumIslemler
      .filter((i) => {
        const json = i.toJSON();
        return json.gonderenTc === tcNo || json.aliciTc === tcNo;
      })
      .reverse();
  }

  // T.C. Kimlik ve Şifre ile Kullanıcı Girişi
  public kullaniciGiris(tcNo: string, sifre: string): Kullanici {
    const temizTc = tcNo.trim();
    const musteri = this.musteriler.get(temizTc);

    if (!musteri) {
      throw new Error('Belirtilen T.C. Kimlik numarasına ait müşteri kaydı bulunamadı.');
    }

    if (!musteri.sifreDogrula(sifre)) {
      throw new Error('Hatalı şifre! Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.');
    }

    return musteri;
  }

  // Yeni Kullanıcı Kaydı (Doğum Tarihi Kural Kontrollü)
  public kullaniciKayit(
    tcNo: string,
    ad: string,
    soyad: string,
    dogumTarihi: string,
    sifre: string,
    telefon: string,
    email: string
  ): Kullanici {
    const temizTc = tcNo.trim();

    if (!/^\d{11}$/.test(temizTc)) {
      throw new Error('T.C. Kimlik Numarası 11 haneli rakamlardan oluşmalıdır.');
    }

    if (this.musteriler.has(temizTc)) {
      throw new Error('Bu T.C. Kimlik numarası ile kayıtlı bir müşteri zaten bulunmaktadır.');
    }

    if (!dogumTarihi) {
      throw new Error('Doğum tarihi bilgisi zorunludur.');
    }

    // Şifre kural kontrolü: "Şifre içerisinde doğum tarihi olmayacak."
    const sifreKontrol = Kullanici.sifreDogumTarihiIceriyorMu(dogumTarihi, sifre);
    if (sifreKontrol.iceriyor) {
      throw new Error(sifreKontrol.mesaj);
    }

    if (sifre.length < 6) {
      throw new Error('Şifreniz en az 6 karakter olmalıdır.');
    }

    const yeniId = `USR-${Date.now().toString().slice(-6)}`;
    const varsayilanIban = this.ibanUret();
    const hesapNo = varsayilanIban.slice(-8);

    // Müşteriye başlangıç vadesiz TL hesabı tanımla
    const ilkHesap = new Hesap(
      hesapNo,
      varsayilanIban,
      5000, // Hoşgeldin bakiyesi
      'Vadesiz TL',
      'TRY',
      new Date().toISOString(),
      2500 // Ek hesap limiti
    );

    // Müşteriye otomatik bir kredi kartı oluştur
    const kartNo = this.kartNumarasiUret();
    const sonKull = '12/29';
    const cvv = String(Math.floor(100 + Math.random() * 900));
    const ilkKart = new KrediKarti(
      `CRD-${Date.now().toString().slice(-4)}`,
      kartNo,
      `${ad.toUpperCase()} ${soyad.toUpperCase()}`,
      sonKull,
      cvv,
      25000,
      0,
      0,
      0.2,
      15,
      'Aktif',
      'Mastercard'
    );

    const yeniMusteri = new Kullanici(
      yeniId,
      temizTc,
      ad.trim(),
      soyad.trim(),
      dogumTarihi,
      sifre,
      telefon.trim(),
      email.trim(),
      'MUSTERI',
      new Date().toISOString(),
      [ilkHesap],
      [ilkKart],
      []
    );

    this.musteriler.set(temizTc, yeniMusteri);

    // Hoşgeldin İşlem Kaydı
    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'HESAP_ACMA',
      'Öztürk Bank A.Ş.',
      yeniMusteri.getTamAd(),
      5000,
      'TRY',
      'Öztürk Bank Dijital Hesap Açılış & Hoş Geldin Bakiyesi',
      'Başarılı',
      undefined,
      'TR00 0188 0000 0000 0000 0000 01',
      temizTc,
      varsayilanIban,
      5000
    );
    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();

    return yeniMusteri;
  }

  // KULLANICILAR ARASI PARA TRANSFERİ (Havale / FAST)
  public paraTransferi(
    gonderenTc: string,
    gonderenIban: string,
    hedefIbanVeyaTc: string,
    tutar: number,
    aciklama: string = 'Para Transferi',
    aliciAdManuel?: string
  ): Islem {
    if (tutar <= 0) {
      throw new Error('Transfer tutarı sıfırdan büyük olmalıdır.');
    }

    const gonderen = this.musteriler.get(gonderenTc);
    if (!gonderen) {
      throw new Error('Gönderen müşteri bulunamadı.');
    }

    const kaynakHesap = gonderen.hesapBul(gonderenIban);
    if (!kaynakHesap) {
      throw new Error('Gönderici kaynak hesap bulunamadı.');
    }

    // Gönderici bakiye kontrolü ve çekim
    kaynakHesap.paraCek(tutar);

    // Alıcıyı banka müşterileri arasında ara
    const hedefTemiz = hedefIbanVeyaTc.trim().replace(/\s+/g, '');
    let aliciMusteri: Kullanici | undefined;
    let aliciHesap: Hesap | undefined;

    // Önce IBAN ile ara
    for (const musteri of this.musteriler.values()) {
      const h = musteri.hesapBul(hedefTemiz);
      if (h) {
        aliciMusteri = musteri;
        aliciHesap = h;
        break;
      }
    }

    // Eğer IBAN ile bulunamazsa TC ile ara
    if (!aliciMusteri && hedefTemiz.length === 11) {
      aliciMusteri = this.musteriler.get(hedefTemiz);
      if (aliciMusteri) {
        aliciHesap = aliciMusteri.varsayilanVadesizHesap();
      }
    }

    let aliciIsim = aliciAdManuel || 'Diğer Alıcı';
    let aliciIbanSon = hedefIbanVeyaTc;
    let aliciTcSon: string | undefined = undefined;

    if (aliciMusteri && aliciHesap) {
      // Öztürk Bank içi Havale / FAST
      aliciHesap.paraYatir(tutar);
      aliciIsim = aliciMusteri.getTamAd();
      aliciIbanSon = aliciHesap.getIban();
      aliciTcSon = aliciMusteri.getTcNo();
    } else {
      // Dış Banka FAST / EFT simülasyonu
      aliciIsim = aliciAdManuel || 'T.C. Ziraat Bankası / FAST Alıcısı';
    }

    const islemTuru = aliciMusteri ? 'HAVALE' : 'EFT_FAST';
    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      islemTuru,
      gonderen.getTamAd(),
      aliciIsim,
      tutar,
      kaynakHesap.getParaBirimi(),
      aciklama,
      'Başarılı',
      gonderen.getTcNo(),
      kaynakHesap.getIban(),
      aliciTcSon,
      aliciIbanSon,
      kaynakHesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();
    return islem;
  }

  // KULLANICI BANKAYA KREDİ KARTI EKSTRESİ / BORCU ÖDEMESİ
  public krediKartiBorcuOde(
    tcNo: string,
    kartId: string,
    hesapIban: string,
    tutar: number
  ): { islem: Islem; odenen: number; kalanBorc: number } {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const hesap = musteri.hesapBul(hesapIban);
    if (!hesap) throw new Error('Ödeme yapılacak kaynak hesap bulunamadı.');

    const kart = musteri.getKrediKartlari().find((k) => k.getKartId() === kartId);
    if (!kart) throw new Error('Kredi kartı bulunamadı.');

    if (tutar <= 0) throw new Error('Ödeme tutarı sıfırdan büyük olmalıdır.');

    // Hesaptan parayı tahsil et
    hesap.paraCek(tutar);

    // Karta borç ödemesi uygula
    const sonuc = kart.borcOde(tutar);

    // Banka kasasına ödeme girişi
    this.kasaRezervTL += sonuc.odenenTutar;

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'KREDI_KARTI_ODEMESI',
      musteri.getTamAd(),
      'Öztürk Bank Kredi Kartları Operasyon Merkezi',
      sonuc.odenenTutar,
      'TRY',
      `${kart.getMaskeliKartNo()} Nolu Kredi Kartı Borç / Ekstre Ödemesi`,
      'Başarılı',
      musteri.getTcNo(),
      hesap.getIban(),
      undefined,
      kart.getKartNumarasi(),
      hesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();

    return {
      islem,
      odenen: sonuc.odenenTutar,
      kalanBorc: sonuc.kalanBorc,
    };
  }

  // KULLANICI BANKAYA KREDİ TAKSİTİ ÖDEMESİ
  public krediTaksitiOde(
    tcNo: string,
    krediId: string,
    hesapIban: string
  ): { islem: Islem; odenen: number; kalanBorc: number; taksitKalan: number } {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const hesap = musteri.hesapBul(hesapIban);
    if (!hesap) throw new Error('Ödeme yapılacak hesap bulunamadı.');

    const kredi = musteri.getKrediler().find((k) => k.getKrediId() === krediId);
    if (!kredi) throw new Error('Kredi sözleşmesi bulunamadı.');

    const odenecekTutar = kredi.getAylikTaksit();

    // Hesaptan taksit tutarını çek
    hesap.paraCek(odenecekTutar);

    // Kredi taksitini düşür
    const sonuc = kredi.taksitOde(odenecekTutar);

    // Banka kasasına faiz ve anapara tahsilatı
    this.kasaRezervTL += sonuc.odenen;

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'KREDI_ODEMESI',
      musteri.getTamAd(),
      'Öztürk Bank Krediler ve Hazine Bölümü',
      sonuc.odenen,
      'TRY',
      `${kredi.getKrediTuru()} #${kredi.getKrediId()} Taksit Ödemesi (${kredi.getToplamTaksit() - sonuc.kalanTaksit}/${kredi.getToplamTaksit})`,
      'Başarılı',
      musteri.getTcNo(),
      hesap.getIban(),
      undefined,
      `KREDI-HESAP-${kredi.getKrediId()}`,
      hesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();

    return {
      islem,
      odenen: sonuc.odenen,
      kalanBorc: sonuc.kalanBorc,
      taksitKalan: sonuc.kalanTaksit,
    };
  }

  // ANINDA KREDİ BAŞVURUSU VE BANKA ONAY SİMÜLASYONU
  public krediBasvurusu(
    tcNo: string,
    anaPara: number,
    vadeAy: number,
    krediTuru: KrediTuru,
    hedefIban: string
  ): Kredi {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const hedefHesap = musteri.hesapBul(hedefIban);
    if (!hedefHesap) throw new Error('Kredi tutarının aktarılacağı hesap bulunamadı.');

    let aylikFaiz = this.guncelFaizler.ihtiyacKredisiAylik;
    if (krediTuru === 'Taşıt Kredisi') aylikFaiz = this.guncelFaizler.tasitKredisiAylik;
    if (krediTuru === 'Konut Kredisi') aylikFaiz = this.guncelFaizler.konutKredisiAylik;

    const krediId = `KRD-${Date.now().toString().slice(-6)}`;
    const yeniKredi = new Kredi(krediId, krediTuru, anaPara, aylikFaiz, vadeAy);

    // Kredi miktarını anında müşterinin vadesiz hesabına yatır
    hedefHesap.paraYatir(anaPara);
    musteri.krediEkle(yeniKredi);

    this.toplamKrediHacmi += anaPara;

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'PARA_YATIRMA',
      'Öztürk Bank Kredi Onay Merkezi',
      musteri.getTamAd(),
      anaPara,
      'TRY',
      `Onaylanan ${krediTuru} Hesaba Kullandırıldı (#${krediId})`,
      'Başarılı',
      undefined,
      'TR00 0188 0000 0000 0000 KREDI',
      musteri.getTcNo(),
      hedefHesap.getIban(),
      hedefHesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();

    return yeniKredi;
  }

  // YENİ HESAP AÇMA
  public yeniHesapAc(
    tcNo: string,
    hesapTuru: HesapTuru,
    paraBirimi: ParaBirimi = 'TRY',
    baslangicBakiye: number = 0,
    vadeGunu: number = 32
  ): Hesap {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const iban = this.ibanUret();
    const hesapNo = iban.slice(-8);

    let yeniHesap: Hesap;
    if (hesapTuru === 'Vadeli TL') {
      yeniHesap = new VadeliHesap(
        hesapNo,
        iban,
        baslangicBakiye,
        vadeGunu,
        this.guncelFaizler.mevduatFaiziYillik,
        new Date().toISOString(),
        new Date().toISOString()
      );
    } else {
      yeniHesap = new Hesap(
        hesapNo,
        iban,
        baslangicBakiye,
        hesapTuru,
        paraBirimi,
        new Date().toISOString(),
        hesapTuru === 'Vadesiz TL' ? 2000 : 0
      );
    }

    musteri.hesapEkle(yeniHesap);

    if (baslangicBakiye > 0) {
      const islem = new Islem(
        `TX-${Date.now()}`,
        Islem.referansNoUret(),
        new Date().toISOString(),
        'HESAP_ACMA',
        'Öztürk Bank Gişe / Online Şube',
        musteri.getTamAd(),
        baslangicBakiye,
        paraBirimi,
        `Yeni ${hesapTuru} Açılışı & Bakiye Yükleme`,
        'Başarılı',
        undefined,
        undefined,
        musteri.getTcNo(),
        iban,
        baslangicBakiye
      );
      this.tumIslemler.push(islem);
    }

    this.sonGuncelleme = new Date().toISOString();
    return yeniHesap;
  }

  // KREDİ KARTI İLE HARCAMA YAPMA SİMÜLASYONU
  public kartHarcamasiYap(
    tcNo: string,
    kartId: string,
    tutar: number,
    magazaAdi: string = 'E-Ticaret / POS Harcaması'
  ): Islem {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const kart = musteri.getKrediKartlari().find((k) => k.getKartId() === kartId);
    if (!kart) throw new Error('Kredi kartı bulunamadı.');

    kart.harcamaYap(tutar);

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'KART_HARCAMASI',
      musteri.getTamAd(),
      magazaAdi,
      tutar,
      'TRY',
      `${kart.getMaskeliKartNo()} - ${magazaAdi}`,
      'Başarılı',
      musteri.getTcNo(),
      kart.getKartNumarasi(),
      undefined,
      undefined
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();
    return islem;
  }

  // HESABA PARA YATIRMA (ATM / GİŞE)
  public paraYatir(tcNo: string, iban: string, tutar: number): Islem {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const hesap = musteri.hesapBul(iban);
    if (!hesap) throw new Error('Hesap bulunamadı.');

    hesap.paraYatir(tutar);

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'PARA_YATIRMA',
      'ATM / Hızlı Para Yatırma',
      musteri.getTamAd(),
      tutar,
      hesap.getParaBirimi(),
      'Öztürk Bank ATM Nakit Yatırma',
      'Başarılı',
      undefined,
      undefined,
      musteri.getTcNo(),
      hesap.getIban(),
      hesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();
    return islem;
  }

  // HESAPTAN PARA ÇEKME (ATM)
  public paraCek(tcNo: string, iban: string, tutar: number): Islem {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    const hesap = musteri.hesapBul(iban);
    if (!hesap) throw new Error('Hesap bulunamadı.');

    hesap.paraCek(tutar);

    const islem = new Islem(
      `TX-${Date.now()}`,
      Islem.referansNoUret(),
      new Date().toISOString(),
      'PARA_CEKME',
      musteri.getTamAd(),
      'Öztürk Bank ATM 0188-Kadıköy',
      tutar,
      hesap.getParaBirimi(),
      'Öztürk Bank ATM Nakit Çekme',
      'Başarılı',
      musteri.getTcNo(),
      hesap.getIban(),
      undefined,
      undefined,
      hesap.getBakiye()
    );

    this.tumIslemler.push(islem);
    this.sonGuncelleme = new Date().toISOString();
    return islem;
  }

  // ŞİFRE DEĞİŞTİRME (Doğum Tarihi Güvenlik Kontrollü)
  public sifreDegistir(tcNo: string, eskiSifre: string, yeniSifre: string): void {
    const musteri = this.musteriler.get(tcNo);
    if (!musteri) throw new Error('Müşteri bulunamadı.');

    if (!musteri.sifreDogrula(eskiSifre)) {
      throw new Error('Mevcut şifreniz hatalı.');
    }

    // Şifre kural kontrolü
    musteri.sifreGuncelle(yeniSifre);
    this.sonGuncelleme = new Date().toISOString();
  }

  // Yardımcı Generator Metotlar
  public ibanUret(): string {
    const rastgele = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    return `TR${Math.floor(10 + Math.random() * 89)} ${this.bankaKodu} 0000 0000 ${String(rastgele).slice(0, 4)} ${String(rastgele).slice(4, 8)}`;
  }

  public kartNumarasiUret(): string {
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const r3 = Math.floor(1000 + Math.random() * 9000);
    return `5428 ${r1} ${r2} ${r3}`;
  }

  // JSON IMPORT / EXPORT (Veritabanı kullanılmayacak, JSON okunup işlenecek!)
  public toJSON(): IBankaJSON {
    return {
      bankaKodu: this.bankaKodu,
      bankaAdi: this.bankaAdi,
      genelMudur: this.genelMudur,
      kasaRezervTL: this.kasaRezervTL,
      toplamKrediHacmi: this.toplamKrediHacmi,
      guncelFaizler: { ...this.guncelFaizler },
      musteriler: Array.from(this.musteriler.values()).map((m) => m.toJSON()),
      tumIslemler: this.tumIslemler.map((i) => i.toJSON()),
      sonGuncelleme: this.sonGuncelleme,
    };
  }

  public loadFromJSON(data: IBankaJSON): void {
    this.bankaKodu = data.bankaKodu || '0188';
    this.bankaAdi = data.bankaAdi || 'Öztürk Bank A.Ş.';
    this.genelMudur = data.genelMudur || 'Enes Öztürk';
    this.kasaRezervTL = data.kasaRezervTL ?? 250000000;
    this.toplamKrediHacmi = data.toplamKrediHacmi ?? 85000000;

    if (data.guncelFaizler) {
      this.guncelFaizler = { ...this.guncelFaizler, ...data.guncelFaizler };
    }

    this.musteriler.clear();
    if (data.musteriler && Array.isArray(data.musteriler)) {
      for (const mJSON of data.musteriler) {
        const musteri = Kullanici.fromJSON(mJSON);
        this.musteriler.set(musteri.getTcNo(), musteri);
      }
    }

    this.tumIslemler = [];
    if (data.tumIslemler && Array.isArray(data.tumIslemler)) {
      for (const iJSON of data.tumIslemler) {
        this.tumIslemler.push(Islem.fromJSON(iJSON));
      }
    }

    this.sonGuncelleme = data.sonGuncelleme || new Date().toISOString();
  }
}
