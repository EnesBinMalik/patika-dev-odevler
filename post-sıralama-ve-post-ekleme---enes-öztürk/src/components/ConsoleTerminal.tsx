import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Play, CheckCircle2, Copy, Check, Download, AlertCircle, ArrowDown } from 'lucide-react';
import { ConsoleLogEntry } from '../types';

interface ConsoleTerminalProps {
  logs: ConsoleLogEntry[];
  onClear: () => void;
  onRunScenario: () => void;
  onListOnly: () => void;
  isRunning: boolean;
  speed: 'normal' | 'fast';
  setSpeed: (speed: 'normal' | 'fast') => void;
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({
  logs,
  onClear,
  onRunScenario,
  onListOnly,
  isRunning,
  speed,
  setSpeed,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enes-ozturk-blog-console-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-xl shadow-xl border border-slate-800 overflow-hidden flex flex-col h-[650px] font-mono text-sm">
      {/* Terminal Top Bar */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Mac-style window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-200">bash / node blog_engine.js</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline">Enes Öztürk İmzalı Konsol</span>
          </div>
        </div>

        {/* Terminal Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-800/80 rounded-md p-0.5 text-[11px] font-sans">
            <button
              onClick={() => setSpeed('normal')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                speed === 'normal' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Doğal gecikme (asenkron simülasyon)"
            >
              Normal (800ms)
            </button>
            <button
              onClick={() => setSpeed('fast')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                speed === 'fast' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Hızlı yürütme"
            >
              Hızlı (200ms)
            </button>
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Logları panoya kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Logları .txt olarak indir"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Action Buttons Strip */}
      <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 font-sans shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRunScenario}
            disabled={isRunning}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'İşlem Sürüyor...' : 'Post Sırala & Ekle & Tekrar Sırala'}</span>
          </button>

          <button
            onClick={onListOnly}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            Sadece Postları Listele (listPosts)
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="hidden lg:inline text-slate-500">
            F12 Developer Tools konsoluna da canlı log yazılır
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
            />
            <span className="text-[11px]">Oto Kaydır</span>
          </label>
        </div>
      </div>

      {/* Terminal Log Body */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-1.5 bg-slate-950 font-mono text-xs sm:text-[13px] leading-relaxed selection:bg-indigo-600 selection:text-white"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans space-y-3">
            <Terminal className="w-10 h-10 text-slate-600" />
            <p className="text-sm">Konsol henüz temiz. Senaryoyu başlatmak için butona tıklayın.</p>
            <button
              onClick={onRunScenario}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Post Sıralama & Ekleme Akışını Başlat
            </button>
          </div>
        ) : (
          logs.map((log) => {
            // Style by type
            if (log.type === 'step') {
              return (
                <div key={log.id} className="pt-3 pb-1 border-t border-slate-800/80">
                  <div className="flex items-start gap-2 text-cyan-400 font-semibold">
                    <span className="text-slate-500 tabular-nums shrink-0">{log.timestamp}</span>
                    <span className="text-cyan-300">❯</span>
                    <span className="break-words">{log.message}</span>
                  </div>
                </div>
              );
            }

            if (log.type === 'signature') {
              return (
                <div key={log.id} className="my-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/30 text-amber-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 tabular-nums shrink-0">{log.timestamp}</span>
                    <span className="font-bold text-amber-200">{log.message}</span>
                  </div>
                  {log.details && (
                    <div className="text-xs text-amber-400/80 mt-1 pl-14">
                      {log.details}
                    </div>
                  )}
                </div>
              );
            }

            if (log.type === 'success') {
              return (
                <div key={log.id} className="flex items-start gap-2 text-emerald-400">
                  <span className="text-slate-500 tabular-nums shrink-0">{log.timestamp}</span>
                  <span className="text-emerald-500 shrink-0">✔</span>
                  <span className="break-words font-medium">{log.message}</span>
                </div>
              );
            }

            if (log.type === 'error') {
              return (
                <div key={log.id} className="flex items-start gap-2 text-rose-400 bg-rose-950/20 px-2 py-1 rounded">
                  <span className="text-slate-500 tabular-nums shrink-0">{log.timestamp}</span>
                  <span className="text-rose-500 shrink-0">✖</span>
                  <span className="break-words">{log.message}</span>
                </div>
              );
            }

            if (log.type === 'output') {
              return (
                <div key={log.id} className="flex items-start gap-2 text-slate-200 hover:bg-slate-900/60 px-1 rounded transition-colors">
                  <span className="text-slate-600 tabular-nums shrink-0 select-none">{log.timestamp}</span>
                  <span className="text-slate-400 select-none">│</span>
                  <span className="break-words whitespace-pre-wrap">{log.message}</span>
                </div>
              );
            }

            return (
              <div key={log.id} className="flex items-start gap-2 text-slate-400">
                <span className="text-slate-600 tabular-nums shrink-0">{log.timestamp}</span>
                <span className="text-slate-400 select-none">ℹ</span>
                <span className="break-words">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer Info */}
      <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Node.js v22.x Çevre Simülasyonu</span>
        </div>
        <div className="text-slate-400">
          Proje Sahibi: <span className="font-semibold text-slate-200">Enes Öztürk</span>
        </div>
      </div>
    </div>
  );
};
