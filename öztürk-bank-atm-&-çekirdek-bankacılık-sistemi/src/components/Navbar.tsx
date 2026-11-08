/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Top Bar Contract:
 * [Brand title, one line] — [4–5 nav links, 1–2 word labels, single-line] — [1 primary action]
 */

import React from 'react';
import { User, Account } from '../types/models';
import { Role } from '../types/enums';
import { LogOut, User as UserIcon, Shield, Layers, Database, Award } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  currentUser: User | null;
  currentAccount: Account | null;
  activeView: 'ATM' | 'ONLINE' | 'ADMIN';
  onNavigate: (view: 'ATM' | 'ONLINE' | 'ADMIN') => void;
  onOpenUml: () => void;
  onOpenEer: () => void;
  onOpenArchDocs: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentAccount,
  activeView,
  onNavigate,
  onOpenUml,
  onOpenEer,
  onOpenArchDocs,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('ATM')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            Ö
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
              ÖZTÜRK BANK
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 single-line clean text links with subtle hover */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onNavigate('ATM');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'ATM' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Fiziksel ATM
          </button>

          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onNavigate('ONLINE');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'ONLINE' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            İnternet Şubesi
          </button>

          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onNavigate('ADMIN');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'ADMIN' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
            }`}
          >
            Yönetim Portali
          </button>

          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onOpenUml();
            }}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            UML Diyagramı
          </button>

          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onOpenEer();
            }}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            EER Şeması
          </button>

          <button
            onClick={() => {
              soundEffects.playKeypadBeep(700);
              onOpenArchDocs();
            }}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            S.O.L.I.D &amp; Mimari
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-amber-400 font-mono">
                  {currentUser.role === Role.ADMIN ? 'Banka Yetkilisi' : 'Müşteri'}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Güvenli Çıkış"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRegister}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Hesap Aç
              </button>
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
              >
                Giriş Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
