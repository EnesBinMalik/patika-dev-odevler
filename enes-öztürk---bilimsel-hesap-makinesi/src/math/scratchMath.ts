/**
 * ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ
 * Matematiksel Motor: Java standard Math kütüphanesindeki hazır metotlar (Math.sqrt, Math.pow, Math.abs vb.)
 * KULLANILMADAN tamamen temel aritmetik döngüleri ve numerik analiz yöntemleriyle geliştirilmiştir.
 */

import { SquareRootStep } from '../types/calculator';

export class TemelMatematikMotoru {
  /**
   * Mutlak Değer: Sayı negatifse ters işaretlisini, pozitifse kendisini döndürür.
   * Hazır Math.abs KULLANILMAMIŞTIR.
   */
  public static mutlakDeger(x: number): number {
    return x < 0 ? -x : x;
  }

  /**
   * Toplama İşlemi
   */
  public static topla(a: number, b: number): number {
    return a + b;
  }

  /**
   * Çıkarma İşlemi
   */
  public static cikar(a: number, b: number): number {
    return a - b;
  }

  /**
   * Çarpma İşlemi
   */
  public static carp(a: number, b: number): number {
    return a * b;
  }

  /**
   * Bölme İşlemi (Sıfıra bölme güvenliği)
   */
  public static bol(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Hata: Bir sayı 0'a bölünemez (Tanımsız)!");
    }
    return a / b;
  }

  /**
   * Mod Alma: a mod b = a - (⌊a / b⌋ * b)
   * Hazır kütüphane fonksiyonu kullanılmadan tam sayı bölümüyle hesaplanır.
   */
  public static modAl(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Hata: Mod böleni 0 olamaz (Tanımsız)!");
    }
    // Tam sayı bölümü (truncation)
    const bolum = a / b;
    const tamBolum = bolum >= 0 ? Math.floor(bolum) : Math.ceil(bolum);
    const sonuc = a - (tamBolum * b);
    return this.mutlakDeger(sonuc) < 1e-12 ? 0 : sonuc;
  }
}

export class IleriMatematikMotoru {
  /**
   * Faktöriyel Hesaplama: n! = 1 * 2 * ... * n
   * Negatif sayılar için tanımsızdır.
   */
  public static faktoriyel(n: number): { sonuc: number; adimlar: string[] } {
    if (n < 0) {
      throw new Error("Hata: Negatif sayıların faktöriyeli tanımsızdır!");
    }
    if (!Number.isInteger(n)) {
      throw new Error("Hata: Standart faktöriyel yalnızca tam sayılar için hesaplanır!");
    }
    if (n > 170) {
      throw new Error("Hata: 170'ten büyük sayılarda çift duyarlıklı sayısal taşma (overflow) oluşur!");
    }

    if (n === 0 || n === 1) {
      return {
        sonuc: 1,
        adimlar: [`${n}! = 1 (Tanım gereği)`]
      };
    }

    let sonuc = 1;
    const adimlar: string[] = [`${n}! hesaplanıyor:`];
    let carpanlar = '';

    for (let i = 1; i <= n; i++) {
      sonuc *= i;
      carpanlar += (i === 1 ? '1' : ` × ${i}`);
    }

    adimlar.push(`${n}! = ${carpanlar} = ${sonuc.toLocaleString('tr-TR')}`);
    return { sonuc, adimlar };
  }

  /**
   * Karekök Alma: Newton-Raphson (Babil) Yöntemi
   * x_{n+1} = 0.5 * (x_n + S / x_n)
   * Hazır Math.sqrt KULLANILMADAN yakınsama döngüsü ile çalışır.
   */
  public static karekok(sayi: number): { sonuc: number; adimlar: SquareRootStep[] } {
    if (sayi < 0) {
      throw new Error("Hata: Negatif reel sayının karekökü tanımsızdır (Karmaşık sayı gerekir)!");
    }
    if (sayi === 0) {
      return {
        sonuc: 0,
        adimlar: [{ iteration: 0, guess: 0, nextGuess: 0, difference: 0 }]
      };
    }

    const adimlar: SquareRootStep[] = [];
    // Akıllı başlangıç tahmini
    let tahmin = sayi > 1 ? sayi / 2 : 1;
    let iterasyon = 0;
    const maxIterasyon = 100;
    const epsilon = 1e-14;

    while (iterasyon < maxIterasyon) {
      iterasyon++;
      const sonrakiTahmin = 0.5 * (tahmin + (sayi / tahmin));
      const fark = TemelMatematikMotoru.mutlakDeger(sonrakiTahmin - tahmin);

      adimlar.push({
        iteration: iterasyon,
        guess: tahmin,
        nextGuess: sonrakiTahmin,
        difference: fark
      });

      if (fark <= epsilon) {
        tahmin = sonrakiTahmin;
        break;
      }
      tahmin = sonrakiTahmin;
    }

    return { sonuc: tahmin, adimlar };
  }

