/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Code2, Volume2, VolumeX, GraduationCap, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCodeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenCodeModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand / Project Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <span className="font-mono-code font-bold text-lg">÷3</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                3 ile Bölünebilme Hesaplayıcı
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Ödev
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span>Matematik & Algoritma Uygulaması</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-medium flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Enes Öztürk İmzasıyla
              </span>
            </p>
          </div>
        </div>

        {/* Right action controls & author badge */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Homework author signature pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-sm text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Hazırlayan:</span>
            <span className="font-semibold text-slate-200 font-signature text-base tracking-wide">Enes Öztürk</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Ses efektlerini aç veya kapat"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Code Viewer Button */}
          <button
            type="button"
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-medium transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>Ödev Kodunu Gör</span>
          </button>
        </div>
      </div>
    </header>
  );
};
