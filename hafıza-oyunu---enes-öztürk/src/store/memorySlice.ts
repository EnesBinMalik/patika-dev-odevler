import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardItemDefinition, TECH_CARDS, JOKER_CARD } from '../data/cardData';
import { GridMode, MemoryCard, MemoryGameState } from '../types/game';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDeck(gridMode: GridMode): { cards: MemoryCard[]; totalPairs: number } {
  let pairCount = 12; // For 5x5: 12 pairs (24 cards) + 1 Joker = 25 cards
  let includeJoker = true;

  if (gridMode === '4x4') {
    pairCount = 8;
    includeJoker = false;
  } else if (gridMode === '6x4') {
    pairCount = 12;
    includeJoker = false;
  }

  const selectedDefinitions = TECH_CARDS.slice(0, pairCount);
  const cardList: MemoryCard[] = [];

  selectedDefinitions.forEach((def: CardItemDefinition) => {
    // Card copy 1
    cardList.push({
      id: `${def.pairId}-a-${Math.random().toString(36).substring(2, 7)}`,
      pairId: def.pairId,
      name: def.name,
      color: def.color,
      bgGradient: def.bgGradient,
      borderColor: def.borderColor,
      iconName: def.iconName,
      isFlipped: false,
      isMatched: false,
    });
    // Card copy 2
    cardList.push({
      id: `${def.pairId}-b-${Math.random().toString(36).substring(2, 7)}`,
      pairId: def.pairId,
      name: def.name,
      color: def.color,
      bgGradient: def.bgGradient,
      borderColor: def.borderColor,
      iconName: def.iconName,
      isFlipped: false,
      isMatched: false,
    });
  });

  if (includeJoker) {
    cardList.push({
      id: `joker-${Math.random().toString(36).substring(2, 7)}`,
      pairId: JOKER_CARD.pairId,
      name: JOKER_CARD.name,
      color: JOKER_CARD.color,
      bgGradient: JOKER_CARD.bgGradient,
      borderColor: JOKER_CARD.borderColor,
      iconName: JOKER_CARD.iconName,
      isFlipped: false,
      isMatched: false,
      isJoker: true,
    });
  }

  const shuffled = shuffleArray(cardList);
  return {
    cards: shuffled,
    totalPairs: pairCount + (includeJoker ? 1 : 0),
  };
}

const getStoredBestScore = (): number => {
  try {
    const val = localStorage.getItem('memory_game_best_score');
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

const initialDeck = generateDeck('5x5');

const initialState: MemoryGameState = {
  cards: initialDeck.cards,
  selectedCardIds: [],
  isBoardLocked: false,
  score: 0,
  moves: 0,
  matchedPairsCount: 0,
  totalPairsNeeded: initialDeck.totalPairs,
  isGameWon: false,
  bestScore: getStoredBestScore(),
  gridMode: '5x5',
  recentScorePopups: [],
  streak: 0,
};

export const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    cardClicked: (state, action: PayloadAction<string>) => {
      if (state.isBoardLocked) return;
      if (state.isGameWon) return;

      const cardId = action.payload;
      const card = state.cards.find((c) => c.id === cardId);

      if (!card || card.isFlipped || card.isMatched) return;

      // Handle Special Joker Card click in 5x5 matrix
      if (card.isJoker) {
        card.isFlipped = true;
        card.isMatched = true;
        state.score += 50;
        state.moves += 1;
        state.matchedPairsCount += 1;
        state.recentScorePopups.push({
          id: Date.now(),
          delta: 50,
          timestamp: Date.now(),
        });

        if (state.score > state.bestScore) {
          state.bestScore = state.score;
          try {
            localStorage.setItem('memory_game_best_score', String(state.score));
          } catch {}
        }

        // Check if all cards matched
        if (state.cards.every((c) => c.isMatched)) {
          state.isGameWon = true;
        }
        return;
      }

      // Normal card handling
      card.isFlipped = true;
      state.selectedCardIds.push(cardId);

      if (state.selectedCardIds.length === 2) {
        state.moves += 1;
        state.isBoardLocked = true;
      }
    },

    resolveTurn: (state) => {
      if (state.selectedCardIds.length !== 2) {
        state.isBoardLocked = false;
        return;
      }

      const [firstId, secondId] = state.selectedCardIds;
      const card1 = state.cards.find((c) => c.id === firstId);
      const card2 = state.cards.find((c) => c.id === secondId);

      if (!card1 || !card2) {
        state.selectedCardIds = [];
        state.isBoardLocked = false;
        return;
      }

      // Requirement:
      // "Üst üste iki kart açıldığında, eğer kartlar aynıysa geri kapanmamalıdır ve 50 puan eklenmelidir."
      // "Üst üste iki kart açıldığında, eğer aynı kartlar değilse açılan kartlar geri kapanmalıdır ve 10 puan eksilmelidir."
      if (card1.pairId === card2.pairId) {
        card1.isMatched = true;
        card2.isMatched = true;
        state.score += 50;
        state.matchedPairsCount += 1;
        state.streak += 1;

        state.recentScorePopups.push({
          id: Date.now(),
          delta: 50,
          timestamp: Date.now(),
        });

        if (state.score > state.bestScore) {
          state.bestScore = state.score;
          try {
            localStorage.setItem('memory_game_best_score', String(state.score));
          } catch {}
        }
      } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
        state.score -= 10;
        state.streak = 0;

        state.recentScorePopups.push({
          id: Date.now(),
          delta: -10,
          timestamp: Date.now(),
        });
      }

      state.selectedCardIds = [];
      state.isBoardLocked = false;

      // Requirement: "Tüm kartlar açıldığında 'Yeniden Oyna' adında bir buton gösterilmeli"
      if (state.cards.every((c) => c.isMatched)) {
        state.isGameWon = true;
      }
    },

    // Requirement:
    // "Tüm kartlar açıldığında 'Yeniden Oyna' adında bir buton gösterilmeli ve bu butona tıklandığında kartlar kapanarak yeniden karıştırılmalıdır."
    restartGame: (state) => {
      const newDeck = generateDeck(state.gridMode);
      state.cards = newDeck.cards;
      state.totalPairsNeeded = newDeck.totalPairs;
      state.selectedCardIds = [];
      state.isBoardLocked = false;
      state.score = 0;
      state.moves = 0;
      state.matchedPairsCount = 0;
      state.isGameWon = false;
      state.streak = 0;
      state.recentScorePopups = [];
    },

    setGridMode: (state, action: PayloadAction<GridMode>) => {
      state.gridMode = action.payload;
      const newDeck = generateDeck(action.payload);
      state.cards = newDeck.cards;
      state.totalPairsNeeded = newDeck.totalPairs;
      state.selectedCardIds = [];
      state.isBoardLocked = false;
      state.score = 0;
      state.moves = 0;
      state.matchedPairsCount = 0;
      state.isGameWon = false;
      state.streak = 0;
      state.recentScorePopups = [];
    },

    clearOldPopups: (state) => {
      const now = Date.now();
      state.recentScorePopups = state.recentScorePopups.filter((p) => now - p.timestamp < 1000);
    },
  },
});

export const { cardClicked, resolveTurn, restartGame, setGridMode, clearOldPopups } =
  memorySlice.actions;

export default memorySlice.reducer;
