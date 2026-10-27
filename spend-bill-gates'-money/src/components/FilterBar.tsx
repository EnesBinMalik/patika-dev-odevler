import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { ItemCategory, Language } from '../types';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'purchased-first';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ItemCategory;
  onSelectCategory: (category: ItemCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  language: Language;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  language,
  totalFilteredCount,
}) => {
  const isTr = language === 'tr';

  const categories: { id: ItemCategory; labelTr: string; labelEn: string }[] = [
    { id: 'all', labelTr: 'Tümü', labelEn: 'All Items' },
    { id: 'food', labelTr: 'Yiyecek & İçecek', labelEn: 'Food & Drinks' },
    { id: 'tech', labelTr: 'Teknoloji', labelEn: 'Tech & Gadgets' },
    { id: 'luxury', labelTr: 'Lüks Yaşam', labelEn: 'Luxury Goods' },
    { id: 'vehicles', labelTr: 'Araçlar & Ulaşım', labelEn: 'Vehicles' },
    { id: 'properties', labelTr: 'Gayrimenkul', labelEn: 'Real Estate' },
    { id: 'mega', labelTr: 'Mega Varlıklar', labelEn: 'Mega Assets' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isTr ? 'Ürünlerde ara...' : 'Search items...'}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {isTr ? cat.labelTr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort items"
            className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="default">{isTr ? 'Sıralama: Standart' : 'Sort: Default'}</option>
            <option value="price-asc">{isTr ? 'Fiyat: Düşükten Yükseğe' : 'Price: Low to High'}</option>
            <option value="price-desc">{isTr ? 'Fiyat: Yüksekten Düşüğe' : 'Price: High to Low'}</option>
            <option value="purchased-first">{isTr ? 'Satın Alınanlar Önce' : 'Purchased First'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
