import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenRubric: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRubric }) => {
  return (
    <footer id="signature-section" className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      {/* Signature Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/80 rounded-2xl p-6 md:p-8 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/src/assets/images/enes_ozturk_avatar_1793255787112.jpg"
                alt="Enes Öztürk"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/30"
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Geliştirici İmzası & Onay Mührü
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                ENES ÖZTÜRK
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ödev 6 · Yeni Etkinlik Ekleme Formu & Gerçek Zamanlı Listeleme Mimarisi
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenRubric}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gereksinimleri Denetle</span>
            </button>
            <div className="px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-900/60 rounded-xl border border-slate-700 font-mono">
              enesbino38@gmail.com
            </div>
          </div>
        </div>

        {/* Bottom Credits & Rubric Summary */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 Etkinlik Portalı</span>
            <span aria-hidden="true">·</span>
            <span>Ödev 6 Kapsamında Hazırlanmıştır</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-medium">İmza: ENES ÖZTÜRK</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Modern React & Tailwind CSS ile kodlandı</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
