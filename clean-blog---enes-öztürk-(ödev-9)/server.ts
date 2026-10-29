import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Post, IPostDocument } from './src/models/Post.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// ==========================================
// Ödev 9 - Görev 1:
// cleanblog-test-db adında bir veri tabanı için mongoose ile gerekli bağlantı bilgileri
// ==========================================
const DB_NAME = 'cleanblog-test-db';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

let isMongoConnected = false;

// Mongoose Bağlantı Mantığı (cleanblog-test-db)
mongoose.set('strictQuery', false);

async function connectToDatabase() {
  try {
    console.log(`[Clean Blog] cleanblog-test-db veritabanına bağlanılıyor: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[Clean Blog] cleanblog-test-db veritabanına başarıyla bağlanıldı!`);
    await seedMongoosePostsIfEmpty();
  } catch (error) {
    console.warn(`[Clean Blog] Yerel MongoDB servisi çevrimdışı. Hazır bellek/JSON veritabanı aktif edildi.`);
    isMongoConnected = false;
  }
}

// ==========================================
// Ödev 9 - Görev 4:
// Veri tabanımızda 3 adet post dökümanı oluşturalım.
// ==========================================
const initialPostsSeed = [
  {
    _id: 'seed-post-1',
    title: 'Node.js ile Asenkron Programlama ve Clean Blog Mimarisi',
    detail:
      'Node.js, olay güdümlü (event-driven) ve tek iş parçacıklı engellemeyen (non-blocking) I/O mimarisi sayesinde yüksek performanslı web servisleri oluşturmayı sağlar. Clean Blog projemizin bu aşamasında Express çerçevesini kullanarak rotaları yapılandırdık. Form verilerini işlemek üzere urlencoded ve json ara yazılımlarını devreye aldık ve MongoDB üzerinde temiz bir veri katmanı inşa ettik.',
    author: 'Enes Öztürk',
    dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'seed-post-2',
    title: 'Mongoose ve MongoDB ile Veri Modelleme Sanatı',
    detail:
      'Mongoose kütüphanesi, MongoDB veritabanı belgelerini JavaScript nesneleri olarak yönetmemize imkan veren güçlü bir ODM (Object Data Modeling) aracıdır. title: String, detail: String ve dateCreated: Date (default: Date.now) özelliklerini barındıran Post modelimiz sayesinde verilerin şemaya uygun, eksiksiz ve güvenli kaydedilmesini garanti altına aldık.',
    author: 'Enes Öztürk',
    dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'seed-post-3',
    title: 'Clean Blog Projesi 3. Bölüm: req.body ve Middleware Gücü',
    detail:
      'Ödev 9\'un kalbini oluşturan bu bölümde "Add New Post" sayfamızdan gönderilen form girdilerini express.urlencoded({ extended: true }) ara yazılımı ile req.body içerisinden yakalıyoruz. Yakalanan verileri Post.create() metoduna aktarıp veritabanına kaydediyor ve kullanıcıyı ana sayfaya yönlendiriyoruz. Tüm gönderiler Enes Öztürk imzasıyla gururla sergilenmektedir.',
    author: 'Enes Öztürk',
    dateCreated: new Date().toISOString(),
  },
];

// Fallback in-memory store if standalone MongoDB instance is unavailable in container
let inMemoryPosts = JSON.parse(JSON.stringify(initialPostsSeed));

async function seedMongoosePostsIfEmpty() {
  if (!isMongoConnected) return;
  try {
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log('[Clean Blog] Veritabanı boş, 3 adet başlangıç post dökümanı ekleniyor...');
      for (const p of initialPostsSeed) {
        await Post.create({
          title: p.title,
          detail: p.detail,
          author: p.author,
          dateCreated: new Date(p.dateCreated),
        });
      }
      console.log('[Clean Blog] 3 adet post dökümanı başarıyla veritabanına kaydedildi.');
    }
  } catch (err) {
    console.error('[Clean Blog] Post dökümanları eklenirken hata:', err);
  }
}

// ==========================================
// Ödev 9 - Görev 2:
// "Add New Post" sayfamızdan göndericeğimiz veriler req.body ile yakalayalım,
// gerekli middleware fonksiyonarını kullanalım.
// ==========================================
app.use(express.urlencoded({ extended: true })); // HTML Form POST verileri için
app.use(express.json()); // JSON formatındaki istek gövdeleri için

