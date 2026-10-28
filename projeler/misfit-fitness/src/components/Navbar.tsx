import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { 
  Dumbbell, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Github, 
  Award,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activePage, 
    setActivePage, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    logout,
    switchUser,
    users,
    setIsGithubModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Ana Sayfa', page: 'home' },
    { label: 'Hakkımızda', page: 'about' },
    { label: 'Eğitmenler', page: 'trainers' },
    { label: 'Antrenmanlar', page: 'workouts' },
    { label: 'Galeri', page: 'gallery' },
    { label: 'İletişim', page: 'contact' },
  ];

  const handleNavClick = (page: PageRoute) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      {/* Quick Demo Switcher Strip */}
      <div className="bg-neutral-900 border-b border-neutral-800/60 px-4 py-1.5 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">SmartEdu Mimarisi</span>
            <span className="text-neutral-600">·</span>
            <span>Enes Öztürk İmzasıyla El Emeği</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-neutral-500">Hızlı Rol Değiştir:</span>
            <div className="flex items-center gap-1.5">
              {users.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    currentUser?.id === u.id
                      ? 'bg-amber-500 text-neutral-950 font-semibold'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  {u.name.split(' ')[0]} ({u.role === 'admin' ? 'Yönetici' : u.role === 'trainer' ? 'Eğitmen' : 'Üye'})
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 ml-2"
              title="GitHub & Heroku Rehberi"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GitHub & Heroku</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (single text element) */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors uppercase">
              MISFIT
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activePage === link.page
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'hover:text-white hover:border-b-2 hover:border-neutral-500'
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activePage === 'dashboard'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'hover:text-white hover:border-b-2 hover:border-neutral-500'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <>
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Admin Paneli</span>
                </>
              ) : currentUser.role === 'trainer' ? (
                <>
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Eğitmen Paneli</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span>Panelim</span>
                </>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-md object-cover border border-neutral-700"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 uppercase font-semibold">
                    {currentUser.role === 'admin' ? 'Yönetici' : currentUser.role === 'trainer' ? 'Eğitmen' : 'Üye'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {roleSwitcherOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-2 z-50 text-neutral-200"
                  onMouseLeave={() => setRoleSwitcherOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-800 text-xs">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-neutral-400 text-[11px] truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('dashboard');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yönetim Paneli</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsGithubModalOpen(true);
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <Github className="w-3.5 h-3.5 text-amber-400" />
                    <span>GitHub & Dağıtım Bilgisi</span>
                  </button>
                  <div className="border-t border-neutral-800 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
              >
                Kayıt Ol
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === link.page
                  ? 'bg-neutral-900 text-amber-400 font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-900/60 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activePage === 'dashboard'
                  ? 'bg-neutral-900 text-amber-400 font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-900/60 hover:text-white'
              }`}
            >
              Yönetim Paneli ({currentUser.role.toUpperCase()})
            </button>
          )}
        </div>
      )}
    </header>
  );
};
