/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { StepAction } from '../models/MyListEngine.ts';

interface ConsoleOutputProps {
  logs: string[];
  history: StepAction[];
  onClearLogs: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  logs,
  history,
  onClearLogs,
}) => {
  const [activeView, setActiveView] = useState<'console' | 'history'>('console');
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = activeView === 'console'
      ? logs.join('\n')
      : history.map(h => `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.type}: ${h.description}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[380px]">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-600/40"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-600/40"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/40"></span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveView('console')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                activeView === 'console'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>System.out (Konsol)</span>
              {logs.length > 0 && (
                <span className="px-1 text-[10px] rounded bg-slate-800 text-amber-300">
                  {logs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                activeView === 'history'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>İşlem Adımları</span>
              {history.length > 0 && (
                <span className="px-1 text-[10px] rounded bg-slate-800 text-amber-300">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
            title="Konsol Çıktısını Kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-800 transition"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1.5 text-slate-300 selection:bg-amber-500 selection:text-slate-950">
        {activeView === 'console' ? (
          logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <Terminal className="w-8 h-8 opacity-40" />
              <p>Konsol çıktısı henüz yok.</p>
              <p className="text-[11px]">Yukarıdaki senaryo butonlarına tıklayarak testleri çalıştırabilirsiniz.</p>
            </div>
          ) : (
            <div>
              <div className="text-slate-600 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>$ java com.enesozturk.mylist.Ata</span>
                <span className="text-[10px] text-emerald-500 font-semibold">Çıktı Hazır (Çıkış Kodu: 0)</span>
              </div>
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed hover:bg-slate-900/60 px-1 rounded">
                  <span className="text-slate-600 select-none text-[11px] w-6 text-right">{idx + 1}</span>
                  <span className={`font-mono ${
                    log.includes('Boş') ? 'text-amber-400' :
                    log.includes('Dolu') ? 'text-emerald-400' :
                    log.startsWith('[') ? 'text-cyan-300 font-bold' :
                    log.includes('true') ? 'text-emerald-400' :
                    log.includes('false') ? 'text-rose-400' :
                    'text-slate-200'
                  }`}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-2">
            {history.map((step) => (
              <div
                key={step.id}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                    step.type === 'ADD' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    step.type === 'REMOVE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    step.type === 'RESIZE' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    step.type === 'SUBLIST' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {step.type}
                  </span>
                  <span className="text-slate-600 text-[10px]">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{step.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                  <span>Boyut: {step.stateSnapshot.size}</span>
                  <span>•</span>
                  <span>Kapasite: {step.stateSnapshot.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="bg-slate-900/50 px-4 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Java Virtual Machine Simulator • UTF-8</span>
        <span className="text-amber-400/80">Enes Öztürk • MyList Architecture</span>
      </div>
    </div>
  );
};
