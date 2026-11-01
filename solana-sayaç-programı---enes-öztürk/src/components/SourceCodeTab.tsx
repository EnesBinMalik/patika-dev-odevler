import React, { useState } from 'react';
import { RUST_FILES, CodeFile } from '../data/rustCodeData';
import { FileCode, Copy, Check, Download, ExternalLink } from 'lucide-react';

export const SourceCodeTab: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('lib');
  const [copied, setCopied] = useState<boolean>(false);

  const fileKeys = Object.keys(RUST_FILES);
  const currentFile: CodeFile = RUST_FILES[activeKey] || RUST_FILES['lib'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = currentFile.code.trim().split('\n');

  return (
    <div className="space-y-6">
      {/* File Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {fileKeys.map((key) => {
            const f = RUST_FILES[key];
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap border ${
                  activeKey === key
                    ? 'bg-slate-800 text-emerald-400 border-slate-700 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{f.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Dosyayı Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>İndir ({currentFile.filename})</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-xl">
        {/* File Meta Header */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">{currentFile.path}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{currentFile.description}</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">{lines.length} satır</span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[640px] text-xs font-mono leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isComment = line.trim().startsWith('//');
                const isImportant =
                  line.includes('Enes Öztürk') ||
                  line.includes('Adım 1') ||
                  line.includes('Adım 2') ||
                  line.includes('Adım 3') ||
                  line.includes('val > counter');

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/50 ${
                      isImportant ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="text-slate-400 pr-4 select-none text-right align-top w-10 text-[11px]">
                      {lineNum}
                    </td>
                    <td
                      className={`whitespace-pre pl-2 ${
                        isImportant
                          ? 'text-emerald-300 font-semibold'
                          : isComment
                          ? 'text-slate-400 italic'
                          : 'text-slate-200'
                      }`}
                    >
                      {line}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
