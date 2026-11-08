/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Top Bar Navigation (Zero-pill, clean typography, 3-zone contract)
 * Geliştirici: Enes Öztürk
 */

import React from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  FileText, 
  Database, 
  Layers, 
  LogOut, 
  User, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { IUser, Role } from '../models/types';

interface NavbarProps {
  currentUser: IUser | null;
  activeView: string;
  onSelectView: (view: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onSelectView,
  onLogout,
  onOpenAuth,
}) => {
  const isAdmin = currentUser?.role === Role.ADMIN;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectView(isAdmin ? 'dashboard' : 'portal')}
              className="text-left group"
            >
              <div className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                İnsan Kaynakları Yönetim Sistemi
              </div>
              <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Enes Öztürk Mimari Portalı
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line prose links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onSelectView('dashboard')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'dashboard' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Genel Bakış
                </button>
                <button
                  onClick={() => onSelectView('employees')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'employees' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Çalışan Yönetimi
                </button>
                <button
                  onClick={() => onSelectView('salaries')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'salaries' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Maaş & Bordro
                </button>
                <button
                  onClick={() => onSelectView('leaves')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'leaves' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  İzin Takibi
                </button>
                <button
                  onClick={() => onSelectView('audit')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'audit' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Audit Logları
                </button>
                <button
                  onClick={() => onSelectView('database-io')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'database-io' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Veritabanı & I/O
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectView('portal')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'portal' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Çalışan Paneli
                </button>
                <button
                  onClick={() => onSelectView('my-leaves')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'my-leaves' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  İzin Taleplerim
                </button>
                <button
                  onClick={() => onSelectView('my-salary')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                    activeView === 'my-salary' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  Maaş & Bordrom
                </button>
              </>
            )}

            <button
              onClick={() => onSelectView('architecture')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeView === 'architecture' ? 'border-indigo-600 text-indigo-700 font-semibold' : 'border-transparent text-indigo-600'
              }`}
            >
              UML / EER & S.O.L.I.D
            </button>
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 flex items-center justify-end gap-1.5">
                    {currentUser.role === Role.ADMIN ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{currentUser.username}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Rol: {currentUser.role === Role.ADMIN ? 'İnsan Kaynakları (Admin)' : 'Çalışan (User)'}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Oturumu Kapat"
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                Giriş Yap / Kayıt Ol
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobil Görünüm Alt Menüsü */}
      <div className="lg:hidden border-t border-slate-200 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium text-slate-600">
        {isAdmin ? (
          <>
            <button onClick={() => onSelectView('dashboard')} className={activeView === 'dashboard' ? 'text-slate-900 font-bold' : ''}>Genel Bakış</button>
            <button onClick={() => onSelectView('employees')} className={activeView === 'employees' ? 'text-slate-900 font-bold' : ''}>Çalışanlar</button>
            <button onClick={() => onSelectView('salaries')} className={activeView === 'salaries' ? 'text-slate-900 font-bold' : ''}>Maaşlar</button>
            <button onClick={() => onSelectView('leaves')} className={activeView === 'leaves' ? 'text-slate-900 font-bold' : ''}>İzinler</button>
            <button onClick={() => onSelectView('audit')} className={activeView === 'audit' ? 'text-slate-900 font-bold' : ''}>Loglar</button>
            <button onClick={() => onSelectView('database-io')} className={activeView === 'database-io' ? 'text-slate-900 font-bold' : ''}>I/O Dosya</button>
          </>
        ) : (
          <>
            <button onClick={() => onSelectView('portal')} className={activeView === 'portal' ? 'text-slate-900 font-bold' : ''}>Profilim</button>
            <button onClick={() => onSelectView('my-leaves')} className={activeView === 'my-leaves' ? 'text-slate-900 font-bold' : ''}>İzinlerim</button>
            <button onClick={() => onSelectView('my-salary')} className={activeView === 'my-salary' ? 'text-slate-900 font-bold' : ''}>Maaşım</button>
          </>
        )}
        <button onClick={() => onSelectView('architecture')} className="text-indigo-600 font-bold whitespace-nowrap">UML & S.O.L.I.D</button>
      </div>
    </header>
  );
};
