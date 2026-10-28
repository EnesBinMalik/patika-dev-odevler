/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  RotateCw,
  Volume2,
  VolumeX,
  PlusCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  resetGame,
  toggleBoardOrientation,
  toggleSound,
  toggleMoveAssistance,
  openRulesModal,
} from '../store/damaSlice';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { soundEnabled, moveAssistance, status } = useAppSelector(
    (state) => state.dama
  );

  const handleNewGame = () => {
    if (
      status === 'playing' &&
      !window.confirm('Mevcut oyunu sıfırlayıp yeni oyun başlatmak istediğinize emin misiniz?')
    ) {
      return;
    }
    dispatch(resetGame());
  };

  return (
    <header className="w-full border-b border-[#3d2417] bg-[#1a1009]/95 backdrop-blur-sm sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#fde047] whitespace-nowrap">
              TÜRK DAMASI
            </span>
            <span className="text-[10px] tracking-widest text-[#caa777]/80 uppercase -mt-0.5 font-medium whitespace-nowrap">
              Enes Öztürk İmzalı · El Emeği
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Action Controls */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#caa777]">
          <button
            onClick={() => dispatch(openRulesModal())}
            className="flex items-center gap-1.5 hover:text-[#fde047] transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Oyun Kuralları</span>
          </button>

          <button
            onClick={() => dispatch(toggleBoardOrientation())}
            className="flex items-center gap-1.5 hover:text-[#fde047] transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Tahtayı Çevir</span>
          </button>

          <button
            onClick={() => dispatch(toggleMoveAssistance())}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              moveAssistance ? 'text-[#facc15]' : 'hover:text-[#fde047]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yardımcı Çizgiler: {moveAssistance ? 'Açık' : 'Kapalı'}</span>
          </button>

          <button
            onClick={() => dispatch(toggleSound())}
            className="flex items-center gap-1.5 hover:text-[#fde047] transition-colors whitespace-nowrap shrink-0"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Ses Açık</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>Sessiz</span>
              </>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile shortcuts */}
          <button
            onClick={() => dispatch(openRulesModal())}
            title="Kurallar"
            className="md:hidden p-2 text-[#caa777] hover:text-[#fde047] hover:bg-[#2b170e] rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => dispatch(toggleBoardOrientation())}
            title="Tahtayı Çevir"
            className="md:hidden p-2 text-[#caa777] hover:text-[#fde047] hover:bg-[#2b170e] rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleNewGame}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#18110b] bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-[#fde047] hover:to-[#facc15] rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Oyun</span>
          </button>
        </div>
      </div>
    </header>
  );
};
