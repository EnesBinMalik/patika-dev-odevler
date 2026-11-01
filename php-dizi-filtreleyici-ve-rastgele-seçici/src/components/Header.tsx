import React from 'react';
import { Download, Code2, Sparkles } from 'lucide-react';
import { downloadPhpFile } from '../utils/phpSimulator';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
              <span>PHP Dizi Filtreleyici</span>
              <span className="text-xs font-normal text-indigo-400/90 px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                Enes Öztürk
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: 4 nav links, single-line text with hover transition */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeSection === 'simulator' ? 'text-indigo-400' : ''
            }`}
          >
            İnteraktif Simülatör
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeSection === 'pipeline' ? 'text-indigo-400' : ''
            }`}
          >
            Adım Adım Mantık
          </button>
          <button
            onClick={() => onNavigate('tests')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeSection === 'tests' ? 'text-indigo-400' : ''
            }`}
          >
            5'li Örnek Çıktı
          </button>
          <button
            onClick={() => onNavigate('code')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeSection === 'code' ? 'text-indigo-400' : ''
            }`}
          >
            PHP Kaynak Kodu
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={downloadPhpFile}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm shadow-indigo-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            title="Hazır .php dosyasını indir"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.PHP İndir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
