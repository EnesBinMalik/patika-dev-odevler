/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { RotateCcw, ScrollText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { undoMove } from '../store/damaSlice';

export const MoveHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { history, snapshots, status } = useAppSelector((state) => state.dama);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group history into rounds (White move, Black move)
  const pairedMoves = React.useMemo(() => {
    const pairs: { round: number; white?: string; black?: string; isCaptureW?: boolean; isCaptureB?: boolean }[] = [];
    for (let i = 0; i < history.length; i++) {
      const rec = history[i];
      const roundIndex = Math.floor(i / 2);
      if (!pairs[roundIndex]) {
        pairs[roundIndex] = { round: roundIndex + 1 };
      }
      if (rec.turn === 'white') {
        pairs[roundIndex].white = rec.notation;
        pairs[roundIndex].isCaptureW = rec.isCapture;
      } else {
        pairs[roundIndex].black = rec.notation;
        pairs[roundIndex].isCaptureB = rec.isCapture;
      }
    }
    return pairs;
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="bg-[#1c120a] border border-[#3d2417] rounded-xl p-3 sm:p-4 flex flex-col h-[280px] sm:h-[340px] shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-[#3d2417]">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#caa777]">
          <ScrollText className="w-4 h-4 text-[#d97706]" />
          <span>Hamle Defteri</span>
          <span className="text-xs font-mono text-[#8c7457]">
            ({history.length} hamle)
          </span>
        </div>

        <button
          onClick={() => dispatch(undoMove())}
          disabled={snapshots.length === 0 || status !== 'playing'}
          title="Son hamleyi geri al"
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#29170e] hover:bg-[#381f13] text-[#caa777] hover:text-[#fde047] disabled:opacity-40 disabled:cursor-not-allowed border border-[#4a2e1d] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Geri Al</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mt-2 pr-1 space-y-1 font-mono text-xs text-[#d1baa0] scrollbar-thin scrollbar-thumb-[#4a2e1d]"
      >
        {pairedMoves.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#6e543c] italic text-xs">
            Henüz hamle yapılmadı. Beyaz başlar.
          </div>
        ) : (
          pairedMoves.map((p) => (
            <div
              key={p.round}
              className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#28180e] transition-colors"
            >
              <span className="text-[#8c7457] w-8 tabular-nums font-semibold">
                {p.round}.
              </span>
              <span
                className={`flex-1 text-left ${
                  p.isCaptureW ? 'text-[#f59e0b] font-bold' : 'text-[#f4ecd8]'
                }`}
              >
                {p.white || '-'}
              </span>
              <span
                className={`flex-1 text-right ${
                  p.isCaptureB ? 'text-[#f59e0b] font-bold' : 'text-[#e5d5be]'
                }`}
              >
                {p.black || ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
