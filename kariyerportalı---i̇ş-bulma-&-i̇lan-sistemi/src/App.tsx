/**
 * @license
 * Enes Öztürk - KariyerPortalı & İstihdam Sistemi
 * Core Root Application
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CompanyPortal } from './components/CompanyPortal.tsx';
import { CandidatePortal } from './components/CandidatePortal.tsx';
import { DiagramViewer } from './components/DiagramViewer.tsx';
import { DatabaseAndIOViewer } from './components/DatabaseAndIOViewer.tsx';
import { LogViewer } from './components/LogViewer.tsx';
import { SwaggerViewer } from './components/SwaggerViewer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal.tsx';
import { DatabaseService } from './core/services/DatabaseService.ts';
import { User } from './core/entities/UserEntity.ts';
import { Role } from './core/types/enums.ts';

export default function App() {
  const db = DatabaseService.getInstance();

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('company');

  // Currently authenticated user (defaults to Demo Admin for immediate exploration)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return db.users.findByEmail('admin@teknolojias.com').orElse(null as any);
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Re-render trigger when database updates
  const [, setDbTick] = useState(0);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDbTick(tick => tick + 1);
    });
    return () => unsubscribe();
  }, [db]);

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.getRole() === Role.ADMIN) {
      setActiveTab('company');
    } else {
      setActiveTab('candidate');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3-Zone Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onSelectUser={setCurrentUser}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'company' && (
          <CompanyPortal currentUser={currentUser} onOpenAuth={() => handleOpenAuthModal('login')} />
        )}

        {activeTab === 'candidate' && (
          <CandidatePortal currentUser={currentUser} onOpenAuth={() => handleOpenAuthModal('login')} />
        )}

        {activeTab === 'diagrams' && <DiagramViewer />}

        {activeTab === 'database-io' && <DatabaseAndIOViewer />}

        {activeTab === 'logs' && <LogViewer />}

        {activeTab === 'swagger' && <SwaggerViewer />}
      </main>

      {/* Clean Footer with Enes Öztürk Signature */}
      <Footer onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)} />

      {/* Authentication & Security Modal (3-attempt lockout) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Architecture, OOP, S.O.L.I.D and Clean Code Modal */}
      <ArchitectureDocsModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
