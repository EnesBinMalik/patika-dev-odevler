import React from 'react';
import { ViewTab } from '../types';
import { Download, Terminal, Cpu, Code2, Network } from 'lucide-react';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onDownloadZip,
  isDownloadingZip = false,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-sm">
            &gt;_
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Java Console Chat
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Enes Öztürk · Soket & İplik
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('simulator')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulator'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 -mb-[2px]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Konsol Simülatörü</span>
          </button>

          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'architecture'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 -mb-[2px]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>İplik & Soket Mimarisi</span>
          </button>

          <button
            onClick={() => onTabChange('sourcecode')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sourcecode'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 -mb-[2px]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Java Kaynak Kodları</span>
          </button>

          <button
            onClick={() => onTabChange('languide')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'languide'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400 -mb-[2px]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>LAN Bağlantı Rehberi</span>
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg transition-colors shadow-sm shadow-emerald-950 whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingZip ? 'ZIP Hazırlanıyor...' : 'Java Projesini İndir (.ZIP)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
