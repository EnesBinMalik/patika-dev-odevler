/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricsBarProps {
  parasCount: number;
  wordCount: number;
  charCount: number;
  readingTime: number;
  source: 'api' | 'local';
  format: 'text' | 'html';
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  parasCount,
  wordCount,
  charCount,
  readingTime,
  source,
  format,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white border border-slate-200 rounded-lg p-3.5">
        <div className="text-xs text-slate-500 font-medium">Toplam Paragraf</div>
        <div className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">
          {parasCount}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {format === 'html' ? '<p> etiketli' : 'Düz metin'}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3.5">
        <div className="text-xs text-slate-500 font-medium">Kelime Sayısı</div>
        <div className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">
          {wordCount.toLocaleString('tr-TR')}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          ~{Math.round(wordCount / Math.max(1, parasCount))} kelime / paragraf
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3.5">
        <div className="text-xs text-slate-500 font-medium">Karakter Sayısı</div>
        <div className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">
          {charCount.toLocaleString('tr-TR')}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Boşluklar dahil
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3.5">
        <div className="text-xs text-slate-500 font-medium">Okuma Süresi</div>
        <div className="mt-1 text-xl font-bold text-slate-900 font-mono tabular-nums">
          {readingTime} <span className="text-sm font-normal text-slate-600">dk</span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Kaynak: {source === 'api' ? 'Bacon API' : 'Yerel Motor'}
        </div>
      </div>
    </div>
  );
};
