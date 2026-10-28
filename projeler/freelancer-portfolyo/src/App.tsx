/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, ContactMessage } from './types';
import { INITIAL_PROJECTS, INITIAL_MESSAGES } from './data/initialProjects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ProjectModal } from './components/ProjectModal';
import { AddEditProjectModal } from './components/AddEditProjectModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { MessagesInboxModal } from './components/MessagesInboxModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { Footer } from './components/Footer';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  // Persistent Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('freelancer_projects_enes_ozturk');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECTS;
  });

  // Persistent Messages State (SmartEdu style contact messages)
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('freelancer_messages_enes_ozturk');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_MESSAGES;
  });

  // Modals & Active Selections
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freelancer_projects_enes_ozturk', JSON.stringify(projects));
    } catch {
      // storage error handled
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('freelancer_messages_enes_ozturk', JSON.stringify(messages));
    } catch {
      // storage error handled
    }
  }, [messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open ADD modal
  const handleOpenAdd = () => {
    setProjectToEdit(null);
    setIsAddEditOpen(true);
  };

  // Open EDIT modal
  const handleOpenEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsAddEditOpen(true);
  };

  // Save Project (Handles both ADD and EDIT)
  const handleSaveProject = (
    projectData: Omit<Project, 'id'>,
    existingId?: string
  ) => {
    if (existingId) {
      // EDIT flow
      setProjects((prev) =>
        prev.map((p) => (p.id === existingId ? { ...projectData, id: existingId } : p))
      );
      // Update selected project if open
      if (selectedProject?.id === existingId) {
        setSelectedProject({ ...projectData, id: existingId });
      }
      showToast(`"${projectData.title}" projesi başarıyla güncellendi (EDIT).`);
    } else {
      // ADD flow
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
      };
      setProjects((prev) => [newProject, ...prev]);
      showToast(`"${projectData.title}" portföye başarıyla eklendi (ADD).`);
    }
  };

  // Trigger Delete confirmation
  const handleTriggerDelete = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setProjectToDelete(proj);
      setIsDeleteOpen(true);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(null);
      }
      showToast(`"${projectToDelete.title}" portföyden silindi.`);
      setProjectToDelete(null);
    }
  };

  // Send Message (SmartEdu Contact Form)
  const handleSendMessage = (
    msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      createdAt: formattedDate,
      isRead: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  // Toggle Read Message
  const handleToggleRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );
  };

  // Delete Message
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Mesaj silindi.');
  };

  // Reset to original projects
  const handleResetSampleData = () => {
    if (window.confirm('Örnek PCAT ve SmartEdu projelerini varsayılan durumuna sıfırlamak istiyor musunuz?')) {
      setProjects(INITIAL_PROJECTS);
      setMessages(INITIAL_MESSAGES);
      showToast('Varsayılan projeler ve mesajlar geri yüklendi.');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2c3e50] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#1abc9c]/50 animate-bounce duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#1abc9c] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAddProject={handleOpenAdd}
        onOpenInbox={() => setIsInboxOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Masthead / Hero with Avatar */}
      <Hero
        onOpenAddProject={handleOpenAdd}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Dynamic Portfolio Grid with CRUD triggers */}
        <PortfolioGrid
          projects={projects}
          onSelectProject={(p) => setSelectedProject(p)}
          onEditProject={handleOpenEdit}
          onDeleteProject={handleTriggerDelete}
          onOpenAddProject={handleOpenAdd}
        />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section (SmartEdu Nodemailer style) */}
        <ContactSection
          onSendMessage={handleSendMessage}
          onOpenInbox={() => setIsInboxOpen(true)}
          unreadCount={unreadCount}
        />

        {/* Quick Utility Strip: Reset & Data count */}
        <div className="bg-slate-100 py-3 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Dinamik Veri Durumu:</span>
              <span>{projects.length} Proje Yayında</span>
              <span>·</span>
              <span>{messages.length} Gelen İletişim Mesajı</span>
            </div>
            <button
              onClick={handleResetSampleData}
              className="text-slate-600 hover:text-[#2c3e50] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              title="Varsayılan PCAT & SmartEdu örnek verilerini geri yükle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılan Verileri Sıfırla</span>
            </button>
          </div>
        </div>
      </main>

      {/* Project Details Modal (The famous StartBootstrap Freelancer modal) */}
      <ProjectModal
        isOpen={Boolean(selectedProject)}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEdit={handleOpenEdit}
        onDelete={handleTriggerDelete}
      />

      {/* Add / Edit Project Modal (PCAT style photo & content management) */}
      <AddEditProjectModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        project={projectToDelete}
        onClose={() => {
          setIsDeleteOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Contact Messages Inbox Modal (SmartEdu Nodemailer Inbox) */}
      <MessagesInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        messages={messages}
        onToggleRead={handleToggleRead}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* GitHub & Heroku Deployment Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
        projects={projects}
      />

      {/* Footer with 3-columns and Enes Öztürk Signature */}
      <Footer />
    </div>
  );
}
