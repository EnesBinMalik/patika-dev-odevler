/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crown } from 'lucide-react';
import { Piece, PieceColor, PieceType } from '../types/dama';

interface PieceViewProps {
  piece: Piece;
  isSelected: boolean;
  isMandatoryCapture: boolean;
}

export const PieceView: React.FC<PieceViewProps> = ({
  piece,
  isSelected,
  isMandatoryCapture,
}) => {
  const isWhite = piece.color === 'white';
  const isKing = piece.type === 'king';

  return (
    <div
      className={`relative w-[82%] h-[82%] rounded-full transition-all duration-150 select-none cursor-pointer flex items-center justify-center
        ${
          isSelected
            ? 'scale-105 ring-4 ring-[#facc15] shadow-2xl -translate-y-1'
            : isMandatoryCapture
            ? 'ring-2 ring-[#f59e0b] shadow-lg animate-pulse'
            : 'hover:scale-[1.03] shadow-md hover:shadow-lg'
        }
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D wooden piece base shadow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: isWhite
            ? '0 6px 10px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -4px 6px rgba(160,110,60,0.6)'
            : '0 6px 12px rgba(0,0,0,0.7), inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -4px 8px rgba(0,0,0,0.9)',
          background: isWhite
            ? 'radial-gradient(circle at 35% 30%, #fffbf0 0%, #faecd5 40%, #dec198 85%, #b99361 100%)'
            : 'radial-gradient(circle at 35% 30%, #3e322a 0%, #261d18 45%, #150f0c 85%, #0d0907 100%)',
        }}
      />

      {/* Lathe-turned concentric ridges (authentic hand-turned wooden checker) */}
      <div
        className="absolute inset-[10%] rounded-full border pointer-events-none"
        style={{
          borderColor: isWhite ? 'rgba(160, 110, 60, 0.35)' : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isWhite
            ? 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 1px rgba(0,0,0,0.1)'
            : 'inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 1px rgba(0,0,0,0.5)',
        }}
      />
      <div
        className="absolute inset-[22%] rounded-full border pointer-events-none"
        style={{
          borderColor: isWhite ? 'rgba(160, 110, 60, 0.45)' : 'rgba(255, 255, 255, 0.15)',
          background: isWhite
            ? 'radial-gradient(circle at 35% 35%, #fffdf7 0%, #ebd3af 80%, #d8b789 100%)'
            : 'radial-gradient(circle at 35% 35%, #2a201a 0%, #17110e 80%, #100b08 100%)',
        }}
      />

      {/* Center symbol for King (Dama) or regular piece center dimple */}
      {isKing ? (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center brass-inlay"
            style={{
              background: 'radial-gradient(circle, #fde047 0%, #ca8a04 70%, #854d0e 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px #fff',
            }}
          >
            <Crown
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#451a03] drop-shadow-sm"
              strokeWidth={2.5}
            />
          </div>
          <span
            className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5"
            style={{
              color: isWhite ? '#78350f' : '#fef08a',
              textShadow: isWhite ? '0 1px 0 rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.9)',
            }}
          >
            DAMA
          </span>
        </div>
      ) : (
        <div
          className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
          style={{
            background: isWhite
              ? 'radial-gradient(circle at 35% 35%, #c89e6c 0%, #9e6f3b 100%)'
              : 'radial-gradient(circle at 35% 35%, #1c140f 0%, #080605 100%)',
            boxShadow: isWhite
              ? 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.6)'
              : 'inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.15)',
          }}
        />
      )}
    </div>
  );
};
