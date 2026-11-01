import React, { useState } from 'react';
import { Copy, Check, Code, FileCode, Sparkles } from 'lucide-react';
import { codeExamples } from '../data/codeExamples';

export const CodeView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  const activeExample = codeExamples.find((c) => c.id === selectedId) || codeExamples[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Temiz Kod ve Çoklu Dil Desteği</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Ödev Kaynak Kodları (5 Farklı Dilde)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              OOP prensiplerini ve Kare'nin Dikdörtgen'den türeyerek sağladığı kod tasarrufunu istediğiniz dilde inceleyin.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md cursor-pointer shrink-0 self-start sm:self-auto ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          {codeExamples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedId === ex.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{ex.language}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-code">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">{activeExample.filename}</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              — {activeExample.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300 font-signature text-base font-bold">
              Enes Öztürk İmzalı
            </span>
          </div>
        </div>

        {/* Code Content */}
        <pre className="p-5 text-xs text-slate-300 overflow-x-auto leading-relaxed select-text">
          <code>{activeExample.code}</code>
        </pre>
      </div>
    </div>
  );
};
