export interface MemoryCard {
  id: string;             // Unique instance ID for this card on the board
  pairId: string;         // Shared ID for matching pairs (e.g. 'react')
  name: string;           // Display name (e.g. 'React')
  color: string;          // Dominant brand / accent color
  bgGradient: string;     // Tailwind gradient classes
  borderColor: string;    // Border styling
  iconName: string;       // Lucide icon name
  isFlipped: boolean;     // Whether the card front is currently visible
  isMatched: boolean;     // Whether the card is permanently solved
  isJoker?: boolean;      // Special 25th card in 5x5 grid
}

export type GridMode = '5x5' | '4x4' | '6x4';

export interface ScorePopupEvent {
  id: number;
  delta: number;
  timestamp: number;
}

export interface MemoryGameState {
  cards: MemoryCard[];
  selectedCardIds: string[];
  isBoardLocked: boolean;
  score: number;
  moves: number;
  matchedPairsCount: number;
  totalPairsNeeded: number;
  isGameWon: boolean;
  bestScore: number;
  gridMode: GridMode;
  recentScorePopups: ScorePopupEvent[];
  streak: number;
}
