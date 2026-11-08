/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: Navbar
 * Adheres to Top Bar Contract: 3 distinct zones, clean typography, single-line links
 */

import React, { useState } from 'react';
import {
  Briefcase,
  UserCheck,
  Database,
  FileCode2,
  ScrollText,
  Workflow,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { User } from '../core/entities/UserEntity.ts';
import { Role } from '../core/types/enums.ts';
import { DatabaseService } from '../core/services/DatabaseService.ts';

export type ActiveTab =
  | 'company'
  | 'candidate'
  | 'diagrams'
  | 'database-io'
  | 'logs'
  | 'swagger'
  | 'architecture';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: User | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onSelectUser: (user: User | null) => void;
  onOpenArchitectureModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuthModal,
  onSelectUser,
  onOpenArchitectureModal,
}) => {
  const [isDemoUserMenuOpen, setIsDemoUserMenuOpen] = useState(false);
  const db = DatabaseService.getInstance();
  const allUsers = db.users.findAll().toList();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange(currentUser?.getRole() === Role.ADMIN ? 'company' : 'candidate')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  KariyerPortalı
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Katmanlı Mimari & İstihdam Platformu
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single line, text with hover underlines) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onTabChange('company')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'company'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Şirket Portalı (Admin)</span>
            </button>

            <button
              onClick={() => onTabChange('candidate')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'candidate'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Aday Portalı (User)</span>
            </button>

            <button
              onClick={() => onTabChange('diagrams')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'diagrams'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>UML & EER Diyagramları</span>
            </button>

            <button
              onClick={() => onTabChange('database-io')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'database-io'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Veritabanı & Dosya I/O</span>
            </button>

            <button
              onClick={() => onTabChange('logs')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'logs'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>Loglar (Audit)</span>
            </button>

            <button
              onClick={() => onTabChange('swagger')}
              className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'swagger'
                  ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Swagger API Docs</span>
            </button>

            <button
              onClick={onOpenArchitectureModal}
              className="flex items-center gap-1.5 py-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors whitespace-nowrap shrink-0"
              title="Katmanlı Mimari, S.O.L.I.D. Prensipleri ve Enes Öztürk İmzası"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mimari & SOLID</span>
            </button>
          </nav>

          {/* Zone 3: Quick Demo Role Switcher & Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Demo User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDemoUserMenuOpen(!isDemoUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                title="Hızlı Demo Kullanıcı Değiştirici"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentUser?.getRole() === Role.ADMIN ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="truncate max-w-[140px]">
                  {currentUser ? currentUser.getFullName() : 'Kullanıcı Seçin'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDemoUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs"
                  onMouseLeave={() => setIsDemoUserMenuOpen(false)}
                >
                  <div className="px-2 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Hızlı Demo Rol Değiştirici
                  </div>

                  <div className="space-y-1 my-1 max-h-64 overflow-y-auto">
                    {allUsers.map(user => {
                      const isSelected = currentUser?.getId() === user.getId();
                      return (
                        <button
                          key={user.getId()}
                          onClick={() => {
                            onSelectUser(user);
                            setIsDemoUserMenuOpen(false);
                            if (user.getRole() === Role.ADMIN) {
                              onTabChange('company');
                            } else {
                              onTabChange('candidate');
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex flex-col truncate pr-2">
                            <span className="truncate font-medium">{user.getFullName()}</span>
                            <span className="text-[10px] text-slate-500 truncate">{user.getEmail()}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                user.getRole() === Role.ADMIN
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              }`}
                            >
                              {user.getRole()}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                    <button
                      onClick={() => {
                        setIsDemoUserMenuOpen(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full text-center py-1.5 px-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded text-xs font-semibold"
                    >
                      Şifreli Giriş Ekranı (3 Deneme Kuralı)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <button
                onClick={() => onSelectUser(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Tab Bar */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs no-scrollbar">
          <button
            onClick={() => onTabChange('company')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'company' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Şirket (Admin)
          </button>
          <button
            onClick={() => onTabChange('candidate')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'candidate' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 Aday (User)
          </button>
          <button
            onClick={() => onTabChange('diagrams')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'diagrams' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📐 UML & EER
          </button>
          <button
            onClick={() => onTabChange('database-io')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'database-io' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💾 DB & I/O
          </button>
          <button
            onClick={() => onTabChange('logs')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📜 Loglar
          </button>
          <button
            onClick={() => onTabChange('swagger')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'swagger' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Swagger
          </button>
        </div>
      </div>
    </header>
  );
};
