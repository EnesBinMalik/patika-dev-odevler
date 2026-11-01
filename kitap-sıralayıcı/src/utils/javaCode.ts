import { BookItem } from '../types/book';
import { compareBooksByName, compareBooksByPage } from '../data/defaultBooks';

export function getBookJavaCode(): string {
  return `/**
 * Kitap Sıralayıcı Projesi
 * Book sınıfı: Comparable<Book> arayüzünü uygular.
 * @author Enes Öztürk
 */
public class Book implements Comparable<Book> {
    private String name;         // Kitap İsmi
    private int pageCount;       // Sayfa Sayısı
    private String author;       // Yazarın İsmi
    private String publishDate;  // Yayın Tarihi

    // Parametreli Yapıcı (Constructor)
    public Book(String name, int pageCount, String author, String publishDate) {
        this.name = name;
        this.pageCount = pageCount;
        this.author = author;
        this.publishDate = publishDate;
    }

    /**
     * Comparable interface'inden gelen compareTo metodunu override ediyoruz.
     * Kitapları A'dan Z'ye isme göre alfabetik olarak sıralar.
     */
    @Override
    public int compareTo(Book o) {
        return this.name.compareToIgnoreCase(o.getName());
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

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(String publishDate) {
        this.publishDate = publishDate;
    }

    @Override
    public String toString() {
        return String.format("%-25s | Sayfa: %-4d | Yazar: %-22s | Tarih: %s",
                name, pageCount, author, publishDate);
    }
}`;
}

export function getMainJavaCode(books: BookItem[]): string {
  const objectInstantiations = books
    .map(
      (b, idx) =>
        `        Book book${idx + 1} = new Book("${b.name}", ${b.pageCount}, "${b.author}", "${b.publishDate}");`
    )
    .join('\n');

  const addCalls = books
    .map((_, idx) => `        bookSetByName.add(book${idx + 1});`)
    .join('\n');

  const addCalls2 = books
    .map((_, idx) => `        bookSetByPage.add(book${idx + 1});`)
    .join('\n');

  return `import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

/**
 * Kitap Sıralayıcı Ana Program
 * 1. Set: A'dan Z'ye isme göre sıralama (Comparable<Book>)
 * 2. Set: Sayfa sayısına göre sıralama (Comparator<Book>)
 * @author Enes Öztürk
 */
public class Main {
    public static void main(String[] args) {
        // 5 Adet Book nesnesi oluşturuluyor
${objectInstantiations}

        // 1. SET: Comparable kullanılarak A'dan Z'ye İsme Göre Sıralı Set
        Set<Book> bookSetByName = new TreeSet<>();
${addCalls}

        System.out.println("==========================================================================");
        System.out.println("1. SET: KİTAPLAR A'DAN Z'YE İSME GÖRE SIRALANIYOR (Comparable)");
        System.out.println("==========================================================================");
        for (Book book : bookSetByName) {
            System.out.println(book);
        }

        // 2. SET: Comparator kullanılarak Sayfa Sayısına Göre Sıralı Set
        // Not: TreeSet aynı değere sahip elemanları tek saymasın diye sayfa sayısı
        // eşit olduğunda tie-breaker olarak kitap ismini kontrol ediyoruz.
        Set<Book> bookSetByPage = new TreeSet<>(new Comparator<Book>() {
            @Override
            public int compare(Book b1, Book b2) {
                int pageDiff = Integer.compare(b1.getPageCount(), b2.getPageCount());
                if (pageDiff != 0) {
                    return pageDiff; // Sayfa sayısına göre küçükten büyüğe
                }
                return b1.getName().compareToIgnoreCase(b2.getName()); // Eşitlik durumunda isim
            }
        });

${addCalls2}

        System.out.println("\\n==========================================================================");
        System.out.println("2. SET: KİTAPLAR SAYFA SAYISINA GÖRE SIRALANIYOR (Comparator)");
        System.out.println("==========================================================================");
        for (Book book : bookSetByPage) {
            System.out.println(book);
        }
    }
}`;
}

export function generateConsoleOutput(books: BookItem[]): string {
  const sortedByName = [...books].sort(compareBooksByName);
  const sortedByPage = [...books].sort(compareBooksByPage);

  const divider = '--------------------------------------------------------------------------------';
  const headerFormat = (name: string, pages: number, author: string, date: string | number) => {
    return `${name.padEnd(25)} | Sayfa: ${String(pages).padEnd(4)} | Yazar: ${author.padEnd(22)} | Tarih: ${date}`;
  };

  const lines: string[] = [
    '$ javac Book.java Main.java',
    '$ java Main',
    '================================================================================',
    "1. SET: KİTAPLAR A'DAN Z'YE İSME GÖRE SIRALANIYOR (Comparable - TreeSet<Book>)",
    '================================================================================',
    divider,
  ];

  sortedByName.forEach((b) => {
    lines.push(headerFormat(b.name, b.pageCount, b.author, b.publishDate));
  });

  lines.push('');
  lines.push('================================================================================');
  lines.push('2. SET: KİTAPLAR SAYFA SAYISINA GÖRE SIRALANIYOR (Comparator - TreeSet<Book>)');
  lines.push('================================================================================');
  lines.push(divider);

  sortedByPage.forEach((b) => {
    lines.push(headerFormat(b.name, b.pageCount, b.author, b.publishDate));
  });

  lines.push('');
  lines.push('[Program başarıyla sonlandı - Exit code: 0]');
  lines.push('Tasarım & Kodlama: Enes Öztürk');

  return lines.join('\n');
}
