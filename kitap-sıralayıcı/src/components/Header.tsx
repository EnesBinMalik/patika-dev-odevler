import React from 'react';
import { BookOpen, Moon, Sun, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('collection');
              }}
              className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap"
            >
              Kitap Sıralayıcı
            </a>
          </div>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-400">
            <button
              onClick={() => setActiveTab('collection')}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'collection'
                  ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100'
                  : ''
              }`}
            >
              Kitap Koleksiyonu
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'tree'
                  ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100'
                  : ''
              }`}
            >
              TreeSet Ağacı
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'compare'
                  ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100'
                  : ''
              }`}
            >
              Karşılaştırıcı
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'code'
                  ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100'
                  : ''
              }`}
            >
              Java Kaynak Kodu
            </button>
          </nav>

          {/* Zone 3: 1 primary action + dark mode toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Açık Mod' : 'Karanlık Mod'}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Kitap Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
