/**
 * Interactive Swagger / OpenAPI REST Client
 * Author: Enes Öztürk
 * Enables full live testing of every WebApi endpoint with cURL generation, body payloads, headers, and validation error inspection.
 */

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Lock,
  ChevronDown,
  ChevronRight,
  Code2,
  RefreshCw,
  Send,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { CustomerAuthSession } from '../types.ts';

interface ApiExplorerProps {
  customerSession: CustomerAuthSession | null;
}

interface EndpointDef {
  id: string;
  tag: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  requiresAuth?: boolean;
  defaultBody?: any;
  defaultParams?: Record<string, string>;
}

const ENDPOINTS: EndpointDef[] = [
  // Movies
  {
    id: 'get-movies',
    tag: 'Movies',
    method: 'GET',
    path: '/movies',
    summary: 'Tüm aktif filmleri listeler (query: includeInactive, genre, search)',
  },
  {
    id: 'get-movie-by-id',
    tag: 'Movies',
    method: 'GET',
    path: '/movies/1',
    summary: 'ID bazında film detayını yönetmen ve oyuncu bilgileriyle getirir',
  },
  {
    id: 'post-movie',
    tag: 'Movies',
    method: 'POST',
    path: '/movies',
    summary: 'Yeni film ekler (FluentValidation ve AutoMapper ile korunur)',
    defaultBody: {
      title: 'Oppenheimer',
      year: 2023,
      genreId: 3,
      directorId: 1,
      actorIds: [3],
      price: 79.90,
    },
  },
  {
    id: 'put-movie',
    tag: 'Movies',
    method: 'PUT',
    path: '/movies/1',
    summary: 'Film bilgilerini günceller',
    defaultBody: {
      title: 'Inception (Extended Cut)',
      price: 54.90,
    },
  },
  {
    id: 'delete-movie',
    tag: 'Movies',
    method: 'DELETE',
    path: '/movies/1',
    summary: 'Filmi siler / pasife alır (Geçmiş siparişleri korumak için Soft-Delete uygulanır)',
  },

  // Actors
  {
    id: 'get-actors',
    tag: 'Actors',
    method: 'GET',
    path: '/actors',
    summary: 'Tüm oyuncuları ve oynadıkları film adetlerini listeler',
  },
  {
    id: 'get-actor-by-id',
    tag: 'Actors',
    method: 'GET',
    path: '/actors/1',
    summary: 'Oyuncu detayı ve filmografisini getirir',
  },
  {
    id: 'post-actor',
    tag: 'Actors',
    method: 'POST',
    path: '/actors',
    summary: 'Yeni oyuncu ekler',
    defaultBody: {
      firstName: 'Tom',
      lastName: 'Hardy',
    },
  },
  {
    id: 'put-actor',
    tag: 'Actors',
    method: 'PUT',
    path: '/actors/1',
    summary: 'Oyuncu bilgilerini günceller',
    defaultBody: {
      firstName: 'Leonardo',
      lastName: 'DiCaprio (Oscar)',
    },
  },
  {
    id: 'delete-actor',
    tag: 'Actors',
    method: 'DELETE',
    path: '/actors/1',
    summary: 'Oyuncu siler (İlişkili filmleri varsa veri tutarlılığı gereği 422 BusinessRuleException fırlatır)',
  },

  // Directors
  {
    id: 'get-directors',
    tag: 'Directors',
    method: 'GET',
    path: '/directors',
    summary: 'Tüm yönetmenleri listeler',
  },
  {
    id: 'get-director-by-id',
    tag: 'Directors',
    method: 'GET',
    path: '/directors/1',
    summary: 'Yönetmen detayını ve yönettiği filmleri getirir',
  },
  {
    id: 'post-director',
    tag: 'Directors',
    method: 'POST',
    path: '/directors',
    summary: 'Yeni yönetmen ekler',
    defaultBody: {
      firstName: 'Ridley',
      lastName: 'Scott',
    },
  },
  {
    id: 'delete-director',
    tag: 'Directors',
    method: 'DELETE',
    path: '/directors/1',
    summary: 'Yönetmen siler (Yönettiği film varsa veri tutarlılığı gereği 422 BusinessRuleException fırlatır)',
  },

  // Customers & Auth
  {
    id: 'get-customers',
    tag: 'Customers',
    method: 'GET',
    path: '/customers',
    summary: 'Müşterileri ve favori türlerini listeler',
  },
  {
    id: 'post-customer-register',
    tag: 'Customers',
    method: 'POST',
    path: '/customers/register',
    summary: 'Yeni müşteri kaydı oluşturur ve Bearer token döndürür',
    defaultBody: {
      firstName: 'Berk',
      lastName: 'Yıldız',
      email: 'berk@moviestore.com',
      password: 'password123',
      favoriteGenreIds: [1, 2],
    },
  },
  {
    id: 'post-customer-login',
    tag: 'Customers',
    method: 'POST',
    path: '/customers/login',
    summary: 'Müşteri girişi yapar ve oturum tokenı üretir',
    defaultBody: {
      email: 'enes@moviestore.com',
      password: 'secret123',
    },
  },
  {
    id: 'get-customer-me',
    tag: 'Customers',
    method: 'GET',
    path: '/customers/me',
    summary: 'Giriş yapan müşterinin profil bilgilerini getirir (Customer Guard gerektirir)',
    requiresAuth: true,
  },
  {
    id: 'delete-customer',
    tag: 'Customers',
    method: 'DELETE',
    path: '/customers/1',
    summary: 'Müşteri hesabını siler (Siparişi varsa veri tutarlılığı gereği engellenir)',
  },

  // Orders
  {
    id: 'post-order-purchase',
    tag: 'Orders',
    method: 'POST',
    path: '/orders',
    summary: 'Film satın alır (Sadece Customer yetkilidir, pasif film satın alınamaz)',
    requiresAuth: true,
    defaultBody: {
      movieId: 2,
    },
  },
  {
    id: 'get-orders-my',
    tag: 'Orders',
    method: 'GET',
    path: '/orders/my-orders',
    summary: 'Müşterinin satın alma geçmişini listeler (Customer Guard)',
    requiresAuth: true,
  },
  {
    id: 'get-orders-all',
    tag: 'Orders',
    method: 'GET',
    path: '/orders',
    summary: 'Sistemdeki tüm siparişleri listeler (Yönetim & Raporlama)',
  },

  // Genres
  {
    id: 'get-genres',
    tag: 'Genres',
    method: 'GET',
    path: '/genres',
    summary: 'Varsayılan film türlerini listeler',
  },

  // Unit Tests & Reset
  {
    id: 'get-tests-run',
    tag: 'Unit Tests',
    method: 'GET',
    path: '/tests/run',
    summary: 'Tüm birim testlerini (Validators, AutoMapper, Relational Integrity) backend üzerinde koşturur',
  },
  {
    id: 'post-database-reset',
    tag: 'System',
    method: 'POST',
    path: '/database/reset',
    summary: 'Veritabanını tohum verileriyle ilk haline sıfırlar',
  },
];

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ customerSession }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState(ENDPOINTS[0].path);
  const [customBody, setCustomBody] = useState(
    ENDPOINTS[0].defaultBody ? JSON.stringify(ENDPOINTS[0].defaultBody, null, 2) : ''
  );
  const [customToken, setCustomToken] = useState(customerSession?.token || '');
  const [responseResult, setResponseResult] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    durationMs: number;
  } | null>(null);
  const [executing, setExecuting] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [filterTag, setFilterTag] = useState<string>('All');

  const tags = ['All', ...new Set(ENDPOINTS.map(e => e.tag))];

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setCustomPath(ep.path);
    setCustomBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseResult(null);
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResponseResult(null);
    try {
      let parsedBody = undefined;
      if (customBody && ['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
        try {
          parsedBody = JSON.parse(customBody);
        } catch {
          parsedBody = customBody;
        }
      }

      const res = await api.executeRawRequest(
        selectedEndpoint.method,
        customPath,
        parsedBody,
        customToken || undefined
      );
      setResponseResult(res);
    } catch (err: any) {
      setResponseResult({
        status: err.status || 500,
        statusText: 'Hata',
        headers: {},
        data: err.details || { message: err.message },
        durationMs: 0,
      });
    } finally {
      setExecuting(false);
    }
  };

  const generateCurl = () => {
    let curl = `curl -X ${selectedEndpoint.method} "http://localhost:3000/api${customPath}" \\\n  -H "Content-Type: application/json"`;
    if (customToken) {
      curl += ` \\\n  -H "Authorization: Bearer ${customToken}"`;
    }
    if (customBody && ['POST', 'PUT'].includes(selectedEndpoint.method)) {
      curl += ` \\\n  -d '${customBody.replace(/\n/g, '')}'`;
    }
    return curl;
  };

  const copyCurlToClipboard = () => {
    navigator.clipboard.writeText(generateCurl());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const filteredEndpoints = filterTag === 'All'
    ? ENDPOINTS
    : ENDPOINTS.filter(e => e.tag === filterTag);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Swagger / REST WebApi Explorer</h2>
            <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              OpenAPI 3.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Movie Store servislerinin canlı HTTP isteklerini çalıştırın, cURL kodlarını kopyalayın ve validation/exception middleware yanıtlarını inceleyin.
          </p>
        </div>

        {/* Global Auth Token Input */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block">Bearer Token (Müşteri Yetkisi):</span>
            <input
              type="text"
              placeholder={customerSession ? 'Oturum Tokenı Aktif' : 'Token yapıştır veya giriş yap'}
              value={customToken}
              onChange={e => setCustomToken(e.target.value)}
              className="w-56 bg-transparent text-xs text-white focus:outline-none font-mono"
            />
          </div>
          {customerSession && !customToken && (
            <button
              onClick={() => setCustomToken(customerSession.token)}
              className="px-2 py-1 text-[10px] bg-rose-600 rounded text-white"
            >
              Uygula
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Endpoints list & Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                  filterTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Endpoint buttons */}
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredEndpoints.map(ep => {
              const isSelected = selectedEndpoint.id === ep.id;
              const methodColor =
                ep.method === 'GET' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                ep.method === 'PUT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border-rose-500/30';

              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/60 shadow-md shadow-indigo-950/40'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${methodColor}`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                        {ep.path}
                      </span>
                      {ep.requiresAuth && (
                        <span title="Müşteri Girişi Zorunlu" className="inline-flex items-center">
                          <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{ep.summary}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Request & Response Playground */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Top Method + Path URL Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span
                className={`px-3 py-2 text-xs font-mono font-bold rounded-xl border ${
                  selectedEndpoint.method === 'GET' ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' :
                  selectedEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  selectedEndpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {selectedEndpoint.method}
              </span>

              <div className="relative flex-1 w-full">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">/api</span>
                <input
                  type="text"
                  value={customPath}
                  onChange={e => setCustomPath(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={executing}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all shrink-0"
              >
                {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>İsteği Gönder</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              💡 {selectedEndpoint.summary}
            </p>

            {/* Request Body Editor (for POST/PUT) */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    İstek Gövdesi (Request Body / DTO JSON):
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomBody(selectedEndpoint.defaultBody ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) : '')}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Örneği Geri Yükle
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={customBody}
                  onChange={e => setCustomBody(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            )}

            {/* cURL Command Generator */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-slate-400">cURL Komutu</span>
                <button
                  onClick={copyCurlToClipboard}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-400 overflow-x-auto border border-slate-850">
                {generateCurl()}
              </pre>
            </div>
          </div>

          {/* Response Box */}
          {responseResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                      responseResult.status >= 200 && responseResult.status < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : responseResult.status === 400 || responseResult.status === 422
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {responseResult.status} {responseResult.statusText}
                  </span>
                  <span className="text-xs text-slate-400">
                    Süre: <strong className="text-white">{responseResult.durationMs}ms</strong>
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  Powered by Enes Öztürk WebApi
                </span>
              </div>

              {/* Response Body */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Yanıt Gövdesi (Response Body):
                </span>
                <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 border border-slate-800/80 leading-relaxed">
                  {typeof responseResult.data === 'object'
                    ? JSON.stringify(responseResult.data, null, 2)
                    : String(responseResult.data)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
