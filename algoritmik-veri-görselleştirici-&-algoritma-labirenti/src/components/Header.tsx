import React from 'react';
import { ActiveModule } from '../types';
import { Share2, Code2 } from 'lucide-react';

interface HeaderProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenLinkedInModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenLinkedInModal,
}) => {
  const navItems: { id: ActiveModule; label: string }[] = [
    { id: 'array', label: 'Dizi (Array)' },
    { id: 'stack', label: 'Yığıt (Stack)' },
    { id: 'queue', label: 'Kuyruk (Queue)' },
    { id: 'sorting', label: 'Sıralama Algoritmaları' },
    { id: 'maze', label: 'Labirent Keşfi (Maze)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectModule('array')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors whitespace-nowrap">
              Algoritmik Labirent
            </span>
            <span className="block text-[11px] text-slate-400 font-medium -mt-1 tracking-wider uppercase font-mono">
              Enes Öztürk
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line controls) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLinkedInModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>LinkedIn Paylaşımı</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-800/60 bg-slate-950/80 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
