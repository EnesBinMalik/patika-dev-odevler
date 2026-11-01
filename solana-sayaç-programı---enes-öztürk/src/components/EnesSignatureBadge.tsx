import React from 'react';
import { Award, ShieldCheck, Check } from 'lucide-react';

export const EnesSignatureBadge: React.FC = () => {
  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Solana Native Program Ödevi: Enes Öztürk
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Doğrulanmış Çözüm
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Adım 1 (u32 enum parametreleri), Adım 2 (unpack deserialization) ve Adım 3 (u32 underflow korumalı azaltma) gereksinimleri eksiksiz tamamlanmıştır.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>3/3 Adım Hazır</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Underflow Koruması</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Borsh & u32 Uyumlu</span>
        </div>
      </div>
    </div>
  );
};
