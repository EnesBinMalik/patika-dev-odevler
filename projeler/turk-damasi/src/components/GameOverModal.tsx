/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, RotateCcw, Eye, Award } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { resetGame } from '../store/damaSlice';

export const GameOverModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, winReason, history, capturedWhite, capturedBlack, score } =
    useAppSelector((state) => state.dama);

  const [dismissed, setDismissed] = useState(false);

  if (status === 'playing' || dismissed) {
    // If dismissed, render a quiet floating banner on top to review board or restart
    if (status !== 'playing' && dismissed) {
      return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1e1108]/95 border border-[#d97706] rounded-xl px-5 py-3 shadow-2xl flex items-center gap-4">
          <span className="text-xs sm:text-sm font-semibold text-[#fde047]">
            {status === 'white_won'
              ? 'Tebrikler: Beyaz Kazandı!'
              : status === 'black_won'
              ? 'Tebrikler: Siyah Kazandı!'
              : 'Oyun Berabere Bitti'}
          </span>
          <button
            onClick={() => {
              setDismissed(false);
              dispatch(resetGame());
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold rounded-lg shadow transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeni Oyun</span>
          </button>
        </div>
      );
    }
    return null;
  }

  const isWhiteWon = status === 'white_won';
  const isBlackWon = status === 'black_won';
  const isDraw = status === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#24150d] border-2 border-[#d97706] text-[#f4ecd8] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#fde047]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#fde047]/10 to-transparent pointer-events-none" />

        {/* Crown / Trophy Emblem */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#b45309] via-[#d97706] to-[#fde047] p-0.5 shadow-xl flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#1c0f08] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#fde047] drop-shadow-md" />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black tracking-wide text-[#fde047] mb-1">
          {isWhiteWon
            ? 'BEYAZ OYUNCU KAZANDI'
            : isBlackWon
            ? 'SİYAH OYUNCU KAZANDI'
            : 'OYUN BERABERE'}
        </h2>

        {/* Reason */}
        <p className="text-xs sm:text-sm text-[#caa777] mb-6">
          {winReason || 'Oyun başarıyla tamamlandı.'}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-3 gap-2.5 bg-[#190e07] p-3.5 rounded-xl border border-[#3d2417] mb-6 text-center">
          <div>
            <div className="text-[11px] text-[#8c7457] uppercase font-semibold">Toplam Hamle</div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#f4ecd8] mt-0.5">
              {history.length}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#8c7457] uppercase font-semibold">Beyaz Puan</div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#fde047] mt-0.5">
              {score.white}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#8c7457] uppercase font-semibold">Siyah Puan</div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#fde047] mt-0.5">
              {score.black}
            </div>
          </div>
        </div>

        {/* Artisan Signature Badge */}
        <div className="mb-6 flex items-center justify-center gap-1.5 text-[11px] text-[#a88d6c]">
          <Award className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Enes Öztürk Özel Tasarım · El Emeği Türk Daması</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => dispatch(resetGame())}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#facc15] to-[#d97706] hover:from-[#fde047] hover:to-[#eab308] text-[#1c0f08] font-bold text-sm rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 bg-[#2b170e] hover:bg-[#381f13] text-[#caa777] hover:text-[#f4ecd8] font-semibold text-xs rounded-xl border border-[#4a2e1d] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tahtayı İncele</span>
          </button>
        </div>
      </div>
    </div>
  );
};
