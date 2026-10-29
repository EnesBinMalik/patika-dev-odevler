import React from 'react';
import { Heart, MapPin, Compass, Tv, Eye } from 'lucide-react';
import { Character } from '../types/rickAndMorty';
import { playClickSound } from '../utils/audioEffects';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  isFavorite: boolean;
  onToggleFavorite: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return {
          label: 'Yaşıyor (Alive)',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        };
      case 'dead':
        return {
          label: 'Ölü (Dead)',
          dot: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        };
      default:
        return {
          label: 'Bilinmiyor',
          dot: 'bg-slate-400',
          bg: 'bg-slate-900/80 text-slate-300 border-slate-700',
        };
    }
  };

  const statusInfo = getStatusBadge(character.status);

  return (
    <div
      onClick={() => {
        playClickSound();
        onSelect(character);
      }}
      className="group relative bg-[#0c121e] hover:bg-[#101828] border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 glow-card glow-card-hover cursor-pointer flex flex-col"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={character.image}
          alt={character.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c121e] via-transparent to-black/30 pointer-events-none" />

        {/* Status Pill on top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md"
             style={{}}
        >
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${statusInfo.bg} border backdrop-blur-md`}>
            <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
            <span className="text-[11px] font-medium">{statusInfo.label}</span>
          </div>
        </div>

        {/* Favorite Button on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            onToggleFavorite(character);
          }}
          title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          aria-label="Favori Ekle"
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 hover:border-pink-500/60 text-slate-300 hover:text-pink-400 backdrop-blur-md transition shadow-md cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorite
                ? 'fill-pink-500 text-pink-500 scale-110'
                : 'text-slate-300 hover:text-pink-400'
            }`}
          />
        </button>

        {/* ID Badge on bottom right */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-slate-700/60 text-[10px] font-mono-code text-slate-400">
          #{character.id}
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Character Name */}
          <h3 className="font-chakra text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
            {character.name}
          </h3>

          {/* Species and Gender tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono-code text-emerald-300">
              {character.species}
            </span>
            {character.type && (
              <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-[11px] font-mono-code text-teal-300 max-w-[120px] truncate" title={character.type}>
                {character.type}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono-code text-slate-300">
              {character.gender}
            </span>
          </div>

          {/* Location details */}
          <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Son Konum</span>
                <span className="text-slate-200 truncate block font-medium">
                  {character.location?.name || 'Bilinmiyor'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Köken (Origin)</span>
                <span className="text-slate-300 truncate block">
                  {character.origin?.name || 'Bilinmiyor'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & action button */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-slate-400 font-mono-code">
            <Tv className="w-3.5 h-3.5 text-lime-400" />
            <span>{character.episode?.length || 0} Bölüm</span>
          </span>

          <span className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-0.5 transition-transform font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>İncele</span>
          </span>
        </div>
      </div>
    </div>
  );
};
