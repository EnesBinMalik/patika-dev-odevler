/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, HelpCircle, ArrowRight, Compass, Layers } from 'lucide-react';
import { DivisibilityResult } from '../utils/divisibility';

interface EducationalBreakdownProps {
  result: DivisibilityResult;
}

export const EducationalBreakdown: React.FC<EducationalBreakdownProps> = ({ result }) => {
  // Generate points for the number line visualization around the entered number
  const center = result.girilenSayi;
  // Span range: showing numbers from center - 3 to center + 4
  const points = [];
  for (let offset = -3; offset <= 4; offset++) {
    const val = center + offset;
    const isMultipleOf3 = val % 3 === 0;
    const isTarget = val === center;
    const isNextDivisible = !result.bolunebilirMi && val === result.ilkBolunebilenSayi;
    points.push({ val, isMultipleOf3, isTarget, isNextDivisible });
  }

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Matematiksel Açıklama
            </span>
            <h3 className="text-lg font-bold text-white">
              3 ile Bölünebilme Kuralı Nasıl Çalışır?
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rakamlar Toplamı Kuralı Kartı */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <h4>1. Rakamları Toplamı Kuralı</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bir tam sayının 3&apos;e tam bölünebilmesi için, sayıyı oluşturan rakamların sayı değerleri toplamının 3 veya 3&apos;ün katı olması gerekir.
          </p>

          <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/60 text-xs font-mono-code space-y-1.5">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Basamak Analizi:</span>
              <span className="text-white font-bold">
                {result.rakamlarDizisi.join(' + ')} = {result.rakamlarToplami}
              </span>
            </div>
            <div className="text-slate-400 flex items-center justify-between">
              <span>Toplamın 3&apos;e Durumu:</span>
              <span
                className={
                  result.rakamlarToplami % 3 === 0
                    ? 'text-emerald-400 font-bold'
                    : 'text-amber-400 font-bold'
                }
              >
                {result.rakamlarToplami % 3 === 0
                  ? '3\'ün tam katı ✓'
                  : `3\'e bölünmez (Kalan: ${result.rakamlarToplami % 3})`}
              </span>
            </div>
          </div>
        </div>

        {/* Bölme Eşitliği Kartı */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Compass className="w-4 h-4" />
            <h4>2. Bölme Bağıntısı Formülü</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bölme algoritmasına göre: <em>Bölünen = (Bölen × Bölüm) + Kalan</em> eşitliği sağlanır. (0 ≤ Kalan &lt; 3)
          </p>

          <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/60 text-xs font-mono-code space-y-1.5">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Bölme Özeti:</span>
              <span className="text-white font-bold">
                {result.girilenSayi} = (3 × {result.bolum}) + {result.kalan}
              </span>
            </div>
            <div className="text-slate-400 flex items-center justify-between">
              <span>Kalan Değeri:</span>
              <span className={result.kalan === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                kalan = {result.kalan} {result.kalan === 0 ? '(Kalan 0 olduğu için bölünür)' : '(Kalan 0 değil)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Görsel Sayı Doğrusu (Number Line) */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Sayı Doğrusu Üzerinde Görünüm</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
              3&apos;ün Katı
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              Girilen Sayı
            </span>
          </div>
        </div>

        {/* The interactive/visual strip */}
        <div className="relative py-4 px-2 overflow-x-auto">
          {/* Base Axis Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-700 -translate-y-1/2" />

          <div className="flex items-center justify-between relative z-10 gap-2 min-w-[500px]">
            {points.map((pt) => {
              return (
                <div key={pt.val} className="flex flex-col items-center flex-1">
                  {/* Top indicator tag */}
                  <div className="h-6 flex items-center justify-center">
                    {pt.isTarget && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        Girilen ({pt.val})
                      </span>
                    )}
                    {pt.isNextDivisible && !pt.isTarget && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap animate-pulse">
                        İlk Kat ({pt.val})
                      </span>
                    )}
                  </div>

                  {/* Marker Node */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center my-1.5 border-2 transition-all ${
                      pt.isTarget
                        ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-300 scale-110 shadow-lg shadow-amber-500/30'
                        : pt.isNextDivisible
                        ? 'bg-indigo-600 text-white font-bold border-indigo-400 scale-110 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/30'
                        : pt.isMultipleOf3
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-mono-code">{pt.val}</span>
                  </div>

                  {/* Sub-label */}
                  <div className="h-5 flex items-center justify-center">
                    <span className="text-[10px] text-slate-500 font-mono-code">
                      {pt.isMultipleOf3 ? '3k' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!result.bolunebilirMi && (
          <p className="text-xs text-slate-400 text-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            {result.girilenSayi} sayısından sonra gelen ve 3&apos;e tam bölünebilen en küçük sayı{' '}
            <strong className="text-indigo-300 font-bold">{result.ilkBolunebilenSayi}</strong>
            &apos;dir (+{result.eklenecekMiktar} adım).
          </p>
        )}
      </div>
    </div>
  );
};
