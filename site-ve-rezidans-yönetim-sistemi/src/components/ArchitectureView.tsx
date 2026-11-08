import React, { useState } from 'react';
import { ARCHITECTURE_SNIPPETS, CodeSnippet } from '../data/architectureCode';
import { Database, Server, CreditCard, Copy, Check, Download, Layers, ShieldCheck, Terminal, FileCode2 } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(ARCHITECTURE_SNIPPETS[0]);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MSSQL' | 'DotNetMVC' | 'WebApi_MongoDB'>('ALL');
  const [copied, setCopied] = useState(false);

  const filteredSnippets = ARCHITECTURE_SNIPPETS.filter((s) =>
    activeCategory === 'ALL' ? true : s.category === activeCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedSnippet.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = selectedSnippet.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Hero Architecture Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-md text-xs font-semibold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Enes Öztürk İmzalı Mimari Tasarım & Kaynak Kodları</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sistem Mimarisi: .NET 5 MVC, MS SQL Server & MongoDB WebAPI
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kullanıcı isterlerine birebir uygun olarak hazırlanan tam kapsamlı backend kodları:
              MS SQL Server ilişkisel veritabanı şeması, .NET 5 MVC Controller/Model yapıları ve kredi kartı bakiye/limit kontrolü için bağımsız MongoDB destekli .NET WebAPI ödeme servisi.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Seçili Dosyayı İndir ({selectedSnippet.filename})</span>
            </button>
          </div>
        </div>

        {/* High-Level Architecture Topology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">1. Web Katmanı: .NET 5 MVC</h4>
              <p className="text-xs text-slate-400 mt-1">
                Admin & Sakin modülleri, yetkilendirme, otomatik şifre üretimi ve Razor View şablonları.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">2. Ana Veritabanı: MS SQL Server</h4>
              <p className="text-xs text-slate-400 mt-1">
                Daireler, Sakinler, Aidatlar, Faturalar, Mizan raporu Stored Procedure'leri ve ilişkisel bütünlük.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">3. Kart Servisi: MongoDB & WebAPI</h4>
              <p className="text-xs text-slate-400 mt-1">
                Banka kartları, bakiye/limit sorgusu ve işlem logları için bağımsız NoSQL REST API servisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: File / Snippet Selector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({ARCHITECTURE_SNIPPETS.length})
            </button>
            <button
              onClick={() => setActiveCategory('MSSQL')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'MSSQL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MS SQL
            </button>
            <button
              onClick={() => setActiveCategory('DotNetMVC')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'DotNetMVC' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              .NET 5 MVC
            </button>
            <button
              onClick={() => setActiveCategory('WebApi_MongoDB')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'WebApi_MongoDB' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MongoDB
            </button>
          </div>

          {/* Snippet List */}
          <div className="space-y-2">
            {filteredSnippets.map((snippet) => {
              const isSelected = selectedSnippet.id === snippet.id;
              return (
                <button
                  key={snippet.id}
                  onClick={() => setSelectedSnippet(snippet)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                      <FileCode2 className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {snippet.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                        snippet.language === 'sql'
                          ? 'bg-blue-100 text-blue-700'
                          : snippet.language === 'csharp'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {snippet.language}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-1 block truncate">
                    {snippet.filename}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {snippet.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {selectedSnippet.filename}
                </span>
                <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
                  ({selectedSnippet.language.toUpperCase()})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Dosyayı İndir"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description bar */}
          <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400">
            {selectedSnippet.description}
          </div>

          {/* Code Editor Body */}
          <div className="p-5 overflow-x-auto max-h-[560px] text-slate-200 font-mono text-xs leading-relaxed">
            <pre className="whitespace-pre">
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Hazırlayan & Tasarlayan: <strong className="text-slate-300">Enes Öztürk</strong></span>
            <span>.NET 5.0 SDK & C# 9.0 Uyumlu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
