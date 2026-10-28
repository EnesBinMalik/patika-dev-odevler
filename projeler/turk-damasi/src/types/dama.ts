/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PieceColor = 'white' | 'black';
export type PieceType = 'man' | 'king';

export interface Piece {
  id: string;
  color: PieceColor;
  type: PieceType;
}

export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface CaptureStep {
  to: Position;
  capturedPos: Position;
  becomesKing: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  // If this move is part of a capture sequence
  isCapture: boolean;
  capturesCount: number;
  // Full path of positions for multi-jumps
  steps: CaptureStep[];
  // Final state of the moving piece after this full move
  becomesKing: boolean;
}

export type GameStatus = 'playing' | 'white_won' | 'black_won' | 'draw';

export type BoardOrientation = 'white' | 'black' | 'auto_flip';

export interface HistoryRecord {
  id: string;
  moveNumber: number;
  turn: PieceColor;
  from: Position;
  to: Position;
  notation: string;
  isCapture: boolean;
  capturedCount: number;
  becameKing: boolean;
  timestamp: number;
}
