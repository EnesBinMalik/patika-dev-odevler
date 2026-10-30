import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  Database,
  Terminal,
  RotateCcw,
  Settings,
  Play,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import {
  apolloClient,
  activityLogs,
  subscribeToLogs,
  clearLogs,
  getCustomEndpoint,
  setCustomEndpoint,
  type GraphQLActivityLog,
} from '../graphql/client.ts';
import { typeDefs, resetState, executeGraphQL } from '../graphql/schema.ts';

interface GraphQLConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraphQLConsoleModal: React.FC<GraphQLConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'cache' | 'schema' | 'customQuery' | 'settings'>('logs');
  const [logs, setLogs] = useState<GraphQLActivityLog[]>([...activityLogs]);
  const [cacheDump, setCacheDump] = useState<string>('');
  const [customEndpointInput, setCustomEndpointInput] = useState(getCustomEndpoint() || '');
  const [endpointSaved, setEndpointSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Custom GraphQL Runner
  const [customQueryInput, setCustomQueryInput] = useState<string>(`query GetAllEventsWithDetails {
  events {
    id
    title
    date
    from
    to
    user {
      username
      email
    }
    location {
      name
      address
    }
    participants {
      user {
        username
      }
    }
  }
}`);
  const [customQueryResult, setCustomQueryResult] = useState<string>('');
  const [queryRunning, setQueryRunning] = useState(false);

  useEffect(() => {
    const unsub = subscribeToLogs(() => {
      setLogs([...activityLogs]);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLogs([...activityLogs]);
      try {
        setCacheDump(JSON.stringify(apolloClient.extract(), null, 2));
      } catch {
        setCacheDump('{}');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunCustomQuery = async () => {
    setQueryRunning(true);
    try {
      const res = await executeGraphQL(customQueryInput);
      setCustomQueryResult(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setCustomQueryResult(JSON.stringify({ error: err?.message }, null, 2));
    } finally {
      setQueryRunning(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Veri seti başlangıç durumuna döndürülsün mü?')) {
      resetState();
      apolloClient.resetStore();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleSaveEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomEndpoint(customEndpointInput.trim() || null);
    setEndpointSaved(true);
    setTimeout(() => setEndpointSaved(false), 3000);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 tracking-wider">
                APOLLO CLIENT & GRAPHQL GELİŞTİRİCİ KONSOLU
              </div>
              <h2 className="text-sm font-bold text-white">
                Sorgu Takibi, Önbellek ve Şema İnceleme
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-0 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sorgu Geçmişi ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('customQuery')}
            className={`px-3.5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'customQuery'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            GraphQL Çalıştırıcı (Playground)
          </button>
          <button
            onClick={() => {
              setActiveTab('cache');
              setCacheDump(JSON.stringify(apolloClient.extract(), null, 2));
            }}
            className={`px-3.5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cache'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Apollo InMemoryCache
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            GraphQL Şeması (SDL)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Backend & Ayarlar
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {/* 1. Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Apollo Client tarafından yürütülen sorgular ve mutasyonlar:
                </p>
                <button
                  onClick={clearLogs}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Kayıtları Temizle
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Henüz bir sorgu kaydedilmedi. Anasayfayı ziyaret ettiğinizde veya bir etkinliğe tıkladığınızda sorgular burada listelenecektir.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'success'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                            }`}
                          >
                            {log.operationName}
                          </span>
                          <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                        </div>
                        <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                          {log.durationMs}ms
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-lg overflow-x-auto text-[11px] text-indigo-300 mb-2 border border-slate-800">
                        <pre className="whitespace-pre-wrap">{log.query.trim()}</pre>
                      </div>

                      {log.variables && Object.keys(log.variables).length > 0 && (
                        <div className="text-[11px] text-slate-400 mb-2">
                          <span className="text-slate-500 font-semibold">Variables: </span>
                          <code className="text-amber-300">{JSON.stringify(log.variables)}</code>
                        </div>
                      )}

                      {log.responsePreview && (
                        <details className="mt-2 text-[11px]">
                          <summary className="cursor-pointer text-slate-400 hover:text-slate-200">
                            Yanıtı Görüntüle (Response Payload)
                          </summary>
                          <pre className="mt-2 bg-slate-900 p-3 rounded text-slate-300 overflow-x-auto max-h-48">
                            {log.responsePreview}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Custom Query Playground */}
          {activeTab === 'customQuery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Şemaya karşı özel GraphQL sorgusu yazıp hemen test edin:
                </p>
                <button
                  onClick={handleRunCustomQuery}
                  disabled={queryRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{queryRunning ? 'Yürütülüyor...' : 'Sorguyu Çalıştır'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1 font-mono">Query:</div>
                  <textarea
                    rows={12}
                    value={customQueryInput}
                    onChange={(e) => setCustomQueryInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1 font-mono">Result:</div>
                  <pre className="w-full h-[252px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 overflow-auto whitespace-pre-wrap">
                    {customQueryResult || '// Sonuç burada görüntülenecektir...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 3. Cache Tab */}
          {activeTab === 'cache' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Apollo Client <code className="text-indigo-400 font-mono">InMemoryCache</code> içerisindeki normalleştirilmiş veriler (Normalized Cache):
                </p>
                <button
                  onClick={() => setCacheDump(JSON.stringify(apolloClient.extract(), null, 2))}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Önbelleği Yenile
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-amber-300 overflow-x-auto max-h-[420px]">
                {cacheDump}
              </pre>
            </div>
          )}

          {/* 4. Schema Tab */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Ödev 4 ve önceki ödevlerde geliştirilen GraphQL Şeması (SDL):
              </p>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-indigo-300 overflow-x-auto max-h-[420px]">
                {typeDefs.trim()}
              </pre>
            </div>
          )}

          {/* 5. Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <form onSubmit={handleSaveEndpoint} className="space-y-3">
                <h4 className="text-sm font-bold text-white">Harici GraphQL Sunucu Adresi</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Varsayılan olarak uygulama, Ödev 1-3 standartlarındaki tam ilişkisel GraphQL şemasını dahili motor ile çalıştırır. Kendi yerel GraphQL sunucunuzu (örn: <code className="text-indigo-300 font-mono">http://localhost:4000/graphql</code>) bağlamak isterseniz adresi aşağıya girebilirsiniz.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="http://localhost:4000/graphql (Boş bırakılırsa dahili şema kullanılır)"
                    value={customEndpointInput}
                    onChange={(e) => setCustomEndpointInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Kaydet & Yenile
                  </button>
                </div>
                {endpointSaved && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ayarlar kaydedildi.</span>
                  </p>
                )}
              </form>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Veri Setini Sıfırla</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Eklediğiniz yeni etkinlikleri veya katılımcıları silip ilk şablon verilerine dönmek için sıfırlayabilirsiniz.
                </p>
                <button
                  onClick={handleResetData}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800 hover:bg-rose-900/60 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Veri Setini Fabrika Ayarlarına Döndür</span>
                </button>
                {resetSuccess && (
                  <p className="text-xs text-emerald-400">Veri seti başarıyla sıfırlandı!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>Enes Öztürk · GraphQL Homework 4 Inspector</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
          >
            Konsolu Gizle
          </button>
        </div>
      </div>
    </div>
  );
};
