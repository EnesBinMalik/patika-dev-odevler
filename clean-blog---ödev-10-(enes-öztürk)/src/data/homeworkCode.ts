export interface HomeworkRequirement {
  id: number;
  task: string;
  status: 'completed' | 'in_progress';
  codeSnippet: string;
  fileLocation: string;
  explanation: string;
}

export const HOMEWORK_REQUIREMENTS: HomeworkRequirement[] = [
  {
    id: 1,
    task: "index.ejs içerisinde /posts/<%= posts[i]._id %> ile _id bilgisini gönderelim.",
    status: 'completed',
    fileLocation: "views/index.ejs",
    codeSnippet: `<% for (let i = 0; i < posts.length; i++) { %>
  <div class="post-preview">
    <a href="/posts/<%= posts[i]._id %>">
      <h2 class="post-title"><%= posts[i].title %></h2>
      <h3 class="post-subtitle"><%= posts[i].detail.substring(0, 100) %>...</h3>
    </a>
    <p class="post-meta">
      Posted by <a href="#!">Enes Öztürk</a> on <%= posts[i].dateCreated.toLocaleDateString() %>
    </p>
  </div>
  <hr class="my-4" />
<% } %>`,
    explanation: "index.ejs dosyasında for döngüsü ile posts dizisi taranır. Her bir post kartının <a> etiketine href='/posts/<%= posts[i]._id %>' verilerek kullanıcının tıkladığı gönderinin MongoDB ObjectId'si URL parametresi olarak aktarılır."
  },
  {
    id: 2,
    task: "app.js içerisinde GET metoduyla '/posts/:id' ile gönderilen '_id' yi yakalayalım.",
    status: 'completed',
    fileLocation: "app.js",
    codeSnippet: `// Tekil post sayfası yönlendirmesi
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('post', {
      post: post
    });
  } catch (error) {
    res.status(404).render('404', { message: 'Post bulunamadı' });
  }
});`,
    explanation: "Express router, URL'deki ':id' joker karakterini req.params.id nesnesi olarak yakalar. Mongoose'un Post.findById(req.params.id) metodu çalıştırılarak MongoDB'den o ID'ye ait tekil post dokümanı çekilir."
  },
  {
    id: 3,
    task: "Tekil post bilgilerini post.ejs dosyasına gönderelim.",
    status: 'completed',
    fileLocation: "app.js",
    codeSnippet: `res.render('post', {
  post: post // veya ES6 ile sadece: post
});`,
    explanation: "findById ile veritabanından çekilen post nesnesi, Express'in res.render() fonksiyonunun ikinci parametresi olarak post.ejs şablonuna context objesi halinde aktarılır."
  },
  {
    id: 4,
    task: "post.ejs içerisine post.title, post.detail ve post.dateCreated bilgilerini gönderelim. (her bir post için ayrı image kullanmayacağız) enes öztürk imzasıyla olsun",
    status: 'completed',
    fileLocation: "views/post.ejs",
    codeSnippet: `<!-- Page Header: Her post için ayrı image kullanmayacağız, ortak post-bg.jpg kullanıyoruz -->
<header class="masthead" style="background-image: url('/img/post-bg.jpg')">
  <div class="overlay"></div>
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto">
        <div class="post-heading">
          <h1><%= post.title %></h1>
          <h2 class="subheading"><%= post.detail.substring(0, 80) %>...</h2>
          <span class="meta">
            Posted by <a href="#!">Enes Öztürk</a>
            on <%= post.dateCreated.toLocaleDateString() %>
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
        <p class="post-detail-content"><%= post.detail %></p>
        <hr />
        <div class="author-signature text-muted font-italic">
          Yazar: <strong>Enes Öztürk</strong> | Clean Blog Projesi Bölüm 4
        </div>
      </div>
    </div>
  </div>
</article>`,
    explanation: "post.ejs şablonunda <%= post.title %>, <%= post.detail %> ve <%= post.dateCreated %> alanları görüntülenir. Başlık arka planında her yazı için sabit url('/img/post-bg.jpg') kullanılır. Sayfa altında ve byline kısmında Enes Öztürk imzası yer alır."
  }
];

