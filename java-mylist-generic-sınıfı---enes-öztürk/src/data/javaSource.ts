/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const MY_LIST_JAVA_CODE = `/**
 * ============================================================================
 * KENDİ LİSTE SINIFIMIZ (GENERIC DİNAMİK DİZİ MİMARİSİ)
 * Geliştirici: Enes Öztürk
 * 
 * Bu sınıf, Java'da hazır Collection sınıfları (ArrayList, LinkedList vb.) 
 * KULLANILMADAN, generic yapısı ve dinamik dizi algoritması ile sıfırdan 
 * inşa edilmiştir.
 * 
 * Özellikler:
 * - Varsayılan kapasite: 10
 * - Kapasite dolduğunda 2 katına (2x) dinamik büyüme
 * - Eleman silindiğinde sola kaydırma (Left-shift) mekanizması
 * - Tam generic <T> tip güvenliği
 * ============================================================================
 */

package com.enesozturk.mylist;

import java.util.Arrays;
import java.util.Objects;

/**
 * Generic dinamik dizi sınıfı.
 *
 * @author Enes Öztürk
 * @param <T> Listede saklanacak veri tipi
 */
public class MyList<T> {

    // Varsayılan başlangıç kapasitesi
    private static final int DEFAULT_CAPACITY = 10;

    // Elemanları saklayacak olan iç dizi (Generic Object dizisi)
    private Object[] data;

    // Listedeki mevcut eleman sayısı
    private int size;

    /**
     * Boş constructor: Dizinin başlangıç kapasitesini varsayılan olarak 10 yapar.
     */
    public MyList() {
        this(DEFAULT_CAPACITY);
    }

    /**
     * Parametreli constructor: Dizinin başlangıç kapasitesini belirtilen değer yapar.
     * Geçersiz veya negatif bir değer girilirse varsayılan kapasite (10) kullanılır.
     *
     * @param capacity Başlangıç dizi kapasitesi
     */
    public MyList(int capacity) {
        if (capacity <= 0) {
            this.data = new Object[DEFAULT_CAPACITY];
        } else {
            this.data = new Object[capacity];
        }
        this.size = 0;
    }

    /**
     * Listedeki aktif eleman sayısını döndürür.
     *
     * @return Eleman sayısı
     */
    public int size() {
        return this.size;
    }

    /**
     * Dizinin toplam fiziksel kapasitesini döndürür.
     *
     * @return Dizi kapasitesi
     */
    public int getCapacity() {
        return this.data.length;
    }

    /**
     * Sınıfa ait diziye yeni bir eleman ekler.
     * Eğer dizide yeteri kadar yer yok ise (size >= capacity),
     * dizi boyutu mevcut kapasitenin 2 katına çıkartılır.
     *
     * @param item Eklenecek eleman
     */
    public void add(T item) {
        // Kapasite kontrolü: Dolduysa 2 katına çıkar
        if (this.size >= this.data.length) {
            doubleCapacity();
        }
        this.data[this.size] = item;
        this.size++;
    }

    /**
     * Dizi kapasitesini 2 katına çıkaran yardımcı metot.
     * Yeni bir dizi oluşturup mevcut elemanları aktarır.
     * (Collection sınıfı kullanılmamıştır)
     */
    private void doubleCapacity() {
        int newCapacity = this.data.length * 2;
        Object[] newData = new Object[newCapacity];
        for (int i = 0; i < this.size; i++) {
            newData[i] = this.data[i];
        }
        this.data = newData;
    }

    /**
     * Verilen indisteki değeri döndürür.
     * Geçersiz indis girilirse null döndürür.
     *
     * @param index İstenen elemanın indisi
     * @return İndisteki veri veya geçersizse null
     */
    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (!isIndexValid(index)) {
            return null;
        }
        return (T) this.data[index];
    }

    /**
     * Verilen indisteki veriyi siler ve silinen indisteki veriden 
     * sonraki tüm verileri sola doğru bir basamak kaydırır.
     * Geçersiz indis girilirse null döndürür.
     *
     * @param index Silinecek elemanın indisi
     * @return Silinen veri veya geçersizse null
     */
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        if (!isIndexValid(index)) {
            return null;
        }

        T removedItem = (T) this.data[index];

        // Silinen indisten sonraki elemanları sola kaydır
        for (int i = index; i < this.size - 1; i++) {
            this.data[i] = this.data[i + 1];
        }

        // Son pozisyonu boşa çıkar ve eleman sayısını bir azalt
        this.data[this.size - 1] = null;
        this.size--;

        return removedItem;
    }

    /**
     * Verilen indisteki veriyi yenisi ile değiştirir.
     * Geçersiz indis girilirse null döndürür.
     *
     * @param index Güncellenecek indis
     * @param data  Yeni veri değeri
     * @return Eski veri değeri (veya geçersiz indiste null)
     */
    @SuppressWarnings("unchecked")
    public T set(int index, T data) {
        if (!isIndexValid(index)) {
            return null;
        }
        T oldData = (T) this.data[index];
        this.data[index] = data;
        return oldData;
    }

    /**
     * Sınıfa ait dizideki elemanları [10,20,40] formatında listeleyen metot.
     * Liste boşsa "[]" döndürür.
     *
     * @return Elemanların metinsel temsili
     */
    @Override
    public String toString() {
        if (this.size == 0) {
            return "[]";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < this.size; i++) {
            sb.append(this.data[i]);
            if (i < this.size - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Parametrede verilen nesnenin listedeki ilk indeksini verir.
     * Nesne listede yoksa -1 değerini verir.
     *
     * @param data Aranacak nesne
     * @return İlk bulunduğu indeks veya bulunamazsa -1
     */
    public int indexOf(T data) {
        for (int i = 0; i < this.size; i++) {
            if (Objects.equals(this.data[i], data)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Belirtilen öğenin listedeki son indeksini verir.
     * Nesne listede yoksa -1 değerini verir.
     *
     * @param data Aranacak nesne
     * @return Son bulunduğu indeks veya bulunamazsa -1
     */
    public int lastIndexOf(T data) {
        for (int i = this.size - 1; i >= 0; i--) {
            if (Objects.equals(this.data[i], data)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Listenin boş olup olmadığını söyler.
     *
     * @return Liste boşsa true, en az bir eleman varsa false
     */
    public boolean isEmpty() {
        return this.size == 0;
    }

    /**
     * Listedeki öğeleri aynı sırayla yeni bir Object[] dizisi haline getirir.
     *
     * @return Listedeki elemanları içeren dizi
     */
    public Object[] toArray() {
        Object[] result = new Object[this.size];
        for (int i = 0; i < this.size; i++) {
            result[i] = this.data[i];
        }
        return result;
    }

    /**
     * Listedeki bütün öğeleri siler, diziyi varsayılan kapasitesine (10) çevirir.
     */
    public void clear() {
        this.data = new Object[DEFAULT_CAPACITY];
        this.size = 0;
    }

    /**
     * Parametrede verilen indeks aralığına ait yeni bir alt liste (subList) döner.
     * Örnek senaryoya göre start ve finish indeksleri dahil (inclusive) olarak alınır.
     * Geçersiz indis aralıklarında boş liste döner.
     *
     * @param start  Başlangıç indisi (dahil)
     * @param finish Bitiş indisi (dahil)
     * @return Belirtilen aralıktaki elemanları içeren yeni MyList nesnesi
     */
    public MyList<T> subList(int start, int finish) {
        MyList<T> sub = new MyList<>(Math.max(DEFAULT_CAPACITY, finish - start + 1));
        
        // Geçersiz aralık kontrolü
        if (start < 0 || finish >= this.size || start > finish) {
            return sub;
        }

        for (int i = start; i <= finish; i++) {
            @SuppressWarnings("unchecked")
            T item = (T) this.data[i];
            sub.add(item);
        }
        return sub;
    }

    /**
     * Parametrede verilen değerin dizide olup olmadığını kontrol eder.
     *
     * @param data Aranacak değer
     * @return Eleman listede varsa true, yoksa false
     */
    public boolean contains(T data) {
        return this.indexOf(data) != -1;
    }

    /**
     * Verilen indis değerinin geçerli aralıkta (0 <= index < size) olup olmadığını kontrol eder.
     *
     * @param index Kontrol edilecek indis
     * @return Geçerli ise true, değilse false
     */
    private boolean isIndexValid(int index) {
        return index >= 0 && index < this.size;
    }
}
`;

