import React, { useState } from 'react';
import { CSHARP_FILES, CSharpSourceFile } from '../data/csharpSourceCode';
import { Layers, FileCode, Copy, Check, Shield, Cpu, Database, Terminal } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CSharpSourceFile>(CSHARP_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layersInfo = [
    {
      name: 'SmartBanking.Domain',
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      desc: 'İş Kuralları, Temel Varlıklar, Soyut Taban Sınıflar (Account, Customer), Veri Yapıları (Stack LIFO, Queue FIFO). Dış dünyaya sıfır bağımlılık.',
    },
    {
      name: 'SmartBanking.Application',
      icon: Cpu,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      desc: 'Use Cases & Algoritma Motorları (CreditRiskEngine, DTI hesaplamaları, Faiz formülleri, servis sözleşmeleri).',
    },
    {
      name: 'SmartBanking.Infrastructure',
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      desc: 'Dosya I/O (.txt / .json stream logger), harici veri kaynakları, disk operasyonları ve Git denetimi.',
    },
    {
      name: 'SmartBanking.ConsoleUI',
      icon: Terminal,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      desc: 'Kullanıcı Arayüzü, Spectre.Console ANSI çıktıları, Dependency Injection konfigürasyonu ve Program.cs giriş noktası.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>CLEAN ARCHITECTURE</span>
          <span>·</span>
          <span>.NET 9 & C# 12</span>
          <span>·</span>
          <span>GELİŞTİRİCİ: ENES ÖZTÜRK</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">Katmanlı Mimari Şeması ve C# Kaynak Kodları</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Clean Architecture ve OOP prensipleri gözetilerek ayrıştırılmış katmanlar.
          Bağımlılıklar daima içe (Domain'e) doğrudur; Domain katmanı diğer katmanları bilmez ve tamamen soyuttur.
        </p>
      </div>

      {/* 4 Layers Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {layersInfo.map((l, i) => {
          const Icon = l.icon;
          return (
            <div
              key={l.name}
              className={`p-4 rounded-xl border ${l.bgColor} ${l.borderColor} space-y-2`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${l.color}`} />
                <span className="text-xs font-bold font-mono text-white truncate">{l.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{l.desc}</p>
            </div>
          );
        })}
      </div>

      {/* C# Code Explorer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Left: Files Navigation (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800 p-4 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-slate-400 font-bold">PROJE DOSYA AĞACI</span>
            <span className="text-[10px] text-emerald-400 font-mono">C# .NET 9</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {CSHARP_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2 ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold truncate text-slate-200">{file.title.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Preview & Description (8 cols) */}
        <div className="lg:col-span-8 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{selectedFile.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedFile.path}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {selectedFile.description}
            </p>
          </div>

          {/* Code Body */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden">
            <div className="px-4 py-2 bg-[#161b22] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>C# Language (nullable enable)</span>
              <span className="text-emerald-400 font-semibold">Enes Öztürk</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed selection:bg-emerald-500/20">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
