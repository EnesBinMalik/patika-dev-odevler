import React from 'react';
import {
  Calendar,
  Code2,
  Database,
  Plus,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenCreate: () => void;
  onOpenConsole: () => void;
  onOpenAbout: () => void;
  activeTab: 'events' | 'about';
  setActiveTab: (tab: 'events' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreate,
  onOpenConsole,
  onOpenAbout,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('events')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                  EventHub
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                  Apollo Client · Enes Öztürk
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('events')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'events'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Etkinlikler
            </button>
            <button
              onClick={onOpenConsole}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 border-transparent text-slate-600"
            >
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>GraphQL Konsolu</span>
            </button>
            <button
              onClick={onOpenAbout}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'about'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Ödev 4 Raporu
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenConsole}
              title="Apollo Client Önbelleği & Sorguları İncele"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Apollo Cache</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Etkinlik Oluştur</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
