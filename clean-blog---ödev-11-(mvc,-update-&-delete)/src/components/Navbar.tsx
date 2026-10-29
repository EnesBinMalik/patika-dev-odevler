import React, { useState } from 'react';
import { ActivePage } from '../types';
import { BookOpen, Code2, PlusCircle, User, CheckCircle2, Menu, X, FileCode2 } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenChecklist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenChecklist
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#212529]/95 backdrop-blur-md text-white border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-serif font-bold text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
              CB
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold tracking-tight text-lg text-white group-hover:text-emerald-400 transition-colors">
                Clean Blog
              </span>
              <span className="text-[11px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ödev 11 • Enes Öztürk
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'home' || activePage === 'post-detail'
                  ? 'text-white bg-white/15'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Anasayfa
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'about'
                  ? 'text-white bg-white/15'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Hakkımda
            </button>

            <button
              onClick={() => handleNav('add-post')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'add-post'
                  ? 'text-white bg-white/15'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Yazı Ekle
            </button>

            <div className="h-5 w-px bg-white/20 mx-1"></div>

            <button
              onClick={() => handleNav('mvc-code')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'mvc-code'
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/40'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              MVC Kod İnceleyici
            </button>

            <button
              onClick={onOpenChecklist}
              className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ödev 11 Özeti
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenChecklist}
              className="px-2 py-1 rounded text-xs bg-emerald-600 text-white font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Ödev 11
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a1e21] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10"
          >
            Anasayfa
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10"
          >
            Hakkımda (Enes Öztürk)
          </button>
          <button
            onClick={() => handleNav('add-post')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            Yeni Yazı Ekle
          </button>
          <button
            onClick={() => handleNav('mvc-code')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-emerald-300 hover:bg-emerald-950/50 flex items-center gap-2"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            MVC Kodları & Mimari
          </button>
        </div>
      )}
    </nav>
  );
};
