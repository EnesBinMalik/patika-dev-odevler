import React from 'react';
import { MemoryCard } from '../types/game';
import { CardIcon } from './CardIcon';
import { soundManager } from '../utils/soundEffects';
import { Check, Star } from 'lucide-react';

interface CardItemProps {
  card: MemoryCard;
  isLocked: boolean;
  onCardClick: (cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, isLocked, onCardClick }) => {
  const isInteractive = !card.isFlipped && !card.isMatched && !isLocked;

  const handleClick = () => {
    if (!isInteractive) return;
    if (card.isJoker) {
      soundManager.playJoker();
    } else {
      soundManager.playFlip();
    }
    onCardClick(card.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label={
        isRevealed
          ? `${card.name} kartı, ${card.isMatched ? 'eşleşti' : 'açık'}`
          : 'Kapalı hafıza kartı'
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative aspect-square w-full select-none perspective-1000 ${
        isInteractive
          ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.98]'
          : card.isMatched
          ? 'cursor-default'
          : 'cursor-not-allowed opacity-90'
      } transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-xl`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d rounded-xl transition-transform ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* CARD FRONT FACE (Covered / Face-Down) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl backface-hidden flex flex-col items-center justify-center border border-slate-700/80 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 shadow-md transition-all duration-300 ${
            isInteractive ? 'group-hover:border-indigo-500/70 group-hover:shadow-indigo-500/10' : ''
          }`}
        >
          {/* Subtle geometric pattern background */}
          <div className="absolute inset-1 rounded-lg border border-slate-700/30 flex items-center justify-center overflow-hidden">
            <div className="absolute w-12 h-12 rounded-full bg-indigo-500/5 blur-sm" />
            <div className="text-slate-600 font-mono text-xs select-none opacity-40 font-semibold tracking-wider">
              EO
            </div>
          </div>
          <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:border-indigo-400/50 transition-colors">
            <span className="text-slate-400 group-hover:text-indigo-400 text-base sm:text-lg font-bold font-mono transition-colors">
              ?
            </span>
          </div>
        </div>

        {/* CARD BACK FACE (Revealed / Face-Up) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-2 border shadow-lg overflow-hidden transition-all duration-300 ${
            card.isJoker
              ? 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-amber-900/40 border-amber-400/80 shadow-amber-500/20'
              : card.isMatched
              ? 'bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/70 shadow-emerald-500/10'
              : `bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 ${card.borderColor} shadow-indigo-500/15`
          }`}
        >
          {/* Subtle matched check badge */}
          {card.isMatched && !card.isJoker && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          )}

          {/* Joker star badge */}
          {card.isJoker && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
            </div>
          )}

          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${card.bgGradient} mb-1 border border-white/10 shadow-sm`}
          >
            <CardIcon iconName={card.iconName} color={card.color} />
          </div>

          <span
            className="text-[10px] sm:text-xs font-semibold text-center truncate max-w-[90%] text-slate-200"
            title={card.name}
          >
            {card.isJoker ? '★ JOKER' : card.name}
          </span>

          {card.isJoker && (
            <span className="text-[9px] font-mono font-medium text-amber-400 tracking-tight">
              +50 Bonus
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