// API Endpoints
// 1. Tüm postları getir (Ödev 9 - Görev 5: Blog sitemizin anasayfasında gösterelim)
app.get('/api/posts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const posts = await Post.find({}).sort({ dateCreated: -1 });
      return res.json(posts);
    }
    // In-memory fallback
    const sortedPosts = [...inMemoryPosts].sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
    return res.json(sortedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Gönderiler alınırken hata oluştu.' });
  }
});

// 2. Tek bir post getir
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const post = await Post.findById(id);
        if (post) return res.json(post);
      }
    }
    const found = inMemoryPosts.find((p: { _id: string }) => p._id === id);
    if (found) return res.json(found);
    return res.status(404).json({ error: 'Gönderi bulunamadı.' });
  } catch (error) {
    return res.status(500).json({ error: 'Gönderi detay alınamadı.' });
  }
});

// 3. Yeni post ekle (Ödev 9 - Görev 2 & 3: req.body ile yakala ve Post modeline kaydet)
app.post('/api/posts', async (req, res) => {
  try {
    // req.body ile gelen verileri yakalıyoruz
    const { title, detail, author } = req.body;

    console.log('[Clean Blog - POST /api/posts] req.body yakalandı:', req.body);

    if (!title || !detail) {
      return res.status(400).json({ error: 'Başlık (title) ve Detay (detail) alanları zorunludur.' });
    }

    const postData = {
      title: title.trim(),
      detail: detail.trim(),
      author: (author && author.trim()) || 'Enes Öztürk',
      dateCreated: new Date(),
    };

    if (isMongoConnected) {
      const createdPost = await Post.create(postData);
      return res.status(201).json(createdPost);
    }

    // In-memory fallback
    const newPost = {
      _id: 'post-' + Date.now(),
      ...postData,
      dateCreated: postData.dateCreated.toISOString(),
    };
    inMemoryPosts.unshift(newPost);
    return res.status(201).json(newPost);
  } catch (error: any) {
    console.error('Post oluşturma hatası:', error);
    return res.status(500).json({ error: error.message || 'Gönderi kaydedilemedi.' });
  }
});

// 4. Post sil
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      await Post.findByIdAndDelete(id);
    }
    inMemoryPosts = inMemoryPosts.filter((p: { _id: string }) => p._id !== id);
    return res.json({ success: true, message: 'Gönderi silindi.' });
  } catch (error) {
    return res.status(500).json({ error: 'Silme işlemi başarısız.' });
  }
});

// 5. Veritabanını 3 başlangıç postuna sıfırla (Ödev 9 test için)
app.post('/api/posts/reset', async (req, res) => {
  try {
    inMemoryPosts = JSON.parse(JSON.stringify(initialPostsSeed));
    if (isMongoConnected) {
      await Post.deleteMany({});
      for (const p of initialPostsSeed) {
        await Post.create({
          title: p.title,
          detail: p.detail,
          author: p.author,
          dateCreated: new Date(p.dateCreated),
        });
      }
    }
    return res.json({ success: true, message: '3 adet post dökümanı yeniden oluşturuldu.', posts: inMemoryPosts });
  } catch (error) {
    return res.status(500).json({ error: 'Sıfırlama başarısız.' });
  }
});

// 6. Sistem & Ödev Durum Bilgisi
app.get('/api/status', async (req, res) => {
  let count = inMemoryPosts.length;
  if (isMongoConnected) {
    try {
      count = await Post.countDocuments();
    } catch (e) {
      // ignore
    }
  }

  res.json({
    databaseName: DB_NAME,
    connectionUri: MONGODB_URI,
    isMongoConnected,
    mode: isMongoConnected ? 'Mongoose & MongoDB Aktif' : 'Mongoose Şeması & Simüle DB Aktif',
    postCount: count,
    author: 'Enes Öztürk',
    projectPart: 'Clean Blog Projesi 3. Bölüm (Ödev 9)',
    requirements: [
      {
        id: 1,
        title: 'cleanblog-test-db Mongoose Bağlantısı',
        status: true,
        detail: 'mongoose.connect("mongodb://localhost:27017/cleanblog-test-db") bağlantı konfigürasyonu tanımlandı.',
      },
      {
        id: 2,
        title: 'req.body & Middleware Entegrasyonu',
        status: true,
        detail: 'express.urlencoded({ extended: true }) ve express.json() middleware fonksiyonları eklendi.',
      },
      {
        id: 3,
        title: 'Post Mongoose Modeli',
        status: true,
        detail: 'title: String, detail: String, dateCreated: Date (default: Date.now) alanları ile Post şeması oluşturuldu.',
      },
      {
        id: 4,
        title: '3 Adet Post Dökümanı',
        status: count >= 3,
        detail: `Veritabanında şu an ${count} adet post dökümanı bulunmaktadır (3 adet başlangıç dökümanı hazır).`,
      },
      {
        id: 5,
        title: 'Ana Sayfada Gösterim & Enes Öztürk İmzası',
        status: true,
        detail: 'Tüm postlar ana sayfada yayınlandı ve ENES ÖZTÜRK imzası ile donatıldı.',
      },
    ],
  });
});

