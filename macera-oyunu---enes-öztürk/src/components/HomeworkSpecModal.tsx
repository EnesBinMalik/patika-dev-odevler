import { useState } from 'react';
import { X, Check, Dices, Sparkles, Award, Shield, AlertCircle, Play } from 'lucide-react';
import { rollSnakeLoot } from '../utils/lootTable';

interface HomeworkSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeworkSpecModal({ isOpen, onClose }: HomeworkSpecModalProps) {
  const [simResults, setSimResults] = useState<{
    total: number;
    nothing: number;
    weapons: { total: number; rifle: number; sword: number; pistol: number };
    armors: { total: number; heavy: number; medium: number; light: number };
    money: { total: number; m10: number; m5: number; m1: number };
  } | null>(null);

  if (!isOpen) return null;

  const runSimulation = () => {
    const total = 1000;
    let nothing = 0;
    const weapons = { total: 0, rifle: 0, sword: 0, pistol: 0 };
    const armors = { total: 0, heavy: 0, medium: 0, light: 0 };
    const money = { total: 0, m10: 0, m5: 0, m1: 0 };

    for (let i = 0; i < total; i++) {
      const drop = rollSnakeLoot();
      if (drop.type === 'nothing') {
        nothing++;
      } else if (drop.type === 'weapon') {
        weapons.total++;
        if (drop.weapon?.name === 'Tüfek') weapons.rifle++;
        else if (drop.weapon?.name === 'Kılıç') weapons.sword++;
        else weapons.pistol++;
      } else if (drop.type === 'armor') {
        armors.total++;
        if (drop.armor?.name === 'Ağır Zırh') armors.heavy++;
        else if (drop.armor?.name === 'Orta Zırh') armors.medium++;
        else armors.light++;
      } else if (drop.type === 'money') {
        money.total++;
        if (drop.money === 10) money.m10++;
        else if (drop.money === 5) money.m5++;
        else money.m1++;
      }
    }

    setSimResults({ total, nothing, weapons, armors, money });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-100">
                Ödev Kriterleri & Uygulama Detayları
              </h2>
              <p className="text-xs text-slate-400">
                Java 102 Macera Oyunu · <span className="text-amber-400 font-semibold">Enes Öztürk İmzalı</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {/* Ödev 1 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                1
              </div>
              <h3 className="font-bold text-slate-100">
                Bölge Özel Ödülleri & Kilitlenme Mekanizması
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Savaş bölgelerindeki tüm düşmanlar temizlendikten sonra bölgeye özel ödül oyuncunun
              envanterine eklenir. Ödül kazanılan bölgeye tekrar giriş yapılamaz (kilitlenir). Tüm 3
              ödülü toplayıp Güvenli Ev'e dönen oyuncu oyunu kazanır.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400">Mağara Bölgesi</span>
                <div className="text-emerald-400 font-bold mt-0.5">➔ Yemek (Food)</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400">Orman Bölgesi</span>
                <div className="text-amber-400 font-bold mt-0.5">➔ Odun (Firewood)</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400">Nehir Bölgesi</span>
                <div className="text-blue-400 font-bold mt-0.5">➔ Su (Water)</div>
              </div>
            </div>
          </div>

          {/* Ödev 2 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h3 className="font-bold text-slate-100">
                %50 İlk Hamle (İnisiyatif) Şansı
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Oyuncu her canavarla karşılaştığında ilk vuruşu kimin yapacağı %50 şans (Math.random &lt; 0.5) ile
              belirlenir. Canavar kazanırsa ilk rauntta oyuncuya hamle sırası gelmeden önce ani vuruş yapar.
              Sonrasında sıra oyuncuya geçer.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
              <Dices className="w-4 h-4" />
              <span>Savaş başladığında yazı-tura zarı atılır ve savaş günlüğünde açıkça gösterilir.</span>
            </div>
          </div>

          {/* Ödev 3 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h3 className="font-bold text-slate-100">
                Maden Bölgesi & Yılan Ganimet Tablosu
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Yeni savaş bölgesi: <strong>Maden</strong>. Canavar: <strong>Yılan</strong> (1-5 adet, ID: 4, Hasar: 3-6 rastgele, Sağlık: 12, Para: Yok).
              Her yılan yenildiğinde aşağıdaki tam ihtimal tablosuna göre ganimet düşer:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs mb-4">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-slate-400">Boş Çıkma İhtimali</span>
                <div className="text-slate-200 font-bold mt-0.5">%45 Hiçbir Şey</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-orange-400 font-semibold">%15 Silah İhtimali</span>
                <div className="text-[11px] text-slate-300 mt-1 space-y-0.5">
                  <div>• %20 Tüfek</div>
                  <div>• %30 Kılıç</div>
                  <div>• %50 Tabanca</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-blue-400 font-semibold">%15 Zırh İhtimali</span>
                <div className="text-[11px] text-slate-300 mt-1 space-y-0.5">
                  <div>• %20 Ağır Zırh</div>
                  <div>• %30 Orta Zırh</div>
                  <div>• %50 Hafif Zırh</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-amber-400 font-semibold">%25 Para İhtimali</span>
                <div className="text-[11px] text-slate-300 mt-1 space-y-0.5">
                  <div>• %20 10 Para</div>
                  <div>• %30 5 Para</div>
                  <div>• %50 1 Para</div>
                </div>
              </div>
            </div>

            {/* Live simulation tool */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-400" /> 1.000 Yılan Ganimeti Simülasyonu
                </span>
                <button
                  onClick={runSimulation}
                  className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Simülasyonu Çalıştır
                </button>
              </div>

              {simResults ? (
                <div className="text-xs font-mono text-slate-300 space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="text-amber-300 font-bold">1.000 Yılan Ganimet Sonuçları:</div>
                  <div>Boş: {simResults.nothing} ({((simResults.nothing / 1000) * 100).toFixed(1)}% ~ Hedef: %45)</div>
                  <div>Silahlar: {simResults.weapons.total} ({((simResults.weapons.total / 1000) * 100).toFixed(1)}% ~ Hedef: %15) [Tüfek: {simResults.weapons.rifle}, Kılıç: {simResults.weapons.sword}, Tabanca: {simResults.weapons.pistol}]</div>
                  <div>Zırhlar: {simResults.armors.total} ({((simResults.armors.total / 1000) * 100).toFixed(1)}% ~ Hedef: %15) [Ağır: {simResults.armors.heavy}, Orta: {simResults.armors.medium}, Hafif: {simResults.armors.light}]</div>
                  <div>Para: {simResults.money.total} ({((simResults.money.total / 1000) * 100).toFixed(1)}% ~ Hedef: %25) [10p: {simResults.money.m10}, 5p: {simResults.money.m5}, 1p: {simResults.money.m1}]</div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Olasılık algoritmasının doğruluğunu canlı olarak test etmek için butona tıklayın.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Developer Signature */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-xs flex items-center justify-between">
          <div className="text-slate-400">
            Ödev Geliştiricisi: <span className="text-amber-300 font-semibold">Enes Öztürk</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
