import React from 'react';
import { Heart, ExternalLink, ShieldCheck, Terminal, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Signature Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center font-bold text-slate-950 text-base shadow-md shadow-amber-500/10 ring-1 ring-white/10">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Enes Öztürk</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Ödev İmzası Onaylandı
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Rust Enumlar ve Desen Eşleştirme Hesap Makinesi Görevi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Enes Öztürk &copy; {new Date().getFullYear()}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Rust 2021 Edition</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Informative Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://doc.rust-lang.org/book/ch06-00-enums.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>The Rust Book: Enums & Match</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://doc.rust-lang.org/rust-by-example/custom_types/enum.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Rust By Example: Enums</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://play.rust-lang.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Official Rust Playground</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            Öğrenciler için hazırlanmış interaktif ve eğitici simülasyon ortamı
          </div>
        </div>

      </div>
    </footer>
  );
};
