export const SINGLE_FILE_JAVA_CODE = `package com.enesozturk.multithreading;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * ÖDEV: Java Çoklu İş Parçacığı (Multithreading) - 1'den 10000'e Sayı Ayrıştırma
 * 
 * HAZIRLAYAN: Enes Öztürk
 * TARİH     : 2026
 * PROJE     : 10.000 Elemanlı ArrayList'in 4 Thread ile Tek/Çift Sayılara Ayrılması
 * 
 * AÇIKLAMA:
 * 1. 1'den 10000'e kadar olan sayılardan bir ArrayList oluşturulur.
 * 2. Bu liste 2500'er elemanlık 4 eşit alt listeye bölünür.
 * 3. 4 ayrı Thread kendi 2500'lük listesindeki sayıları tarar.
 * 4. Çift sayıları 'ciftSayilar' ortak listesine,
 *    Tek sayıları 'tekSayilar' ortak listesine ekler.
 * 5. ArrayList thread-safe (iş parçacığı güvenli) olmadığından,
 *    ortak listelere yazma işlemi 'synchronized' bloklarıyla korunmuştur.
 * ============================================================================
 */
public class Main {

    // 4 Thread'in ortaklaşa erişeceği ve dolduracağı listeler (Başlangıçta boş)
    public static final List<Integer> tekSayilar = new ArrayList<>();
    public static final List<Integer> ciftSayilar = new ArrayList<>();

    // Thread-safety (iş parçacığı güvenliği) için kilit nesneleri
    private static final Object tekKilit = new Object();
    private static final Object ciftKilit = new Object();

    public static void main(String[] args) {
        System.out.println("==========================================================");
        System.out.println("Java Multithreading Ödevi - Hazırlayan: Enes Öztürk");
        System.out.println("==========================================================");

        // ADIM 1: 1'den 10000'e kadar sayılardan oluşan ana ArrayList'in doldurulması
        System.out.println("[Adım 1] 1'den 10000'e kadar sayılar oluşturuluyor...");
        ArrayList<Integer> anaListe = new ArrayList<>();
        for (int i = 1; i <= 10000; i++) {
            anaListe.add(i);
        }
        System.out.println("       -> Ana liste başarıyla oluşturuldu. Toplam eleman: " + anaListe.size());

        // ADIM 2: 10000 elemanlı listenin 2500 elemanlık 4 eşit parçaya bölünmesi
        System.out.println("[Adım 2] Liste 2500'er elemanlık 4 eşit alt listeye ayrılıyor...");
        ArrayList<Integer> parca1 = new ArrayList<>(anaListe.subList(0, 2500));     // 1 - 2500
        ArrayList<Integer> parca2 = new ArrayList<>(anaListe.subList(2500, 5000));  // 2501 - 5000
        ArrayList<Integer> parca3 = new ArrayList<>(anaListe.subList(5000, 7500));  // 5001 - 7500
        ArrayList<Integer> parca4 = new ArrayList<>(anaListe.subList(7500, 10000)); // 7501 - 10000

        System.out.println("       -> Parça 1 (1 - 2500)    : " + parca1.size() + " eleman");
        System.out.println("       -> Parça 2 (2501 - 5000) : " + parca2.size() + " eleman");
        System.out.println("       -> Parça 3 (5001 - 7500) : " + parca3.size() + " eleman");
        System.out.println("       -> Parça 4 (7501 - 10000): " + parca4.size() + " eleman");

        // ADIM 3: 4 ayrı Thread nesnesinin tanımlanması
        System.out.println("[Adım 3] 4 ayrı Thread oluşturulup çalıştırılıyor...");
        long baslangicZamani = System.currentTimeMillis();

        SayiIsleyici gorev1 = new SayiIsleyici("Thread-1 (1-2500)", parca1);
        SayiIsleyici gorev2 = new SayiIsleyici("Thread-2 (2501-5000)", parca2);
        SayiIsleyici gorev3 = new SayiIsleyici("Thread-3 (5001-7500)", parca3);
        SayiIsleyici gorev4 = new SayiIsleyici("Thread-4 (7501-10000)", parca4);

        Thread t1 = new Thread(gorev1);
        Thread t2 = new Thread(gorev2);
        Thread t3 = new Thread(gorev3);
        Thread t4 = new Thread(gorev4);

        // Thread'lerin eşzamanlı (concurrent) olarak başlatılması
        t1.start();
        t2.start();
        t3.start();
        t4.start();

        // ADIM 4: Ana thread'in (main), çalışan 4 thread'in bitmesini beklemesi (join)
        try {
            t1.join();
            t2.join();
            t3.join();
            t4.join();
        } catch (InterruptedException e) {
            System.err.println("Thread çalışması kesintiye uğradı: " + e.getMessage());
            Thread.currentThread().interrupt();
        }

        long bitisZamani = System.currentTimeMillis();

        // ADIM 5: Sonuçların doğrulanması ve raporlanması
        System.out.println("\\n==========================================================");
        System.out.println("SONUÇLAR VE RAPORLAMA (Çalışma Süresi: " + (bitisZamani - baslangicZamani) + " ms)");
        System.out.println("==========================================================");
        System.out.println("Tek Sayılar Listesi Boyutu : " + tekSayilar.size() + " adet (Beklenen: 5000)");
        System.out.println("Çift Sayılar Listesi Boyutu: " + ciftSayilar.size() + " adet (Beklenen: 5000)");
        System.out.println("Toplam Ayrıştırılan Sayı   : " + (tekSayilar.size() + ciftSayilar.size()) + " adet (Beklenen: 10000)");

        if (tekSayilar.size() == 5000 && ciftSayilar.size() == 5000) {
            System.out.println("[DURUM] MÜKEMMEL! Hiçbir veri kaybı olmadan tüm sayılar ayrıştırıldı.");
        } else {
            System.out.println("[UYARI] Veri kaybı veya yarış durumu (Race Condition) tespit edildi!");
        }

        System.out.println("\\nÖdev Başarıyla Tamamlandı.");
        System.out.println("İmza: Enes Öztürk");
        System.out.println("==========================================================");
    }

    /**
     * Ortak çift sayılar listesine güvenli (Thread-safe) ekleme yapar.
     */
    public static void ciftSayiEkle(int sayi) {
        synchronized (ciftKilit) {
            ciftSayilar.add(sayi);
        }
    }

    /**
     * Ortak tek sayılar listesine güvenli (Thread-safe) ekleme yapar.
     */
    public static void tekSayiEkle(int sayi) {
        synchronized (tekKilit) {
            tekSayilar.add(sayi);
        }
    }
}

/**
 * Kendisine verilen 2500 elemanlık sayılar listesini inceleyen
 * ve tek/çift kontrolü yaparak ortak listelere ekleyen Runnable sınıfı.
 * 
 * Hazırlayan: Enes Öztürk
 */
class SayiIsleyici implements Runnable {
    private final String threadAdi;
    private final List<Integer> sayiListesi;

    public SayiIsleyici(String threadAdi, List<Integer> sayiListesi) {
        this.threadAdi = threadAdi;
        this.sayiListesi = sayiListesi;
    }

    @Override
    public void run() {
        int tekSayisi = 0;
        int ciftSayisi = 0;

        for (int sayi : sayiListesi) {
            if (sayi % 2 == 0) {
                Main.ciftSayiEkle(sayi);
                ciftSayisi++;
            } else {
                Main.tekSayiEkle(sayi);
                tekSayisi++;
            }
        }

        System.out.println(" > [" + threadAdi + "] Görevini tamamladı. " +
                "(Tek: " + tekSayisi + ", Çift: " + ciftSayisi + ", Toplam: " + (tekSayisi + ciftSayisi) + ")");
    }
}
`;

