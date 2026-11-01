import { Heart, Coins, Shield as ShieldIcon, Sword as SwordIcon, Apple, Flame, Droplets, Trophy } from 'lucide-react';
import { Character, Inventory } from '../types/game';

interface PlayerHUDProps {
  player: Character;
  inventory: Inventory;
  onOpenInventoryModal?: () => void;
}

export function PlayerHUD({ player, inventory }: PlayerHUDProps) {
  const totalDamage = player.damage + inventory.weapon.damage;
  const healthPercent = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));

  const hasYemek = inventory.awards.includes('YEMEK');
  const hasOdun = inventory.awards.includes('ODUN');
  const hasSu = inventory.awards.includes('SU');
  const allAwardsCollected = hasYemek && hasOdun && hasSu;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Hero Identity & Health */}
        <div className="md:col-span-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-amber-200">{player.name}</span>
              <span className="text-xs text-slate-400">({player.title})</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-red-400">
              <Heart className="w-3.5 h-3.5 fill-red-400" />
              <span>{player.health} / {player.maxHealth} HP</span>
            </div>
          </div>
          {/* Health Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                healthPercent > 50
                  ? 'bg-emerald-500'
                  : healthPercent > 25
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* Stats Grid: Damage, Armor, Money */}
        <div className="md:col-span-4 flex items-center justify-around sm:justify-center sm:gap-6 py-1 border-y md:border-y-0 md:border-x border-slate-800">
          {/* Attack */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <SwordIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Hasar</div>
              <div className="text-sm font-bold font-mono text-orange-200">
                {totalDamage}
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({player.damage}+{inventory.weapon.damage})
                </span>
              </div>
            </div>
          </div>

          {/* Armor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Zırh</div>
              <div className="text-sm font-bold font-mono text-blue-200">
                +{inventory.armor.block}
                <span className="text-xs text-slate-400 font-normal ml-1 truncate max-w-[70px] inline-block align-bottom">
                  {inventory.armor.name}
                </span>
              </div>
            </div>
          </div>

          {/* Money */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Altın</div>
              <div className="text-sm font-bold font-mono text-amber-200">{player.money} Para</div>
            </div>
          </div>
        </div>

        {/* Quest Relics (Ödev 1: Bölge Ödülleri) */}
        <div className="md:col-span-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Kazanma Koşulu Ödülleri:</span>
            {allAwardsCollected ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <Trophy className="w-3.5 h-3.5" /> Güvenli Ev'e Git!
              </span>
            ) : (
              <span className="text-amber-400/90 font-mono text-[11px]">
                {inventory.awards.length}/3 Toplandı
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Yemek (Mağara) */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
                hasYemek
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
              title={hasYemek ? 'Yemek toplandı (Mağara temizlendi)' : 'Mağara temizlenerek kazanılır'}
            >
              <Apple className={`w-3.5 h-3.5 ${hasYemek ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div className="flex flex-col">
                <span className="font-medium text-[11px] leading-tight">Yemek</span>
                <span className="text-[9px] text-slate-400">Mağara</span>
              </div>
            </div>

            {/* Odun (Orman) */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
                hasOdun
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
              title={hasOdun ? 'Odun toplandı (Orman temizlendi)' : 'Orman temizlenerek kazanılır'}
            >
              <Flame className={`w-3.5 h-3.5 ${hasOdun ? 'text-amber-400' : 'text-slate-600'}`} />
              <div className="flex flex-col">
                <span className="font-medium text-[11px] leading-tight">Odun</span>
                <span className="text-[9px] text-slate-400">Orman</span>
              </div>
            </div>

            {/* Su (Nehir) */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
                hasSu
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}
              title={hasSu ? 'Su toplandı (Nehir temizlendi)' : 'Nehir temizlenerek kazanılır'}
            >
              <Droplets className={`w-3.5 h-3.5 ${hasSu ? 'text-blue-400' : 'text-slate-600'}`} />
              <div className="flex flex-col">
                <span className="font-medium text-[11px] leading-tight">Su</span>
                <span className="text-[9px] text-slate-400">Nehir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
