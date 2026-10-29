import { BlogPost } from '../types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Node.js ile Asenkron Programlama Temelleri',
    summary: 'JavaScript tek iş parçacıklı (single-threaded) yapısına rağmen Event Loop mekanizması sayesinde yüksek eşzamanlılığı nasıl başarır?',
    content: `Node.js mimarisinin kalbinde Libuv kütüphanesi ve Event Loop (Olay Döngüsü) yatar. JavaScript kodumuz ana iş parçacığında çalışırken; dosya okuma/yazma, veri tabanı sorguları ve ağ istekleri gibi G/Ç (I/O) işlemleri arka plandaki iş parçacığı havuzuna devredilir.

Bu sayede sunucu bir kullanıcının isteğini beklerken diğer binlerce isteğe kesintisiz hizmet vermeye devam edebilir. Asenkron kod yazarken callback cehenneminden (Callback Hell) kurtulmak için modern JavaScript bize Promise ve async/await yapılarını sunmuştur.`,
    author: 'Enes Öztürk',
    date: '2026-10-18',
    category: 'Node.js',
    readTime: '4 dk okuma',
    tags: ['Node.js', 'Asenkron', 'Event Loop', 'Backend']
  },
  {
    id: 2,
    title: 'Promise Mimarisi ve Zincirleme (Chaining) Mantığı',
    summary: 'Gelecekte tamamlanacak veya reddedilecek bir işlemi temsil eden Promise objeleri nasıl oluşturulur ve yönetilir?',
    content: `Bir Promise üç temel durumda bulunabilir:
1. Pending (Beklemede): İşlem henüz sonuçlanmadı.
2. Fulfilled (Gerçekleşti): İşlem başarıyla tamamlandı (resolve).
3. Rejected (Reddedildi): İşlem hata ile sonuçlandı (reject).

Promise yapısını bir fonksiyon içinde döndürerek asenkron süreçleri zincirleme (.then().then()) metotlarıyla sırayla çalıştırabilir ve .catch() ile tüm hata yönetimini tek bir noktada toplayabiliriz.`,
    author: 'Enes Öztürk',
    date: '2026-10-22',
    category: 'JavaScript',
    readTime: '5 dk okuma',
    tags: ['JavaScript', 'Promise', 'ES6', 'Asenkron']
  },
  {
    id: 3,
    title: 'Async/Await: Asenkron Kodu Senkron Gibi Okunabilir Kılmak',
    summary: 'ES8 ile gelen async/await sözdizimi, Promise tabanlı asenkron işlemleri temiz ve okunması kolay bir hale getirir.',
    content: `async anahtar kelimesi ile tanımlanan her fonksiyon otomatik olarak bir Promise döner. Fonksiyonun içinde kullanılan await ise bu Promise'in çözümlenmesini (resolve) bekler ve çözülen değeri doğrudan bir değişkene atar.

Try/catch blokları kullanarak asenkron akışta meydana gelebilecek hataları geleneksel ve son derece anlaşılır bir şekilde yakalayabiliriz. Bu sayede karmaşık servis istekleri bile yukarıdan aşağıya akıcı bir şekilde okunabilir.`,
    author: 'Enes Öztürk',
    date: '2026-10-26',
    category: 'Modern JS',
    readTime: '3 dk okuma',
    tags: ['Async/Await', 'Clean Code', 'ES8']
  }
];

export const SAMPLE_TEMPLATES: Omit<BlogPost, 'id' | 'author' | 'date'>[] = [
  {
    title: 'Mikroservisler Arası İletişimde Event-Driven Mimari',
    summary: 'Büyük ölçekli sistemlerde servislerin birbiriyle gevşek bağlı (loosely coupled) haberleşmesini sağlayan mesaj kuyrukları.',
    content: 'Mikroservis mimarisinde doğrudan HTTP çağrıları yapmak yerine Kafka veya RabbitMQ gibi kuyruk sistemleri üzerinden event fırlatmak sistemin dayanıklılığını katbekat artırır. Bir servis geçici olarak çöktüğünde mesajlar kaybolmaz ve sistem toparlandığında işlemeye devam eder.',
    category: 'Yazılım Mimarisi',
    readTime: '6 dk okuma',
    tags: ['Mikroservis', 'RabbitMQ', 'Architecture']
  },
  {
    title: 'Veri Tabanı İndeksleme ve Sorgu Performans Optimizasyonu',
    summary: 'B-Tree indeksleme algoritmaları, explain analyze çıktıları ve milyonlarca satır veri içinde milisaniyelik aramalar.',
    content: 'Doğru kolonlara indeks koymak sorgu süresini dakikalardan milisaniyelere düşürebilir. Ancak aşırı indeksleme yazma (INSERT, UPDATE) maliyetini artırır. Bu yüzden sorgu profilleme yaparak yalnızca filtreleme ve sıralamada sık kullanılan kolonlar indekslenmelidir.',
    category: 'Veritabanı',
    readTime: '5 dk okuma',
    tags: ['SQL', 'Performance', 'Database']
  },
  {
    title: 'TypeScript ile Tip Güvenliği ve Domain-Driven Tasarım',
    summary: 'Geniş ölçekli kurumsal uygulamalarda runtime hatalarını derleme aşamasında yakalamanın sırrı.',
    content: 'TypeScript sadece JavaScript üzerine eklenen bir tip katmanı değil; geliştirici deneyimini, refactoring güvenini ve takım içi kod standartlarını kökten değiştiren güçlü bir modelleme aracıdır.',
    category: 'TypeScript',
    readTime: '4 dk okuma',
    tags: ['TypeScript', 'Clean Code', 'Architecture']
  }
];