export const OOP_JAVA_CODE = `// ==========================================
// 1. DOSYA: Main.java
// Hazırlayan: Enes Öztürk
// ==========================================
package com.enesozturk.multithreading;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static final List<Integer> tekSayilar = new ArrayList<>();
    public static final List<Integer> ciftSayilar = new ArrayList<>();

    private static final Object tekKilit = new Object();
    private static final Object ciftKilit = new Object();

    public static void main(String[] args) {
        System.out.println("Java Multithreading Ödevi - Enes Öztürk");

        // 10.000 elemanlık ana liste oluşturulur
        ArrayList<Integer> anaListe = new ArrayList<>(10000);
        for (int i = 1; i <= 10000; i++) {
            anaListe.add(i);
        }

        // 4 eşit parçaya (2500'er adet) bölme
        List<List<Integer>> altListeler = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            int baslangic = i * 2500;
            int bitis = baslangic + 2500;
            altListeler.add(new ArrayList<>(anaListe.subList(baslangic, bitis)));
        }

        // Thread dizisi oluşturma ve başlatma
        Thread[] threadler = new Thread[4];
        for (int i = 0; i < 4; i++) {
            String threadIsmi = "Thread-" + (i + 1) + " (" + (i * 2500 + 1) + "-" + ((i + 1) * 2500) + ")";
            SayiIsleyici gorev = new SayiIsleyici(threadIsmi, altListeler.get(i));
            threadler[i] = new Thread(gorev);
            threadler[i].start();
        }

        // Tüm thread'lerin tamamlanmasını bekleme
        for (Thread t : threadler) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        System.out.println("Tek Sayılar Boyutu : " + tekSayilar.size());
        System.out.println("Çift Sayılar Boyutu: " + ciftSayilar.size());
        System.out.println("İmza: Enes Öztürk");
    }

    public static void tekEkle(int sayi) {
        synchronized (tekKilit) {
            tekSayilar.add(sayi);
        }
    }

    public static void ciftEkle(int sayi) {
        synchronized (ciftKilit) {
            ciftSayilar.add(sayi);
        }
    }
}

// ==========================================
// 2. DOSYA: SayiIsleyici.java
// Hazırlayan: Enes Öztürk
// ==========================================
package com.enesozturk.multithreading;

import java.util.List;

public class SayiIsleyici implements Runnable {
    private final String threadAdi;
    private final List<Integer> sayilar;

    public SayiIsleyici(String threadAdi, List<Integer> sayilar) {
        this.threadAdi = threadAdi;
        this.sayilar = sayilar;
    }

    @Override
    public void run() {
        for (int sayi : sayilar) {
            if (sayi % 2 == 0) {
                Main.ciftEkle(sayi);
            } else {
                Main.tekEkle(sayi);
            }
        }
        System.out.println(threadAdi + " tamamlandı.");
    }
}
`;

