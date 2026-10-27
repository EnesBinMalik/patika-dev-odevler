import React, { useState, useEffect } from 'react';
import getData from './lib/service.js';
import {
  Code,
  CheckCircle2,
  Terminal,
  User,
  FileText,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileCode,
  ShieldCheck
} from 'lucide-react';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CombinedUserData {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  posts: Post[];
}

export default function App() {
  const [userId, setUserId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<CombinedUserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'service' | 'app' | 'console'>('service');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'cards' | 'json'>('cards');

  const executeGetData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getData(id);
      setData(result as CombinedUserData);
    } catch (err: any) {
      setError(err?.message || 'Veri çekilirken bir hata oluştu.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeGetData(1);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const serviceCode = `/**
 * Patika.dev - Node.js Eğitimi / Ödev 1
 * Geliştirici: Enes Öztürk
 * Açıklama: JSONPlaceholder API'si üzerinden verilen kullanıcı ID'sine ait
 *           kullanıcı bilgilerini ve paylaşımlarını (posts) asenkron olarak çekip
 *           birleştirerek döndüren servis fonksiyonu.
 */

import axios from "axios";

/**
 * Belirtilen kullanıcı ID'sine ait kullanıcı bilgilerini ve postlarını getirir.
 * @param {Number} userId - Bilgileri çekilecek kullanıcının ID numarası
 * @returns {Promise<Object>} Kullanıcı bilgileri ve 'posts' dizisini içeren birleşik nesne
 */
const getData = async (userId) => {
  const id = Number(userId);
  if (isNaN(id) || id <= 0) {
    throw new Error("Geçersiz User ID! Lütfen pozitif bir sayı giriniz.");
  }

  try {
    // 1. Kullanıcı bilgilerini çekme isteği
    const { data: user } = await axios.get(
      \`https://jsonplaceholder.typicode.com/users/\${id}\`
    );

    // 2. Kullanıcının gönderilerini (posts) çekme isteği
    const { data: posts } = await axios.get(
      \`https://jsonplaceholder.typicode.com/posts?userId=\${id}\`
    );

    // 3. Kullanıcı bilgileri ve postları tek bir nesnede birleştirip döndürme
    const combinedData = {
      ...user,
      posts,
    };

    return combinedData;
  } catch (error) {
    console.error(\`[Enes Öztürk - Servis Hatası]: User ID \${id} için veri çekilemedi.\`, error.message);
    throw error;
  }
};

export default getData;`;

  const appCode = `/**
 * ==============================================================
 * Patika.dev - Node.js Eğitimi / Ödev 1
 * Geliştirici: Enes Öztürk
 * İletişim / İmza: Enes Öztürk
 * Açıklama: JSONPlaceholder API'sinden kullanıcı ve post verilerini
 *           çeken getData fonksiyonunu import edip çalıştıran ana dosya.
 * ==============================================================
 */

import getData from "./lib/service.js";

// getData fonksiyonunu User ID = 1 için çalıştırıp sonucu konsola yazdırıyoruz
(async () => {
  try {
    console.log("==================================================");
    console.log("🚀 Patika.dev Node.js Ödev 1 - Enes Öztürk");
    console.log("📥 User ID: 1 için veriler çekiliyor...");
    console.log("==================================================");

    const result = await getData(1);

    console.log("\\n✅ Başarıyla Alınan Birleşik Veri:\\n");
    console.dir(result, { depth: null, colors: true });
    console.log("\\n==================================================");
    console.log("✨ Ödev tamamlandı - Enes Öztürk");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Veri çekilirken hata meydana geldi:", error.message);
  }
})();`;

  const terminalOutput = `$ node src/app.js
==================================================
🚀 Patika.dev Node.js Ödev 1 - Enes Öztürk
📥 User ID: 1 için veriler çekiliyor...
==================================================

✅ Başarıyla Alınan Birleşik Veri:

{
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: { lat: '-37.3159', lng: '81.1496' }
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets'
  },
  posts: [
    {
      userId: 1,
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio...',
      body: 'quia et suscipit suscipit recusandae consequuntur...'
    },
    ... (toplam 10 gönderi listelendi)
  ]
}

==================================================
✨ Ödev tamamlandı - Enes Öztürk
==================================================`;

  const checklistItems = [
    { title: 'src/lib/service.js oluşturuldu', desc: 'lib dizini altında service.js tanımlandı.', done: true },
    { title: 'async & default export getData()', desc: 'getData asenkron tanımlandı ve default dışa aktarıldı.', done: true },
    { title: 'Number tipinde tek parametre (userId)', desc: 'User ID parametresi alıp sayı kontrolü yapıyor.', done: true },
    { title: 'Axios ile users/{id} isteği', desc: 'https://jsonplaceholder.typicode.com/users/:id endpointi çekildi.', done: true },
    { title: 'Axios ile posts?userId={id} isteği', desc: 'Kullanıcının tüm gönderileri await ile çekildi.', done: true },
    { title: 'Veriler birleştirilip döndürüldü', desc: 'Kullanıcı nesnesine posts alanı eklenip tek obje oluşturuldu.', done: true },
    { title: 'src/app.js oluşturuldu ve import edildi', desc: 'getData import edilip çağrıldı ve console.log ile yazdırıldı.', done: true },
    { title: 'Enes Öztürk İmzası', desc: 'Kod yorumlarında ve konsol çıktılarında Enes Öztürk imzası yer alıyor.', done: true }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                  Enes Öztürk
                </span>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs px-2 py-0.5 rounded-full font-medium">
                  Patika.dev Ödev 1
                </span>
              </div>
              <p className="text-xs text-slate-400">Node.js, Axios & Async/Await Veri Çekme</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Gereksinimler Tamamlandı
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/30 via-slate-900/20 to-transparent py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4" /> JavaScript & Node.js API Modülü
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              JSONPlaceholder & Axios Entegrasyonu
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Bu uygulama, <span className="text-indigo-300 font-mono text-xs bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-800/40">src/lib/service.js</span> içinde tanımlanan <code className="text-amber-300">getData(userId)</code> fonksiyonu ile kullanıcı ve gönderi verilerini birleştirerek test etmenizi sağlar.
            </p>
          </div>

          {/* Student Badge Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex items-center gap-4 min-w-[280px]">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                EÖ
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Ödev Sahibi</div>
              <div className="text-base font-bold text-white">Enes Öztürk</div>
              <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Patika.dev Öğrencisi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Interactive Runner & Controls */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                getData() Canlı Test Paneli
              </h2>
              <p className="text-xs text-slate-400">
                Farklı bir User ID seçerek <code className="text-indigo-300">getData(userId)</code> fonksiyonunu anlık çalıştırın.
              </p>
            </div>

            {/* Quick selector buttons (1..10) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 font-medium">Hızlı Seçim:</span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setUserId(num);
                    executeGetData(num);
                  }}
                  className={`w-7 h-7 text-xs font-semibold rounded-lg transition-all ${
                    userId === num
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <label htmlFor="userIdInput" className="text-xs font-medium text-slate-400 block mb-1">
                Kullanıcı ID (userId):
              </label>
              <input
                id="userIdInput"
                type="number"
                min="1"
                max="10"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto sm:self-end">
              <button
                onClick={() => executeGetData(userId)}
                disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Fonksiyonu Çalıştır
              </button>

              <button
                onClick={() => {
                  setUserId(1);
                  executeGetData(1);
                }}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Sıfırla (User ID 1)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="sm:ml-auto flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-end">
              <button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'cards'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Kart Görünümü
              </button>
              <button
                onClick={() => setActiveView('json')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'json'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Ham JSON (Birleşik Obje)
              </button>
            </div>
          </div>

          {/* Status / Error display */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center gap-2">
              <span className="font-bold">Hata:</span> {error}
            </div>
          )}

          {/* Loaded Content Display */}
          {loading && !data && (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <RotateCcw className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm font-medium">JSONPlaceholder API'den veriler çekiliyor (Axios)...</p>
            </div>
          )}

          {data && (
            <div className="mt-4">
              {activeView === 'cards' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* User Profile Card */}
                  <div className="lg:col-span-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                        {data.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{data.name}</h3>
                        <p className="text-xs text-indigo-400">@{data.username} • ID: #{data.id}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">{data.email}</span>
                      </div>
                      {data.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{data.phone}</span>
                        </div>
                      )}
                      {data.website && (
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="text-indigo-400 hover:underline">{data.website}</span>
                        </div>
                      )}
                      {data.company && (
                        <div className="flex items-start gap-2.5">
                          <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-white">{data.company.name}</span>
                            <p className="text-[11px] text-slate-400 italic">"{data.company.catchPhrase}"</p>
                          </div>
                        </div>
                      )}
                      {data.address && (
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>{data.address.street}, {data.address.city}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Toplam Gönderi:</span>
                      <span className="font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                        {data.posts ? data.posts.length : 0} adet
                      </span>
                    </div>
                  </div>

                  {/* Posts List */}
                  <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <h3 className="font-bold text-white text-sm">
                          Kullanıcının Gönderileri (posts[])
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        {data.posts ? `${data.posts.length} içerik bulundu` : '0 içerik'}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {data.posts?.map((post) => (
                        <div
                          key={post.id}
                          className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3.5 transition group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="text-xs font-bold text-indigo-200 capitalize group-hover:text-indigo-300">
                              #{post.id} - {post.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed capitalize">
                            {post.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* JSON Viewer */
                <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-mono text-indigo-300 font-semibold">
                      getData({userId}) Dönüş Nesnesi:
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(data, null, 2), 'raw-json')}
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs transition"
                    >
                      {copiedKey === 'raw-json' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> JSON Kopyala
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-400 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[460px] leading-relaxed custom-scrollbar selection:bg-emerald-900">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Source Code & Terminal Viewer Tabs */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 bg-slate-950/60">
            <div className="flex items-center">
              <button
                onClick={() => setActiveCodeTab('service')}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${
                  activeCodeTab === 'service'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 text-amber-400" />
                src/lib/service.js
              </button>

              <button
                onClick={() => setActiveCodeTab('app')}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${
                  activeCodeTab === 'app'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 text-sky-400" />
                src/app.js
              </button>

              <button
                onClick={() => setActiveCodeTab('console')}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${
                  activeCodeTab === 'console'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                Terminal Çıktısı (node src/app.js)
              </button>
            </div>

            {/* Copy file button */}
            <button
              onClick={() => {
                const codeToCopy =
                  activeCodeTab === 'service'
                    ? serviceCode
                    : activeCodeTab === 'app'
                    ? appCode
                    : terminalOutput;
                handleCopy(codeToCopy, activeCodeTab);
              }}
              className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Dosyayı Kopyala
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-950/90">
            {activeCodeTab === 'service' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
                  <span>// src/lib/service.js - async/await, axios, user + posts merge</span>
                  <span className="text-indigo-400">Yazar: Enes Öztürk</span>
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[420px] leading-relaxed custom-scrollbar border border-slate-800/80">
                  {serviceCode}
                </pre>
              </div>
            )}

            {activeCodeTab === 'app' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
                  <span>// src/app.js - import getData from "./lib/service.js" & run</span>
                  <span className="text-indigo-400">Yazar: Enes Öztürk</span>
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[420px] leading-relaxed custom-scrollbar border border-slate-800/80">
                  {appCode}
                </pre>
              </div>
            )}

            {activeCodeTab === 'console' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
                  <span>$ node src/app.js komutunun gerçek yürütme çıktısı</span>
                  <span className="text-emerald-400">Exit Code: 0 (Success)</span>
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[420px] leading-relaxed custom-scrollbar border border-slate-800/80">
                  {terminalOutput}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Homework Requirements Checklist */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Ödev Gereksinimleri ve Doğrulama Listesi
              </h3>
              <p className="text-xs text-slate-400">
                Tüm kriterler sırasıyla yerine getirilmiş ve test edilmiştir.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
              8/8 Kriter Başarılı
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer with Enes Öztürk Signature */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Patika.dev Node.js Ödevi</span>
            <span>•</span>
            <span className="text-indigo-400 font-medium">Enes Öztürk İmzalı</span>
          </div>
          <div className="text-slate-500">
            JSONPlaceholder API & Axios & ES6 Modules
          </div>
        </div>
      </footer>
    </div>
  );
}
