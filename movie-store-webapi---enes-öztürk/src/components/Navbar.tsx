/**
 * Top Navigation Bar with Enes Öztürk Signature, Customer Session & View Selector
 * Author: Enes Öztürk
 */

import React from 'react';
import {
  Film,
  Terminal,
  Layers,
  TestTube2,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CustomerAuthSession } from '../types.ts';

interface NavbarProps {
  activeTab: 'store' | 'api' | 'admin' | 'tests' | 'logs' | 'arch';
  setActiveTab: (tab: 'store' | 'api' | 'admin' | 'tests' | 'logs' | 'arch') => void;
  customerSession: CustomerAuthSession | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  customerSession,
  onOpenAuthModal,
  onLogout,
  onResetDb,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Signature */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent">
                  MovieStore WebApi
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Clean Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                Geliştirici: <span className="text-rose-400 font-medium">Enes Öztürk</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'store'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Film Mağazası
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'api'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Swagger API Explorer
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Yönetim (CRUD)
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'tests'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <TestTube2 className="w-3.5 h-3.5" />
              Birim Testleri (100%)
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'logs'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Middleware Logları
            </button>

            <button
              onClick={() => setActiveTab('arch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'arch'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Mimari & Şemalar
            </button>
          </nav>

          {/* User Session & Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={onResetDb}
              title="Veritabanını ilk tohum (seed) verilerine sıfırla"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden lg:inline">Sıfırla</span>
            </button>

            {customerSession ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {customerSession.customer.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Müşteri (Rol: Customer)
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-xs">
                  {customerSession.customer.firstName[0]}
                </div>

                <button
                  onClick={onLogout}
                  title="Oturumu Kapat"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-all shadow-md shadow-rose-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Müşteri Girişi</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-850 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'store' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            Mağaza
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'api' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Swagger
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            Yönetim
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'tests' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Birim Testleri
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'logs' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Loglar
          </button>
          <button
            onClick={() => setActiveTab('arch')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'arch' ? 'bg-cyan-600 text-white' : 'text-slate-400'
            }`}
          >
            Mimari
          </button>
        </div>
      </div>
    </header>
  );
};
