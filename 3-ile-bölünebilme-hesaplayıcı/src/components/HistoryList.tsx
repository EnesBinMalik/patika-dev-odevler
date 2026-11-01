/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { DivisibilityResult } from '../utils/divisibility';

interface HistoryListProps {
  history: DivisibilityResult[];
  onSelect: (result: DivisibilityResult) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Son Kontrol Edilen Sayılar ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Geçmişi Temizle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {history.map((item, index) => (
          <button
            key={`${item.girilenSayi}-${index}`}
            type="button"
            onClick={() => onSelect(item)}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              {item.bolunebilirMi ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="font-mono-code font-bold text-white text-sm">
                  {item.girilenSayi}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {item.bolunebilirMi ? '3\'e tam bölünür' : `İlk kat: ${item.ilkBolunebilenSayi}`}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-indigo-400 group-hover:translate-x-0.5 transition-transform font-medium">
              İncele →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
