import React, { useState } from 'react';
import { User, LogOut, Shield, GraduationCap, School, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenAuthModal: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuthModal,
  activeView,
  setActiveView,
}) => {
  const { currentUser, logout, loginAsUser, users } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'operator':
        return (
          <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            Operatör
          </span>
        );
      case 'instructor':
        return (
          <span className="flex items-center gap-1 text-xs text-sky-400 font-medium">
            <School className="w-3.5 h-3.5" />
            Eğitmen
          </span>
        );
      case 'student':
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            Öğrenci
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('explore')}
            className="flex items-center gap-2.5 text-left group transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
              P
            </div>
            <div className="whitespace-nowrap">
              <span className="text-base font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                Patika<span className="text-amber-500">.dev</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('explore')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView === 'explore' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Patikalar & Eğitimler
          </button>

          {currentUser?.role === 'student' && (
            <button
              onClick={() => setActiveView('student_panel')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                activeView === 'student_panel' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Öğrenci Paneli
            </button>
          )}

          {currentUser?.role === 'instructor' && (
            <button
              onClick={() => setActiveView('instructor_panel')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                activeView === 'instructor_panel' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Eğitmen Paneli
            </button>
          )}

          {currentUser?.role === 'operator' && (
            <button
              onClick={() => setActiveView('operator_panel')}
              className={`whitespace-nowrap transition-colors hover:text-white ${
                activeView === 'operator_panel' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Operatör Paneli
            </button>
          )}

          <button
            onClick={() => setActiveView('about')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView === 'about' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Proje Hakkında
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action / User Account Area */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden ring-1 ring-slate-700 shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="hidden sm:block text-left pr-1 whitespace-nowrap">
                  <div className="text-xs font-semibold text-slate-200 leading-none">
                    {currentUser.name}
                  </div>
                  <div className="mt-1 leading-none">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Quick User / Role Switching Dropdown */}
              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="p-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs text-slate-400">Aktif Oturum</p>
                    <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Hızlı Rol / Kullanıcı Değiştir
                    </p>
                    {users.map((u) => {
                      const isActive = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            loginAsUser(u.id);
                            if (u.role === 'operator') setActiveView('operator_panel');
                            else if (u.role === 'instructor') setActiveView('instructor_panel');
                            else setActiveView('student_panel');
                            setShowRoleMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                            isActive
                              ? 'bg-amber-500/10 text-amber-300 font-medium'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full shrink-0 bg-slate-600" />
                            <div className="truncate">
                              <span className="block truncate text-slate-200">{u.name}</span>
                              <span className="block text-[10px] text-slate-400">{u.title}</span>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                            {u.role === 'operator' ? 'Operatör' : u.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Giriş / Kayıt Ol
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
