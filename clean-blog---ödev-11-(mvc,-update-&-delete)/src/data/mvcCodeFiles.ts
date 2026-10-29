import { MVCFile } from '../types';

export const MVC_FILES: MVCFile[] = [
  {
    id: 'post-ejs',
    name: 'views/post.ejs',
    path: 'views/post.ejs',
    category: 'view',
    language: 'html',
    description: 'Ödev 11 Madde 1: post.ejs template içerisinde UPDATE ve DELETE butonları',
    odevNote: 'ÖDEV 11 GEREKSİNİMİ 1: post.ejs içerisine UPDATE butonu (edit sayfasına link) ve DELETE butonu (method-override ile silme isteği) eklendi.',
    highlightLines: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
    code: `<%- include('partials/_header') %>

<body>

  <!-- Navigation -->
  <%- include('partials/_navigation') %>

  <!-- Page Header -->
  <header class="masthead" style="background-image: url('<%= post.imageUrl || '/img/post-bg.jpg' %>')">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="post-heading">
            <h1><%= post.title %></h1>
            <h2 class="subheading"><%= post.subtitle %></h2>
            <span class="meta">Yayınlayan:
              <a href="#"><%= post.author || 'Enes Öztürk' %></a>
              <%= post.dateCreated.toLocaleDateString('tr-TR') %> tarihinde yüklendi
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Post Content -->
  <article>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <p class="post-detail-content">
            <%= post.detail %>
          </p>

          <hr class="my-4">

          <!-- ======================================================== -->
          <!-- ÖDEV 11 - GEREKSİNİM 1: UPDATE & DELETE BUTONLARI        -->
          <!-- İmzalı: Enes Öztürk                                      -->
          <!-- ======================================================== -->
          <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <!-- 1. UPDATE BUTONU: Düzenleme sayfasına yönlendirir -->
            <a href="/posts/edit/<%= post._id %>" class="btn btn-warning text-white font-weight-bold px-4 py-2 shadow-sm">
              <i class="fas fa-edit mr-2"></i> UPDATE (GÜNCELLE)
            </a>

            <!-- 2. DELETE BUTONU: method-override (?_method=DELETE) ile postController.deletePost çağırır -->
            <a href="/posts/<%= post._id %>?_method=DELETE" 
               class="btn btn-danger font-weight-bold px-4 py-2 shadow-sm"
               onclick="return confirm('Bu yazıyı silmek istediğinizden emin misiniz? (Enes Öztürk - Clean Blog)')">
              <i class="fas fa-trash-alt mr-2"></i> DELETE (SİL)
            </a>
          </div>
          <!-- ======================================================== -->

        </div>
      </div>
    </div>
  </article>

  <hr>

  <!-- Footer -->
  <%- include('partials/_footer') %>

</body>
</html>`
  },
  {
    id: 'edit-ejs',
    name: 'views/edit.ejs',
    path: 'views/edit.ejs',
    category: 'view',
    language: 'html',
    description: 'Ödev 11 Madde 2: Post verisini güncellemek için form template (PUT isteği)',
    odevNote: 'ÖDEV 11 GEREKSİNİMİ 2: Form action="/posts/<%= post._id %>?_method=PUT" method="POST" ile mevcut verileri inputlara doldurur ve günceller.',
    highlightLines: [24, 25, 26, 31, 38, 45],
    code: `<%- include('partials/_header') %>

<body>

  <!-- Navigation -->
  <%- include('partials/_navigation') %>

  <!-- Page Header -->
  <header class="masthead" style="background-image: url('/img/contact-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="page-heading">
            <h1>Yazıyı Güncelle</h1>
            <span class="subheading">Clean Blog - Ödev 11 (Enes Öztürk)</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto">
        <!-- METHOD-OVERRIDE: PUT İSTEĞİ İLE GÜNCELLEME FORMU -->
        <form method="POST" action="/posts/<%= post._id %>?_method=PUT" novalidate>
          <div class="control-group">
            <div class="form-group floating-label-form-group controls">
              <label>Yazı Başlığı</label>
              <input type="text" 
                     class="form-control" 
                     placeholder="Başlık" 
                     name="title" 
                     value="<%= post.title %>" 
                     required>
            </div>
          </div>
          
          <div class="control-group">
            <div class="form-group floating-label-form-group controls">
              <label>Alt Başlık</label>
              <input type="text" 
                     class="form-control" 
                     placeholder="Alt Başlık" 
                     name="subtitle" 
                     value="<%= post.subtitle %>">
            </div>
          </div>

          <div class="control-group">
            <div class="form-group floating-label-form-group controls">
              <label>Yazı Detayı (İçerik)</label>
              <textarea rows="6" 
                        class="form-control" 
                        placeholder="İçerik" 
                        name="detail" 
                        required><%= post.detail %></textarea>
            </div>
          </div>

          <br>
          <div id="success"></div>
          <div class="d-flex justify-content-between">
            <a href="/posts/<%= post._id %>" class="btn btn-secondary">İptal</a>
            <button type="submit" class="btn btn-primary" id="sendMessageButton">
              Güncellemeleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <hr>

  <!-- Footer -->
  <%- include('partials/_footer') %>

</body>
</html>`
  },
  {
    id: 'post-controller',
    name: 'controllers/postController.js',
    path: 'controllers/postController.js',
    category: 'controller',
    language: 'javascript',
    description: 'Ödev 11 Madde 2, 3 & 4: Post CRUD operasyonlarını barındıran MVC Controller',
    odevNote: 'ÖDEV 11 GEREKSİNİMLERİ 2, 3, 4: updatePost (findByIdAndUpdate) ve deletePost (findByIdAndDelete) fonksiyonları MVC standartlarında yazıldı.',
    highlightLines: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
    code: `/**
 * @project Clean Blog - Bölüm 5 (Ödev 11)
 * @author Enes Öztürk
 * @description MVC Mimarisi - Post Controller İş Mantığı
 */

const Post = require('../models/Post');

// 1. Tüm postları listele (Anasayfa)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort('-dateCreated');
    res.render('index', {
      posts
    });
  } catch (error) {
    res.status(500).send('Postlar getirilirken hata oluştu: ' + error.message);
  }
};

// 2. Tekil post detayını getir (post.ejs)
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post bulunamadı!');
    }
    res.render('post', {
      post
    });
  } catch (error) {
    res.status(404).send('Post bulunamadı: ' + error.message);
  }
};

// 3. Yeni post oluştur (POST /posts)
exports.createPost = async (req, res) => {
  try {
    await Post.create(req.body);
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Post oluşturulamadı: ' + error.message);
  }
};

// ===================================================================
// ÖDEV 11 - GEREKSİNİM 2: POST VERİSİNİ GÜNCELLEME (UPDATE)
// ===================================================================
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Güncellenecek post bulunamadı');
    }

    // Gelen form verileriyle alanları güncelle
    post.title = req.body.title;
    post.subtitle = req.body.subtitle;
    post.detail = req.body.detail;
    await post.save();

    // Alternatif tek satır yöntem:
    // await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Güncelleme tamamlandıktan sonra güncel post detay sayfasına yönlendir
    res.redirect(\`/posts/\${req.params.id}\`);
  } catch (error) {
    res.status(500).send('Güncelleme sırasında hata: ' + error.message);
  }
};

// ===================================================================
// ÖDEV 11 - GEREKSİNİM 3: POST VERİSİNİ SİLME (DELETE)
// ===================================================================
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    // Silme tamamlandıktan sonra anasayfaya yönlendir
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Silme sırasında hata oluştu: ' + error.message);
  }
};
`
  },
  {
    id: 'page-controller',
    name: 'controllers/pageController.js',
    path: 'controllers/pageController.js',
    category: 'controller',
    language: 'javascript',
    description: 'Ödev 11 Madde 4: Sayfa renderlama işlemlerini yöneten Page Controller',
    odevNote: 'ÖDEV 11 GEREKSİNİMİ 4: MVC ayrıştırmasında statik ve form sayfaları (About, Add, Edit) pageController içerisinde toplanmıştır.',
    highlightLines: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    code: `/**
 * @project Clean Blog - Bölüm 5 (Ödev 11)
 * @author Enes Öztürk
 * @description MVC Mimarisi - Sayfa Yönlendirme Controller'ı
 */

const Post = require('../models/Post');

// Hakkımda sayfasını getir
exports.getAboutPage = (req, res) => {
  res.render('about');
};

// Yeni Post Ekleme sayfasını getir
exports.getAddPage = (req, res) => {
  res.render('add_post');
};

// ===================================================================
// ÖDEV 11 - GEREKSİNİM 2: POST DÜZENLEME (EDIT) SAYFASINI GETİR
// ===================================================================
exports.getEditPage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Düzenlenecek post bulunamadı');
    }
    // edit.ejs şablonuna mevcut post verisini gönder
    res.render('edit', {
      post
    });
  } catch (error) {
    res.status(500).send('Sayfa yüklenirken hata oluştu: ' + error.message);
  }
};
`
  },
  {
    id: 'post-model',
    name: 'models/Post.js',
    path: 'models/Post.js',
    category: 'model',
    language: 'javascript',
    description: 'Ödev 11 Madde 4: Mongoose Post Veri Modeli ve Şeması',
    odevNote: 'ÖDEV 11 GEREKSİNİMİ 4: Model katmanı; title, detail, subtitle ve dateCreated alanlarıyla oluşturulmuştur.',
    highlightLines: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    code: `/**
 * @project Clean Blog - Bölüm 5 (Ödev 11)
 * @author Enes Öztürk
 * @description Mongoose Post Modeli (MVC - Model Katmanı)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Şeması Tanımı
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  detail: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Enes Öztürk'
  },
  imageUrl: {
    type: String,
    default: '/img/post-bg.jpg'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
`
  },
  {
    id: 'app-js',
    name: 'app.js',
    path: 'app.js',
    category: 'config',
    language: 'javascript',
    description: 'Express sunucu konfigürasyonu, method-override ve MVC rotaları',
    odevNote: 'ÖDEV 11 GEREKSİNİMİ: method-override middleware tanımı ve controller rotaları (GET/PUT/DELETE) MVC yapısında bağlandı.',
    highlightLines: [18, 19, 20, 31, 32, 33, 34, 35, 36, 37],
    code: `/**
 * ========================================================
 * Ödev 11 - Clean Blog Projesi 5. Bölüm
 * Hazırlayan / İmzalı: Enes Öztürk
 * ========================================================
 */

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejs = require('ejs');
const path = require('path');

// MVC Controller'ları dahil et
const postController = require('./controllers/postController');
const pageController = require('./controllers/pageController');

const app = express();

// Veritabanı Bağlantısı (MongoDB)
mongoose.connect('mongodb://127.0.0.1:27017/cleanblog-test-db')
  .then(() => console.log('MongoDB veritabanına başarıyla bağlanıldı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Şablon Motoru (Template Engine)
app.set('view engine', 'ejs');

// Ortak Middleware'lar
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===================================================================
// ÖDEV 11: method-override middleware (PUT ve DELETE istekleri için)
// ===================================================================
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET']
  })
);

// ===================================================================
// MVC ROTALARI (ROUTES)
// ===================================================================

// Sayfa Rotaları (pageController)
app.get('/about', pageController.getAboutPage);
app.get('/add_post', pageController.getAddPage);
app.get('/posts/edit/:id', pageController.getEditPage); // Ödev 11: Edit sayfası

// Post CRUD Rotaları (postController)
app.get('/', postController.getAllPosts);
app.get('/posts/:id', postController.getPost);
app.post('/posts', postController.createPost);
app.put('/posts/:id', postController.updatePost);       // Ödev 11: Post güncelleme
app.delete('/posts/:id', postController.deletePost);    // Ödev 11: Post silme

// Sunucuyu Dinle
const port = 5000;
app.listen(port, () => {
  console.log(\`Clean Blog sunucusu \${port} portunda çalışıyor... İmzalı: Enes Öztürk\`);
});
`
  },
  {
    id: 'footer-ejs',
    name: 'views/partials/_footer.ejs',
    path: 'views/partials/_footer.ejs',
    category: 'view',
    language: 'html',
    description: 'Enes Öztürk imzalı footer partial bileşeni',
    odevNote: 'Enes Öztürk imzası ve sosyal linkler.',
    highlightLines: [27, 28, 29, 30],
    code: `<!-- Footer -->
<footer>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto text-center">
        <ul class="list-inline text-center">
          <li class="list-inline-item">
            <a href="https://github.com/enesbino38" target="_blank">
              <span class="fa-stack fa-lg">
                <i class="fas fa-circle fa-stack-2x"></i>
                <i class="fab fa-github fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
          <li class="list-inline-item">
            <a href="https://linkedin.com" target="_blank">
              <span class="fa-stack fa-lg">
                <i class="fas fa-circle fa-stack-2x"></i>
                <i class="fab fa-linkedin fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </li>
        </ul>
        <p class="copyright text-muted">
          Copyright &copy; Enes Öztürk 2026 | Patika.dev Node.js Ödev 11 Clean Blog Projesi
        </p>
      </div>
    </div>
  </div>
</footer>`
  }
];
