/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Öztürk Bank - ATM & Kurumsal Bankacılık Sistemi
 * Baş Mimarlık & Tasarım: ENES ÖZTÜRK
 * Standartlar: S.O.L.I.D, Clean Code, OOP (Stream, Optional, Enum), Katmanlı Mimari
 */

import React, { useState, useEffect } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { AtmView } from './components/AtmView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UmlDiagramView } from './components/UmlDiagramView';
import { EerDiagramView } from './components/EerDiagramView';
import { SpringBootArchitectureModal } from './components/SpringBootArchitectureModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { DatabaseManager } from './core/database/DatabaseManager';
import { User } from './core/models/User';
import { Account } from './core/models/Account';
import { Transaction } from './core/models/Transaction';
import { BankEventSubject } from './core/patterns/BankEventObserver';

export default function App() {
  const db = DatabaseManager.getInstance();

  // Aktif Ekran Görünüm Modu
  const [currentView, setCurrentView] = useState<AppViewMode>('atm');

  // Oturum Açmış Kullanıcı
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // İlk açılışta değerlendirme kolaylığı için Ahmet Yılmaz (Müşteri) ile başlatalım
    const ahmet = db.users.findByTcNo('11111111111');
    return ahmet.isPresent() ? ahmet.get() : null;
  });

  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    if (currentUser) {
      return db.accounts.findPrimaryByUserId(currentUser.id).orElse(null as unknown as Account);
    }
    return null;
  });

  // Dekont Modalı Durumu
  const [receiptData, setReceiptData] = useState<{
    tx: Transaction | null;
    account?: Account;
    user?: User;
  }>({ tx: null });

  // Giriş Modalı
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Veri Güncelleme Tetikleyicisi
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Observer Pattern: Olay dinleyicisi ekle
  useEffect(() => {
    const observer = BankEventSubject.getInstance();
    const unsubscribe = observer.subscribe({
      onBankEvent: (event) => {
        // Sistem olaylarında UI state'ini tazele
        setRefreshTick(prev => prev + 1);
      }
    });
    return () => unsubscribe();
  }, []);

  // Kullanıcı Giriş Yaptığında
  const handleUserLogin = (user: User, account?: Account) => {
    setCurrentUser(user);
    const acc = account || db.accounts.findPrimaryByUserId(user.id).orElse(null as unknown as Account);
    setActiveAccount(acc);
    setRefreshTick(prev => prev + 1);

    if (user.isAdmin()) {
      setCurrentView('admin');
    }
  };

  // Güvenli Çıkış
  const handleUserLogout = () => {
    setCurrentUser(null);
    setActiveAccount(null);
    setRefreshTick(prev => prev + 1);
  };

  // Fabrika Ayarlarına Sıfırlama
  const handleResetDb = () => {
    if (window.confirm('Tüm veritabanı başlangıç test verilerine (Ahmet, Zeynep, Mehmet, Ayşe ve Admin Enes Öztürk) sıfırlansın mı?')) {
      db.resetToFactoryDefaults();
      const freshAhmet = db.users.findByTcNo('11111111111').orElse(null as unknown as User);
      setCurrentUser(freshAhmet);
      setActiveAccount(freshAhmet ? db.accounts.findPrimaryByUserId(freshAhmet.id).orElse(null as unknown as Account) : null);
      setRefreshTick(prev => prev + 1);
      alert('Öztürk Bank veritabanı başarıyla ilk durumuna sıfırlandı.');
    }
  };

  // Dekont Açma
  const handleShowReceipt = (tx: Transaction, acc?: Account, usr?: User) => {
    setReceiptData({
      tx,
      account: acc || activeAccount || undefined,
      user: usr || currentUser || undefined
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Üst Navigasyon */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleUserLogout}
        onResetDb={handleResetDb}
      />

      {/* Ana İçerik Alanı */}
      <main className="flex-1">
        {currentView === 'atm' && (
          <AtmView
            currentUser={currentUser}
            onUserLogin={handleUserLogin}
            onUserLogout={handleUserLogout}
            onShowReceipt={handleShowReceipt}
          />
        )}

        {currentView === 'customer' && (
          currentUser ? (
            <CustomerDashboard
              key={`${currentUser.id}-${refreshTick}`}
              currentUser={currentUser}
              onShowReceipt={handleShowReceipt}
              onRefreshData={() => setRefreshTick(prev => prev + 1)}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
              <h2 className="text-xl font-bold text-white">Müşteri Girişi Gerekli</h2>
              <p className="text-xs text-slate-400">
                İnternet bankacılığı panelinizi görüntülemek için lütfen müşteri hesabınız ile giriş yapınız.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/30"
              >
                Giriş Yap / Kaydol
              </button>
            </div>
          )
        )}

        {currentView === 'admin' && (
          currentUser && currentUser.isAdmin() ? (
            <AdminDashboard
              key={`admin-${refreshTick}`}
              currentUser={currentUser}
              onRefreshAll={() => setRefreshTick(prev => prev + 1)}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-white">Yönetici Yetkisi Gerekli</h2>
              <p className="text-xs text-slate-400">
                Bu alana yalnızca banka yöneticileri ve sistem denetçileri erişebilir.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/30"
              >
                Yönetici Olarak Giriş Yap (Enes Öztürk)
              </button>
            </div>
          )
        )}

        {currentView === 'uml' && <UmlDiagramView />}

        {currentView === 'eer' && <EerDiagramView />}

        {currentView === 'springboot' && <SpringBootArchitectureModal />}
      </main>

      {/* Alt Bilgi & Enes Öztürk İmzası */}
      <Footer onOpenArchitecture={() => setCurrentView('springboot')} />

      {/* Resmi İşlem Dekontu Modalı */}
      <ReceiptModal
        transaction={receiptData.tx}
        account={receiptData.account}
        user={receiptData.user}
        onClose={() => setReceiptData({ tx: null })}
      />

      {/* Giriş & Kayıt Modalı */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleUserLogin}
      />
    </div>
  );
}
