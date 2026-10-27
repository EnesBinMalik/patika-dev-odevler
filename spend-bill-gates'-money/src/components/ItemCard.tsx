import React from 'react';
import { Item, Language } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface ItemCardProps {
  item: Item;
  quantity: number;
  balance: number;
  language: Language;
  onBuy: (item: Item, amount?: number) => void;
  onSell: (item: Item, amount?: number) => void;
  onQuantityChange: (item: Item, newQuantity: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  quantity,
  balance,
  language,
  onBuy,
  onSell,
  onQuantityChange,
}) => {
  const isTr = language === 'tr';
  const canSell = quantity > 0;
  const canBuy = balance >= item.price;
  const maxAffordable = Math.floor(balance / item.price);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onQuantityChange(item, 0);
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 0) {
      onQuantityChange(item, 0);
      return;
    }

    const diff = parsed - quantity;
    if (diff > 0) {
      // Trying to buy more
      const additionalCost = diff * item.price;
      if (additionalCost > balance) {
        // Clamp to max affordable
        const allowedTotal = quantity + maxAffordable;
        onQuantityChange(item, allowedTotal);
      } else {
        onQuantityChange(item, parsed);
      }
    } else {
      // Selling
      onQuantityChange(item, parsed);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between p-5 text-center ${
        quantity > 0
          ? 'border-emerald-500/50 shadow-md ring-2 ring-emerald-500/10'
          : 'border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Visual & Category */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-5xl sm:text-6xl mb-3 select-none hover:scale-105 transition-transform duration-200">
          {item.emoji}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-snug min-h-[3rem] flex items-center justify-center">
          {isTr ? item.nameTr : item.name}
        </h3>

        {/* Price */}
        <p className="text-xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1 mb-2">
          {formatCurrency(item.price)}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 h-8">
          {isTr ? item.descriptionTr : item.descriptionEn}
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Sell Button - disabled when quantity === 0 */}
          <button
            onClick={() => onSell(item, 1)}
            disabled={!canSell}
            className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-150 select-none cursor-pointer ${
              canSell
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/60'
            }`}
          >
            {isTr ? 'Sat' : 'Sell'}
          </button>

          {/* Direct Quantity Input */}
          <div className="relative">
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={handleInputChange}
              aria-label={`${item.name} quantity`}
              className="w-full text-center py-2 px-1 text-sm sm:text-base font-bold font-mono text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Buy Button - disabled when price > balance */}
          <button
            onClick={() => onBuy(item, 1)}
            disabled={!canBuy}
            className={`py-2 px-3 rounded-lg font-bold text-sm transition-all duration-150 select-none cursor-pointer ${
              canBuy
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/60'
            }`}
          >
            {isTr ? 'Satın Al' : 'Buy'}
          </button>
        </div>

        {/* Quick Multiplier / Helper row */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          {quantity > 0 ? (
            <button
              onClick={() => onSell(item, quantity)}
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
            >
              {isTr ? 'Tümünü Sat' : 'Sell All'}
            </button>
          ) : (
            <span className="text-slate-400">
              {isTr ? 'Henüz alınmadı' : 'None owned'}
            </span>
          )}

          {canBuy && maxAffordable > 1 && (
            <button
              onClick={() => onBuy(item, Math.min(10, maxAffordable))}
              className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer ml-auto"
            >
              +{Math.min(10, maxAffordable)} {isTr ? 'Al' : 'Buy'}
            </button>
          )}

          {canBuy && maxAffordable > 10 && (
            <button
              onClick={() => onBuy(item, maxAffordable)}
              className="text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer ml-2"
            >
              {isTr ? 'Maks' : 'Max'} ({formatNumber(maxAffordable)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
