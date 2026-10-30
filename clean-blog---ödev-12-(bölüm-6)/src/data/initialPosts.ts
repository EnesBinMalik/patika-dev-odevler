import { BlogPost } from '../types/blog';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Clean Blog Projesi Bölüm 6: Heroku ve MongoDB Atlas Dağıtımı Tamamlandı',
    subtitle: 'Node.js uygulamamızı buluta taşıdık; Mongoose bağlantısı ve ortam değişkenleri ile kesintisiz canlı yayın.',
    detail: `Clean Blog serimizin 6. ve son bölümünde, yerel makinemizde (localhost:5000) geliştirdiğimiz Node.js & Express blog uygulamamızı tüm dünyanın erişebileceği canlı bir bulut mimarisine taşıdık.

Bu bölümde uyguladığımız temel aşamalar şunlardır:
1. **MongoDB Atlas Ücretsiz Cluster Kurulumu:** Yerel mongodb://localhost:27017/cleanblog-test veritabanı yerine, MongoDB Atlas üzerinde ücretsiz M0 Sandbox oluşturuldu. Veritabanı kullanıcısı ve IP Whitelist (0.0.0.0/0) ayarları yapılandırıldı.
2. **Mongoose Bağlantı Dizesi ve .env Güvenliği:** Veritabanı şifresi ve bağlantı URL'i kod içine gömülmek yerine \`process.env.MONGODB_URI\` üzerinden dinamik hale getirildi.
3. **Heroku Yapılandırması & Procfile:** Uygulamanın Heroku Dyno'ları üzerinde başlaması için \`web: node app.js\` komutunu içeren Procfile dosyası hazırlandı ve package.json içindeki \`engines\` ile \`scripts.start\` güncellendi.
4. **Dinamik Port Yönetimi:** Heroku'nun otomatik atadığı portu dinlemek üzere \`const port = process.env.PORT || 5000;\` mantığı uygulandı.

> "Bir web uygulamasını yerel ortamda çalıştırmak sadece ilk adımdır. Gerçek başarı, onu güvenli ve ölçeklenebilir bir bulut altyapısında canlıya alabilmektir." — Enes Öztürk

*Ödev Notu Hatırlatması:* Eğitmenimizin yönergesi doğrultusunda bu projemizde sayfalama (pagination) ve görsel yükleme (file upload) işlemlerini dahil etmedik. Bir sonraki projemizde bu özellikleri de ekleyerek daha da ileri seviyeye taşıyacağız.`,
    author: 'Enes Öztürk',
    authorEmail: 'enesbino38@gmail.com',
    dateCreated: '2026-10-29',
    readTime: '4 dk okuma',
    category: 'DevOps & Cloud'
  },
  {
    id: 'post-2',
    title: 'Node.js & Express ile MVC Mimarisinin İncelikleri',
    subtitle: 'Kod karmaşasını önlemek için Model, View ve Controller katmanlarını nasıl izole ettik?',
    detail: `Clean Blog projemizin 4. ve 5. bölümlerinde, tüm route ve veritabanı işlemlerini tek bir \`app.js\` dosyasına yığmak yerine profesyonel standart olan MVC (Model-View-Controller) mimarisine geçiş yaptık.

Bu mimari bize şu avantajları sağladı:
- **Models (/models/Post.js):** Mongoose şeması tanımlandı. Başlık (\`title\`), detay (\`detail\`), yazar (\`author\`) ve oluşturulma tarihi (\`dateCreated\`) alanları tipleriyle netleştirildi.
- **Controllers (/controllers/postController.js & pageController.js):** İş mantığı ve veritabanı sorguları (Post.find, Post.findById, Post.create, Post.findByIdAndUpdate, Post.findByIdAndDelete) controller fonksiyonlarında toplandı.
- **Views (/views/):** EJS şablon motoru ve partials yapısı (\`_header.ejs\`, \`_navigation.ejs\`, \`_footer.ejs\`) ile sayfa parçalanabilirliği ve tekrar kullanılabilirliği sağlandı.

Böylece kod tabanımız hem okunabilir hem de yeni özellikler eklemeye son derece hazır bir yapıya kavuştu.`,
    author: 'Enes Öztürk',
    authorEmail: 'enesbino38@gmail.com',
    dateCreated: '2026-10-26',
    readTime: '5 dk okuma',
    category: 'Node.js Mimarisi'
  },
  {
    id: 'post-3',
    title: 'RESTful Rotalar ve Method-Override ile CRUD Operasyonları',
    subtitle: 'HTML formlarının sınırlarını aşarak PUT ve DELETE isteklerini Express ile nasıl yönettik?',
    detail: `Standart HTML5 formları yalnızca GET ve POST isteklerini destekler. Ancak RESTful mimaride bir kaynağı güncellemek için PUT, silmek için ise DELETE HTTP metotlarını kullanmak en iyi uygulamadır.

Clean Blog projemizde bu sorunu \`method-override\` ara yazılımı (middleware) ile çözdük:
\`\`\`javascript
const methodOverride = require('method-override');
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
\`\`\`

Düzenleme formumuzda:
\`\`\`html
<form method="POST" action="/posts/<%= post._id %>?_method=PUT">
\`\`\`
şeklinde istek göndererek REST standartlarına tam sadık kaldık. Silme işlemi için de benzer şekilde onay pencereli bir DELETE isteği tetikledik.`,
    author: 'Enes Öztürk',
    authorEmail: 'enesbino38@gmail.com',
    dateCreated: '2026-10-22',
    readTime: '3 dk okuma',
    category: 'Express.js & REST'
  },
  {
    id: 'post-4',
    title: 'Start Bootstrap Clean Blog Temasının EJS Şablonuna Uyarlanması',
    subtitle: 'Statik HTML temasını dinamik bir blog arayüzüne dönüştürürken dikkat ettiğimiz adımlar.',
    detail: `Projemizin 2. bölümünde dünyaca ünlü 'Clean Blog' temasını projemize dahil ettik. Statik index.html, about.html, post.html ve contact.html sayfalarını EJS motoru ile birleştirdik.

Özellikle şu noktalara odaklandık:
- Genel üst ve alt menülerin tek bir yerde tutulması (\`partials/_navigation.ejs\` ve \`partials/_footer.ejs\`).
- Dinamik sayfa başlıkları ve meta açıklamalarının parametrik hale getirilmesi.
- Tipografi hiyerarşisinde serif başlıklar ile modern sans-serif gövde metninin dengelenmesi.

Bu sayede blogumuz hem editoryal bir ciddiyet kazandı hem de kullanıcılar için akıcı bir okuma deneyimi sundu.`,
    author: 'Enes Öztürk',
    authorEmail: 'enesbino38@gmail.com',
    dateCreated: '2026-10-18',
    readTime: '4 dk okuma',
    category: 'Front-End Entegrasyonu'
  }
];
