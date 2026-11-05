import React, { useState } from 'react';
import {
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Trash2,
  ArrowRight,
  Send,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { libraryStore, ApiLog } from '../services/libraryStore';

export const ApiExplorerTab: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/author');
  const [paramId, setParamId] = useState<number>(1);
  const [requestBodyJson, setRequestBodyJson] = useState<string>(
    JSON.stringify(
      {
        firstName: 'Orhan',
        lastName: 'Pamuk',
        birthDate: '1952-06-07',
      },
      null,
      2
    )
  );
  const [latestResponse, setLatestResponse] = useState<unknown>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json; charset=utf-8',
    'X-Developer': 'Enes Öztürk',
    'X-Powered-By': 'ASP.NET Core 8.0',
    Server: 'Kestrel',
  });
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const logs = libraryStore.getApiLogs();
  const authors = libraryStore.getRawAuthors();

  const endpoints = [
    {
      id: 'get-all',
      key: 'GET /api/author',
      method: 'GET',
      path: '/api/author',
      summary: '1. Tüm Yazarları Listeleme',
      dto: 'Returns: List<AuthorsViewModel>',
      needsId: false,
      hasBody: false,
    },
    {
      id: 'get-by-id',
      key: 'GET /api/author/{id}',
      method: 'GET',
      path: '/api/author/{id}',
      summary: '2. Spesifik Bir Yazarın Bilgilerini Getirme',
      dto: 'Returns: AuthorDetailViewModel',
      needsId: true,
      hasBody: false,
    },
    {
      id: 'post-create',
      key: 'POST /api/author',
      method: 'POST',
      path: '/api/author',
      summary: '3. Yeni Yazar Ekleme',
      dto: 'Body: CreateAuthorModel -> Returns: AuthorsViewModel',
      needsId: false,
      hasBody: true,
      defaultBody: {
        firstName: 'Oğuz',
        lastName: 'Atay',
        birthDate: '1934-10-12',
      },
    },
    {
      id: 'put-update',
      key: 'PUT /api/author/{id}',
      method: 'PUT',
      path: '/api/author/{id}',
      summary: '4. Yazar Bilgileri Güncelleme',
      dto: 'Body: UpdateAuthorModel',
      needsId: true,
      hasBody: true,
      defaultBody: {
        firstName: 'Sabahattin (Güncellendi)',
        lastName: 'Ali',
        birthDate: '1907-02-25',
      },
    },
    {
      id: 'delete-author',
      key: 'DELETE /api/author/{id}',
      method: 'DELETE',
      path: '/api/author/{id}',
      summary: '5. Yazar Silme (İş Kuralı: Yayında Kitap Yoksa)',
      dto: 'Returns: 200 OK / 422 Unprocessable Entity',
      needsId: true,
      hasBody: false,
    },
  ];

  const currentEp = endpoints.find((e) => e.key === selectedEndpoint) || endpoints[0];

  const handleSelectEndpoint = (epKey: string) => {
    setSelectedEndpoint(epKey);
    const ep = endpoints.find((e) => e.key === epKey);
    if (ep?.defaultBody) {
      setRequestBodyJson(JSON.stringify(ep.defaultBody, null, 2));
    }
  };

  const handleExecute = () => {
    const start = performance.now();
    try {
      if (currentEp.key === 'GET /api/author') {
        const res = libraryStore.getAllAuthors();
        setResponseStatus(res.statusCode);
        setLatestResponse(res);
      } else if (currentEp.key === 'GET /api/author/{id}') {
        const res = libraryStore.getAuthorById(Number(paramId));
        setResponseStatus(res.statusCode);
        setLatestResponse(res);
      } else if (currentEp.key === 'POST /api/author') {
        let parsed;
        try {
          parsed = JSON.parse(requestBodyJson);
        } catch {
          setResponseStatus(400);
          setLatestResponse({
            statusCode: 400,
            success: false,
            message: 'Geçersiz JSON formatı gönderildi!',
            signature: 'Enes Öztürk',
          });
          return;
        }
        const res = libraryStore.createAuthor(parsed);
        setResponseStatus(res.statusCode);
        setLatestResponse(res);
      } else if (currentEp.key === 'PUT /api/author/{id}') {
        let parsed;
        try {
          parsed = JSON.parse(requestBodyJson);
        } catch {
          setResponseStatus(400);
          setLatestResponse({
            statusCode: 400,
            success: false,
            message: 'Geçersiz JSON formatı gönderildi!',
            signature: 'Enes Öztürk',
          });
          return;
        }
        const res = libraryStore.updateAuthor(Number(paramId), parsed);
        setResponseStatus(res.statusCode);
        setLatestResponse(res);
      } else if (currentEp.key === 'DELETE /api/author/{id}') {
        const res = libraryStore.deleteAuthor(Number(paramId));
        setResponseStatus(res.statusCode);
        setLatestResponse(res);
      }
    } finally {
      setExecutionTime(Math.max(2, Math.round(performance.now() - start)));
    }
  };

  // Helper buttons for testing specific validation scenarios
  const setTestScenario = (type: string) => {
    if (type === 'invalid-name') {
      setSelectedEndpoint('POST /api/author');
      setRequestBodyJson(
        JSON.stringify(
          {
            firstName: 'A', // Too short (min 2)
            lastName: '12345', // Contains numbers
            birthDate: '1990-01-01',
          },
          null,
          2
        )
      );
    } else if (type === 'future-date') {
      setSelectedEndpoint('POST /api/author');
      setRequestBodyJson(
        JSON.stringify(
          {
            firstName: 'Gelecek',
            lastName: 'Yazarı',
            birthDate: '2030-05-20', // Future date!
          },
          null,
          2
        )
      );
    } else if (type === 'delete-locked') {
      setSelectedEndpoint('DELETE /api/author/{id}');
      // Author 1 (Sabahattin Ali) has published books!
      setParamId(1);
    } else if (type === 'delete-unlocked') {
      setSelectedEndpoint('DELETE /api/author/{id}');
      // Author 7 (Deneme Yazarı) has no published books!
      const freeAuthor = authors.find((a) => {
        const books = libraryStore.getBooks().filter((b) => b.authorId === a.id && b.isPublished);
        return books.length === 0;
      });
      setParamId(freeAuthor?.id || 7);
    } else if (type === 'not-found') {
      setSelectedEndpoint('GET /api/author/{id}');
      setParamId(9999);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              Swagger / OpenAPI Canlı Test Konsolu
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Author Controller REST API Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Ödevde istenen 5 controller işlemini doğrudan HTTP istekleri ile tetikleyin, FluentValidation
              kurallarını, AutoMapper çıktılarını ve iş kuralı hata mesajlarını inceleyin.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Response Signature</span>
            <span className="text-xs font-mono font-bold text-indigo-300">
              X-Developer: Enes Öztürk
            </span>
          </div>
        </div>

        {/* Quick test scenario chips */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Hızlı Senaryo Testleri:</span>
          <button
            onClick={() => setTestScenario('delete-locked')}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer"
          >
            Yayındaki Yazar Silme (422 Hata)
          </button>
          <button
            onClick={() => setTestScenario('delete-unlocked')}
            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 cursor-pointer"
          >
            Kitapsız Yazar Silme (200 OK)
          </button>
          <button
            onClick={() => setTestScenario('future-date')}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
          >
            Gelecek Tarih Doğrulama (400 Bad Request)
          </button>
          <button
            onClick={() => setTestScenario('invalid-name')}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
          >
            Kısa/Rakamlı İsim Doğrulama (400 Bad Request)
          </button>
          <button
            onClick={() => setTestScenario('not-found')}
            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 cursor-pointer"
          >
            Olmayan Yazar Sorgusu (404 Not Found)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoints selector & request builder (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Author Controller Uç Noktaları
            </h3>
            <div className="space-y-1.5">
              {endpoints.map((ep) => {
                const isSelected = selectedEndpoint === ep.key;
                const methodColor =
                  ep.method === 'GET'
                    ? 'bg-blue-100 text-blue-800'
                    : ep.method === 'POST'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ep.method === 'PUT'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800';

                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep.key)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${methodColor}`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">{ep.path}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{ep.summary}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ep.dto}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Configuration Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700">İstek Parametreleri (Request)</h3>
              <span className="text-[10px] font-mono text-indigo-600 font-semibold">
                {currentEp.method} {currentEp.path}
              </span>
            </div>

            {currentEp.needsId && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yol Parametresi: <code>id</code> (int)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={paramId}
                    onChange={(e) => setParamId(Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="flex items-center gap-1 text-[11px]">
                    {authors.slice(0, 3).map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setParamId(a.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                      >
                        Id {a.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentEp.hasBody && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Gövde (Request Body - JSON)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                </div>
                <textarea
                  rows={6}
                  value={requestBodyJson}
                  onChange={(e) => setRequestBodyJson(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-200 bg-slate-900 text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <button
              onClick={handleExecute}
              className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>İsteği Gönder (Execute)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Response Viewer & Audit Log (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
            {/* Response Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">HTTP Yanıtı (Response)</span>
              </div>
              <div className="flex items-center gap-2">
                {executionTime !== null && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {executionTime} ms
                  </span>
                )}
                {responseStatus !== null && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : responseStatus === 404
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {responseStatus}{' '}
                    {responseStatus === 200
                      ? 'OK'
                      : responseStatus === 201
                      ? 'Created'
                      : responseStatus === 400
                      ? 'Bad Request'
                      : responseStatus === 404
                      ? 'Not Found'
                      : responseStatus === 422
                      ? 'Unprocessable Entity'
                      : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Response Headers */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span>Header: X-Developer: Enes Öztürk</span>
              <span>Content-Type: application/json</span>
            </div>

            {/* Response Body */}
            <div className="p-4 max-h-[380px] overflow-y-auto font-mono text-xs text-emerald-400 bg-slate-900">
              {latestResponse ? (
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(latestResponse, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500 italic py-12 text-center">
                  Henüz istek gönderilmedi. Sol taraftan bir uç nokta seçip "İsteği Gönder (Execute)"
                  butonuna tıklayınız.
                </div>
              )}
            </div>
          </div>

          {/* Recent API Call Logs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                İstek Geçmişi &amp; Log Denetimi ({logs.length})
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={() => libraryStore.clearApiLogs()}
                  className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  Logları Temizle
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                Henüz kayıtlı API çağrısı bulunmuyor.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {logs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="pt-2 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'GET'
                            ? 'bg-blue-100 text-blue-700'
                            : log.method === 'POST'
                            ? 'bg-emerald-100 text-emerald-700'
                            : log.method === 'PUT'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="font-semibold text-slate-800">{log.endpoint}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded ${
                          log.statusCode < 300
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-rose-700 bg-rose-50'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                      <span className="text-slate-400">{log.durationMs}ms</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
