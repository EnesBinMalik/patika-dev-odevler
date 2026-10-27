import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cardClicked, resolveTurn, setGridMode, clearOldPopups } from '../store/memorySlice';
import { CardItem } from './CardItem';
import { GridMode } from '../types/game';
import { soundManager } from '../utils/soundEffects';

export const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cards, selectedCardIds, isBoardLocked, gridMode } = useAppSelector(
    (state) => state.memory
  );

  // Audio trigger ref to avoid duplicate sound triggers
  const evaluatedTurnRef = useRef<string | null>(null);

  // Monitor two selected cards to play sound and trigger resolveTurn after a brief delay
  useEffect(() => {
    if (selectedCardIds.length === 2) {
      const turnKey = selectedCardIds.join('-');
      if (evaluatedTurnRef.current !== turnKey) {
        evaluatedTurnRef.current = turnKey;

        const [id1, id2] = selectedCardIds;
        const card1 = cards.find((c) => c.id === id1);
        const card2 = cards.find((c) => c.id === id2);

        if (card1 && card2) {
          // Play matching audio feedback
          const timerSound = setTimeout(() => {
            if (card1.pairId === card2.pairId) {
              soundManager.playMatch();
            } else {
              soundManager.playMismatch();
            }
          }, 350);

          // Dispatch Redux resolve turn after player sees cards
          const timerResolve = setTimeout(() => {
            dispatch(resolveTurn());
            evaluatedTurnRef.current = null;
          }, 850);

          return () => {
            clearTimeout(timerSound);
            clearTimeout(timerResolve);
          };
        }
      }
    }
  }, [selectedCardIds, cards, dispatch]);

  // Periodic cleanup for score popups
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(clearOldPopups());
    }, 1200);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleCardClick = (cardId: string) => {
    dispatch(cardClicked(cardId));
  };

  const handleGridModeChange = (mode: GridMode) => {
    dispatch(setGridMode(mode));
    soundManager.playFlip();
  };

  const gridClass =
    gridMode === '5x5'
      ? 'grid-cols-5'
      : gridMode === '4x4'
      ? 'grid-cols-4'
      : 'grid-cols-6';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Grid Mode Segmented Control */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Matris Düzeni:
        </span>
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => handleGridModeChange('5x5')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              gridMode === '5x5'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5x5 Matris (Ödev)
          </button>
          <button
            onClick={() => handleGridModeChange('4x4')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              gridMode === '4x4'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4x4 Matris
          </button>
          <button
            onClick={() => handleGridModeChange('6x4')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              gridMode === '6x4'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            6x4 Matris
          </button>
        </div>
      </div>

      {/* THE 5x5 CARD MATRIX (Kart çiftleri, 5x5 matris üzerine karmaşık olarak dağıtılmıştır) */}
      <div
        className={`w-full grid ${gridClass} gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 bg-slate-900/60 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-sm`}
        role="region"
        aria-label="5x5 Hafıza Kartı Oyun Matrisi"
      >
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isLocked={isBoardLocked}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};
