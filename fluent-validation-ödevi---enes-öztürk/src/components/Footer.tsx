import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs">
              FV
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                FluentValidation Ödevi
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>.NET Web API Doğrulama Mimarisi</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Enes Öztürk İmzalı</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button onClick={() => onSelectTab('playground')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Canlı Simülatör
            </button>
            <button onClick={() => onSelectTab('code')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              C# Kodları
            </button>
            <button onClick={() => onSelectTab('architecture')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Mimari Akış
            </button>
            <button onClick={() => onSelectTab('report')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Ödev Raporu
            </button>
          </div>

          {/* Scroll to Top */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Teslim Doğrulandı</span>
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Yukarı Çık"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Enes Öztürk · Fluent Validation ile Update, Delete ve GetById Doğrulama Ödevi.
        </div>
      </div>
    </footer>
  );
};
