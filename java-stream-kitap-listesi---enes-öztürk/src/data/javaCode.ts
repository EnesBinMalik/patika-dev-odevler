/**
 * @file javaCode.ts
 * Java 102 Ödev - Kitap Listesi Çözümü (Enes Öztürk)
 * Book.java ve Main.java için eksiksiz ve çalıştırılabilir Java kaynak kodları.
 */

export const BOOK_JAVA_CODE = `/**
 * ============================================================================
 * Proje: Java 102 - Kitap Listesi (Book List) Ödevi
 * Geliştirici: Enes Öztürk
 * Sınıf: Book (Kitap Modeli)
 * ============================================================================
 * Book sınıfı; kitap ismi, sayfa sayısı, yazarın ismi ve yayın tarihi
 * değişkenlerinden oluşmaktadır.
 */

public class Book {
    // Nesne Değişkenleri (Encapsulation gereği private tanımlanmıştır)
    private String name;        // Kitap ismi
    private int pageCount;      // Sayfa sayısı
    private String authorName;  // Yazarın ismi
    private String publishDate; // Yayın tarihi (Örn: "1943")

    // Parametreli Kurucu Metot (Constructor)
    public Book(String name, int pageCount, String authorName, String publishDate) {
        this.name = name;
        this.pageCount = pageCount;
        this.authorName = authorName;
        this.publishDate = publishDate;
    }

    // Getter ve Setter Metotları
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPageCount() {
        return pageCount;
    }

    public void setPageCount(int pageCount) {
        this.pageCount = pageCount;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(String publishDate) {
        this.publishDate = publishDate;
    }

    // Nesneyi okunabilir metin formatında yazdırmak için toString metodu
    @Override
    public String toString() {
        return String.format("Book{isim='%s', sayfaSayisi=%d, yazar='%s', yayinTarihi='%s'}",
                name, pageCount, authorName, publishDate);
    }
}
`;

