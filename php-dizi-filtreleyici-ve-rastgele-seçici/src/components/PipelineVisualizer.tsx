import React from 'react';
import { Filter, Shuffle, Map, CheckCircle2, XCircle } from 'lucide-react';
import { SimulationResult } from '../types';

interface PipelineVisualizerProps {
  simulation: SimulationResult;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ simulation }) => {
  const { originalArray, filteredArray, selectedKeys, finalResult, countRequested } = simulation;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <span>Adım Adım Fonksiyon Çalışma Mimarisi</span>
          <span className="text-xs text-slate-400 font-normal">
            · 3 Temel PHP Fonksiyonunun Entegrasyonu
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Verilen dizinin her aşamada nasıl işlendiğini ve PHP'nin bellek içi veri akışını inceleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: array_filter() */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span>1. Adım: array_filter()</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Dizideki boş string <code className="text-rose-300 font-mono">""</code> ve{' '}
              <code className="text-amber-300 font-mono">NULL</code> değerleri temizlenir. PHP anahtarları (key) korur.
            </p>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {originalArray.map((item, idx) => {
                const isDiscarded = item === null || item === '';
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-2.5 py-1 rounded text-xs border ${
                      isDiscarded
                        ? 'bg-rose-950/20 border-rose-900/30 text-rose-300/60 line-through'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-slate-500">[{idx}]</span>
                    <span className="font-medium">
                      {item === '' ? '"" (Boş Dize)' : item === null ? 'NULL' : item}
                    </span>
                    {isDiscarded ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Filtrelenen Temiz Eleman:</span>
            <span className="font-mono text-emerald-400 font-semibold">{filteredArray.length} adet</span>
          </div>
        </div>

        {/* Step 2: array_rand() */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              <Shuffle className="w-4 h-4 text-indigo-400" />
              <span>2. Adım: array_rand()</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Filtrelenmiş diziden istenen adet kadar (<span className="text-indigo-400 font-mono font-bold">{countRequested}</span>) rastgele anahtar (key) seçilir.
            </p>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-md mb-3">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                Seçilen Rastgele Anahtarlar ($keys):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedKeys.map((keyVal, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-xs font-bold"
                  >
                    Key [{keyVal}]
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {filteredArray.map(item => {
                const isSelected = selectedKeys.includes(item.key);
                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between px-2.5 py-1 rounded border transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                        : 'bg-slate-900/40 border-slate-800/40 text-slate-400'
                    }`}
                  >
                    <span className="font-mono text-[11px]">Anahtar [{item.key}]</span>
                    <span>{item.value}</span>
                    <span className="text-[10px] font-mono">
                      {isSelected ? '✓ SEÇİLDİ' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Rastgele Seçilen:</span>
            <span className="font-mono text-indigo-400 font-semibold">{selectedKeys.length} anahtar</span>
          </div>
        </div>

        {/* Step 3: array_map() */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              <Map className="w-4 h-4 text-indigo-400" />
              <span>3. Adım: array_map()</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Seçilen anahtarlar <code className="text-indigo-300 font-mono">array_map</code> ile filtrelenmiş dizideki değerlere dönüştürülür ve 0'dan başlayan temiz indeksler oluşur.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {finalResult.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-emerald-950/20 border border-emerald-800/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">[{idx}]</span>
                    <span className="text-slate-400 font-mono text-[11px]">=&gt;</span>
                    <span className="font-semibold text-emerald-200">{val}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Key [{selectedKeys[idx]}] eşlendi
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Nihai Dizi:</span>
            <span className="font-mono text-emerald-400 font-semibold">{finalResult.length} eleman</span>
          </div>
        </div>
      </div>
    </div>
  );
};
