import React, { useState } from 'react';
import { CODE_TEMPLATES } from '../data/homeworkData';
import { Copy, CheckCheck, FileCode, Check } from 'lucide-react';

export const CodeSolutions: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'csharp' | 'typescript' | 'java'>('csharp');
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeTemplate = CODE_TEMPLATES.find((t) => t.language === selectedLang)!;
  const currentFile = activeTemplate.files[activeFileIndex] || activeTemplate.files[0];

  const handleLanguageChange = (lang: 'csharp' | 'typescript' | 'java') => {
    setSelectedLang(lang);
    setActiveFileIndex(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="py-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            05. Uygulama & Kod Şablonları
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ödev Çözüm Kodları: C# .NET, TypeScript ve Java
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
            Üniversite ve kurumsal projelerde teslim edilmeye hazır, tam tip güvenli ve standartlara uygun model şablonları. Dilediğiniz dili seçip sınıfları inceleyebilir ve projelerinizde referans alabilirsiniz.
          </p>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CODE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.language}
              onClick={() => handleLanguageChange(tmpl.language)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                selectedLang === tmpl.language
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        {/* IDE Container */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* File Tabs Strip */}
          <div className="flex items-center justify-between bg-slate-900/90 border-b border-slate-800 px-4 py-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {activeTemplate.files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeFileIndex === idx
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{file.fileName}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ml-4"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* File Meta Description */}
          <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
            <span>{currentFile.description}</span>
            <span className="font-mono text-[11px] text-slate-500 uppercase">
              Model Tipi: {currentFile.modelType}
            </span>
          </div>

          {/* Code Viewer Body */}
          <div className="p-6 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            <pre>{currentFile.code}</pre>
          </div>
        </div>
      </div>
    </section>
  );
};
