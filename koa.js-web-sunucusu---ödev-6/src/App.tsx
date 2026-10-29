import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  Globe,
  Terminal,
  Code2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Send,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';

interface RequestLog {
  id: string;
  time: string;
  method: string;
  url: string;
  status: number;
  duration: number;
  message: string;
}

const KOA_CODE_VANILLA = `/**
 * Patika.dev / Kodluyoruz - Node.js Eğitimi
 * Ödev 6: Koa.js ile Web Sunucusu Yazımı
 * 
 * Hazırlayan: Enes Öztürk
 * Port: 3000
 */

const Koa = require('koa');
const app = new Koa();
const port = 3000;

// Koa Middleware ve Rota Yönetimi
app.use(async (ctx) => {
  // İstemciden gelen URL yolunu küçük harfe çevirerek yakalıyoruz
  const url = ctx.url.toLowerCase();
  
  // Yanıt başlığı: HTML ve UTF-8 karakter seti
  ctx.type = 'text/html; charset=utf-8';

  if (url === '/' || url === '/index') {
    ctx.status = 200;
    ctx.body = '<h1>INDEX sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else if (url === '/hakkimda') {
    ctx.status = 200;
    ctx.body = '<h1>HAKKIMDA sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else if (url === '/iletisim') {
    ctx.status = 200;
    ctx.body = '<h1>İLETİŞİM sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else {
    ctx.status = 404;
    ctx.body = '<h1>404 - Sayfa Bulunamadı</h1>' +
               '<p>Aradığınız sayfa mevcut değil.</p>';
  }
});

// Sunucuyu 3000 portunda dinlemeye alıyoruz
app.listen(port, () => {
  console.log(\`Sunucu port \${port} üzerinde başarıyla çalışmaya başladı...\`);
  console.log('Geliştirici: Enes Öztürk');
});`;

const KOA_CODE_ROUTER = `/**
 * Alternatif Çözüm: @koa/router ile Koa.js Web Sunucusu
 * Hazırlayan: Enes Öztürk
 * Port: 3000
 */

const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();
const port = 3000;

// Index sayfası rotaları (/ ve /index)
router.get(['/', '/index'], (ctx) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = '<h1>INDEX sayfasına hoşgeldiniz</h1>' +
             '<footer>Enes Öztürk</footer>';
});

// Hakkımda sayfası rotası
router.get('/hakkimda', (ctx) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = '<h1>HAKKIMDA sayfasına hoşgeldiniz</h1>' +
             '<footer>Enes Öztürk</footer>';
});

// İletişim sayfası rotası
router.get('/iletisim', (ctx) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = '<h1>İLETİŞİM sayfasına hoşgeldiniz</h1>' +
             '<footer>Enes Öztürk</footer>';
});

// Middleware'leri Koa uygulamasına dahil ediyoruz
app.use(router.routes());
app.use(router.allowedMethods());

// 404 Ele Alma Middleware
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = '<h1>404 - Sayfa Bulunamadı</h1>';
});

app.listen(port, () => {
  console.log(\`Koa Router sunucusu \${port} portunda çalışıyor.\`);
  console.log('İmza: Enes Öztürk');
});`;

