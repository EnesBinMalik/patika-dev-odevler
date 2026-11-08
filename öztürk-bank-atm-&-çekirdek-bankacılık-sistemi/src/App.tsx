/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Ana Uygulama Kapsayıcısı (Root Application Container)
 * - Çift arayüz: Fiziksel ATM Simülatörü & Web İnternet Bankacılığı
 * - Banka Yetkilisi (Admin) Portali
 * - Rol Bazlı Erişim Kontrolü (RBAC)
 * - UML & EER Diyagram Modalları
 */

import React, { useState, useEffect } from 'react';
import { User, Account } from './types/models';
import { Role, AccountStatus } from './types/enums';
import { LocalStorageBankRepository } from './core/repositories/LocalStorageBankRepository';
import { Navbar } from './components/Navbar';
import { AtmTerminalView } from './components/AtmTerminal/AtmTerminalView';
import { CustomerPortal } from './components/OnlineBanking/CustomerPortal';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { LoginModal } from './components/Auth/LoginModal';
import { RegisterModal } from './components/Auth/RegisterModal';
import { UmlDiagramModal } from './components/Diagrams/UmlDiagramModal';
import { EerDiagramModal } from './components/Diagrams/EerDiagramModal';
import { ArchitectureDocsModal } from './components/Diagrams/ArchitectureDocsModal';
import { soundEffects } from './utils/soundEffects';
import {
  CreditCard,
  Shield,
  Layers,
  Database,
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  UserCheck,
} from 'lucide-react';

