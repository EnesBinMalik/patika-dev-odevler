/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crown, Flag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { resign } from '../store/damaSlice';
import { PieceColor } from '../types/dama';

interface PlayerPanelProps {
  playerColor: PieceColor;
  playerName: string;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  playerColor,
  playerName,
}) => {
  const dispatch = useAppDispatch();
  const {
    board,
    turn,
    capturedWhite,
    capturedBlack,
    score,
    status,
    allLegalMoves,
  } = useAppSelector((state) => state.dama);

  const isCurrentTurn = turn === playerColor && status === 'playing';
  const isWhite = playerColor === 'white';

  // Count active pieces and kings on board
  const { pieceCount, kingCount } = React.useMemo(() => {
    let pieces = 0;
    let kings = 0;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const p = board[r][c];
        if (p && p.color === playerColor) {
          pieces++;
          if (p.type === 'king') kings++;
        }
      }
    }
    return { pieceCount: pieces, kingCount: kings };
  }, [board, playerColor]);

  // Pieces captured BY this player (i.e., opponent's lost pieces)
  const capturedOpponentPieces = isWhite ? capturedBlack : capturedWhite;
  const wins = isWhite ? score.white : score.black;

  // Has mandatory capture this turn?
  const hasMandatoryCapture =
    isCurrentTurn && allLegalMoves.length > 0 && allLegalMoves[0].isCapture;

  const handleResign = () => {
    if (window.confirm(`${playerName} olarak oyundan çekilmek istediğinize emin misiniz?`)) {
      dispatch(resign(playerColor));
    }
  };

  return (
    <div
      className={`relative p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
        isCurrentTurn
          ? 'bg-[#291a12]/90 border-[#d97706] shadow-xl ring-1 ring-[#d97706]/40'
          : 'bg-[#1e130c]/70 border-[#3d2417] opacity-85'
      }`}
    >
      {/* Player Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Piece Token Icon */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border shadow-inner flex items-center justify-center shrink-0"
            style={{
              background: isWhite
                ? 'radial-gradient(circle at 35% 30%, #fffbf0 0%, #faecd5 50%, #b99361 100%)'
                : 'radial-gradient(circle at 35% 30%, #3e322a 0%, #261d18 50%, #0d0907 100%)',
              borderColor: isWhite ? '#caa777' : '#573d2f',
            }}
          >
            {kingCount > 0 && (
              <Crown
                className={`w-3.5 h-3.5 ${
                  isWhite ? 'text-[#78350f]' : 'text-[#fde047]'
                }`}
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-[#f4ecd8] tracking-wide">
                {playerName}
              </h3>
              <span className="text-[11px] font-mono tabular-nums text-[#caa777] bg-[#120a06] px-1.5 py-0.5 rounded border border-[#3d2417]">
                {wins} Galibiyet
              </span>
            </div>
            <div className="text-xs text-[#a88d6c] flex items-center gap-2 mt-0.5">
              <span>{pieceCount} Taş Kalan</span>
              {kingCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-[#facc15] font-medium">{kingCount} Dama</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Turn Status Badge & Action */}
        <div className="flex items-center gap-2">
          {isCurrentTurn ? (
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-[#d97706]/20 text-[#fde047] border border-[#d97706]/40">
                <span className="w-2 h-2 rounded-full bg-[#facc15] animate-ping" />
                Sıra Sizde
              </span>
              {hasMandatoryCapture && (
                <span className="text-[10px] font-bold text-[#ef4444] mt-0.5 tracking-wide animate-pulse">
                  Taş Yeme Zorunlu!
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-[#8c7457] hidden sm:inline">Bekliyor</span>
          )}

          {status === 'playing' && (
            <button
              onClick={handleResign}
              title="Oyundan Çekil"
              className="p-1.5 text-[#a88d6c] hover:text-[#ef4444] hover:bg-[#381f13] rounded transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Captured Opponent Pieces Rack */}
      <div className="mt-3 pt-2.5 border-t border-[#3d2417]/80 flex items-center justify-between">
        <span className="text-[11px] text-[#8c7457] uppercase tracking-wider font-semibold">
          Toplanan Taşlar ({capturedOpponentPieces.length}/16):
        </span>
        <div className="flex items-center gap-1 flex-wrap justify-end max-w-[200px] sm:max-w-[260px]">
          {capturedOpponentPieces.length === 0 ? (
            <span className="text-[11px] text-[#6d563e] italic">Henüz yok</span>
          ) : (
            capturedOpponentPieces.map((_, idx) => (
              <div
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                title={`${isWhite ? 'Siyah' : 'Beyaz'} taş`}
                style={{
                  background: isWhite
                    ? 'radial-gradient(circle, #261d18 0%, #0d0907 100%)'
                    : 'radial-gradient(circle, #faecd5 0%, #b99361 100%)',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
