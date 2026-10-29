import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Copy, Trash2, Check, Download } from 'lucide-react';
import { LogEntry } from '../types';
import { AUTHOR_NAME } from '../data/codeSnippets';

interface TerminalProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onAddSignatureLog: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  logs,
  onClearLogs,
  onAddSignatureLog,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message} ${l.payload ? JSON.stringify(l.payload, null, 2) : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message} ${l.payload ? JSON.stringify(l.payload, null, 2) : ''}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'node-fs-terminal-log.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Top Window Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">enes@ozturk-dev:</span>
            <span className="text-emerald-400">~/odev-4-fs-module</span>
            <span className="text-slate-500">$ node index.js</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onAddSignatureLog}
            className="px-2 py-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-colors"
            title="Terminale imza ekle"
          >
            İmza Bas
          </button>
          <button
            onClick={handleCopyLogs}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Logları Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleExportLogs}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Log Dosyasını İndir"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Terminali Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 max-h-[480px] min-h-[320px] bg-[#070a11]">
        {/* Welcome Banner */}
        <div className="text-slate-400 border-b border-slate-800/60 pb-3 leading-relaxed">
          <p className="text-emerald-400 font-semibold">
            🚀 Node.js File System (FS) Modülü CRUD Konsolu v20.x
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Hedef: <code className="text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">employees.json</code> |
            İmza: <span className="text-emerald-300 font-bold">{AUTHOR_NAME}</span>
          </p>
          <p className="text-slate-500 text-[10px] mt-1">
            İşlemler (Yarat ➔ Oku ➔ Güncelle ➔ Sil) butonlara basılarak ya da 'Tüm Ödevi Çalıştır' ile yürütülür.
          </p>
        </div>

        {/* Logs */}
        {logs.map((log) => {
          let badgeColor = 'text-slate-400 bg-slate-800/80';
          let textColor = 'text-slate-300';

          if (log.level === 'success') {
            badgeColor = 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30';
            textColor = 'text-emerald-200';
          } else if (log.level === 'warn') {
            badgeColor = 'text-amber-400 bg-amber-500/15 border border-amber-500/30';
            textColor = 'text-amber-200';
          } else if (log.level === 'error') {
            badgeColor = 'text-rose-400 bg-rose-500/15 border border-rose-500/30';
            textColor = 'text-rose-300';
          } else if (log.level === 'signature') {
            badgeColor = 'text-purple-300 bg-purple-500/20 border border-purple-500/40';
            textColor = 'text-purple-200 font-semibold';
          }

          return (
            <div key={log.id} className="leading-relaxed hover:bg-slate-900/40 px-1 py-0.5 rounded transition-colors">
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-slate-500 select-none text-[10px]">{log.timestamp}</span>

                {log.step && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${badgeColor}`}>
                    {log.step}
                  </span>
                )}

                {log.method && (
                  <span className="text-cyan-400 font-semibold text-[11px]">
                    {log.method}
                  </span>
                )}

                <span className={`${textColor} break-all`}>
                  {log.message}
                </span>
              </div>

              {/* Payload viewer if available */}
              {log.payload && (
                <div className="mt-1.5 ml-4 p-2 bg-slate-950/80 border border-slate-800 rounded text-slate-300 overflow-x-auto">
                  <pre className="text-[11px] text-amber-200/90 leading-tight">
                    {typeof log.payload === 'string'
                      ? log.payload
                      : JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Prompt Footer */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">●</span>
          <span>FS Durumu: Aktif</span>
          <span className="text-slate-600">|</span>
          <span>İmza: <strong className="text-emerald-400">{AUTHOR_NAME}</strong></span>
        </div>
        <div className="text-slate-500">
          {logs.length} olay günlüğü
        </div>
      </div>
    </div>
  );
};
