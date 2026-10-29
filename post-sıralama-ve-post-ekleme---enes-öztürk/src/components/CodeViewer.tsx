import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeViewerProps {
  onRunSimulation: () => void;
  isRunning: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ onRunSimulation, isRunning }) => {
  const [activeSnippet, setActiveSnippet] = useState<'async' | 'promise'>('async');
  const [copied, setCopied] = useState(false);

  const asyncCode = `/**
 * Post Sıralama ve Post Ekleme
 * Geliştirici & Yazar: Enes Öztürk
 * Çalıştırma: node blog_app.js
 */

// 1. Başlangıç Post Listemiz
const posts = [
  { id: 1, title: 'Node.js ile Asenkron Programlama Temelleri', author: 'Enes Öztürk', date: '2026-10-18' },
  { id: 2, title: 'Promise Mimarisi ve Zincirleme Mantığı', author: 'Enes Öztürk', date: '2026-10-22' },
  { id: 3, title: 'Async/Await ile Temiz Kod Yazımı', author: 'Enes Öztürk', date: '2026-10-26' }
];

// 2. Postları Konsol Ekranında Sıralayan Fonksiyon
function listPosts() {
  console.log('--- 📋 GÜNCEL POST LİSTESİ ---');
  posts.forEach((post) => {
    console.log(\`[#\${post.id}] \${post.title} | Yazar: \${post.author} (\${post.date})\`);
  });
  console.log('------------------------------\\n');
}

// 3. Yeni Post Ekleyen Fonksiyon (Promise Döndürür)
function addPost(newPost) {
  return new Promise((resolve, reject) => {
    console.log(\`⏳ Yeni post ekleniyor: "\${newPost.title}"...\`);
    setTimeout(() => {
      posts.push(newPost);
      resolve('✅ Post başarıyla eklendi!');
    }, 1000); // 1 saniyelik asenkron simülasyon
  });
}

// 4. Sıralama -> Ekleme -> Tekrar Sıralama Akışı (async / await)
async function processBlog() {
  try {
    console.log('==============================================');
    console.log('🚀 BLOG POST SIRALAMA VE POST EKLEME SÜRECİ');
    console.log('✨ İmzalı: Enes Öztürk');
    console.log('==============================================\\n');

    // ADIM 1: Mevcut postları konsolda sıralayalım
    console.log('▶️ ADIM 1: Mevcut postlar listeleniyor...');
    listPosts();

    // ADIM 2: Yeni bir post oluşturalım ve ekleyelim
    console.log('▶️ ADIM 2: Yeni post oluşturuluyor...');
    const result = await addPost({
      id: posts.length + 1,
      title: 'Modern Web Mimarileri ve Mikro-Servisler',
      author: 'Enes Öztürk',
      date: '2026-10-29'
    });
    console.log(result + '\\n');

    // ADIM 3: Yeni post ile birlikte postlarımızı tekrar sıralayalım
    console.log('▶️ ADIM 3: Yeni post ile birlikte postlarımızı tekrar sıralayalım...');
    listPosts();

    console.log('🎉 Tüm adımlar başarıyla tamamlandı!');
    console.log('📝 Hazırlayan: Enes Öztürk');
    console.log('==============================================');
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
}

// Programı çalıştıralım
processBlog();
`;

  const promiseCode = `/**
 * Post Sıralama ve Post Ekleme (Promise .then() / .catch() Yaklaşımı)
 * Geliştirici & Yazar: Enes Öztürk
 */

const posts = [
  { id: 1, title: 'Node.js ile Asenkron Programlama Temelleri', author: 'Enes Öztürk', date: '2026-10-18' },
  { id: 2, title: 'Promise Mimarisi ve Zincirleme Mantığı', author: 'Enes Öztürk', date: '2026-10-22' },
  { id: 3, title: 'Async/Await ile Temiz Kod Yazımı', author: 'Enes Öztürk', date: '2026-10-26' }
];

function listPosts() {
  console.log('--- 📋 POSTLAR LİSTELENİYOR ---');
  posts.forEach(post => {
    console.log(\`[#\${post.id}] \${post.title} - \${post.author} (\${post.date})\`);
  });
  console.log('------------------------------\\n');
}

function addPost(newPost) {
  return new Promise((resolve, reject) => {
    console.log(\`⏳ Yeni post ekleniyor: "\${newPost.title}"...\`);
    setTimeout(() => {
      posts.push(newPost);
      resolve('✅ Yeni post başarıyla diziye eklendi!');
    }, 1000);
  });
}

// Promise Zinciri ile Yürütme:
console.log('🚀 1. Adım: Mevcut Postlar Sıralanıyor...');
listPosts();

const yeniPost = {
  id: posts.length + 1,
  title: 'Event-Driven Sistemler ve Queue Yönetimi',
  author: 'Enes Öztürk',
  date: '2026-10-29'
};

addPost(yeniPost)
  .then((mesaj) => {
    console.log(mesaj);
    console.log('🚀 2. Adım: Yeni Post ile Birlikte Tekrar Sıralanıyor...');
    listPosts();
    console.log('✨ İmzalı: Enes Öztürk');
  })
  .catch((hata) => {
    console.error('Hata:', hata);
  });
`;

  const currentCode = activeSnippet === 'async' ? asyncCode : promiseCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              blog_engine.js (Node.js Kaynak Kodu)
            </h3>
            <p className="text-xs text-slate-500">
              Ödev ve proje için saf Node.js / JavaScript implementasyonu — Enes Öztürk İmzalı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Method Tabs */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSnippet('async')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSnippet === 'async'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              async / await Yöntemi
            </button>
            <button
              onClick={() => setActiveSnippet('promise')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeSnippet === 'promise'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Promise (.then) Yöntemi
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Çalışıyor' : 'Konsolda Çalıştır'}</span>
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative bg-slate-950 p-5 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-100 leading-relaxed">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Footer Info Strip */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Bu kodu yerel terminalinizde <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">node blog_app.js</code> komutuyla da doğrudan çalıştırabilirsiniz.</span>
        </div>
        <span className="font-semibold text-slate-700 shrink-0">
          İmza: Enes Öztürk
        </span>
      </div>
    </div>
  );
};
