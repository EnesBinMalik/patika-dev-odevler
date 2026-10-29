import React, { useState } from 'react';
import { CODE_FILES, CodeFile } from '../data/codeFiles';
import { Copy, Check, Download, FileCode, CheckCircle2, Info, Sparkles } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CODE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (file: CodeFile) => {
    const blob = new Blob([file.content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    CODE_FILES.forEach((f) => {
      handleDownload(f);
    });
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="flex flex-col gap-6">
      {/* File Selector & Action Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        {/* Tab buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {CODE_FILES.map((file) => {
            const isActive = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                type="button"
                onClick={() => setSelectedFile(file)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10 font-bold'
                    : 'bg-slate-950/40 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{file.filename}</span>
                {file.filename === 'circle.js' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Modül
                  </span>
                )}
                {file.filename === 'index.js' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    Ana Dosya
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDownload(selectedFile)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Dosyayı İndir</span>
          </button>
        </div>
      </div>

      {/* Code Display Container */}
      <div className="bg-[#0b101b] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono">
        {/* File Header */}
        <div className="bg-[#101726] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{selectedFile.filename}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{selectedFile.description}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{lines.length} satır</span>
            <span>•</span>
            <span className="text-emerald-400 font-sans font-semibold">Enes Öztürk İmzalı</span>
          </div>
        </div>

        {/* Code Lines with Syntax Coloring */}
        <div className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed max-h-[580px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, index) => {
                const lineNum = index + 1;
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');
                const isRequire = line.includes('require(');
                const isModuleExports = line.includes('module.exports');
                const isFunction = line.includes('function circle');
                const isSignature = line.includes('Enes Öztürk');
                const isRadiusParam = line.includes('const r = 5') || line.includes('r = 5');

                let lineClasses = 'text-slate-300';
                if (isComment) lineClasses = 'text-slate-500 italic';
                else if (isSignature) lineClasses = 'text-purple-300 font-semibold';
                else if (isModuleExports) lineClasses = 'text-emerald-300 font-semibold';
                else if (isRequire) lineClasses = 'text-cyan-300 font-semibold';
                else if (isFunction) lineClasses = 'text-amber-300 font-medium';
                else if (isRadiusParam) lineClasses = 'text-teal-300 font-bold';

                return (
                  <tr
                    key={index}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSignature ? 'bg-purple-950/20' : ''
                    } ${isModuleExports ? 'bg-emerald-950/20' : ''}`}
                  >
                    <td className="w-10 select-none text-right pr-4 text-slate-600 text-xs font-mono align-top py-0.5">
                      {lineNum}
                    </td>
                    <td className={`py-0.5 whitespace-pre font-mono ${lineClasses}`}>
                      {line || ' '}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Breakdown & Key Requirement Cards */}
      {selectedFile.highlights.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ödev Şartları & Kod Açıklamaları ({selectedFile.filename})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedFile.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {h.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Satır: {h.lineRange}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