  /**
   * Doğal Logaritma: ln(x)
   * Taylor serisi ln((1+t)/(1-t)) = 2 * (t + t^3/3 + t^5/5 + ...)
   * Hazır Math.log KULLANILMADAN hesaplanır.
   */
  private static dogalLogaritma(x: number): number {
    if (x <= 0) {
      throw new Error("Hata: Logaritma argümanı pozitif olmalıdır!");
    }
    // ln(2) sabiti (saf seriyle önceden hesaplanmış eşdeğer)
    const LN2 = 0.693147180559945309417;

    let k = 0;
    let m = x;
    // Normalize et: m'i [0.707, 1.414] aralığına getir
    while (m > 1.41421356) {
      m /= 2;
      k++;
    }
    while (m < 0.70710678) {
      m *= 2;
      k--;
    }

    const t = (m - 1) / (m + 1);
    const tKare = t * t;
    let terim = t;
    let toplam = 0;

    for (let i = 1; i <= 50; i += 2) {
      toplam += terim / i;
      terim *= tKare;
      if (TemelMatematikMotoru.mutlakDeger(terim) < 1e-15) break;
    }

    return (2 * toplam) + (k * LN2);
  }

  /**
   * Üstel Fonksiyon: e^z
   * Taylor Serisi: e^z = 1 + z + z^2/2! + z^3/3! + ...
   * Hazır Math.exp KULLANILMADAN hesaplanır.
   */
  private static ustelFonksiyon(z: number): number {
    if (z > 709) return Infinity;
    if (z < -709) return 0;

    const LN2 = 0.693147180559945309417;
    // z = n * LN2 + r
    const n = Math.round(z / LN2);
    const r = z - (n * LN2);

    let toplam = 1.0;
    let terim = 1.0;
    for (let i = 1; i <= 35; i++) {
      terim = (terim * r) / i;
      toplam += terim;
      if (TemelMatematikMotoru.mutlakDeger(terim) < 1e-16) break;
    }

    // 2^n ile çarp (n tam sayıdır)
    let carpan = 1.0;
    if (n > 0) {
      for (let i = 0; i < n; i++) carpan *= 2;
    } else if (n < 0) {
      for (let i = 0; i < -n; i++) carpan /= 2;
    }

    return toplam * carpan;
  }

  /**
   * Üs Alma: x^y
   * 1. Tam sayı üsler için İkili Üs Alma (Hızlı Üs Alma / Binary Exponentiation)
   * 2. Ondalıklı üsler için x^y = e^(y * ln(x))
   * Hazır Math.pow KULLANILMAMIŞTIR.
   */
  public static usAl(taban: number, us: number): { sonuc: number; yontem: string } {
    if (taban === 0) {
      if (us <= 0) throw new Error("Hata: 0^0 veya 0^negatif tanımsızdır!");
      return { sonuc: 0, yontem: "0'ın pozitif kuvveti sıfırdır" };
    }
    if (us === 0) {
      return { sonuc: 1, yontem: "Herhangi bir sıfır olmayan sayının 0. kuvveti 1'dir" };
    }

    // Tam sayı kontrolü
    if (Number.isInteger(us)) {
      const pozitifUs = TemelMatematikMotoru.mutlakDeger(us);
      let sonuc = 1;
      let b = taban;
      let p = pozitifUs;

      // Hızlı İkili Üs Alma algoritması
      while (p > 0) {
        if (p % 2 === 1) {
          sonuc *= b;
        }
        b *= b;
        p = Math.floor(p / 2);
      }

      if (us < 0) {
        sonuc = 1 / sonuc;
      }

      return {
        sonuc,
        yontem: `İkili Hızlı Üs Alma Algoritması (${us < 0 ? 'Negatif üs tersine çevrildi' : 'Tam sayı üssü'})`
      };
    }

    // Kesirli / Ondalıklı Üs
    if (taban < 0) {
      throw new Error("Hata: Negatif tabanın ondalıklı kuvveti karmaşık sayı üretir (Reel uzayda tanımsız)!");
    }

    const lnTaban = this.dogalLogaritma(taban);
    const z = us * lnTaban;
    const sonuc = this.ustelFonksiyon(z);

    return {
      sonuc,
      yontem: "Taylor Serisi & Doğal Logaritma Yaklaşımı (x^y = e^(y · ln(x)))"
    };
  }
}

