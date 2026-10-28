import React from 'react';
import { Navigation, RefreshCw, LocateFixed } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const Navbar: React.FC = () => {
  const { unit, toggleUnit, refreshWeather, getUserLocation, isLocating, loading } = useWeather();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Navigation className="w-4 h-4 fill-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-white font-extrabold tracking-wider">ENES ÖZTÜRK</span>
            <span className="text-sky-400 text-xs font-semibold tracking-widest hidden sm:inline">METEOROLOJİ</span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a href="#haftalik-rapor" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            7 Günlük Rapor
          </a>
          <a href="#saatlik-rapor" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Saatlik Rapor
          </a>
          <a href="#detayli-metrikler" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Detaylı Metrikler
          </a>
          <a href="#turkiye-haritasi" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            81 İl Rehberi
          </a>
        </nav>

        {/* Zone 3: Functional interactive action controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Unit Toggle Button */}
          <button
            onClick={toggleUnit}
            title={`Sıcaklık birimini değiştir (${unit === 'C' ? 'Fahrenheit' : 'Celsius'})`}
            className="flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <span className={unit === 'C' ? 'text-sky-400 font-bold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className={unit === 'F' ? 'text-sky-400 font-bold' : 'text-slate-400'}>°F</span>
          </button>

          {/* Location button */}
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            title="Konumumu Tespit Et ve Şehri Göster"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-200 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Bulunuyor...' : 'Konumum'}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={() => refreshWeather()}
            disabled={loading}
            title="Hava Durumunu Güncelle"
            className="p-1.5 sm:px-3 sm:py-1.5 flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Güncelle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
