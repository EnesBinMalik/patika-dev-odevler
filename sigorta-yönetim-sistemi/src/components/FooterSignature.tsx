import React from 'react';
import { Award, CheckCircle, Code, ShieldCheck, Heart } from 'lucide-react';

export const FooterSignature: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-200 text-indigo-700 flex items-center justify-center font-serif text-lg font-bold shrink-0">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-900">
                  Enes Öztürk İmzalı · El Emeği
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  %100 Ödev Şartname Uyumu
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sigorta Yönetim Sistemi · Java OOP Mimari & TreeSet Koleksiyon Projesi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Aggregation & Abstraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>TreeSet & Comparable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Checked Exception</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 Sigorta Yönetim Sistemi. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            <span>Enes Öztürk tarafından özenle kodlanmıştır</span>
            <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
