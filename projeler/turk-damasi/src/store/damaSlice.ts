/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Board,
  BoardOrientation,
  GameStatus,
  HistoryRecord,
  Move,
  Piece,
  PieceColor,
  Position,
} from '../types/dama';
import {
  applyMove,
  createInitialBoard,
  evaluateGameStatus,
  formatMoveNotation,
  getAllLegalMoves,
  getLegalMovesForSquare,
} from '../engine/damaLogic';
import { soundManager } from '../audio/soundEffects';

interface DamaState {
  board: Board;
  turn: PieceColor;
  selectedPos: Position | null;
  legalMovesForSelected: Move[];
  allLegalMoves: Move[];
  status: GameStatus;
  winReason: string;
  capturedWhite: Piece[];
  capturedBlack: Piece[];
  history: HistoryRecord[];
  boardOrientation: BoardOrientation;
  soundEnabled: boolean;
  showCoordinates: boolean;
  moveAssistance: boolean;
  lastMove: {
    from: Position;
    to: Position;
    steps: Position[];
  } | null;
  isRulesModalOpen: boolean;
  score: {
    white: number;
    black: number;
    draws: number;
  };
  // Snapshot for undo
  snapshots: {
    board: Board;
    turn: PieceColor;
    capturedWhite: Piece[];
    capturedBlack: Piece[];
    history: HistoryRecord[];
  }[];
}

const initialBoard = createInitialBoard();
const initialMoves = getAllLegalMoves(initialBoard, 'white');

const initialState: DamaState = {
  board: initialBoard,
  turn: 'white',
  selectedPos: null,
  legalMovesForSelected: [],
  allLegalMoves: initialMoves,
  status: 'playing',
  winReason: '',
  capturedWhite: [],
  capturedBlack: [],
  history: [],
  boardOrientation: 'white',
  soundEnabled: true,
  showCoordinates: true,
  moveAssistance: true,
  lastMove: null,
  isRulesModalOpen: false,
  score: {
    white: 0,
    black: 0,
    draws: 0,
  },
  snapshots: [],
};

