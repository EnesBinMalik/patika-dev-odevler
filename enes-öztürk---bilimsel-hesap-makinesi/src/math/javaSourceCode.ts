/**
 * ENES ÖZTÜRK İMZALI JAVA KAYNAK KODLARI
 * Nesne Yönelimli Programlama (OOP) Prensipleriyle Hazırlanmıştır.
 * Math vb. Hazır Kütüphaneler KULLANILMAMIŞTIR.
 */

export interface JavaFile {
  filename: string;
  description: string;
  category: 'temel' | 'ileri' | 'polinom' | 'yonetici' | 'main' | 'tek-dosya';
  code: string;
}

export const JAVA_FILES: JavaFile[] = [
  {
    filename: "TemelMatematik.java",
    description: "4 temel işlem, mod alma ve mutlak değer hesaplama metotlarını içeren temel sınıf.",
    category: "temel",
    code: `/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: Temel Matematik İşlemleri
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class TemelMatematik {

    /**
     * İki sayının toplamını hesaplar.
     * @param a Birinci toplanan
     * @param b İkinci toplanan
     * @return Toplam sonucu
     */
    public double topla(double a, double b) {
        return a + b;
    }

    /**
     * İki sayının farkını hesaplar.
     * @param a Eksilen
     * @param b Çıkan
     * @return Fark sonucu
     */
    public double cikar(double a, double b) {
        return a - b;
    }

    /**
     * İki sayının çarpımını hesaplar.
     * @param a Birinci çarpan
     * @param b İkinci çarpan
     * @return Çarpım sonucu
     */
    public double carp(double a, double b) {
        return a * b;
    }

    /**
     * İki sayının bölme işlemini gerçekleştirir.
     * Sıfıra bölme durumunda özel ArithmeticException fırlatır.
     * @param a Bölünen
     * @param b Bölen
     * @return Bölüm sonucu
     */
    public double bol(double a, double b) {
        if (b == 0.0) {
            throw new ArithmeticException("Matematik Hatası: Bir sayı sıfıra (0) bölünemez!");
        }
        return a / b;
    }

    /**
     * Mutlak Değer Hesaplama:
     * Hazır Math.abs metodu KULLANILMAMIŞTIR.
     * Sayı negatifse -1 ile çarpılır, değilse aynen döner.
     * @param x Girdi sayısı
     * @return Pozitif mutlak değer
     */
    public double mutlakDeger(double x) {
        return (x < 0) ? -x : x;
    }

    /**
     * Mod Alma İşlemi: a mod b
     * Hazır fonksiyon kullanılmadan tam sayı bölümü yöntemiyle (truncation) hesaplanır:
     * kalan = a - (⌊a / b⌋ * b)
     * @param a Bölünen
     * @param b Bölen (modulus)
     * @return Kalan sonuç
     */
    public double modAl(double a, double b) {
        if (b == 0.0) {
            throw new ArithmeticException("Matematik Hatası: Mod böleni sıfır olamaz!");
        }
        long bolum = (long) (a / b);
        double kalan = a - (bolum * b);
        // Çok küçük kayan nokta hassasiyet sapmalarını sıfırlar
        return (mutlakDeger(kalan) < 1e-12) ? 0.0 : kalan;
    }
}`
  },
  {
    filename: "IleriMatematik.java",
    description: "Üs alma, Newton-Raphson karekök ve faktöriyel algoritmaları (Math kütüphanesiz).",
    category: "ileri",
    code: `/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: İleri Matematik (Üs, Karekök, Faktöriyel)
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class IleriMatematik {

    private final TemelMatematik temel = new TemelMatematik();

    /**
     * Faktöriyel Hesaplama: n! = 1 * 2 * 3 * ... * n
     * 0! = 1 ve 1! = 1 olarak tanımlıdır. Negatif sayılar tanımsızdır.
     * @param n Faktöriyeli alınacak pozitif tam sayı
     * @return Faktöriyel sonucu
     */
    public long faktoriyel(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("Hata: Negatif sayıların faktöriyeli tanımsızdır!");
        }
        if (n > 20) {
            throw new ArithmeticException("Hata: 20'den büyük sayılar 64-bit long sınırını aşar!");
        }
        long sonuc = 1;
        for (int i = 2; i <= n; i++) {
            sonuc *= i;
        }
        return sonuc;
    }

    /**
     * Karekök Alma Algoritması: Newton-Raphson (Babil Yöntemi)
     * Hazır Math.sqrt KULLANILMAMIŞTIR.
     * Yineleme Formülü: x_{n+1} = 0.5 * (x_n + S / x_n)
     * Yakınsama hassasiyeti: 1e-14
     * @param sayi Karekökü alınacak reel sayı
     * @return Hesaplanmış karekök değeri
     */
    public double karekok(double sayi) {
        if (sayi < 0) {
            throw new ArithmeticException("Hata: Negatif sayıların reel karekökü tanımsızdır!");
        }
        if (sayi == 0.0) {
            return 0.0;
        }

        // Başlangıç tahmini (x_0)
        double tahmin = (sayi > 1.0) ? (sayi / 2.0) : 1.0;
        double epsilon = 1e-14;
        int maxIterasyon = 100;
        int adim = 0;

        while (adim < maxIterasyon) {
            double sonrakiTahmin = 0.5 * (tahmin + (sayi / tahmin));
            double fark = temel.mutlakDeger(sonrakiTahmin - tahmin);

            if (fark <= epsilon) {
                return sonrakiTahmin;
            }
            tahmin = sonrakiTahmin;
            adim++;
        }
        return tahmin;
    }

    /**
     * Üs Alma: x^y
     * Tam sayı üsler için İkili Hızlı Üs Alma (Binary Exponentiation),
     * Ondalıklı üsler için Taylor serisi doğal logaritma ve üstel fonksiyon kullanılır.
     * Hazır Math.pow KULLANILMAMIŞTIR.
     * @param taban Taban sayısı (x)
     * @param us Üs kuvveti (y)
     * @return x^y değeri
     */
    public double usAl(double taban, double us) {
        if (taban == 0.0) {
            if (us <= 0.0) throw new ArithmeticException("Hata: 0^0 veya 0^negatif tanımsızdır!");
            return 0.0;
        }
        if (us == 0.0) {
            return 1.0;
        }

        // Eğer üs bir tam sayı ise hızlı ikili üs alma uygula
        if (us == (long) us) {
            long p = (long) temel.mutlakDeger(us);
            double sonuc = 1.0;
            double b = taban;

            while (p > 0) {
                if (p % 2 == 1) {
                    sonuc *= b;
                }
                b *= b;
                p /= 2;
            }

            return (us < 0) ? (1.0 / sonuc) : sonuc;
        }

        // Ondalıklı üs durumu: x^y = e^(y * ln(x))
        if (taban < 0) {
            throw new ArithmeticException("Hata: Negatif tabanın ondalıklı üssü reel sayılar kümesinde tanımsızdır!");
        }

        double lnTaban = dogalLogaritma(taban);
        return ustelFonksiyon(us * lnTaban);
    }

    /**
     * Saf Taylor serisi ile doğal logaritma ln(x)
     * Hazır Math.log KULLANILMAMIŞTIR.
     */
    private double dogalLogaritma(double x) {
        if (x <= 0) {
            throw new ArithmeticException("Hata: Logaritma argümanı pozitif olmalıdır!");
        }
        double LN2 = 0.6931471805599453;
        int k = 0;
        double m = x;
        while (m > 1.41421356) {
            m /= 2.0;
            k++;
        }
        while (m < 0.70710678) {
            m *= 2.0;
            k--;
        }

        double t = (m - 1.0) / (m + 1.0);
        double tKare = t * t;
        double terim = t;
        double toplam = 0.0;

        for (int i = 1; i <= 50; i += 2) {
            toplam += terim / i;
            terim *= tKare;
            if (temel.mutlakDeger(terim) < 1e-15) break;
        }

        return (2.0 * toplam) + (k * LN2);
    }

    /**
     * Saf Taylor serisi ile e^z üstel fonksiyonu
     * Hazır Math.exp KULLANILMAMIŞTIR.
     */
    private double ustelFonksiyon(double z) {
        double LN2 = 0.6931471805599453;
        long n = (long) (z / LN2 + (z >= 0 ? 0.5 : -0.5));
        double r = z - (n * LN2);

        double toplam = 1.0;
        double terim = 1.0;
        for (int i = 1; i <= 35; i++) {
            terim = (terim * r) / i;
            toplam += terim;
            if (temel.mutlakDeger(terim) < 1e-16) break;
        }

        double carpan = 1.0;
        if (n > 0) {
            for (int i = 0; i < n; i++) carpan *= 2.0;
        } else if (n < 0) {
            for (int i = 0; i < -n; i++) carpan /= 2.0;
        }

        return toplam * carpan;
    }
}`
  },
  {
    filename: "Polinom.java",
    description: "Polinom veri yapısını, katsayıları, dereceyi ve değer hesaplamayı yöneten model sınıfı.",
    category: "polinom",
    code: `/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: Polinom Nesne Modeli
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class Polinom {

    private final int derece;
    // katsayilar[k] = x^k teriminin katsayısı (0 <= k <= derece)
    private final double[] katsayilar;

    /**
     * Polinom Kurucusu
     * @param katsayilarArtanDerece x^0, x^1, x^2, ..., x^n sırasındaki katsayılar
     */
    public Polinom(double[] katsayilarArtanDerece) {
        int d = katsayilarArtanDerece.length - 1;
        // Gereksiz yüksek dereceli sıfırları ayıkla
        while (d > 0 && katsayilarArtanDerece[d] == 0.0) {
            d--;
        }
        this.derece = d;
        this.katsayilar = new double[this.derece + 1];
        System.arraycopy(katsayilarArtanDerece, 0, this.katsayilar, 0, this.derece + 1);
    }

    /**
     * Kullanıcıdan gelen azalan derece sırasındaki (a_n, a_{n-1}, ..., a_0) katsayılarla nesne üretir.
     */
    public static Polinom azalanDerecedenUret(double[] katsayilarAzalan) {
        int len = katsayilarAzalan.length;
        double[] ters = new double[len];
        for (int i = 0; i < len; i++) {
            ters[i] = katsayilarAzalan[len - 1 - i];
        }
        return new Polinom(ters);
    }

    public int getDerece() {
        return derece;
    }

    public double getKatsayi(int k) {
        if (k < 0 || k >= katsayilar.length) return 0.0;
        return katsayilar[k];
    }

    public double[] getKatsayilarDizisi() {
        return katsayilar.clone();
    }

    /**
     * Horner Yöntemiyle Verilen x Noktasındaki f(x) Değerini Bulur.
     * @param x Değerlendirme noktası
     * @return f(x)
     */
    public double degerHesapla(double x) {
        double sonuc = 0.0;
        for (int i = derece; i >= 0; i--) {
            sonuc = (sonuc * x) + katsayilar[i];
        }
        return sonuc;
    }

    /**
     * Polinomu Cebirsel Metin Biçiminde Biçimlendirir (Örn: 3.0x^3 - 5.0x^2 + 2.0x - 7.0)
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        boolean ilkTerim = true;

        for (int k = derece; k >= 0; k--) {
            double a = katsayilar[k];
            if (a == 0.0 && derece > 0) continue;

            double mutlakA = (a < 0) ? -a : a;
            String katsayiMetni = String.format("%.2f", mutlakA);
            // .00 ise sadeleştir
            if (katsayiMetni.endsWith(".00")) {
                katsayiMetni = katsayiMetni.substring(0, katsayiMetni.length() - 3);
            }

            String terim = "";
            if (k == 0) {
                terim = katsayiMetni;
            } else if (k == 1) {
                terim = (mutlakA == 1.0 ? "" : katsayiMetni) + "x";
            } else {
                terim = (mutlakA == 1.0 ? "" : katsayiMetni) + "x^" + k;
            }

            if (ilkTerim) {
                sb.append(a < 0 ? "-" : "").append(terim);
                ilkTerim = false;
            } else {
                sb.append(a < 0 ? " - " : " + ").append(terim);
            }
        }

        return sb.length() == 0 ? "0" : sb.toString();
    }
}`
  },
  {
    filename: "PolinomIslemleri.java",
    description: "Kullanıcıdan alınan katsayılar ve derece ile sembolik türev, belirsiz ve belirli integral çözücü.",
    category: "polinom",
    code: `/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: Polinom Türev ve İntegral Çözüm Motoru
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class PolinomIslemleri {

    /**
     * Polinomun Türevini Alır:
     * Kural: d/dx (a_k * x^k) = (k * a_k) * x^(k-1)
     * @param p Türevi alınacak Polinom nesnesi
     * @return Yeni türev Polinom nesnesi
     */
    public Polinom turevAl(Polinom p) {
        if (p.getDerece() == 0) {
            return new Polinom(new double[]{0.0});
        }

        int yeniDerece = p.getDerece() - 1;
        double[] yeniKatsayilar = new double[yeniDerece + 1];

        for (int k = 1; k <= p.getDerece(); k++) {
            double ak = p.getKatsayi(k);
            yeniKatsayilar[k - 1] = k * ak;
        }

        return new Polinom(yeniKatsayilar);
    }

    /**
     * Polinomun Belirsiz İntegralini Alır:
     * Kural: ∫ (a_k * x^k) dx = (a_k / (k + 1)) * x^(k+1) + C
     * @param p İntegrali alınacak Polinom nesnesi
     * @return Formül metni (örn: "0.75x^4 - 1.67x^3 + x^2 - 7x + C")
     */
    public String belirsizIntegralAl(Polinom p) {
        Polinom antiTurev = antiTurevBul(p);
        String ifade = antiTurev.toString();
        if (ifade.equals("0")) {
            return "C";
        }
        return ifade + " + C";
    }

    /**
     * Belirsiz integralin anti-türev fonksiyonunu Polinom nesnesi olarak üretir.
     */
    public Polinom antiTurevBul(Polinom p) {
        int yeniDerece = p.getDerece() + 1;
        double[] yeniKatsayilar = new double[yeniDerece + 1];
        // x^0 katsayısı entegrasyon sabiti (0 kabul edilir)
        yeniKatsayilar[0] = 0.0;

        for (int k = 0; k <= p.getDerece(); k++) {
            double ak = p.getKatsayi(k);
            yeniKatsayilar[k + 1] = ak / (k + 1);
        }

        return new Polinom(yeniKatsayilar);
    }

    /**
     * Belirli İntegral Hesabı:
     * Newton-Leibniz Teoremi: ∫_a^b f(x) dx = F(b) - F(a)
     * @param p Polinom fonksiyonu f(x)
     * @param altLimit Alt sınır (a)
     * @param ustLimit Üst sınır (b)
     * @return Belirli integral sayısal değeri
     */
    public double belirliIntegralAl(Polinom p, double altLimit, double ustLimit) {
        Polinom antiTurev = antiTurevBul(p);
        double fb = antiTurev.degerHesapla(ustLimit);
        double fa = antiTurev.degerHesapla(altLimit);
        return fb - fa;
    }
}`
  },
  {
    filename: "HesapMakinesi.java",
    description: "Tüm matematik ve kalkülüs sınıflarını koordine eden ana Facade / Yönetici sınıfı.",
    category: "yonetici",
    code: `/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: Hesap Makinesi Ana Yönetici Sınıfı (Facade Pattern)
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class HesapMakinesi {

    private final TemelMatematik temel;
    private final IleriMatematik ileri;
    private final PolinomIslemleri polinomIslemleri;
    private final String gelistirici = "ENES ÖZTÜRK";

    public HesapMakinesi() {
        this.temel = new TemelMatematik();
        this.ileri = new IleriMatematik();
        this.polinomIslemleri = new PolinomIslemleri();
    }

    public String getGelistirici() {
        return gelistirici;
    }

    // --- Temel 4 İşlem ---
    public double topla(double a, double b) { return temel.topla(a, b); }
    public double cikar(double a, double b) { return temel.cikar(a, b); }
    public double carp(double a, double b)  { return temel.carp(a, b); }
    public double bol(double a, double b)   { return temel.bol(a, b); }

    // --- Mod ve Mutlak Değer ---
    public double mod(double a, double b)   { return temel.modAl(a, b); }
    public double mutlak(double a)          { return temel.mutlakDeger(a); }

    // --- İleri Fonksiyonlar ---
    public double usAl(double taban, double us) { return ileri.usAl(taban, us); }
    public double karekok(double sayi)          { return ileri.karekok(sayi); }
    public long faktoriyel(int n)              { return ileri.faktoriyel(n); }

    // --- Polinom Kalkülüs İşlemleri ---
    public Polinom turevHesapla(Polinom p) {
        return polinomIslemleri.turevAl(p);
    }

    public String belirsizIntegralHesapla(Polinom p) {
        return polinomIslemleri.belirsizIntegralAl(p);
    }

    public double belirliIntegralHesapla(Polinom p, double a, double b) {
        return polinomIslemleri.belirliIntegralAl(p, a, b);
    }
}`
  },
  {
    filename: "Main.java",
    description: "Kullanıcı konsol arayüzü, Scanner girdi yönetimi ve Enes Öztürk imza afişi.",
    category: "main",
    code: `import java.util.Scanner;

/**
 * @author Enes Öztürk
 * Proje: Java Hazır Sınıflar Kullanılmayan Bilimsel Hesap Makinesi
 * Modül: Konsol Çalıştırma ve Menü Yönetimi (CLI)
 * İmzalı Sürüm: ENES ÖZTÜRK
 */
public class Main {

    public static void main(String[] args) {
        HesapMakinesi makine = new HesapMakinesi();
        Scanner scanner = new Scanner(System.in);

        imzaAfişiYazdir();

        boolean calisiyor = true;
        while (calisiyor) {
            menuGoster();
            System.out.print("Lütfen bir işlem seçiniz (0-8): ");
            int secim = -1;
            try {
                secim = Integer.parseInt(scanner.nextLine().trim());
            } catch (Exception e) {
                System.out.println("Geçersiz giriş! Lütfen sayısal bir seçim yapınız.\\n");
                continue;
            }

            try {
                switch (secim) {
                    case 1: // 4 Temel İşlem
                        temelIslemMenusu(makine, scanner);
                        break;
                    case 2: // Üs Alma
                        System.out.print("Taban sayısını giriniz: ");
                        double taban = Double.parseDouble(scanner.nextLine().trim());
                        System.out.print("Üs (kuvvet) değerini giriniz: ");
                        double us = Double.parseDouble(scanner.nextLine().trim());
                        double usSonuc = makine.usAl(taban, us);
                        System.out.printf("Sonuç: %.4f^%.4f = %.6f%n%n", taban, us, usSonuc);
                        break;
                    case 3: // Karekök Alma (Newton-Raphson)
                        System.out.print("Karekökü alınacak pozitif sayıyı giriniz: ");
                        double sayi = Double.parseDouble(scanner.nextLine().trim());
                        double kokSonuc = makine.karekok(sayi);
                        System.out.printf("Sonuç: √%.4f = %.8f (Newton-Raphson Yöntemiyle Hesaplanmıştır)%n%n", sayi, kokSonuc);
                        break;
                    case 4: // Polinom Türevi
                        polinomTurevMenusu(makine, scanner);
                        break;
                    case 5: // Polinom İntegrali
                        polinomIntegralMenusu(makine, scanner);
                        break;
                    case 6: // Faktöriyel
                        System.out.print("Faktöriyeli hesaplanacak tam sayıyı giriniz (0-20): ");
                        int n = Integer.parseInt(scanner.nextLine().trim());
                        long faktSonuc = makine.faktoriyel(n);
                        System.out.printf("Sonuç: %d! = %d%n%n", n, faktSonuc);
                        break;
                    case 7: // Mod Alma
                        System.out.print("Bölünen sayıyı (a) giriniz: ");
                        double aMod = Double.parseDouble(scanner.nextLine().trim());
                        System.out.print("Bölen sayıyı (b) giriniz: ");
                        double bMod = Double.parseDouble(scanner.nextLine().trim());
                        double modSonuc = makine.mod(aMod, bMod);
                        System.out.printf("Sonuç: %.4f mod %.4f = %.4f%n%n", aMod, bMod, modSonuc);
                        break;
                    case 8: // Mutlak Değer
                        System.out.print("Mutlak değeri alınacak sayıyı giriniz: ");
                        double mutlakSayi = Double.parseDouble(scanner.nextLine().trim());
                        double mutlakSonuc = makine.mutlak(mutlakSayi);
                        System.out.printf("Sonuç: |%.4f| = %.4f%n%n", mutlakSayi, mutlakSonuc);
                        break;
                    case 0:
                        System.out.println("Bilimsel Hesap Makinesi kapatılıyor. İyi günler dileriz!");
                        System.out.println("Proje Sahibi: ENES ÖZTÜRK");
                        calisiyor = false;
                        break;
                    default:
                        System.out.println("Hatalı seçim! Lütfen 0 ile 8 arasında bir değer giriniz.\\n");
                }
            } catch (Exception ex) {
                System.out.println("İşlem Sırasında Hata: " + ex.getMessage() + "\\n");
            }
        }
        scanner.close();
    }

    private static void imzaAfişiYazdir() {
        System.out.println("==================================================================");
        System.out.println("       ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ (JAVA OOP)          ");
        System.out.println("       Hazır Sınıflar (Math vb.) Kullanılmadan Geliştirilmiştir   ");
        System.out.println("==================================================================");
    }

    private static void menuGoster() {
        System.out.println("------------------------- İŞLEM MENÜSÜ ---------------------------");
        System.out.println("1 - Dört Temel İşlem (+, -, *, /)");
        System.out.println("2 - Üs Alma (x^y)");
        System.out.println("3 - Karekök Alma (√x)");
        System.out.println("4 - Türev Alma (Polinom)");
        System.out.println("5 - İntegral Alma (Belirsiz ve Belirli)");
        System.out.println("6 - Faktöriyel Hesaplama (n!)");
        System.out.println("7 - Mod Alma (a % b)");
        System.out.println("8 - Mutlak Değer Hesaplama (|x|)");
        System.out.println("0 - Çıkış");
        System.out.println("------------------------------------------------------------------");
    }

    private static void temelIslemMenusu(HesapMakinesi makine, Scanner scanner) {
        System.out.println("\\n--- 4 Temel İşlem ---");
        System.out.print("İlk sayıyı giriniz: ");
        double s1 = Double.parseDouble(scanner.nextLine().trim());
        System.out.print("İşlem seçiniz (+, -, *, /): ");
        String op = scanner.nextLine().trim();
        System.out.print("İkinci sayıyı giriniz: ");
        double s2 = Double.parseDouble(scanner.nextLine().trim());

        double sonuc = 0;
        switch (op) {
            case "+": sonuc = makine.topla(s1, s2); break;
            case "-": sonuc = makine.cikar(s1, s2); break;
            case "*": sonuc = makine.carp(s1, s2); break;
            case "/": sonuc = makine.bol(s1, s2); break;
            default:
                System.out.println("Bilinmeyen operatör!");
                return;
        }
        System.out.printf("Sonuç: %.4f %s %.4f = %.6f%n%n", s1, op, s2, sonuc);
    }

    private static void polinomTurevMenusu(HesapMakinesi makine, Scanner scanner) {
        System.out.println("\\n--- Polinom Türevi Alma ---");
        System.out.print("Denklemin derecesini giriniz (n): ");
        int derece = Integer.parseInt(scanner.nextLine().trim());

        double[] katsayilar = new double[derece + 1];
        System.out.println("Katsayıları en yüksek dereceden (x^" + derece + ") sabit terime doğru giriniz:");
        for (int i = derece; i >= 0; i--) {
            System.out.print("x^" + i + " teriminin katsayısı: ");
            katsayilar[derece - i] = Double.parseDouble(scanner.nextLine().trim());
        }

        Polinom p = Polinom.azalanDerecedenUret(katsayilar);
        System.out.println("\\nGirilen Fonksiyon : f(x)  = " + p);
        Polinom turev = makine.turevHesapla(p);
        System.out.println("Türev Fonksiyonu  : f'(x) = " + turev);

        System.out.print("Türevi belirli bir x noktasında hesaplamak ister misiniz? (E/H): ");
        String cevap = scanner.nextLine().trim();
        if (cevap.equalsIgnoreCase("E")) {
            System.out.print("x değerini giriniz: ");
            double xNoktasi = Double.parseDouble(scanner.nextLine().trim());
            System.out.printf("Sonuç: f'(%.2f) = %.6f%n", xNoktasi, turev.degerHesapla(xNoktasi));
        }
        System.out.println();
    }

    private static void polinomIntegralMenusu(HesapMakinesi makine, Scanner scanner) {
        System.out.println("\\n--- Polinom İntegrali Alma ---");
        System.out.print("Denklemin derecesini giriniz (n): ");
        int derece = Integer.parseInt(scanner.nextLine().trim());

        double[] katsayilar = new double[derece + 1];
        System.out.println("Katsayıları en yüksek dereceden (x^" + derece + ") sabit terime doğru giriniz:");
        for (int i = derece; i >= 0; i--) {
            System.out.print("x^" + i + " teriminin katsayısı: ");
            katsayilar[derece - i] = Double.parseDouble(scanner.nextLine().trim());
        }

        Polinom p = Polinom.azalanDerecedenUret(katsayilar);
        System.out.println("\\nGirilen Fonksiyon   : f(x) = " + p);
        String belirsiz = makine.belirsizIntegralHesapla(p);
        System.out.println("Belirsiz İntegral  : ∫ f(x) dx = " + belirsiz);

        System.out.print("Belirli integral (alan hesabı) yapmak ister misiniz? (E/H): ");
        String cevap = scanner.nextLine().trim();
        if (cevap.equalsIgnoreCase("E")) {
            System.out.print("Alt sınır (a): ");
            double a = Double.parseDouble(scanner.nextLine().trim());
            System.out.print("Üst sınır (b): ");
            double b = Double.parseDouble(scanner.nextLine().trim());
            double belirliSonuc = makine.belirliIntegralHesapla(p, a, b);
            System.out.printf("Sonuç: ∫_{%.2f}^{%.2f} f(x) dx = %.6f%n", a, b, belirliSonuc);
        }
        System.out.println();
    }
}`
  },
  {
    filename: "BilimselHesapMakinesiEnesOzturk.java",
    description: "Tüm sınıfları ve metotları tek bir Java dosyasında toplayan, anında derlenebilir tam sürüm.",
    category: "tek-dosya",
    code: `import java.util.Scanner;

/**
 * ============================================================================
 *                 ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ
 * ============================================================================
 * @author Enes Öztürk
 *
 * PROJE TANIMI:
 * Java'da Math ve benzeri hazır kütüphane sınıfları KULLANILMAYARAK,
 * nesne yönelimli programlama (OOP) sınıfları ve özgün metotlar ile geliştirilmiştir.
 *
 * HESAP MAKİNESİ FONKSİYONLARI:
 * 1. 4 Temel İşlem (Toplama, Çıkarma, Çarpma, Bölme)
 * 2. Üs Alma (İkili Hızlı Üs Alma ve Taylor Serisi Yaklaşımı)
 * 3. Karekök Alma (Newton-Raphson Babil Yakınsama Algoritması)
 * 4. Polinom Türevi Alma (Kullanıcıdan katsayılar ve derece alınarak)
 * 5. Polinom İntegrali Alma (Belirsiz ve Belirli İntegral Çözümü)
 * 6. Faktöriyel Hesaplama (n! ardışık çarpım algoritması)
 * 7. Mod Alma (Tam sayı bölme ve kalan bağıntısı)
 * 8. Mutlak Değer Hesaplama (|x| koşullu işaret çevrimi)
 * ============================================================================
 */
public class BilimselHesapMakinesiEnesOzturk {

    // ------------------------------------------------------------------------
    // 1. SINIF: Temel Matematik İşlemleri
    // ------------------------------------------------------------------------
    public static class TemelMatematik {
        public double topla(double a, double b) {
            return a + b;
        }

        public double cikar(double a, double b) {
            return a - b;
        }

        public double carp(double a, double b) {
            return a * b;
        }

        public double bol(double a, double b) {
            if (b == 0.0) {
                throw new ArithmeticException("Sıfıra bölme hatası: Bölen 0 olamaz!");
            }
            return a / b;
        }

        public double mutlakDeger(double x) {
            return (x < 0) ? -x : x;
        }

        public double modAl(double a, double b) {
            if (b == 0.0) {
                throw new ArithmeticException("Mod hatası: Mod tabanı 0 olamaz!");
            }
            long bolum = (long) (a / b);
            double kalan = a - (bolum * b);
            return (mutlakDeger(kalan) < 1e-12) ? 0.0 : kalan;
        }
    }

    // ------------------------------------------------------------------------
    // 2. SINIF: İleri Matematik (Üs, Karekök, Faktöriyel)
    // ------------------------------------------------------------------------
    public static class IleriMatematik {
        private final TemelMatematik temel = new TemelMatematik();

        public long faktoriyel(int n) {
            if (n < 0) {
                throw new IllegalArgumentException("Negatif sayıların faktöriyeli tanımsızdır!");
            }
            if (n > 20) {
                throw new ArithmeticException("20'den büyük sayılar 64-bit long sınırını aşar!");
            }
            long sonuc = 1;
            for (int i = 2; i <= n; i++) {
                sonuc *= i;
            }
            return sonuc;
        }

        public double karekok(double sayi) {
            if (sayi < 0) {
                throw new ArithmeticException("Negatif reel sayının karekökü tanımsızdır!");
            }
            if (sayi == 0.0) return 0.0;

            double tahmin = (sayi > 1.0) ? (sayi / 2.0) : 1.0;
            double epsilon = 1e-14;
            int maxIterasyon = 100;
            int adim = 0;

            while (adim < maxIterasyon) {
                double sonrakiTahmin = 0.5 * (tahmin + (sayi / tahmin));
                double fark = temel.mutlakDeger(sonrakiTahmin - tahmin);
                if (fark <= epsilon) {
                    return sonrakiTahmin;
                }
                tahmin = sonrakiTahmin;
                adim++;
            }
            return tahmin;
        }

        public double usAl(double taban, double us) {
            if (taban == 0.0) {
                if (us <= 0.0) throw new ArithmeticException("0^0 veya 0^negatif tanımsızdır!");
                return 0.0;
            }
            if (us == 0.0) return 1.0;

            if (us == (long) us) {
                long p = (long) temel.mutlakDeger(us);
                double sonuc = 1.0;
                double b = taban;
                while (p > 0) {
                    if (p % 2 == 1) sonuc *= b;
                    b *= b;
                    p /= 2;
                }
                return (us < 0) ? (1.0 / sonuc) : sonuc;
            }

            if (taban < 0) {
                throw new ArithmeticException("Negatif tabanın kesirli üssü karmaşık sayı üretir!");
            }
            double lnTaban = dogalLogaritma(taban);
            return ustelFonksiyon(us * lnTaban);
        }

        private double dogalLogaritma(double x) {
            double LN2 = 0.6931471805599453;
            int k = 0;
            double m = x;
            while (m > 1.41421356) { m /= 2.0; k++; }
            while (m < 0.70710678) { m *= 2.0; k--; }

            double t = (m - 1.0) / (m + 1.0);
            double tKare = t * t;
            double terim = t;
            double toplam = 0.0;
            for (int i = 1; i <= 50; i += 2) {
                toplam += terim / i;
                terim *= tKare;
                if (temel.mutlakDeger(terim) < 1e-15) break;
            }
            return (2.0 * toplam) + (k * LN2);
        }

        private double ustelFonksiyon(double z) {
            double LN2 = 0.6931471805599453;
            long n = (long) (z / LN2 + (z >= 0 ? 0.5 : -0.5));
            double r = z - (n * LN2);
            double toplam = 1.0;
            double terim = 1.0;
            for (int i = 1; i <= 35; i++) {
                terim = (terim * r) / i;
                toplam += terim;
                if (temel.mutlakDeger(terim) < 1e-16) break;
            }
            double carpan = 1.0;
            if (n > 0) {
                for (int i = 0; i < n; i++) carpan *= 2.0;
            } else if (n < 0) {
                for (int i = 0; i < -n; i++) carpan /= 2.0;
            }
            return toplam * carpan;
        }
    }

    // ------------------------------------------------------------------------
    // 3. SINIF: Polinom Modeli
    // ------------------------------------------------------------------------
    public static class Polinom {
        private final int derece;
        private final double[] katsayilar;

        public Polinom(double[] katsayilarArtan) {
            int d = katsayilarArtan.length - 1;
            while (d > 0 && katsayilarArtan[d] == 0.0) d--;
            this.derece = d;
            this.katsayilar = new double[this.derece + 1];
            System.arraycopy(katsayilarArtan, 0, this.katsayilar, 0, this.derece + 1);
        }

        public static Polinom azalanDerecedenUret(double[] katsayilarAzalan) {
            int len = katsayilarAzalan.length;
            double[] ters = new double[len];
            for (int i = 0; i < len; i++) {
                ters[i] = katsayilarAzalan[len - 1 - i];
            }
            return new Polinom(ters);
        }

        public int getDerece() { return derece; }
        public double getKatsayi(int k) {
            if (k < 0 || k >= katsayilar.length) return 0.0;
            return katsayilar[k];
        }

        public double degerHesapla(double x) {
            double sonuc = 0.0;
            for (int i = derece; i >= 0; i--) {
                sonuc = (sonuc * x) + katsayilar[i];
            }
            return sonuc;
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            boolean ilk = true;
            for (int k = derece; k >= 0; k--) {
                double a = katsayilar[k];
                if (a == 0.0 && derece > 0) continue;
                double mutlakA = (a < 0) ? -a : a;
                String katsayiMetni = String.format("%.2f", mutlakA);
                if (katsayiMetni.endsWith(".00")) {
                    katsayiMetni = katsayiMetni.substring(0, katsayiMetni.length() - 3);
                }
                String terim = (k == 0) ? katsayiMetni :
                               (k == 1) ? (mutlakA == 1.0 ? "" : katsayiMetni) + "x" :
                               (mutlakA == 1.0 ? "" : katsayiMetni) + "x^" + k;
                if (ilk) {
                    sb.append(a < 0 ? "-" : "").append(terim);
                    ilk = false;
                } else {
                    sb.append(a < 0 ? " - " : " + ").append(terim);
                }
            }
            return sb.length() == 0 ? "0" : sb.toString();
        }
    }

    // ------------------------------------------------------------------------
    // 4. SINIF: Polinom İşlemleri (Türev & İntegral)
    // ------------------------------------------------------------------------
    public static class PolinomIslemleri {
        public Polinom turevAl(Polinom p) {
            if (p.getDerece() == 0) return new Polinom(new double[]{0.0});
            int yeniDerece = p.getDerece() - 1;
            double[] yeniKatsayilar = new double[yeniDerece + 1];
            for (int k = 1; k <= p.getDerece(); k++) {
                yeniKatsayilar[k - 1] = k * p.getKatsayi(k);
            }
            return new Polinom(yeniKatsayilar);
        }

        public String belirsizIntegralAl(Polinom p) {
            Polinom anti = antiTurevBul(p);
            String str = anti.toString();
            return str.equals("0") ? "C" : str + " + C";
        }

        public Polinom antiTurevBul(Polinom p) {
            int yeniDerece = p.getDerece() + 1;
            double[] yeniKatsayilar = new double[yeniDerece + 1];
            yeniKatsayilar[0] = 0.0;
            for (int k = 0; k <= p.getDerece(); k++) {
                yeniKatsayilar[k + 1] = p.getKatsayi(k) / (k + 1);
            }
            return new Polinom(yeniKatsayilar);
        }

        public double belirliIntegralAl(Polinom p, double a, double b) {
            Polinom anti = antiTurevBul(p);
            return anti.degerHesapla(b) - anti.degerHesapla(a);
        }
    }

    // ------------------------------------------------------------------------
    // 5. SINIF: Hesap Makinesi Ana Facade
    // ------------------------------------------------------------------------
    public static class HesapMakinesi {
        private final TemelMatematik temel = new TemelMatematik();
        private final IleriMatematik ileri = new IleriMatematik();
        private final PolinomIslemleri calculus = new PolinomIslemleri();

        public double topla(double a, double b) { return temel.topla(a, b); }
        public double cikar(double a, double b) { return temel.cikar(a, b); }
        public double carp(double a, double b)  { return temel.carp(a, b); }
        public double bol(double a, double b)   { return temel.bol(a, b); }
        public double mod(double a, double b)   { return temel.modAl(a, b); }
        public double mutlak(double a)          { return temel.mutlakDeger(a); }
        public double usAl(double b, double p)  { return ileri.usAl(b, p); }
        public double karekok(double s)         { return ileri.karekok(s); }
        public long faktoriyel(int n)           { return ileri.faktoriyel(n); }
        public Polinom turevAl(Polinom p)       { return calculus.turevAl(p); }
        public String belirsizIntegral(Polinom p){ return calculus.belirsizIntegralAl(p); }
        public double belirliIntegral(Polinom p, double a, double b) {
            return calculus.belirliIntegralAl(p, a, b);
        }
    }

    // ------------------------------------------------------------------------
    // ANA ÇALIŞTIRMA (MAIN METODU)
    // ------------------------------------------------------------------------
    public static void main(String[] args) {
        HesapMakinesi makine = new HesapMakinesi();
        Scanner scanner = new Scanner(System.in);

        System.out.println("==================================================================");
        System.out.println("       ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ (JAVA OOP)          ");
        System.out.println("       Hazır Sınıflar (Math vb.) Kullanılmadan Geliştirilmiştir   ");
        System.out.println("==================================================================");

        boolean devam = true;
        while (devam) {
            System.out.println("\\nSeçenekler: 1-Dört İşlem, 2-Üs Alma, 3-Karekök, 4-Türev, 5-İntegral, 6-Faktöriyel, 7-Mod, 8-Mutlak Değer, 0-Çıkış");
            System.out.print("Seçiminiz: ");
            int secim = Integer.parseInt(scanner.nextLine().trim());

            switch (secim) {
                case 1:
                    System.out.print("Sayı 1: ");
                    double a = Double.parseDouble(scanner.nextLine().trim());
                    System.out.print("İşlem (+,-,*,/): ");
                    String op = scanner.nextLine().trim();
                    System.out.print("Sayı 2: ");
                    double b = Double.parseDouble(scanner.nextLine().trim());
                    double sonuc = op.equals("+") ? makine.topla(a,b) :
                                   op.equals("-") ? makine.cikar(a,b) :
                                   op.equals("*") ? makine.carp(a,b) : makine.bol(a,b);
                    System.out.println("Sonuç: " + sonuc);
                    break;
                case 2:
                    System.out.print("Taban: ");
                    double taban = Double.parseDouble(scanner.nextLine().trim());
                    System.out.print("Üs: ");
                    double us = Double.parseDouble(scanner.nextLine().trim());
                    System.out.println("Sonuç: " + makine.usAl(taban, us));
                    break;
                case 3:
                    System.out.print("Sayı: ");
                    double kokSayi = Double.parseDouble(scanner.nextLine().trim());
                    System.out.println("Sonuç (Newton-Raphson): " + makine.karekok(kokSayi));
                    break;
                case 4:
                    System.out.print("Polinom Derecesi (n): ");
                    int der = Integer.parseInt(scanner.nextLine().trim());
                    double[] kats = new double[der + 1];
                    for (int i = der; i >= 0; i--) {
                        System.out.print("x^" + i + " katsayısı: ");
                        kats[der - i] = Double.parseDouble(scanner.nextLine().trim());
                    }
                    Polinom pol = Polinom.azalanDerecedenUret(kats);
                    System.out.println("Girilen  : f(x)  = " + pol);
                    System.out.println("Türevi   : f'(x) = " + makine.turevAl(pol));
                    break;
                case 5:
                    System.out.print("Polinom Derecesi (n): ");
                    int intDer = Integer.parseInt(scanner.nextLine().trim());
                    double[] intKats = new double[intDer + 1];
                    for (int i = intDer; i >= 0; i--) {
                        System.out.print("x^" + i + " katsayısı: ");
                        intKats[intDer - i] = Double.parseDouble(scanner.nextLine().trim());
                    }
                    Polinom intPol = Polinom.azalanDerecedenUret(intKats);
                    System.out.println("Girilen : f(x) = " + intPol);
                    System.out.println("Belirsiz İntegral: ∫ f(x) dx = " + makine.belirsizIntegral(intPol));
                    break;
                case 6:
                    System.out.print("Faktöriyel sayısı (n): ");
                    int fakt = Integer.parseInt(scanner.nextLine().trim());
                    System.out.println("Sonuç: " + makine.faktoriyel(fakt));
                    break;
                case 7:
                    System.out.print("Sayı (a): ");
                    double m1 = Double.parseDouble(scanner.nextLine().trim());
                    System.out.print("Mod (b): ");
                    double m2 = Double.parseDouble(scanner.nextLine().trim());
                    System.out.println("Sonuç: " + makine.mod(m1, m2));
                    break;
                case 8:
                    System.out.print("Sayı: ");
                    double mutlak = Double.parseDouble(scanner.nextLine().trim());
                    System.out.println("Sonuç: " + makine.mutlak(mutlak));
                    break;
                case 0:
                    devam = false;
                    System.out.println("Çıkış yapıldı. ENES ÖZTÜRK");
                    break;
            }
        }
        scanner.close();
    }
}`
  }
];
