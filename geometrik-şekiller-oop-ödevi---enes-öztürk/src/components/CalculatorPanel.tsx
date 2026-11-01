import React from 'react';
import { Square, RectangleHorizontal, Triangle, Calculator, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Dikdortgen, Kare, Ucgen } from '../models/Sekil';

interface CalculatorPanelProps {
  shapeType: 'dikdortgen' | 'kare' | 'ucgen';
  setShapeType: (type: 'dikdortgen' | 'kare' | 'ucgen') => void;
  rectWidth: number;
  setRectWidth: (val: number) => void;
  rectHeight: number;
  setRectHeight: (val: number) => void;
  squareSide: number;
  setSquareSide: (val: number) => void;
  triA: number;
  setTriA: (val: number) => void;
  triB: number;
  setTriB: (val: number) => void;
  triC: number;
  setTriC: (val: number) => void;
  dikdortgen: Dikdortgen;
  kare: Kare;
  ucgen: Ucgen;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  shapeType,
  setShapeType,
  rectWidth,
  setRectWidth,
  rectHeight,
  setRectHeight,
  squareSide,
  setSquareSide,
  triA,
  setTriA,
  triB,
  setTriB,
  triC,
  setTriC,
  dikdortgen,
  kare,
  ucgen
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Shape Type Selector */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Şekil Seçimi</span>
          </label>
          <span className="text-xs font-mono text-indigo-400">OOP Sınıfı</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <button
            onClick={() => setShapeType('dikdortgen')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
              shapeType === 'dikdortgen'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <RectangleHorizontal className="w-5 h-5 mb-1 text-indigo-400" />
            <span className="text-xs font-bold">Dikdörtgen</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">Dikdortgen</span>
          </button>

          <button
            onClick={() => setShapeType('kare')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer relative overflow-hidden ${
              shapeType === 'kare'
                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <span className="absolute top-1 right-1 px-1 py-0.2 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
              DRY
            </span>
            <Square className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="text-xs font-bold">Kare</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">Kare (Miras)</span>
          </button>

          <button
            onClick={() => setShapeType('ucgen')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
              shapeType === 'ucgen'
                ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <Triangle className="w-5 h-5 mb-1 text-amber-400" />
            <span className="text-xs font-bold">Üçgen</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">Ucgen (Heron)</span>
          </button>
        </div>

        {/* Input Controls */}
        {shapeType === 'dikdortgen' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Genişlik (a kenarı)</span>
                <span className="font-mono text-indigo-400 font-bold">{rectWidth} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={rectWidth}
                onChange={(e) => setRectWidth(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Yükseklik (b kenarı)</span>
                <span className="font-mono text-indigo-400 font-bold">{rectHeight} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={rectHeight}
                onChange={(e) => setRectHeight(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Hazır Değerler:</span>
              <button
                onClick={() => { setRectWidth(5); setRectHeight(10); }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                5 × 10
              </button>
              <button
                onClick={() => { setRectWidth(8); setRectHeight(12); }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                8 × 12
              </button>
              <button
                onClick={() => { setRectWidth(16); setRectHeight(9); }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                16 × 9
              </button>
            </div>
          </div>
        )}

        {shapeType === 'kare' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Kenar Uzunluğu</span>
                <span className="font-mono text-emerald-400 font-bold">{squareSide} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={squareSide}
                onChange={(e) => setSquareSide(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>OOP Mimari Özelliği</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Kare kurucusunda <code className="text-emerald-300 font-mono">super(kenar, kenar)</code> çağrılır.
                Genişlik ve yükseklik eşitlenir; alan ve çevre metotları sıfır kod tekrarı ile miras alınır.
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Hazır Değerler:</span>
              {[4, 6, 9, 12].map((s) => (
                <button
                  key={s}
                  onClick={() => setSquareSide(s)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
                >
                  {s} × {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {shapeType === 'ucgen' && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">a Kenarı</span>
                <span className="font-mono text-amber-400 font-bold">{triA} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={triA}
                onChange={(e) => setTriA(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">b Kenarı</span>
                <span className="font-mono text-amber-400 font-bold">{triB} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={triB}
                onChange={(e) => setTriB(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-300">c Kenarı (Taban)</span>
                <span className="font-mono text-amber-400 font-bold">{triC} br</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={triC}
                onChange={(e) => setTriC(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Örnekler:</span>
              <button
                onClick={() => { setTriA(3); setTriB(4); setTriC(5); }}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                3-4-5 (Dik)
              </button>
              <button
                onClick={() => { setTriA(6); setTriB(6); setTriC(6); }}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                6-6-6 (Eşkenar)
              </button>
              <button
                onClick={() => { setTriA(5); setTriB(12); setTriC(13); }}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
              >
                5-12-13 (Özel)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Alan Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Hesaplanan Alan</span>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {shapeType === 'dikdortgen' && dikdortgen.alanHesapla().toFixed(2)}
              {shapeType === 'kare' && kare.alanHesapla().toFixed(2)}
              {shapeType === 'ucgen' && ucgen.alanHesapla().toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">br²</span>
            </div>
            <div className="text-[11px] text-indigo-400 font-mono mt-1">
              {shapeType === 'dikdortgen' && `a × b = ${rectWidth} × ${rectHeight}`}
              {shapeType === 'kare' && `kenar² = ${squareSide} × ${squareSide}`}
              {shapeType === 'ucgen' && (ucgen.gecerliMi() ? `Heron: √[u(u-a)(u-b)(u-c)]` : 'Geçersiz')}
            </div>
          </div>

          {/* Çevre Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Hesaplanan Çevre</span>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {shapeType === 'dikdortgen' && dikdortgen.cevreHesapla().toFixed(2)}
              {shapeType === 'kare' && kare.cevreHesapla().toFixed(2)}
              {shapeType === 'ucgen' && ucgen.cevreHesapla().toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">br</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1">
              {shapeType === 'dikdortgen' && `2 × (${rectWidth} + ${rectHeight})`}
              {shapeType === 'kare' && `4 × ${squareSide} (Dikdortgen'den)`}
              {shapeType === 'ucgen' && `${triA} + ${triB} + ${triC}`}
            </div>
          </div>
        </div>

        {/* OOP Execution Signature */}
        <div className="px-3 py-2 bg-indigo-950/20 border border-indigo-500/20 rounded-lg flex items-center justify-between text-xs text-slate-300">
          <span className="font-mono text-indigo-300">
            {shapeType === 'dikdortgen' && 'const d = new Dikdortgen(a, b);'}
            {shapeType === 'kare' && 'const k = new Kare(kenar); // Dikdortgen türevi'}
            {shapeType === 'ucgen' && 'const u = new Ucgen(a, b, c);'}
          </span>
          <span className="text-[11px] text-amber-300 font-semibold font-signature text-base">
            Enes Öztürk
          </span>
        </div>
      </div>
    </div>
  );
};