export const MAIN_JAVA_CODE = `/**
 * ============================================================================
 * Proje: Java 102 - Kitap Listesi (Book List) Ödevi
 * Geliştirici: Enes Öztürk
 * Sınıf: Main (Uygulama Giriş Noktası & Stream İşlemleri)
 * ============================================================================
 * 1) Book sınıfından 10 adet nesne üretilip ArrayList yapısında saklanır.
 * 2) Stream yapısı ve Lambda ifadeleriyle Kitap İsmi -> Yazar İsmi eşleşmesi
 *    içeren yeni bir Map<String, String> üretilir.
 * 3) 10 elemanlık listeden sayfa sayısı 100'den fazla olan kitaplar filtrelenip
 *    yeni bir List<Book> olarak elde edilir.
 */

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        System.out.println("================================================================");
        System.out.println("   JAVA 102 - STREAM & LAMBDA KİTAP LİSTESİ ÖDEVİ              ");
        System.out.println("   Geliştirici: Enes Öztürk                                     ");
        System.out.println("================================================================\\n");

        // ADIM 1: Book sınıfından 10 tane nesne üretip ArrayList'te saklama
        List<Book> bookList = new ArrayList<>();
        bookList.add(new Book("Küçük Prens", 96, "Antoine de Saint-Exupéry", "1943"));
        bookList.add(new Book("Dönüşüm", 80, "Franz Kafka", "1915"));
        bookList.add(new Book("Kürk Mantolu Madonna", 160, "Sabahattin Ali", "1943"));
        bookList.add(new Book("Satranç", 84, "Stefan Zweig", "1942"));
        bookList.add(new Book("Beyaz Gemi", 168, "Cengiz Aytmatov", "1970"));
        bookList.add(new Book("Simyacı", 184, "Paulo Coelho", "1988"));
        bookList.add(new Book("Tutunamayanlar", 724, "Oğuz Atay", "1972"));
        bookList.add(new Book("İnsan Neyle Yaşar?", 92, "Lev Tolstoy", "1885"));
        bookList.add(new Book("Saatleri Ayarlama Enstitüsü", 382, "Ahmet Hamdi Tanpınar", "1961"));
        bookList.add(new Book("1984", 352, "George Orwell", "1949"));

        System.out.println(">>> 1. Başlangıç Kitap Listesi (Toplam: " + bookList.size() + " Kitap)");
        bookList.forEach(book -> System.out.println("  • " + book.getName() + " (" + book.getPageCount() + " sayfa) - " + book.getAuthorName()));
        System.out.println();

        // ADIM 2: Stream ve Lambda ile Map<String, String> oluşturma (Kitap İsmi -> Yazar İsmi)
        // Alternatif 1: Lambda ifadesi ile: (book -> book.getName(), book -> book.getAuthorName())
        // Alternatif 2: Method Reference ile: (Book::getName, Book::getAuthorName)
        Map<String, String> bookAuthorMap = bookList.stream()
                .collect(Collectors.toMap(
                        book -> book.getName(),        // Key: Kitap İsmi
                        book -> book.getAuthorName()   // Value: Yazarın İsmi
                ));

        System.out.println(">>> 2. Stream ile Üretilen Map<String, String> (Kitap İsmi -> Yazar İsmi)");
        System.out.println("----------------------------------------------------------------");
        bookAuthorMap.forEach((kitap, yazar) ->
                System.out.printf("  [Kitap]: %-28s --> [Yazar]: %s%n", kitap, yazar)
        );
        System.out.println("----------------------------------------------------------------");
        System.out.println("  Map Toplam Eleman Sayısı: " + bookAuthorMap.size() + "\\n");

        // ADIM 3: Sayfa sayısı 100'den büyük olan kitapları filtreleme
        // filter() ara işlemi (intermediate operation) bir Predicate functional interface alır: b -> b.getPageCount() > 100
        List<Book> booksOver100Pages = bookList.stream()
                .filter(book -> book.getPageCount() > 100)
                .collect(Collectors.toList()); // Java 16+ için .toList() de kullanılabilir

        System.out.println(">>> 3. Sayfa Sayısı 100'den Fazla Olan Kitaplar Listesi");
        System.out.println("----------------------------------------------------------------");
        booksOver100Pages.forEach(book ->
                System.out.printf("  ✓ %-28s | %3d Sayfa | %s (%s)%n",
                        book.getName(), book.getPageCount(), book.getAuthorName(), book.getPublishDate())
        );
        System.out.println("----------------------------------------------------------------");
        System.out.println("  100 Sayfadan Fazla Kitap Sayısı: " + booksOver100Pages.size() + " / " + bookList.size());
        System.out.println("\\n================================================================");
        System.out.println("   Ödev Başarıyla Tamamlandı! | İmzalı: Enes Öztürk            ");
        System.out.println("================================================================");
    }
}
`;

export const STREAM_CONCEPTS = [
  {
    title: "1. Stream Kaynağı (Source)",
    code: "bookList.stream()",
    desc: "ArrayList verisini bir veri akışına dönüştürür. Orijinal listeyi değiştirmez (immutability prensibi)."
  },
  {
    title: "2. Ara İşlem (Intermediate Operation): filter()",
    code: ".filter(book -> book.getPageCount() > 100)",
    desc: "Predicate<T> lambda fonksiyonu alır (true/false döner). Yalnızca koşulu sağlayan nesneler boru hattında (pipeline) ilerler."
  },
  {
    title: "3. Sonlandırıcı İşlem (Terminal Operation): collect()",
    code: ".collect(Collectors.toMap(k, v)) / .collect(Collectors.toList())",
    desc: "Akıştaki verileri istenen hedef veri yapısına (Map veya List) toplar. Bu metot çağrılana kadar ara işlemler tembel (lazy) olarak bekler."
  },
  {
    title: "4. Lambda İfadesi Anatomisi",
    code: "book -> book.getName()  ===  Book::getName",
    desc: "Tek bir soyut metodu olan Functional Interface'leri (Function, Predicate, Consumer) anonim sınıf yazmadan yalın sözdizimiyle uygular."
  }
];
