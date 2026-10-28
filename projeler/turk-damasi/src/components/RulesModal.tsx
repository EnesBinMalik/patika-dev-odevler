/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, ShieldAlert, Award, Compass, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { closeRulesModal } from '../store/damaSlice';

export const RulesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isRulesModalOpen } = useAppSelector((state) => state.dama);

  if (!isRulesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#20140d] border border-[#502e1c] text-[#f4ecd8] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#3d2417] flex items-center justify-between bg-[#190e07]">
          <div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#fde047] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#d97706]" />
              Türk Daması Oyun Kuralları
            </h2>
            <p className="text-xs text-[#a88d6c] mt-0.5">
              Yüzyılların geleneksel zeka sporu · Resmi kurallar
            </p>
          </div>
          <button
            onClick={() => dispatch(closeRulesModal())}
            className="p-1.5 rounded-lg text-[#a88d6c] hover:text-white hover:bg-[#341b10] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#d6c2ab] leading-relaxed">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-[#29170e]/70 border border-[#3d2417]">
            <h3 className="font-semibold text-[#fde047] flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              1. Diziliş ve Tahta
            </h3>
            <p>
              Oyun 8x8 (64 kare) tahtada oynanır ve tüm kareler kullanılır (çapraz oynanmaz).
              Beyazın 16 taşı 6. ve 7. sıralara, Siyahın 16 taşı ise 2. ve 3. sıralara dizilir.
              Her iki tarafın 1. ve 8. en arka sıraları ile ortadaki iki sıra başlangıçta boştur.
              Oyuna daima <strong>Beyaz</strong> başlar.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-[#29170e]/70 border border-[#3d2417]">
            <h3 className="font-semibold text-[#fde047] flex items-center gap-2 mb-1.5">
              <Compass className="w-4 h-4 text-[#38bdf8]" />
              2. Yoz (Sıradan) Taşların Hareketi
            </h3>
            <p>
              Taşlar boş bir kareye yalnızca <strong>1 adım ileri, sağa veya sola</strong> gidebilir.
              Yoz taşlar kesinlikle <strong>çapraz</strong> veya <strong>geriye</strong> hareket edemez.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-[#29170e]/70 border border-[#3d2417]">
            <h3 className="font-semibold text-[#fde047] flex items-center gap-2 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
              3. Taş Yeme ve "En Çok Taş Yeme" Mecburiyeti
            </h3>
            <p>
              Önündeki, sağındaki veya solundaki rakip taşın hemen arkasındaki kare boşsa, taş üzerinden atlayarak onu yer.
              <strong> Taş yemek zorunludur!</strong> Birden fazla taş yeme imkanı olduğunda,
              oyuncu <strong>en fazla sayıda taş yiyebileceği rotayı</strong> oynamak mecburiyetindedir.
              Yenen taşlar zincirleme hamle esnasında derhal tahtadan kaldırılır.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-xl bg-[#29170e]/70 border border-[#3d2417]">
            <h3 className="font-semibold text-[#fde047] flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#eab308]" />
              4. Dama Olma ve Uçan Dama Yetkisi
            </h3>
            <p>
              Rakibin en arka sırasına (Beyaz için 8. sıra, Siyah için 1. sıra) ulaşan taş <strong>Dama</strong> unvanı kazanır.
              Dama taşı, satrançtaki kale gibi 4 ana yönde (ileri, geri, sağ, sol) sınırsız boş kare boyunca kayabilir ve uzaktaki taşları yiyip arkasındaki dilediği boş kareye konabilir.
              Eğer bir taş yeme serisi sırasında son sıraya varırsa o tur hamlesi biter ve dama olur; damalık yetkisini sonraki turunda kullanır.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="p-3.5 rounded-xl bg-[#29170e]/70 border border-[#3d2417]">
            <h3 className="font-semibold text-[#fde047] flex items-center gap-2 mb-1.5">
              <Award className="w-4 h-4 text-[#a855f7]" />
              5. Galibiyet Koşulları
            </h3>
            <p>
              Rakibin tüm taşlarını toplayan oyuncu kazanır. Ayrıca, rakip taşları henüz bitmemiş olsa dahi,
              sırası gelen oyuncunun yapabileceği hiçbir yasal hamle kalmamışsa (<strong>Abluka / Kilitleme</strong>),
              oyuncu oyunu kaybeder.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#3d2417] bg-[#190e07] flex justify-end">
          <button
            onClick={() => dispatch(closeRulesModal())}
            className="px-5 py-2 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white font-medium text-xs tracking-wide transition-colors"
          >
            Anladım, Oyuna Dön
          </button>
        </div>
      </div>
    </div>
  );
};
