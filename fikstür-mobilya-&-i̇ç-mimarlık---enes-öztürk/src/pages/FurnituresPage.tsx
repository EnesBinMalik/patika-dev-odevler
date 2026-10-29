import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FurnitureCard } from '../components/FurnitureCard';
import { Category, Furniture } from '../types';
import { Search, SlidersHorizontal, Plus, Shield, X, Filter } from 'lucide-react';

interface FurnituresPageProps {
  onOpenAddModal?: () => void;
  onEditFurniture?: (f: Furniture) => void;
}

export const FurnituresPage: React.FC<FurnituresPageProps> = ({ onOpenAddModal, onEditFurniture }) => {
  const {
    furnitures,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    currentUser,
    setActivePage,
    deleteFurniture
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories: Category[] = [
    'Tümü',
    'Salon',
    'Yemek Odası',
    'Yatak Odası',
    'Aydınlatma',
    'Çalışma & Ofis'
  ];

  // Filtering & Sorting
  const filteredFurnitures = useMemo(() => {
    return furnitures
      .filter((item) => {
        // Category check
        const matchesCategory =
          selectedCategory === 'Tümü' || item.category === selectedCategory;

        // Search check
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.material.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        // Stock check
        const matchesStock = !onlyInStock || item.stock > 0;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'tr');
        // 'featured'
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [furnitures, selectedCategory, searchQuery, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>Fikstür Kataloğu</span>
            <span aria-hidden="true">·</span>
            <span>Enes Öztürk Tasarımları</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display mt-1">
            Mobilya & İç Mekan Koleksiyonu
          </h1>
          <p className="text-xs text-stone-500 mt-2 max-w-xl">
            {currentUser?.role === 'admin'
              ? 'Yönetici modundasınız: Mobilya ekleyebilir, düzenleyebilir ve silebilirsiniz.'
              : currentUser?.role === 'member'
              ? 'Üye modundasınız: Beğendiğiniz mobilyayı doğrudan rezerve edebilir ve tarihini belirleyebilirsiniz.'
              : 'Ziyaretçi modundasınız: Mobilyaları inceleyebilir, rezerve etmek için giriş yapabilirsiniz.'}
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <div className="flex items-center gap-2">
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Mobilya Ekle</span>
              </button>
            )}
            <button
              onClick={() => setActivePage('admin')}
              className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Masası</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Bar - explicitly requested in user brief: "Ayrıca görünüme çok takılmadan bir search alanı oluşturabiliriz." */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mobilya adı, malzeme (ceviz, meşe, pirinç...), renk veya açıklama ara..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-stone-200 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="sort-select" className="text-stone-400 text-[11px]">Sırala:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Öne Çıkanlar</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>

            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                onlyInStock
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              Yalnızca Stoktakiler
            </button>
          </div>
        </div>

        {/* Interactive Category Tabs (Functional Button Controls Allowed per Constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'Tümü'
                ? furnitures.length
                : furnitures.filter((f) => f.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`ml-1.5 text-[10px] font-mono tabular-nums ${
                    isActive ? 'text-stone-300' : 'text-stone-400'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
        <p>
          <strong className="text-stone-900 font-mono tabular-nums">{filteredFurnitures.length}</strong> mobilya bulundu
          {selectedCategory !== 'Tümü' && <span> · Kategori: {selectedCategory}</span>}
          {searchQuery && <span> · Arama: "{searchQuery}"</span>}
        </p>

        {(selectedCategory !== 'Tümü' || searchQuery || onlyInStock) && (
          <button
            onClick={() => {
              setSelectedCategory('Tümü');
              setSearchQuery('');
              setOnlyInStock(false);
            }}
            className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Furniture Grid */}
      {filteredFurnitures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFurnitures.map((f) => (
            <FurnitureCard
              key={f.id}
              furniture={f}
              onEdit={onEditFurniture}
              onDelete={deleteFurniture}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Filter className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 font-display">
            Arama Kriterlerine Uygun Mobilya Bulunamadı
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Arama terimini değiştirebilir veya farklı bir kategori seçerek kataloğu inceleyebilirsiniz.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Tümü');
              setSearchQuery('');
              setOnlyInStock(false);
            }}
            className="mt-2 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Tüm Mobilyaları Göster
          </button>
        </div>
      )}
    </div>
  );
};
