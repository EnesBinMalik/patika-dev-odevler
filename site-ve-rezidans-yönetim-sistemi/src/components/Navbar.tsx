import React from 'react';
import { Kullanici } from '../types';
import { Building2, UserCheck, Shield, ChevronDown, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeView: 'admin' | 'resident' | 'architecture';
  onSelectView: (view: 'admin' | 'resident' | 'architecture') => void;
  currentUser: Kullanici;
  allUsers: Kullanici[];
  onSelectUser: (user: Kullanici) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  currentUser,
  allUsers,
  onSelectUser,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, 1 line, no pills) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectView(currentUser.rol === 'Admin' ? 'admin' : 'resident');
          }}
          className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            EÖ
          </div>
          <span className="hidden sm:inline">Güneştepe Rezidans · Enes Öztürk</span>
          <span className="sm:hidden">Güneştepe Rezidans</span>
        </a>

        {/* Zone 2: 4 Navigation Links (Single line, text with hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectView('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-indigo-600 py-1 ${
              activeView === 'admin'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Yönetici (Admin) Paneli
          </button>

          <button
            onClick={() => onSelectView('resident')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-indigo-600 py-1 ${
              activeView === 'resident'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Sakin (Kullanıcı) Portalı
          </button>

          <button
            onClick={() => onSelectView('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-indigo-600 py-1 ${
              activeView === 'architecture'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            .NET 5 MVC & MSSQL Mimarisi
          </button>
        </nav>

        {/* Zone 3: Active User Switcher / Action (Single interactive action) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick User Switcher Dropdown */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-2 hidden lg:inline">
              Aktif Profil:
            </span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const target = allUsers.find((u) => u.id === e.target.value);
                if (target) {
                  onSelectUser(target);
                  if (target.rol === 'Admin') onSelectView('admin');
                  else onSelectView('resident');
                }
              }}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-4"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.adSoyad} ({u.rol === 'Admin' ? 'Yönetici' : 'Sakin'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (confirm('Sistem verilerini varsayılan fabrika ayarlarına sıfırlamak istiyor musunuz?')) {
                onResetData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Örnek Verileri Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs font-semibold">
        <button
          onClick={() => onSelectView('admin')}
          className={`px-3 py-1.5 rounded-lg ${
            activeView === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Yönetici
        </button>
        <button
          onClick={() => onSelectView('resident')}
          className={`px-3 py-1.5 rounded-lg ${
            activeView === 'resident' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          Sakin Portalı
        </button>
        <button
          onClick={() => onSelectView('architecture')}
          className={`px-3 py-1.5 rounded-lg ${
            activeView === 'architecture' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          .NET & SQL Kodları
        </button>
      </div>
    </header>
  );
};
