import React from 'react';
import { Plus, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'products' | 'terminal';
  setActiveTab: (tab: 'products' | 'terminal') => void;
  onOpenAddModal: () => void;
  onOpenBrandModal: () => void;
  onOpenSubmissionModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBrandModal,
  onOpenSubmissionModal,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('products');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-90 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shadow-orange-600/30">
              P
            </span>
            <span>PatikaStore</span>
          </a>
          <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
            Enes Öztürk
          </span>
        </div>

        {/* Zone 2: Nav links, 1-2 word labels, single-line */}
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'products'
                ? 'text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ürün Tablosu
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'terminal'
                ? 'text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Java Konsolu (CLI)
          </button>
          <button
            onClick={onOpenBrandModal}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors py-1"
          >
            Markalar
          </button>
          <button
            onClick={onOpenSubmissionModal}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1"
          >
            <span>Ödev Detayı</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action (+ theme toggle) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Açık Mod' : 'Karanlık Mod'}
            aria-label="Tema Değiştir"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors shadow-sm shadow-orange-600/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Ürün Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
