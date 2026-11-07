import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../data/javaSources';
import { Download, Copy, Check, FileCode, Terminal, FileText, Layers, ShieldCheck } from 'lucide-react';

interface CodeExplorerProps {
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  onDownloadZip,
  isDownloadingZip = false,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('ChatServer.java');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile = JAVA_PROJECT_FILES.find((f) => f.name === selectedFileName) || JAVA_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (file: JavaFileItem) => {
    if (file.category === 'java') return <FileCode className="w-4 h-4 text-emerald-400" />;
    if (file.category === 'script') return <Terminal className="w-4 h-4 text-amber-400" />;
    return <FileText className="w-4 h-4 text-sky-400" />;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ORİJİNAL KAYNAK KODLAR · ENES ÖZTÜRK İMZALI</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Java Proje Dosyaları & Betikleri
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tüm dosyalar saf Java standart kütüphanesiyle yazılmıştır; harici kütüphane veya Maven/Gradle bağımlılığı gerektirmez.
          </p>
        </div>

        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-950 whitespace-nowrap shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloadingZip ? 'ZIP Dosyası Hazırlanıyor...' : 'Tüm Projeyi ZIP Olarak İndir (.ZIP)'}</span>
        </button>
      </div>

      {/* Code Inspector Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* File Sidebar */}
        <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Proje Ağacı ({JAVA_PROJECT_FILES.length} Dosya)
          </div>

          <div className="space-y-1">
            {JAVA_PROJECT_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileName(file.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs transition-colors text-left ${
                  selectedFileName === file.name
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getFileIcon(file)}
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase shrink-0">
                  {file.category}
                </span>
              </button>
            ))}
          </div>

          {/* Architecture Summary Card */}
          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-2 px-2">
            <div className="font-semibold text-slate-300">Geliştirici İmzası:</div>
            <div className="text-emerald-400">Enes Öztürk</div>
            <div className="text-slate-500">enesbino38@gmail.com</div>
            <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
              Java SE 8, 11, 17, 21 uyumlu derlenebilir kaynak kodlar.
            </div>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="lg:col-span-8 bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1424] border-b border-slate-800">
            <div className="flex items-center gap-2">
              {getFileIcon(selectedFile)}
              <span className="text-xs font-mono font-bold text-slate-200">
                {selectedFile.name}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                ({selectedFile.description})
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors border border-slate-700/60"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="p-4 font-mono text-[12.5px] leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto bg-[#070a12]/95 text-slate-200 select-text">
            <pre className="table w-full">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-800/30">
                  <span className="table-cell select-none pr-4 text-right text-slate-600 text-[11px] w-10">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