export const damaSlice = createSlice({
  name: 'dama',
  initialState,
  reducers: {
    selectSquare: (state, action: PayloadAction<Position>) => {
      if (state.status !== 'playing') return;

      const { row, col } = action.payload;
      const clickedPiece = state.board[row][col];

      // If user clicks the currently selected square, deselect
      if (state.selectedPos && state.selectedPos.row === row && state.selectedPos.col === col) {
        state.selectedPos = null;
        state.legalMovesForSelected = [];
        return;
      }

      // If user has a selected piece and clicks one of its legal destination squares
      if (state.selectedPos) {
        const matchedMove = state.legalMovesForSelected.find(
          (m) => m.to.row === row && m.to.col === col
        );
        if (matchedMove) {
          // Execute this move!
          damaSlice.caseReducers.executeMove(state, {
            type: 'dama/executeMove',
            payload: matchedMove,
          });
          return;
        }
      }

      // If clicking on their own piece
      if (clickedPiece && clickedPiece.color === state.turn) {
        // Find if this square has legal moves (respecting max capture rules)
        const pieceMoves = getLegalMovesForSquare(state.board, state.turn, row, col);
        if (pieceMoves.length > 0) {
          state.selectedPos = { row, col };
          state.legalMovesForSelected = pieceMoves;
          soundManager.playSelect();
        } else {
          // Has no legal moves (e.g. mandatory capture elsewhere)
          state.selectedPos = { row, col };
          state.legalMovesForSelected = [];
          soundManager.playSelect();
        }
      } else {
        // Clicked an empty cell or opponent piece that isn't a valid move destination
        state.selectedPos = null;
        state.legalMovesForSelected = [];
      }
    },

    executeMove: (state, action: PayloadAction<Move>) => {
      const move = action.payload;

      // Save snapshot for Undo
      state.snapshots.push({
        board: state.board.map((r) => r.map((c) => (c ? { ...c } : null))),
        turn: state.turn,
        capturedWhite: [...state.capturedWhite],
        capturedBlack: [...state.capturedBlack],
        history: [...state.history],
      });
      // Limit snapshot stack to 30 moves
      if (state.snapshots.length > 30) {
        state.snapshots.shift();
      }

      // Apply move logic
      const { newBoard, capturedPieces, becameKing } = applyMove(state.board, move);

      // Track captured pieces
      for (const p of capturedPieces) {
        if (p.color === 'white') {
          state.capturedWhite.push(p);
        } else {
          state.capturedBlack.push(p);
        }
      }

      // Play appropriate sound
      if (becameKing) {
        soundManager.playKingPromotion();
      } else if (move.isCapture) {
        soundManager.playCapture();
      } else {
        soundManager.playMove();
      }

      // Record move history
      const notation = formatMoveNotation(move);
      state.history.push({
        id: `move_${Date.now()}_${state.history.length + 1}`,
        moveNumber: Math.floor(state.history.length / 2) + 1,
        turn: state.turn,
        from: move.from,
        to: move.to,
        notation,
        isCapture: move.isCapture,
        capturedCount: move.capturesCount,
        becameKing,
        timestamp: Date.now(),
      });

      // Update lastMove for board highlights
      state.lastMove = {
        from: move.from,
        to: move.to,
        steps: move.steps.map((s) => s.to),
      };

      // Switch turn
      const nextTurn: PieceColor = state.turn === 'white' ? 'black' : 'white';
      state.turn = nextTurn;
      state.board = newBoard;
      state.selectedPos = null;
      state.legalMovesForSelected = [];

      // Evaluate new turn's legal moves & game outcome
      const outcome = evaluateGameStatus(newBoard, nextTurn);
      if (outcome.status !== 'playing') {
        state.status = outcome.status;
        state.winReason = outcome.reason || '';
        state.allLegalMoves = [];
        soundManager.playVictory();

        if (outcome.status === 'white_won') {
          state.score.white += 1;
        } else if (outcome.status === 'black_won') {
          state.score.black += 1;
        } else {
          state.score.draws += 1;
        }
      } else {
        state.allLegalMoves = getAllLegalMoves(newBoard, nextTurn);
      }
    },

    resetGame: (state) => {
      const newBoard = createInitialBoard();
      state.board = newBoard;
      state.turn = 'white';
      state.selectedPos = null;
      state.legalMovesForSelected = [];
      state.allLegalMoves = getAllLegalMoves(newBoard, 'white');
      state.status = 'playing';
      state.winReason = '';
      state.capturedWhite = [];
      state.capturedBlack = [];
      state.history = [];
      state.lastMove = null;
      state.snapshots = [];
      soundManager.playMove();
    },

    undoMove: (state) => {
      if (state.snapshots.length === 0) return;
      const prev = state.snapshots.pop()!;
      state.board = prev.board;
      state.turn = prev.turn;
      state.capturedWhite = prev.capturedWhite;
      state.capturedBlack = prev.capturedBlack;
      state.history = prev.history;
      state.selectedPos = null;
      state.legalMovesForSelected = [];
      state.status = 'playing';
      state.winReason = '';
      state.allLegalMoves = getAllLegalMoves(prev.board, prev.turn);

      if (state.history.length > 0) {
        const last = state.history[state.history.length - 1];
        state.lastMove = {
          from: last.from,
          to: last.to,
          steps: [],
        };
      } else {
        state.lastMove = null;
      }
      soundManager.playMove();
    },

    setBoardOrientation: (state, action: PayloadAction<BoardOrientation>) => {
      state.boardOrientation = action.payload;
    },

    toggleBoardOrientation: (state) => {
      state.boardOrientation = state.boardOrientation === 'white' ? 'black' : 'white';
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      soundManager.setEnabled(state.soundEnabled);
    },

    toggleCoordinates: (state) => {
      state.showCoordinates = !state.showCoordinates;
    },

    toggleMoveAssistance: (state) => {
      state.moveAssistance = !state.moveAssistance;
    },

    openRulesModal: (state) => {
      state.isRulesModalOpen = true;
    },

    closeRulesModal: (state) => {
      state.isRulesModalOpen = false;
    },

    resign: (state, action: PayloadAction<PieceColor>) => {
      if (state.status !== 'playing') return;
      const resigningPlayer = action.payload;
      if (resigningPlayer === 'white') {
        state.status = 'black_won';
        state.winReason = 'Beyaz oyuncu oyundan çekildi.';
        state.score.black += 1;
      } else {
        state.status = 'white_won';
        state.winReason = 'Siyah oyuncu oyundan çekildi.';
        state.score.white += 1;
      }
      state.allLegalMoves = [];
      soundManager.playVictory();
    },

    agreeDraw: (state) => {
      if (state.status !== 'playing') return;
      state.status = 'draw';
      state.winReason = 'İki oyuncu karşılıklı beraberlikte anlaştı.';
      state.score.draws += 1;
      state.allLegalMoves = [];
    },
  },
});

export const {
  selectSquare,
  executeMove,
  resetGame,
  undoMove,
  setBoardOrientation,
  toggleBoardOrientation,
  toggleSound,
  toggleCoordinates,
  toggleMoveAssistance,
  openRulesModal,
  closeRulesModal,
  resign,
  agreeDraw,
} = damaSlice.actions;

export default damaSlice.reducer;
