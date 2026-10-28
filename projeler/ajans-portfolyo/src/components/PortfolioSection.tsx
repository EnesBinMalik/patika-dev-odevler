import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  RotateCcw,
  PlusCircle,
  ExternalLink,
  Edit2,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../types';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  onOpenDetailModal: (item: PortfolioItem) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (item: PortfolioItem) => void;
  onOpenDeleteModal: (item: PortfolioItem) => void;
  onResetDefaults: () => void;
}

const CATEGORIES: PortfolioCategory[] = [
  'Tümü',
  'Web Tasarım',
  'Branding',
  'Mobil Uygulama',
  'Grafik Tasarım',
  'Yazılım & API',
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  items,
  onOpenDetailModal,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onResetDefaults,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Tümü' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section id="portfolio" className="py-20 lg:py-28 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
              02. Portföy Galerisi & CRUD Modülü
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dinamik Proje Yönetimi & Vaka Çalışmaları
            </h2>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
              PCAT mimarisindeki CRUD ilkeleriyle hazırlanan dinamik portföy sistemi. Yeni projeler ekleyin, mevcut çalışmaları düzenleyin veya modal ile tüm detayları inceleyin.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onResetDefaults}
              title="Varsayılan örnek projeleri geri yükle"
              className="px-3.5 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Yeni Proje Ekle (ADD)</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800/80">
          {/* Interactive Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto no-scrollbar">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Proje veya müşteri ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Portfolio Dynamic Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Eşleşen Proje Bulunamadı</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
              Arama kriterlerinize uygun portföy öğesi bulunamadı. Aramanızı temizleyebilir veya hemen yeni bir proje ekleyebilirsiniz.
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Proje Oluştur</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container with Classic Agency Hover "+" Overlay */}
                <div
                  onClick={() => onOpenDetailModal(item)}
                  className="relative aspect-[4/3] w-full bg-neutral-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/assets/images/agency_portfolio_web_1793201690131.jpg';
                    }}
                  />

                  {/* Agency-style Dark Amber Hover Overlay with "+" icon */}
                  <div className="absolute inset-0 bg-neutral-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Plus className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wider uppercase mt-2">
                      Detayları Gör (Modal)
                    </span>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Quiet unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                      <span className="text-amber-400 font-semibold">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.date}</span>
                    </div>

                    <h3
                      onClick={() => onOpenDetailModal(item)}
                      className="text-lg font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Card Actions (CRUD Buttons) */}
                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenDetailModal(item)}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>İncele</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEditModal(item)}
                        title="Projeyi Düzenle (EDIT)"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenDeleteModal(item)}
                        title="Projeyi Sil (DELETE)"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
