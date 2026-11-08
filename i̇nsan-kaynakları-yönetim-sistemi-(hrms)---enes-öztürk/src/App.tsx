/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * İnsan Kaynakları Yönetim Sistemi (HRMS)
 * Spring Boot Katmanlı Mimari & S.O.L.I.D Standartları
 * Geliştirici & Sistem Mimarı: Enes Öztürk
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EmployeeManagement } from './components/EmployeeManagement';
import { SalaryManagement } from './components/SalaryManagement';
import { LeaveManagement } from './components/LeaveManagement';
import { AuditLogView } from './components/AuditLogView';
import { DatabaseIOView } from './components/DatabaseIOView';
import { ArchitectureDiagrams } from './components/ArchitectureDiagrams';
import { EmployeePortal } from './components/EmployeePortal';
import { AuthModal } from './components/AuthModal';
import { HRService } from './services/hrService';
import { DatabaseEngine } from './core/database';
import { IUser, Role } from './models/types';
import { ShieldCheck, UserCheck, Code2, Database, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const hrService = HRService.getInstance();
  const db = DatabaseEngine.getInstance();

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Uygulama başlangıcında varsayılan olarak İK Admin (Enes Öztürk) ile aç
  useEffect(() => {
    db.initialize().then(() => {
      const users = db.getUsers();
      const admin = users.find(u => u.role === Role.ADMIN) || users[0];
      if (admin) {
        hrService.setCurrentUser(admin);
        setCurrentUser(admin);
      }
      setRefreshTrigger(prev => prev + 1);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    hrService.setCurrentUser(null);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: IUser) => {
    hrService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === Role.ADMIN) {
      setActiveView('dashboard');
    } else {
      setActiveView('portal');
    }
    setRefreshTrigger(prev => prev + 1);
  };

  // Hızlı Rol Değiştirme (Test Kolaylığı)
  const handleQuickSwitchRole = (targetRole: Role) => {
    const users = db.getUsers();
    if (targetRole === Role.ADMIN) {
      const admin = users.find(u => u.role === Role.ADMIN);
      if (admin) {
        hrService.setCurrentUser(admin);
        setCurrentUser(admin);
        setActiveView('dashboard');
      }
    } else {
      const user = users.find(u => u.role === Role.USER && !u.isLocked);
      if (user) {
        hrService.setCurrentUser(user);
        setCurrentUser(user);
        setActiveView('portal');
      }
    }
    handleRefresh();
  };

  const isAdmin = currentUser?.role === Role.ADMIN;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Hızlı Rol & Test Çubuğu (Proje İnceleme Kolaylığı) */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">
            Enes Öztürk İnsan Kaynakları Portalı
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Spring Data @OneToMany / @ManyToOne · 3 Hatalı Giriş Kilidi · I/O Dosya & DB Kayıt
          </span>
        </div>

        {/* Hızlı Rol Değiştirme Düğmeleri */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Aktif Rol Testi:</span>
          <button
            onClick={() => handleQuickSwitchRole(Role.ADMIN)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              isAdmin
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>İK Admini (Enes)</span>
          </button>
          <button
            onClick={() => handleQuickSwitchRole(Role.USER)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              !isAdmin && currentUser
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Çalışan (Ahmet)</span>
          </button>
        </div>
      </div>

      {/* 2. Navigasyon Çubuğu */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onSelectView={setActiveView}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Ana İçerik Alanı */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Görünüm Yönlendirmeleri */}
        {activeView === 'architecture' && <ArchitectureDiagrams />}

        {/* ADMIN GÖRÜNÜMLERİ */}
        {isAdmin && (
          <>
            {activeView === 'dashboard' && (
              <DashboardView onNavigate={setActiveView} onRefresh={handleRefresh} />
            )}
            {activeView === 'employees' && (
              <EmployeeManagement onRefresh={handleRefresh} />
            )}
            {activeView === 'salaries' && (
              <SalaryManagement onRefresh={handleRefresh} />
            )}
            {activeView === 'leaves' && (
              <LeaveManagement onRefresh={handleRefresh} />
            )}
            {activeView === 'audit' && (
              <AuditLogView />
            )}
            {activeView === 'database-io' && (
              <DatabaseIOView onRefresh={handleRefresh} />
            )}
          </>
        )}

        {/* USER (ÇALIŞAN) GÖRÜNÜMLERİ */}
        {!isAdmin && currentUser && (
          <>
            {(activeView === 'portal' || activeView === 'my-leaves' || activeView === 'my-salary') && (
              <EmployeePortal currentUser={currentUser} onRefresh={handleRefresh} />
            )}
          </>
        )}

        {/* Oturum Açılmamışsa */}
        {!currentUser && activeView !== 'architecture' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              İnsan Kaynakları Yönetim Sistemi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sisteme devam etmek için lütfen İnsan Kaynakları Uzmanı (Admin) veya Çalışan (User) hesabı ile giriş yapınız.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Giriş Yap / Kayıt Ol
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Alt Bilgi & Enes Öztürk İmzası */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="font-bold text-slate-900">
                İnsan Kaynakları Yönetim Sistemi (HRMS) — Enes Öztürk İmzalı
              </div>
              <p className="text-[11px] text-slate-500">
                Spring Boot Katmanlı Mimari (Controller, Service, Repository), S.O.L.I.D Prensipleri, Stream API, Optional & Design Patterns.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
              <button
                onClick={() => setActiveView('architecture')}
                className="hover:text-indigo-600 transition-colors"
              >
                UML Sınıf Diyagramı
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveView('architecture')}
                className="hover:text-indigo-600 transition-colors"
              >
                EER Veritabanı Modeli
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveView('database-io')}
                className="hover:text-indigo-600 transition-colors"
              >
                I/O Dosya Kaydı
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Kimlik Doğrulama Modalı */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
