import React from 'react';
import { Heart, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

export const SignatureFooter: React.FC = () => {
  return (
    <footer className="w-full mt-16 pb-12 pt-8 border-t border-slate-200/80 bg-white/50 backdrop-blur-xs">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center space-y-4">
        {/* Signature Card */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
            <Code2 className="w-4 h-4 text-amber-500" />
            <span>React Ödev 1 &bull; Not Uygulaması</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-sm text-slate-700">
            <span>Kolaylıklar :)</span>
            <span className="font-semibold text-slate-500">İmza:</span>
            <span className="font-handwriting text-2xl font-bold text-amber-600 tracking-wide px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60">
              enes öztürk
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span>Geliştirici:</span>
          <strong className="text-slate-600 font-semibold">Enes Öztürk</strong>
          <span>&bull;</span>
          <span>Tüm notlar tarayıcınızda (LocalStorage) güvenle saklanır</span>
        </p>
      </div>
    </footer>
  );
};
