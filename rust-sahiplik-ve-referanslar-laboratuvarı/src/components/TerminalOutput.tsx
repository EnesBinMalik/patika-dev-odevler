import React from 'react';
import { Terminal, Copy, Check, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { CompilationResult } from '../types/rust';

interface TerminalOutputProps {
  result: CompilationResult | null;
  isRunning: boolean;
  onClear: () => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  result,
  isRunning,
  onClear,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.stderr}\n${result.stdout}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
      {/* Terminal Header */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-medium text-slate-200">
            Terminal / Konsol Çıktısı (cargo run)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {result.executionTimeMs}ms
              </span>
              <span aria-hidden="true">·</span>
              <span className={result.success ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                {result.success ? 'Başarılı (Exit: 0)' : 'Hata (Exit: 1)'}
              </span>
            </div>
          )}

          {result && (
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Konsol Çıktısını Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="p-4 bg-slate-950 font-mono text-xs leading-relaxed min-h-[160px] max-h-[300px] overflow-y-auto">
        {isRunning ? (
          <div className="flex items-center gap-2 text-amber-400">
            <span className="animate-spin text-sm">◴</span>
            <span>Derleniyor ve çalıştırılıyor... cargo run</span>
          </div>
        ) : !result ? (
          <div className="text-slate-600 italic">
            Program henüz çalıştırılmadı. Çıktıyı ve bellek hareketlerini görmek için "Programı Çalıştır" butonuna basın veya Ctrl+Enter kısayolunu kullanın.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cargo build messages / Stderr */}
            {result.stderr && (
              <div
                className={`whitespace-pre-wrap font-mono text-xs ${
                  result.success ? 'text-slate-400' : 'text-rose-400'
                }`}
              >
                {result.stderr}
              </div>
            )}

            {/* Standard Output */}
            {result.stdout && (
              <div className="pt-2 border-t border-slate-900">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1 select-none">
                  --- Standart Çıktı (stdout) ---
                </div>
                <div className="text-emerald-300 font-bold whitespace-pre-wrap text-sm bg-emerald-950/20 p-2.5 rounded border border-emerald-800/30">
                  {result.stdout}
                </div>
              </div>
            )}

            {/* Success summary badge */}
            {result.success && (
              <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Rust Borrow Checker tüm kuralları onayladı. Sıfır sahiplik ihlali!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
