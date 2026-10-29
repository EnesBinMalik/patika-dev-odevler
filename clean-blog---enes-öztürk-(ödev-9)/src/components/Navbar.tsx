import React, { useState } from 'react';
import { BookOpen, PlusCircle, User, Mail, Code2, Menu, X, Database } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'add_post' | 'about' | 'contact' | 'post_detail';
  setCurrentView: (view: 'home' | 'add_post' | 'about' | 'contact') => void;
  onOpenHomework: () => void;
  postCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenHomework,
  postCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'add_post' | 'about' | 'contact') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-white transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Signature */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNav('home')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-teal-400 group-hover:border-teal-500/60 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-stone-100 group-hover:text-teal-300 transition">
                  Clean Blog
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono uppercase tracking-wider text-teal-400 bg-teal-950/70 border border-teal-800/80 px-2 py-0.5 rounded">
                  Enes Öztürk
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium tracking-wide transition ${
                currentView === 'home'
                  ? 'bg-stone-800 text-teal-300 font-semibold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Ana Sayfa
            </button>

            <button
              onClick={() => handleNav('add_post')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium tracking-wide transition flex items-center gap-1.5 ${
                currentView === 'add_post'
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              Yeni Yazı Ekle
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium tracking-wide transition flex items-center gap-1.5 ${
                currentView === 'about'
                  ? 'bg-stone-800 text-teal-300 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <User className="w-4 h-4 text-stone-400" />
              Hakkımda
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium tracking-wide transition flex items-center gap-1.5 ${
                currentView === 'contact'
                  ? 'bg-stone-800 text-teal-300 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Mail className="w-4 h-4 text-stone-400" />
              İletişim
            </button>

            {/* Homework Inspector Button */}
            <button
              onClick={onOpenHomework}
              className="ml-3 px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-600 hover:to-amber-700 text-amber-50 border border-amber-500/50 flex items-center gap-1.5 shadow-sm transition transform hover:-translate-y-0.5"
            >
              <Code2 className="w-4 h-4 text-amber-300" />
              <span>Ödev 9 Raporu</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenHomework}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-700/80 text-amber-100 border border-amber-600/50 flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              Ödev 9
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              currentView === 'home' ? 'bg-stone-800 text-teal-300' : 'text-stone-300'
            }`}
          >
            Ana Sayfa ({postCount} Yazı)
          </button>
          <button
            onClick={() => handleNav('add_post')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              currentView === 'add_post' ? 'bg-teal-700 text-white' : 'text-stone-300'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            Yeni Yazı Ekle (Add New Post)
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              currentView === 'about' ? 'bg-stone-800 text-teal-300' : 'text-stone-300'
            }`}
          >
            <User className="w-4 h-4 text-stone-400" />
            Hakkımda (Enes Öztürk)
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              currentView === 'contact' ? 'bg-stone-800 text-teal-300' : 'text-stone-300'
            }`}
          >
            <Mail className="w-4 h-4 text-stone-400" />
            İletişim
          </button>
          <div className="pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 px-2 py-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                cleanblog-test-db
              </span>
              <span className="text-teal-400 font-mono">Mongoose Modeli Aktif</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
