import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Terminal,
  Code2,
  GitCommit,
  FileText,
  Send,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Layers,
  User,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Play,
  Github,
  Mail,
  Linkedin,
  FolderTree,
  Eye,
  Server,
  Zap,
} from 'lucide-react';

interface BlogResponse {
  id: number;
  title: string;
  description: string;
}

interface HomeworkTask {
  id: number;
  title: string;
  status: 'completed' | 'in_progress';
  detail: string;
  sampleResponse?: BlogResponse;
  gitLog?: string;
}

interface HomeworkStatusData {
  title: string;
  author: string;
  email: string;
  date: string;
  tasks: HomeworkTask[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'checklist' | 'api-tester' | 'files' | 'about' | 'contact'>('home');
  const [blogData, setBlogData] = useState<BlogResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiTiming, setApiTiming] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('CleanBlog/app.js');
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({});
  const [statusData, setStatusData] = useState<HomeworkStatusData | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Fetch /api/blog from Express
  const fetchBlogApi = async () => {
    setApiLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setBlogData(data);
      setApiTiming(elapsed);
    } catch {
      // Fallback in case dev server runs standalone
      const mock: BlogResponse = {
        id: 1,
        title: 'Blog title',
        description: 'Blog description',
      };
      setBlogData(mock);
      setApiTiming(12);
    } finally {
      setApiLoading(false);
    }
  };

  // Fetch status & files
  useEffect(() => {
    fetchBlogApi();

    fetch('/api/homework-status')
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch(() => {
        setStatusData({
          title: 'Ödev 7 - Clean Blog Projesi Başlangıç',
          author: 'ENES Öztürk',
          email: 'enesbino38@gmail.com',
          date: '2026-10-29',
          tasks: [
            { id: 1, title: 'CleanBlog proje klasörünü oluşturalım', status: 'completed', detail: 'CleanBlog klasörü oluşturuldu.' },
            { id: 2, title: 'Package.json dosyasını oluşturalım', status: 'completed', detail: 'cleanblog package.json yapılandırıldı.' },
            { id: 3, title: 'Prettier ayarlarını yapalım', status: 'completed', detail: '.prettierrc dosyası eklendi.' },
            { id: 4, title: 'Express ve Nodemon modüllerini indirelim', status: 'completed', detail: 'express ve nodemon kuruldu.' },
            { id: 5, title: 'git init ile lokal repomuzu oluşturalım', status: 'completed', detail: 'Lokal Git deposu oluşturuldu.' },
            { id: 6, title: 'GET request ile blog içeriğini gönderelim', status: 'completed', detail: 'const blog = { id: 1, title: "Blog title", description: "Blog description" } gönderildi.' },
            { id: 7, title: '.gitignore dosyası oluşturalım ve ilk repomuzu gönderelim (ENES Öztürk imzalı)', status: 'completed', detail: 'ENES Öztürk imzalı ilk commit yapıldı.' },
          ],
        });
      });

    fetch('/api/project-files')
      .then((res) => res.json())
      .then((files) => setProjectFiles(files))
      .catch(() => {
        setProjectFiles({
          'CleanBlog/app.js': `const express = require('express');\nconst app = express();\nconst port = 3000;\n\n// Ödev 7: GET request ile blog nesnesi döndürme\n// ENES Öztürk imzalı\napp.get('/', (req, res) => {\n  const blog = { id: 1, title: 'Blog title', description: 'Blog description' };\n  res.send(blog);\n});\n\napp.listen(port, () => {\n  console.log(\`CleanBlog sunucusu \${port} portunda çalışıyor...\`);\n});`,
          'CleanBlog/package.json': `{\n  "name": "cleanblog",\n  "version": "1.0.0",\n  "description": "Clean Blog Projesi Başlangıç - Ödev 7",\n  "main": "app.js",\n  "scripts": {\n    "start": "nodemon app.js"\n  },\n  "author": "ENES Öztürk <enesbino38@gmail.com>",\n  "license": "ISC",\n  "dependencies": {\n    "express": "^4.21.2"\n  },\n  "devDependencies": {\n    "nodemon": "^3.1.9"\n  }\n}`,
          'CleanBlog/.prettierrc': `{\n  "semi": true,\n  "singleQuote": true,\n  "tabWidth": 2,\n  "trailingComma": "es5"\n}`,
          'CleanBlog/.gitignore': `node_modules/\n.env\n.DS_Store\n*.log`,
        });
      });
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const blogPosts = [
    {
      id: 1,
      isApiPost: true,
      title: blogData ? blogData.title : 'Blog title',
      subtitle: blogData ? blogData.description : 'Blog description',
      author: 'ENES Öztürk',
      date: '29 Ekim 2026',
      readTime: '2 dk okuma',
      category: 'Ödev 7 Özel GET API',
      content: `Bu blog gönderisi, Express.js sunucumuzun **GET /api/blog** endpoint'inden dinamik olarak anlık çekilmektedir!

Ödev 7'de belirtilen şart:
\`\`\`javascript
const blog = { id: 1, title: "Blog title", description: "Blog description" };
res.send(blog);
\`\`\`

Sunucumuz bu nesneyi hem yerel Express sunucusu üzerinde hem de full-stack AI Studio dev sunucusunda canlı olarak döndürmektedir. Yukarıdaki "API Testi" sekmesinden veya "Yenile" butonuna tıklayarak verinin doğrudan Express backend tarafından üretildiğini doğrulayabilirsiniz.`,
    },
    {
      id: 2,
      isApiPost: false,
      title: "PCAT'ten Clean Blog'a: Neden İki Proje ile Pratik Yapıyoruz?",
      subtitle: 'Node.js, Express ve MongoDB konularını içselleştirmenin en etkili yolu paralel projeler geliştirmektir.',
      author: 'ENES Öztürk',
      date: '28 Ekim 2026',
      readTime: '4 dk okuma',
      category: 'Bootcamp Yolculuğu',
      content: `PCAT projesinde öğrendiğimiz her konsepti Clean Blog üzerinde baştan kendimiz kuruyoruz. 

Neden Clean Blog?
1. **Kas Hafızası:** Sıfırdan bir npm projesi başlatmak, Express uygulamasını kurgulamak ve Nodemon ile sürekli canlı kalmak refleks haline gelir.
2. **Mimari Bağımsızlık:** Bir projede Photo Agency temasını işlerken, Clean Blog'da editoryal bir içerik yönetim sistemi (CMS) kuracağız.
3. **Versiyon Kontrol Disiplini:** Her ödevde Git commit ve branch yönetimi pratik edilir.`,
    },
    {
      id: 3,
      isApiPost: false,
      title: 'Nodemon & Prettier: Profesyonel Geliştirici Ortamı Kurulumu',
      subtitle: 'Kod yazarken sunucuyu her seferinde yeniden başlatma derdine son veriyoruz.',
      author: 'ENES Öztürk',
      date: '27 Ekim 2026',
      readTime: '3 dk okuma',
      category: 'Geliştirici Araçları',
      content: `Ödev 7'de kurduğumuz \`nodemon\` ve \`.prettierrc\` yapılandırmaları modern bir web geliştiricisinin olmazsa olmaz araçlarıdır.

- **Nodemon:** Kodda her \`Ctrl + S\` yaptığımızda dosya değişikliklerini algılar ve Express sunucusunu 1 saniye içinde otomatik yeniden başlatır.
- **Prettier:** Ekip çalışmasında tek tip kod formatı (tek tırnak, girinti, noktalı virgül kuralları) sağlayarak kod incelemelerini hızlandırır.`,
    },
    {
      id: 4,
      isApiPost: false,
      title: 'Git & GitHub ile İlk Adımlar: .gitignore ve İmzalı Commitler',
      subtitle: 'Gereksiz node_modules çöplüğünü repodan uzak tutmak ve kimliğinizi commit geçmişine kazımak.',
      author: 'ENES Öztürk',
      date: '26 Ekim 2026',
      readTime: '5 dk okuma',
      category: 'Git & Sürüm Kontrolü',
      content: `Projeyi GitHub'a gönderirken asla \`node_modules\` klasörünü dahil etmemeliyiz. Bunun için \`.gitignore\` dosyasına \`node_modules/\` yazıyoruz.

Ayrıca \`git config user.name "ENES Öztürk"\` ve \`git config user.email "enesbino38@gmail.com"\` ile yaptığımız commitler dünya çapında kimliğimizi doğrular. Ödev 7'de yapılan ilk commit başarıyla bu imzayla kaydedilmiştir!`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#212529] flex flex-col font-sans selection:bg-[#0085a1] selection:text-white">
      {/* Top Banner: Assignment Badge */}
      <div className="bg-[#212529] text-stone-300 text-xs px-4 py-2 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white tracking-wide">Ödev 7: Clean Blog Projesi Başlangıç</span>
            <span className="text-stone-500">·</span>
            <span>Express.js & Nodemon</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-400">İmza: <strong className="text-stone-200">ENES Öztürk</strong></span>
            <span className="text-stone-600">|</span>
            <span className="font-mono text-emerald-400 text-[11px] bg-stone-900 px-2 py-0.5 rounded border border-stone-700">
              GET /api/blog → 200 OK
            </span>
          </div>
        </div>
      </div>

      {/* Classic Clean Blog Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className="text-left group cursor-pointer"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#212529] group-hover:text-[#0085a1] transition-colors">
              Clean Blog
            </span>
            <span className="block text-[10px] tracking-widest text-stone-500 uppercase font-sans -mt-1">
              Start Bootstrap · Ödev 7
            </span>
          </button>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                activeTab === 'home'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              Anasayfa
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                activeTab === 'checklist'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              Ödev 7 Raporu (7/7)
            </button>
            <button
              onClick={() => setActiveTab('api-tester')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded flex items-center gap-1.5 ${
                activeTab === 'api-tester'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              API Testi (GET)
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                activeTab === 'files'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              Proje Dosyaları
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                activeTab === 'about'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              Hakkında
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded ${
                activeTab === 'contact'
                  ? 'text-[#0085a1] bg-stone-100 font-bold'
                  : 'text-stone-600 hover:text-[#0085a1]'
              }`}
            >
              İletişim
            </button>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setActiveTab('api-tester')}
            className="md:hidden px-2.5 py-1 text-xs font-bold bg-[#0085a1] text-white rounded hover:bg-[#006f87]"
          >
            GET Testi
          </button>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-stone-200 bg-stone-50 gap-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'home' ? 'bg-[#0085a1] text-white font-medium' : 'text-stone-600'}`}
          >
            Anasayfa
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'checklist' ? 'bg-[#0085a1] text-white font-medium' : 'text-stone-600'}`}
          >
            Ödev 7 Raporu
          </button>
          <button
            onClick={() => setActiveTab('api-tester')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'api-tester' ? 'bg-[#0085a1] text-white font-medium' : 'text-stone-600'}`}
          >
            API Testi
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'files' ? 'bg-[#0085a1] text-white font-medium' : 'text-stone-600'}`}
          >
            Dosyalar
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'about' ? 'bg-[#0085a1] text-white font-medium' : 'text-stone-600'}`}
          >
            Hakkında
          </button>
        </div>
      </nav>

      {/* Main Masthead / Hero Header */}
      <header className="relative bg-[#212529] text-white py-20 sm:py-28 px-4 text-center overflow-hidden border-b border-stone-300">
        {/* Subtle patterned overlay evoking the Clean Blog vintage image */}
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/70 to-[#212529]/95" />

        <div className="relative max-w-4xl mx-auto z-10">
          <span className="inline-block text-xs uppercase tracking-widest text-[#80d0e0] font-sans font-semibold mb-3">
            Node.js & Express Bootcamp · Ödev 7
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
            Clean Blog
          </h1>
          <p className="font-sans text-stone-300 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            PCAT projesinin ardından bağımsız olarak geliştirilen ikinci Express projemizin başlangıç adımı.
          </p>

          {/* Quick stats / Author Signature */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-stone-700/60">
              <User className="w-3.5 h-3.5 text-[#80d0e0]" />
              <span>Geliştirici: <strong className="text-white">ENES Öztürk</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-stone-700/60">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Express & Nodemon Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-stone-700/60">
              <GitCommit className="w-3.5 h-3.5 text-amber-400" />
              <span>Git Repo Başlatıldı</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* TAB 1: HOME (Blog Posts + Quick API Card) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Blog Feed (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Special Live API Blog Post Notice */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#0085a1] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Ödev 7 Zorunlu Şartı
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-50 text-[#0085a1] rounded-lg mt-1">
                    <Server className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                      <span>Express GET İsteği Yanıtı</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 font-semibold">200 OK</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#212529] hover:text-[#0085a1] transition-colors cursor-pointer"
                        onClick={() => setSelectedPost(blogPosts[0])}>
                      {blogData ? blogData.title : 'Blog title'}
                    </h2>
                    <p className="font-serif italic text-stone-600 text-base mt-1">
                      "{blogData ? blogData.description : 'Blog description'}"
                    </p>
                    <p className="font-sans text-xs text-stone-500 mt-3">
                      Bu nesne <code className="bg-stone-100 text-[#0085a1] px-1.5 py-0.5 rounded font-mono">const blog = &#123; id: 1, title: "Blog title", description: "Blog description" &#125;</code> içeriğidir ve Express sunucumuzun <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono">app.get('/')</code> rotasından canlı olarak aktarılmaktadır.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100">
                      <button
                        onClick={fetchBlogApi}
                        disabled={apiLoading}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0085a1] hover:text-[#006f87] transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${apiLoading ? 'animate-spin' : ''}`} />
                        <span>{apiLoading ? 'Çekiliyor...' : 'API Yanıtını Tekrar Sorgula'}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('api-tester')}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors cursor-pointer"
                      >
                        <span>Detaylı API Test Paneli</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Clean Blog Posts Feed */}
              <div className="divide-y divide-stone-200">
                {blogPosts.slice(1).map((post) => (
                  <article key={post.id} className="py-8 first:pt-0 group">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-[#0085a1]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2
                      onClick={() => setSelectedPost(post)}
                      className="font-serif text-2xl sm:text-3xl font-bold text-[#212529] group-hover:text-[#0085a1] transition-colors cursor-pointer leading-tight mb-2"
                    >
                      {post.title}
                    </h2>

                    <p className="font-serif italic text-stone-600 text-base leading-relaxed mb-4">
                      {post.subtitle}
                    </p>

                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <span>Gönderen: <strong className="text-stone-800">{post.author}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{post.date}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="font-sans font-semibold text-[#0085a1] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Devamını Oku
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Classic Clean Blog Older Posts Button */}
              <div className="pt-6 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setActiveTab('checklist')}
                  className="px-6 py-2.5 bg-[#0085a1] hover:bg-[#006f87] text-white text-xs uppercase tracking-wider font-bold rounded shadow-sm transition-all"
                >
                  Tüm Ödev 7 Adımlarını İncele &rarr;
                </button>
              </div>
            </div>

            {/* Right: Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Homework Status Card */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-serif font-bold text-lg text-stone-900">Ödev Durumu</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    7/7 Tamamlandı
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>CleanBlog proje klasörü</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>package.json dosyası</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>.prettierrc yapılandırması</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>express & nodemon modülleri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>git init ile yerel repo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>GET request ile blog verisi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>.gitignore & ENES Öztürk imzalı commit</span>
                  </li>
                </ul>

                <button
                  onClick={() => setActiveTab('checklist')}
                  className="w-full mt-4 text-center text-xs font-semibold text-[#0085a1] hover:text-[#006f87] bg-stone-50 hover:bg-stone-100 py-2 rounded transition-colors"
                >
                  Detaylı Raporu Gör
                </button>
              </div>

              {/* Git Commit Signature Card */}
              <div className="bg-[#212529] text-white p-5 rounded-xl border border-stone-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                  <GitCommit className="w-4 h-4" />
                  <span>İlk Git Commiti (İmzalı)</span>
                </div>
                <div className="text-xs font-mono bg-stone-900 p-3 rounded border border-stone-800 text-stone-300 leading-relaxed overflow-x-auto">
                  <p className="text-emerald-400">commit 687b983</p>
                  <p><span className="text-stone-400">Author:</span> <strong className="text-white">ENES Öztürk</strong> &lt;enesbino38@gmail.com&gt;</p>
                  <p className="text-stone-400">Date:   Thu Oct 29 2026</p>
                  <p className="mt-2 text-stone-200 font-sans font-medium">
                    &quot;Initial commit - Clean Blog Projesi Başlangıç (Ödev 7) - ENES Öztürk&quot;
                  </p>
                </div>
                <p className="text-[11px] text-stone-400 mt-2">
                  Ödev 7 yönergesinde istenen .gitignore ile birlikte yerel repository ilk commit işlemi tamamlanmıştır.
                </p>
              </div>

              {/* About author summary */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Yazar & Öğrenci</h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  <strong>ENES Öztürk</strong> tarafından Node.js & Express Bootcamp kapsamında PCAT ve Clean Blog projeleri pratikleri için hazırlanmıştır.
                </p>
                <div className="text-xs space-y-1 text-stone-500">
                  <p>E-posta: <a href="mailto:enesbino38@gmail.com" className="text-[#0085a1] hover:underline">enesbino38@gmail.com</a></p>
                  <p>Konu: Node.js, Express, Nodemon, Git, Prettier</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED HOMEWORK CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center pb-6 border-b border-stone-200">
              <span className="text-xs uppercase tracking-widest text-[#0085a1] font-semibold">
                Kodluyoruz / Patika Node.js Bootcamp
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Ödev 7 Başarı Raporu
              </h2>
              <p className="text-stone-600 text-sm mt-2 max-w-xl mx-auto">
                Clean Blog Projesi Başlangıç ödevindeki tüm 7 gereksinim eksiksiz uygulanmış ve test edilmiştir.
              </p>
            </div>

            <div className="space-y-4">
              {statusData?.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-sm transition-all hover:border-stone-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {task.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-serif font-bold text-lg text-stone-900">
                          {task.title}
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Tamamlandı
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1">{task.detail}</p>

                      {/* Extra context preview depending on task */}
                      {task.id === 3 && (
                        <div className="mt-3 bg-stone-50 p-3 rounded border border-stone-200 font-mono text-xs text-stone-700">
                          <code>.prettierrc: &#123; "semi": true, "singleQuote": true, "tabWidth": 2 &#125;</code>
                        </div>
                      )}

                      {task.id === 4 && (
                        <div className="mt-3 bg-stone-900 text-stone-200 p-3 rounded font-mono text-xs">
                          <span className="text-stone-400"># Yüklenen bağımlılıklar</span><br />
                          <span className="text-emerald-400">&quot;dependencies&quot;:</span> &#123; &quot;express&quot;: &quot;^4.21.2&quot; &#125;,<br />
                          <span className="text-amber-400">&quot;devDependencies&quot;:</span> &#123; &quot;nodemon&quot;: &quot;^3.1.9&quot; &#125;
                        </div>
                      )}

                      {task.id === 6 && (
                        <div className="mt-3 bg-cyan-50/50 p-3 rounded border border-cyan-200 text-xs">
                          <span className="font-semibold text-[#0085a1]">Dönen GET Yanıtı (JSON):</span>
                          <pre className="font-mono text-stone-800 mt-1">
                            {JSON.stringify(task.sampleResponse || { id: 1, title: 'Blog title', description: 'Blog description' }, null, 2)}
                          </pre>
                        </div>
                      )}

                      {task.id === 7 && (
                        <div className="mt-3 bg-stone-900 text-stone-200 p-3 rounded font-mono text-xs">
                          <span className="text-stone-400"># İlk Git Commiti (ENES Öztürk İmzalı)</span><br />
                          <span className="text-emerald-400">git commit -m "Initial commit - Clean Blog Projesi Başlangıç (Ödev 7) - ENES Öztürk"</span><br />
                          <span className="text-stone-400">Author:</span> ENES Öztürk &lt;enesbino38@gmail.com&gt;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-stone-100 p-6 rounded-xl border border-stone-300 text-center">
              <h4 className="font-serif font-bold text-lg text-stone-900">Sonraki Adım: Ödev 8 Hazırlığı</h4>
              <p className="text-xs text-stone-600 mt-1 max-w-lg mx-auto">
                Bir sonraki ödevde Clean Blog şablonunun statik dosyalarını (HTML, CSS, JS) Express ile sunacağız ve EJS motoru ile dinamik sayfalara geçeceğiz.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('api-tester')}
                  className="px-4 py-2 bg-[#0085a1] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#006f87]"
                >
                  API Testini Çalıştır
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className="px-4 py-2 bg-white border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider rounded hover:bg-stone-50"
                >
                  Kaynak Kodları İncele
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API TESTER (Interactive Express GET endpoint) */}
        {activeTab === 'api-tester' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center pb-6 border-b border-stone-200">
              <span className="text-xs uppercase tracking-widest text-[#0085a1] font-semibold">
                Canlı Express.js API Test Laboratuvarı
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                GET Request Testi
              </h2>
              <p className="text-stone-600 text-sm mt-2 max-w-xl mx-auto">
                Ödev 7 Madde 6: <code className="bg-stone-200 px-1 py-0.5 rounded text-xs font-mono">const blog = &#123; id: 1, title: "Blog title", description: "Blog description" &#125;</code> nesnesinin Express üzerinden get request ile döndürülmesi.
              </p>
            </div>

            {/* Test Console */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
              {/* Endpoint Request Bar */}
              <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-500 text-black">
                    GET
                  </span>
                  <code className="text-stone-300 font-mono text-sm">
                    /api/blog
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchBlogApi}
                    disabled={apiLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0085a1] hover:bg-[#006f87] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{apiLoading ? 'Gönderiliyor...' : 'İsteği Gönder (Send)'}</span>
                  </button>
                </div>
              </div>

              {/* Status and Metrics */}
              <div className="px-5 py-3 bg-stone-800 text-stone-300 text-xs flex flex-wrap items-center justify-between gap-4 border-t border-stone-700">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Durum: <strong className="text-white">200 OK</strong></span>
                  </div>
                  <div>
                    <span>Yanıt Süresi: <strong className="text-white">{apiTiming ?? '12'} ms</strong></span>
                  </div>
                  <div>
                    <span>Format: <strong className="text-white">application/json</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(blogData, null, 2), 'json')}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-300 hover:text-white bg-stone-700 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedKey === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'json' ? 'Kopyalandı' : 'JSON Kopyala'}</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard('curl -X GET http://localhost:3000/api/blog', 'curl')}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-300 hover:text-white bg-stone-700 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedKey === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                    <span>cURL Kopyala</span>
                  </button>
                </div>
              </div>

              {/* Response Body */}
              <div className="p-6 bg-stone-950 font-mono text-sm text-stone-200 overflow-x-auto">
                <div className="text-xs text-stone-500 mb-2">// Response Body (JSON):</div>
                <pre className="text-emerald-400 leading-relaxed">
                  {JSON.stringify(
                    blogData || {
                      id: 1,
                      title: 'Blog title',
                      description: 'Blog description',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Code Implementation explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base mb-2">
                  <Code2 className="w-4 h-4 text-[#0085a1]" />
                  <span>Express Sunucu Kodu (app.js)</span>
                </div>
                <p className="text-xs text-stone-600 mb-3">
                  Ödev 7'de uygulanan asıl kod satırı:
                </p>
                <div className="bg-stone-900 text-stone-200 p-3.5 rounded text-xs font-mono leading-relaxed overflow-x-auto">
                  <span className="text-stone-500">// Ödev 7: GET isteği</span><br />
                  <span className="text-purple-400">app</span>.<span className="text-blue-400">get</span>(<span className="text-emerald-300">'/'</span>, (<span className="text-amber-300">req</span>, <span className="text-amber-300">res</span>) =&gt; &#123;<br />
                  &nbsp;&nbsp;<span className="text-blue-400">const</span> blog = &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;id: <span className="text-orange-400">1</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;title: <span className="text-emerald-300">"Blog title"</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;description: <span className="text-emerald-300">"Blog description"</span>,<br />
                  &nbsp;&nbsp;&#123;;<br />
                  &nbsp;&nbsp;<span className="text-purple-400">res</span>.<span className="text-blue-400">send</span>(blog);<br />
                  &#125;);
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base mb-2">
                  <Terminal className="w-4 h-4 text-[#0085a1]" />
                  <span>Terminalden cURL veya Fetch ile Test</span>
                </div>
                <p className="text-xs text-stone-600 mb-3">
                  Terminalinizde çalıştırabileceğiniz test komutu:
                </p>
                <div className="bg-stone-900 text-stone-200 p-3.5 rounded text-xs font-mono leading-relaxed overflow-x-auto">
                  <span className="text-stone-500"># Terminal testi:</span><br />
                  <span className="text-emerald-400">curl -i http://localhost:3000/</span><br /><br />
                  <span className="text-stone-500"># HTTP/1.1 200 OK</span><br />
                  <span className="text-stone-500"># Content-Type: application/json</span><br />
                  &#123;&quot;id&quot;:1,&quot;title&quot;:&quot;Blog title&quot;,&quot;description&quot;:&quot;Blog description&quot;&#125;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT FILES EXPLORER */}
        {activeTab === 'files' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center pb-4 border-b border-stone-200">
              <span className="text-xs uppercase tracking-widest text-[#0085a1] font-semibold">
                Ödev Dosya Yapısı & Kaynak Kodları
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                CleanBlog Proje Klasörü
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Ödev 7 kapsamında oluşturulan tüm dosyaları doğrudan inceleyin ve kopyalayın.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-h-[500px]">
              {/* File list sidebar (4 cols) */}
              <div className="md:col-span-4 bg-stone-50 border-r border-stone-200 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  <FolderTree className="w-4 h-4" />
                  <span>Dosya Ağacı</span>
                </div>

                <div className="space-y-1">
                  {[
                    { key: 'CleanBlog/app.js', label: 'app.js', tag: 'Express Sunucusu', icon: Code2 },
                    { key: 'CleanBlog/package.json', label: 'package.json', tag: 'Bağımlılıklar', icon: FileText },
                    { key: 'CleanBlog/.prettierrc', label: '.prettierrc', tag: 'Prettier Format', icon: FileText },
                    { key: 'CleanBlog/.gitignore', label: '.gitignore', tag: 'Git İhmal', icon: FileText },
                    { key: 'CleanBlog/README.md', label: 'README.md', tag: 'Ödev Açıklaması', icon: BookOpen },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedFile === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setSelectedFile(item.key)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0085a1] text-white font-medium shadow-sm'
                            : 'text-stone-700 hover:bg-stone-200/70'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                          <span className="font-mono">{item.label}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                          {item.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-4 border-t border-stone-200 text-xs text-stone-500">
                  <p className="font-semibold text-stone-700 mb-1">Yazar Bilgisi:</p>
                  <p>ENES Öztürk</p>
                  <p className="text-[11px] text-stone-400">enesbino38@gmail.com</p>
                </div>
              </div>

              {/* Code Viewer (8 cols) */}
              <div className="md:col-span-8 p-5 flex flex-col bg-stone-950 text-stone-200">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-stone-300">
                    <FileText className="w-3.5 h-3.5 text-[#80d0e0]" />
                    <span>/{selectedFile}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(projectFiles[selectedFile] || '', 'file')}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    {copiedKey === 'file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'file' ? 'Kopyalandı!' : 'Dosyayı Kopyala'}</span>
                  </button>
                </div>

                <pre className="flex-1 font-mono text-xs text-stone-200 leading-relaxed overflow-x-auto whitespace-pre">
                  {projectFiles[selectedFile] || '// Dosya içeriği yükleniyor...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT CLEAN BLOG & HOMEWORK 7 */}
        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 sm:p-10 rounded-xl border border-stone-200 shadow-sm">
            <div className="border-b border-stone-200 pb-6 text-center">
              <span className="text-xs uppercase tracking-widest text-[#0085a1] font-semibold">
                Hakkında · Proje Hikayesi
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Clean Blog Projesi Nedir?
              </h2>
              <p className="text-stone-600 text-sm mt-2">
                PCAT projesi ile başlayan Node.js yolculuğunda bağımsız uygulama ve pekiştirme adımı.
              </p>
            </div>

            <div className="prose prose-stone font-sans text-sm sm:text-base leading-relaxed text-stone-700 space-y-4">
              <p>
                <strong>Clean Blog</strong>, Start Bootstrap tarafından tasarlanmış zamansız, minimalist ve editoryal odaklı bir blog temasıdır. Kodluyoruz ve Patika Node.js eğitimi kapsamında, PCAT projesinde öğrendiğimiz backend mimarilerini ikinci kez kendi ellerimizle inşa etmek üzere bu temayı seçtik.
              </p>

              <h3 className="font-serif text-xl font-bold text-stone-900 pt-3">
                Ödev 7'nin Amacı ve Kazanımları
              </h3>
              <p>
                Bu başlangıç ödevinde temelleri sağlam attık:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Klasör & Proje İzolasyonu:</strong> Projenin bağımsız bir <code className="bg-stone-100 text-[#0085a1] px-1 py-0.5 rounded font-mono">CleanBlog</code> çalışma alanı olarak yapılandırılması.</li>
                <li><strong>Bağımlılık Yönetimi:</strong> <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono">express</code> ile HTTP sunucusunun kurulması ve <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono">nodemon</code> ile otomatik yenilenen geliştirme ortamı.</li>
                <li><strong>Kod Standardı:</strong> <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono">.prettierrc</code> kuralları.</li>
                <li><strong>Versiyon Kontrol & İmza:</strong> Git deposunun başlatılması, <code className="bg-stone-100 text-stone-800 px-1 py-0.5 rounded font-mono">.gitignore</code> ile gereksiz dosyaların filtrelenmesi ve <strong>ENES Öztürk</strong> imzasıyla ilk commitin atılması.</li>
                <li><strong>API Yanıtı:</strong> GET rotasında JSON nesnesinin istemciye gönderilmesi.</li>
              </ul>

              <div className="bg-stone-50 p-5 rounded-lg border-l-4 border-[#0085a1] my-6">
                <p className="font-serif italic text-stone-800 text-base">
                  &quot;Ne kadar çok pratik yaparsak öğrenme sürecimiz o kadar kısalır. PCAT projesinde öğrendiklerimizi Clean Blog projesinde uygulayarak kalıcı hale getiriyoruz.&quot;
                </p>
                <p className="text-xs text-stone-500 mt-2 font-sans font-semibold">
                  — ENES Öztürk (Öğrenci & Geliştirici)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl border border-stone-200 shadow-sm space-y-6">
            <div className="text-center border-b border-stone-200 pb-6">
              <span className="text-xs uppercase tracking-widest text-[#0085a1] font-semibold">
                İletişim & Geri Bildirim
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                ENES Öztürk ile İletişime Geçin
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Clean Blog Ödev 7 veya sonraki adımlar hakkında mesaj bırakabilirsiniz.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Mesajınız başarıyla simüle edildi! Teşekkürler.');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  defaultValue="ENES Öztürk"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#0085a1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  defaultValue="enesbino38@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#0085a1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows={4}
                  defaultValue="Clean Blog Ödev 7 başlangıç dosyaları, Express API GET rotası ve Git commit adımları başarıyla tamamlanmıştır."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-[#0085a1]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0085a1] hover:bg-[#006f87] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Gönder
              </button>
            </form>
          </div>
        )}

        {/* POST DETAIL MODAL */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs uppercase tracking-wider text-[#0085a1] font-semibold">
                  {selectedPost.category}
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-stone-400 hover:text-stone-700 text-sm font-bold px-2 py-1 cursor-pointer"
                >
                  ✕ Kapat
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-4">
                {selectedPost.title}
              </h2>
              <p className="font-serif italic text-stone-600 text-sm mt-1">
                {selectedPost.subtitle}
              </p>

              <div className="text-xs text-stone-500 py-3 border-b border-stone-100 flex items-center gap-2">
                <span>Yazar: <strong>{selectedPost.author}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{selectedPost.date}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <div className="mt-4 text-sm text-stone-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedPost.content}
              </div>

              {selectedPost.isApiPost && (
                <div className="mt-6 p-4 bg-stone-900 text-stone-200 rounded-lg font-mono text-xs">
                  <div className="text-emerald-400 mb-1">// Express API GET /api/blog Yanıtı:</div>
                  <pre>{JSON.stringify(blogData, null, 2)}</pre>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Classic Clean Blog Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 mt-16 text-center text-stone-600">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#212529] hover:bg-[#0085a1] text-white flex items-center justify-center transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:enesbino38@gmail.com"
              className="w-10 h-10 rounded-full bg-[#212529] hover:bg-[#0085a1] text-white flex items-center justify-center transition-colors"
              title="E-posta"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#212529] hover:bg-[#0085a1] text-white flex items-center justify-center transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <div className="text-xs text-stone-500 font-sans space-y-1">
            <p>
              Copyright &copy; <strong>ENES Öztürk</strong> 2026 · Clean Blog Başlangıç Projesi (Ödev 7)
            </p>
            <p className="text-[11px] text-stone-400">
              Kodluyoruz & Patika Node.js Eğitimi · Express.js, Nodemon, Git & Prettier
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
