import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterType } from '../../types/todo';

interface ModernFilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  percentCompleted: number;
}

export const ModernFilterBar: React.FC<ModernFilterBarProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  activeCount,
  completedCount,
  percentCompleted,
}) => {
  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-600">
            <span>İlerleme Durumu</span>
            <span className="text-slate-900 font-semibold">
              {completedCount}/{totalCount} Görev (%{percentCompleted})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Status Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('active')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktif ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tamamlanan ({completedCount})
          </button>
        </div>

        {/* Search input & Category dropdown */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Görevlerde ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filter if categories exist */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-slate-400 shadow-2xs cursor-pointer font-medium"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};
