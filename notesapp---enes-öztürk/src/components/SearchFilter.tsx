import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { NOTE_COLORS } from '../constants/colors';
import { SortOption } from '../types/note';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedColorFilter: string | null;
  onColorFilterChange: (colorId: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalNotesCount: number;
  filteredNotesCount: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedColorFilter,
  onColorFilterChange,
  sortBy,
  onSortChange,
  totalNotesCount,
  filteredNotesCount,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 space-y-3 transition-shadow hover:shadow-md">
        {/* Search input - required by prompt */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Notlarda ara... (İçerik filtreleme)"
            className="w-full pl-10 pr-24 py-2.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all"
            aria-label="Notları filtrele"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors"
              title="Aramayı temizle"
              aria-label="Aramayı temizle"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!searchQuery && (
            <div className="absolute right-3 hidden sm:flex items-center text-[11px] font-medium text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">
              Filtrele
            </div>
          )}
        </div>

        {/* Color filter chips and sort bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Color quick filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 text-[11px]">
              <SlidersHorizontal className="w-3 h-3" />
              Renk:
            </span>
            <button
              onClick={() => onColorFilterChange(null)}
              className={`px-2.5 py-1 rounded-full font-medium transition-all text-[11px] ${
                selectedColorFilter === null
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>
            {NOTE_COLORS.map((color) => {
              const isSelected = selectedColorFilter === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => onColorFilterChange(isSelected ? null : color.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all text-[11px] ${
                    isSelected
                      ? 'ring-2 ring-slate-800 ring-offset-1 font-semibold'
                      : 'hover:opacity-85'
                  }`}
                  style={{
                    backgroundColor: color.bgHex,
                    color: color.textHex,
                    border: `1px solid ${color.borderHex}`,
                  }}
                  title={`${color.name} renkli notları filtrele`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: color.dotHex }}
                  />
                  {color.name}
                </button>
              );
            })}
          </div>

          {/* Result counter and sort select */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-slate-500 font-medium">
              {searchQuery || selectedColorFilter ? (
                <>
                  <span className="font-semibold text-slate-800">{filteredNotesCount}</span> /{' '}
                  {totalNotesCount} not
                </>
              ) : (
                <>
                  Toplam <span className="font-semibold text-slate-800">{totalNotesCount}</span> not
                </>
              )}
            </span>

            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 pl-6 pr-2 py-1 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="alphabetical">A - Z</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-slate-500 absolute left-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
