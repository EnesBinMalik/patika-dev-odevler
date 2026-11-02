import React from 'react';
import { Download, ShieldCheck, Terminal, Code, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSubmission: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSubmission,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no decorative pills) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-cyan-900/40">
            EO
          </div>
          <span className="font-bold text-base tracking-tight text-white whitespace-nowrap">
            Enes Öztürk <span className="text-slate-400 font-normal">/ Solana Token Transfer Ödevi</span>
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'guide' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            Ödev Rehberi
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'code' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            Rust & Anchor Kodu
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'test' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            Cargo Test Terminali
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-0.5 ${
              activeTab === 'simulator' ? 'text-cyan-400 border-b-2 border-cyan-400' : ''
            }`}
          >
            Canlı Simülatör
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSubmission}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ödev Çözümünü İndir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
