import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileCode,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  JAVA_FULL_CODE,
  JAVA_CLEAN_CODE,
  JAVA_GENERIC_CODE,
  JAVA_HOARE_CODE,
} from '../data/javaSourceCode';

interface CodeViewerProps {
  onDownloadJava: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ onDownloadJava }) => {
  const [selectedVariant, setSelectedVariant] = useState<'full' | 'clean' | 'generic' | 'hoare'>('full');
  const [copied, setCopied] = useState(false);

  const currentCode =
    selectedVariant === 'full'
      ? JAVA_FULL_CODE
      : selectedVariant === 'clean'
      ? JAVA_CLEAN_CODE
      : selectedVariant === 'generic'
      ? JAVA_GENERIC_CODE
      : JAVA_HOARE_CODE;

  const currentFileName =
    selectedVariant === 'generic'
      ? 'GenericQuickSort.java'
      : selectedVariant === 'hoare'
      ? 'HoareQuickSort.java'
      : 'QuickSort.java';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = currentCode.trim().split('\n');

  // Simple token highlighter for Java
  const renderHighlightedLine = (line: string) => {
    // If it's a comment
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*') || line.trim().startsWith('*/')) {
      return <span className="text-emerald-400/90 italic">{line}</span>;
    }

    // Replace keywords and types
    const tokens = line.split(/(\b(?:public|private|static|void|class|interface|extends|implements|return|if|else|for|while|do|break|continue|new|int|long|double|boolean|String|Comparable|Arrays|Random|System|out|println|printf|nanoTime)\b|"[^"]*"|@author|@version|@param|@return|@since|\b\d+\b)/g);

    return (
      <span>
        {tokens.map((token, i) => {
          if (!token) return null;

          if (
            ['public', 'private', 'static', 'void', 'class', 'interface', 'extends', 'implements', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'new'].includes(token)
          ) {
            return (
              <span key={i} className="text-amber-400 font-semibold">
                {token}
              </span>
            );
          }
          if (['int', 'long', 'double', 'boolean', 'String', 'Comparable', 'Arrays', 'Random', 'System'].includes(token)) {
            return (
              <span key={i} className="text-cyan-400 font-medium">
                {token}
              </span>
            );
          }
          if (token.startsWith('@')) {
            return (
              <span key={i} className="text-indigo-400 font-bold">
                {token}
              </span>
            );
          }
          if (token.startsWith('"') && token.endsWith('"')) {
            return (
              <span key={i} className="text-lime-300">
                {token}
              </span>
            );
          }
          if (/^\d+$/.test(token)) {
            return (
              <span key={i} className="text-rose-400 font-mono">
                {token}
              </span>
            );
          }
          if (token.includes('Enes Öztürk')) {
            return (
              <span key={i} className="text-amber-300 font-bold underline decoration-amber-500/50">
                {token}
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Code Header Bar & Variant Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedVariant('full')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedVariant === 'full'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Tam Sınıf (Tavsiye Edilen)
          </button>
          <button
            onClick={() => setSelectedVariant('clean')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedVariant === 'clean'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Sade &amp; Temiz Kod
          </button>
          <button
            onClick={() => setSelectedVariant('generic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedVariant === 'generic'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Jenerik (&lt;T extends Comparable&gt;)
          </button>
          <button
            onClick={() => setSelectedVariant('hoare')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedVariant === 'hoare'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Hoare Partitioning
          </button>
        </div>

        {/* Action buttons: Copy & Download */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadJava}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors cursor-pointer shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.java İndir</span>
          </button>
        </div>
      </div>

      {/* Editor Window */}
      <div className="bg-[#0D1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-300 font-semibold">{currentFileName}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>UTF-8</span>
            <span>&middot;</span>
            <span>Java 17+ / 21</span>
            <span>&middot;</span>
            <span className="text-amber-400">@author Enes Öztürk</span>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="w-10 pr-4 text-right text-slate-600 select-none font-mono text-xs align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre pl-2 border-l border-slate-800/50">
                    {renderHighlightedLine(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Architecture Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>1. partitionLomuto()</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Son elemanı pivot alır. İki indeks (<code className="text-cyan-400 font-mono">i</code> ve{' '}
            <code className="text-indigo-400 font-mono">j</code>) kullanarak pivottan küçük olanları sola yığar.
            En sonunda pivotu kesin yerine yerleştirir.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>2. medianOfThree()</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Quick Sort'un meşhur <code className="text-amber-400 font-mono">O(n²)</code> en kötü durumunu engeller.
            İlk, orta ve son elemanı inceleyerek medyanı bulur ve pivot olarak atar.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>3. sortWithTrace()</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Konsola adım adım derinlik ağacını, seçilen pivotları ve yapılan takasları detaylı yazdırır.
            Java öğrencileri ve mülakat hazırlıkları için harika bir öğreticidir.
          </p>
        </div>
      </div>
    </div>
  );
};
