import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart, Globe, Radio } from 'lucide-react';
import { playClickSound, setAudioEnabled } from '../utils/audioEffects';

interface HeaderProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  totalCharactersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  setSoundEnabled,
  favoritesCount,
  onOpenFavorites,
  totalCharactersCount,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setAudioEnabled(next);
    setSoundEnabled(next);
    if (next) {
      playClickSound();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06090e]/85 backdrop-blur-md border-b border-emerald-500/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative group shrink-0">
            {/* Swirling portal ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400 opacity-75 blur-xs group-hover:opacity-100 transition duration-500 animate-spin-slow" />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0a0f18] flex items-center justify-center border border-emerald-400/50 overflow-hidden shadow-inner">
              <span className="text-xl sm:text-2xl select-none group-hover:scale-110 transition-transform">
                🧪
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-chakra text-lg sm:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-300 truncate">
                RICK & MORTY
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                GraphQL API
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide truncate">
              Boyutlararası Karakter & Konum Rehberi
            </p>
          </div>
        </div>

        {/* Center / Signature Badge - ENES ÖZTÜRK */}
        <div className="hidden lg:flex items-center">
          <div className="glow-badge-enes px-4 py-1.5 rounded-full flex items-center gap-2.5 border border-emerald-400/30">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-xs tracking-wider uppercase font-semibold text-slate-300">
              İmza:
            </span>
            <span className="font-chakra text-sm font-bold tracking-wider text-emerald-300 flex items-center gap-1">
              ENES ÖZTÜRK
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Total count pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono-code text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalCharactersCount > 0 ? `${totalCharactersCount} Karakter` : 'Yükleniyor...'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Portal Seslerini Kapat' : 'Portal Seslerini Aç'}
            aria-label="Ses Kontrolü"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-emerald-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline text-xs font-medium">Ses Açık</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden xl:inline text-xs font-medium text-slate-400">Sessiz</span>
              </>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenFavorites();
            }}
            title="Kayıtlı Favoriler"
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-pink-500/30 hover:border-pink-500/60 text-pink-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-pink-500 text-pink-500' : 'text-pink-400'}`} />
            <span className="hidden sm:inline text-xs font-medium">Favoriler</span>
            {favoritesCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold rounded-full bg-pink-500 text-white">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
