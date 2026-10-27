import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  textChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ textChange, value, onClear }) => {
  return (
    <div className="component-search-input relative w-full mb-6">
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search emoji..."
          value={value}
          onChange={textChange}
          aria-label="Search emoji"
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Aramayı temizle"
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
