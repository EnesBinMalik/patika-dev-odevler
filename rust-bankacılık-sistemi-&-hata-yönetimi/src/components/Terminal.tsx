import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Copy, Check, ShieldCheck } from 'lucide-react';
import { TerminalLog } from '../types/banking';

interface TerminalProps {
  logs: TerminalLog[];
  isRunning: boolean;
  onRunCargo: () => void;
  onClearLogs: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  logs,
  isRunning,
  onRunCargo,
  onClearLogs,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map((l) => l.message).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogStyle = (type: TerminalLog['type']) => {
    switch (type) {
      case 'compile':
        return 'text-emerald-400 font-semibold';
      case 'success':
        return 'text-emerald-300 bg-emerald-950/20 px-1 py-0.5 rounded';
      case 'error':
        return 'text-rose-400 bg-rose-950/20 px-1 py-0.5 rounded font-semibold';
      case 'info':
        return 'text-sky-300';
      case 'divider':
        return 'text-slate-600 font-bold';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>bash / cargo run</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunCargo}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              isRunning
                ? 'bg-amber-600/30 text-amber-300 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunning ? 'Derleniyor...' : 'cargo run'}</span>
          </button>

          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 disabled:opacity-40"
            title="Terminal Çıktısını Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 disabled:opacity-40"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 bg-black/70 min-h-[300px]">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12 text-center">
            <TerminalIcon className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
            <p className="text-slate-400 font-sans font-medium text-sm">Konsol Hazır</p>
            <p className="text-slate-600 text-xs mt-1 max-w-xs font-sans">
              Yukarıdaki <span className="text-emerald-400 font-mono">cargo run</span> butonuna basarak veya test senaryolarını çalıştırarak Rust programını derleyip çalıştırabilirsiniz.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-relaxed break-words">
              <span className={getLogStyle(log.type)}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Bottom status */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Rust Bellek Güvenliği &amp; Sıfır Maliyetli Hata Yönetimi</span>
        </div>
        <div>
          <span>{logs.length} satır çıktı</span>
        </div>
      </div>
    </div>
  );
};
