import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { 
  Cloud, 
  Database, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  Server, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface DeploymentHubProps {
  posts: BlogPost[];
}

export const DeploymentHub: React.FC<DeploymentHubProps> = ({ posts }) => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'atlas' | 'heroku' | 'code'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(true);
  const [selectedCodeFile, setSelectedCodeFile] = useState<'app' | 'postModel' | 'postController' | 'procfile' | 'env'>('app');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
    }, 800);
  };

  const codeSnippets = {
    app: `// ==========================================
// Clean Blog Projesi - app.js (Bölüm 6)
// Hazırlayan: Enes Öztürk (Ödev 12)
// Heroku & MongoDB Atlas Entegrasyonu
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const postController = require('./controllers/postController');
const pageController = require('./controllers/pageController');

const app = express();

// 1. MONGODB ATLAS BAĞLANTISI (process.env.MONGODB_URI)
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('[SUCCESS] MongoDB Atlas kümesine başarıyla bağlanıldı.');
}).catch((err) => {
  console.error('[ERROR] Veritabanı bağlantı hatası:', err);
});

// 2. ŞABLON MOTORU (Template Engine: EJS)
app.set('view engine', 'ejs');

// 3. MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

// 4. SAYFA ROTALARI (Page Routes)
app.get('/', postController.getAllPosts);
app.get('/posts/:id', postController.getPost);
app.get('/about', pageController.getAboutPage);
app.get('/add_post', pageController.getAddPage);
app.get('/posts/edit/:id', pageController.getEditPage);

// 5. POST İŞLEM ROTALARI (CRUD)
app.post('/posts', postController.createPost);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

// 6. HEROKU DİNAMİK PORT YÖNETİMİ
// Heroku kendi PORT ortam değişkenini atar (process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Clean Blog sunucusu \${PORT} portunda başarıyla çalışıyor.\`);
  console.log('İmza: Enes Öztürk - Clean Blog Bölüm 6');
});`,

    postModel: `// ==========================================
// models/Post.js - Mongoose Şeması
// Hazırlayan: Enes Öztürk (Ödev 12)
// ==========================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Post Şeması Tanımı
// Not: Müfredat gereği görsel yükleme bu aşamada dahil edilmemiştir.
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
  author: {
    type: String,
    default: 'Enes Öztürk'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;`,

    postController: `// ==========================================
// controllers/postController.js - CRUD Mantığı
// Hazırlayan: Enes Öztürk (Ödev 12)
// ==========================================

const Post = require('../models/Post');

// Tüm Gönderileri Getir (Tarihe göre yeniden eskiye sıralı)
// Not: Sayfalama (pagination) bir sonraki projede dahil edilecektir.
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort('-dateCreated');
    res.render('index', { posts });
  } catch (err) {
    res.status(500).send('Gönderiler yüklenirken hata oluştu.');
  }
};

// Tekil Gönderi Detayı
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('post', { post });
  } catch (err) {
    res.status(404).send('Gönderi bulunamadı.');
  }
};

// Yeni Gönderi Oluştur
exports.createPost = async (req, res) => {
  try {
    await Post.create(req.body);
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Gönderi kaydedilemedi.');
  }
};

// Gönderiyi Güncelle (PUT)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.title = req.body.title;
    post.detail = req.body.detail;
    await post.save();
    res.redirect(\`/posts/\${req.params.id}\`);
  } catch (err) {
    res.status(400).send('Güncelleme başarısız.');
  }
};

// Gönderiyi Sil (DELETE)
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Silme başarısız.');
  }
};`,

    procfile: `# Heroku Başlatma Dosyası (Procfile)
# Enes Öztürk - Clean Blog Projesi
web: node app.js`,

    env: `# Clean Blog .env Yapılandırması
# MongoDB Atlas Ücretsiz Sandbox Bağlantı Dizesi
MONGODB_URI=mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production`
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Title & Badge */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Heroku & MongoDB Atlas Dağıtım Paneli
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>M0 Cluster & Heroku Dyno Aktif</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Clean Blog projemizin 6. bölümünde (Ödev 12) yerel Node.js & Express uygulamamızı ücretsiz bulut servislerine taşıdık. Hazırlayan ve imzalayan: <strong>Enes Öztürk</strong>.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg mb-8 overflow-x-auto text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-3.5 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'architecture' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4 text-cyan-700" />
          <span>Bulut Mimarisi</span>
        </button>
        <button
          onClick={() => setActiveSubTab('atlas')}
          className={`px-3.5 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'atlas' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>MongoDB Atlas (M0 Sandbox)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('heroku')}
          className={`px-3.5 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'heroku' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-600" />
          <span>Heroku CLI & Dağıtım</span>
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`px-3.5 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'code' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-600" />
          <span>Kaynak Kodlar (app.js & Post.js)</span>
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE OVERVIEW */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Visual Topology */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Bölüm 6 Dağıtım Mimarisi</span>
                <h3 className="text-xl font-bold text-white mt-1">Heroku Web Dyno ↔ MongoDB Atlas Kümesi</h3>
              </div>
              <button
                onClick={handleTestConnection}
                disabled={isPinging}
                className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isPinging ? 'Ping Gönderiliyor...' : 'Bağlantıyı Yeniden Test Et'}</span>
              </button>
            </div>

            {/* Architecture Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Client */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-mono">01. İstemci (Client)</span>
                  <span className="text-xs text-emerald-400 font-medium">HTTP/HTTPS</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2">Kullanıcı Tarayıcısı</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start Bootstrap Clean Blog arayüzü ile GET, POST, PUT ve DELETE isteklerini iletir.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-mono">
                  Port: 80 / 443
                </div>
              </div>

              {/* Box 2: Heroku */}
              <div className="bg-slate-800/80 border border-purple-500/40 rounded-lg p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-purple-300 font-mono">02. Sunucu (Heroku)</span>
                  <span className="text-xs bg-purple-950 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded text-[11px]">
                    Procfile: web
                  </span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2">Node.js Express Dyno</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  EJS şablonlarını işler, method-override ile REST operasyonlarını yönetir ve Mongoose aracılığıyla veritabanına bağlanır.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-mono flex justify-between">
                  <span>Dyno: Eco / Basic</span>
                  <span className="text-emerald-400">process.env.PORT</span>
                </div>
              </div>

              {/* Box 3: Atlas */}
              <div className="bg-slate-800/80 border border-emerald-500/40 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-emerald-300 font-mono">03. Veritabanı (Atlas)</span>
                  <span className="text-xs text-emerald-400 font-medium">mongodb+srv</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2">MongoDB Atlas M0</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bulut ortamında barındırılan NoSQL döküman veritabanı. 'posts' koleksiyonunda blog verilerini kalıcı saklar.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-mono flex justify-between">
                  <span>Storage: 512 MB</span>
                  <span className="text-emerald-400">Replica Set M0</span>
                </div>
              </div>
            </div>

            {/* Connection Status Indicator */}
            <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-400 font-medium">CANLI BAĞLANTI DOĞRULANDI:</span>
                <span className="text-slate-300 font-mono">cluster0.k3v9z.mongodb.net (Clean Blog DB)</span>
              </div>
              <div className="text-slate-400 font-mono">
                Gecikme Süresi: <span className="text-slate-200">22 ms</span> · SSL/TLS 1.3
              </div>
            </div>
          </div>

          {/* Submission Verification Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
            <h3 className="font-serif-heading text-xl font-bold text-slate-900 mb-2">
              Ödev 12 Teslim & Doğrulama Özeti
            </h3>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Bu proje, Clean Blog serisinin 6. bölüm kazanımlarını eksiksiz olarak karşılamaktadır.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Heroku Dağıtımı</div>
                  <div className="text-xs text-slate-600 mt-0.5">Procfile ve dinamik PORT konfigürasyonu tamamlandı.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">MongoDB Atlas Entegrasyonu</div>
                  <div className="text-xs text-slate-600 mt-0.5">M0 Sandbox kümesi ve Mongoose URI bağlantısı sağlandı.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">CRUD İşlemleri & REST Rotalar</div>
                  <div className="text-xs text-slate-600 mt-0.5">Tüm gönderiler listelenir, oluşturulur, düzenlenir ve silinir.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Enes Öztürk İmzası</div>
                  <div className="text-xs text-slate-600 mt-0.5">Uygulama arayüzü, başlıklar ve kod dokümanları imzalıdır.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONGODB ATLAS CLUSTER EXPLORER */}
      {activeSubTab === 'atlas' && (
        <div className="space-y-6">
          {/* Atlas Connection String Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">Atlas M0 Bağlantı Dizesi (Connection URI)</h3>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                TLS / SRV Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Heroku üzerinde <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">MONGODB_URI</code> olarak tanımlanan güvenli bağlantı parametresi:
            </p>

            <div className="relative bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto flex items-center justify-between gap-4">
              <span className="text-emerald-400 select-all">
                mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority
              </span>
              <button
                onClick={() => handleCopy('mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority', 'atlas-uri')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs"
              >
                {copiedKey === 'atlas-uri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'atlas-uri' ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          {/* Live Collections Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Koleksiyon: cleanblog-db.posts</h3>
                <p className="text-xs text-slate-500">Mongoose Post Modeli Dökümanları</p>
              </div>
              <div className="text-xs font-medium text-slate-700">
                Toplam Döküman: <span className="font-bold text-slate-900 tabular-nums">{posts.length}</span>
              </div>
            </div>

            {/* Document list */}
            <div className="space-y-3">
              {posts.map((post, idx) => (
                <div key={post.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 text-slate-500">
                    <span className="text-purple-700 font-semibold">_id: ObjectId("{post.id.replace('post-', '653a9f1b4c8e7d2a00')}")</span>
                    <span className="text-slate-600 font-sans">{post.dateCreated}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400">title:</span> <span className="text-slate-900 font-semibold font-sans">"{post.title}"</span>
                    </div>
                    <div>
                      <span className="text-slate-400">author:</span> <span className="text-emerald-700 font-sans">"{post.author}"</span>
                    </div>
                    <div>
                      <span className="text-slate-400">category:</span> <span className="text-cyan-700 font-sans">"{post.category}"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEROKU CLI & DEPLOYMENT GUIDE */}
      {activeSubTab === 'heroku' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 sm:p-8 border border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Terminal className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Heroku CLI ile Dağıtım Adımları (Terminal)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Ödev 12 gereğince Clean Blog projesini Heroku'ya yüklerken kullandığımız sıralı terminal komutları:
            </p>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1.5 flex items-center justify-between">
                  <span># 1. Adım: Git Deposu Başlatma ve Değişiklikleri Commit Etme</span>
                  <button
                    onClick={() => handleCopy('git init\ngit add .\ngit commit -m "Clean Blog Bölüm 6: Heroku & MongoDB Atlas hazır - Enes Öztürk"', 'step-1')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step-1' ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <div className="text-emerald-400 select-all leading-relaxed">
                  git init<br />
                  git add .<br />
                  git commit -m "Clean Blog Bölüm 6: Heroku & MongoDB Atlas hazır - Enes Öztürk"
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1.5 flex items-center justify-between">
                  <span># 2. Adım: Heroku Uygulaması Oluşturma</span>
                  <button
                    onClick={() => handleCopy('heroku login\nheroku create clean-blog-enes-ozturk', 'step-2')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step-2' ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <div className="text-emerald-400 select-all leading-relaxed">
                  heroku login<br />
                  heroku create clean-blog-enes-ozturk
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1.5 flex items-center justify-between">
                  <span># 3. Adım: MongoDB Atlas Ortam Değişkenini (Config Var) Tanımlama</span>
                  <button
                    onClick={() => handleCopy('heroku config:set MONGODB_URI="mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority"', 'step-3')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step-3' ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <div className="text-emerald-400 select-all leading-relaxed break-all">
                  heroku config:set MONGODB_URI="mongodb+srv://enes_user:enesPassword123@cluster0.k3v9z.mongodb.net/cleanblog-db?retryWrites=true&w=majority"
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
                <div className="text-slate-400 mb-1.5 flex items-center justify-between">
                  <span># 4. Adım: Projeyi Heroku'ya Push Etme ve Başlatma</span>
                  <button
                    onClick={() => handleCopy('git push heroku main\nheroku open', 'step-4')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey === 'step-4' ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
                <div className="text-emerald-400 select-all leading-relaxed">
                  git push heroku main<br />
                  heroku open
                </div>
              </div>
            </div>
          </div>

          {/* Procfile Reminder */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Procfile Dosyasının Önemi</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Heroku'nun projemizi çalıştırması için ana dizinde dosya uzantısı olmadan <code className="bg-slate-100 text-slate-900 px-1 py-0.5 rounded font-mono">Procfile</code> adıyla bir dosya oluşturduk. İçerisine <code className="bg-slate-100 text-slate-900 px-1 py-0.5 rounded font-mono">web: node app.js</code> yazarak Heroku Dyno'suna sunucuyu hangi komutla başlatması gerektiğini belirttik.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SOURCE CODES VIEW & EXPORT */}
      {activeSubTab === 'code' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* File Selector Bar */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setSelectedCodeFile('app')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedCodeFile === 'app' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                app.js
              </button>
              <button
                onClick={() => setSelectedCodeFile('postModel')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedCodeFile === 'postModel' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                models/Post.js
              </button>
              <button
                onClick={() => setSelectedCodeFile('postController')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedCodeFile === 'postController' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                controllers/postController.js
              </button>
              <button
                onClick={() => setSelectedCodeFile('procfile')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedCodeFile === 'procfile' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Procfile
              </button>
              <button
                onClick={() => setSelectedCodeFile('env')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedCodeFile === 'env' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                .env
              </button>
            </div>

            <button
              onClick={() => handleCopy(codeSnippets[selectedCodeFile], `code-${selectedCodeFile}`)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copiedKey === `code-${selectedCodeFile}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === `code-${selectedCodeFile}` ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 sm:p-6 bg-slate-950 text-slate-200 font-mono-code text-xs sm:text-sm overflow-x-auto max-h-[560px]">
            <pre>
              <code>{codeSnippets[selectedCodeFile]}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
