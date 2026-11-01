import { useState } from 'react';
import { X, Sword, Shield, Coins, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { INITIAL_WEAPONS, INITIAL_ARMORS } from '../data/gameData';
import { Weapon, Armor, Inventory } from '../types/game';
import { sound } from '../utils/audio';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerMoney: number;
  inventory: Inventory;
  onBuyWeapon: (weapon: Weapon) => void;
  onBuyArmor: (armor: Armor) => void;
}

export function StoreModal({
  isOpen,
  onClose,
  playerMoney,
  inventory,
  onBuyWeapon,
  onBuyArmor,
}: StoreModalProps) {
  const [tab, setTab] = useState<'weapons' | 'armors'>('weapons');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const weaponsList = [
    INITIAL_WEAPONS.PISTOL,
    INITIAL_WEAPONS.SWORD,
    INITIAL_WEAPONS.RIFLE,
  ];

  const armorsList = [
    INITIAL_ARMORS.LIGHT,
    INITIAL_ARMORS.MEDIUM,
    INITIAL_ARMORS.HEAVY,
  ];

  const handleBuyWeapon = (w: Weapon) => {
    if (inventory.weapon.id === w.id) {
      setFeedback('Bu silah zaten kuşanılmış durumda!');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }
    if (playerMoney < w.price) {
      setFeedback('Yetersiz altın! Daha fazla düşman yenmelisiniz.');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }
    sound.playCoin();
    onBuyWeapon(w);
    setFeedback(`${w.name} başarıyla satın alındı ve kuşandı!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleBuyArmor = (a: Armor) => {
    if (inventory.armor.id === a.id) {
      setFeedback('Bu zırh zaten kuşanılmış durumda!');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }
    if (playerMoney < a.price) {
      setFeedback('Yetersiz altın! Daha fazla düşman yenmelisiniz.');
      setTimeout(() => setFeedback(null), 2500);
      return;
    }
    sound.playCoin();
    onBuyArmor(a);
    setFeedback(`${a.name} başarıyla satın alındı ve kuşandı!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-100">Eşya Dükkanı (Mağaza)</h2>
              <p className="text-xs text-slate-400">Silah ve zırh teçhizatları ile gücüne güç kat</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{playerMoney} Para</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-center justify-between animate-fade-in">
            <span>{feedback}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setTab('weapons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'weapons'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>Silahlar (Hasar)</span>
          </button>
          <button
            onClick={() => setTab('armors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'armors'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Zırhlar (Engelleme)</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {tab === 'weapons' ? (
            <div className="space-y-3">
              {weaponsList.map((w) => {
                const isEquipped = inventory.weapon.id === w.id;
                const canAfford = playerMoney >= w.price;
                return (
                  <div
                    key={w.id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isEquipped
                        ? 'bg-slate-950/80 border-emerald-500/50'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                        <Sword className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100">{w.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-orange-950/50 text-orange-300 font-mono border border-orange-500/30">
                            +{w.damage} Hasar
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{w.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-amber-300 flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{w.price} Para</span>
                        </div>
                      </div>

                      {isEquipped ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                          <Check className="w-3.5 h-3.5" /> Kuşanıldı
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyWeapon(w)}
                          disabled={!canAfford}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>Satın Al</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {armorsList.map((a) => {
                const isEquipped = inventory.armor.id === a.id;
                const canAfford = playerMoney >= a.price;
                return (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isEquipped
                        ? 'bg-slate-950/80 border-emerald-500/50'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100">{a.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 font-mono border border-blue-500/30">
                            +{a.block} Engelleme
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{a.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-amber-300 flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{a.price} Para</span>
                        </div>
                      </div>

                      {isEquipped ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                          <Check className="w-3.5 h-3.5" /> Kuşanıldı
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyArmor(a)}
                          disabled={!canAfford}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            canAfford
                              ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-md shadow-blue-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>Satın Al</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Kuşanılan eşyalar otomatik olarak yenisiyle değişir.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
