/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { MY_LIST_JAVA_CODE, MAIN_JAVA_CODE } from '../data/javaSource.ts';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'MyList.java' | 'Ata.java'>('MyList.java');
  const [copied, setCopied] = useState(false);

  const activeCode = selectedFile === 'MyList.java' ? MY_LIST_JAVA_CODE : MAIN_JAVA_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = activeCode.trim().split('\n');

  // Simple syntax colorizer for Java
  const formatJavaLine = (line: string) => {
    // If it's a comment
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
      return <span className="text-emerald-400/90 italic">{line}</span>;
    }

    // Split words or apply basic coloring
    return (
      <span>
        {line.split(/(\b(?:public|private|static|final|class|void|int|boolean|null|new|this|return|if|else|for|package|import|extends|implements)\b)/g).map((part, i) => {
          if (['public', 'private', 'static', 'final', 'class', 'void', 'int', 'boolean', 'null', 'new', 'this', 'return', 'if', 'else', 'for', 'package', 'import', 'extends', 'implements'].includes(part)) {
            return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          }
          if (part.includes('@Override') || part.includes('@SuppressWarnings')) {
            return <span key={i} className="text-purple-400">{part}</span>;
          }
          if (part.startsWith('"') && part.endsWith('"')) {
            return <span key={i} className="text-cyan-300">{part}</span>;
          }
          return <span key={i} className="text-slate-200">{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* File Header Bar */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedFile('MyList.java')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                selectedFile === 'MyList.java'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>MyList.java (Generic Sınıf)</span>
            </button>

            <button
              onClick={() => setSelectedFile('Ata.java')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                selectedFile === 'Ata.java'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Ata.java (Test Senaryoları)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            Yazar: <strong className="text-amber-400">Enes Öztürk</strong>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
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

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{selectedFile} İndir</span>
          </button>
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>src/main/java/com/enesozturk/mylist/{selectedFile}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>{lines.length} Satır</span>
            <span>UTF-8</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Collection Bağımsız
            </span>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 font-mono text-xs overflow-x-auto max-h-[650px] overflow-y-auto selection:bg-amber-500/40">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 group">
                  <td className="text-right pr-4 select-none text-slate-600 group-hover:text-slate-400 text-[11px] w-12 align-top py-0.5">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono py-0.5 pl-2 leading-relaxed">
                    {formatJavaLine(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