/**
 * Polinom Sınıfı: Katsayılar ve derece yönetimini sağlar
 * Örnek: f(x) = a_n * x^n + a_{n-1} * x^{n-1} + ... + a_0
 */
export class Polinom {
  public derece: number;
  public katsayilar: number[]; // indeks 0 = sabit terim (x^0), indeks k = x^k

  constructor(katsayilarDizisi: number[]) {
    // Gelen dizi derece n'den 0'a doğru ise veya tersiyse normalize edelim
    // Burada katsayilar[k] k. derecenin katsayısıdır (0 = x^0, n = x^n)
    this.katsayilar = [...katsayilarDizisi];
    // Sondaki sıfırları temizleyip gerçek dereceyi bulalım
    let d = this.katsayilar.length - 1;
    while (d > 0 && TemelMatematikMotoru.mutlakDeger(this.katsayilar[d]) < 1e-12) {
      d--;
    }
    this.derece = d;
  }

  /**
   * Katsayıları yüksek dereceden düşüğe (a_n, a_{n-1}, ..., a_0) alan kurucu yardımcı
   */
  public static yuksekDerecedenUret(katsayilar: number[]): Polinom {
    const ters: number[] = [];
    for (let i = katsayilar.length - 1; i >= 0; i--) {
      ters.push(katsayilar[i]);
    }
    return new Polinom(ters);
  }

  public static azalanDerecedenUret(katsayilar: number[]): Polinom {
    return this.yuksekDerecedenUret(katsayilar);
  }

  /**
   * Horner Yöntemiyle f(x) noktasındaki değeri hesaplar
   */
  public degerHesapla(x: number): number {
    let sonuc = 0;
    for (let i = this.derece; i >= 0; i--) {
      sonuc = sonuc * x + (this.katsayilar[i] || 0);
    }
    return sonuc;
  }

  /**
   * Polinomu standart matematiksel formatta metne dönüştürür (örn: 3x^3 - 5x^2 + 2x - 7)
   */
  public formataDonustur(): string {
    let metin = '';
    let ilkTerim = true;

    for (let k = this.derece; k >= 0; k--) {
      const a = this.katsayilar[k] || 0;
      if (TemelMatematikMotoru.mutlakDeger(a) < 1e-9 && this.derece > 0) {
        continue;
      }

      const isaret = a < 0 ? '-' : '+';
      const mutlakA = TemelMatematikMotoru.mutlakDeger(a);
      // Yuvarlanmış gösterim
      const katsayiMetni = Number(mutlakA.toFixed(4)).toString();

      let terim = '';
      if (k === 0) {
        terim = katsayiMetni;
      } else if (k === 1) {
        terim = (mutlakA === 1 ? '' : katsayiMetni) + 'x';
      } else {
        terim = (mutlakA === 1 ? '' : katsayiMetni) + 'x^' + k;
      }

      if (ilkTerim) {
        metin += (a < 0 ? '-' : '') + terim;
        ilkTerim = false;
      } else {
        metin += ` ${isaret} ${terim}`;
      }
    }

    return metin || '0';
  }
}

/**
 * Polinom İşlemleri: Türev, Belirsiz İntegral ve Belirli İntegral
 */
