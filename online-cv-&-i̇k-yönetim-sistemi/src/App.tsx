/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D, Clean Code, Stream API, Optional & Katmanlı Mimari Ana Giriş Noktası
 */

import React, { useState, useEffect } from 'react';
import { AuthService } from './services/AuthService';
import { AdminHRService } from './services/AdminHRService';
import { UserEntity } from './types/models';
import { Role } from './types/enums';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HRDashboard } from './components/HRDashboard';
import { UserDashboard } from './components/UserDashboard';
import { AuditLogsView } from './components/AuditLogsView';
import { DiagramViewer } from './components/DiagramViewer';
import { ShieldCheck, UserCheck, Code, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const authService = AuthService.getInstance();
  const hrService = AdminHRService.getInstance();

  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [activeView, setActiveView] = useState<'HR_DASHBOARD' | 'USER_DASHBOARD' | 'LOGS' | 'DIAGRAMS'>('HR_DASHBOARD');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [blockedCount, setBlockedCount] = useState(0);

  const refreshUser = () => {
    const opt = authService.getCurrentUser();
    if (opt.isPresent()) {
      const u = opt.get();
      setCurrentUser(u);
      // Eğer kullanıcı rolü değiştiyse uygun ekrana yönlendir
      if (u.role === Role.ADMIN) {
        setActiveView('HR_DASHBOARD');
      } else {
        setActiveView('USER_DASHBOARD');
      }
    } else {
      // Varsayılan olarak Admin hesabı ile başla (İnceleme kolaylığı için)
      autoLoginAdmin();
    }
    setBlockedCount(hrService.getBlockedUsers().length);
  };

  const autoLoginAdmin = async () => {
    const res = await authService.login('ik_yonetici', 'admin123');
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setActiveView('HR_DASHBOARD');
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthOpen(true);
    setAuthMode('LOGIN');
  };

  const handleQuickRoleSwitch = async (targetRole: Role) => {
    if (targetRole === Role.ADMIN) {
      const res = await authService.login('ik_yonetici', 'admin123');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setActiveView('HR_DASHBOARD');
      }
    } else {
      const res = await authService.login('burak.demir', 'user123');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setActiveView('USER_DASHBOARD');
      }
    }
    setBlockedCount(hrService.getBlockedUsers().length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Developer Banner */}
      <div className="no-print bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Online CV & İnsan Kaynakları Portalı</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              Geliştirici: <strong className="text-white">Enes Öztürk</strong> (S.O.L.I.D, Clean Code & Spring Boot Katmanlı Mimari)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setActiveView('DIAGRAMS')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              UML & Database EER Diyagramları
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-amber-300">
              Mevcut Rol: <strong>{currentUser?.role === Role.ADMIN ? 'İnsan Kaynakları (Admin)' : 'Aday (User)'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsAuthOpen(true);
          setAuthMode('LOGIN');
        }}
        onLogout={handleLogout}
        activeView={activeView}
        onNavigate={setActiveView}
        onQuickRoleSwitch={handleQuickRoleSwitch}
        blockedCount={blockedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'HR_DASHBOARD' && <HRDashboard />}
        {activeView === 'USER_DASHBOARD' && currentUser && (
          <UserDashboard currentUser={currentUser} />
        )}
        {activeView === 'LOGS' && <AuditLogsView />}
        {activeView === 'DIAGRAMS' && <DiagramViewer />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          refreshUser();
          setIsAuthOpen(false);
        }}
        initialMode={authMode}
      />
    </div>
  );
}
