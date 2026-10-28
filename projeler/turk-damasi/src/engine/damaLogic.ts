/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board, Piece, PieceColor, Position, Move, CaptureStep } from '../types/dama';

export const BOARD_SIZE = 8;

export function createInitialBoard(): Board {
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  let idCounter = 1;

  // Row 0: Empty
  // Rows 1 and 2: Black pieces (16 total)
  for (let r = 1; r <= 2; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[r][c] = {
        id: `b_${idCounter++}`,
        color: 'black',
        type: 'man',
      };
    }
  }

  // Rows 3 and 4: Empty
  // Rows 5 and 6: White pieces (16 total)
  for (let r = 5; r <= 6; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[r][c] = {
        id: `w_${idCounter++}`,
        color: 'white',
        type: 'man',
      };
    }
  }

  // Row 7: Empty
  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

export function isInside(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

export function posToNotation(pos: Position): string {
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + pos.col);
  const rowNumber = (BOARD_SIZE - pos.row).toString();
  return `${colLetter}${rowNumber}`;
}

export function formatMoveNotation(move: Move): string {
  if (!move.isCapture) {
    return `${posToNotation(move.from)}-${posToNotation(move.to)}`;
  }
  const stepsNotation = move.steps.map((s) => posToNotation(s.to)).join('x');
  return `${posToNotation(move.from)}x${stepsNotation}`;
}

// Check if a regular man promotes at target position
export function checkPromotion(color: PieceColor, row: number): boolean {
  if (color === 'white' && row === 0) return true;
  if (color === 'black' && row === BOARD_SIZE - 1) return true;
  return false;
}

// Orthogonal directions
const DIRECTIONS = [
  { dr: -1, dc: 0, name: 'up' },
  { dr: 1, dc: 0, name: 'down' },
  { dr: 0, dc: -1, name: 'left' },
  { dr: 0, dc: 1, name: 'right' },
];

/**
 * Returns allowed directions for non-capturing man movement:
 * White moves UP, LEFT, RIGHT. (no down)
 * Black moves DOWN, LEFT, RIGHT. (no up)
 */
