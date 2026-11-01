import { useState } from 'react';
import {
  Home,
  ShoppingBag,
  Skull,
  Ghost,
  PawPrint,
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { LOCATIONS, LocationConfig } from '../data/gameData';
import { Inventory, LocationId } from '../types/game';
import { sound } from '../utils/audio';

interface GameDashboardProps {
  inventory: Inventory;
  onEnterLocation: (location: LocationConfig) => void;
  onRestInSafeHouse: () => void;
  onOpenStore: () => void;
}

export function GameDashboard({
  inventory,
  onEnterLocation,
  onRestInSafeHouse,
  onOpenStore,
}: GameDashboardProps) {
  const [hoveredLocation, setHoveredLocation] = useState<LocationId | null>(null);

  const isLocationCleared = (id: LocationId) => {
    return inventory.clearedLocations.includes(id);
  };

  const hasYemek = inventory.awards.includes('YEMEK');
  const hasOdun = inventory.awards.includes('ODUN');
  const hasSu = inventory.awards.includes('SU');
  const allAwardsCollected = hasYemek && hasOdun && hasSu;

  const getLocationIcon = (id: LocationId) => {
    switch (id) {
      case 'SAFE_HOUSE':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'TOOL_STORE':
        return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
      case 'CAVE':
        return <Skull className="w-5 h-5 text-emerald-400" />;
      case 'FOREST':
        return <Ghost className="w-5 h-5 text-purple-400" />;
      case 'RIVER':
        return <PawPrint className="w-5 h-5 text-blue-400" />;
      case 'MINE':
        return <Sparkles className="w-5 h-5 text-orange-400" />;
    }
  };

  const handleCardClick = (loc: LocationConfig) => {
    if (loc.id === 'SAFE_HOUSE') {
      sound.playHeal();
      onRestInSafeHouse();
      return;
    }

    if (loc.id === 'TOOL_STORE') {
      sound.playCoin();
      onOpenStore();
      return;
    }

    if (isLocationCleared(loc.id)) {
      // Locked, cannot re-enter!
      return;
    }

    sound.playInitiative();
    onEnterLocation(loc);
  };

  return (
    <div className="space-y-6">
      {/* Objective Notice Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
              Maceracı Görevi: 3 Bölge Ödülünü Topla & Güvenli Ev'e Dön
            </h3>
            <p className="text-xs text-slate-300">
              Mağara (Yemek), Orman (Odun) ve Nehir (Su) bölgelerindeki düşmanları temizle. Maden'de yılanları yenerek eşsiz ganimetler kazan!
            </p>
          </div>
        </div>

        {allAwardsCollected ? (
          <button
            onClick={() => {
              sound.playHeal();
              onRestInSafeHouse();
            }}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 whitespace-nowrap animate-bounce flex items-center gap-1.5"
          >
            <span>Güvenli Ev'e Dön & Oyunu Kazan!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 whitespace-nowrap">
            Kalan Ödüller: {3 - inventory.awards.length} adet
          </div>
        )}
      </div>

      {/* Locations Grid (6 Regions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LOCATIONS.map((loc) => {
          const cleared = isLocationCleared(loc.id);
          const isSafeHouse = loc.id === 'SAFE_HOUSE';
          const isStore = loc.id === 'TOOL_STORE';
          const isMine = loc.id === 'MINE';

          return (
            <div
              key={loc.id}
              onMouseEnter={() => setHoveredLocation(loc.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => handleCardClick(loc)}
              className={`group relative rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                cleared
                  ? 'bg-slate-950/70 border-slate-800/80 opacity-75 cursor-not-allowed'
                  : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/10 cursor-pointer hover:-translate-y-1'
              }`}
            >
              {/* Top Image Preview with Scrim */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <img
                  src={loc.image}
                  alt={loc.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    cleared ? 'grayscale opacity-40' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Location Badges / Status */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 text-xs font-medium">
                    {getLocationIcon(loc.id)}
                    <span className="text-slate-200">{loc.name}</span>
                  </div>

                  {cleared ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold">
                      <Lock className="w-3 h-3" /> TEMİZLENDİ
                    </span>
                  ) : isSafeHouse ? (
                    <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-medium">
                      Güvenli Bölge
                    </span>
                  ) : isStore ? (
                    <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-medium">
                      Ticaret
                    </span>
                  ) : isMine ? (
                    <span className="px-2.5 py-1 rounded-md bg-orange-950/80 border border-orange-500/40 text-orange-300 text-[11px] font-medium">
                      Ganimet Madeni
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] font-medium">
                      Savaş Alanı
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-serif font-bold text-lg text-slate-100 group-hover:text-amber-200 transition-colors">
                      {loc.name}
                    </h4>
                    {loc.award && (
                      <span className="text-[11px] font-mono text-emerald-400">
                        Ödül: {loc.award === 'YEMEK' ? 'Yemek' : loc.award === 'ODUN' ? 'Odun' : 'Su'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{loc.description}</p>
                </div>

                {/* Footer specs / Action button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {cleared ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Ödül alındı, tekrar girilemez</span>
                    </div>
                  ) : isSafeHouse ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-amber-400">Canını %100 Yenile</span>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 border border-amber-500/30">
                        <span>Dinlen</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isStore ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-cyan-400">Silah & Zırh Satın Al</span>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 border border-cyan-500/30">
                        <span>Dükkana Gir</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isMine ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="text-[11px] text-orange-400 flex items-center gap-1">
                        <span>Yılan (1-5)</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">Ganimet Şansı</span>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20">
                        <span>Madene İn</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="text-[11px] text-red-400 flex items-center gap-1">
                        <span>{loc.monsterConfig?.name}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{loc.minMonsters}-{loc.maxMonsters} Adet</span>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20">
                        <span>Savaşa Başla</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
