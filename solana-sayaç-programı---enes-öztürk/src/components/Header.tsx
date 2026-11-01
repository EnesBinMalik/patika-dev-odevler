import React from 'react';
import { Cpu, Terminal, GitCommit, FileCode, CheckCircle2, BookOpen, Download } from 'lucide-react';

export type ActiveTab = 'simulator' | 'diff' | 'source' | 'tests' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExport }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <a href="#" className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
              Solana Counter Program
            </a>
            <span className="text-xs text-slate-400 block -mt-0.5">
              Enes Öztürk · Ödev Çözümü
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Canlı Simülatör</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'diff'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>Adım Adım Kod (Diff)</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'source'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Rust Kodları</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Birim Testleri</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teknik Rehber</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kodları İndir</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-900 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Simülatör
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'diff' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Kod Değişiklikleri
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'source' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Rust Kodları
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'tests' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Testler
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'guide' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Rehber
        </button>
      </div>
    </header>
  );
};
