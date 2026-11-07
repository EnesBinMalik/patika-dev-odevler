import React from 'react';
import { Database, Search, Sparkles, BookOpen, Share2, Info, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProvenance: () => void;
  onQuickMine: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProvenance,
  onQuickMine,
  isDark,
  setIsDark
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark + signature badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('explorer')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  CORD-19 MINING ENGINE
                </span>
                <span className="text-[11px] font-medium text-cyan-400/90 whitespace-nowrap">
                  Enes Öztürk İmzalı
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`whitespace-nowrap transition-colors py-1 text-xs uppercase tracking-wider ${
                activeTab === 'tasks'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Öncelikli Sorular
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`whitespace-nowrap transition-colors py-1 text-xs uppercase tracking-wider ${
                activeTab === 'explorer'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Literatür Keşfi
            </button>
            <button
              onClick={() => setActiveTab('mining')}
              className={`whitespace-nowrap transition-colors py-1 text-xs uppercase tracking-wider ${
                activeTab === 'mining'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Metin Madenciliği
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`whitespace-nowrap transition-colors py-1 text-xs uppercase tracking-wider ${
                activeTab === 'graph'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Biyomedikal Ağ
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap transition-colors py-1 text-xs uppercase tracking-wider ${
                activeTab === 'analytics'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Metrikler & Trendler
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + auxiliary info button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProvenance}
              title="Problem Tanımı ve Amaç Bilgisi"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Problem Tanımı</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
              title="Tema Değiştir"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onQuickMine}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yapay Zeka Madenciliği</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-900 gap-4 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`whitespace-nowrap py-1 ${activeTab === 'tasks' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
          >
            Öncelikli Sorular
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`whitespace-nowrap py-1 ${activeTab === 'explorer' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
          >
            Literatür Keşfi
          </button>
          <button
            onClick={() => setActiveTab('mining')}
            className={`whitespace-nowrap py-1 ${activeTab === 'mining' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
          >
            Metin Madenciliği
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`whitespace-nowrap py-1 ${activeTab === 'graph' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
          >
            Biyomedikal Ağ
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap py-1 ${activeTab === 'analytics' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
          >
            Metrikler
          </button>
        </div>
      </div>
    </header>
  );
};
