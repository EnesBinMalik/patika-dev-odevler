/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Interactive Studio / Playground
 */
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Sliders, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { presets, PresetOperation } from '../graphql/presets';
import { runQuery, ExecutionResult } from '../graphql/executor';

export const Playground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetOperation>(presets[0]);
  const [queryText, setQueryText] = useState<string>(presets[0].query);
  const [variablesText, setVariablesText] = useState<string>(presets[0].variables || '{}');
  const [showVariables, setShowVariables] = useState<boolean>(true);
  const [showDocs, setShowDocs] = useState<boolean>(false);
  
  const [executing, setExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // When preset changes, update query and variables
  const handleSelectPreset = (preset: PresetOperation) => {
    setSelectedPreset(preset);
    setQueryText(preset.query);
    setVariablesText(preset.variables || '{}');
  };

  const handleExecute = async () => {
    setExecuting(true);
    let parsedVars: any = {};
    try {
      if (variablesText.trim()) {
        parsedVars = JSON.parse(variablesText);
      }
    } catch (e: any) {
      setResult({
        errors: [{ message: `Variables JSON Sözdizimi Hatası: ${e.message}` }],
        durationMs: 0,
        status: 'ERROR'
      });
      setExecuting(false);
      return;
    }

    const res = await runQuery(queryText, parsedVars);
    setResult(res);
    setExecuting(false);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const content = JSON.stringify(result.data || result.errors, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queryText, variablesText]);

  const categories: Array<'User' | 'Event' | 'Location' | 'Participant' | 'Query'> = [
    'User',
    'Event',
    'Location',
    'Participant',
    'Query'
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* LEFT SIDEBAR: Presets & Mutation Catalog */}
      <div className="w-full lg:w-72 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mutation Menüsü (16)
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Ödev 2</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {categories.map((cat) => {
            const catPresets = presets.filter((p) => p.category === cat);
            if (catPresets.length === 0) return null;

            const categoryColor =
              cat === 'User'
                ? 'text-pink-400'
                : cat === 'Event'
                ? 'text-purple-400'
                : cat === 'Location'
                ? 'text-indigo-400'
                : cat === 'Participant'
                ? 'text-emerald-400'
                : 'text-amber-400';

            return (
              <div key={cat} className="space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className={`flex items-center gap-1.5 ${categoryColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {cat} Mutations
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {catPresets.length} adet
                  </span>
                </div>

                <div className="space-y-0.5">
                  {catPresets.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    const isDelete = preset.name.includes('delete');
                    const isDeleteAll = preset.name.includes('deleteAll');

                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="truncate">
                          <span className={isSelected ? 'text-white font-semibold' : ''}>
                            {preset.name}
                          </span>
                        </div>
                        {isDeleteAll ? (
                          <span className="text-[9px] px-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            ALL
                          </span>
                        ) : isDelete ? (
                          <span className="text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            DEL
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400">
          <p className="font-medium text-slate-300">Enes Öztürk İmzalı</p>
          <p className="text-[10px] text-slate-500">Tüm CRUD & DeleteAll gereksinimleri hazırdır.</p>
        </div>
      </div>

      {/* CENTER: Query & Variables Editor */}
      <div className="flex-1 flex flex-col border-r border-slate-800 min-w-0">
        {/* Editor Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {selectedPreset.name}
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-500 truncate max-w-md">
              — {selectedPreset.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVariables(!showVariables)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition ${
                showVariables
                  ? 'bg-slate-800 text-purple-300 border-purple-500/30'
                  : 'text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
              title="Query Variables Panelini Aç/Kapat"
            >
              <Sliders className="w-3 h-3" />
              <span>Variables</span>
            </button>

            <button
              onClick={handleExecute}
              disabled={executing}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md shadow-purple-600/30 transition active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{executing ? 'Çalışıyor...' : 'Çalıştır'}</span>
              <kbd className="hidden md:inline-block ml-1 px-1 py-0.2 bg-purple-950/60 rounded text-[9px] text-purple-200">
                ⌘↵
              </kbd>
            </button>
          </div>
        </div>

        {/* Query Input Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-1 text-[11px] text-slate-500">
              <span>GraphQL Operation (Query / Mutation)</span>
              <span>SDL Standartı</span>
            </div>
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 bg-slate-900/60 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed selection:bg-purple-900/60"
              placeholder="GraphQL Mutation veya Query buraya..."
            />
          </div>

          {/* Variables Bottom Drawer */}
          {showVariables && (
            <div className="h-44 border-t border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
              <div className="px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-purple-400" />
                  Query Variables (JSON)
                </span>
                <span className="text-[10px] text-slate-500">
                  Parametreler bu alandan $data ve $id ile aktarılır
                </span>
              </div>
              <textarea
                value={variablesText}
                onChange={(e) => setVariablesText(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 bg-transparent text-amber-300 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed selection:bg-purple-900/60"
                placeholder="{}"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Execution Output / JSON Response */}
      <div className="w-full lg:w-1/2 flex flex-col min-w-0 bg-slate-950">
        {/* Output Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Yanıt (Response)</span>
            {result && (
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                  result.status === 'SUCCESS'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {result.status === 'SUCCESS' ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>200 OK</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Hata</span>
                  </>
                )}
              </span>
            )}
            {result && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Clock className="w-3 h-3" />
                {result.durationMs} ms
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <button
                onClick={handleCopyResult}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700/60 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>JSON Kopyala</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed">
          {result ? (
            <pre className="text-slate-200">
              {JSON.stringify(
                result.errors && result.errors.length > 0
                  ? { errors: result.errors, data: result.data }
                  : { data: result.data },
                null,
                2
              )}
            </pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Sonuçları görmek için &quot;Çalıştır&quot; butonuna tıklayın
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Sol taraftaki menüden 16 mutation&apos;dan dilediğinizi seçebilir veya kendi GraphQL sorgunuzu yazabilirsiniz.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 font-mono">
                <span>Kısayol:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                  Ctrl + Enter
                </kbd>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
