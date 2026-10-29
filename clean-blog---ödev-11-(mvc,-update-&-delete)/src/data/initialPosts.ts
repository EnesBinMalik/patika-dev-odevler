import { BlogPost } from '../types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    _id: '654a1b2c3d4e5f6a7b8c9d01',
    title: 'Node.js ve Express ile MVC Mimarisi: Temiz Kodun Temelleri',
    subtitle: 'Model-View-Controller deseniyle backend uygulamalarında kod karmaşasına son veriyoruz.',
    detail: `Yazılım geliştirme süreçlerinde projeler büyüdükçe kod tabanının yönetimi zorlaşır. İşte bu noktada MVC (Model-View-Controller) mimari deseni imdadımıza yetişir.

### 1. Model (Veri Katmanı)
Model katmanı, MongoDB / Mongoose gibi veritabanı şemalarımızı ve veri işleme kurallarını barındırır. Bu katmanda verinin nasıl saklanacağı, doğrulanacağı (validation) ve ilişkileri tanımlanır.

### 2. View (Görünüm Katmanı)
Kullanıcının gördüğü arayüzdür. Projemizde EJS (Embedded JavaScript) şablon motorunu kullanarak dinamik HTML sayfaları oluşturuyoruz. partials klasörü ile navbar, footer ve header gibi tekrarlayan parçaları modüler hale getiriyoruz.

### 3. Controller (İş Mantığı Katmanı)
Model ile View arasındaki köprüdür. İstekleri (Request) karşılar, gerekli veriyi Model'den çeker veya günceller, ardından uygun View şablonuna ileterek kullanıcıya yanıt (Response) üretir.

Clean Blog projemizin 5. bölümünde controller mantığını \`postController.js\` ve \`pageController.js\` dosyalarına ayırarak projemizi saf MVC yapısına kavuşturduk.`,
    author: 'Enes Öztürk',
    category: 'Node.js & Mimari',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
    dateCreated: '2026-10-24T14:30:00.000Z',
    readTimeMinutes: 5,
    likes: 42
  },
  {
    _id: '654a1b2c3d4e5f6a7b8c9d02',
    title: 'Clean Blog 5. Bölüm: post.ejs Üzerinde UPDATE ve DELETE İşlemleri',
    subtitle: 'method-override paketi yardımıyla RESTful standartlarında blog yazısı güncelleme ve silme.',
    detail: `Patika.dev Node.js eğitimimizin Clean Blog projesinde en heyecan verici adımlardan biri olan 5. bölüme geldik! Bu aşamada temel CRUD (Create, Read, Update, Delete) operasyonlarının son iki halkasını tamamladık.

HTML formları doğası gereği yalnızca GET ve POST isteklerini destekler. Ancak modern RESTful API tasarımında bir kaynağı güncellemek için PUT, silmek içinse DELETE HTTP metodları kullanılır.

### Nasıl Çözdük?
Express ekosistemindeki \`method-override\` ara yazılımını (middleware) projemize dahil ettik:
\`\`\`javascript
const methodOverride = require('method-override');
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));
\`\`\`

Böylece \`post.ejs\` içerisine yerleştirdiğimiz butonlarla:
- **UPDATE Butonu**: Kullanıcıyı ilgili postun düzenleme sayfasına (\`/posts/edit/<%= post._id %>\`) yönlendirir.
- **DELETE Butonu**: Bir onay (confirm) uyarısı ile \`/posts/<%= post._id %>?_method=DELETE\` endpointine istek atarak veritabanından güvenle siler.`,
    author: 'Enes Öztürk',
    category: 'Ödev Çözümleri',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
    dateCreated: '2026-10-27T09:15:00.000Z',
    readTimeMinutes: 4,
    likes: 88
  },
  {
    _id: '654a1b2c3d4e5f6a7b8c9d03',
    title: 'Mongoose ile MongoDB CRUD Operasyonları ve Hata Yönetimi',
    subtitle: 'findByIdAndUpdate ve findByIdAndDelete metodlarının pratik kullanımı ve dikkat edilmesi gerekenler.',
    detail: `Veritabanı işlemlerinde Mongoose ODM (Object Data Modeling) katmanı, Node.js geliştiricilerine muazzam bir esneklik ve tip güvencesi sunar.

Clean Blog projemizde Post şeması şu şekilde yapılandırılmıştır:
- \`title\`: Yazının başlığı (Zorunlu String)
- \`detail\`: Yazının ana metni (Zorunlu String)
- \`dateCreated\`: Oluşturulma tarihi (Varsayılan: Date.now)

Güncelleme işleminde \`Post.findByIdAndUpdate(req.params.id, req.body, { new: true })\` kullanarak güncellenmiş nesneyi doğrudan elde edebiliyoruz. Silme işleminde ise \`Post.findByIdAndDelete(req.params.id)\` fonksiyonu tek satırda silme işlemini gerçekleştirir.`,
    author: 'Enes Öztürk',
    category: 'Veritabanı',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
    dateCreated: '2026-10-28T18:45:00.000Z',
    readTimeMinutes: 6,
    likes: 56
  },
  {
    _id: '654a1b2c3d4e5f6a7b8c9d04',
    title: 'EJS Şablon Motoru ve Sayfa Parçalama (Partials) Stratejisi',
    subtitle: 'DRY (Don\'t Repeat Yourself) prensibiyle header, nav ve footer bileşenlerini yönetmek.',
    detail: `Web geliştirme serüvenimizde aynı HTML kodlarını onlarca sayfaya kopyalayıp yapıştırmak en büyük tuzaklardan biridir. EJS şablon motorunun sunduğu \`<%- include('partials/_header') %>\` özelliği sayesinde sayfa iskeletini tek merkezden yönetiyoruz.

Clean Blog projemizde oluşturduğumuz dosya yapısı:
- \`views/partials/_header.ejs\` : Meta etiketleri ve CSS bağlantıları
- \`views/partials/_navigation.ejs\` : Üst menü ve bağlantılar
- \`views/partials/_footer.ejs\` : Sosyal medya ikonları ve Enes Öztürk imzası

Böylece tasarımda yapacağımız tek bir değişiklik tüm sayfalara anında yansır.`,
    author: 'Enes Öztürk',
    category: 'Frontend & Template',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80',
    dateCreated: '2026-10-29T08:00:00.000Z',
    readTimeMinutes: 3,
    likes: 31
  }
];
