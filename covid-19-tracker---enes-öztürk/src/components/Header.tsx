import React from 'react';
import { Activity, BookOpen, RefreshCw, Globe2 } from 'lucide-react';

interface HeaderProps {
  onOpenDoc: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDoc,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  const formattedUpdate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Güncelleniyor...';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-900/10">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                COVID-19 Tracker
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-500 ml-2 font-medium">
                by Enes Öztürk
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#durum-kartlari" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Genel Durum
            </a>
            <a href="#ulke-secici" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Ülke Analizi
            </a>
            <a href="#grafik-bolumu" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Grafikler & Trend
            </a>
            <button
              onClick={onOpenDoc}
              className="text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Dokümantasyon</span>
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Verileri Yenile"
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              onClick={onOpenDoc}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>Dokümantasyon</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
