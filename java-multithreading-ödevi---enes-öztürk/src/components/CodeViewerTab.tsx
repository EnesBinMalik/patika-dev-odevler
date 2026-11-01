import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';
import { SINGLE_FILE_JAVA_CODE, OOP_JAVA_CODE, EXECUTOR_JAVA_CODE, CODE_EXPLANATIONS } from '../data/javaCode';
import { CodeTab } from '../types';

export const CodeViewerTab: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('single');
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(0);

  const currentCode =
    activeCodeTab === 'single'
      ? SINGLE_FILE_JAVA_CODE
      : activeCodeTab === 'oop'
      ? OOP_JAVA_CODE
      : EXECUTOR_JAVA_CODE;

  const currentFileName =
    activeCodeTab === 'single'
      ? 'Main.java (Tek Dosya - Önerilen)'
      : activeCodeTab === 'oop'
      ? 'Main.java & SayiIsleyici.java'
      : 'ExecutorServiceMain.java';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeCodeTab === 'executor' ? 'ExecutorServiceMain.java' : 'Main.java';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Code Header and Tab Switchers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                Java Multithreading Tam Kaynak Kodu
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Enes Öztürk İmzalı
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Doğrudan IntelliJ IDEA, Eclipse, VS Code veya online derleyicilere kopyalayıp çalıştırabilirsiniz.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Dosyayı İndir (.java)</span>
            </button>
          </div>
        </div>

        {/* Code Version Switcher Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveCodeTab('single')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeCodeTab === 'single'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Tek Dosya (Main.java - Standart Ödev Çözümü)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-200 font-mono">
              En Çok Tercih Edilen
            </span>
          </button>

          <button
            onClick={() => setActiveCodeTab('oop')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors cursor-pointer ${
              activeCodeTab === 'oop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OOP / Modüler (Main.java + SayiIsleyici.java)
          </button>

          <button
            onClick={() => setActiveCodeTab('executor')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors cursor-pointer ${
              activeCodeTab === 'executor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ExecutorService (Thread Pool & Modern API)
          </button>
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono">
        {/* Editor Top Bar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs text-slate-300 font-mono ml-2 font-medium">
              {currentFileName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-sans font-semibold">Java 8 - 21 Uyumlu</span>
            <span>•</span>
            <span className="text-amber-400 font-sans">İmza: Enes Öztürk</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-[13px] leading-relaxed text-slate-200 max-h-[620px] overflow-y-auto">
          <pre className="font-mono">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>

      {/* Line-by-Line Educational Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Ödevin Kod Mimarisi ve Mantıksal Açıklaması
          </h3>
        </div>

        <div className="space-y-3">
          {CODE_EXPLANATIONS.map((item, index) => {
            const isExpanded = expandedExplanation === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60"
              >
                <button
                  onClick={() => setExpandedExplanation(isExpanded ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-indigo-300">
                    {item.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-800/80 bg-slate-900/40 text-xs">
                    <pre className="p-2.5 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                      <code>{item.code}</code>
                    </pre>
                    <p className="text-slate-300 leading-relaxed pt-1">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
