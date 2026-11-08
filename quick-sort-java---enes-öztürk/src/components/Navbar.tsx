import React from 'react';
import { Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'visualizer' | 'code' | 'theory' | 'benchmark';
  setActiveTab: (tab: 'visualizer' | 'code' | 'theory' | 'benchmark') => void;
  onDownloadJava: () => void;
  onOpenAuthor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadJava,
  onOpenAuthor,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title with Author Stamp */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-sm tracking-wider shadow-inner">
            EO
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight whitespace-nowrap">
              QuickSort Java
            </span>
            <button
              onClick={onOpenAuthor}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors text-left font-medium cursor-pointer flex items-center gap-1"
            >
              <span>Enes Öztürk İmzalı</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single line, clean typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'visualizer'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            İnteraktif Görselleştirici
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'code'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Java Kaynak Kodu
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'theory'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Algoritma Analizi & Teori
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'benchmark'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Canlı Benchmark
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDownloadJava}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>QuickSort.java İndir</span>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-900 px-4 py-2 gap-4 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`whitespace-nowrap ${activeTab === 'visualizer' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Görselleştirici
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`whitespace-nowrap ${activeTab === 'code' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Java Kodu
        </button>
        <button
          onClick={() => setActiveTab('theory')}
          className={`whitespace-nowrap ${activeTab === 'theory' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Teori
        </button>
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`whitespace-nowrap ${activeTab === 'benchmark' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Benchmark
        </button>
      </div>
    </header>
  );
};
