import React from 'react';
import { X, Heart, Trash2, Eye } from 'lucide-react';
import { Character } from '../types/rickAndMorty';
import { playClickSound, playZapSound } from '../utils/audioEffects';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Character[];
  onSelectCharacter: (char: Character) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectCharacter,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0b0f19] border border-pink-500/40 rounded-3xl shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Heart className="w-5 h-5 fill-pink-500" />
            </div>
            <div>
              <h3 className="font-chakra text-lg font-bold text-white flex items-center gap-2">
                Favori Karakterlerim
                <span className="text-xs font-mono-code px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  {favorites.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tarayıcınızda kayıtlı tutulan özel karakter listeniz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  playZapSound();
                  onClearAll();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-950/40 transition flex items-center gap-1 cursor-pointer"
                title="Tümünü Temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-slate-300 font-medium">Henüz favori karakter eklemediniz</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Karakter kartlarındaki veya detay penceresindeki kalp butonuna tıklayarak favorilerinize ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition group"
                >
                  <div
                    onClick={() => {
                      playClickSound();
                      onSelectCharacter(char);
                      onClose();
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-chakra font-bold text-white group-hover:text-pink-300 transition truncate text-sm">
                        {char.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono-code truncate">
                        {char.species} • {char.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectCharacter(char);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Detay Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onRemoveFavorite(char.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                      title="Favoriden Çıkar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
