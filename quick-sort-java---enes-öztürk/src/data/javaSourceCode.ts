/**
 * Java Source Code definitions for QuickSort signed by Enes Öztürk.
 */

export const JAVA_FULL_CODE = `/**
 * ============================================================================
 *                    QUICK SORT (HIZLI SIRALAMA) ALGORİTMASI
 * ============================================================================
 * 
 * Bu sınıf, bilgisayar bilimlerinin en zarif ve yüksek performanslı böl-ve-yönet
 * (Divide & Conquer) sıralama algoritmalarından biri olan Quick Sort'u uygular.
 * 
 * Özellikler:
 *  - Lomuto Bölümleme Şeması (Lomuto Partitioning)
 *  - Hoare Bölümleme Şeması (Hoare Partitioning - optimize edilmiş takas sayısı)
 *  - Üçün Medyanı (Median-of-Three) pivot optimizasyonu (O(n²) en kötü durumu önler)
 *  - Jenerik Dizi Desteği (<T extends Comparable<T>>)
 *  - Adım Adım Konsol İzleme Modu (Eğitici Trace Çıktısı)
 *  - Çok Senaryolu Kapsamlı Test ve Performans Kıyaslama (main metodu)
 * 
 * Zaman Karmaşıklığı (Time Complexity):
 *  - En İyi Durum (Best Case)   : O(n log n)
 *  - Ortalama Durum (Avg Case) : O(n log n)
 *  - En Kötü Durum (Worst Case) : O(n²) [Medyan pivot ile pratik olarak O(n log n)]
 * 
 * Alan Karmaşıklığı (Space Complexity):
 *  - Yardımcı Bellek (Auxiliary) : O(1) - Yerinde (In-Place) sıralama
 *  - Çağrı Yığını (Call Stack)    : O(log n)
 * 
 * @author Enes Öztürk
 * @version 1.0.0
 * @since 2026
 * ============================================================================
 */

import java.util.Arrays;
import java.util.Random;

public class QuickSort {

    /* ========================================================================
     * 1. TEMEL QUICK SORT METOTLARI (PRIMITIVE int[])
     * ======================================================================== */

    /**
     * Verilen int dizisini varsayılan olarak Lomuto bölümleme yöntemiyle
     * küçükten büyüğe sıralar.
     * 
     * @param arr Sıralanacak int dizisi
     * @author Enes Öztürk
     */
    public static void sort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        quickSort(arr, 0, arr.length - 1);
    }

    /**
     * Özyinelemeli (Recursive) ana Quick Sort metodu.
     * Diziyi bir pivot etrafında iki alt parçaya böler ve her parçayı özyinelemeli sıralar.
     * 
     * @param arr Sıralanacak dizi
     * @param low Sıralanacak alt dizinin başlangıç indeksi
     * @param high Sıralanacak alt dizinin bitiş indeksi
     * @author Enes Öztürk
     */
    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // Pivotun doğru konumunu bul ve diziyi böl
            int pivotIndex = partitionLomuto(arr, low, high);

            // Pivotun solundaki ve sağındaki alt dizileri özyinelemeli olarak sırala
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    /**
     * Lomuto Bölümleme Şeması (Lomuto Partition Scheme).
     * Son elemanı pivot olarak seçer, pivottan küçük olanları sol tarafa toplar
     * ve pivotu ait olduğu kesin sıralı konuma yerleştirir.
     * 
     * @param arr Bölümlenecek dizi
     * @param low Başlangıç indeksi
     * @param high Bitiş indeksi (pivot eleman)
     * @return Pivotun son yerleştiği indeks
     * @author Enes Öztürk
     */
    private static int partitionLomuto(int[] arr, int low, int high) {
        // En kötü durumu (O(n²)) önlemek için medyan optimizasyonu
        medianOfThree(arr, low, high);

        int pivot = arr[high]; // Son eleman pivot
        int i = low - 1;       // Pivottan küçük elemanların sınır göstergesi

        for (int j = low; j < high; j++) {
            // Eğer mevcut eleman pivottan küçük veya eşitse
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }

        // Pivotu doğru konuma (i + 1) yerleştir
        swap(arr, i + 1, high);
        return i + 1;
    }

    /* ========================================================================
     * 2. HOARE BÖLÜMLEME ŞEMASI (HOARE PARTITION SCHEME - DAHA HIZLI)
     * ======================================================================== */

    /**
     * Hoare Bölümleme Şeması ile sıralama yapar.
     * Lomuto'ya kıyasla ortalama %60 daha az takas (swap) yapar ve daha verimlidir.
     * 
     * @param arr Sıralanacak dizi
     * @author Enes Öztürk
     */
    public static void sortWithHoare(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        quickSortHoare(arr, 0, arr.length - 1);
    }

    private static void quickSortHoare(int[] arr, int low, int high) {
        if (low < high) {
            int partitionIndex = partitionHoare(arr, low, high);
            quickSortHoare(arr, low, partitionIndex);
            quickSortHoare(arr, partitionIndex + 1, high);
        }
    }

    /**
     * Hoare Bölümleme Şeması. İki zıt yönlü işaretçi (pointer) kullanarak
     * pivotun solundaki büyüklerle sağındaki küçükleri takas eder.
     * 
     * @author Enes Öztürk
     */
    private static int partitionHoare(int[] arr, int low, int high) {
        int pivot = arr[low + (high - low) / 2];
        int i = low - 1;
        int j = high + 1;

        while (true) {
            // Soldan pivottan büyük ya da eşit eleman bulana kadar ilerle
            do {
                i++;
            } while (arr[i] < pivot);

            // Sağdan pivottan küçük ya da eşit eleman bulana kadar ilerle
            do {
                j--;
            } while (arr[j] > pivot);

            // İşaretçiler karşılaştıysa bölümleme tamamlanmıştır
            if (i >= j) {
                return j;
            }

            // Elemanları takas et
            swap(arr, i, j);
        }
    }

    /* ========================================================================
     * 3. PİVOT OPTİMİZASYONU (ÜÇÜN MEDYANI - MEDIAN OF THREE)
     * ======================================================================== */

    /**
     * low, mid ve high indekslerindeki elemanları inceler, ortancasını bulur
     * ve high indeksine yerleştirerek dengeli bölümleme garantiler.
     * Bu sayede zaten sıralı veya ters sıralı dizilerde O(n²) felaketi önlenir.
     * 
     * @author Enes Öztürk
     */
    private static void medianOfThree(int[] arr, int low, int high) {
        if (high - low < 2) {
            return;
        }
        int mid = low + (high - low) / 2;

        if (arr[low] > arr[mid]) {
            swap(arr, low, mid);
        }
        if (arr[low] > arr[high]) {
            swap(arr, low, high);
        }
        if (arr[mid] > arr[high]) {
            swap(arr, mid, high);
        }

        // Medyan değeri (mid) pivot olarak kullanmak üzere son elemana (high) taşı
        swap(arr, mid, high);
    }

    /* ========================================================================
     * 4. JENERİK QUICK SORT (<T extends Comparable<T>>)
     * ======================================================================== */

    /**
     * Herhangi bir Comparable nesne dizisini (String, Integer, Double, vb.)
     * Quick Sort algoritması ile sıralar.
     * 
     * @param <T> Comparable arayüzünü uygulayan tip
     * @param arr Sıralanacak jenerik dizi
     * @author Enes Öztürk
     */
    public static <T extends Comparable<T>> void sort(T[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        quickSortGeneric(arr, 0, arr.length - 1);
    }

    private static <T extends Comparable<T>> void quickSortGeneric(T[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partitionGeneric(arr, low, high);
            quickSortGeneric(arr, low, pivotIndex - 1);
            quickSortGeneric(arr, pivotIndex + 1, high);
        }
    }

    private static <T extends Comparable<T>> int partitionGeneric(T[] arr, int low, int high) {
        T pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j].compareTo(pivot) <= 0) {
                i++;
                swapGeneric(arr, i, j);
            }
        }
        swapGeneric(arr, i + 1, high);
        return i + 1;
    }

    private static <T> void swapGeneric(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    /* ========================================================================
     * 5. EĞİTİCİ ADIM ADIM İZLEME MODU (TRACE MODE)
     * ======================================================================== */

    /**
     * Sıralama işleminin her adımını konsola detaylı açıklama ile yazdırır.
     * Algoritmanın çalışma mekanizmasını anlamak için idealdir.
     * 
     * @param arr Sıralanacak ve izlenecek dizi
     * @author Enes Öztürk
     */
    public static void sortWithTrace(int[] arr) {
        System.out.println("══════════════════════════════════════════════════════════");
        System.out.println("  QUICK SORT ADIM ADIM İZLEME (Geliştirici: Enes Öztürk)  ");
        System.out.println("══════════════════════════════════════════════════════════");
        System.out.println("Başlangıç Dizisi : " + Arrays.toString(arr));
        System.out.println("──────────────────────────────────────────────────────────");

        quickSortWithTrace(arr, 0, arr.length - 1, 1);

        System.out.println("──────────────────────────────────────────────────────────");
        System.out.println("Sıralanmış Sonuç : " + Arrays.toString(arr));
        System.out.println("══════════════════════════════════════════════════════════\\n");
    }

    private static void quickSortWithTrace(int[] arr, int low, int high, int depth) {
        if (low < high) {
            String indent = "  ".repeat(depth);
            int pivot = arr[high];
            System.out.printf("%s[Derinlik %d] Aralık [%d .. %d] | Pivot: %d%n", indent, depth, low, high, pivot);

            int i = low - 1;
            for (int j = low; j < high; j++) {
                if (arr[j] <= pivot) {
                    i++;
                    if (i != j) {
                        swap(arr, i, j);
                        System.out.printf("%s  -> Takas: arr[%d]=%d <-> arr[%d]=%d%n", indent, i, arr[i], j, arr[j]);
                    }
                }
            }
            swap(arr, i + 1, high);
            int pivotIndex = i + 1;
            System.out.printf("%s  => Pivot %d, kesin indeks %d konumuna oturdu: %s%n",
                    indent, pivot, pivotIndex, Arrays.toString(arr));

            quickSortWithTrace(arr, low, pivotIndex - 1, depth + 1);
            quickSortWithTrace(arr, pivotIndex + 1, high, depth + 1);
        }
    }

    /* ========================================================================
     * 6. YARDIMCI METOTLAR
     * ======================================================================== */

    /**
     * İki dizi elemanının yerini değiştirir (In-place swap).
     * 
     * @author Enes Öztürk
     */
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    /* ========================================================================
     * 7. TEST & BENCHMARK ÇALIŞTIRICISI (MAIN METHOD)
     * ======================================================================== */

    public static void main(String[] args) {
        System.out.println("************************************************************");
        System.out.println("*         QUICK SORT ALGORİTMASI TEST VE DOĞRULAMA         *");
        System.out.println("*                 Geliştirici: Enes Öztürk                 *");
        System.out.println("************************************************************\\n");

        // TEST 1: Temel Sıralama ve Adım Adım İzleme
        int[] traceDizi = {38, 27, 43, 3, 9, 82, 10};
        sortWithTrace(traceDizi);

        // TEST 2: Farklı Senaryolar
        testSenaryosu("Rastgele Sayılar", new int[]{64, 34, 25, 12, 22, 11, 90});
        testSenaryosu("Zaten Sıralı Dizi", new int[]{1, 2, 3, 4, 5, 6, 7, 8});
        testSenaryosu("Ters Sıralı Dizi", new int[]{9, 8, 7, 6, 5, 4, 3, 2, 1});
        testSenaryosu("Yinelenen Elemanlar", new int[]{5, 2, 8, 5, 2, 5, 8, 1, 1});
        testSenaryosu("Negatif Sayılar İçeren", new int[]{-5, 12, -3, 0, 7, -1, 4});

        // TEST 3: Hoare Bölümleme Testi
        int[] hoareDizi = {84, 12, 95, 33, 47, 21, 68, 5};
        System.out.println("[Hoare Partition Testi]");
        System.out.println("Önce : " + Arrays.toString(hoareDizi));
        sortWithHoare(hoareDizi);
        System.out.println("Sonra: " + Arrays.toString(hoareDizi) + "\\n");

        // TEST 4: Jenerik Metot Testi (String Dizisi)
        String[] sehirler = {"İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Trabzon"};
        System.out.println("[Jenerik QuickSort Testi - String Dizisi]");
        System.out.println("Önce : " + Arrays.toString(sehirler));
        sort(sehirler);
        System.out.println("Sonra: " + Arrays.toString(sehirler) + "\\n");

        // TEST 5: Büyük Boyutlu Performans Ölçümü (100.000 Eleman)
        performansTesti(100_000);
    }

    private static void testSenaryosu(String baslik, int[] dizi) {
        System.out.printf("[%s]%n", baslik);
        System.out.println("  Önce : " + Arrays.toString(dizi));
        sort(dizi);
        System.out.println("  Sonra: " + Arrays.toString(dizi));
        System.out.println("  Doğrulama: " + (siraliMi(dizi) ? "BAŞARILI ✓" : "HATALI ✗") + "\\n");
    }

    private static boolean siraliMi(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
        }
        return true;
    }

    private static void performansTesti(int boyut) {
        Random rnd = new Random(42);
        int[] buyukDizi = new int[boyut];
        for (int i = 0; i < boyut; i++) {
            buyukDizi[i] = rnd.nextInt(boyut * 10);
        }

        System.out.printf("[Büyük Dizi Performans Testi - %d Eleman]%n", boyut);
        long baslangic = System.nanoTime();
        sort(buyukDizi);
        long bitis = System.nanoTime();

        double gecenSureMs = (bitis - baslangic) / 1_000_000.0;
        System.out.printf("  Geçen Süre : %.2f ms%n", gecenSureMs);
        System.out.printf("  Sıralama Başarılı mı: %s%n%n", siraliMi(buyukDizi) ? "EVET ✓" : "HAYIR ✗");
        System.out.println("© Enes Öztürk - Tüm Hakları Saklıdır.");
    }
}
`;

