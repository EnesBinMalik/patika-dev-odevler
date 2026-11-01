/**
 * Ödev: Nesne Yönelimli Programlama (OOP) - Geometrik Şekiller Sınıf Hiyerarşisi
 * Yazar: Enes Öztürk
 *
 * MİMARİ KARAR VE EN AZ KOD PRENSİBİ (DRY - Don't Repeat Yourself):
 * 1. Sekil (Soyut Üst Sınıf): Tüm şekillerin ortak adı ve soyut (abstract) alan/çevre metotlarını tanımlar.
 * 2. Dikdortgen (Sekil'den türer): İki kenar (genislik ve yukseklik) alır.
 *    - Alan = genislik * yukseklik
 *    - Çevre = 2 * (genislik + yukseklik)
 * 3. Kare (Dikdortgen'den türer!):
 *    - Kare, matematiksel ve nesne yönelimli olarak tüm kenarları eşit özel bir dikdörtgendir!
 *    - Bu yüzden 'Sekil' yerine doğrudan 'Dikdortgen' sınıfından türetilmiştir.
 *    - super(kenar, kenar) çağrısı ile alanHesapla() ve cevreHesapla() metotlarını TEKRAR YAZMAYA GEREK KALMAZ!
 *    - Böylece en mantıklı yoldan ve en az kodla tam çözüm elde edilir.
 * 4. Ucgen (Sekil'den türer): Üç kenar (a, b, c) ile tanımlanır.
 *    - Çevre = a + b + c
 *    - Alan = Heron Formülü ile (u = Çevre / 2, Alan = √(u*(u-a)*(u-b)*(u-c)))
 */

export abstract class Sekil {
  readonly isim: string;

  constructor(isim: string) {
    this.isim = isim;
  }

  /**
   * Şeklin alanını hesaplar
   */
  abstract alanHesapla(): number;

  /**
   * Şeklin çevresini hesaplar
   */
  abstract cevreHesapla(): number;

  /**
   * Şeklin özet bilgisini döndürür
   */
  bilgiVer(): string {
    return `${this.isim} -> Alan: ${this.alanHesapla().toFixed(2)}, Çevre: ${this.cevreHesapla().toFixed(2)}`;
  }
}

export class Dikdortgen extends Sekil {
  genislik: number;
  yukseklik: number;

  constructor(genislik: number, yukseklik: number, isim = 'Dikdörtgen') {
    super(isim);
    this.genislik = Math.max(0, genislik);
    this.yukseklik = Math.max(0, yukseklik);
  }

  alanHesapla(): number {
    return this.genislik * this.yukseklik;
  }

  cevreHesapla(): number {
    return 2 * (this.genislik + this.yukseklik);
  }
}

/**
 * Kare, Dikdortgen sınıfından türetilir.
 * Bu sayede alanHesapla ve cevreHesapla metotları yeniden yazılmaz,
 * sadece constructor içinde super(kenar, kenar) çağrısı yapılır.
 * "En mantıklı ve en az kod" yaklaşımı tam olarak budur.
 */
export class Kare extends Dikdortgen {
  constructor(kenar: number) {
    super(kenar, kenar, 'Kare');
  }

  get kenar(): number {
    return this.genislik;
  }

  set kenar(deger: number) {
    const val = Math.max(0, deger);
    this.genislik = val;
    this.yukseklik = val;
  }
}

export class Ucgen extends Sekil {
  a: number;
  b: number;
  c: number;

  constructor(a: number, b: number, c: number) {
    super('Üçgen');
    this.a = Math.max(0, a);
    this.b = Math.max(0, b);
    this.c = Math.max(0, c);
  }

  /**
   * Üçgen eşitsizliği kuralını kontrol eder:
   * Herhangi bir kenar diğer iki kenarın toplamından küçük, farkından büyük olmalıdır.
   */
  gecerliMi(): boolean {
    if (this.a <= 0 || this.b <= 0 || this.c <= 0) return false;
    return (
      this.a + this.b > this.c &&
      this.a + this.c > this.b &&
      this.b + this.c > this.a
    );
  }

  cevreHesapla(): number {
    return this.a + this.b + this.c;
  }

  /**
   * Heron Formülü ile alan hesabı:
   * u = (a + b + c) / 2  (yarı çevre)
   * Alan = √(u * (u - a) * (u - b) * (u - c))
   */
  alanHesapla(): number {
    if (!this.gecerliMi()) return 0;
    const u = this.cevreHesapla() / 2;
    const carpim = u * (u - this.a) * (u - this.b) * (u - this.c);
    return Math.sqrt(Math.max(0, carpim));
  }

  /**
   * Üçgen türünü belirler (Eşkenar, İkizkenar, Çeşitkenar, Dik)
   */
  turBelirle(): string {
    if (!this.gecerliMi()) return 'Geçersiz Üçgen';

    const kenarlar = [this.a, this.b, this.c].sort((x, y) => x - y);
    const dikUcgenMi = Math.abs(kenarlar[0] ** 2 + kenarlar[1] ** 2 - kenarlar[2] ** 2) < 0.001;

    if (this.a === this.b && this.b === this.c) {
      return 'Eşkenar Üçgen';
    }
    if (this.a === this.b || this.b === this.c || this.a === this.c) {
      return dikUcgenMi ? 'İkizkenar Dik Üçgen' : 'İkizkenar Üçgen';
    }
    if (dikUcgenMi) {
      return 'Çeşitkenar Dik Üçgen';
    }
    return 'Çeşitkenar Üçgen';
  }
}
