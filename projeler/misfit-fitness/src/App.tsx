/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TrainersPage } from './pages/TrainersPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { TrainerDetailModal } from './components/TrainerDetailModal';
import { AuthModal } from './components/AuthModal';
import { GitHubHerokuModal } from './components/GitHubHerokuModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : toast.type === 'info'
              ? 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'trainers' && <TrainersPage />}
        {activePage === 'workouts' && <WorkoutsPage />}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'dashboard' && <DashboardPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <WorkoutDetailModal />
      <TrainerDetailModal />
      <AuthModal />
      <GitHubHerokuModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
