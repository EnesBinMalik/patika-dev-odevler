import React from 'react';
import { Volume2, VolumeX, Globe, Receipt as ReceiptIcon, RotateCcw } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onScrollToReceipt: () => void;
  purchasedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  onReset,
  onScrollToReceipt,
  purchasedCount,
}) => {
  const isTr = language === 'tr';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-900 hover:text-emerald-700 transition-colors shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            $
          </span>
          <span className="font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap">
            {isTr ? "Bill Gates'in Parasını Harca" : "Spend Bill Gates' Money"}
          </span>
        </a>

        {/* Zone 2: Navigation & Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#catalog"
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {isTr ? 'Katalog' : 'Catalog'}
          </a>
          <button
            onClick={onScrollToReceipt}
            className="hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <ReceiptIcon className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Fiş / Sepet' : 'Receipt / Basket'}</span>
            {purchasedCount > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                {purchasedCount}
              </span>
            )}
          </button>
          <a
            href="#signature"
            className="hover:text-slate-900 transition-colors whitespace-nowrap text-slate-500"
          >
            {isTr ? 'İmza: Enes Öztürk' : 'By Enes Öztürk'}
          </a>
        </nav>

        {/* Zone 3: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            title={soundEnabled ? (isTr ? 'Sesi Kapat' : 'Mute Sound') : (isTr ? 'Sesi Aç' : 'Unmute Sound')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(isTr ? 'en' : 'tr')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title={isTr ? 'Switch to English' : 'Türkçe\'ye Geç'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{isTr ? 'TR' : 'EN'}</span>
          </button>

          {/* Quick Reset */}
          <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title={isTr ? 'Tüm Harcamaları Sıfırla' : 'Reset All Spending'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
