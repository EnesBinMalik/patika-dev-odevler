import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActivePage, UserRole } from '../types';
import { User as UserIcon, LogOut, Shield, CalendarCheck, ChevronDown, Sparkles, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, activePage, setActivePage, logout, quickSwitchRole, reservations } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const myReservationsCount = currentUser
    ? reservations.filter(r => r.userId === currentUser.id && r.status !== 'İptal Edildi').length
    : 0;

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Quick Role Helper Top Notification Bar (Subtle & high utility for testing roles) */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 md:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Aktif Rol:</span>
            <span className="font-semibold text-white uppercase tracking-wider">
              {currentUser ? (currentUser.role === 'admin' ? 'Yönetici (Admin)' : 'Üye (Member)') : 'Ziyaretçi (Müşteri)'}
            </span>
            {currentUser && <span className="text-stone-400">({currentUser.name})</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-stone-400">Hızlı Rol Değiştir:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => quickSwitchRole('guest')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  !currentUser ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                Misafir
              </button>
              <button
                onClick={() => quickSwitchRole('member')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.role === 'member' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                Üye
              </button>
              <button
                onClick={() => quickSwitchRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.role === 'admin' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer shrink-0"
        >
          <span className="font-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
            Fikstür
          </span>
          <span className="block text-[10px] tracking-widest uppercase font-medium text-stone-500 -mt-1">
            İç Mimarlık & Mobilya
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activePage === 'home' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Ana Sayfa
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activePage === 'about' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Hakkımızda
          </button>

          <button
            onClick={() => handleNavClick('furnitures')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activePage === 'furnitures' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Mobilyalar
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              activePage === 'contact' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            İletişim
          </button>

          {/* Member Reservations link */}
          {currentUser && currentUser.role === 'member' && (
            <button
              onClick={() => handleNavClick('my-reservations')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:text-stone-900 ${
                activePage === 'my-reservations' ? 'text-stone-950 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-stone-700" />
              <span>Rezervasyonlarım</span>
              {myReservationsCount > 0 && (
                <span className="text-xs bg-stone-100 text-stone-800 font-mono px-1.5 py-0.2 rounded-full border border-stone-200">
                  {myReservationsCount}
                </span>
              )}
            </button>
          )}

          {/* Admin panel link */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-900 hover:text-stone-950 ${
                activePage === 'admin' ? 'font-semibold border-b-2 border-stone-900 pb-0.5' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-amber-900">Admin Paneli</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action / User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-stone-200 hover:border-stone-300 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate hidden sm:inline">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-stone-700 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] uppercase font-bold text-amber-700 mt-1">
                      {currentUser.role === 'admin' ? 'Yönetici (Admin)' : 'Kayıtlı Üye'}
                    </p>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 flex items-center gap-2 cursor-pointer text-stone-900"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      Admin Paneline Git
                    </button>
                  )}

                  {currentUser.role === 'member' && (
                    <button
                      onClick={() => handleNavClick('my-reservations')}
                      className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-stone-50 flex items-center gap-2 cursor-pointer text-stone-900"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-stone-700" />
                      Rezervasyonlarım ({myReservationsCount})
                    </button>
                  )}

                  <div className="border-t border-stone-100 my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Oturumu Kapat
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                Kayıt Ol
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-950 cursor-pointer"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 flex flex-col gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="text-left py-2 text-stone-800 font-medium border-b border-stone-100"
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-left py-2 text-stone-800 font-medium border-b border-stone-100"
          >
            Hakkımızda
          </button>
          <button
            onClick={() => handleNavClick('furnitures')}
            className="text-left py-2 text-stone-800 font-medium border-b border-stone-100"
          >
            Mobilyalar
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="text-left py-2 text-stone-800 font-medium border-b border-stone-100"
          >
            İletişim
          </button>
          {currentUser?.role === 'member' && (
            <button
              onClick={() => handleNavClick('my-reservations')}
              className="text-left py-2 text-stone-800 font-medium border-b border-stone-100 flex items-center justify-between"
            >
              <span>Rezervasyonlarım</span>
              <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full">{myReservationsCount}</span>
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 text-amber-900 font-bold border-b border-stone-100 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin Paneli</span>
            </button>
          )}

          {!currentUser ? (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 text-sm font-medium border border-stone-300 rounded-lg text-stone-800 text-center"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2.5 text-sm font-semibold bg-stone-900 text-white rounded-lg text-center"
              >
                Kayıt Ol
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full text-left py-2 text-rose-600 font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
