/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectSquare } from '../store/damaSlice';
import { PieceView } from './PieceView';
import { BOARD_SIZE, posToNotation } from '../engine/damaLogic';
import { Position } from '../types/dama';

export const Board: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    board,
    turn,
    selectedPos,
    legalMovesForSelected,
    allLegalMoves,
    boardOrientation,
    showCoordinates,
    moveAssistance,
    lastMove,
    status,
  } = useAppSelector((state) => state.dama);

  // Determine which pieces have mandatory captures
  const mandatoryCapturePieces = React.useMemo(() => {
    if (!moveAssistance || allLegalMoves.length === 0 || !allLegalMoves[0].isCapture) {
      return new Set<string>();
    }
    const set = new Set<string>();
    for (const move of allLegalMoves) {
      set.add(`${move.from.row},${move.from.col}`);
    }
    return set;
  }, [allLegalMoves, moveAssistance]);

  // Destination squares map from the currently selected piece
  const destinationMap = React.useMemo(() => {
    const map = new Map<string, { isCapture: boolean; capturesCount: number }>();
    for (const m of legalMovesForSelected) {
      map.set(`${m.to.row},${m.to.col}`, {
        isCapture: m.isCapture,
        capturesCount: m.capturesCount,
      });
    }
    return map;
  }, [legalMovesForSelected]);

  // Build grid indices based on boardOrientation
  const rowIndices = React.useMemo(() => {
    const rows = Array.from({ length: BOARD_SIZE }, (_, i) => i);
    return boardOrientation === 'black' ? rows.reverse() : rows;
  }, [boardOrientation]);

  const colIndices = React.useMemo(() => {
    const cols = Array.from({ length: BOARD_SIZE }, (_, i) => i);
    return boardOrientation === 'black' ? cols.reverse() : cols;
  }, [boardOrientation]);

  const handleCellClick = (r: number, c: number) => {
    dispatch(selectSquare({ row: r, col: c }));
  };

  return (
    <div className="relative p-3 sm:p-5 rounded-2xl wood-board-border border-4 border-[#502e1c]">
      {/* Corner decorative brass brackets */}
      <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d97706]/70 rounded-tl-lg pointer-events-none" />
      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d97706]/70 rounded-tr-lg pointer-events-none" />
      <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d97706]/70 rounded-bl-lg pointer-events-none" />
      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d97706]/70 rounded-br-lg pointer-events-none" />

      {/* Board inner container with coordinates */}
      <div className="relative">
        {/* Top column labels */}
        {showCoordinates && (
          <div className="flex pl-6 pr-2 mb-1.5 text-[11px] sm:text-xs font-semibold text-[#caa777]/80 tracking-wider">
            {colIndices.map((c) => (
              <div key={c} className="flex-1 text-center uppercase">
                {String.fromCharCode('a'.charCodeAt(0) + c)}
              </div>
            ))}
          </div>
        )}

        <div className="flex">
          {/* Left row labels */}
          {showCoordinates && (
            <div className="flex flex-col justify-around pr-2 text-[11px] sm:text-xs font-semibold text-[#caa777]/80 w-5">
              {rowIndices.map((r) => (
                <div key={r} className="h-full flex items-center justify-center">
                  {BOARD_SIZE - r}
                </div>
              ))}
            </div>
          )}

          {/* The 8x8 Grid */}
          <div
            className="grid grid-cols-8 grid-rows-8 w-[min(88vw,480px)] h-[min(88vw,480px)] sm:w-[500px] sm:h-[500px] lg:w-[540px] lg:h-[540px] rounded-lg overflow-hidden shadow-inner border-2 border-[#452718]"
            style={{
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)',
            }}
          >
            {rowIndices.map((r) =>
              colIndices.map((c) => {
                const piece = board[r][c];
                const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                const isLastMoveOrigin = lastMove?.from.row === r && lastMove?.from.col === c;
                const isLastMoveTarget = lastMove?.to.row === r && lastMove?.to.col === c;
                const isMandatory = mandatoryCapturePieces.has(`${r},${c}`);
                const destinationInfo = destinationMap.get(`${r},${c}`);
                const isLegalDestination = !!destinationInfo;

                // Alternating subtle wood finish pattern
                const isLightSquare = (r + c) % 2 === 0;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    disabled={status !== 'playing'}
                    aria-label={`Kare ${posToNotation({ row: r, col: c })}`}
                    className={`relative w-full h-full flex items-center justify-center p-0 m-0 border border-black/5 focus:outline-none transition-colors ${
                      isLightSquare ? 'wood-square-light' : 'wood-square-dark'
                    }`}
                  >
                    {/* Last move highlights */}
                    {(isLastMoveOrigin || isLastMoveTarget) && (
                      <div className="absolute inset-0 bg-[#eab308]/20 pointer-events-none" />
                    )}

                    {/* Selected square highlight */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#fde047]/30 ring-2 ring-inset ring-[#eab308] pointer-events-none z-10" />
                    )}

                    {/* Legal destination indicator */}
                    {isLegalDestination && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        {destinationInfo.isCapture ? (
                          <div className="relative flex items-center justify-center animate-pulse">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#ef4444] bg-[#ef4444]/20 flex items-center justify-center shadow-lg">
                              <span className="text-[10px] font-black text-white bg-[#dc2626] rounded-full w-4 h-4 flex items-center justify-center">
                                {destinationInfo.capturesCount > 1 ? destinationInfo.capturesCount : '✕'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#3b82f6]/70 ring-2 ring-[#60a5fa] shadow-md animate-ping" />
                        )}
                      </div>
                    )}

                    {/* Piece render */}
                    {piece && (
                      <PieceView
                        piece={piece}
                        isSelected={isSelected}
                        isMandatoryCapture={isMandatory}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom column labels */}
        {showCoordinates && (
          <div className="flex pl-6 pr-2 mt-1.5 text-[11px] sm:text-xs font-semibold text-[#caa777]/80 tracking-wider">
            {colIndices.map((c) => (
              <div key={c} className="flex-1 text-center uppercase">
                {String.fromCharCode('a'.charCodeAt(0) + c)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
