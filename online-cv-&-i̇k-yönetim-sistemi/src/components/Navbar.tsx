/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 */

import React from 'react';
import { UserEntity } from '../types/models';
import { Role } from '../types/enums';
import { Briefcase, User, Shield, LogOut, LogIn, FileText, Activity, Layers, Sparkles, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  currentUser: UserEntity | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeView: 'HR_DASHBOARD' | 'USER_DASHBOARD' | 'LOGS' | 'DIAGRAMS';
  onNavigate: (view: 'HR_DASHBOARD' | 'USER_DASHBOARD' | 'LOGS' | 'DIAGRAMS') => void;
  onQuickRoleSwitch: (role: Role) => void;
  blockedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  activeView,
  onNavigate,
  onQuickRoleSwitch,
  blockedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
                  Online CV & İK Portalı
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2.0 Clean Code
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Geliştirici:</span>
                <span className="font-semibold text-indigo-300">Enes Öztürk</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">S.O.L.I.D & Spring Boot Mimari</span>
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {currentUser?.role === Role.ADMIN && (
              <button
                onClick={() => onNavigate('HR_DASHBOARD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeView === 'HR_DASHBOARD'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                İK Aday Havuzu
                {blockedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                    {blockedCount}
                  </span>
                )}
              </button>
            )}

            {currentUser?.role === Role.USER && (
              <button
                onClick={() => onNavigate('USER_DASHBOARD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeView === 'USER_DASHBOARD'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Özgeçmişim (CV)
              </button>
            )}

            <button
              onClick={() => onNavigate('DIAGRAMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'DIAGRAMS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              UML & EER Şemaları
            </button>

            <button
              onClick={() => onNavigate('LOGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'LOGS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Sistem Günlükleri (Audit)
            </button>
          </nav>

          {/* User & Role Management */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Role indicator badge */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    {currentUser.role === Role.ADMIN ? (
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {currentUser.username}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 uppercase">
                    {currentUser.role === Role.ADMIN ? 'İnsan Kaynakları (Admin)' : 'Aday (User)'}
                  </span>
                </div>

                {/* Quick Role Switcher for seamless evaluation */}
                <div className="relative group">
                  <button
                    title="Rol Değiştir"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden xl:inline">Rol Değiştir</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50">
                    <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Hızlı Rol Geçişi
                    </div>
                    <button
                      onClick={() => onQuickRoleSwitch(Role.ADMIN)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                        currentUser.role === Role.ADMIN
                          ? 'bg-indigo-600/20 text-indigo-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      İnsan Kaynakları (Admin)
                    </button>
                    <button
                      onClick={() => onQuickRoleSwitch(Role.USER)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                        currentUser.role === Role.USER
                          ? 'bg-indigo-600/20 text-indigo-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      Aday (User)
                    </button>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  title="Güvenli Çıkış Yap"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Giriş Yap / Üye Ol
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 text-xs">
          {currentUser?.role === Role.ADMIN && (
            <button
              onClick={() => onNavigate('HR_DASHBOARD')}
              className={`px-3 py-1 rounded-lg ${
                activeView === 'HR_DASHBOARD' ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              İK Havuzu
            </button>
          )}
          {currentUser?.role === Role.USER && (
            <button
              onClick={() => onNavigate('USER_DASHBOARD')}
              className={`px-3 py-1 rounded-lg ${
                activeView === 'USER_DASHBOARD' ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              CV Düzenle
            </button>
          )}
          <button
            onClick={() => onNavigate('DIAGRAMS')}
            className={`px-3 py-1 rounded-lg ${
              activeView === 'DIAGRAMS' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            UML / EER
          </button>
          <button
            onClick={() => onNavigate('LOGS')}
            className={`px-3 py-1 rounded-lg ${
              activeView === 'LOGS' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            Loglar
          </button>
        </div>
      </div>
    </header>
  );
};