export const JAVA_CLEAN_CODE = `/**
 * Quick Sort (Hızlı Sıralama) - Temiz & Kompakt Sürüm
 * 
 * @author Enes Öztürk
 * @version 1.0.0
 */
public class QuickSort {

    public static void sort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        quickSort(arr, 0, arr.length - 1);
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // Son eleman pivot seçildi
        int i = low - 1;       // Küçük elemanlar göstergesi

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
`;

export const JAVA_GENERIC_CODE = `/**
 * Jenerik Quick Sort (<T extends Comparable<T>>)
 * Herhangi bir karşılaştırılabilir nesne dizisini sıralar.
 * 
 * @author Enes Öztürk
 * @version 1.0.0
 */
public class GenericQuickSort {

    public static <T extends Comparable<T>> void sort(T[] arr) {
        if (arr == null || arr.length <= 1) return;
        quickSort(arr, 0, arr.length - 1);
    }

    private static <T extends Comparable<T>> void quickSort(T[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static <T extends Comparable<T>> int partition(T[] arr, int low, int high) {
        T pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j].compareTo(pivot) <= 0) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
`;

export const JAVA_HOARE_CODE = `/**
 * Hoare Bölümleme Şemalı Quick Sort
 * Orijinal Hoare yöntemi, Lomuto'ya kıyasla 3 kat daha az takas (swap) yapar.
 * 
 * @author Enes Öztürk
 * @version 1.0.0
 */
public class HoareQuickSort {

    public static void sort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        quickSort(arr, 0, arr.length - 1);
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int p = partition(arr, low, high);
            quickSort(arr, low, p);
            quickSort(arr, p + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[low + (high - low) / 2];
        int i = low - 1;
        int j = high + 1;

        while (true) {
            do { i++; } while (arr[i] < pivot);
            do { j--; } while (arr[j] > pivot);

            if (i >= j) return j;
            swap(arr, i, j);
        }
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
`;
