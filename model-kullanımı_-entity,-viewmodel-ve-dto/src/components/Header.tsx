import React from 'react';
import { Printer, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenReport: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Model Mimarisi
          </a>
        </div>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('concepts')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'concepts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kavramlar
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'architecture'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Katmanlı Mimari
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'pipeline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Canlı Simülatör
          </button>
          <button
            onClick={() => onNavigate('security')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Güvenlik Testi
          </button>
          <button
            onClick={() => onNavigate('code')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'code'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kod Çözümleri
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeSection === 'quiz'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ödev Sınavı
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Ödev Raporu (Yazdır)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
