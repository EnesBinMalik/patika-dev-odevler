export interface CodeExample {
  language: string;
  id: string;
  filename: string;
  description: string;
  code: string;
}

export const codeExamples: CodeExample[] = [
  {
    id: 'typescript',
    language: 'TypeScript',
    filename: 'Sekiller.ts',
    description: 'Tip güvenli, abstract sınıflı modern TypeScript çözümü',
    code: `/**
 * Ödev: Nesne Yönelimli Programlama (OOP) - Geometrik Şekiller
 * Yazar: Enes Öztürk
 *
 * MİMARİ NOT:
 * - 'Sekil' soyut (abstract) temel sınıftır.
 * - 'Dikdortgen' Sekil'den türer; alan ve çevreyi hesaplar.
 * - 'Kare', doğrudan 'Dikdortgen' sınıfından türetilmiştir (Kare bir Dikdörtgendir).
 *   Böylece alanHesapla() ve cevreHesapla() metotları SIFIR KOD TEKRARI ile miras alınır!
 * - 'Ucgen' Sekil'den türer; Heron formülü ile alan hesaplar.
 */

// 1. Temel Soyut Sınıf
export abstract class Sekil {
  readonly isim: string;

  constructor(isim: string) {
    this.isim = isim;
  }

  abstract alanHesapla(): number;
  abstract cevreHesapla(): number;

  bilgiVer(): string {
    return \`\${this.isim} [Alan: \${this.alanHesapla().toFixed(2)}, Çevre: \${this.cevreHesapla().toFixed(2)}]\`;
  }
}

// 2. Dikdörtgen Sınıfı (Sekil'den türer)
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

// 3. Kare Sınıfı (Dikdortgen'den türer - EN AZ KOD YAZMA MANTIĞI)
export class Kare extends Dikdortgen {
  constructor(kenar: number) {
    // Dikdortgen kurucusuna her iki kenar için 'kenar' verilir.
    // alanHesapla ve cevreHesapla metotlarını yeniden yazmaya gerek kalmaz!
    super(kenar, kenar, 'Kare');
  }

  get kenar(): number {
    return this.genislik;
  }

  set kenar(deger: number) {
    this.genislik = deger;
    this.yukseklik = deger;
  }
}

// 4. Üçgen Sınıfı (Sekil'den türer)
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

  gecerliMi(): boolean {
    return (
      this.a + this.b > this.c &&
      this.a + this.c > this.b &&
      this.b + this.c > this.a
    );
  }

  cevreHesapla(): number {
    return this.a + this.b + this.c;
  }

  // Heron Formülü: u = Çevre / 2, Alan = sqrt(u*(u-a)*(u-b)*(u-c))
  alanHesapla(): number {
    if (!this.gecerliMi()) return 0;
    const u = this.cevreHesapla() / 2;
    return Math.sqrt(u * (u - this.a) * (u - this.b) * (u - this.c));
  }
}

// --- TEST VE POLİMORFİZM KULLANIMI ---
// Hazırlayan: Enes Öztürk
const sekiller: Sekil[] = [
  new Dikdortgen(5, 10),
  new Kare(6),
  new Ucgen(3, 4, 5)
];

sekiller.forEach(s => console.log(s.bilgiVer()));
`
  },
  {
    id: 'javascript',
    language: 'JavaScript (ES6)',
    filename: 'sekiller.js',
    description: 'Modern ES6 Sınıfları ile temiz ve yalın uygulama',
    code: `/**
 * Ödev: Geometrik Şekiller OOP Uygulaması
 * Yazar: Enes Öztürk
 */

// 1. Temel Sınıf
class Sekil {
  constructor(isim) {
    if (this.constructor === Sekil) {
      throw new Error("Soyut sınıf Sekil doğrudan örneklendirilemez.");
    }
    this.isim = isim;
  }

  alanHesapla() {
    throw new Error("alanHesapla() metodu alt sınıfta uygulanmalıdır.");
  }

  cevreHesapla() {
    throw new Error("cevreHesapla() metodu alt sınıfta uygulanmalıdır.");
  }

  bilgiVer() {
    return \`\${this.isim} -> Alan: \${this.alanHesapla().toFixed(2)}, Çevre: \${this.cevreHesapla().toFixed(2)}\`;
  }
}

// 2. Dikdörtgen Sınıfı
class Dikdortgen extends Sekil {
  constructor(genislik, yukseklik, isim = "Dikdörtgen") {
    super(isim);
    this.genislik = genislik;
    this.yukseklik = yukseklik;
  }

  alanHesapla() {
    return this.genislik * this.yukseklik;
  }

  cevreHesapla() {
    return 2 * (this.genislik + this.yukseklik);
  }
}

// 3. Kare Sınıfı (Dikdortgen'den türer - Kod tekrarını önler)
class Kare extends Dikdortgen {
  constructor(kenar) {
    // Kare bir dikdörtgendir; genislik = yukseklik = kenar
    super(kenar, kenar, "Kare");
  }
}

// 4. Üçgen Sınıfı (Heron Formülü ile)
class Ucgen extends Sekil {
  constructor(a, b, c) {
    super("Üçgen");
    this.a = a;
    this.b = b;
    this.c = c;
  }

  cevreHesapla() {
    return this.a + this.b + this.c;
  }

  alanHesapla() {
    const u = this.cevreHesapla() / 2;
    const carpim = u * (u - this.a) * (u - this.b) * (u - this.c);
    return carpim > 0 ? Math.sqrt(carpim) : 0;
  }
}

// Test / Enes Öztürk
const d = new Dikdortgen(4, 7);
const k = new Kare(5);
const u = new Ucgen(3, 4, 5);

console.log(d.bilgiVer()); // Alan: 28, Çevre: 22
console.log(k.bilgiVer()); // Alan: 25, Çevre: 20
console.log(u.bilgiVer()); // Alan: 6, Çevre: 12
`
  },
  {
    id: 'python',
    language: 'Python',
    filename: 'sekiller.py',
    description: 'Python abc modülü ile soyut sınıf ve kalıtım',
    code: `"""
Ödev: Geometrik Şekiller OOP Sınıfları
Yazar: Enes Öztürk
Açıklama: En az kod prensibiyle Kare'nin Dikdortgen'den türetilmesi
"""
from abc import ABC, abstractmethod
import math

class Sekil(ABC):
    def __init__(self, isim: str):
        self.isim = isim

    @abstractmethod
    def alan_hesapla(self) -> float:
        pass

    @abstractmethod
    def cevre_hesapla(self) -> float:
        pass

    def bilgi_ver(self) -> str:
        return f"{self.isim} -> Alan: {self.alan_hesapla():.2f}, Çevre: {self.cevre_hesapla():.2f}"


class Dikdortgen(Sekil):
    def __init__(self, genislik: float, yukseklik: float, isim: str = "Dikdörtgen"):
        super().__init__(isim)
        self.genislik = genislik
        self.yukseklik = yukseklik

    def alan_hesapla(self) -> float:
        return self.genislik * self.yukseklik

    def cevre_hesapla(self) -> float:
        return 2 * (self.genislik + self.yukseklik)


class Kare(Dikdortgen):
    """
    Kare, Dikdortgen'den türer.
    Böylece alan_hesapla ve cevre_hesapla fonksiyonlarını
    tekrar yazmaya gerek kalmaz (DRY Prensibi).
    """
    def __init__(self, kenar: float):
        super().__init__(kenar, kenar, "Kare")


class Ucgen(Sekil):
    def __init__(self, a: float, b: float, c: float):
        super().__init__("Üçgen")
        self.a = a
        self.b = b
        self.c = c

    def cevre_hesapla(self) -> float:
        return self.a + self.b + self.c

    def alan_hesapla(self) -> float:
        # Heron Formülü
        u = self.cevre_hesapla() / 2
        carpim = u * (u - self.a) * (u - self.b) * (u - self.c)
        return math.sqrt(carpim) if carpim > 0 else 0


# Test / Enes Öztürk
if __name__ == "__main__":
    sekiller = [
        Dikdortgen(6, 8),
        Kare(5),
        Ucgen(3, 4, 5)
    ]
    for s in sekiller:
        print(s.bilgi_ver())
`
  },
  {
    id: 'java',
    language: 'Java',
    filename: 'Sekil.java',
    description: 'Klasik Nesne Yönelimli Programlama ve Polimorfizm',
    code: `/**
 * Ödev: Geometrik Şekiller OOP Sınıf Yapısı
 * Yazar: Enes Öztürk
 */

// 1. Soyut Üst Sınıf
public abstract class Sekil {
    protected String isim;

    public Sekil(String isim) {
        this.isim = isim;
    }

    public abstract double alanHesapla();
    public abstract double cevreHesapla();

    public void bilgiYazdir() {
        System.out.printf("%s -> Alan: %.2f, Çevre: %.2f%n", isim, alanHesapla(), cevreHesapla());
    }
}

// 2. Dikdörtgen Sınıfı
class Dikdortgen extends Sekil {
    protected double genislik;
    protected double yukseklik;

    public Dikdortgen(double genislik, double yukseklik) {
        super("Dikdörtgen");
        this.genislik = genislik;
        this.yukseklik = yukseklik;
    }

    protected Dikdortgen(double genislik, double yukseklik, String ozelIsim) {
        super(ozelIsim);
        this.genislik = genislik;
        this.yukseklik = yukseklik;
    }

    @Override
    public double alanHesapla() {
        return genislik * yukseklik;
    }

    @Override
    public double cevreHesapla() {
        return 2 * (genislik + yukseklik);
    }
}

// 3. Kare Sınıfı (Dikdortgen'den türer: En az kod!)
class Kare extends Dikdortgen {
    public Kare(double kenar) {
        super(kenar, kenar, "Kare");
    }
}

// 4. Üçgen Sınıfı (Heron Formülü)
class Ucgen extends Sekil {
    private double a, b, c;

    public Ucgen(double a, double b, double c) {
        super("Üçgen");
        this.a = a;
        this.b = b;
        this.c = c;
    }

    @Override
    public double cevreHesapla() {
        return a + b + c;
    }

    @Override
    public double alanHesapla() {
        double u = cevreHesapla() / 2.0;
        return Math.sqrt(u * (u - a) * (u - b) * (u - c));
    }
}
`
  },
  {
    id: 'csharp',
    language: 'C#',
    filename: 'Sekiller.cs',
    description: 'C# .NET nesne yönelimli miras ve polimorfizm',
    code: `/**
 * Ödev: Geometrik Şekiller OOP Sınıfları
 * Yazar: Enes Öztürk
 */
using System;
using System.Collections.Generic;

public abstract class Sekil
{
    public string Isim { get; }

    protected Sekil(string isim) => Isim = isim;

    public abstract double AlanHesapla();
    public abstract double CevreHesapla();

    public void BilgiYazdir() =>
        Console.WriteLine($"{Isim} -> Alan: {AlanHesapla():F2}, Çevre: {CevreHesapla():F2}");
}

public class Dikdortgen : Sekil
{
    public double Genislik { get; set; }
    public double Yukseklik { get; set; }

    public Dikdortgen(double genislik, double yukseklik, string isim = "Dikdörtgen") : base(isim)
    {
        Genislik = genislik;
        Yukseklik = yukseklik;
    }

    public override double AlanHesapla() => Genislik * Yukseklik;
    public override double CevreHesapla() => 2 * (Genislik + Yukseklik);
}

// Kare doğrudan Dikdortgen'den türer; metotlar tekrar yazılmaz!
public class Kare : Dikdortgen
{
    public Kare(double kenar) : base(kenar, kenar, "Kare") { }
}

public class Ucgen : Sekil
{
    public double A { get; }
    public double B { get; }
    public double C { get; }

    public Ucgen(double a, double b, double c) : base("Üçgen")
    {
        A = a; B = b; C = c;
    }

    public override double CevreHesapla() => A + B + C;

    public override double AlanHesapla()
    {
        double u = CevreHesapla() / 2;
        return Math.Sqrt(u * (u - A) * (u - B) * (u - C));
    }
}
`
  }
];
