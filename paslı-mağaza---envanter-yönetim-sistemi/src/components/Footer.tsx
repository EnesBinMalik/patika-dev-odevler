import React from 'react';
import { Heart, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">Paslı Mağaza</span>
          <span>·</span>
          <span>Envanter, Satış, Satın Alma & Kâr Yönetim Sistemi</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Geliştirici & Sistem Mimarı:</span>
          <strong className="text-orange-400 font-semibold font-mono">Enes Öztürk</strong>
          <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20 ml-1">
            İmzalı Sürüm
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Rust Edition 2021 · Type-Safe · Bellek Emniyetli
        </div>

      </div>
    </footer>
  );
};
