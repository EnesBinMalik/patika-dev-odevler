import React, { useState } from 'react';
import { Play, RotateCw, Copy, Check, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ArrayElement, Preset, SimulationResult } from '../types';
import { PRESETS } from '../utils/phpSimulator';

interface PlaygroundProps {
  currentItems: ArrayElement[];
  count: number;
  simulation: SimulationResult;
  onItemsChange: (items: ArrayElement[]) => void;
  onCountChange: (count: number) => void;
  onRunSimulation: () => void;
  selectedPresetId: string;
  onSelectPreset: (preset: Preset) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  currentItems,
  count,
  simulation,
  onItemsChange,
  onCountChange,
  onRunSimulation,
  selectedPresetId,
  onSelectPreset,
}) => {
  const [copied, setCopied] = useState(false);
  const [newItemValue, setNewItemValue] = useState('');

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText(simulation.phpPrintROutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddItem = (type: 'text' | 'empty' | 'null') => {
    if (type === 'text') {
      if (!newItemValue.trim()) return;
      onItemsChange([...currentItems, newItemValue.trim()]);
      setNewItemValue('');
    } else if (type === 'empty') {
      onItemsChange([...currentItems, '']);
    } else if (type === 'null') {
      onItemsChange([...currentItems, null]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index);
    onItemsChange(updated);
  };

  const cleanCount = currentItems.filter(item => item !== null && item !== '').length;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <span>İnteraktif PHP Simülatörü</span>
            <span className="text-xs text-slate-400 font-normal">
              · array_filter + array_rand + array_map
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Girdi dizisini ve seçilecek adet sayısını değiştirip anlık PHP çıktısını gözlemleyin.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedPresetId === preset.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Controls and Array Elements (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-6">
          {/* Array items chips view */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-medium text-slate-300">
                Girdi Dizisi ($array): <span className="text-indigo-400 font-mono">{currentItems.length} Eleman</span>
              </span>
              <span className="text-slate-500 font-mono">
                {cleanCount} Dolu · {currentItems.length - cleanCount} Boş/Null
              </span>
            </div>

            <div className="flex flex-wrap gap-2 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg min-h-[92px]">
              {currentItems.map((item, idx) => {
                const isEmpty = item === '';
                const isNull = item === null;
                const isFilteredOut = isEmpty || isNull;

                return (
                  <div
                    key={idx}
                    className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-all ${
                      isFilteredOut
                        ? 'bg-rose-950/30 border-rose-900/40 text-rose-300/80'
                        : 'bg-slate-800/80 border-slate-700/70 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
                    {isEmpty && <span className="italic text-rose-300 font-mono font-medium">"" (Boş)</span>}
                    {isNull && <span className="text-amber-400 font-mono font-bold">NULL</span>}
                    {!isEmpty && !isNull && <span className="font-medium">{item}</span>}

                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity ml-0.5 p-0.5"
                      title="Elemanı kaldır"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick add elements controls */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newItemValue}
                onChange={e => setNewItemValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddItem('text')}
                placeholder="Yeni eleman ekle..."
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 flex-1 min-w-[140px]"
              />
              <button
                onClick={() => handleAddItem('text')}
                disabled={!newItemValue.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3 h-3" /> Ekle
              </button>
              <button
                onClick={() => handleAddItem('empty')}
                className="px-2.5 py-1.5 text-xs font-mono bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/50 text-rose-300 rounded-md transition-colors shrink-0"
                title="Boş dize ('') ekle"
              >
                + "" (Boş)
              </button>
              <button
                onClick={() => handleAddItem('null')}
                className="px-2.5 py-1.5 text-xs font-mono bg-amber-950/40 border border-amber-900/50 hover:bg-amber-900/50 text-amber-300 rounded-md transition-colors shrink-0"
                title="NULL değeri ekle"
              >
                + NULL
              </button>
            </div>
          </div>

          {/* Count control */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="count-slider" className="font-medium text-slate-300">
                Seçilecek Rastgele Eleman Adedi ($count):{' '}
                <span className="text-indigo-400 font-mono text-sm font-bold ml-1">{count}</span>
              </label>
              <span className="text-slate-500">
                Maksimum seçilebilir: {cleanCount}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                id="count-slider"
                type="range"
                min={1}
                max={Math.max(1, cleanCount)}
                value={Math.min(count, Math.max(1, cleanCount))}
                onChange={e => onCountChange(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    disabled={n > cleanCount}
                    onClick={() => onCountChange(n)}
                    className={`w-7 h-7 text-xs font-mono rounded transition-colors ${
                      count === n
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run Action Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onRunSimulation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-indigo-950 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <RotateCw className="w-4 h-4" />
              <span>Yeniden Rastgele Seç (Çalıştır)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Terminal & PHP Output (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-slate-950/40 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                PHP Terminali (print_r Çıktısı)
              </span>
              <button
                onClick={handleCopyTerminal}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                title="Çıktıyı panoya kopyala"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* PHP Execution Command */}
            <div className="mb-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-400">
              <span className="text-indigo-400">$</span> php -r 'print_r(rastgeleSecici($array, {count}));'
            </div>

            {/* Terminal Body */}
            <div className="relative bg-slate-950 border border-slate-800/90 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[160px] shadow-inner">
              <pre className="leading-relaxed whitespace-pre font-mono">
                {simulation.phpPrintROutput}
              </pre>
            </div>
          </div>

          {/* Quick Result Summary */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
            <div className="text-[11px] font-medium text-slate-400 mb-1.5">
              Dönen Dizi Elemanları ({simulation.finalResult.length} adet):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {simulation.finalResult.length > 0 ? (
                simulation.finalResult.map((val, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-mono font-medium"
                  >
                    <span className="text-slate-500 font-normal">[{idx}]</span> {val}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Boş dizi döndü.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
