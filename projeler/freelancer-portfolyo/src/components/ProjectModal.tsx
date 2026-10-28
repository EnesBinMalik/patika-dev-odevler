import React, { useEffect } from 'react';
import { Project } from '../types';
import { StarDivider } from './StarDivider';
import { X, ExternalLink, Github, Calendar, User, Tag, Edit3, Trash2 } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full mx-auto shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-none"
          aria-label="Pencereyi kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 text-center">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#2c3e50] tracking-tight font-heading">
            {project.title}
          </h2>

          {/* Star Divider */}
          <StarDivider theme="dark" className="my-3" />

          {/* Subtitle / Category metadata */}
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1abc9c] mb-6">
            {project.category} · {project.client}
          </p>

          {/* Large Image Preview */}
          <div className="relative aspect-16/10 rounded-xl overflow-hidden shadow-md mb-8 bg-slate-100 border border-slate-200">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Detailed Description */}
          <div className="text-left text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 mb-8">
            <p>{project.longDescription || project.description}</p>
          </div>

          {/* Project Spec Metadata Box */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-700">
              <User className="w-4 h-4 text-[#1abc9c] shrink-0" />
              <span><strong>Müşteri / Kurum:</strong> {project.client}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-[#1abc9c] shrink-0" />
              <span><strong>Tarih:</strong> {project.date}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <Tag className="w-4 h-4 text-[#1abc9c] shrink-0" />
              <span><strong>Kategori:</strong> {project.category}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-slate-700">
              <strong>Teknolojiler:</strong>
              {project.technologies.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#1abc9c] hover:bg-[#16a085] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Canlı Demo İncele</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Deposu</span>
              </a>
            )}
          </div>

          {/* Modal Action Controls (Edit, Delete, Close) */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-amber-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Projeyi Düzenle (EDIT)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onDelete(project.id);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Projeyi Sil (DELETE)</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1abc9c] hover:bg-[#16a085] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <X className="w-4 h-4" />
              <span>Pencereyi Kapat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
