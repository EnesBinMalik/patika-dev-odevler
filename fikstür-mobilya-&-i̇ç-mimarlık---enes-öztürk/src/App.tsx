import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { FurnitureDetailModal } from './components/FurnitureDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { FurnitureFormModal } from './components/FurnitureFormModal';
import { DeployGuideModal } from './components/DeployGuideModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FurnituresPage } from './pages/FurnituresPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { Furniture } from './types';

const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isFurnitureFormOpen, setIsFurnitureFormOpen] = useState(false);
  const [editingFurniture, setEditingFurniture] = useState<Furniture | null>(null);

  const handleOpenAdd = () => {
    setEditingFurniture(null);
    setIsFurnitureFormOpen(true);
  };

  const handleOpenEdit = (f: Furniture) => {
    setEditingFurniture(f);
    setIsFurnitureFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-950">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar />

      {/* Main Dynamic Multi-Page Router */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'about' && (
          <AboutPage onOpenDeployGuide={() => setIsDeployGuideOpen(true)} />
        )}
        {activePage === 'furnitures' && (
          <FurnituresPage
            onOpenAddModal={handleOpenAdd}
            onEditFurniture={handleOpenEdit}
          />
        )}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'login' && <LoginPage />}
        {activePage === 'register' && <RegisterPage />}
        {activePage === 'admin' && (
          <AdminDashboard
            onOpenAddModal={handleOpenAdd}
            onEditFurniture={handleOpenEdit}
          />
        )}
        {activePage === 'my-reservations' && <MyReservationsPage />}
      </main>

      {/* Enes Öztürk Signature Footer & Architecture Credits */}
      <Footer onOpenDeployGuide={() => setIsDeployGuideOpen(true)} />

      {/* Interactive Global Modals */}
      <FurnitureDetailModal />
      <ReservationModal />
      <FurnitureFormModal
        isOpen={isFurnitureFormOpen}
        onClose={() => setIsFurnitureFormOpen(false)}
        initialFurniture={editingFurniture}
      />
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
