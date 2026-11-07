import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../data/javaSourceCode';
import { Code, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileItem>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Java OOP, JDBC & Swing Mimari Paketi
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Java Kaynak Kodları & Proje Dosyaları
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Geliştirici & Yazar: <strong>Enes Öztürk</strong> · Üniversite & Proje Teslim Standartlarında Temiz Kod
          </p>
        </div>

        {/* Requirements Compliance Checklist */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tüm şartname kuralları (Database, GUI, İptal Kuralı, Çakışma Önleme) kodlandı.</span>
        </div>
      </div>

      {/* Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left File Tree Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
            Proje Dosyaları ({JAVA_PROJECT_FILES.length})
          </div>

          {JAVA_PROJECT_FILES.map((file) => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
                <div className="min-w-0">
                  <div className="text-xs font-bold font-mono truncate">{file.filename}</div>
                  <div className="text-[11px] opacity-75 truncate">{file.description}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/20">
                    {file.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Display Area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          {/* Code Toolbar */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-xs font-bold text-slate-200">
                {selectedFile.filename}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                — {selectedFile.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-5 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
