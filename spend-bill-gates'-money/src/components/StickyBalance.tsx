import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { INITIAL_BALANCE } from '../data/items';
import { Language } from '../types';

interface StickyBalanceProps {
  balance: number;
  totalSpent: number;
  language: Language;
  onScrollToReceipt: () => void;
  purchasedCount: number;
}

export const StickyBalance: React.FC<StickyBalanceProps> = ({
  balance,
  totalSpent,
  language,
  onScrollToReceipt,
  purchasedCount,
}) => {
  const isTr = language === 'tr';
  const percentageSpent = (totalSpent / INITIAL_BALANCE) * 100;

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-md transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center text-center">
        {/* Main Balance Display */}
        <div className="flex items-center justify-center gap-3">
          <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums drop-shadow-xs">
            {formatCurrency(balance)}
          </div>
        </div>

        {/* Progress & Spending Breakdown */}
        <div className="w-full max-w-xl mt-2.5 flex flex-col items-center gap-1.5">
          <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, percentageSpent))}%` }}
            />
          </div>

          <div className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-emerald-100">
            <span>
              {isTr ? 'Kalan Servet' : 'Remaining'}:{' '}
              <strong className="text-white">{(100 - percentageSpent).toFixed(4)}%</strong>
            </span>

            {purchasedCount > 0 && (
              <button
                onClick={onScrollToReceipt}
                className="inline-flex items-center gap-1 text-white hover:text-emerald-200 underline font-semibold transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>
                  {purchasedCount} {isTr ? 'Ürün Sepette' : 'In Basket'}
                </span>
              </button>
            )}

            <span>
              {isTr ? 'Harcanan' : 'Spent'}:{' '}
              <strong className="text-white font-mono">{formatCurrency(totalSpent)}</strong> (
              {percentageSpent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
