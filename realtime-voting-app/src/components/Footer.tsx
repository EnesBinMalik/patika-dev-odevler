import React from 'react';
import { Heart, Radio, Github, Code2, RotateCcw } from 'lucide-react';

interface FooterProps {
  onResetData: () => Promise<void>;
  isResetting: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onResetData, isResetting }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30">
              EÖ
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-white">Realtime Voting App</span>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                Geliştirici: <span className="text-slate-200 font-semibold">Enes Öztürk</span>
                <span>tarafından hazırlandı</span>
              </p>
            </div>
          </div>

          {/* Architecture badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              GraphQL Yoga
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              Real-time Subscriptions
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              React 19 & Vite
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              Tailwind CSS
            </span>
          </div>

          {/* Reset / Demo options */}
          <div className="flex items-center gap-3">
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Varsayılan örnek soruları ve oyları geri yükle"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Örnek Verileri Sıfırla</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 VoteSync • Proje 4 Realtime Voting App. Enes Öztürk imzalıdır.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Server-Sent Events & PubSub mimarisi ile kesintisiz veri senkronizasyonu</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
