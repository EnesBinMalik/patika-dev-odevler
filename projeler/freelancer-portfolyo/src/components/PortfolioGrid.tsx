import React, { useState } from 'react';
import { Project } from '../types';
import { StarDivider } from './StarDivider';
import { Plus, Edit3, Trash2, ExternalLink, Eye, PlusCircle } from 'lucide-react';

interface PortfolioGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenAddProject: () => void;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  onOpenAddProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const categories = [
    'Tümü',
    'Node.js & Express',
    'Full Stack',
    'Web Geliştirme',
    'Mobil & UI',
  ];

  const filteredProjects = selectedCategory === 'Tümü'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#2c3e50] tracking-tight font-heading">
            PORTFOLIO
          </h2>
          <StarDivider theme="dark" />
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base mt-2">
            PCAT ve SmartEdu projelerinin ardından geliştirilen dinamik ve tam işlevsel web uygulamaları.
          </p>
        </div>

        {/* Toolbar: Category Filter & Add Project Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          {/* Interactive filter segmented buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1abc9c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Action: Add Project Button (ADD sayfası / modalı) */}
          <button
            onClick={onOpenAddProject}
            className="w-full sm:w-auto px-4 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#1abc9c]" />
            <span>Yeni Proje Ekle (ADD)</span>
          </button>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium mb-3">
              Bu kategoride henüz bir proje bulunmuyor.
            </p>
            <button
              onClick={onOpenAddProject}
              className="px-4 py-2 bg-[#1abc9c] text-white text-sm font-bold rounded-lg hover:bg-[#16a085]"
            >
              İlk Projeyi Ekleyin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Classic Freelancer Hover Overlay */}
                <div
                  className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Resilient fallback
                      (e.currentTarget as HTMLImageElement).src =
                        '/assets/images/project_pcat_catalog_1793202356487.jpg';
                    }}
                  />

                  {/* Classic StartBootstrap Freelancer Hover Overlay */}
                  <div className="absolute inset-0 bg-[#1abc9c]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white stroke-[2.5]" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wider">
                      Detayları Görüntüle
                    </span>
                    <span className="text-xs text-white/80 mt-1">
                      {project.client} · {project.date}
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Bar */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metadata line without pills (clean unboxed text per design rules) */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1abc9c] uppercase tracking-wider mb-2">
                      <span>{project.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 font-normal">{project.date}</span>
                    </div>

                    <h3
                      onClick={() => onSelectProject(project)}
                      className="text-lg font-bold text-[#2c3e50] hover:text-[#1abc9c] transition-colors cursor-pointer mb-2 font-heading"
                    >
                      {project.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[11px] text-slate-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Controls: View Modal, Edit, Delete */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#2c3e50] hover:text-[#1abc9c] hover:bg-slate-50 rounded flex items-center gap-1.5 transition-colors"
                      title="Proje detaylarını incele"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Modal Detay</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded flex items-center gap-1 transition-colors"
                        title="Projeyi Düzenle (EDIT)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded flex items-center gap-1 transition-colors"
                        title="Projeyi Sil (DELETE)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
