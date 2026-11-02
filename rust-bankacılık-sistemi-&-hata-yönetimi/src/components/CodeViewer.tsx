import React, { useState } from 'react';
import { Copy, Check, Download, Code2, Sparkles } from 'lucide-react';
import { RUST_SOURCE_CODE, TASK_STEPS } from '../data/rustCode';

interface CodeViewerProps {
  activeStepId: number | null;
  onSelectStep: (id: number | null) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ activeStepId, onSelectStep }) => {
  const [copied, setCopied] = useState(false);
  const lines = RUST_SOURCE_CODE.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(RUST_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([RUST_SOURCE_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.rs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeStep = TASK_STEPS.find((s) => s.id === activeStepId);

  // Simple syntax highlighter for Rust
  const highlightRust = (text: string) => {
    if (text.startsWith('//') || text.startsWith('///')) {
      return <span className="text-emerald-400/90 italic font-medium">{text}</span>;
    }

    // Split text into tokens safely
    const words = text.split(/(\b|[{}\[\](),;:<>\s=+\-*&!"])/);

    let insideQuotes = false;
    let quoteBuffer = '';

    return (
      <>
        {text.split(/(".*?")/).map((segment, idx) => {
          if (segment.startsWith('"') && segment.endsWith('"')) {
            return (
              <span key={idx} className="text-amber-300">
                {segment}
              </span>
            );
          }
          return (
            <span key={idx}>
              {segment.split(/(\b\w+\b|[^\w\s])/).map((token, tIdx) => {
                if (['pub', 'trait', 'struct', 'impl', 'fn', 'let', 'mut', 'match', 'if', 'else', 'for', 'Self', 'self'].includes(token)) {
                  return (
                    <span key={tIdx} className="text-violet-400 font-semibold">
                      {token}
                    </span>
                  );
                }
                if (['Result', 'String', 'f64', 'bool', 'Option'].includes(token)) {
                  return (
                    <span key={tIdx} className="text-cyan-300 font-medium">
                      {token}
                    </span>
                  );
                }
                if (['Ok', 'Err'].includes(token)) {
                  return (
                    <span
                      key={tIdx}
                      className={token === 'Ok' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}
                    >
                      {token}
                    </span>
                  );
                }
                if (['println', 'format'].includes(token)) {
                  return (
                    <span key={tIdx} className="text-blue-300 font-semibold">
                      {token}
                    </span>
                  );
                }
                if (/^\d+(\.\d+)?$/.test(token)) {
                  return (
                    <span key={tIdx} className="text-orange-300">
                      {token}
                    </span>
                  );
                }
                return token;
              })}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-200 text-xs font-mono font-medium border border-slate-700/60">
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span>src/main.rs</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded uppercase font-semibold">Rust</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeStepId && (
            <button
              onClick={() => onSelectStep(null)}
              className="text-xs px-2.5 py-1 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/40"
            >
              Filtreyi Temizle
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-all border border-slate-700 active:scale-95"
            title="Kodu Panoya Kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded-lg transition-all border border-orange-500/30 active:scale-95"
            title="main.rs dosyasını indir"
          >
            <Download className="w-3.5 h-3.5" />
            <span>main.rs İndir</span>
          </button>
        </div>
      </div>

      {/* Step Highlight Info Bar */}
      {activeStep && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border-b border-orange-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-orange-200">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="font-semibold text-orange-300">Adım {activeStep.id}:</span>
            <span>{activeStep.title}</span>
            <span className="text-slate-400 font-mono text-[11px]">(Satır {activeStep.lines[0]} - {activeStep.lines[1]})</span>
          </div>
          <button
            onClick={() => onSelectStep(null)}
            className="text-slate-400 hover:text-slate-200 text-[11px] underline"
          >
            Tüm Kodu Göster
          </button>
        </div>
      )}

      {/* Code Body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted =
                activeStep &&
                lineNumber >= activeStep.lines[0] &&
                lineNumber <= activeStep.lines[1];

              return (
                <tr
                  key={index}
                  className={`group transition-colors ${
                    isHighlighted
                      ? 'bg-orange-500/15 border-l-2 border-orange-400'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <td className="w-12 pr-4 text-right select-none text-slate-600 group-hover:text-slate-400 text-xs py-0.5 align-top">
                    {lineNumber}
                  </td>
                  <td className="pl-3 pr-2 text-slate-200 whitespace-pre font-mono py-0.5">
                    {highlightRust(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Signature */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Derleme Statüsü: Hatasız (Rustc 2021 Edition uyumlu)</span>
        </span>
        <span className="font-medium text-slate-300">
          Hazırlayan: <span className="text-orange-400 font-semibold">Enes Öztürk</span>
        </span>
      </div>
    </div>
  );
};
