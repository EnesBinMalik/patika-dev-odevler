import { BlogPost } from '../types/blog';

export const INITIAL_POSTS: BlogPost[] = [
  {
    _id: "65b91a7f34e81a0014a9c101",
    title: "Node.js ve Express ile Dinamik Rotalar: Tekil Post Sayfası (/posts/:id)",
    subtitle: "Express req.params parametreleri ile MongoDB _id eşleştirmesi ve EJS şablonlama mantığı.",
    detail: "Clean Blog projemizin 4. bölümünde tekil post sayfalarının dinamik olarak nasıl sunulacağını inceliyoruz. index.ejs sayfamızda döngü içerisinde listelenen her bir gönderiye ait benzersiz _id bilgisini '/posts/<%= posts[i]._id %>' bağlantısıyla tarayıcıya gönderiyoruz.\n\nExpress tarafında bu isteği app.get('/posts/:id', async (req, res) => { ... }) rotasıyla yakalıyoruz. Burada req.params.id vasıtasıyla gelen ID değerini Mongoose Post modelimizdeki Post.findById(req.params.id) sorgusuna vererek veri tabanındaki tekil post nesnesine ulaşıyoruz.\n\nElde ettiğimiz post verisini res.render('post', { post }) ile post.ejs görünümüne aktarıyoruz. Bu sayede her bir gönderi kendi başlığı, içeriği ve oluşturulma tarihiyle kullanıcıya kusursuz bir okuma deneyimi sunuyor.",
    dateCreated: "29 Ekim 2026",
    author: "Enes Öztürk"
  },
  {
    _id: "65b91b2234e81a0014a9c102",
    title: "EJS Şablon Motorunda Değişken Aktarımı ve Veri Bağlama",
    subtitle: "Node.js sunucusundan gelen nesnelerin HTML içerisine <%= %> tagleri ile gömülmesi.",
    detail: "EJS (Embedded JavaScript), sunucu tarafında JavaScript değişkenlerini ve kontrol yapılarını HTML çıktısına dönüştürmek için kullandığımız güçlü bir araçtır. Projemizde post.ejs dosyası içerisinde <%= post.title %>, <%= post.detail %> ve <%= post.dateCreated %> yazarak controller'dan gönderilen nesneyi doğrudan sayfaya basıyoruz.\n\nÖdev yönergemize uygun olarak, her bir gönderi için ayrı görsel yüklemek yerine ortak bir Clean Blog başlık görseli (header background) kullanarak sayfa performansını artırıyor ve yalın bir tasarım bütünlüğü elde ediyoruz.",
    dateCreated: "27 Ekim 2026",
    author: "Enes Öztürk"
  },
  {
    _id: "65b91be934e81a0014a9c103",
    title: "Mongoose ve MongoDB ile Veri Modelleme: Post Şeması",
    subtitle: "Schema tanımı, default date değerleri ve ObjectId mekanizması üzerine inceleme.",
    detail: "Veritabanımızda her blog yazısını temsil eden bir Mongoose şeması tanımlıyoruz. Şemamızda title (String), detail (String) ve dateCreated (Date, default: Date.now) alanları yer almaktadır.\n\nMongoDB her döküman oluşturulduğunda otomatik olarak 24 karakterlik onaltılık (hexadecimal) bir '_id' üretir. Bu _id, dokümanın tekilliğini garanti altına alır ve URL rotalarında güvenle sorgulama yapmamıza olanak sağlar.",
    dateCreated: "24 Ekim 2026",
    author: "Enes Öztürk"
  },
  {
    _id: "65b91cb534e81a0014a9c104",
    title: "Clean Blog Mimarisi: Modern Web Geliştirmede Sadeliğin Gücü",
    subtitle: "Start Bootstrap Clean Blog temasından ilham alan tipografik odaklı web mimarisi.",
    detail: "Bir blog platformunun en temel amacı, okuyucunun dikkatini dağıtmadan yazının özüne odaklanmasını sağlamaktır. Büyük ve etkileyici bir hero başlığı, rahat okunan bir serif gövde metni ve temiz bir bilgi akışı Clean Blog temasının kalbini oluşturur.\n\nEnes Öztürk olarak hazırladığım bu projede, hem arka uç (Node.js/Express) hem de ön uç (EJS/HTML5/CSS3) bileşenlerinin kusursuz bir uyum içerisinde çalışmasını hedefledim.",
    dateCreated: "20 Ekim 2026",
    author: "Enes Öztürk"
  }
];
