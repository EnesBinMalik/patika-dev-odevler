import React, { useState, useEffect } from 'react';
import {
  Play,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Sparkles,
  FileCode,
  Terminal,
  History,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { QUERY_PRESETS, QueryPreset } from '../graphql/presets';

interface PlaygroundProps {
  onExecute: (query: string, variables?: any) => Promise<{ result: any; duration: number }>;
}

export const Playground: React.FC<PlaygroundProps> = ({ onExecute }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('odev-olaylar-full');
  const [query, setQuery] = useState<string>(QUERY_PRESETS[0].query);
  const [variables, setVariables] = useState<string>('');
  const [showVariables, setShowVariables] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [queryHistory, setQueryHistory] = useState<
    Array<{ id: string; query: string; time: string; ok: boolean }>
  >([]);

  // Automatically execute default preset on initial load
  useEffect(() => {
    handleRunQuery(QUERY_PRESETS[0].query);
  }, []);

  const handleSelectPreset = (preset: QueryPreset) => {
    setSelectedPreset(preset.id);
    setQuery(preset.query);
    setVariables(preset.variables || '');
    if (preset.variables) {
      setShowVariables(true);
    }
  };

  const handleRunQuery = async (queryToRun?: string) => {
    const targetQuery = queryToRun || query;
    if (!targetQuery.trim()) return;

    setLoading(true);
    let parsedVars: any = undefined;
    if (variables.trim()) {
      try {
        parsedVars = JSON.parse(variables);
      } catch (err: any) {
        setResponse({
          errors: [{ message: `Değişkenler (Variables) geçerli bir JSON değil: ${err.message}` }],
        });
        setLoading(false);
        return;
      }
    }

    try {
      const { result, duration: execTime } = await onExecute(targetQuery, parsedVars);
      setResponse(result);
      setDuration(execTime);

      setQueryHistory((prev) => [
        {
          id: Math.random().toString(),
          query: targetQuery,
          time: new Date().toLocaleTimeString(),
          ok: !result.errors,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err: any) {
      setResponse({
        errors: [{ message: err.message || 'Sorgu yürütülürken ağ veya sunucu hatası oluştu.' }],
      });
      setDuration(0);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut Ctrl/Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  const copyToClipboard = (text: string, setCopiedState: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const generateCurl = () => {
    const payload = JSON.stringify({
      query,
      variables: variables.trim() ? JSON.parse(variables) : undefined,
    });
    return `curl -X POST http://localhost:3000/graphql \\
  -H "Content-Type: application/json" \\
  -d '${payload.replace(/'/g, "'\\''")}'`;
  };

  const lineCount = query.split('\n').length;

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Homework Presets Bar */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800/80 p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-zinc-200">
              Ödev Hazır Sorguları (1-Tıkla Çalıştır)
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            Tüm zorunlu ve ilişkisel sorgular tek tıkla yüklenebilir
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUERY_PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  handleSelectPreset(p);
                  handleRunQuery(p.query);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-500/25 ring-1 ring-purple-400'
                    : p.highlight
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50 hover:bg-purple-900/60'
                    : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700/60 hover:text-white'
                }`}
              >
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
        {/* Left Column: Query Editor (7 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-zinc-300">GraphQL Query Editor</span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                (Ctrl / ⌘ + Enter)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                  showVariables || variables.trim()
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                title="Sorgu Değişkenleri (Variables)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Variables</span>
                {showVariables ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              <button
                onClick={() => copyToClipboard(generateCurl(), setCopiedCurl)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                title="cURL komutu olarak kopyala"
              >
                {copiedCurl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Terminal className="w-3.5 h-3.5" />
                )}
                <span>cURL</span>
              </button>

              <button
                onClick={() => handleRunQuery()}
                disabled={loading}
                className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Çalışıyor...' : 'Çalıştır'}</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="relative flex-1 flex bg-zinc-950 font-mono text-sm">
            {/* Line Numbers */}
            <div className="select-none py-3 px-2 text-right text-zinc-600 text-xs bg-zinc-950/80 border-r border-zinc-900 w-10">
              {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Query Input */}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 bg-transparent p-3 text-zinc-200 leading-6 resize-none focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm selection:bg-purple-900/60"
              placeholder="query { users { id username } }"
            />
          </div>

          {/* Collapsible Variables Panel */}
          {showVariables && (
            <div className="border-t border-zinc-800 bg-zinc-950 p-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                <span>Query Variables (JSON)</span>
                <span className="text-[10px] text-zinc-600">Ör: {`{ "id": 1 }`}</span>
              </div>
              <textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder='{\n  "data": { ... }\n}'
                rows={4}
                className="w-full bg-zinc-900 text-zinc-200 font-mono text-xs p-2.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-purple-600"
              />
            </div>
          )}

          {/* Query Footer & Active Preset Info */}
          <div className="px-4 py-2 bg-zinc-950/90 border-t border-zinc-900 text-xs text-zinc-500 flex items-center justify-between">
            <span className="truncate max-w-[320px]">
              {QUERY_PRESETS.find((p) => p.id === selectedPreset)?.description || 'Özel sorgu'}
            </span>
            <button
              onClick={() => {
                setQuery('');
                setResponse(null);
              }}
              className="hover:text-zinc-300 transition"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Right Column: Response Viewer (6 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Response Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-300">GraphQL Yanıtı (JSON)</span>
              {response && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                      response.errors
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {response.errors ? 'Hata Var' : '200 OK'}
                  </span>
                  {duration !== null && (
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {duration} ms
                    </span>
                  )}
                </div>
              )}
            </div>

            {response && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(response, null, 2), setCopiedResponse)
                  }
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                  title="Yanıtı Kopyala"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>JSON Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Response Content */}
          <div className="flex-1 bg-zinc-950 p-4 overflow-auto font-mono text-xs sm:text-sm">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-20 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span className="text-xs">GraphQL sunucusu sorgulanıyor...</span>
              </div>
            ) : response ? (
              <pre className="text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre">
                {formatHighlightedJson(response)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 py-20 gap-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <span className="text-xs">Sorguyu çalıştırmak için "Çalıştır" butonuna basın</span>
              </div>
            )}
          </div>

          {/* Query History Bar */}
          {queryHistory.length > 0 && (
            <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-900 flex items-center gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
              <span className="text-zinc-500 flex items-center gap-1 shrink-0">
                <History className="w-3 h-3" /> Geçmiş:
              </span>
              {queryHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuery(item.query);
                    handleRunQuery(item.query);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] shrink-0 transition ${
                    item.ok
                      ? 'bg-zinc-900 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800'
                      : 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/60'
                  }`}
                  title={item.query}
                >
                  {item.time} ({item.ok ? '✓' : '✗'})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper to colorize JSON keys, strings, numbers, booleans, null
function formatHighlightedJson(data: any): React.ReactNode {
  const jsonString = JSON.stringify(data, null, 2);

  // Simple token regex for JSON syntax coloring
  const lines = jsonString.split('\n');
  return lines.map((line, idx) => {
    // Check if line contains a key-value pair
    const keyMatch = line.match(/^(\s*)(".*?"):(.*)$/);
    if (keyMatch) {
      const indent = keyMatch[1];
      const key = keyMatch[2];
      const rest = keyMatch[3];

      return (
        <div key={idx} className="leading-5">
          <span>{indent}</span>
          <span className="text-purple-400">{key}</span>:
          {renderValue(rest)}
        </div>
      );
    }
    return (
      <div key={idx} className="leading-5">
        {renderValue(line)}
      </div>
    );
  });
}

function renderValue(val: string): React.ReactNode {
  // Strings
  if (val.includes('"')) {
    const parts = val.split(/(".*?")/);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith('"') && part.endsWith('"')) {
            return (
              <span key={i} className="text-emerald-400">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }
  // Booleans / null
  if (/true|false|null/.test(val)) {
    return (
      <span>
        {val.replace(/\b(true|false|null)\b/g, (m) => m === 'null' ? '∅ null' : m)}
      </span>
    );
  }
  // Numbers
  if (/\b\d+(\.\d+)?\b/.test(val)) {
    return <span className="text-amber-400">{val}</span>;
  }
  return <span>{val}</span>;
}
