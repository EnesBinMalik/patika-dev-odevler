import React from 'react';
import { Cpu, CheckCircle2, Terminal, Code2, CheckSquare, BookOpen, Calculator } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'terminal' | 'code' | 'checklist' | 'theory';
  setActiveTab: (tab: 'simulator' | 'terminal' | 'code' | 'checklist' | 'theory') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-mono font-bold text-xl tracking-tight ring-1 ring-white/20">
              🦀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Rust Enum & Desen Eşleştirme</span>
                  <span className="text-amber-400 font-mono text-sm hidden sm:inline">::</span>
                  <span className="text-amber-400 text-sm hidden sm:inline font-mono">Hesap Makinesi</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Cebirsel Veri Tipleri</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Tuple Varyantları</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Exhaustive Match</span>
              </div>
            </div>
          </div>

          {/* Enes Öztürk Signature Badge */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-bold text-xs ring-1 ring-amber-300/40">
                EÖ
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                  Hazırlayan & Geliştirici
                </div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  <span>Enes Öztürk</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-2 border-t border-slate-800/60 no-scrollbar text-sm">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Görsel Simülatör</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal (CLI)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Rust Kodu (main.rs)</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Kontrol Listesi & Testler</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'theory'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rust Enum Mimarisi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
