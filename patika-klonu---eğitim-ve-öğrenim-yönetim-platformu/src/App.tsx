import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { SignatureFooter } from './components/layout/SignatureFooter';
import { ExploreView } from './components/home/ExploreView';
import { AboutView } from './components/home/AboutView';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { AuthModal } from './components/auth/AuthModal';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeView, setActiveView] = useState<string>('explore');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 3-Zone Navigation Header */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeView === 'explore' && (
          <ExploreView
            onSelectPath={() => setActiveView('student_panel')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'student_panel' && <StudentDashboard />}

        {activeView === 'instructor_panel' && <InstructorDashboard />}

        {activeView === 'operator_panel' && <OperatorDashboard />}

        {activeView === 'about' && <AboutView />}
      </main>

      {/* Handcrafted Footer by Enes Öztürk */}
      <SignatureFooter />

      {/* Authentication & Student Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
