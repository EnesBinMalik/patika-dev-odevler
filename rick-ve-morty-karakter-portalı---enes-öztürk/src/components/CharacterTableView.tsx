import React from 'react';
import { Eye, Heart, MapPin } from 'lucide-react';
import { Character } from '../types/rickAndMorty';
import { playClickSound } from '../utils/audioEffects';

interface CharacterTableViewProps {
  characters: Character[];
  onSelect: (character: Character) => void;
  favorites: Character[];
  onToggleFavorite: (character: Character) => void;
}

export const CharacterTableView: React.FC<CharacterTableViewProps> = ({
  characters,
  onSelect,
  favorites,
  onToggleFavorite,
}) => {
  const isFav = (id: string) => favorites.some((f) => f.id === id);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0c121e]/90 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th scope="col" className="px-4 py-3.5 w-14">#ID</th>
            <th scope="col" className="px-4 py-3.5">Karakter</th>
            <th scope="col" className="px-4 py-3.5">Durum</th>
            <th scope="col" className="px-4 py-3.5">Tür & Cinsiyet</th>
            <th scope="col" className="px-4 py-3.5">Konum</th>
            <th scope="col" className="px-4 py-3.5">Köken</th>
            <th scope="col" className="px-4 py-3.5 text-center">Bölümler</th>
            <th scope="col" className="px-4 py-3.5 text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-medium">
          {characters.map((char) => {
            const fav = isFav(char.id);
            return (
              <tr
                key={char.id}
                onClick={() => {
                  playClickSound();
                  onSelect(char);
                }}
                className="hover:bg-slate-800/50 transition cursor-pointer group"
              >
                <td className="px-4 py-3 font-mono-code text-xs text-slate-400">
                  #{char.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-emerald-400 transition"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-chakra font-bold text-white group-hover:text-emerald-300 transition">
                        {char.name}
                      </div>
                      {char.type && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {char.type}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      char.status.toLowerCase() === 'alive'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : char.status.toLowerCase() === 'dead'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        char.status.toLowerCase() === 'alive'
                          ? 'bg-emerald-400'
                          : char.status.toLowerCase() === 'dead'
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    {char.status === 'Alive'
                      ? 'Yaşıyor'
                      : char.status === 'Dead'
                      ? 'Ölü'
                      : 'Bilinmiyor'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs">
                    <span className="text-emerald-300 font-mono-code">{char.species}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-400">{char.gender}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-slate-300 max-w-[180px] truncate">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{char.location?.name || 'Bilinmiyor'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-400 max-w-[160px] truncate">
                    {char.origin?.name || 'Bilinmiyor'}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono-code text-xs">
                    {char.episode?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        onToggleFavorite(char);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-pink-400 transition"
                      title={fav ? 'Favoriden Çıkar' : 'Favoriye Ekle'}
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelect(char);
                      }}
                      className="p-1.5 rounded-lg hover:bg-emerald-950/60 text-slate-400 hover:text-emerald-300 transition"
                      title="Detay Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
