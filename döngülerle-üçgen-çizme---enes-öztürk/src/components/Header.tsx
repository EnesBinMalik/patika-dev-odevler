import React from 'react';
import { Moon, Sun, Download, Sparkles, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: 'console' | 'trace' | 'code' | 'report';
  setActiveTab: (tab: 'console' | 'trace' | 'code' | 'report') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onQuickCopy: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onQuickCopy,
  copied,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ▲
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            ucgen(n) <span className="font-normal text-slate-500 dark:text-slate-400">· Enes Öztürk</span>
          </span>
        </div>

        {/* Zone 2: Navigation Segmented Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            İnteraktif Konsol
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'trace'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Adım Adım Simülasyon
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tüm Dillerdeki Kodlar
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ödev Analiz Raporu
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Açık Mod' : 'Karanlık Mod'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onQuickCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Ödev Kodunu Kopyala'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800 gap-1 bg-slate-50 dark:bg-slate-900/50">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'console'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Konsol
        </button>
        <button
          onClick={() => setActiveTab('trace')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'trace'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Simülasyon
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'code'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Kodlar
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'report'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Ödev Raporu
        </button>
      </div>
    </header>
  );
};
