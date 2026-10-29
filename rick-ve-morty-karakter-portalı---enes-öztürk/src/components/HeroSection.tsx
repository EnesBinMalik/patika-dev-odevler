import React from 'react';
import { Sparkles, Dices, Filter, Compass, Flame } from 'lucide-react';
import { playPortalSound } from '../utils/audioEffects';

interface HeroSectionProps {
  onRandomCharacter: () => void;
  onQuickFilter: (name: string) => void;
  isLoadingRandom: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRandomCharacter,
  onQuickFilter,
  isLoadingRandom,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-8 md:pt-10 md:pb-12 border-b border-emerald-500/10">
      {/* Background portal effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] pointer-events-none opacity-20">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-lime-400 blur-3xl animate-portal" />
      </div>

      {/* Floating subtle particle grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Creator Signature Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium shadow-sm hover:border-emerald-400/50 transition">
          <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
          <span>Proje 2: Rick ve Morty Karakterleri</span>
          <span className="text-slate-500">•</span>
          <span className="font-chakra font-bold text-lime-300 tracking-wider">
            ENES ÖZTÜRK İMZALI
          </span>
        </div>

        {/* Hero Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-chakra text-white mb-4">
          C-137 VE SONSUZ EVRENLERİN{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
            KARAKTERLERİ
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg mb-6 leading-relaxed">
          Resmi Rick and Morty GraphQL backend API'si ile güçlendirilmiş; anlık filtreleme, sayfalama ve derinlemesine bölüm dökümü sunan boyutlararası portal arayüzü.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => {
              playPortalSound();
              onRandomCharacter();
            }}
            disabled={isLoadingRandom}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-chakra tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Dices className={`w-5 h-5 ${isLoadingRandom ? 'animate-spin' : ''}`} />
            <span>{isLoadingRandom ? 'Portal Açılıyor...' : 'Rastgele Karakter Keşfet'}</span>
          </button>

          <a
            href="#character-results"
            className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 font-medium font-chakra tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filtrelere ve Listeye Geç</span>
          </a>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-500">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Popüler:
          </span>
          {['Rick Sanchez', 'Morty Smith', 'Summer Smith', 'Birdperson', 'Mr. Meeseeks', 'Evil Morty', 'Pickle Rick'].map((name) => (
            <button
              key={name}
              onClick={() => onQuickFilter(name)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
