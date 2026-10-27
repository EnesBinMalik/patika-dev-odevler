/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Sparkles, Code2, Info } from 'lucide-react';

interface HeaderProps {
  onOpenAbout: () => void;
  onQuickReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAbout, onQuickReset }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Paragraf Oluşturucu
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Enes Öztürk İmzalı
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onQuickReset}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Varsayılan (4 Paragraf)
          </button>
          <a
            href="#generator-panel"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Arayüz Ayarları
          </a>
          <a
            href="#output-display"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Metin & HTML Çıktısı
          </a>
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>Hakkında & API</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAbout}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            Enes Öztürk
          </button>
        </div>
      </div>
    </header>
  );
};
