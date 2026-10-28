import React, { useState } from 'react';
import { Plus, Mail, GitBranch, Menu, X } from 'lucide-react';
import { ContactMessage } from '../types';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenMessagesModal: () => void;
  onOpenDeployModal: () => void;
  messages: ContactMessage[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenMessagesModal,
  onOpenDeployModal,
  messages,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = messages.filter((m) => m.status === 'new').length;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (Single-line wordmark in display face) */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 group"
        >
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-sm shadow-sm group-hover:bg-amber-400 transition-colors">
            EÖ
          </span>
          <span className="tracking-wider font-extrabold text-base">
            ENES ÖZTÜRK <span className="text-amber-500 font-normal">AJANS</span>
          </span>
        </a>

        {/* Zone 2: 4-5 Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => scrollTo('services')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hizmetler
          </button>
          <button
            onClick={() => scrollTo('portfolio')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Portföy (CRUD)
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hakkımızda
          </button>
          <button
            onClick={() => scrollTo('team')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Ekip
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            İletişim
          </button>
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub & Heroku</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Message Box Utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMessagesModal}
            title="Gelen Mesajlar (SmartEdu)"
            className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Yeni Proje Ekle</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
            <button
              onClick={() => scrollTo('services')}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 hover:text-amber-400"
            >
              Hizmetler
            </button>
            <button
              onClick={() => scrollTo('portfolio')}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 hover:text-amber-400"
            >
              Portföy (CRUD İşlemleri)
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 hover:text-amber-400"
            >
              Hakkımızda
            </button>
            <button
              onClick={() => scrollTo('team')}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 hover:text-amber-400"
            >
              Ekip
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 hover:text-amber-400"
            >
              İletişim (SmartEdu Formu)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDeployModal();
              }}
              className="text-left py-2 px-3 rounded hover:bg-neutral-900 text-amber-400 flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4" /> GitHub & Heroku Rehberi
            </button>
          </div>
          <div className="pt-2 border-t border-neutral-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddModal();
              }}
              className="flex-1 py-2 text-center text-xs font-semibold text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300"
            >
              + Yeni Proje Ekle
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
