import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-emerald-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Karakter adı ile arayın (örn. Rick, Morty, Summer, Jerry, Pickle...)"
          className="w-full pl-12 pr-24 py-3.5 bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition shadow-inner shadow-black/40"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchTerm ? (
            <button
              onClick={() => {
                playClickSound();
                onClear();
                inputRef.current?.focus();
              }}
              title="Aramayı Temizle"
              aria-label="Aramayı Temizle"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono-code text-slate-400 bg-slate-800 rounded border border-slate-700">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};