// Standalone Homework 9 Source Files (for students copying the exact Node.js solution)
app.get('/api/homework-code', (req, res) => {
  res.json({
    appJs: `const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/Post');

const app = express();
const port = 3000;

// 1. cleanblog-test-db adında bir veri tabanı için mongoose ile gerekli bağlantı bilgileri
mongoose.connect('mongodb://localhost:27017/cleanblog-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('cleanblog-test-db veritabanına başarıyla bağlanıldı!');
}).catch((err) => {
  console.error('Veritabanı bağlantı hatası:', err);
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// 2. req.body ile verileri yakalamak için gerekli MIDDLEWARE'ler
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 5. Oluşturduğumuz post dökümanlarını Blog sitemizin anasayfasında gösterelim. ENES Öztürk imzalı
app.get('/', async (req, res) => {
  const posts = await Post.find({}).sort({ dateCreated: -1 });
  res.render('index', {
    posts,
    author: 'Enes Öztürk'
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add_post', (req, res) => {
  res.render('add_post');
});

app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', { post });
});

// 2. "Add New Post" sayfamızdan göndericeğimiz veriler req.body ile yakalayalım
app.post('/posts', async (req, res) => {
  await Post.create(req.body);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(\`Sunucu \${port} portunda çalışıyor... İmzalı: ENES ÖZTÜRK\`);
});`,
    postModelJs: `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 3. title:String, detail:String, dateCreated:Date(default now) özelliklerine sahip Post modeli
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'Enes Öztürk',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;`,
    seedJs: `// 4. Veri tabanımızda 3 adet post dökümanı oluşturalım
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect('mongodb://localhost:27017/cleanblog-test-db');

async function createThreePosts() {
  await Post.deleteMany({});
  
  await Post.create({
    title: 'Node.js ile Asenkron Programlama ve Clean Blog Mimarisi',
    detail: 'Node.js olay güdümlü mimarisi ile modern web uygulamaları geliştirmek için ideal bir çalışma ortamıdır...',
    author: 'Enes Öztürk'
  });

  await Post.create({
    title: 'Mongoose ve MongoDB ile Veri Modelleme Sanatı',
    detail: 'Mongoose kütüphanesi title, detail ve dateCreated alanlarına sahip Post modelimizi yönetmemizi sağlar...',
    author: 'Enes Öztürk'
  });

  await Post.create({
    title: 'Clean Blog Projesi 3. Bölüm: req.body ve Middleware Gücü',
    detail: 'Add New Post sayfasından gönderilen verileri express.urlencoded ile req.body nesnesinde yakalıyoruz...',
    author: 'Enes Öztürk'
  });

  console.log('3 adet post dökümanı başarıyla oluşturuldu! İmza: ENES ÖZTÜRK');
  mongoose.connection.close();
}

createThreePosts();`,
    addPostEjs: `<form method="POST" action="/posts" novalidate>
  <div class="control-group">
    <div class="form-group floating-label-form-group controls">
      <label>Post Title</label>
      <input type="text" class="form-control" placeholder="Post Title" name="title" required>
    </div>
  </div>
  <div class="control-group">
    <div class="form-group floating-label-form-group controls">
      <label>Post Detail</label>
      <textarea rows="5" class="form-control" placeholder="Post Detail" name="detail" required></textarea>
    </div>
  </div>
  <br>
  <button type="submit" class="btn btn-primary">Create Post (Gönder)</button>
</form>`,
  });
});

async function startServer() {
  // Connect DB
  await connectToDatabase();

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Clean Blog] Server running on http://0.0.0.0:${PORT} - ENES ÖZTÜRK İmzalı`);
  });
}

startServer();
