import React from 'react';
import { Terminal as TerminalIcon, ShieldCheck, FolderGit2, Sparkles, FileCode2 } from 'lucide-react';
import { AUTHOR_NAME } from '../data/codeSnippets';

interface HeaderProps {
  onRunAll: () => void;
  isRunningAll: boolean;
  activeTab: 'simulator' | 'code' | 'docs';
  setActiveTab: (tab: 'simulator' | 'code' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRunAll,
  isRunningAll,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Assignment Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Ödev 4
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Node.js FS (File System) Modülü
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              employees.json CRUD İşlemleri • Yarat, Oku, Güncelle, Sil
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CRUD Simülatörü</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Node.js Çözüm Kodları</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>FS Rehberi & Özet</span>
          </button>
        </div>

        {/* Right: Signature Badge & Run All CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Author signature pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-emerald-500/30 rounded-lg text-xs shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Ödev Sahibi & İmza
              </span>
              <span className="font-bold text-emerald-300 font-mono tracking-wide">
                {AUTHOR_NAME}
              </span>
            </div>
          </div>

          {/* Quick Run All Button */}
          <button
            onClick={onRunAll}
            disabled={isRunningAll}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isRunningAll
                ? 'bg-emerald-600/40 text-emerald-200 cursor-not-allowed animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-emerald-900/40'
            }`}
            title="Tüm CRUD adımlarını sırayla icra eder"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            {isRunningAll ? 'Adımlar Yürütülüyor...' : 'Tüm Ödevi Çalıştır (Run All)'}
          </button>
        </div>
      </div>
    </header>
  );
};
