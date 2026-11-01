/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Layers, ArrowRight, Sparkles, Hash, CornerDownRight } from 'lucide-react';
import { StepAction } from '../models/MyListEngine.ts';

interface VisualMemoryArrayProps {
  data: (any | null)[];
  size: number;
  capacity: number;
  lastAction?: StepAction;
}

export const VisualMemoryArray: React.FC<VisualMemoryArrayProps> = ({
  data,
  size,
  capacity,
  lastAction,
}) => {
  const occupancyPercentage = Math.round((size / (capacity || 1)) * 100);

  const isAffected = (idx: number) => {
    if (!lastAction) return false;
    if (typeof lastAction.affectedIndex === 'number') {
      return lastAction.affectedIndex === idx;
    }
    if (Array.isArray(lastAction.affectedIndex)) {
      return lastAction.affectedIndex.includes(idx);
    }
    return false;
  };

  const isScanned = (idx: number) => {
    if (!lastAction || !lastAction.scannedIndices) return false;
    return lastAction.scannedIndices.includes(idx);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Fiziksel Dizi Bellek Mimarisi (RAM Slotları)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            İçeride tutulan <code className="text-amber-300 font-mono">Object[] data</code> dizisinin anlık bellek durumu
          </p>
        </div>

        {/* Live Metrics Chips */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400">size():</span>
            <span className="text-amber-400 font-bold text-sm">{size}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400">getCapacity():</span>
            <span className="text-emerald-400 font-bold text-sm">{capacity}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400">Doluluk:</span>
            <span className={`font-bold ${occupancyPercentage >= 90 ? 'text-rose-400' : occupancyPercentage >= 60 ? 'text-amber-400' : 'text-cyan-400'}`}>
              %{occupancyPercentage}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar for Capacity Usage */}
      <div className="mb-5 relative z-10">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Kapasite Kullanımı ({size} / {capacity} slot dolu)
          </span>
          <span>{capacity - size} boş slot kaldı</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              occupancyPercentage >= 100
                ? 'bg-rose-500 shadow-rose-500/50 shadow-md'
                : occupancyPercentage >= 80
                ? 'bg-amber-500 shadow-amber-500/50 shadow-md'
                : 'bg-emerald-500 shadow-emerald-500/50 shadow-md'
            }`}
            style={{ width: `${Math.min(100, occupancyPercentage)}%` }}
          />
        </div>
      </div>

      {/* Capacity Doubled Notice */}
      <AnimatePresence>
        {lastAction?.type === 'RESIZE' && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-semibold">
                Dinamik Büyüme Tetiklendi:
              </span>
              <span>
                Dizi kapasitesi 2 katına çıkarıldı ({lastAction.oldCapacity} ➔ {lastAction.newCapacity})
              </span>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              2x Kapasite Algoritması
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Slot Grid */}
      <div className="relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
          {data.map((item, index) => {
            const isFilled = index < size;
            const affected = isAffected(index);
            const scanned = isScanned(index);

            return (
              <motion.div
                key={`${index}-${capacity}-${item}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-xl p-2.5 flex flex-col justify-between transition-all duration-300 min-h-[92px] ${
                  affected
                    ? 'ring-2 ring-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20 border-amber-500/50'
                    : scanned
                    ? 'ring-1 ring-cyan-400 bg-cyan-950/30 border-cyan-500/40'
                    : isFilled
                    ? 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600'
                    : 'bg-slate-950/30 border-dashed border-slate-800 text-slate-600 opacity-60'
                } border`}
              >
                {/* Index badge at top */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    affected
                      ? 'bg-amber-500 text-slate-950'
                      : isFilled
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-900 text-slate-600'
                  }`}>
                    [{index}]
                  </span>
                  <span className="text-[9px] text-slate-600">
                    @0x{((index + 1) * 4).toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                </div>

                {/* Slot Value */}
                <div className="my-1 text-center font-mono">
                  {isFilled ? (
                    <motion.div
                      key={String(item)}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-base font-bold text-white tracking-wider flex items-center justify-center gap-1"
                    >
                      <span className={affected ? 'text-amber-300' : 'text-slate-100'}>
                        {item !== null && item !== undefined ? String(item) : 'null'}
                      </span>
                    </motion.div>
                  ) : (
                    <span className="text-xs font-mono text-slate-700 italic select-none">
                      (boş)
                    </span>
                  )}
                </div>

                {/* Slot State Tag */}
                <div className="text-[9px] font-mono text-center truncate">
                  {affected ? (
                    <span className="text-amber-400 font-bold uppercase tracking-wider">
                      ★ Aktif İşlem
                    </span>
                  ) : scanned ? (
                    <span className="text-cyan-400 font-semibold">
                      Taranıyor
                    </span>
                  ) : isFilled ? (
                    <span className="text-slate-400 text-[10px]">
                      Dolu (T)
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[10px]">
                      Ayrılmış Slot
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend & Guide */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 relative z-10">
        <div className="flex items-center flex-wrap gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block"></span>
            <span>Dolu Elemanlar (0 .. size-1)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-950 border border-dashed border-slate-800 inline-block"></span>
            <span>Rezerv Kapasite Alanı (size .. capacity-1)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
            <span>Son İşlem Gören İndis</span>
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Collection Sınıfı Yok • Saf Dizi Mimarisi
        </div>
      </div>
    </div>
  );
};
