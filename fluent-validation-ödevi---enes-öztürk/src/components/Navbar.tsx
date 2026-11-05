import React from 'react';
import { ShieldCheck, Moon, Sun, CheckCircle2, FileText, Play, Code2, GitFork, Printer } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onOpenReport,
}) => {
  const navItems = [
    { id: 'playground', label: 'Canlı Simülatör', icon: Play },
    { id: 'code', label: 'C# Kodları', icon: Code2 },
    { id: 'architecture', label: 'Mimari Akış', icon: GitFork },
    { id: 'report', label: 'Ödev Raporu', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              FV
            </div>
            <div>
              <a 
                href="#top" 
                onClick={(e) => { e.preventDefault(); setActiveTab('playground'); }}
                className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                FluentValidation.NET
              </a>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>Ödev Projesi</span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Enes Öztürk İmzalı</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Author Signature */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Student Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-600 dark:text-slate-300">Hazırlayan:</span>
              <span className="font-semibold text-slate-900 dark:text-white">Enes Öztürk</span>
            </div>

            {/* Quick Print/PDF Button */}
            <button
              onClick={onOpenReport}
              title="Ödev Raporunu Yazdır / PDF Olarak Kaydet"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Tema Değiştir"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab('playground')}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simülatörü Dene</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
