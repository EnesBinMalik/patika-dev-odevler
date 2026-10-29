import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle, Lightbulb } from 'lucide-react';
import { CODE_SNIPPETS, AUTHOR_NAME } from '../data/codeSnippets';
import { CodeFlavor } from '../types';

export const CodeViewer: React.FC = () => {
  const [selectedFlavor, setSelectedFlavor] = useState<CodeFlavor>('callback');
  const [copied, setCopied] = useState(false);

  const currentSnippet = CODE_SNIPPETS.find((s) => s.id === selectedFlavor) || CODE_SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentSnippet.code], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index_${selectedFlavor}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              Ödev Çözüm Dosyası
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Node.js FS Modülü Çözüm Kodları (index.js)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ödev tesliminde kullanabileceğiniz, <strong className="text-emerald-400">{AUTHOR_NAME}</strong> imzalı eksiksiz Node.js kaynak kodları.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>index.js İndir</span>
          </button>
        </div>
      </div>

      {/* Flavor Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {CODE_SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            onClick={() => setSelectedFlavor(snippet.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              selectedFlavor === snippet.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <FileCode className={`w-4 h-4 ${selectedFlavor === snippet.id ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{snippet.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
              {snippet.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Code Container */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-amber-400 font-bold">●</span>
            <span className="text-slate-200 font-semibold">{currentSnippet.badge}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">{currentSnippet.description}</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            İmza: {AUTHOR_NAME}
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto text-xs font-mono bg-[#070a11] text-slate-200 leading-relaxed max-h-[500px]">
          <pre className="text-emerald-200/90 whitespace-pre">
            {currentSnippet.code}
          </pre>
        </div>
      </div>

      {/* Method Explanations Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
            <CheckCircle className="w-4 h-4" />
            <span>1. fs.writeFile(file, data, cb)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dosya yoksa oluşturur, varsa üzerine yazar. JSON nesneleri önce <code className="text-amber-300 font-mono text-[11px]">JSON.stringify()</code> ile metne dönüştürülür.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono">
            <CheckCircle className="w-4 h-4" />
            <span>2. fs.readFile(file, 'utf8', cb)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dosyayı utf8 kodlamasıyla okur. String veri <code className="text-amber-300 font-mono text-[11px]">JSON.parse()</code> ile JavaScript objesine çevrilir.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
            <CheckCircle className="w-4 h-4" />
            <span>3. fs.unlink(file, cb)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Belirtilen dosyayı işletim sistemi dosya yapısından kalıcı olarak siler. Dosya bulunamazsa ENOENT hatası fırlatır.
          </p>
        </div>
      </div>

      {/* Note Callout */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 block mb-0.5">Ödev İpucu (Bootcamp Teslimi):</strong>
          Bootcamp ödevlerinde Callback yöntemi ile iç içe (nested) veya modern async/await yöntemi kullanılabilir. Kodun en başında ve konsol çıktısının sonunda <strong className="text-white">ENES ÖZTÜRK</strong> imzası yer almaktadır.
        </div>
      </div>
    </div>
  );
};
