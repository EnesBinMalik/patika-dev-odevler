import React from 'react';
import { Terminal, Code2, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTerminal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenTerminal }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element wordmark */}
        <a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
          className="flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/10 text-white font-mono font-bold text-sm">
            ☕
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Java Stream Kitap Listesi
            </div>
            <div className="text-[11px] text-amber-400 font-medium">
              Enes Öztürk İmzalı Ödev Çözümü
            </div>
          </div>
        </a>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'map'
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                : 'hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            Map&lt;String, String&gt; Eşleşmesi
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'filter'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            Sayfa Filtresi (&gt;100)
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pipeline'
                ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                : 'hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            Stream Görselleştirici
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'code'
                ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                : 'hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            Java Kodları
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Java Main konsol çıktısını simüle et"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminali Çalıştır</span>
          </button>
        </div>
      </div>
    </header>
  );
};
