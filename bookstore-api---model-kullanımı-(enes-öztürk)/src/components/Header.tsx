import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Download, Code2, BookOpen } from 'lucide-react';

interface HeaderProps {
  onCopyAll: () => void;
  copied: boolean;
  onOpenReportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCopyAll, copied }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center gap-3 text-slate-900 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs group-hover:bg-indigo-700 transition-colors">
              B
            </span>
            <span>BookStore API</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs tracking-normal">
              Model Mimarisi
            </span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#genel-bakis" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Genel Bakış
            </a>
            <a href="#modeller" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Model Mimarisi
            </a>
            <a href="#interaktif-test" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              İnteraktif Test
            </a>
            <a href="#kod-cozumu" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              C# Kodları
            </a>
            <a href="#rapor" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Ödev Raporu
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCopyAll}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xs whitespace-nowrap shrink-0"
              title="Tüm ödev kodlarını ve açıklamasını panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Tüm Çözümü Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