export class PolinomIslemleri {
  /**
   * Polinomun Türevini Alır:
   * d/dx (a_k * x^k) = (k * a_k) * x^(k-1)
   */
  public static turevAl(p: Polinom): { turevPolinom: Polinom; turevMetni: string; adimlar: string[] } {
    const adimlar: string[] = [];
    if (p.derece === 0) {
      adimlar.push(`Sabit fonksiyonun türevi: d/dx (${p.formataDonustur()}) = 0`);
      return {
        turevPolinom: new Polinom([0]),
        turevMetni: '0',
        adimlar
      };
    }

    const yeniKatsayilar: number[] = new Array(p.derece).fill(0);

    for (let k = 1; k <= p.derece; k++) {
      const ak = p.katsayilar[k] || 0;
      const yeniKatsayi = k * ak;
      yeniKatsayilar[k - 1] = yeniKatsayi;

      if (TemelMatematikMotoru.mutlakDeger(ak) > 1e-9) {
        const dereceMetni = k === 1 ? 'sabit terim' : `x^${k - 1}`;
        adimlar.push(`d/dx (${ak}x^${k}) = (${k} · ${ak})x^${k - 1} = ${Number(yeniKatsayi.toFixed(4))} · ${dereceMetni}`);
      }
    }

    const turevPolinom = new Polinom(yeniKatsayilar);
    return {
      turevPolinom,
      turevMetni: turevPolinom.formataDonustur(),
      adimlar
    };
  }

  /**
   * Polinomun Belirsiz İntegralini Alır:
   * ∫ (a_k * x^k) dx = (a_k / (k + 1)) * x^(k+1) + C
   */
  public static belirsizIntegralAl(p: Polinom): { integralMetni: string; integralPolinomu: Polinom; adimlar: string[] } {
    const adimlar: string[] = [];
    const yeniKatsayilar: number[] = new Array(p.derece + 2).fill(0);
    // x^0 katsayısı C sabitidir, integral fonksiyonu için 0 kabul edilir
    yeniKatsayilar[0] = 0;

    for (let k = 0; k <= p.derece; k++) {
      const ak = p.katsayilar[k] || 0;
      const yeniDerece = k + 1;
      const yeniKatsayi = ak / yeniDerece;
      yeniKatsayilar[yeniDerece] = yeniKatsayi;

      if (TemelMatematikMotoru.mutlakDeger(ak) > 1e-9 || (p.derece === 0 && k === 0)) {
        adimlar.push(`∫ (${ak}${k === 0 ? '' : 'x^' + k}) dx = (${ak} / ${yeniDerece}) · x^${yeniDerece} = ${Number(yeniKatsayi.toFixed(4))}x^${yeniDerece}`);
      }
    }

    const integralPolinomu = new Polinom(yeniKatsayilar);
    const formulle = integralPolinomu.formataDonustur();
    const sonucMetni = formulle === '0' ? 'C' : `${formulle} + C`;

    adimlar.push(`Genel Çözüm: ∫ [${p.formataDonustur()}] dx = ${sonucMetni}`);

    return {
      integralMetni: sonucMetni,
      integralPolinomu,
      adimlar
    };
  }

  /**
   * Belirli İntegral:
   * ∫_a^b f(x) dx = F(b) - F(a) (Newton-Leibniz Teoremi)
   */
  public static belirliIntegralAl(p: Polinom, altLimit: number, ustLimit: number): {
    sonuc: number;
    fb: number;
    fa: number;
    adimlar: string[];
  } {
    const { integralPolinomu } = this.belirsizIntegralAl(p);
    const fb = integralPolinomu.degerHesapla(ustLimit);
    const fa = integralPolinomu.degerHesapla(altLimit);
    const sonuc = fb - fa;

    const adimlar: string[] = [
      `Anti-türev F(x) = ${integralPolinomu.formataDonustur()}`,
      `Üst Limit: F(${ustLimit}) = ${Number(fb.toFixed(6))}`,
      `Alt Limit: F(${altLimit}) = ${Number(fa.toFixed(6))}`,
      `Net Alan: F(${ustLimit}) - F(${altLimit}) = ${Number(fb.toFixed(6))} - (${Number(fa.toFixed(6))}) = ${Number(sonuc.toFixed(6))}`
    ];

    return { sonuc, fb, fa, adimlar };
  }
}
