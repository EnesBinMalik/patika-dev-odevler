import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PortfolioDetailModal } from './components/PortfolioDetailModal';
import { AddEditProjectModal } from './components/AddEditProjectModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { MessagesModal } from './components/MessagesModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { PortfolioItem, ContactMessage } from './types';
import {
  getStoredPortfolio,
  saveStoredPortfolio,
  resetStoredPortfolio,
  getStoredMessages,
  saveStoredMessages,
} from './utils/storage';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  // Modals state
  const [detailItem, setDetailItem] = useState<PortfolioItem | null>(null);
  const [addEditState, setAddEditState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    item: PortfolioItem | null;
  }>({
    isOpen: false,
    mode: 'add',
    item: null,
  });
  const [deleteItem, setDeleteItem] = useState<PortfolioItem | null>(null);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    setPortfolioItems(getStoredPortfolio());
    setMessages(getStoredMessages());
  }, []);

  // CRUD: Add / Update
  const handleSaveProject = (item: PortfolioItem) => {
    let updated: PortfolioItem[];
    const exists = portfolioItems.some((p) => p.id === item.id);
    if (exists) {
      updated = portfolioItems.map((p) => (p.id === item.id ? item : p));
      showToast(`"${item.title}" projesi başarıyla güncellendi.`);
    } else {
      updated = [item, ...portfolioItems];
      showToast(`"${item.title}" projesi portföye eklendi.`);
    }
    setPortfolioItems(updated);
    saveStoredPortfolio(updated);
  };

  // CRUD: Delete
  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    const updated = portfolioItems.filter((p) => p.id !== deleteItem.id);
    setPortfolioItems(updated);
    saveStoredPortfolio(updated);
    showToast(`"${deleteItem.title}" projesi portföyden silindi.`);
    setDeleteItem(null);
  };

  // CRUD: Reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm('Tüm portföy verilerini varsayılan örneklere sıfırlamak istediğinize emin misiniz?')) {
      const reset = resetStoredPortfolio();
      setPortfolioItems(reset);
      showToast('Portföy varsayılan örnek verilere sıfırlandı.');
    }
  };

  // Import JSON data
  const handleImportData = (items: PortfolioItem[]) => {
    setPortfolioItems(items);
    saveStoredPortfolio(items);
    showToast(`${items.length} adet portföy projesi içe aktarıldı.`);
  };

  // Contact Messages: Send message
  const handleSendMessage = (msg: ContactMessage) => {
    const updated = [msg, ...messages];
    setMessages(updated);
    saveStoredMessages(updated);
    showToast('Mesajınız başarıyla iletildi ve SmartEdu kutusuna kaydedildi.');
  };

  // Contact Messages: Mark as read
  const handleMarkAsRead = (id: string) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, status: 'read' as const } : m
    );
    setMessages(updated);
    saveStoredMessages(updated);
  };

  // Contact Messages: Delete message
  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    saveStoredMessages(updated);
    showToast('Mesaj silindi.');
  };

  const handleExplorePortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 border border-amber-400/50 shadow-2xl text-xs text-white animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() =>
          setAddEditState({ isOpen: true, mode: 'add', item: null })
        }
        onOpenMessagesModal={() => setMessagesModalOpen(true)}
        onOpenDeployModal={() => setDeployModalOpen(true)}
        messages={messages}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenAddModal={() =>
            setAddEditState({ isOpen: true, mode: 'add', item: null })
          }
          onExplorePortfolio={handleExplorePortfolio}
        />

        {/* Services Section */}
        <ServicesSection />

        {/* Dynamic Portfolio CRUD Section */}
        <PortfolioSection
          items={portfolioItems}
          onOpenDetailModal={(item) => setDetailItem(item)}
          onOpenAddModal={() =>
            setAddEditState({ isOpen: true, mode: 'add', item: null })
          }
          onOpenEditModal={(item) =>
            setAddEditState({ isOpen: true, mode: 'edit', item })
          }
          onOpenDeleteModal={(item) => setDeleteItem(item)}
          onResetDefaults={handleResetDefaults}
        />

        {/* About Section */}
        <AboutSection />

        {/* Team Section */}
        <TeamSection />

        {/* Contact Section (SmartEdu active form) */}
        <ContactSection
          onSendMessage={handleSendMessage}
          onOpenMessagesModal={() => setMessagesModalOpen(true)}
          messagesCount={messages.length}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDeployModal={() => setDeployModalOpen(true)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Modals */}
      {/* 1. Portfolio Detail Modal (Classic Agency Modal) */}
      <PortfolioDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) =>
          setAddEditState({ isOpen: true, mode: 'edit', item })
        }
        onDelete={(item) => setDeleteItem(item)}
      />

      {/* 2. Add / Edit Project Modal (PCAT CRUD) */}
      <AddEditProjectModal
        isOpen={addEditState.isOpen}
        mode={addEditState.mode}
        initialData={addEditState.item}
        onClose={() =>
          setAddEditState({ isOpen: false, mode: 'add', item: null })
        }
        onSave={handleSaveProject}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 4. SmartEdu Messages Modal */}
      <MessagesModal
        isOpen={messagesModalOpen}
        messages={messages}
        onClose={() => setMessagesModalOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* 5. GitHub & Heroku Deployment Guide Modal */}
      <DeployGuideModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        portfolioItems={portfolioItems}
        onImportData={handleImportData}
      />
    </div>
  );
}
