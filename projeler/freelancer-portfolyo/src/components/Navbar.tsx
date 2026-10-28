import React, { useState } from 'react';
import { Menu, X, PlusCircle, Inbox, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenAddProject: () => void;
  onOpenInbox: () => void;
  onOpenDeployGuide: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddProject,
  onOpenInbox,
  onOpenDeployGuide,
  unreadCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2c3e50] text-white shadow-md border-b border-[#34495e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand title wordmark */}
          <a
            href="#page-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase whitespace-nowrap shrink-0 hover:text-[#1abc9c] transition-colors"
          >
            ENES ÖZTÜRK
          </a>

          {/* Zone 2: 4–5 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold tracking-wide uppercase">
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-[#1abc9c] transition-colors whitespace-nowrap shrink-0 py-2"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-[#1abc9c] transition-colors whitespace-nowrap shrink-0 py-2"
            >
              HAKKIMDA
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[#1abc9c] transition-colors whitespace-nowrap shrink-0 py-2"
            >
              İLETİŞİM
            </button>
            <button
              onClick={onOpenDeployGuide}
              className="text-white/80 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2"
              title="GitHub ve Heroku Dağıtım Rehberi"
            >
              <Terminal className="w-4 h-4 text-[#1abc9c]" />
              <span>DAĞITIM REHBERİ</span>
            </button>
            <button
              onClick={onOpenInbox}
              className="relative text-white/80 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2"
              title="SmartEdu Mesaj Gelen Kutusu"
            >
              <Inbox className="w-4 h-4 text-[#1abc9c]" />
              <span>GELEN MESAJLAR</span>
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#e74c3c] text-white text-[11px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddProject}
              className="px-4 py-2.5 text-xs lg:text-sm font-bold tracking-wide uppercase text-white bg-[#1abc9c] hover:bg-[#16a085] rounded-md transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>YENİ PROJE EKLE</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenInbox}
              className="p-2 text-white/90 hover:text-white relative"
              aria-label="Mesaj Kutusu"
            >
              <Inbox className="w-5 h-5 text-[#1abc9c]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#e74c3c] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-md text-white bg-[#34495e] hover:bg-[#1abc9c] transition-colors focus:outline-none"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2c3e50] border-t border-[#34495e] px-4 pt-4 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('portfolio')}
            className="block w-full text-left py-2.5 px-3 text-sm font-bold text-white hover:bg-[#34495e] rounded"
          >
            PORTFOLIO
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-2.5 px-3 text-sm font-bold text-white hover:bg-[#34495e] rounded"
          >
            HAKKIMDA
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2.5 px-3 text-sm font-bold text-white hover:bg-[#34495e] rounded"
          >
            İLETİŞİM (SMARTEDU FORMU)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDeployGuide();
            }}
            className="block w-full text-left py-2.5 px-3 text-sm font-bold text-white hover:bg-[#34495e] rounded flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#1abc9c]" />
              GITHUB & HEROKU REHBERİ
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInbox();
            }}
            className="block w-full text-left py-2.5 px-3 text-sm font-bold text-white hover:bg-[#34495e] rounded flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#1abc9c]" />
              GELEN MESAJLAR
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-[#e74c3c] text-white text-xs font-bold rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAddProject();
            }}
            className="w-full mt-2 py-3 px-4 text-center font-bold text-white bg-[#1abc9c] hover:bg-[#16a085] rounded-md flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>YENİ PROJE EKLE</span>
          </button>
        </div>
      )}
    </header>
  );
};
