import React from 'react';
import { Award, Code2, BookOpen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Project title and attribution */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-bold text-white tracking-tight">
                Java 102 — Kitap Listesi &amp; Stream API Ödevi
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Book sınıfı, ArrayList koleksiyonu, Stream to Map dönüşümü ve Predicate sayfa filtreleme çözümü.
            </p>
          </div>

          {/* Right: Signature badge */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 text-center sm:text-right">
              <div className="text-[11px] text-amber-400 font-semibold flex items-center justify-center sm:justify-end gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Geliştirici &amp; İmza:</span>
              </div>
              <div className="text-sm font-extrabold text-white tracking-wide mt-0.5">
                Enes Öztürk
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Enes Öztürk · Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span>Java 8+ Stream API</span>
            <span>·</span>
            <span>Lambda Expressions</span>
            <span>·</span>
            <span>Clean Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
