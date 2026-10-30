import React from 'react';
import { Radio, Heart, ShieldCheck, Github, Code, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                EtkinlikHub Realtime
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ödev 5
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gerçek zamanlı etkinlik listeleme ve anlık katılımcı takibi
              </p>
            </div>
          </div>

          {/* Enes Öztürk signature pill */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow">
              EÖ
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-indigo-400">Geliştirici İmzası</div>
              <div className="text-sm font-bold text-white">Enes Öztürk</div>
              <div className="text-[11px] text-slate-400">enesbino38@gmail.com</div>
            </div>
            <div className="ml-2 pl-3 border-l border-slate-800 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Doğrulandı</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Enes Öztürk. Tüm hakları saklıdır.</span>
            <span>•</span>
            <span className="text-slate-400">Ödev 5 Teslim Projesi</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Node.js WebSocket Engine</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">React 19 + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