const CURL_EXAMPLE = `# 1. Index Sayfasını Test Edin:
curl -i http://localhost:3000/index

# 2. Hakkımda Sayfasını Test Edin:
curl -i http://localhost:3000/hakkimda

# 3. İletişim Sayfasını Test Edin:
curl -i http://localhost:3000/iletisim

# 4. Olmayan bir rotada 404 test edin:
curl -i http://localhost:3000/bilgi`;

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/index');
  const [customPathInput, setCustomPathInput] = useState<string>('/index');
  const [activeCodeTab, setActiveCodeTab] = useState<'vanilla' | 'router' | 'curl'>('vanilla');
  const [viewMode, setViewMode] = useState<'preview' | 'html' | 'headers'>('preview');
  const [copied, setCopied] = useState<boolean>(false);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isServerRunning, setIsServerRunning] = useState<boolean>(true);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<'tester' | 'code' | 'docs'>('tester');
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initial boot log
  useEffect(() => {
    const initialLogs: RequestLog[] = [
      {
        id: 'init-1',
        time: new Date().toLocaleTimeString('tr-TR'),
        method: 'SYSTEM',
        url: 'localhost:3000',
        status: 200,
        duration: 0,
        message: 'Koa.js uygulaması başlatıldı (v2.x). Port: 3000. İmza: Enes Öztürk.'
      },
      {
        id: 'init-2',
        time: new Date().toLocaleTimeString('tr-TR'),
        method: 'SYSTEM',
        url: 'routes',
        status: 200,
        duration: 0,
        message: 'Kayıtlı rotalar: [ / , /index , /hakkimda , /iletisim ]'
      }
    ];
    setLogs(initialLogs);
    handleSimulateRequest('/index', false);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Request processor simulating Koa response logic
  const handleSimulateRequest = (path: string, appendLog: boolean = true) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const normalized = cleanPath.toLowerCase();
    const startTime = performance.now();
    
    let statusCode = 200;
    let headingText = '';
    
    if (normalized === '/' || normalized === '/index') {
      headingText = 'INDEX sayfasına hoşgeldiniz';
      statusCode = 200;
    } else if (normalized === '/hakkimda') {
      headingText = 'HAKKIMDA sayfasına hoşgeldiniz';
      statusCode = 200;
    } else if (normalized === '/iletisim') {
      headingText = 'İLETİŞİM sayfasına hoşgeldiniz';
      statusCode = 200;
    } else {
      headingText = '404 Sayfa Bulunamadı';
      statusCode = 404;
    }

    setCurrentRoute(cleanPath);
    setCustomPathInput(cleanPath);
    setRequestCount((prev) => prev + 1);

    if (appendLog) {
      const duration = Math.max(1, Math.round(performance.now() - startTime + Math.random() * 3));
      const newLog: RequestLog = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString('tr-TR'),
        method: 'GET',
        url: cleanPath,
        status: statusCode,
        duration,
        message: statusCode === 200 
          ? `ctx.body -> <h1>${headingText}</h1> (${duration}ms)`
          : `ctx.status = 404 | Rota tanımsız (${duration}ms)`
      };
      setLogs((prev) => [...prev.slice(-40), newLog]);
    }
  };

  const handleCopyCode = () => {
    const textToCopy =
      activeCodeTab === 'vanilla'
        ? KOA_CODE_VANILLA
        : activeCodeTab === 'router'
        ? KOA_CODE_ROUTER
        : CURL_EXAMPLE;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([KOA_CODE_VANILLA], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('tr-TR'),
        method: 'SYSTEM',
        url: '-',
        status: 200,
        duration: 0,
        message: 'Koa konsol günlüğü temizlendi.'
      }
    ]);
  };

  // Determine response details based on currentRoute
  const normalizedRoute = currentRoute.toLowerCase();
  const isIndex = normalizedRoute === '/' || normalizedRoute === '/index';
  const isHakkimda = normalizedRoute === '/hakkimda';
  const isIletisim = normalizedRoute === '/iletisim';
  const is404 = !isIndex && !isHakkimda && !isIletisim;

  const currentHeading = isIndex
    ? 'INDEX sayfasına hoşgeldiniz'
    : isHakkimda
    ? 'HAKKIMDA sayfasına hoşgeldiniz'
    : isIletisim
    ? 'İLETİŞİM sayfasına hoşgeldiniz'
    : '404 Sayfa Bulunamadı';

  const currentStatus = is404 ? 404 : 200;
  const statusText = currentStatus === 200 ? '200 OK' : '404 Not Found';

  const rawHtmlResponse = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${is404 ? '404 Bulunamadı' : currentHeading} | Koa.js</title>
