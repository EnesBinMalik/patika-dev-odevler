import React, { useState } from 'react';
import { RUST_CODE_TURKISH, RUST_CODE_ENGLISH } from '../data/rustCode';
import { ExecutionLog } from '../types';
import { Terminal, Copy, Check, Play, Shield, Sparkles, RefreshCw, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface RustCodePlaygroundProps {
  logs: ExecutionLog[];
  onRunCargo: (mode: 'run' | 'check' | 'test') => void;
  isRunning: boolean;
  onClearLogs: () => void;
}

export const RustCodePlayground: React.FC<RustCodePlaygroundProps> = ({
  logs,
  onRunCargo,
  isRunning,
  onClearLogs,
}) => {
  const [languageMode, setLanguageMode] = useState<'tr' | 'en'>('tr');
  const [copied, setCopied] = useState(false);
  const [activeStepHighlight, setActiveStepHighlight] = useState<number | null>(null);

  const currentCode = languageMode === 'tr' ? RUST_CODE_TURKISH : RUST_CODE_ENGLISH;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepHighlights: Record<number, { title: string; lines: [number, number]; desc: string }> = {
    1: { title: "Adım 1: Hesap Trait", lines: [8, 19], desc: "para_yatir, para_cek ve bakiye yöntemleri" },
    2: { title: "Adım 2: BankAccount Yapısı", lines: [21, 37], desc: "account_number, holder_name, balance" },
    3: { title: "Adım 3: Mevduat (Deposit)", lines: [39, 49], desc: "self.balance += miktar" },
    4: { title: "Adım 4: Çekim (Withdraw)", lines: [51, 64], desc: "self.balance -= miktar & yetersiz bakiye guardı" },
    5: { title: "Adım 5: Bakiye (Balance)", lines: [66, 70], desc: "self.balance iade edilir" },
    6: { title: "Adım 6: İki Hesap Örneği", lines: [82, 85], desc: "hesap1 ve hesap2 tanımlandı" },
    7: { title: "Adım 7: Depozito Çağrısı", lines: [90, 97], desc: "hesap1.para_yatir(750.0)" },
    8: { title: "Adım 8: Çekim Çağrısı", lines: [99, 106], desc: "hesap2.para_cek(400.0)" },
    9: { title: "Adım 9: Bakiye Konsola Yazdırma", lines: [108, 113], desc: "hesap1.bakiye() ve hesap2.bakiye()" },
  };

  const lines = currentCode.split('\n');

  return (
    <div className="space-y-6">
      {/* Code Controls & Step Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setLanguageMode('tr')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                languageMode === 'tr'
                  ? 'bg-orange-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇹🇷 Türkçe İsimlendirme (Hesap)
            </button>
            <button
              onClick={() => setLanguageMode('en')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                languageMode === 'en'
                  ? 'bg-orange-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 İngilizce İsimlendirme (Account)
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            src/main.rs (Rust 2021)
          </span>
        </div>

        {/* Cargo Execution Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onRunCargo('run')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold shadow-lg shadow-orange-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>cargo run</span>
          </button>

          <button
            onClick={() => onRunCargo('check')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>cargo check</span>
          </button>

          <button
            onClick={() => onRunCargo('test')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>cargo test</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
            title="Kodu Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
          </button>
        </div>
      </div>

      {/* Step Explorer Shortcuts */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono">
        <span className="text-slate-500 shrink-0 uppercase tracking-wider text-[11px] font-bold">
          Adıma Git:
        </span>
        {Object.entries(stepHighlights).map(([stepId, meta]) => {
          const num = parseInt(stepId, 10);
          const isSelected = activeStepHighlight === num;
          return (
            <button
              key={stepId}
              onClick={() => setActiveStepHighlight(isSelected ? null : num)}
              className={`px-2.5 py-1 rounded-md shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {meta.title}
            </button>
          );
        })}
        {activeStepHighlight && (
          <button
            onClick={() => setActiveStepHighlight(null)}
            className="text-slate-400 hover:text-rose-400 text-[11px] underline ml-auto shrink-0 cursor-pointer"
          >
            Vurguyu Temizle
          </button>
        )}
      </div>

      {/* Code Editor and Terminal Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Editor Header Bar */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-slate-300 font-bold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-orange-400" />
                src/main.rs
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              {lines.length} satır • UTF-8 • rustc 1.85.0
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed max-h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <pre className="text-slate-200">
              {lines.map((line, index) => {
                const lineNum = index + 1;
                let isHighlighted = false;
                if (activeStepHighlight) {
                  const [start, end] = stepHighlights[activeStepHighlight].lines;
                  isHighlighted = lineNum >= start && lineNum <= end;
                }

                // Simple keyword coloring
                return (
                  <div
                    key={lineNum}
                    className={`flex items-start transition-colors px-2 rounded ${
                      isHighlighted
                        ? 'bg-orange-500/15 border-l-2 border-orange-500'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-slate-600 select-none text-right pr-3 font-mono text-xs">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">
                      {renderHighlightedRustLine(line)}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Right: Interactive Rust Terminal & Output (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Terminal: target/debug/rust_banking</span>
            </div>
            <div className="flex items-center gap-2">
              {isRunning && (
                <span className="flex items-center gap-1 text-orange-400 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                  Derleniyor...
                </span>
              )}
              <button
                onClick={onClearLogs}
                className="text-slate-400 hover:text-slate-200 text-[11px] cursor-pointer"
                title="Konsolu Temizle"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="p-4 flex-1 font-mono text-xs overflow-y-auto max-h-[640px] space-y-1.5 bg-black/90 scrollbar-thin scrollbar-thumb-slate-800">
            {logs.length === 0 ? (
              <div className="text-slate-500 py-12 text-center text-xs">
                Terminal çıktısı yok. Yukarıdaki <code className="text-orange-400">cargo run</code> butonuna basarak programı derleyip çalıştırabilirsiniz.
              </div>
            ) : (
              logs.map((log) => {
                let colorClass = 'text-slate-300';
                if (log.type === 'cargo') colorClass = 'text-cyan-400';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-semibold';
                if (log.type === 'stderr') colorClass = 'text-rose-400 font-semibold';
                if (log.type === 'memory') colorClass = 'text-amber-400';

                return (
                  <div key={log.id} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                    {log.content}
                  </div>
                );
              })
            )}
          </div>

          {/* Signature Tag in Terminal Footer */}
          <div className="bg-slate-900/80 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>exit code: 0</span>
            <span className="text-orange-400/90 font-medium">Rust Core • Enes Öztürk İmzalı</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lightweight syntax highlight helper
function renderHighlightedRustLine(text: string) {
  if (text.trim().startsWith('//')) {
    return <span className="text-slate-500 italic">{text}</span>;
  }
  if (text.trim().startsWith('///')) {
    return <span className="text-emerald-500/80 italic">{text}</span>;
  }
  if (text.includes('#[')) {
    return <span className="text-purple-400">{text}</span>;
  }

  // Tokenize key Rust elements
  const parts = text.split(/(\b(?:pub|trait|struct|impl|for|fn|mut|let|match|Ok|Err|Result|String|f64|Self|self|println|format)\b|[{}()&;:,"'])/g);

  return (
    <span>
      {parts.map((p, i) => {
        if (['pub', 'trait', 'struct', 'impl', 'for', 'fn', 'let', 'match'].includes(p)) {
          return <span key={i} className="text-orange-400 font-semibold">{p}</span>;
        }
        if (['mut', '&mut self', '&self', 'self'].includes(p)) {
          return <span key={i} className="text-amber-400 font-bold">{p}</span>;
        }
        if (['Ok', 'Err', 'Result'].includes(p)) {
          return <span key={i} className="text-cyan-400 font-semibold">{p}</span>;
        }
        if (['String', 'f64', 'Self'].includes(p)) {
          return <span key={i} className="text-emerald-400">{p}</span>;
        }
        if (['println', 'format'].includes(p)) {
          return <span key={i} className="text-blue-400">{p}</span>;
        }
        if (p.startsWith('"') && p.endsWith('"')) {
          return <span key={i} className="text-yellow-300">{p}</span>;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}
