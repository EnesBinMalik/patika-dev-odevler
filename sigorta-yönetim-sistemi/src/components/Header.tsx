import React from 'react';
import { Account } from '../types/insurance';
import { Shield, Terminal, Code2, Network, UserCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'terminal' | 'source' | 'uml';
  setActiveTab: (tab: 'dashboard' | 'terminal' | 'source' | 'uml') => void;
  activeAccount: Account | null;
  onLogout: () => void;
  onOpenAccountPicker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeAccount,
  onLogout,
  onOpenAccountPicker,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                Sigorta Yönetim Sistemi
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Enes Öztürk İmzalı · OOP Java
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Müşteri Portalı</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'terminal'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Klavye / Scanner CLI</span>
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'source'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Java Kaynak Kodları</span>
            </button>

            <button
              onClick={() => setActiveTab('uml')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'uml'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>UML & TreeSet</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Active Account */}
          <div className="flex items-center gap-3 shrink-0">
            {activeAccount ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAccountPicker}
                  title="Hesap Değiştir"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold">{activeAccount.user.getFullName()}</span>
                  <span className="text-slate-500 hidden sm:inline">
                    ({activeAccount.accountType === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'})
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title="Oturumu Kapat"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAccountPicker}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Giriş Yap / Hesap Seç
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