</head>
<body>
  <h1>${currentHeading}</h1>
  <p>Enes Öztürk imzalı Koa.js web sunucusu (Port 3000)</p>
  <footer>Hazırlayan: Enes Öztürk</footer>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black tracking-wider">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base sm:text-lg">Koa.js Web Sunucusu</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Ödev 6
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Geliştirici & İmza: <span className="text-cyan-300 font-medium">Enes Öztürk</span> • Port: 3000
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-medium">
              <button
                onClick={() => setActiveSection('tester')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeSection === 'tester'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Canlı Test & Simülatör</span>
              </button>
              <button
                onClick={() => setActiveSection('code')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeSection === 'code'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Koa Kodları (index.js)</span>
              </button>
              <button
                onClick={() => setActiveSection('docs')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeSection === 'docs'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ödev Raporu & Koa Rehberi</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Port 3000 Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-t border-slate-800 bg-slate-900 px-4 py-2 gap-2 text-xs">
          <button
            onClick={() => setActiveSection('tester')}
            className={`flex-1 py-1.5 rounded-md text-center font-medium ${
              activeSection === 'tester' ? 'bg-cyan-500 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Canlı Test
          </button>
          <button
            onClick={() => setActiveSection('code')}
            className={`flex-1 py-1.5 rounded-md text-center font-medium ${
              activeSection === 'code' ? 'bg-cyan-500 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Kodlar
          </button>
          <button
            onClick={() => setActiveSection('docs')}
            className={`flex-1 py-1.5 rounded-md text-center font-medium ${
              activeSection === 'docs' ? 'bg-cyan-500 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Rehber
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Requirements Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Ödev 6: Koa.js ile Web Sunucumuz Hazır!
                </h1>
              </div>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                Tüm kriterler eksiksiz tamamlandı: <strong className="text-cyan-300">koa</strong> paketi kuruldu,
                sayfalar (<code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/index</code>,{' '}
                <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/hakkimda</code>,{' '}
                <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/iletisim</code>) ve{' '}
                <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">&lt;h1&gt;</code> başlıkları hazırlandı,
                port <strong className="text-cyan-300">3000</strong> yapılandırıldı ve{' '}
                <strong className="text-cyan-300">Enes Öztürk</strong> imzası eklendi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Koa Paketi</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Temel Sayfa</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Port 3000</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enes Öztürk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Live Tester & Browser Simulator */}
        {activeSection === 'tester' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Browser Simulation */}
            <div className="lg:col-span-7 space-y-4">
              {/* Virtual Browser Chrome */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Browser Top Bar */}
                <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800/80 flex items-center gap-3">
                  {/* Window dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>

                  {/* Refresh button */}
                  <button
                    onClick={() => handleSimulateRequest(currentRoute)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="İsteği Yenile"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Address input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSimulateRequest(customPathInput);
                    }}
                    className="flex-1 flex items-center bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus-within:border-cyan-500 transition"
                  >
                    <span className="text-slate-500 select-none mr-1 font-mono">http://localhost:3000</span>
                    <input
                      type="text"
                      value={customPathInput}
                      onChange={(e) => setCustomPathInput(e.target.value)}
                      placeholder="/index"
                      className="bg-transparent border-none outline-none flex-1 font-mono text-cyan-300 placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="text-slate-400 hover:text-cyan-400 p-0.5 ml-1"
                      title="İsteği Gönder"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>

                  {/* Status indicator */}
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      currentStatus === 200
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {statusText}
                  </span>
                </div>

                {/* Quick Route Shortcuts Bar */}
                <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-medium text-[11px] mr-1">Hızlı Rotalar:</span>
                    <button
                      onClick={() => handleSimulateRequest('/index')}
                      className={`px-2.5 py-1 rounded-md font-mono text-xs transition ${
                        isIndex
                          ? 'bg-cyan-500 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      /index
                    </button>
                    <button
                      onClick={() => handleSimulateRequest('/hakkimda')}
                      className={`px-2.5 py-1 rounded-md font-mono text-xs transition ${
                        isHakkimda
                          ? 'bg-cyan-500 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      /hakkimda
                    </button>
                    <button
                      onClick={() => handleSimulateRequest('/iletisim')}
                      className={`px-2.5 py-1 rounded-md font-mono text-xs transition ${
                        isIletisim
                          ? 'bg-cyan-500 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      /iletisim
                    </button>
                    <button
                      onClick={() => handleSimulateRequest('/tanimsiz-sayfa')}
                      className={`px-2.5 py-1 rounded-md font-mono text-xs transition ${
                        is404
                          ? 'bg-rose-500 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-300'
                      }`}
                    >
                      404 Test
                    </button>
                  </div>

                  {/* View mode switcher */}
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`px-2 py-0.5 rounded ${
                        viewMode === 'preview'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Önizleme
                    </button>
                    <button
                      onClick={() => setViewMode('html')}
                      className={`px-2 py-0.5 rounded ${
                        viewMode === 'html'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      HTML Çıktısı
                    </button>
                    <button
                      onClick={() => setViewMode('headers')}
                      className={`px-2 py-0.5 rounded ${
                        viewMode === 'headers'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      HTTP Headers
                    </button>
                  </div>
                </div>

                {/* Browser Viewport Content */}
                <div className="p-8 min-h-[380px] bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                  {viewMode === 'preview' && (
                    <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Koa.js Web Sunucusu • Port 3000</span>
                      </div>

                      {/* Required H1 Tag */}
                      <h1
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${
                          is404
                            ? 'text-rose-400'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400'
                        }`}
                      >
                        {currentHeading}
                      </h1>

                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        {is404
                          ? 'İstenilen rota sunucuda tanımlanmamış. Koa middleware yapısı 404 yanıtı döndürdü.'
                          : 'Bu sayfa Koa.js web framework’ü kullanılarak Node.js üzerinde dinamik olarak render edilmiştir.'}
                      </p>

                      {/* In-Page Navigation */}
                      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                        <button
                          onClick={() => handleSimulateRequest('/index')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isIndex
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          /index
                        </button>
                        <button
                          onClick={() => handleSimulateRequest('/hakkimda')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isHakkimda
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          /hakkimda
                        </button>
                        <button
                          onClick={() => handleSimulateRequest('/iletisim')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isIletisim
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          /iletisim
                        </button>
                      </div>

                      {/* Required Signature */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          <span>Ödev 6</span>
                        </div>
                        <div className="font-medium text-slate-300">
                          İmza: <span className="text-cyan-300 font-semibold underline underline-offset-2">Enes Öztürk</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === 'html' && (
                    <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                        <span>ctx.body (Sunucudan Dönen Ham HTML)</span>
                        <span>Content-Type: text/html</span>
                      </div>
                      <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">{rawHtmlResponse}</pre>
                    </div>
                  )}

                  {viewMode === 'headers' && (
                    <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                        <span>HTTP Yanıt Başlıkları (Response Headers)</span>
                        <span className="text-emerald-400 font-bold">{statusText}</span>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">HTTP/1.1</span>
                          <span className="text-emerald-400">{statusText}</span>
                        </div>
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">Content-Type</span>
                          <span className="text-cyan-300">text/html; charset=utf-8</span>
                        </div>
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">Server</span>
                          <span className="text-slate-200">Koa.js (Node.js runtime)</span>
                        </div>
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">X-Port</span>
                          <span className="text-slate-200">3000</span>
                        </div>
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">X-Developer-Signature</span>
                          <span className="text-cyan-300 font-semibold">Enes Öztürk</span>
                        </div>
                        <div className="flex justify-between py-1 px-2 rounded bg-slate-950/60">
                          <span className="text-slate-400">Connection</span>
                          <span className="text-slate-200">keep-alive</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Koa Server Terminal & Log Stream */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
                {/* Terminal Header */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200 font-mono">
                      Koa Sunucu Konsolu (node index.js)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Toplam İstek: {requestCount}
                    </span>
                    <button
                      onClick={handleClearLogs}
                      className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Temizle
                    </button>
                  </div>
                </div>

                {/* Terminal Stream */}
                <div className="p-4 bg-slate-950/95 font-mono text-xs flex-1 max-h-[380px] overflow-y-auto space-y-2 scrollbar-thin">
                  <div className="text-slate-400 pb-2 border-b border-slate-800/80 leading-relaxed text-[11px]">
                    $ npm start (Port 3000)<br />
                    &gt; Koa web sunucusu hazırlandı. Geliştirici: Enes Öztürk
                  </div>

                  {logs.map((log) => (
                    <div key={log.id} className="leading-relaxed hover:bg-slate-900/50 p-1 rounded transition text-[11.5px]">
                      <span className="text-slate-600 mr-2">[{log.time}]</span>
                      {log.method === 'SYSTEM' ? (
                        <span className="text-sky-400 font-medium">{log.message}</span>
                      ) : (
                        <span>
                          <span
                            className={`font-bold mr-1.5 ${
                              log.method === 'GET' ? 'text-cyan-400' : 'text-amber-400'
                            }`}
                          >
                            {log.method}
                          </span>
                          <span className="text-slate-200 mr-1.5">{log.url}</span>
                          <span
                            className={`px-1 py-0.2 rounded font-bold mr-1.5 ${
                              log.status === 200
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="text-slate-500 text-[10px]">({log.duration}ms)</span>
                        </span>
                      )}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Quick Interactive Terminal Input / Trigger */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-xs">$</span>
                  <div className="flex-1 flex gap-1.5">
                    <button
                      onClick={() => handleSimulateRequest('/index')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition"
                    >
                      curl /index
                    </button>
                    <button
                      onClick={() => handleSimulateRequest('/hakkimda')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition"
                    >
                      curl /hakkimda
                    </button>
                    <button
                      onClick={() => handleSimulateRequest('/iletisim')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition"
                    >
                      curl /iletisim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Code Viewer & Exports */}
        {activeSection === 'code' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Code Tabs Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveCodeTab('vanilla')}
                      className={`px-3 py-1.5 rounded-md font-mono transition ${
                        activeCodeTab === 'vanilla'
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      index.js (Saf Koa)
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('router')}
                      className={`px-3 py-1.5 rounded-md font-mono transition ${
                        activeCodeTab === 'router'
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      index-router.js (@koa/router)
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-3 py-1.5 rounded-md font-mono transition ${
                        activeCodeTab === 'curl'
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Terminal & cURL Testleri
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>index.js İndir</span>
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                <pre className="text-slate-300">
                  {activeCodeTab === 'vanilla'
                    ? KOA_CODE_VANILLA
                    : activeCodeTab === 'router'
                    ? KOA_CODE_ROUTER
                    : CURL_EXAMPLE}
                </pre>
              </div>

              {/* Code Info Footer */}
              <div className="bg-slate-900/80 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Node.js v18+ / v20+ / v22+ uyumlu • Koa v2.x</span>
                </div>
                <span>Tasarım ve İmza: <strong className="text-cyan-300">Enes Öztürk</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Homework Requirements Checklist & Koa Guide */}
        {activeSection === 'docs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Homework Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Ödev 6 Kontrol Listesi</h3>
                  <p className="text-xs text-slate-400">Verilen tüm gereksinimlerin karşılanma durumu</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">1. koa Paketinin İndirilmesi</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm install koa</code> komutuyla
                      projeye dahil edildi ve package.json dosyasına eklendi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">2. index, hakkimda ve iletisim Sayfaları</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Koa middleware yapısında <code className="text-cyan-300">ctx.url</code> kontrolüyle her rota için
                      ayrı yanıt hazırlandı.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">3. &lt;h1&gt; Başlık Formatı</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Tüm rotalar istenen formatta döndürülüyor:
                      <br />• <code className="text-cyan-300">&lt;h1&gt;INDEX sayfasına hoşgeldiniz&lt;/h1&gt;</code>
                      <br />• <code className="text-cyan-300">&lt;h1&gt;HAKKIMDA sayfasına hoşgeldiniz&lt;/h1&gt;</code>
                      <br />• <code className="text-cyan-300">&lt;h1&gt;İLETİŞİM sayfasına hoşgeldiniz&lt;/h1&gt;</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">4. Port 3000</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">app.listen(3000)</code> kullanılarak
                      sunucu 3000 portunda dinlemeye alındı.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">5. Enes Öztürk İmzası</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Hem sayfa çıktılarında hem konsol açılış loglarında hem de kaynak kod yorum satırlarında Enes Öztürk
                      imzası yer almaktadır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Koa.js Educational Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Koa.js Neden ve Nasıl Kullanılır?</h3>
                  <p className="text-xs text-slate-400">Express ekibi tarafından tasarlanan yeni nesil framework</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Koa Context (`ctx`) Nedir?
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Express'te alışık olduğumuz <code className="text-slate-200">req</code> (request) ve{' '}
                    <code className="text-slate-200">res</code> (response) nesneleri, Koa'da tek bir{' '}
                    <strong className="text-cyan-300">ctx (context)</strong> nesnesi altında birleştirilmiştir. Yanıt
                    göndermek için <code className="text-slate-200">res.send()</code> yerine doğrudan{' '}
                    <code className="text-cyan-300">ctx.body = '...'</code> ataması yapılır.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Async / Await ve Soğan (Onion) Modeli
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Koa, middleware akışında modern <code className="text-slate-200">async/await</code> yapısını kullanır.
                    İstek içeri doğru katman katman akar (<code className="text-slate-200">await next()</code>) ve yanıt
                    üretildikten sonra aynı katmanlardan geri döner. Bu sayede hata yakalama (<code className="text-slate-200">try/catch</code>)
                    ve süre ölçümü son derece kolaylaşır.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Kendi Bilgisayarınızda Nasıl Çalıştırırsınız?
                  </h4>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 mt-2 space-y-1">
                    <div>1. Bir klasör açın: <span className="text-cyan-300">mkdir koa-odev &amp;&amp; cd koa-odev</span></div>
                    <div>2. Projeyi başlatın: <span className="text-cyan-300">npm init -y</span></div>
                    <div>3. Koa'yı yükleyin: <span className="text-cyan-300">npm install koa</span></div>
                    <div>4. Kodu yapıştırın ve çalıştırın: <span className="text-cyan-300">node index.js</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Node.js Eğitimi — <strong>Ödev 6: Koa.js ile Web Sunucusu</strong>
          </p>
          <p className="text-slate-400">
            Hazırlayan &amp; İmza:{' '}
            <span className="text-cyan-400 font-semibold">Enes Öztürk</span> • 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
