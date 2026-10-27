import React from 'react';
import { StickyNote, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  totalNotes: number;
}

export const Header: React.FC<HeaderProps> = ({ totalNotes }) => {
  return (
    <header className="w-full pt-8 pb-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-200/50 rotate-[-3deg] hover:rotate-0 transition-transform">
            <StickyNote className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
                NotesApp
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                Ödev 1
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Renkli, pratik ve filtrelenebilir not defteriniz
            </p>
          </div>
        </div>

        {/* Creator Signature Badge in Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xs text-xs font-medium text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Hazırlayan:</span>
          <span className="font-bold text-slate-800 underline decoration-amber-400 decoration-2 underline-offset-2">
            enes öztürk
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
            {totalNotes} not
          </span>
        </div>
      </div>
    </header>
  );
};
