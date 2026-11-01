import React, { useState } from 'react';
import { JAVA_SOURCE_FILES, JavaFileItem } from '../data/javaSourceCode';
import { Code2, Copy, Check, Download, FileCode, CheckCircle, Sparkles } from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileItem>(JAVA_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [allCopied, setAllCopied] = useState(false);

  const handleCopySingle = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAll = () => {
    const combinedContent = JAVA_SOURCE_FILES.map(
      (f) =>
        `// ========================================================\n// FILE: ${f.fileName} (${f.oopPrinciple})\n// @author Enes Öztürk\n// ========================================================\n\n${f.code}\n\n`
    ).join('\n');

    const element = document.createElement('a');
    const file = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'SigortaYonetimSistemi_EnesOzturk_TumKodlar.java';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Download Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              Java OOP Kaynak Kod Paketi
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Enes Öztürk İmzalı El Emeği
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Ödev şartnamesinde yer alan 17 adet Java sınıfı, arayüzü, enum ve exception tanımları eksiksiz olarak hazırlanmıştır.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadAll}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            {allCopied ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Paket İndirildi!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tüm Kodları İndir (.java)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: File Explorer + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Dosya Listesi (4 Kolon) */}
        <div className="lg:col-span-4 space-y-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
            Java Dosyaları ({JAVA_SOURCE_FILES.length})
          </span>

          <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
            {JAVA_SOURCE_FILES.map((file) => {
              const isSelected = selectedFile.fileName === file.fileName;
              return (
                <button
                  key={file.fileName}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-950 font-semibold border border-indigo-200'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{file.fileName}</span>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                      file.category === 'Interface'
                        ? 'bg-purple-100 text-purple-700'
                        : file.category === 'Abstract'
                        ? 'bg-amber-100 text-amber-700'
                        : file.category === 'Exception'
                        ? 'bg-rose-100 text-rose-700'
                        : file.category === 'Manager'
                        ? 'bg-blue-100 text-blue-700'
                        : file.category === 'Enum'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sağ Kolon: Kod İçeriği ve Detaylar (8 Kolon) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {selectedFile.fileName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    {selectedFile.oopPrinciple}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedFile.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopySingle}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadSingle}
                  title="Tek Dosyayı İndir"
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir</span>
                </button>
              </div>
            </div>

            {/* Code Box with Syntax Styling */}
            <div className="mt-4 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>package com.enesozturk.insurance</span>
                <span>Java 17/21 · UTF-8</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[560px] leading-relaxed">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
