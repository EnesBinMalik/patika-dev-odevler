import React from 'react';
import { ActiveTab } from '../types/blog';
import { Cloud, Edit3 } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  postCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Clean Blog</span>
          <span className="text-xs font-normal text-slate-400 font-sans border-l border-slate-700 pl-2">
            Enes Öztürk
          </span>
        </button>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'home' || activeTab === 'post-detail' ? 'text-white font-semibold' : ''
            }`}
          >
            Anasayfa
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'about' ? 'text-white font-semibold' : ''
            }`}
          >
            Hakkımda
          </button>
          <button
            onClick={() => setActiveTab('new-post')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'new-post' ? 'text-white font-semibold' : ''
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Yeni Yazı</span>
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'deployment' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>Heroku & Atlas</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'contact' ? 'text-white font-semibold' : ''
            }`}
          >
            İletişim
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('deployment')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-md whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            <span>Atlas Canlıda</span>
          </button>
        </div>
      </div>
    </header>
  );
};
