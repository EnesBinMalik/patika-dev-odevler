import React from 'react';
import { Cloud, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand Signature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold tracking-tight text-sm">
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>Enes Öztürk · Profesyonel Meteoroloji Platformu</span>
            </div>
            <p className="text-xs text-slate-400">
              Türkiye'nin 81 ili için React Context API mimarisiyle geliştirilmiş gerçek zamanlı hava durumu sistemi.
            </p>
          </div>

          {/* Status & Credits */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gerçek Zamanlı WMO Meteoroloji Verisi</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Tasarım ve Geliştirme:</span>
              <strong className="text-sky-400 font-semibold">Enes Öztürk</strong>
            </div>
          </div>
        </div>

        {/* Bottom Hairline */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Enes Öztürk. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span>Türkiye 81 İl Raporu</span>
            <span>·</span>
            <span>7 Günlük Süreç</span>
            <span>·</span>
            <span>Context API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
