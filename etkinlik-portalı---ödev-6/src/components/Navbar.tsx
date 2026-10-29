import React from 'react';
import { CalendarCheck2, ShieldCheck, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onOpenRubric: () => void;
  onScrollToForm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRubric, onScrollToForm }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
          <span>Etkinlik Portalı</span>
        </a>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#events-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Tüm Etkinlikler
          </a>
          <button 
            type="button" 
            onClick={onScrollToForm}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Yeni Etkinlik Ekle
          </button>
          <button 
            type="button"
            onClick={onOpenRubric}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-indigo-600"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Ödev 6 Kriterleri
          </button>
          <a href="#signature-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Enes Öztürk İmzası
          </a>
        </nav>

        {/* Zone 3: 1 primary action / Author Signature Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onScrollToForm}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Etkinlik Ekle</span>
          </button>

          {/* Enes Öztürk Signature Avatar Badge */}
          <div 
            onClick={onOpenRubric}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
            title="ENES ÖZTÜRK İmzalı Proje Detayları"
          >
            <img
              src="/src/assets/images/enes_ozturk_avatar_1793255787112.jpg"
              alt="Enes Öztürk"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                ENES ÖZTÜRK
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                İmzalı · Ödev 6
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