export const EXECUTOR_JAVA_CODE = `package com.enesozturk.multithreading;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Alternatif Çözüm: Java ExecutorService (Thread Pool) & Collections.synchronizedList
 * Hazırlayan: Enes Öztürk
 */
public class ExecutorServiceMain {

    // Collections.synchronizedList ile doğrudan thread-safe liste sarmalama
    public static final List<Integer> tekSayilar = Collections.synchronizedList(new ArrayList<>());
    public static final List<Integer> ciftSayilar = Collections.synchronizedList(new ArrayList<>());

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Java Multithreading (ThreadPool) - Hazırlayan: Enes Öztürk");

        ArrayList<Integer> anaListe = new ArrayList<>(10000);
        for (int i = 1; i <= 10000; i++) {
            anaListe.add(i);
        }

        // 4 thread kapasiteli thread havuzu
        ExecutorService executor = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 4; i++) {
            final int index = i;
            final List<Integer> altListe = new ArrayList<>(anaListe.subList(i * 2500, (i + 1) * 2500));
            executor.execute(() -> {
                for (int sayi : altListe) {
                    if (sayi % 2 == 0) {
                        ciftSayilar.add(sayi);
                    } else {
                        tekSayilar.add(sayi);
                    }
                }
                System.out.println("Havuz İş Parçacığı #" + (index + 1) + " bitti.");
            });
        }

        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        System.out.println("Tek Sayılar : " + tekSayilar.size());
        System.out.println("Çift Sayılar: " + ciftSayilar.size());
        System.out.println("İmza: Enes Öztürk");
    }
}
`;

export const CODE_EXPLANATIONS = [
  {
    title: "1. 1'den 10000'e ArrayList Oluşturulması",
    code: `ArrayList<Integer> anaListe = new ArrayList<>();
for (int i = 1; i <= 10000; i++) {
    anaListe.add(i);
}`,
    explanation:
      "Ödev gereksinimi olarak 1'den 10000'e kadar olan tam sayıları içeren ana bir ArrayList dinamik olarak döngü ile doldurulur.",
  },
  {
    title: "2. Listenin 2500 Elemanlık 4 Parçaya Ayrılması",
    code: `ArrayList<Integer> parca1 = new ArrayList<>(anaListe.subList(0, 2500));
ArrayList<Integer> parca2 = new ArrayList<>(anaListe.subList(2500, 5000));
ArrayList<Integer> parca3 = new ArrayList<>(anaListe.subList(5000, 7500));
ArrayList<Integer> parca4 = new ArrayList<>(anaListe.subList(7500, 10000));`,
    explanation:
      "subList(start, end) metodu kullanılarak 10.000 eleman tam 4 eşit parçaya (2500 eleman) bölünür. Yeni ArrayList nesnesi içine kopyalanarak referans bağımsızlığı sağlanır.",
  },
  {
    title: "3. 4 Ayrı Thread Tasarımı ve start() Çağrısı",
    code: `SayiIsleyici gorev1 = new SayiIsleyici("Thread-1 (1-2500)", parca1);
Thread t1 = new Thread(gorev1);
t1.start(); // t1.run() DEĞİL! run() yeni thread başlatmaz, start() JVM'de yeni thread açar.`,
    explanation:
      "Her parçayı işlemek üzere Runnable arayüzünden türetilen SayiIsleyici nesneleri oluşturulur ve Thread sınıfına verilir. start() çağrısıyla 4 iş parçacığı aynı anda (eşzamanlı) çalışmaya başlar.",
  },
  {
    title: "4. Thread-Safe (Senkronizasyon) ve synchronized Bloğu",
    code: `public static void ciftSayiEkle(int sayi) {
    synchronized (ciftKilit) {
        ciftSayilar.add(sayi);
    }
}`,
    explanation:
      "ÇOK ÖNEMLİ: Java'da ArrayList varsayılan olarak Thread-Safe DEĞİLDİR! 4 Thread aynı anda ciftSayilar.add() çağırdığında bellek çakışması (Race Condition) oluşur ve toplam eleman 5000 yerine 4800, 4920 gibi eksik kalır veya ArrayIndexOutOfBoundsException atılır. 'synchronized' bloğu, aynı anda sadece tek bir thread'in listeye eleman eklemesini garanti ederek veri kaybını önler.",
  },
  {
    title: "5. join() Metodu ile Thread'leri Bekleme",
    code: `t1.join();
t2.join();
t3.join();
t4.join();`,
    explanation:
      "join() metodu ana iş parçacığı olan 'main' thread'ini, bu 4 thread işini bitirene kadar bekletir. Bu sayede ekrana yazdırma ve boyut kontrolleri sadece tüm sayılar işlendikten sonra yapılır.",
  },
];