export default function App() {
  const repository = LocalStorageBankRepository.getInstance();

  // Active Session & View
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [activeView, setActiveView] = useState<'ATM' | 'ONLINE' | 'ADMIN'>('ATM');

  // Modal Dialogs
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUmlOpen, setIsUmlOpen] = useState(false);
  const [isEerOpen, setIsEerOpen] = useState(false);
  const [isArchDocsOpen, setIsArchDocsOpen] = useState(false);

  // Auto-load default active customer (Ahmet Yılmaz) or persist session
  useEffect(() => {
    const users = repository.findAllUsers();
    // Default logged in user for immediate interactive exploration
    const defaultCust = users.find((u) => u.fullName.includes('Ahmet')) || users[1];
    if (defaultCust) {
      setCurrentUser(defaultCust);
      const acc = repository.findAccountByCustomerId(defaultCust.id).orElse(null as any);
      setCurrentAccount(acc);
    }
  }, []);

  const refreshData = () => {
    if (currentUser) {
      const refreshedUser = repository.findUserById(currentUser.id).orElse(null as any);
      if (refreshedUser) {
        setCurrentUser({ ...refreshedUser });
        const refreshedAcc = repository.findAccountByCustomerId(refreshedUser.id).orElse(null as any);
        setCurrentAccount(refreshedAcc ? { ...refreshedAcc } : null);
      }
    }
  };

  const handleLoginSuccess = (user: User, account?: Account) => {
    setCurrentUser(user);
    if (account) {
      setCurrentAccount(account);
    } else {
      const acc = repository.findAccountByCustomerId(user.id).orElse(null as any);
      setCurrentAccount(acc);
    }

    if (user.role === Role.ADMIN) {
      setActiveView('ADMIN');
    } else {
      setActiveView('ONLINE');
    }
  };

  const handleLogout = () => {
    soundEffects.playKeypadBeep();
    setCurrentUser(null);
    setCurrentAccount(null);
    setActiveView('ATM');
  };

  const loginAsAdminDirectly = () => {
    soundEffects.playSuccessChime();
    const admin = repository.findUserByEmail('enes.ozturk@ozturkbank.com.tr').orElse(null as any);
    if (admin) {
      setCurrentUser(admin);
      setCurrentAccount(null);
      setActiveView('ADMIN');
    }
  };

  const loginAsCustomerDirectly = () => {
    soundEffects.playSuccessChime();
    const cust = repository.findUserByTcNo('23456789012').orElse(null as any);
    if (cust) {
      setCurrentUser(cust);
      const acc = repository.findAccountByCustomerId(cust.id).orElse(null as any);
      setCurrentAccount(acc);
      setActiveView('ONLINE');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentAccount={currentAccount}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenUml={() => setIsUmlOpen(true)}
        onOpenEer={() => setIsEerOpen(true)}
        onOpenArchDocs={() => setIsArchDocsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selector Strip */}
        <div className="mb-8 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEffects.playKeypadBeep(650);
                setActiveView('ATM');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'ATM'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              1. Fiziksel ATM Terminali Simülatörü
            </button>

            <button
              onClick={() => {
                soundEffects.playKeypadBeep(650);
                setActiveView('ONLINE');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'ONLINE'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              2. Müşteri İnternet Bankacılığı
            </button>

            <button
              onClick={() => {
                soundEffects.playKeypadBeep(650);
                setActiveView('ADMIN');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              3. Banka Yetkilisi (Admin) Portali
            </button>
          </div>

          {/* Quick Architecture Triggers */}
          <div className="hidden lg:flex items-center gap-2 pr-2 text-xs">
            <button
              onClick={() => setIsUmlOpen(true)}
              className="text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" /> UML Şeması
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setIsEerOpen(true)}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" /> EER Tabloları
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setIsArchDocsOpen(true)}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" /> S.O.L.I.D Prensipleri
            </button>
          </div>
        </div>

        {/* VIEW 1: Physical ATM Terminal Mode */}
        {activeView === 'ATM' && (
          <AtmTerminalView
            currentUser={currentUser}
            currentAccount={currentAccount}
            onRefreshData={refreshData}
            onSwitchToOnlinePortal={() => setActiveView('ONLINE')}
          />
        )}

        {/* VIEW 2: Online Banking Customer Portal */}
        {activeView === 'ONLINE' && (
          currentUser && currentAccount && currentUser.role === Role.USER ? (
            <CustomerPortal
              user={currentUser}
              account={currentAccount}
              onRefreshData={refreshData}
              onSwitchToAtm={() => setActiveView('ATM')}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Müşteri Girişi Gerekli</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                İnternet bankacılığı portaline erişmek için lütfen bir müşteri hesabı ile giriş yapınız.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={loginAsCustomerDirectly}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Demo Müşteri (Ahmet Yılmaz) Olarak Aç
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Farklı Hesapla Giriş Yap
                </button>
              </div>
            </div>
          )
        )}

        {/* VIEW 3: Bank Admin Portal */}
        {activeView === 'ADMIN' && (
          currentUser?.role === Role.ADMIN ? (
            <AdminDashboard adminUser={currentUser} onRefreshData={refreshData} />
          ) : (
            <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">Banka Yetkilisi (Admin) Girişi Gerekli</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bu alana yalnızca şube yöneticileri erişebilir. Günlük müşteri girişlerini izlemek ve bloke hesapları yönetmek için yönetici girişi yapınız.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={loginAsAdminDirectly}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  Admin Olarak Aç (Enes Öztürk)
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Yetkili Giriş Formu
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer with Mandatory Enes Öztürk Signature */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              Ö
            </div>
            <span>
              © 2026 ÖZTÜRK BANK A.Ş. · Kadıköy Merkez Şubesi (3401)
            </span>
          </div>

          {/* Architectural Badge & Signature */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Mimari &amp; Yazılım Tasarımı: <strong className="text-amber-400">Enes Öztürk</strong>
            </span>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setIsArchDocsOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              S.O.L.I.D Standartları
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={(u, a) => {
          setCurrentUser(u);
          setCurrentAccount(a);
          setActiveView('ONLINE');
        }}
      />

      <UmlDiagramModal isOpen={isUmlOpen} onClose={() => setIsUmlOpen(false)} />
      <EerDiagramModal isOpen={isEerOpen} onClose={() => setIsEerOpen(false)} />
      <ArchitectureDocsModal isOpen={isArchDocsOpen} onClose={() => setIsArchDocsOpen(false)} />
    </div>
  );
}
