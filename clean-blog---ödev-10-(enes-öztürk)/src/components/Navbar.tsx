import React, { useState } from 'react';
import { ActiveTab } from '../types/blog';
import { BookOpen, Code2, Menu, X, PlusCircle, Home, User } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab, postId?: string) => void;
  postCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, postCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="text-left font-serif text-xl tracking-tight font-bold hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Clean Blog</span>
            <span className="text-xs font-sans font-normal text-stone-400 border border-stone-700 rounded px-1.5 py-0.5 hidden sm:inline">
              Enes Öztürk
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'home' || activeTab === 'post' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              <Home className="w-4 h-4 opacity-75" />
              <span>Anasayfa (index.ejs)</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'about' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              <User className="w-4 h-4 opacity-75" />
              <span>Hakkımda</span>
            </button>

            <button
              onClick={() => handleNav('add')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              <PlusCircle className="w-4 h-4 opacity-75" />
              <span>Yazı Ekle (add_post)</span>
            </button>

            <button
              onClick={() => handleNav('homework')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'homework' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Ödev 10 Kodları & Test</span>
            </button>
          </div>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('homework')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ödev Kontrol Paneli</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-white focus:outline-none"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-4 space-y-2 text-sm">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left py-2 px-3 rounded flex items-center gap-2 ${
              activeTab === 'home' ? 'bg-stone-800 text-amber-300' : 'text-stone-300'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Anasayfa (index.ejs)</span>
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left py-2 px-3 rounded flex items-center gap-2 ${
              activeTab === 'about' ? 'bg-stone-800 text-amber-300' : 'text-stone-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hakkımda (about.ejs)</span>
          </button>
          <button
            onClick={() => handleNav('add')}
            className={`w-full text-left py-2 px-3 rounded flex items-center gap-2 ${
              activeTab === 'add' ? 'bg-stone-800 text-amber-300' : 'text-stone-300'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yazı Ekle (add_post.ejs)</span>
          </button>
          <button
            onClick={() => handleNav('homework')}
            className={`w-full text-left py-2 px-3 rounded flex items-center gap-2 ${
              activeTab === 'homework' ? 'bg-stone-800 text-amber-300' : 'text-stone-300'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Ödev 10 Kodları & Test Paneli</span>
          </button>
        </div>
      )}
    </nav>
  );
};
