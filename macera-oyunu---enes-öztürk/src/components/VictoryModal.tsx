import { Trophy, Award, Sparkles, CheckCircle2, RotateCcw, Heart, Coins, Swords, Shield } from 'lucide-react';
import { Character, Inventory } from '../types/game';

interface VictoryModalProps {
  player: Character;
  inventory: Inventory;
  onRestart: () => void;
}

export function VictoryModal({ player, inventory, onRestart }: VictoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Tebrikler! Tüm Görevler Tamamlandı
        </div>

        <h2 className="font-serif font-black text-3xl sm:text-4xl text-amber-100 mb-2">
          OYUNU KAZANDINIZ!
        </h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6">
          Mağara, Orman ve Nehir bölgelerindeki tüm canavarları dize getirdiniz. Yemek, Odun ve Su
          ödüllerini toplayarak Güvenli Ev'e sağ salim ulaştınız!
        </p>

        {/* Relic Badges */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Yemek (Mağara)</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Odun (Orman)</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Su (Nehir)</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-left">
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Maceracı</div>
            <div className="font-bold text-xs text-slate-200 truncate">{player.name}</div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Toplam Altın</div>
            <div className="font-bold text-xs text-amber-300 font-mono">{player.money} Para</div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Öldürülen Yılan</div>
            <div className="font-bold text-xs text-purple-300 font-mono">
              {inventory.totalSnakesKilled || 0} Adet
            </div>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase">Son Teçhizat</div>
            <div className="font-bold text-xs text-cyan-300 truncate">
              {inventory.weapon.name} / {inventory.armor.name}
            </div>
          </div>
        </div>

        {/* Developer Certificate Signature */}
        <div className="border-t border-slate-800 pt-4 mb-6">
          <div className="text-xs text-slate-400">
            Java 102 Macera Oyunu Özel Sürümü
          </div>
          <div className="font-serif font-semibold text-sm text-amber-300 mt-0.5">
            Geliştirici & İmza: Enes Öztürk
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeni Macera Başlat</span>
        </button>
      </div>
    </div>
  );
}
