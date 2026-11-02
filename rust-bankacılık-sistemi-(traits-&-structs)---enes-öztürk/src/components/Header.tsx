import React from 'react';
import { Terminal, ShieldCheck, Cpu, CheckCircle2, Download, Layers, PlayCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'code' | 'memory' | 'checklist';
  setActiveTab: (tab: 'simulator' | 'code' | 'memory' | 'checklist') => void;
  onRunSteps: () => void;
  onOpenExport: () => void;
  completedStepsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunSteps,
  onOpenExport,
  completedStepsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-slate-900/90">
      {/* Top Banner / Signature Bar */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 border-b border-orange-500/20 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            Rust 2021 Edition
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Özellikler (Traits) & Structs Bankacılık Sistemi
          </span>
        </div>

        {/* Signature Badge */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-200 px-2.5 py-0.5 rounded-full font-mono text-xs shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">Geliştirici:</span>
            <span className="font-semibold text-white tracking-wide">Enes Öztürk</span>
            <span className="text-[10px] bg-orange-500/30 text-orange-300 px-1.5 rounded font-mono">İmzalı</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 font-black text-xl border border-orange-400/40 select-none">
            🦀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Rust Bankacılık Sistemi
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono border border-orange-500/30 font-normal">
                  trait Hesap
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rust Traits, Structs ve Referans Sistemi (<code className="text-orange-300">&self</code> / <code className="text-orange-300">&mut self</code>) Laboratuvarı
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRunSteps}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer"
            title="Adım 6'dan 9'a kadar tüm işlemleri sırayla çalıştır"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Adımları Oynat (cargo run)</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Kodları İndir (.rs / Cargo)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'simulator'
              ? 'border-orange-500 text-orange-400 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>⚡ Canlı Banka Simülatörü</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'code'
              ? 'border-orange-500 text-orange-400 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>🦀 Rust Kod Editörü & Konsol</span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'memory'
              ? 'border-orange-500 text-orange-400 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>🧠 Trait & Bellek Görselleştirici</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'checklist'
              ? 'border-orange-500 text-orange-400 bg-orange-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>✅ Görev Kontrol Listesi</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
            {completedStepsCount}/10
          </span>
        </button>
      </div>
    </header>
  );
};
