import React, { useState } from 'react';
import { CSHARP_CODE_FILES, CodeFile } from '../data/csharpCode';
import { Copy, Check, FileCode, Folder, Terminal, Download, CheckCircle2 } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('update-book-command');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedFile =
    CSHARP_CODE_FILES.find((f) => f.id === selectedFileId) || CSHARP_CODE_FILES[0];

  const handleCopyCode = (file: CodeFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedId(file.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownloadFile = (file: CodeFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="kod-cozumu" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Proje Kaynak Kodları (C# .NET)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eksiksiz C# Çözüm Dosyaları
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Tüm sınıflar <strong className="text-slate-900">Enes Öztürk</strong> imzalı olup,
              AutoMapper, FluentValidation, CQRS benzeri Command/Query ve Controller katmanlarını
              içerir. Entity kesinlikle dışarı maruz bırakılmamıştır.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Toplam {CSHARP_CODE_FILES.length} C# Dosyası
            </span>
          </div>
        </div>

        {/* Code Workspace Layout */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left File Tree Sidebar */}
          <div className="lg:w-80 bg-slate-950/80 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
                Çözüm Dosyaları (Solution Explorer)
              </div>

              <div className="space-y-1">
                {CSHARP_CODE_FILES.map((file) => {
                  const isSelected = file.id === selectedFile.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'
                          }`}
                        />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded uppercase shrink-0 font-sans ${
                          file.category === 'UpdateBook'
                            ? 'bg-amber-950/60 text-amber-300'
                            : file.category === 'GetById'
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : file.category === 'Entity'
                            ? 'bg-rose-950/60 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer Info */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
              <div>İmza: Enes Öztürk</div>
              <div className="text-slate-600 text-[10px]">.NET 8.0 / C# 12 Web API</div>
            </div>
          </div>

          {/* Right Code Content Pane */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
            {/* File Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-mono font-semibold text-slate-200 truncate">
                  {selectedFile.path}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Bu C# dosyasını indir"
                >
                  <Download className="w-3.5 h-3.5" />
                  İndir (.cs)
                </button>
                <button
                  onClick={() => handleCopyCode(selectedFile)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  {copiedId === selectedFile.id ? (
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

            {/* File Description Banner */}
            <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/60 text-xs text-slate-400">
              {selectedFile.description}
            </div>

            {/* Code Body with Line Numbers */}
            <div className="p-4 sm:p-5 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[600px] overflow-y-auto">
              <pre className="grid grid-cols-[auto_1fr] gap-x-4">
                <span className="select-none text-slate-600 text-right pr-2 border-r border-slate-800 font-mono">
                  {selectedFile.code
                    .split('\n')
                    .map((_, i) => `${i + 1}`)
                    .join('\n')}
                </span>
                <code className="text-slate-100">{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