export const RAW_SOURCE_FILES = {
  app_js: `const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Post = require('./models/Post');

const app = express();
const port = 3000;

// Veritabanı Bağlantısı
mongoose.connect('mongodb://localhost:27017/cleanblog-test-db')
  .then(() => console.log('MongoDB veritabanına bağlanıldı'))
  .catch((err) => console.error('Bağlantı hatası:', err));

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// ROTALAR (ROUTES)
// ==========================================

// Anasayfa: Tüm postları listeleme
app.get('/', async (req, res) => {
  const posts = await Post.find({}).sort('-dateCreated');
  res.render('index', {
    posts: posts
  });
});

// Hakkımda sayfası
app.get('/about', (req, res) => {
  res.render('about');
});

// Yeni Post Ekleme Sayfası
app.get('/add_post', (req, res) => {
  res.render('add_post');
});

// ÖDEV 10: GET metoduyla "/posts/:id" ile gelen _id'yi yakalama ve post.ejs'e gönderme
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render('404', { message: 'Post bulunamadı' });
    }
    // Tekil post bilgilerini post.ejs'e aktarıyoruz
    res.render('post', {
      post: post
    });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

// Yeni Post Oluşturma (POST metodu)
app.post('/posts', async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
});

// Sunucuyu Dinleme
app.listen(port, () => {
  console.log(\`Sunucu port \${port} üzerinde çalışıyor... Hazırlayan: Enes Öztürk\`);
});`,

  index_ejs: `<!DOCTYPE html>
<html lang="tr">
<%- include('partials/_header') %>
<body>
  <!-- Navigation -->
  <%- include('partials/_navigation') %>

  <!-- Page Header -->
  <header class="masthead" style="background-image: url('img/home-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="site-heading">
            <h1>Clean Blog</h1>
            <span class="subheading">A Blog Theme by Start Bootstrap - Enes Öztürk</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-8 col-md-10 mx-auto">
        <!-- ÖDEV 10 GEREKSİNİMİ: /posts/<%= posts[i]._id %> ile yönlendirme -->
        <% for (let i = 0; i < posts.length; i++) { %>
          <div class="post-preview">
            <a href="/posts/<%= posts[i]._id %>">
              <h2 class="post-title">
                <%= posts[i].title %>
              </h2>
              <h3 class="post-subtitle">
                <%= posts[i].detail.substring(0, 100) %>...
              </h3>
            </a>
            <p class="post-meta">Posted by
              <a href="#">Enes Öztürk</a>
              on <%= posts[i].dateCreated.toLocaleDateString() %>
            </p>
          </div>
          <hr>
        <% } %>

        <!-- Pager -->
        <div class="clearfix">
          <a class="btn btn-primary float-right" href="#">Older Posts &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <hr>

  <!-- Footer -->
  <%- include('partials/_footer') %>
</body>
</html>`,

  post_ejs: `<!DOCTYPE html>
<html lang="tr">
<%- include('partials/_header') %>
<body>
  <!-- Navigation -->
  <%- include('partials/_navigation') %>

  <!-- Page Header -->
  <!-- ÖDEV 10: Her bir post için ayrı image kullanmayacağız, ortak post-bg.jpg kullanıyoruz -->
  <header class="masthead" style="background-image: url('/img/post-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="post-heading">
            <!-- post.title ve post.dateCreated dinamik gönderimi -->
            <h1><%= post.title %></h1>
            <h2 class="subheading">Clean Blog - Tekil Gönderi Detayı</h2>
            <span class="meta">Posted by
              <a href="#">Enes Öztürk</a>
              on <%= post.dateCreated.toLocaleDateString() %>
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
          <!-- post.detail dinamik gönderimi -->
          <p class="lead"><%= post.detail %></p>

          <hr class="my-4">

          <div class="author-box border p-4 rounded bg-light">
            <h5>Yazar Hakkında</h5>
            <p class="mb-1"><strong>Enes Öztürk</strong> — Node.js & Web Geliştirici</p>
            <small class="text-muted">Bu sayfa Clean Blog Ödev 10 kapsamı dahilinde dinamik olarak oluşturulmuştur.</small>
          </div>
        </div>
      </div>
    </div>
  </article>

  <hr>

  <!-- Footer -->
  <%- include('partials/_footer') %>
</body>
</html>`,

  model_post_js: `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Şeması Tanımı
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  detail: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

// Post Modelini Dışa Aktarma
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;`
};