export const MAIN_JAVA_CODE = `/**
 * ============================================================================
 * MYLIST TEST VE ÇALIŞTIRMA SINIFI (Ata.java)
 * Geliştirici: Enes Öztürk
 * 
 * Bu sınıf, soruda verilen 3 farklı senaryoyu sırasıyla test eder.
 * ============================================================================
 */

package com.enesozturk.mylist;

public class Ata {

    public static void main(String[] args) {
        System.out.println("========== SENARYO 1: Kapasite ve Boyut Testi ==========");
        senaryo1();

        System.out.println("\\n========== SENARYO 2: get, remove, set, toString Testi ==========");
        senaryo2();

        System.out.println("\\n========== SENARYO 3: indexOf, lastIndexOf, toArray, subList, contains, clear Testi ==========");
        senaryo3();
    }

    /**
     * SENARYO 1: Dinamik Kapasite Artışı (2 Katına Çıkma)
     */
    public static void senaryo1() {
        MyList<Integer> liste = new MyList<>();
        System.out.println("Dizideki Eleman Sayısı : " + liste.size());
        System.out.println("Dizinin Kapasitesi : " + liste.getCapacity());
        
        liste.add(10);
        liste.add(20);
        liste.add(30);
        liste.add(40);
        System.out.println("Dizideki Eleman Sayısı : " + liste.size());
        System.out.println("Dizinin Kapasitesi : " + liste.getCapacity());
        
        liste.add(50);
        liste.add(60);
        liste.add(70);
        liste.add(80);
        liste.add(90);
        liste.add(100);
        liste.add(110);
        System.out.println("Dizideki Eleman Sayısı : " + liste.size());
        System.out.println("Dizinin Kapasitesi : " + liste.getCapacity());
    }

    /**
     * SENARYO 2: İndis Erişimi, Silme (Sola Kaydırma), Güncelleme ve toString
     */
    public static void senaryo2() {
        MyList<Integer> liste = new MyList<>();
        liste.add(10);
        liste.add(20);
        liste.add(30);
        System.out.println("2. indisteki değer : " + liste.get(2));
        
        liste.remove(2);
        liste.add(40);
        liste.set(0, 100);
        System.out.println("2. indisteki değer : " + liste.get(2));
        System.out.println(liste.toString());
    }

    /**
     * SENARYO 3: Arama, Diziye Çevirme, Alt Liste, Varlık Sorgulama ve Temizleme
     */
    public static void senaryo3() {
        MyList<Integer> liste = new MyList<>();
        System.out.println("Liste Durumu : " + (liste.isEmpty() ? "Boş" : "Dolu"));
        
        liste.add(10);
        liste.add(20);
        liste.add(30);
        liste.add(40);
        liste.add(20);
        liste.add(50);
        liste.add(60);
        liste.add(70);

        System.out.println("Liste Durumu : " + (liste.isEmpty() ? "Boş" : "Dolu"));

        // Bulduğu ilk indeksi verir
        System.out.println("Indeks : " + liste.indexOf(20));

        // Bulamazsa -1 döndürür
        System.out.println("Indeks :" + liste.indexOf(100));

        // Bulduğu son indeksi verir
        System.out.println("Indeks : " + liste.lastIndexOf(20));

        // Listeyi Object[] dizisi olarak geri verir.
        Object[] dizi = liste.toArray();
        System.out.println("Object dizisinin ilk elemanı :" + dizi[0]);

        // Liste veri türünde alt bir liste oluşturdu (0'dan 3'e dahil)
        MyList<Integer> altListem = liste.subList(0, 3);
        System.out.println(altListem.toString());

        // Değerin listede olup olmadığını sorguladı
        System.out.println("Listemde 20 değeri : " + liste.contains(20));
        System.out.println("Listemde 120 değeri : " + liste.contains(120));

        // Listeyi tamamen boşaltır ve varsayılan boyutuna çevirir
        liste.clear();
        System.out.println(liste.toString());
    }
}
`;
