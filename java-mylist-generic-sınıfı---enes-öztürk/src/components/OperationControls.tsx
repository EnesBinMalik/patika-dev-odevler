/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Edit3, 
  RotateCcw, 
  Play, 
  Sparkles, 
  Scissors, 
  Check, 
  CornerDownRight, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { MyListSim } from '../models/MyListEngine.ts';

interface OperationControlsProps {
  sim: MyListSim<any>;
  onStateChange: () => void;
  onRunScenario: (scenarioNum: 1 | 2 | 3) => void;
}

export const OperationControls: React.FC<OperationControlsProps> = ({
  sim,
  onStateChange,
  onRunScenario,
}) => {
  // Inputs
  const [addVal, setAddVal] = useState<string>('25');
  const [getIdx, setGetIdx] = useState<string>('0');
  const [removeIdx, setRemoveIdx] = useState<string>('0');
  const [setIdx, setSetIdx] = useState<string>('0');
  const [setVal, setSetVal] = useState<string>('99');
  const [searchVal, setSearchVal] = useState<string>('20');
  const [subStart, setSubStart] = useState<string>('0');
  const [subFinish, setSubFinish] = useState<string>('3');

  // Operation Execution Handlers
  const handleAdd = (val?: any) => {
    const valueToAdd = val !== undefined ? val : (isNaN(Number(addVal)) ? addVal : Number(addVal));
    sim.add(valueToAdd);
    onStateChange();
  };

  const handleGet = () => {
    const idx = parseInt(getIdx, 10);
    if (!isNaN(idx)) {
      sim.get(idx);
      onStateChange();
    }
  };

  const handleRemove = () => {
    const idx = parseInt(removeIdx, 10);
    if (!isNaN(idx)) {
      sim.remove(idx);
      onStateChange();
    }
  };

  const handleSet = () => {
    const idx = parseInt(setIdx, 10);
    const value = isNaN(Number(setVal)) ? setVal : Number(setVal);
    if (!isNaN(idx)) {
      sim.set(idx, value);
      onStateChange();
    }
  };

  const handleIndexOf = () => {
    const val = isNaN(Number(searchVal)) ? searchVal : Number(searchVal);
    sim.indexOf(val);
    onStateChange();
  };

  const handleLastIndexOf = () => {
    const val = isNaN(Number(searchVal)) ? searchVal : Number(searchVal);
    sim.lastIndexOf(val);
    onStateChange();
  };

  const handleContains = () => {
    const val = isNaN(Number(searchVal)) ? searchVal : Number(searchVal);
    sim.contains(val);
    onStateChange();
  };

  const handleSubList = () => {
    const s = parseInt(subStart, 10);
    const f = parseInt(subFinish, 10);
    if (!isNaN(s) && !isNaN(f)) {
      sim.subList(s, f);
      onStateChange();
    }
  };

  const handleClear = () => {
    sim.clear();
    onStateChange();
  };

  return (
    <div className="space-y-4">
      {/* Quick Scenario Runner Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Soruda İstenen Örnek Test Senaryoları (Ata.java)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            1-Tıkla Çalıştır & İncele
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Scenario 1 */}
          <button
            onClick={() => onRunScenario(1)}
            className="group p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-400 font-mono">SENARYO 1</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                11 Eleman & 2x
              </span>
            </div>
            <div className="text-xs text-slate-200 font-semibold mb-1">
              Dinamik Kapasite Artışı
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Kapasite 10 iken 11 eleman eklenir, dizi 20&apos;ye katlanır. size() ve getCapacity() yazdırılır.
            </p>
            <div className="mt-2 text-[10px] text-amber-400/80 group-hover:text-amber-300 font-mono flex items-center gap-1">
              <span>Çalıştır</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Scenario 2 */}
          <button
            onClick={() => onRunScenario(2)}
            className="group p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-400 font-mono">SENARYO 2</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Sola Kaydırma
              </span>
            </div>
            <div className="text-xs text-slate-200 font-semibold mb-1">
              get, remove, set & toString
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Elemanlar eklenir, get(2) çağrılır, remove(2) ile silinip kaydırılır, set(0, 100) yapılır.
            </p>
            <div className="mt-2 text-[10px] text-cyan-400/80 group-hover:text-cyan-300 font-mono flex items-center gap-1">
              <span>Çalıştır</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Scenario 3 */}
          <button
            onClick={() => onRunScenario(3)}
            className="group p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400 font-mono">SENARYO 3</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Arama & Alt Liste
              </span>
            </div>
            <div className="text-xs text-slate-200 font-semibold mb-1">
              indexOf, subList & contains
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              indexOf(20), lastIndexOf(20), toArray(), subList(0,3), contains(20), clear() test edilir.
            </p>
            <div className="mt-2 text-[10px] text-emerald-400/80 group-hover:text-emerald-300 font-mono flex items-center gap-1">
              <span>Çalıştır</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Metot Konsolu */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              İnteraktif Metot Çağırma Paneli
            </h3>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>clear() (Sıfırla)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* add(T data) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-amber-400 font-bold">add(T data)</span>
                <span className="text-[10px] text-slate-500">Eleman Ekle</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <input
                  type="text"
                  value={addVal}
                  onChange={(e) => setAddVal(e.target.value)}
                  placeholder="Veri"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleAdd()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ekle
                </button>
              </div>
            </div>
            {/* Quick Chips */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <span className="text-slate-500">Hızlı:</span>
              {[10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAdd(num)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* get(int index) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-400 font-bold">get(int index)</span>
                <span className="text-[10px] text-slate-500">İndisteki Değeri Oku</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={getIdx}
                  onChange={(e) => setGetIdx(e.target.value)}
                  placeholder="İndis"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleGet}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1 transition"
                >
                  <Search className="w-3.5 h-3.5" />
                  Getir
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-2">
              Geçersiz indiste <span className="text-amber-400">null</span> döner
            </div>
          </div>

          {/* remove(int index) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-rose-400 font-bold">remove(int index)</span>
                <span className="text-[10px] text-slate-500">Sil & Sola Kaydır</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={removeIdx}
                  onChange={(e) => setRemoveIdx(e.target.value)}
                  placeholder="Silinecek indis"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={handleRemove}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Sil
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-2">
              Elemanlar sola kaydırılır (Left-shift)
            </div>
          </div>

          {/* set(int index, T data) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-violet-400 font-bold">set(int index, T data)</span>
                <span className="text-[10px] text-slate-500">Değeri Güncelle</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                <input
                  type="number"
                  min="0"
                  value={setIdx}
                  onChange={(e) => setSetIdx(e.target.value)}
                  placeholder="İndis"
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                />
                <input
                  type="text"
                  value={setVal}
                  onChange={(e) => setSetVal(e.target.value)}
                  placeholder="Yeni değer"
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
              <button
                onClick={handleSet}
                className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs flex items-center justify-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Değeri Değiştir
              </button>
            </div>
          </div>

          {/* indexOf, lastIndexOf, contains */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-emerald-400 font-bold">Arama İşlemleri</span>
                <span className="text-[10px] text-slate-500">İndis & Varlık</span>
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Aranacak değer (örn: 20)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white mb-2"
              />
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={handleIndexOf}
                  className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition"
                  title="İlk bulunan indis"
                >
                  indexOf()
                </button>
                <button
                  onClick={handleLastIndexOf}
                  className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition"
                  title="Son bulunan indis"
                >
                  lastIndexOf()
                </button>
                <button
                  onClick={handleContains}
                  className="px-1.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono transition"
                  title="Listede var mı?"
                >
                  contains()
                </button>
              </div>
            </div>
          </div>

          {/* subList(start, finish) */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-blue-400 font-bold">subList(start, finish)</span>
                <span className="text-[10px] text-slate-500">Alt Liste Kes</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                <div>
                  <label className="text-[10px] text-slate-500">Başlangıç:</label>
                  <input
                    type="number"
                    min="0"
                    value={subStart}
                    onChange={(e) => setSubStart(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Bitiş (dahil):</label>
                  <input
                    type="number"
                    min="0"
                    value={subFinish}
                    onChange={(e) => setSubFinish(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>
              </div>
              <button
                onClick={handleSubList}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1 transition"
              >
                <Scissors className="w-3.5 h-3.5" />
                Alt Liste Oluştur
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
