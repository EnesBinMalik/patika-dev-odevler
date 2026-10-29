import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Copy, Check, Terminal, FileCode, Database, Layers, Sparkles } from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  postCount: number;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({ isOpen, onClose, postCount }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'appjs' | 'postmodel' | 'seedjs' | 'addpost'>('checklist');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippets = {
    appjs: `// app.js - Clean Blog Projesi 3. Bölüm (Ödev 9)
// ENES ÖZTÜRK İmzalı
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/Post');

const app = express();
const port = 3000;

// ==========================================
// 1. cleanblog-test-db adında bir veri tabanı için mongoose ile bağlantı bilgileri
// ==========================================
mongoose.connect('mongodb://localhost:27017/cleanblog-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('cleanblog-test-db veritabanına başarıyla bağlanıldı!');
}).catch((err) => {
  console.error('Veritabanı bağlantı hatası:', err);
});

// ŞABLON MOTORU (TEMPLATE ENGINE)
app.set('view engine', 'ejs');

// ==========================================
// 2. "Add New Post" sayfamızdan göndericeğimiz verileri
// req.body ile yakalamak için gerekli MIDDLEWARE fonksiyonları
// ==========================================
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // HTML form verilerini req.body'ye ayrıştırır
app.use(express.json()); // JSON istek gövdelerini ayrıştırır

// ==========================================
// 5. Oluşturduğumuz post dökümanlarını Blog sitemizin
// anasayfasında gösterelim. ENES Öztürk imzalı
// ==========================================
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

// ==========================================
// 2. "Add New Post" sayfasından gelen verileri req.body ile yakalama
// ==========================================
app.post('/posts', async (req, res) => {
  console.log('Form verisi yakalandı (req.body):', req.body);
  await Post.create(req.body);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(\`Sunucu http://localhost:\${port} üzerinde çalışıyor - ENES ÖZTÜRK İmzalı\`);
});`,

    postmodel: `// models/Post.js - Post Modeli
// ENES ÖZTÜRK İmzalı
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ==========================================
// 3. title:String, detail:String, dateCreated:Date(default now)
// özelliklerine sahip Post modelini oluşturalım.
// ==========================================
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Lütfen başlık giriniz.'],
    trim: true,
  },
  detail: {
    type: String,
    required: [true, 'Lütfen detay metni giriniz.'],
  },
  author: {
    type: String,
    default: 'Enes Öztürk',
    trim: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;`,

    seedjs: `// seed.js - Veritabanında 3 Adet Post Dökümanı Oluşturma
// ENES ÖZTÜRK İmzalı
const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect('mongodb://localhost:27017/cleanblog-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedData() {
  try {
    // Önceki kayıtları temizleyelim (opsiyonel)
    await Post.deleteMany({});

    // 4. Veri tabanımızda 3 adet post dökümanı oluşturalım.
    const post1 = await Post.create({
      title: 'Node.js ile Asenkron Programlama ve Clean Blog Mimarisi',
      detail: 'Node.js olay güdümlü mimarisi ile modern web uygulamaları geliştirmek için ideal bir çalışma ortamıdır. Clean Blog projemizde Express çatısını kullanarak rotaları ve middleware yapılarını kurduk.',
      author: 'Enes Öztürk'
    });

    const post2 = await Post.create({
      title: 'Mongoose ve MongoDB ile Veri Modelleme Sanatı',
      detail: 'Mongoose kütüphanesi title, detail ve dateCreated alanlarına sahip Post modelimizi yönetmemizi sağlar. MongoDB veritabanında esnek ve yapılandırılmış dökümanlar tutabiliyoruz.',
      author: 'Enes Öztürk'
    });

    const post3 = await Post.create({
      title: 'Clean Blog Projesi 3. Bölüm: req.body ve Middleware Gücü',
      detail: 'Add New Post sayfasından gönderilen verileri express.urlencoded middleware fonksiyonu ile req.body nesnesinde yakalıyoruz ve veritabanına kaydediyoruz.',
      author: 'Enes Öztürk'
    });

    console.log('3 Adet Post Dökümanı Başarıyla Oluşturuldu:');
    console.log('1.', post1.title);
    console.log('2.', post2.title);
    console.log('3.', post3.title);
    console.log('İmza: ENES ÖZTÜRK');

    mongoose.connection.close();
  } catch (err) {
    console.error('Hata:', err);
  }
}

seedData();`,

    addpost: `<!-- views/add_post.ejs -->
<!-- Ödev 9 Görev 2: Add New Post Sayfasında Form -->
<form method="POST" action="/posts" novalidate>
  <div class="control-group">
    <div class="form-group floating-label-form-group controls">
      <label>Post Title</label>
      <input 
        type="text" 
        class="form-control" 
        placeholder="Post Title" 
        name="title" 
        required 
      />
    </div>
  </div>

  <div class="control-group">
    <div class="form-group floating-label-form-group controls">
      <label>Post Detail</label>
      <textarea 
        rows="5" 
        class="form-control" 
        placeholder="Post Detail" 
        name="detail" 
        required
      ></textarea>
    </div>
  </div>

  <!-- Yazar Bilgisi (Enes Öztürk) -->
  <input type="hidden" name="author" value="Enes Öztürk" />

  <br />
  <div class="form-group">
    <button type="submit" class="btn btn-primary" id="sendMessageButton">
      Yayınla (Create Post)
    </button>
  </div>
</form>`,
  };

  const checklistItems = [
    {
      num: 1,
      title: 'cleanblog-test-db Mongoose Bağlantısı',
      desc: 'cleanblog-test-db adında bir veri tabanı için mongoose ile gerekli bağlantı bilgilerini yazalım.',
      badge: 'mongodb://localhost:27017/cleanblog-test-db',
      status: 'Tamamlandı',
    },
    {
      num: 2,
      title: 'req.body & Middleware Yapılandırması',
      desc: '"Add New Post" sayfamızdan göndericeğimiz veriler req.body ile yakalayalım, gerekli middleware fonksiyonarını kullanalım.',
      badge: 'express.urlencoded({ extended: true })',
      status: 'Tamamlandı',
    },
    {
      num: 3,
      title: 'Post Mongoose Modeli',
      desc: 'title:String, detail:String, dateCreated:Date(default now) özelliklerine sahip Post modelini oluşturalım.',
      badge: 'models/Post.js (Mongoose Schema)',
      status: 'Tamamlandı',
    },
    {
      num: 4,
      title: 'Veri Tabanında 3 Adet Post Dökümanı',
      desc: 'Veri tabanımızda 3 adet post dökümanı oluşturalım.',
      badge: `${postCount} Adet Aktif Döküman`,
      status: 'Tamamlandı',
    },
    {
      num: 5,
      title: 'Ana Sayfada Gösterim & ENES ÖZTÜRK İmzası',
      desc: 'Oluşturduğumuz post dökümanlarını Blog sitemizin anasayfasında gösterelim. ENES öztürk imzalı olsun.',
      badge: 'Yazar: ENES ÖZTÜRK',
      status: 'Tamamlandı',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/50 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white">
                  Ödev 9: Clean Blog Projesi 3. Bölüm
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-900/80 text-teal-300 border border-teal-700">
                  ENES ÖZTÜRK
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Mongoose, Express Middleware (req.body), Post Modeli & Veritabanı Dökümanları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'checklist'
                ? 'border-teal-600 text-teal-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>5 Görev Kontrol Listesi</span>
          </button>

          <button
            onClick={() => setActiveTab('appjs')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'appjs'
                ? 'border-teal-600 text-teal-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-teal-600" />
            <span>app.js</span>
          </button>

          <button
            onClick={() => setActiveTab('postmodel')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'postmodel'
                ? 'border-teal-600 text-teal-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4 text-indigo-600" />
            <span>models/Post.js</span>
          </button>

          <button
            onClick={() => setActiveTab('seedjs')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'seedjs'
                ? 'border-teal-600 text-teal-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-600" />
            <span>seed.js (3 Post)</span>
          </button>

          <button
            onClick={() => setActiveTab('addpost')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'addpost'
                ? 'border-teal-600 text-teal-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-stone-600" />
            <span>views/add_post.ejs</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto grow">
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    Tüm Ödev 9 Kriterleri %100 Başarıyla Karşılandı
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Proje ENES ÖZTÜRK imzasıyla teslim edilmeye hazır durumdadır.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-md">
                  5/5 Tamam
                </span>
              </div>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.num}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-teal-400 transition flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div className="grow space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="font-semibold text-stone-900 text-sm">
                          {item.num}. {item.title}
                        </h5>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-300">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'checklist' && (
            <div className="relative">
              <div className="flex items-center justify-between pb-2 mb-2 text-xs text-stone-500">
                <span className="font-mono">
                  {activeTab === 'appjs'
                    ? 'app.js'
                    : activeTab === 'postmodel'
                    ? 'models/Post.js'
                    : activeTab === 'seedjs'
                    ? 'seed.js'
                    : 'views/add_post.ejs'}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      codeSnippets[activeTab as keyof typeof codeSnippets],
                      activeTab
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedKey === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-stone-950 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
                {codeSnippets[activeTab as keyof typeof codeSnippets]}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500">
            Patika.dev • Node.js Clean Blog 3. Bölüm
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
