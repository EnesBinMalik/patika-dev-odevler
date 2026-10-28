import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { Camera, Plus, X, ZoomIn, Trash2, Calendar, Shield } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery, currentUser, addGalleryItem, deleteGalleryItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('Tesis');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'Tesis', label: 'Tesis' },
    { id: 'Grup Seansları', label: 'Grup Seansları' },
    { id: 'Boks & Ring', label: 'Boks & Ring' },
    { id: 'Ağırlık & Güç', label: 'Ağırlık & Güç' },
    { id: 'Pilates & Stüdyo', label: 'Pilates & Stüdyo' }
  ];

  const filteredGallery = selectedCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    addGalleryItem({
      title: newTitle.trim(),
      category: newCategory,
      imageUrl: newImageUrl.trim(),
      caption: newCaption.trim() || newTitle.trim()
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewImageUrl('');
    setNewCaption('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Misfit Görsel Arşivi</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          STÜDYO VE ANTRENMAN <br />
          <span className="text-amber-400">GALERİSİ</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          Tesisimizin modern atmosferi, profesyonel ekipman parkuru ve yüksek enerjili seanslarımızdan ilham verici kareler.
        </p>
      </div>

      {/* Filter and Add photo actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Fotoğraf Ekle</span>
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl cursor-pointer"
            onClick={() => setActiveImage(item)}
          >
            <div className="h-72 w-full overflow-hidden bg-neutral-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content info */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                {item.category}
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-0.5 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-300 line-clamp-1 mt-1 opacity-90">
                {item.caption}
              </p>
            </div>

            {/* Zoom icon button */}
            <div className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-950/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>

            {/* Admin quick delete button */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`"${item.title}" görselini galeriden silmek istediğinize emin misiniz?`)) {
                    deleteGalleryItem(item.id);
                  }
                }}
                className="absolute top-3 left-3 p-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Görseli Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/70 text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-neutral-950 overflow-hidden flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
                  {activeImage.category}
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  {activeImage.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeImage.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 shrink-0">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{activeImage.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Image Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4" />
                <span>Admin Yetkisi</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase">
                Galeriye Fotoğraf Ekle
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Fotoğraf Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Halter İstasyonu & Dumbbell Parkuru"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Tesis">Tesis</option>
                  <option value="Grup Seansları">Grup Seansları</option>
                  <option value="Boks & Ring">Boks & Ring</option>
                  <option value="Ağırlık & Güç">Ağırlık & Güç</option>
                  <option value="Pilates & Stüdyo">Pilates & Stüdyo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Görsel URL Adresi
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... veya dosya yolu"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Açıklama / Altyazı
                </label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Görsel hakkında kısa bilgi..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors"
              >
                Galeriye Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
