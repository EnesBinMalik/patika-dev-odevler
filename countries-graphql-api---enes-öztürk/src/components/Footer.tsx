import React from 'react';
import { Globe, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Project & Author info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
              <Globe className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Proje 1 - Countries GraphQL API</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  v1.0.0 Ready
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Geliştirici: <span className="text-pink-400 font-semibold">Enes Öztürk</span> imzasıyla hazırlanmıştır.
              </div>
            </div>
          </div>

          {/* Center: Requirement checklist indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tüm & Tekil Ülkeler</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tüm & Tekil Kıtalar</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tüm & Tekil Diller</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>İlişkisel Çift Yönlü Şema</span>
            </div>
          </div>

          {/* Right: Signature */}
          <div className="text-xs text-right">
            <div className="text-slate-400">
              İmza:{' '}
              <span className="font-semibold text-white tracking-wide underline decoration-pink-500 underline-offset-4">
                Enes Öztürk
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              GraphQL • Node.js / Express • TypeScript
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
