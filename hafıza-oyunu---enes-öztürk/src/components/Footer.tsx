import React from 'react';
import { Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 mt-12 py-6 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Redux Toolkit State Management · React 19</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>Geliştirici: <strong className="text-slate-200 font-semibold">Enes Öztürk</strong></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Ödev 3 Hafıza Oyunu</span>
        </div>
      </div>
    </footer>
  );
};
