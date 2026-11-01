import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';
import { Character, Inventory } from '../types/game';

interface GameOverModalProps {
  player: Character;
  inventory: Inventory;
  onRestart: () => void;
}

export function GameOverModal({ player, inventory, onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Skull icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 shadow-xl shadow-red-950/40">
          <Skull className="w-8 h-8" />
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-red-200 mb-2">
          ÖLDÜNÜZ!
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6">
          Savaş alanında canınız tükendi. Güvenli Ev'e zamanında dönüp dinlenmeli veya mağazadan
          daha güçlü zırhlar edinmeliydiniz.
        </p>

        {/* Stats */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-6 text-xs text-left space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Maceracı:</span>
            <span className="text-slate-200 font-bold">{player.name}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Toplanan Ödüller:</span>
            <span className="text-amber-300 font-mono">{inventory.awards.length} / 3</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Kazanılan Altın:</span>
            <span className="text-amber-300 font-mono">{player.money} Para</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Öldürülen Yılan:</span>
            <span className="text-purple-300 font-mono">{inventory.totalSnakesKilled || 0}</span>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="text-[11px] text-slate-500 mb-6">
          Macera Oyunu · Geliştirici: Enes Öztürk
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeniden Dene</span>
        </button>
      </div>
    </div>
  );
}
