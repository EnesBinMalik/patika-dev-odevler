import React, { useState } from 'react';
import { Account, AccountManager } from './types/insurance';
import { createInitialAccountManager } from './data/initialData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TerminalSimulator } from './components/TerminalSimulator';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { UmlArchitecture } from './components/UmlArchitecture';
import { AccountPickerModal } from './components/AccountPickerModal';
import { FooterSignature } from './components/FooterSignature';
import { Shield, UserPlus, Terminal, Code2 } from 'lucide-react';

export default function App() {
  const [accountManager] = useState<AccountManager>(() => createInitialAccountManager());
  const [accounts, setAccounts] = useState<Account[]>(() => accountManager.getAccounts());
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    const list = accountManager.getAccounts();
    return list.length > 0 ? list[0] : null;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'terminal' | 'source' | 'uml'>('dashboard');
  const [isAccountPickerOpen, setIsAccountPickerOpen] = useState(false);
  const [, setTick] = useState(0);

  const forceUpdate = () => {
    setAccounts(accountManager.getAccounts());
    setTick((t) => t + 1);
  };

  const handleSelectAccount = (account: Account) => {
    setActiveAccount(account);
    forceUpdate();
  };

  const handleLogout = () => {
    if (activeAccount) {
      activeAccount.logout();
    }
    setActiveAccount(null);
    forceUpdate();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Navigation Top Bar conforming to Top Bar Contract */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeAccount={activeAccount}
          onLogout={handleLogout}
          onOpenAccountPicker={() => setIsAccountPickerOpen(true)}
        />

        {/* Hero Quick Switcher / Handcrafted Signature Strip */}
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-200">
                Ödev: Sigorta Yönetim Sistemi (Java OOP Mimarisi)
              </span>
              <span className="text-slate-500 hidden md:inline">·</span>
              <span className="text-slate-400 hidden md:inline">
                Hazırlayan & İmzalı: <strong>Enes Öztürk</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Aktif TreeSet:</span>
              <div className="flex items-center gap-1.5">
                {accounts.map((acc) => {
                  const isCurrent = activeAccount?.user.email === acc.user.email;
                  return (
                    <button
                      key={acc.user.email}
                      onClick={() => handleSelectAccount(acc)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isCurrent
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {acc.user.firstName} ({acc.accountType === 'INDIVIDUAL' ? 'Bireysel' : 'Kurumsal'})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <>
              {activeAccount ? (
                <DashboardView
                  account={activeAccount}
                  onUpdateAccount={forceUpdate}
                  onOpenTerminal={() => setActiveTab('terminal')}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs max-w-lg mx-auto">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h2 className="text-base font-bold text-slate-900">
                    Oturum Açık Değil
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 mb-6 leading-relaxed">
                    Müşteri portalını görüntülemek için lütfen mevcut TreeSet hesaplarından birini seçin veya yeni bir hesap oluşturun.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsAccountPickerOpen(true)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      Giriş Yap / Hesap Seç
                    </button>
                    <button
                      onClick={() => setActiveTab('terminal')}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Scanner Terminali Aç</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'terminal' && (
            <TerminalSimulator
              accountManager={accountManager}
              onLoginSuccess={handleSelectAccount}
              activeAccount={activeAccount}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'source' && <SourceCodeViewer />}

          {activeTab === 'uml' && (
            <UmlArchitecture
              accountManager={accountManager}
              onRefresh={forceUpdate}
            />
          )}
        </main>
      </div>

      {/* Account Picker & Login Modal */}
      <AccountPickerModal
        isOpen={isAccountPickerOpen}
        onClose={() => setIsAccountPickerOpen(false)}
        accountManager={accountManager}
        onSelectAccount={handleSelectAccount}
      />

      {/* Handcrafted Footer Signature by Enes Öztürk */}
      <FooterSignature />
    </div>
  );
}
