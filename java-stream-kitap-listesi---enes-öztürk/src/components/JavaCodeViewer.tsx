import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2, Info } from 'lucide-react';
import { BOOK_JAVA_CODE, MAIN_JAVA_CODE, STREAM_CONCEPTS } from '../data/javaCode';

export const JavaCodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'main' | 'book'>('main');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode = activeFile === 'main' ? MAIN_JAVA_CODE : BOOK_JAVA_CODE;
  const currentFileName = activeFile === 'main' ? 'Main.java' : 'Book.java';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              5. Tam ve Çalıştırılabilir Java Kaynak Kodları
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ödevin gereksinimlerini eksiksiz karşılayan, temiz kod (Clean Code) standartlarında ve Enes Öztürk imzalı Java sınıfları.
          </p>
        </div>

        {/* Download & Copy Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            title={`${currentFileName} dosyasını bilgisayarına indir`}
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentFileName} İndir</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Window Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Editor Tab Header */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <button
              onClick={() => setActiveFile('main')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'main'
                  ? 'bg-slate-800 text-amber-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Main.java</span>
            </button>

            <button
              onClick={() => setActiveFile('book')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'book'
                  ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Book.java</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Java 8+ / 17 / 21 Uyumlu
          </span>
        </div>

        {/* Code Content Container */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[560px] overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200">
          <pre className="whitespace-pre">
            {currentCode}
          </pre>
        </div>
      </div>

      {/* Stream & Lambda Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STREAM_CONCEPTS.map((concept, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{concept.title}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800/80">
              {concept.code}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {concept.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
