/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Daire, Kullanici, FaturaAidat, Odeme, Mesaj } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { ResidentPanel } from './components/ResidentPanel';
import { ArchitectureView } from './components/ArchitectureView';
import { ReceiptModal } from './components/ReceiptModal';
import {
  Building2, Users, ShieldCheck, Key, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Layers, CreditCard
} from 'lucide-react';

export default function App() {
  const [daireler, setDaireler] = useState<Daire[]>([]);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [faturalar, setFaturalar] = useState<FaturaAidat[]>([]);
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);

  const [activeView, setActiveView] = useState<'admin' | 'resident' | 'architecture'>('admin');
  const [currentUser, setCurrentUser] = useState<Kullanici | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Odeme | null>(null);

  // Initial load from storage
  useEffect(() => {
    const loadedDaireler = StorageService.getDaireler();
    const loadedKullanicilar = StorageService.getKullanicilar();
    const loadedFaturalar = StorageService.getFaturalar();
    const loadedOdemeler = StorageService.getOdemeler();
    const loadedMesajlar = StorageService.getMesajlar();

    setDaireler(loadedDaireler);
    setKullanicilar(loadedKullanicilar);
    setFaturalar(loadedFaturalar);
    setOdemeler(loadedOdemeler);
    setMesajlar(loadedMesajlar);

    // Default user: Admin (Enes Öztürk)
    const adminUser = loadedKullanicilar.find((u) => u.rol === 'Admin') || loadedKullanicilar[0];
    setCurrentUser(adminUser);
  }, []);

  const handleResetData = () => {
    StorageService.resetToDefault();
    setDaireler(StorageService.getDaireler());
    setKullanicilar(StorageService.getKullanicilar());
    setFaturalar(StorageService.getFaturalar());
    setOdemeler(StorageService.getOdemeler());
    setMesajlar(StorageService.getMesajlar());
    const admin = StorageService.getKullanicilar().find((u) => u.rol === 'Admin');
    if (admin) setCurrentUser(admin);
    setActiveView('admin');
  };

  const handleSelectUser = (user: Kullanici) => {
    setCurrentUser(user);
    if (user.rol === 'Admin') {
      setActiveView('admin');
    } else {
      setActiveView('resident');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
        Sistem yükleniyor...
      </div>
    );
  }

  const userDaire = daireler.find((d) => d.id === currentUser.daireId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar adhering to 3-zone contract */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        currentUser={currentUser}
        allUsers={kullanicilar}
        onSelectUser={handleSelectUser}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Estate Header Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 text-white">
          {/* Background Image with Contrast Scrim */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/residential_complex_hero_1793952701705.jpg"
              alt="Güneştepe Rezidans ve Konutları"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <span>Güneştepe Sitesi ve Rezidans Yönetimi</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">Enes Öztürk İmzalı</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Daire, Sakin, Aidat ve Fatura Yönetim Otomasyonu
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Ortak kullanım elektrik, su, doğalgaz faturaları ve aylık aidatların mülk ve sakin bazında takibi,
                kredi kartı servisi ile güvenli online tahsilat ve aylık borç-alacak mizan raporlaması.
              </p>
            </div>

            {/* Quick Persona Switch Strip */}
            <div className="bg-slate-950/70 backdrop-blur-md rounded-xl p-4 border border-slate-700/70 space-y-3 min-w-[280px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Şu An Giriş Yapılan:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                  {currentUser.rol === 'Admin' ? 'Site Yöneticisi' : 'Sakin'}
                </span>
              </div>

              <div>
                <span className="text-sm font-bold text-white block">{currentUser.adSoyad}</span>
                <span className="text-xs text-slate-400 block font-mono">
                  {currentUser.rol === 'Admin'
                    ? 'Yönetici Hesabı'
                    : userDaire
                    ? `${userDaire.blok} No: ${userDaire.daireNo} (${userDaire.mulkTipi})`
                    : 'Daire Atanmadı'}
                </span>
              </div>

              {currentUser.rol === 'Kullanici' && (
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Giriş Şifresi:</span>
                  <span className="font-mono font-bold text-indigo-400">{currentUser.sifre}</span>
                </div>
              )}

              <div className="pt-1 flex items-center gap-2">
                {currentUser.rol === 'Admin' ? (
                  <button
                    onClick={() => {
                      const sakin = kullanicilar.find((u) => u.id === 'u-1') || kullanicilar[1];
                      handleSelectUser(sakin);
                    }}
                    className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Sakin Olarak Test Et (Ahmet Yılmaz)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const admin = kullanicilar.find((u) => u.rol === 'Admin') || kullanicilar[0];
                      handleSelectUser(admin);
                    }}
                    className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Yönetici Paneline Dön (Enes Öztürk)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic View Rendering */}
        {activeView === 'admin' && (
          <AdminPanel
            daireler={daireler}
            kullanicilar={kullanicilar}
            faturalar={faturalar}
            odemeler={odemeler}
            mesajlar={mesajlar}
            onUpdateDaireler={setDaireler}
            onUpdateKullanicilar={setKullanicilar}
            onUpdateFaturalar={setFaturalar}
            onUpdateMesajlar={setMesajlar}
            onShowReceipt={setSelectedReceipt}
          />
        )}

        {activeView === 'resident' && (
          <ResidentPanel
            kullanici={currentUser}
            daireler={daireler}
            faturalar={faturalar}
            odemeler={odemeler}
            mesajlar={mesajlar}
            onUpdateFaturalar={setFaturalar}
            onUpdateOdemeler={setOdemeler}
            onUpdateMesajlar={setMesajlar}
            onShowReceipt={setSelectedReceipt}
          />
        )}

        {activeView === 'architecture' && <ArchitectureView />}
      </main>

      {/* Global Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          odeme={selectedReceipt}
          daire={daireler.find((d) => d.id === selectedReceipt.daireId)}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© 2026 Güneştepe Sitesi Yönetim Otomasyonu</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Tasarım ve Geliştirme: <strong className="text-slate-800">Enes Öztürk</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>.NET 5 MVC</span>
            <span aria-hidden="true">·</span>
            <span>MS SQL Server</span>
            <span aria-hidden="true">·</span>
            <span>MongoDB WebAPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
