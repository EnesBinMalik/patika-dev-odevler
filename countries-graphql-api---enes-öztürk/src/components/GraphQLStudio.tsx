import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Download, RotateCcw, Sparkles, AlertCircle, Clock, Zap } from 'lucide-react';
import { QUERY_SAMPLES, QuerySample } from '../graphql/samples.ts';
import { runGraphQLQuery, GraphQLResponse } from '../graphql/executor.ts';

interface GraphQLStudioProps {
  initialQuery?: string;
}

export const GraphQLStudio: React.FC<GraphQLStudioProps> = ({ initialQuery }) => {
  const [selectedSample, setSelectedSample] = useState<QuerySample>(QUERY_SAMPLES[0]);
  const [queryText, setQueryText] = useState<string>(initialQuery || QUERY_SAMPLES[0].query);
  const [variablesText, setVariablesText] = useState<string>('{}');
  const [showVariables, setShowVariables] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<GraphQLResponse | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  // Sync if initialQuery prop changes
  useEffect(() => {
    if (initialQuery) {
      setQueryText(initialQuery);
      // Auto run
      handleExecute(initialQuery);
    }
  }, [initialQuery]);

  // Run on mount
  useEffect(() => {
    handleExecute(queryText);
  }, []);

  const handleExecute = async (queryToRun = queryText) => {
    setIsLoading(true);
    try {
      const res = await runGraphQLQuery(queryToRun, variablesText);
      setResponse(res);
    } catch (err: any) {
      setResponse({
        errors: [{ message: err.message || 'Execution failed' }],
        executionTimeMs: 0,
        source: 'in-memory-engine',
        endpoint: '/graphql',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prettify GraphQL query indentation
  const handlePrettify = () => {
    const lines = queryText.split('\n');
    let indent = 0;
    const formatted = lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('}') || trimmed.startsWith(')')) {
          indent = Math.max(0, indent - 1);
        }
        const indented = '  '.repeat(indent) + trimmed;
        if (trimmed.endsWith('{') || (trimmed.endsWith('(') && !trimmed.includes(')'))) {
          indent++;
        }
        return indented;
      })
      .join('\n');
    setQueryText(formatted);
  };

  const handleSelectPreset = (sample: QuerySample) => {
    setSelectedSample(sample);
    setQueryText(sample.query);
    if (sample.variables) {
      setVariablesText(sample.variables);
      setShowVariables(true);
    }
    handleExecute(sample.query);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    const content = JSON.stringify(
      response.errors ? { data: response.data, errors: response.errors } : { data: response.data },
      null,
      2
    );
    navigator.clipboard.writeText(content);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleDownloadResponse = () => {
    if (!response) return;
    const blob = new Blob(
      [JSON.stringify(response.data || response, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graphql-response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut Ctrl/Cmd + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Preset Query Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Örnek Sorgular:
            </span>
            <span>Gereksinimlerdeki ve ilişkisel GraphQL sorgularını tek tıkla deneyin</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Kısayol: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Enter</kbd>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUERY_SAMPLES.map(sample => {
            const isSelected = selectedSample.id === sample.id;
            const isRequired = sample.category === 'Required';
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectPreset(sample)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-sm ring-1 ring-pink-400'
                    : isRequired
                    ? 'bg-slate-800 text-pink-300 hover:bg-slate-700/80 border border-pink-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {isRequired && <span className="text-[10px] bg-pink-900/60 text-pink-200 px-1 rounded">Ödev</span>}
                <span>{sample.name}</span>
              </button>
            );
          })}
        </div>

        {selectedSample.description && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-pink-400 font-medium">Açıklama:</span>
            <span>{selectedSample.description}</span>
          </div>
        )}
      </div>

      {/* Main Studio Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch min-h-[580px]">
        {/* Left: Query Editor */}
        <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Editor Header Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                Operation / Query
              </span>
              <span className="text-[11px] font-mono text-slate-400">GraphQL</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrettify}
                title="Prettify Query"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format</span>
              </button>

              <button
                onClick={handleCopyQuery}
                title="Copy Query"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedQuery ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>

              <button
                onClick={() => setQueryText(selectedSample.query)}
                title="Reset Query"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>

              <button
                onClick={() => handleExecute()}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3.5 py-1 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-semibold text-xs rounded-md shadow-sm transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoading ? 'Çalışıyor...' : 'Çalıştır'}</span>
              </button>
            </div>
          </div>

          {/* Textarea Editor Area */}
          <div className="relative flex-1 flex flex-col min-h-[360px] bg-slate-950/60">
            <textarea
              value={queryText}
              onChange={e => setQueryText(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full flex-1 p-4 font-mono text-sm leading-relaxed text-pink-200 bg-transparent resize-none focus:outline-none selection:bg-pink-500/30"
              placeholder="Write your GraphQL query here..."
            />
          </div>

          {/* Variables Toggle Accordion */}
          <div className="border-t border-slate-800 bg-slate-950/80">
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="w-full px-4 py-2 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <span className="font-semibold">Query Variables (JSON)</span>
              <span className="font-mono text-[11px]">{showVariables ? '▲ Gizle' : '▼ Göster'}</span>
            </button>
            {showVariables && (
              <div className="p-3 bg-slate-950/90 border-t border-slate-800/80">
                <textarea
                  value={variablesText}
                  onChange={e => setVariablesText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 font-mono text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-md focus:outline-none focus:border-pink-500 resize-y"
                  placeholder='{ "code": "TR" }'
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Response Viewer */}
        <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Response Header Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                Response
              </span>

              {response && (
                <div className="flex items-center gap-2 text-xs">
                  {response.errors && response.errors.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold font-mono text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Errors ({response.errors.length})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold font-mono text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      200 OK
                    </span>
                  )}

                  <span className="text-slate-600">·</span>

                  <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px] tabular-nums">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {response.executionTimeMs}ms
                  </span>

                  <span className="text-slate-600">·</span>

                  <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {response.source === 'http-api' ? 'POST /graphql' : 'Direct Engine'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyResponse}
                disabled={!response}
                title="Copy JSON Response"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors disabled:opacity-40"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResponse ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>

              <button
                onClick={handleDownloadResponse}
                disabled={!response}
                title="Download JSON Response"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir</span>
              </button>
            </div>
          </div>

          {/* Response Body */}
          <div className="relative flex-1 p-4 bg-slate-950/70 overflow-auto max-h-[640px] font-mono text-xs leading-relaxed">
            {isLoading ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span>Sorgu çalıştırılıyor...</span>
              </div>
            ) : !response ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 gap-2">
                <Play className="w-8 h-8 opacity-40 text-pink-400" />
                <span>Çalıştır butonuna basarak veya kısayolla sonucu görüntüleyin.</span>
              </div>
            ) : (
              <pre className="text-emerald-400 selection:bg-emerald-900/40">
                {JSON.stringify(
                  response.errors && response.errors.length > 0
                    ? { data: response.data, errors: response.errors }
                    : { data: response.data },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
