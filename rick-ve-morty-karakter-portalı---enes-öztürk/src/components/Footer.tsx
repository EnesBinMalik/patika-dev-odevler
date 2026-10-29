import React from 'react';
import { Sparkles, Terminal, Award, Heart, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-emerald-500/20 bg-[#04070c] relative overflow-hidden">
      {/* Subtle bottom portal ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800/80 pb-10">
          {/* Col 1: Logo & Brief */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="text-2xl">🧪</span>
              <span className="font-chakra text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                RICK & MORTY ARCHIVES
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Rick and Morty evrenindeki tüm karakterleri, konumları ve boyutları listeleyen, arayan ve filtreleyen GraphQL destekli web uygulaması.
            </p>
          </div>

          {/* Col 2: Prominent Signature Card - ENES ÖZTÜRK */}
          <div className="flex justify-center">
            <div className="relative group p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#0a0f18] border border-emerald-400/40 shadow-xl shadow-emerald-950/40 text-center max-w-xs w-full">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 opacity-20 group-hover:opacity-40 transition blur-sm" />
              <div className="relative">
                <div className="inline-flex p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mb-2 border border-emerald-500/30">
                  <Award className="w-5 h-5 text-lime-400" />
                </div>
                <div className="text-[11px] font-mono-code uppercase tracking-widest text-slate-400 mb-1">
                  Özel Proje İmzası
                </div>
                <div className="font-chakra text-lg sm:text-xl font-extrabold tracking-wider text-white">
                  ENES ÖZTÜRK
                </div>
                <div className="text-xs text-emerald-300 font-medium mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>Proje 2: Tamamlanmış Sürüm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Tech Stack */}
          <div className="space-y-3 text-center md:text-right">
            <div className="text-xs font-mono-code uppercase tracking-wider text-slate-400 flex items-center justify-center md:justify-end gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Teknoloji Yığını</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-mono-code">
                React 19
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-teal-300 font-mono-code">
                TypeScript
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-pink-300 font-mono-code">
                GraphQL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono-code">
                Tailwind CSS
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Backend:{' '}
              <a
                href="https://rickandmortyapi.com/graphql"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400 underline transition"
              >
                rickandmortyapi.com/graphql
              </a>
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Rick ve Morty Karakter Portalı • Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-1 font-mono-code">
            <span>Geliştirici:</span>
            <span className="text-emerald-400 font-semibold font-chakra">Enes Öztürk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
