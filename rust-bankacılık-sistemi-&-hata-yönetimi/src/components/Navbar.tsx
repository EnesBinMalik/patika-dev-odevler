import React from 'react';
import { Play, Code2, Terminal as TerminalIcon, CheckSquare, BookOpen, ShieldCheck, Download } from 'lucide-react';
import { RUST_SOURCE_CODE } from '../data/rustCode';

interface NavbarProps {
  activeTab: 'simulator' | 'code' | 'checklist' | 'guide';
  setActiveTab: (tab: 'simulator' | 'code' | 'checklist' | 'guide') => void;
  isRunning: boolean;
  onRunCargo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onRunCargo,
}) => {
  const handleDownload = () => {
    const blob = new Blob([RUST_SOURCE_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.rs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-950/40 text-lg">
              🦀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Rust Bankacılık Sistemi
                </h1>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  Hata Yönetimi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>İmza:</span>
                <span className="text-orange-400 font-semibold">Enes Öztürk</span>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Simülatör &amp; Konsol</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Rust Kodu (main.rs)</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Kontrol Listesi (8/8)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Rehber</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
              title="main.rs dosyasını indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir</span>
            </button>

            <button
              onClick={onRunCargo}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isRunning
                  ? 'bg-amber-600/30 text-amber-300 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-950/40 active:scale-95'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
              <span>{isRunning ? 'Derleniyor...' : 'cargo run'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'simulator' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400'
            }`}
          >
            Simülatör
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'code' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400'
            }`}
          >
            Rust Kodu
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'checklist' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400'
            }`}
          >
            Kontrol Listesi
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'guide' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400'
            }`}
          >
            Rehber
          </button>
        </div>
      </div>
    </header>
  );
};
