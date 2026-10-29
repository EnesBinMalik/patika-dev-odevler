/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Play, Square, ExternalLink } from 'lucide-react';
import { ServerLog } from '../types';

interface TerminalConsoleProps {
  logs: ServerLog[];
  isServerRunning: boolean;
  onToggleServer: () => void;
  onClearLogs: () => void;
  onRunCurl: (path: string) => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  isServerRunning,
  onToggleServer,
  onClearLogs,
  onRunCurl,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">Terminal (node index.js)</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400">bash • port 5000</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleServer}
            className={`px-2 py-1 rounded text-[11px] font-sans font-medium flex items-center gap-1 transition ${
              isServerRunning
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
            }`}
          >
            {isServerRunning ? (
              <>
                <Square className="w-3 h-3 fill-current" /> Durdur
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Başlat
              </>
            )}
          </button>

          <button
            onClick={onClearLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="p-4 flex-1 overflow-y-auto space-y-2.5 min-h-[300px] max-h-[460px] select-text"
      >
        {/* Startup banner */}
        <div className="text-slate-500 border-b border-slate-900 pb-2">
          <p className="text-emerald-400 font-bold">
            node-odev5@1.0.0 start
          </p>
          <p className="text-slate-400">$ node index.js</p>
        </div>

        {isServerRunning ? (
          <div className="space-y-1 text-slate-300">
            <p className="text-emerald-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sunucu port 5000&apos;de başarıyla başlatıldı.
            </p>
            <p className="text-slate-400">
              Tarayıcınızdan <span className="text-teal-300 underline">http://localhost:5000</span> adresini ziyaret edebilirsiniz.
            </p>
            <p className="text-amber-400 font-medium">
              Geliştirici & İmza: Enes Öztürk
            </p>
            <div className="h-2"></div>
          </div>
        ) : (
          <div className="py-2 text-rose-400">
            [DURDURULDU] Sunucu kapatıldı (SIGINT). Port 5000 serbest bırakıldı.
          </div>
        )}

        {/* Dynamic incoming request logs */}
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-1 px-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/40 text-[11px] gap-1"
          >
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span className="font-bold text-sky-400">{log.method}</span>
              <span className="text-slate-200 font-semibold">{log.url}</span>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <span
                className={`font-bold ${
                  log.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {log.statusCode} {log.statusText}
              </span>
              <span className="text-slate-500">{log.durationMs}ms</span>
              <span className="text-slate-600 hidden md:inline">{log.responseBytes}B</span>
            </div>
          </div>
        ))}

        {isServerRunning && logs.length === 0 && (
          <p className="text-slate-600 italic py-4 text-center">
            İstek bekleniyor... Tarayıcı simülatöründen bir sayfaya tıklayın veya curl testi yapın.
          </p>
        )}
      </div>

      {/* Quick Terminal Action Bar */}
      <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-slate-400 font-sans">Hızlı Test (curl):</span>
        <button
          onClick={() => onRunCurl('/')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
        >
          <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
          curl /
        </button>
        <button
          onClick={() => onRunCurl('/hakkimda')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
        >
          <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
          curl /hakkimda
        </button>
        <button
          onClick={() => onRunCurl('/iletisim')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
        >
          <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
          curl /iletisim
        </button>
        <button
          onClick={() => onRunCurl('/test-404')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
        >
          <ExternalLink className="w-2.5 h-2.5 text-rose-400" />
          curl /404-test
        </button>
      </div>
    </div>
  );
};
