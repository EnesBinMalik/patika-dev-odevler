import React, { useEffect, useState } from 'react';
import { X, Heart, MapPin, Compass, Tv, Calendar, Dna, Activity, User, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { Character } from '../types/rickAndMorty';
import { fetchCharacterById } from '../services/rickAndMortyApi';
import { playClickSound, playPortalSound } from '../utils/audioEffects';

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (character: Character) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [fullData, setFullData] = useState<Character | null>(character);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    if (!character) {
      setFullData(null);
      return;
    }
    setFullData(character);
    playPortalSound();

    // Fetch full details (episodes with air date, full location details)
    let isCancelled = false;
    const loadFull = async () => {
      setLoadingDetails(true);
      try {
        const full = await fetchCharacterById(character.id);
        if (!isCancelled && full) {
          setFullData(full);
        }
      } catch (err) {
        console.error('Failed to load full character details', err);
      } finally {
        if (!isCancelled) {
          setLoadingDetails(false);
        }
      }
    };

    loadFull();

    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isCancelled = true;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [character, onClose]);

  if (!character) return null;

  const char = fullData || character;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return {
          label: 'Yaşıyor (Alive)',
          dot: 'bg-emerald-400 shadow-[0_0_12px_#34d399]',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
        };
      case 'dead':
        return {
          label: 'Ölü (Dead)',
          dot: 'bg-rose-500 shadow-[0_0_12px_#f43f5e]',
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
        };
      default:
        return {
          label: 'Bilinmiyor (Unknown)',
          dot: 'bg-slate-400',
          bg: 'bg-slate-900/80 text-slate-300 border-slate-700',
        };
    }
  };

  const statusInfo = getStatusBadge(char.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0b0f19] border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-950/50 z-10 flex flex-col">
        {/* Glow halo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-6 py-4 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono-code text-xs border border-emerald-500/30">
              C-137 ARŞİVİ #{char.id}
            </span>
            <span className="text-xs text-slate-400 font-mono-code hidden sm:inline">
              Interdimensional Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onToggleFavorite(char);
              }}
              title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-pink-400 transition cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`}
              />
            </button>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Top Banner: Image & Primary Dossier info */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <div className="relative shrink-0 w-full sm:w-56 aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-slate-950 mx-auto sm:mx-0 max-w-[240px]">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className={`px-2.5 py-1 rounded-lg ${statusInfo.bg} border flex items-center gap-2 text-xs font-semibold backdrop-blur-md`}>
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <h2 className="font-chakra text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {char.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  ID: #{char.id} • Evren Kayıt Veritabanı
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code font-semibold flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-emerald-400" />
                  Tür: {char.species}
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono-code font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  Cinsiyet: {char.gender}
                </span>

                {char.type && (
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code">
                    Alt Tip: {char.type}
                  </span>
                )}
              </div>

              {/* Dossier Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Son Bilinen Konum</span>
                  </div>
                  <div className="font-medium text-slate-200 text-sm">
                    {char.location?.name || 'Bilinmiyor'}
                  </div>
                  {char.location?.dimension && (
                    <div className="text-[11px] text-slate-400 font-mono-code mt-0.5">
                      Boyut: {char.location.dimension}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Köken (Origin)</span>
                  </div>
                  <div className="font-medium text-slate-200 text-sm">
                    {char.origin?.name || 'Bilinmiyor'}
                  </div>
                  {char.origin?.dimension && (
                    <div className="text-[11px] text-slate-400 font-mono-code mt-0.5">
                      Boyut: {char.origin.dimension}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Episode List Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-chakra text-base font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-lime-400" />
                <span>Yer Aldığı Bölümler</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono-code text-slate-300">
                  {char.episode?.length || 0} Bölüm
                </span>
              </h4>
              {loadingDetails && (
                <span className="text-xs text-emerald-400 font-mono-code animate-pulse">
                  Bölüm detayları yükleniyor...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {char.episode && char.episode.length > 0 ? (
                char.episode.map((ep) => (
                  <div
                    key={ep.id || ep.episode}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code font-bold text-[10px]">
                        {ep.episode}
                      </span>
                      {ep.air_date && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono-code">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {ep.air_date}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate" title={ep.name}>
                      {ep.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-slate-400">
                  Bu karakter için kayıtlı bölüm bulunamadı.
                </div>
              )}
            </div>
          </div>

          {/* Creator Signature in Modal Footer */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900/60 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Resmi Rick & Morty GraphQL Veritabanı Kaydı
              </span>
            </div>
            <div className="text-slate-400 font-chakra">
              Özel Geliştirme • <span className="text-emerald-300 font-bold">Enes Öztürk İmzalı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
