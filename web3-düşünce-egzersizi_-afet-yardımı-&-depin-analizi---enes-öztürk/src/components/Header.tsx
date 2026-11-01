import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#top" 
          className="text-lg font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors"
        >
          Web3 Perspektifi
        </a>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <a href="#giris" className="hover:text-stone-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0">
            01. Giriş
          </a>
          <a href="#problem" className="hover:text-stone-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0">
            02. Problem & Sınırlar
          </a>
          <a href="#cozum" className="hover:text-stone-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0">
            03. Web3 Çözümü
          </a>
          <a href="#etki-deger" className="hover:text-stone-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0">
            04. Etki & Riskler
          </a>
          <a href="#simulasyon" className="hover:text-stone-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0">
            Simülatör
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
            title="Analiz raporunu PDF veya Markdown olarak kaydet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Raporu Dışa Aktar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