function getManMoveDirections(color: PieceColor) {
  if (color === 'white') {
    return [
      { dr: -1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];
  } else {
    return [
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];
  }
}

/**
 * Find all non-capturing moves for a piece at (row, col)
 */
function getQuietMovesForPiece(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: Move[] = [];
  const from = { row, col };

  if (piece.type === 'man') {
    const directions = getManMoveDirections(piece.color);
    for (const d of directions) {
      const nr = row + d.dr;
      const nc = col + d.dc;
      if (isInside(nr, nc) && board[nr][nc] === null) {
        const becomesKing = checkPromotion(piece.color, nr);
        moves.push({
          from,
          to: { row: nr, col: nc },
          isCapture: false,
          capturesCount: 0,
          steps: [],
          becomesKing,
        });
      }
    }
  } else {
    // Dama (King): moves in all 4 orthogonal directions any number of squares until blocked
    for (const d of DIRECTIONS) {
      let nr = row + d.dr;
      let nc = col + d.dc;
      while (isInside(nr, nc) && board[nr][nc] === null) {
        moves.push({
          from,
          to: { row: nr, col: nc },
          isCapture: false,
          capturesCount: 0,
          steps: [],
          becomesKing: false,
        });
        nr += d.dr;
        nc += d.dc;
      }
    }
  }

  return moves;
}

/**
 * Recursive capture search for a regular man.
 * In Turkish Draughts:
 * - A man can jump forward, left, or right (cannot jump backward).
 * - When an enemy piece is jumped, it is immediately removed so it cannot be jumped again.
 * - If a man reaches the opponent's back rank (row 0 for white, row 7 for black),
 *   it promotes to Dama and its move ceases immediately (cannot continue jumping in the same turn).
 */
function searchManCaptures(
  board: Board,
  currPos: Position,
  originalFrom: Position,
  color: PieceColor,
  currentSteps: CaptureStep[],
  results: Move[]
) {
  const directions = getManMoveDirections(color);
  let hasContinuation = false;

  for (const d of directions) {
    const enemyR = currPos.row + d.dr;
    const enemyC = currPos.col + d.dc;
    const landR = currPos.row + d.dr * 2;
    const landC = currPos.col + d.dc * 2;

    if (isInside(landR, landC) && isInside(enemyR, enemyC)) {
      const enemyPiece = board[enemyR][enemyC];
      const landCell = board[landR][landC];

      if (enemyPiece !== null && enemyPiece.color !== color && landCell === null) {
        hasContinuation = true;
        const becomesKing = checkPromotion(color, landR);

        // Make simulated jump
        const nextBoard = cloneBoard(board);
        const movingPiece = nextBoard[currPos.row][currPos.col]!;
        nextBoard[currPos.row][currPos.col] = null;
        nextBoard[enemyR][enemyC] = null; // Captured piece removed immediately

        const step: CaptureStep = {
          to: { row: landR, col: landC },
          capturedPos: { row: enemyR, col: enemyC },
          becomesKing,
        };
        const nextSteps = [...currentSteps, step];

        if (becomesKing) {
          // Reaching back rank turns into Dama and ends the turn immediately
          nextBoard[landR][landC] = {
            ...movingPiece,
            type: 'king',
          };
          results.push({
            from: originalFrom,
            to: { row: landR, col: landC },
            isCapture: true,
            capturesCount: nextSteps.length,
            steps: nextSteps,
            becomesKing: true,
          });
        } else {
          nextBoard[landR][landC] = movingPiece;
          // Continue recursion
          searchManCaptures(
            nextBoard,
            { row: landR, col: landC },
            originalFrom,
            color,
            nextSteps,
            results
          );
        }
      }
    }
  }

  // Leaf node in recursion (if this path captured at least one piece and has no further jumps)
  if (!hasContinuation && currentSteps.length > 0) {
    results.push({
      from: originalFrom,
      to: currPos,
      isCapture: true,
      capturesCount: currentSteps.length,
      steps: currentSteps,
      becomesKing: false,
    });
  }
}

/**
 * Recursive capture search for a Dama (King).
 * In Turkish Draughts:
 * - A Dama can jump in all 4 orthogonal directions.
 * - It can jump over an enemy piece at any distance along the line, provided all squares
 *   before it are empty, and land on ANY empty square along that line beyond the enemy piece
 *   (up to the next piece or board edge).
 * - Captured piece is removed immediately.
 * - After landing, it continues capturing if further jumps are available.
 */
function searchKingCaptures(
  board: Board,
  currPos: Position,
  originalFrom: Position,
  color: PieceColor,
  currentSteps: CaptureStep[],
  results: Move[]
) {
  let hasContinuation = false;

  for (const d of DIRECTIONS) {
    let scanR = currPos.row + d.dr;
    let scanC = currPos.col + d.dc;

    // Scan until we hit a piece or edge
    while (isInside(scanR, scanC) && board[scanR][scanC] === null) {
      scanR += d.dr;
      scanC += d.dc;
    }

    if (isInside(scanR, scanC)) {
      const pieceHit = board[scanR][scanC];
      if (pieceHit !== null && pieceHit.color !== color) {
        // We found an opponent piece! Now check all empty squares immediately or further behind it
        const enemyPos = { row: scanR, col: scanC };
        let landR = scanR + d.dr;
        let landC = scanC + d.dc;

        while (isInside(landR, landC) && board[landR][landC] === null) {
          hasContinuation = true;

          // Make jump to (landR, landC)
          const nextBoard = cloneBoard(board);
          const kingPiece = nextBoard[currPos.row][currPos.col]!;
          nextBoard[currPos.row][currPos.col] = null;
          nextBoard[enemyPos.row][enemyPos.col] = null; // Removed immediately
          nextBoard[landR][landC] = kingPiece;

          const step: CaptureStep = {
            to: { row: landR, col: landC },
            capturedPos: enemyPos,
            becomesKing: false,
          };
          const nextSteps = [...currentSteps, step];

          searchKingCaptures(
            nextBoard,
            { row: landR, col: landC },
            originalFrom,
            color,
            nextSteps,
            results
          );

          landR += d.dr;
          landC += d.dc;
        }
      }
    }
  }

  // Leaf node if no further jumps available and we have made captures
  if (!hasContinuation && currentSteps.length > 0) {
    results.push({
      from: originalFrom,
      to: currPos,
      isCapture: true,
      capturesCount: currentSteps.length,
      steps: currentSteps,
      becomesKing: false,
    });
  }
}

/**
 * Finds all capture sequences for a specific piece at (row, col)
 */
export function getCapturesForPiece(board: Board, row: number, col: number): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const results: Move[] = [];
  const from = { row, col };

  if (piece.type === 'man') {
    searchManCaptures(board, from, from, piece.color, [], results);
  } else {
    searchKingCaptures(board, from, from, piece.color, [], results);
  }

  return results;
}

