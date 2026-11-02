import React from 'react';
import { Play, Sparkles, CheckCircle2, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'visualizer' | 'checklist' | 'theory' | 'terminal';
  setActiveTab: (tab: 'editor' | 'visualizer' | 'checklist' | 'theory' | 'terminal') => void;
  onRun: () => void;
  isRunning: boolean;
  completedCount: number;
  totalChecklist: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRun,
  isRunning,
  completedCount,
  totalChecklist,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-[#0f121a]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner with Enes Öztürk signature & project identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#121520] rounded-[10px] flex items-center justify-center text-orange-400 font-mono font-bold text-lg">
              🦀
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Rust Özel Filtreleme
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  custom_filter
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Kapanış (Closure) kullanmadan Struct, Impl ve Referans (&) ile vektör filtreleme
            </p>
          </div>
        </div>

        {/* Developer Signature & Quick Action */}
        <div className="flex items-center gap-3">
          {/* Prominent Enes Öztürk signature badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900/80 border border-amber-500/30 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block leading-none">
                Geliştirici & Yazar
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
                Enes Öztürk
              </span>
            </div>
          </div>

          {/* Quick Cargo Run button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 ${
              isRunning
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-600/30 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Derleniyor...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>cargo run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <span className="font-mono text-xs">src/main.rs</span>
            <span>Kod & Editör</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'visualizer'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Görsel Bellek Simülatörü</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'checklist'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kontrol Listesi ({completedCount}/{totalChecklist})</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'theory'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Kapanışsız Rust Rehberi</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'terminal'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Cargo Terminali</span>
          </button>
        </nav>

        {/* Small project badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>Rust 2021</span>
          <span>•</span>
          <span>my_project</span>
        </div>
      </div>
    </header>
  );
};
