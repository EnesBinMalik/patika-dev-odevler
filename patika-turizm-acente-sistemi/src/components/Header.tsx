/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Başlık ve Navigasyon
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Building2,
  Users,
  Search,
  CalendarDays,
  BedDouble,
  FileText,
  Database,
  LogOut,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'search'
  | 'hotels'
  | 'seasons'
  | 'rooms'
  | 'reservations'
  | 'users'
  | 'database';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewBooking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser, users, logout } = useDatabase();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner with Enes Öztürk Signature & Quick Info */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide">
              Patika Turizm Acentesi
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Otel Rezervasyon ve Acente Operasyon Sistemi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Geliştirici: Enes Öztürk
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono text-[11px]">v2.4 Relational DB</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (User/Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('search');
                }}
                className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight"
              >
                Patika Turizm
              </a>
              <span className="text-[11px] text-slate-500 block">
                {currentUser ? `${currentUser.full_name} (${currentUser.role === 'admin' ? 'Yönetici' : 'Acente Personeli'})` : 'Giriş Yapılmadı'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'search'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Oda Arama & Fiyat
            </button>

            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'hotels'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Otel Yönetimi
            </button>

            <button
              onClick={() => setActiveTab('seasons')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'seasons'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Dönem Yönetimi
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'rooms'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              Oda & Fiyat Yönetimi
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'reservations'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Rezervasyonlar
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'users'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Kullanıcı Yönetimi
              </button>
            )}

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'database'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              SQL & Tablolar
            </button>
          </nav>

          {/* Zone 3: Active User & Role Switcher */}
          <div className="relative flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-all text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      currentUser.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}
                  >
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser.role === 'admin' ? 'Yönetici (Admin)' : 'Personel'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Aktif Oturum
                      </p>
                      <p className="text-sm font-bold text-slate-800">{currentUser.full_name}</p>
                      <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>
                      <div className="mt-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            currentUser.role === 'admin'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {currentUser.role === 'admin' ? 'Tam Yetkili Yönetici' : 'Acente Çalışanı'}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Hızlı Rol Değiştir (Test)
                      </p>
                      <div className="space-y-1">
                        {users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              setCurrentUser(u);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                              currentUser.id === u.id
                                ? 'bg-sky-50 text-sky-800 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="truncate">{u.full_name}</span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                              {u.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="px-2 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Oturumu Kapat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  const adminUser = users.find((u) => u.role === 'admin') || users[0];
                  setCurrentUser(adminUser);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'search' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            Oda Arama
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'hotels' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            Oteller
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'seasons' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            Dönemler
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'rooms' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            Odalar
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'reservations' ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
            }`}
          >
            Rezervasyonlar
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'users' ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600'
              }`}
            >
              Kullanıcılar
            </button>
          )}
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'database' ? 'bg-slate-200 text-slate-800' : 'text-slate-600'
            }`}
          >
            SQL
          </button>
        </div>
      </div>
    </header>
  );
};
