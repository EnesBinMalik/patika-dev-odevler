/**
 * Main Application Component: Movie Store WebApi
 * Developer & Signature: Enes Öztürk
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Storefront } from './components/Storefront.tsx';
import { ApiExplorer } from './components/ApiExplorer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { UnitTestRunnerView } from './components/UnitTestRunnerView.tsx';
import { LiveLogsViewer } from './components/LiveLogsViewer.tsx';
import { ArchitectureView } from './components/ArchitectureView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { api } from './api/client.ts';
import { GenreDto, CustomerAuthSession } from './types.ts';
import { Heart, ShieldCheck, Terminal, Film, Code, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'api' | 'admin' | 'tests' | 'logs' | 'arch'>('store');
  const [customerSession, setCustomerSession] = useState<CustomerAuthSession | null>(null);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check existing customer session from localStorage via api client
    const currentCustomer = api.getCurrentCustomer();
    const token = api.getToken();
    if (currentCustomer && token) {
      setCustomerSession({ token, customer: currentCustomer });
    }

    // Load default seed genres
    api.getGenres()
      .then(setGenres)
      .catch(err => console.error('Film türleri yüklenemedi:', err));
  }, []);

  const handleAuthSuccess = (session: CustomerAuthSession) => {
    setCustomerSession(session);
  };

  const handleLogout = () => {
    api.setSession(null);
    setCustomerSession(null);
  };

  const handleResetDb = async () => {
    if (confirm('Tüm veritabanı ilk tohum (seed) haline döndürülecektir. Onaylıyor musunuz?')) {
      try {
        await api.resetDatabase();
        alert('Veritabanı başarıyla sıfırlandı.');
        window.location.reload();
      } catch (err: any) {
        alert('Sıfırlama hatası: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customerSession={customerSession}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onResetDb={handleResetDb}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'store' && (
          <Storefront
            customerSession={customerSession}
            genres={genres}
            onOpenAuth={() => setShowAuthModal(true)}
            onNavigateToApi={() => setActiveTab('api')}
          />
        )}

        {activeTab === 'api' && (
          <ApiExplorer customerSession={customerSession} />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}

        {activeTab === 'tests' && (
          <UnitTestRunnerView />
        )}

        {activeTab === 'logs' && (
          <LiveLogsViewer />
        )}

        {activeTab === 'arch' && (
          <ArchitectureView />
        )}
      </main>

      {/* Customer Login / Register Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        genres={genres}
      />

      {/* Footer with Developer Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Movie Store WebApi</span>
            <span>—</span>
            <span className="text-rose-400 font-medium flex items-center gap-1">
              Enes Öztürk İmzalıdır
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Clean Architecture</span>
            <span>•</span>
            <span>AutoMapper & DTO</span>
            <span>•</span>
            <span>FluentValidation</span>
            <span>•</span>
            <span>JWT & DI Container</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
