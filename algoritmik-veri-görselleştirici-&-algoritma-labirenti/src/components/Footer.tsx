import React from 'react';
import { Sparkles, Terminal, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenLinkedInModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLinkedInModal }) => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-300 font-semibold">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Algoritmik Veri Görselleştirici & Algoritma Labirenti</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-xl">
              “JavaScript ve Veri Yapıları algoritmalarımı pratikleştirmek adına sıfırdan kodladığım interaktif algoritmik simülatör.”
            </p>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-xs text-slate-500 font-mono">
              <span>Geliştirici: <strong className="text-indigo-400 font-semibold">Enes Öztürk</strong></span>
              <span>·</span>
              <span>Vanilla JS Core Engine</span>
              <span>·</span>
              <span>TypeScript & Tailwind</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onOpenLinkedInModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500/50 hover:bg-slate-850 hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>LinkedIn Sunum Metnini Görüntüle</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Veri Yapıları & Algoritmalar</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Enes Öztürk. Tüm hakları saklıdır. Eğitim ve portfolyo projesidir.</p>
          <div className="flex items-center gap-4">
            <span>Dizi (Array)</span>
            <span>·</span>
            <span>Yığıt (Stack)</span>
            <span>·</span>
            <span>Kuyruk (Queue)</span>
            <span>·</span>
            <span>Sıralama (Sort)</span>
            <span>·</span>
            <span>Labirent (Maze)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