/**
 * Returns ALL legal moves for the current player, applying the mandatory
 * Maximum Capture rule (En Çok Taş Yeme Mecburiyeti).
 *
 * Rule:
 * 1. Find maxCaptures across ALL pieces of current turn.
 * 2. If maxCaptures > 0:
 *    Return ONLY moves that capture maxCaptures pieces. (No quiet moves, no suboptimal captures).
 * 3. If maxCaptures === 0:
 *    Return all quiet (non-capturing) moves.
 */
export function getAllLegalMoves(board: Board, turn: PieceColor): Move[] {
  const allCaptures: Move[] = [];
  const allQuietMoves: Move[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        const captures = getCapturesForPiece(board, r, c);
        if (captures.length > 0) {
          allCaptures.push(...captures);
        } else {
          const quiet = getQuietMovesForPiece(board, r, c);
          allQuietMoves.push(...quiet);
        }
      }
    }
  }

  if (allCaptures.length > 0) {
    // Determine maximum captures count
    const maxCaptures = Math.max(...allCaptures.map((m) => m.capturesCount));
    // Filter to ONLY moves that capture maxCaptures
    return allCaptures.filter((m) => m.capturesCount === maxCaptures);
  }

  return allQuietMoves;
}

/**
 * Get legal moves originating specifically from (row, col).
 */
export function getLegalMovesForSquare(board: Board, turn: PieceColor, row: number, col: number): Move[] {
  const allLegal = getAllLegalMoves(board, turn);
  return allLegal.filter((m) => m.from.row === row && m.from.col === col);
}

/**
 * Applies a full move to the board and returns the new board state,
 * along with the captured pieces.
 */
export function applyMove(
  board: Board,
  move: Move
): {
  newBoard: Board;
  capturedPieces: Piece[];
  becameKing: boolean;
} {
  const newBoard = cloneBoard(board);
  const movingPiece = { ...newBoard[move.from.row][move.from.col]! };
  newBoard[move.from.row][move.from.col] = null;

  const capturedPieces: Piece[] = [];

  if (move.isCapture) {
    for (const step of move.steps) {
      const cap = newBoard[step.capturedPos.row][step.capturedPos.col];
      if (cap) {
        capturedPieces.push(cap);
        newBoard[step.capturedPos.row][step.capturedPos.col] = null;
      }
    }
  }

  if (move.becomesKing) {
    movingPiece.type = 'king';
  }

  newBoard[move.to.row][move.to.col] = movingPiece;

  return {
    newBoard,
    capturedPieces,
    becameKing: move.becomesKing,
  };
}

/**
 * Check game outcome
 */
export function evaluateGameStatus(
  board: Board,
  nextTurn: PieceColor
): {
  status: 'playing' | 'white_won' | 'black_won' | 'draw';
  reason?: string;
} {
  let whiteCount = 0;
  let blackCount = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === 'white') whiteCount++;
        else blackCount++;
      }
    }
  }

  if (whiteCount === 0) {
    return { status: 'black_won', reason: 'Siyah tüm beyaz taşları topladı!' };
  }
  if (blackCount === 0) {
    return { status: 'white_won', reason: 'Beyaz tüm siyah taşları topladı!' };
  }

  // Check if player whose turn it is has legal moves
  const legalMoves = getAllLegalMoves(board, nextTurn);
  if (legalMoves.length === 0) {
    if (nextTurn === 'white') {
      return { status: 'black_won', reason: 'Beyazın yapabileceği geçerli hamle kalmadı (Abluka)!' };
    } else {
      return { status: 'white_won', reason: 'Siyahın yapabileceği geçerli hamle kalmadı (Abluka)!' };
    }
  }

  return { status: 'playing' };
}
