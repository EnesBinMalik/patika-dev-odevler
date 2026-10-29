import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PageInfo } from '../types/rickAndMorty';
import { playClickSound } from '../utils/audioEffects';

interface PaginationProps {
  pageInfo: PageInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageInfo,
  currentPage,
  onPageChange,
  isLoading,
}) => {
  const [jumpPage, setJumpPage] = useState<string>('');
  const totalPages = pageInfo.pages || 1;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      playClickSound();
      onPageChange(page);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      handlePageClick(p);
      setJumpPage('');
    }
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // how many around current

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) {
        pages.push('...');
      }
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
      {/* Informative text */}
      <div className="text-xs sm:text-sm text-slate-400 font-mono-code">
        Sayfa <span className="text-emerald-400 font-bold">{currentPage}</span> /{' '}
        <span className="text-slate-200">{totalPages}</span> (Toplam{' '}
        <span className="text-emerald-400 font-bold">{pageInfo.count}</span> karakter)
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* First page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || isLoading}
          title="İlk Sayfa"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          title="Önceki Sayfa"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numeric page items */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-600 font-mono-code text-xs select-none"
                >
                  •••
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                disabled={isLoading}
                className={`min-w-[36px] h-9 px-2 rounded-xl text-xs sm:text-sm font-mono-code font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          title="Sonraki Sayfa"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          title="Son Sayfa"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump to page form */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder="Git..."
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          className="w-16 px-2.5 py-1.5 text-xs font-mono-code bg-slate-900 text-white rounded-xl border border-slate-800 focus:border-emerald-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!jumpPage}
          className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 disabled:opacity-40 transition cursor-pointer"
        >
          Git
        </button>
      </form>
    </div>
  );
};
