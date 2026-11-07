import React from 'react';
import { User } from '../types/rental';

interface HeaderProps {
  activeTab: 'search' | 'company' | 'reservations' | 'database' | 'java';
  setActiveTab: (tab: 'search' | 'company' | 'reservations' | 'database' | 'java') => void;
  currentUser: User;
  onOpenAuth: () => void;
  reservationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  reservationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('search')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Araç Kiralama Portalı
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Geliştirici: Enes Öztürk · Java & SQL
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('search')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'search'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Araç Arama
            </button>

            <button
              onClick={() => setActiveTab('company')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'company'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Firma Paneli
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'reservations'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Rezervasyonlarım</span>
              {reservationsCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  ({reservationsCount})
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'database'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Veritabanı & SQL
            </button>

            <button
              onClick={() => setActiveTab('java')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'java'
                  ? 'text-slate-900 dark:text-white font-semibold border-b-2 border-slate-900 dark:border-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Java Kaynak Kodları
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="truncate max-w-[140px]">{currentUser.fullName}</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap shadow-sm"
            >
              Araç Kirala
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`whitespace-nowrap ${activeTab === 'search' ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Araç Arama
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`whitespace-nowrap ${activeTab === 'company' ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Firma Paneli
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`whitespace-nowrap ${activeTab === 'reservations' ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Rezervasyonlar ({reservationsCount})
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`whitespace-nowrap ${activeTab === 'database' ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            SQL Veritabanı
          </button>
          <button
            onClick={() => setActiveTab('java')}
            className={`whitespace-nowrap ${activeTab === 'java' ? 'font-bold text-slate-900' : 'text-slate-600'}`}
          >
            Java Kodları
          </button>
        </div>
      </div>
    </header>
  );
};
