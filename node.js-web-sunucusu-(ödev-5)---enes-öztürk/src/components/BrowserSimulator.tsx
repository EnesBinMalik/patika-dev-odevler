/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Globe,
  Code,
  ListFilter,
  CheckCircle,
  AlertTriangle,
  Send,
  User,
  Mail,
  Home,
  FileCode,
  Clock,
  HardDrive
} from 'lucide-react';

interface BrowserSimulatorProps {
  currentUrl: string;
  onNavigate: (path: string) => void;
  isServerRunning: boolean;
  onStartServer: () => void;
  lastResponse?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    rawHtml: string;
    durationMs: number;
    bytes: number;
  };
}

export const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({
  currentUrl,
  onNavigate,
  isServerRunning,
  onStartServer,
  lastResponse,
}) => {
  const [addressInput, setAddressInput] = useState(currentUrl);
  const [viewMode, setViewMode] = useState<'rendered' | 'raw' | 'headers'>('rendered');

  // Synchronize internal input if currentUrl changes from quick actions
  React.useEffect(() => {
    setAddressInput(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = addressInput.trim();
    if (cleaned.startsWith('http://localhost:5000')) {
      cleaned = cleaned.replace('http://localhost:5000', '') || '/';
    } else if (!cleaned.startsWith('/')) {
      cleaned = '/' + cleaned;
    }
    onNavigate(cleaned);
  };

  const getPageInfo = () => {
    const path = currentUrl === '/' || currentUrl === '/index' ? '/index' : currentUrl;
    if (path === '/index') {
      return {
        title: 'Index Sayfası',
        heading: 'Index sayfasına hoşgeldiniz',
        description: 'Node.js http.createServer ile oluşturulan ana karşılama sayfası.',
        icon: <Home className="w-5 h-5 text-emerald-400" />
      };
    }
    if (path === '/hakkimda') {
      return {
        title: 'Hakkımda Sayfası',
        heading: 'Hakkımda sayfasına hoşgeldiniz',
        description: 'Geliştirici Enes Öztürk biyografisi ve proje detayları sayfası.',
        icon: <User className="w-5 h-5 text-indigo-400" />
      };
    }
    if (path === '/iletisim') {
      return {
        title: 'İletişim Sayfası',
        heading: 'İletişim sayfasına hoşgeldiniz',
        description: 'Enes Öztürk ile iletişime geçmek için iletişim kanalları.',
        icon: <Mail className="w-5 h-5 text-amber-400" />
      };
    }
    return {
      title: '404 - Sayfa Bulunamadı',
      heading: '404 Sayfa Bulunamadı',
      description: 'Sunucuda istenen rota bulunamadığında dönen hata sayfası.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />
    };
  };

  const page = getPageInfo();
  const is404 = lastResponse?.status === 404;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Browser Window Chrome */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        {/* Window controls */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></div>
          <span className="ml-2 text-xs font-mono text-slate-500 hidden sm:inline">
            Local Browser Client
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('rendered')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'rendered'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sayfa Görünümü</span>
            <span className="sm:hidden">Görünüm</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'raw'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ham HTML</span>
            <span className="sm:hidden">HTML</span>
          </button>
          <button
            onClick={() => setViewMode('headers')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'headers'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTTP Başlıkları</span>
            <span className="sm:hidden">Header</span>
          </button>
        </div>
      </div>

      {/* Browser Navigation Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex items-center space-x-1 text-slate-400">
          <button
            onClick={() => onNavigate('/')}
            className="p-1.5 hover:bg-slate-800 rounded-md transition text-slate-300"
            title="Ana Sayfa"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate(currentUrl)}
            className="p-1.5 hover:bg-slate-800 rounded-md transition text-slate-300"
            title="Yenile"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="relative w-full flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 transition-colors shadow-inner">
            <Lock className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <span className="text-xs text-slate-500 font-mono select-none hidden md:inline">
              http://localhost:5000
            </span>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="/ veya /index, /hakkimda, /iletisim"
              className="bg-transparent text-xs text-slate-100 font-mono w-full focus:outline-none px-1"
            />
            <button
              type="submit"
              className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
              title="Git"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Response Metrics Pill */}
        {isServerRunning && lastResponse && (
          <div className="flex items-center space-x-2 shrink-0 text-[11px] font-mono">
            <span
              className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                lastResponse.status === 200
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {lastResponse.status === 200 ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              {lastResponse.status} {lastResponse.statusText}
            </span>
            <span className="text-slate-400 hidden xl:flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastResponse.durationMs}ms
            </span>
            <span className="text-slate-400 hidden xl:flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {lastResponse.bytes} B
            </span>
          </div>
        )}
      </div>

      {/* Quick Route Buttons */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap mr-1">
          Hızlı Rotalar:
        </span>
        <button
          onClick={() => onNavigate('/')}
          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border flex items-center gap-1 ${
            currentUrl === '/'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-emerald-400 font-bold">GET</span> /
        </button>
        <button
          onClick={() => onNavigate('/index')}
          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border flex items-center gap-1 ${
            currentUrl === '/index'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-emerald-400 font-bold">GET</span> /index
        </button>
        <button
          onClick={() => onNavigate('/hakkimda')}
          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border flex items-center gap-1 ${
            currentUrl === '/hakkimda'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-indigo-400 font-bold">GET</span> /hakkimda
        </button>
        <button
          onClick={() => onNavigate('/iletisim')}
          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border flex items-center gap-1 ${
            currentUrl === '/iletisim'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-amber-400 font-bold">GET</span> /iletisim
        </button>
        <button
          onClick={() => onNavigate('/bilinmeyen-sayfa')}
          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border flex items-center gap-1 ${
            currentUrl === '/bilinmeyen-sayfa'
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="text-rose-400 font-bold">GET</span> /404-test
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 bg-slate-950/40 p-4 sm:p-6 overflow-y-auto min-h-[380px]">
        {!isServerRunning ? (
          /* Server Offline Error State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bu siteye ulaşılamıyor</h3>
            <p className="text-sm text-slate-400 max-w-md mb-2 font-mono">
              localhost:5000 bağlantıyı reddetti.
            </p>
            <p className="text-xs text-slate-500 mb-6 font-mono">
              ERR_CONNECTION_REFUSED
            </p>
            <button
              onClick={onStartServer}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Sunucuyu Başlat (node index.js)
            </button>
          </div>
        ) : viewMode === 'rendered' ? (
          /* Rendered Web Page View */
          <div className="bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 min-h-[340px] flex flex-col transition-all">
            {/* Virtual Webpage Mini Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Enes Öztürk • Web Sunucusu
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium text-slate-600">
                <button
                  onClick={() => onNavigate('/')}
                  className={`hover:text-emerald-700 transition ${
                    currentUrl === '/' || currentUrl === '/index'
                      ? 'text-emerald-700 font-bold underline'
                      : ''
                  }`}
                >
                  Index
                </button>
                <span>•</span>
                <button
                  onClick={() => onNavigate('/hakkimda')}
                  className={`hover:text-emerald-700 transition ${
                    currentUrl === '/hakkimda' ? 'text-emerald-700 font-bold underline' : ''
                  }`}
                >
                  Hakkımda
                </button>
                <span>•</span>
                <button
                  onClick={() => onNavigate('/iletisim')}
                  className={`hover:text-emerald-700 transition ${
                    currentUrl === '/iletisim' ? 'text-emerald-700 font-bold underline' : ''
                  }`}
                >
                  İletişim
                </button>
              </div>
            </div>

            {/* Virtual Page Content - Exactly what node server delivers */}
            <div className="p-8 sm:p-12 flex-1 flex flex-col justify-between">
              <div className="max-w-xl mx-auto w-full text-center sm:text-left space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                  {page.icon}
                  <span>Rota: {currentUrl}</span>
                </div>

                {/* EXACT REQUIRED H2 TAG AS REQUESTED IN ASSIGNMENT */}
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-emerald-500/20 shadow-sm">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {page.heading}
                  </h2>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {page.description}
                </p>

                {/* Specific details for pages */}
                {currentUrl === '/hakkimda' && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 space-y-2">
                    <p className="font-semibold text-sm">Geliştirici Profili:</p>
                    <p><strong>İsim:</strong> Enes Öztürk</p>
                    <p><strong>Ders:</strong> Node.js Temelleri (Patika.dev / Kodluyoruz)</p>
                    <p><strong>Konu:</strong> Ödev 5 - createServer ile Web Sunucusu Yazma</p>
                  </div>
                )}

                {currentUrl === '/iletisim' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
                    <p className="font-semibold text-sm">İletişim Bilgileri:</p>
                    <p><strong>E-posta:</strong> enesbino38@gmail.com</p>
                    <p><strong>Geliştirici:</strong> Enes Öztürk</p>
                    <p><strong>Sunucu Portu:</strong> 5000 (localhost:5000)</p>
                  </div>
                )}

                {is404 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-950 space-y-1">
                    <p className="font-bold text-sm">Hata 404: Rota Tanımlı Değil</p>
                    <p>Bu rota için sunucuda tanımlanmış bir içerik bulunamadı.</p>
                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate('/')}
                        className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700"
                      >
                        Ana Sayfaya Dön
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Developer Signature Bar inside the HTML page */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="font-mono text-slate-400">
                  HTTP/1.1 {lastResponse?.status} {lastResponse?.statusText}
                </span>
                <span className="font-medium text-slate-700">
                  Hazırlayan ve Kodlayan:{' '}
                  <strong className="text-emerald-700 font-bold">Enes Öztürk</strong>
                </span>
                <span className="font-mono text-slate-400">Port 5000</span>
              </div>
            </div>
          </div>
        ) : viewMode === 'raw' ? (
          /* Raw HTML Output */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <FileCode className="w-4 h-4" />
                res.write() / res.end() Ham Çıktısı:
              </span>
              <span className="text-[11px] text-slate-500">
                Boyut: {lastResponse?.bytes} bayt
              </span>
            </div>
            <pre className="text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
              {lastResponse?.rawHtml || '// İçerik yok'}
            </pre>
          </div>
        ) : (
          /* HTTP Headers View */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ListFilter className="w-4 h-4" />
                HTTP Yanıt Başlıkları (res.writeHead):
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Status: {lastResponse?.status} {lastResponse?.statusText}
              </span>
            </div>
            <div className="space-y-2">
              {lastResponse?.headers &&
                Object.entries(lastResponse.headers).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80 gap-1"
                  >
                    <span className="text-indigo-300 font-semibold">{k}:</span>
                    <span className="text-emerald-400 break-all">{v}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
