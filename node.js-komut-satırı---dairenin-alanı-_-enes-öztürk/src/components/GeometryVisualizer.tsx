import React, { useState } from 'react';
import { Shapes, Sliders, Calculator, Eye, HelpCircle, Check, Copy } from 'lucide-react';

export const GeometryVisualizer: React.FC = () => {
  const [radius, setRadius] = useState<number>(5);
  const [showSquare, setShowSquare] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [copiedFormat, setCopiedFormat] = useState<boolean>(false);

  // Calculations
  const r = Math.max(0, radius);
  const rSquared = r * r;
  const area = Math.PI * rSquared;
  const perimeter = 2 * Math.PI * r;
  const diameter = 2 * r;
  const squareArea = 4 * rSquared;
  const ratio = (area / squareArea) * 100;

  // SVG parameters
  const svgSize = 340;
  const center = svgSize / 2;
  // Scale radius so it fits nicely inside canvas: max radius ~25 map to maxPx ~140
  const maxDisplayRadius = 25;
  const visualRadius = Math.min(145, Math.max(15, (r / maxDisplayRadius) * 125));

  const consoleOutputString = `Yarıçapı (${r}) olan dairenin alanı: (${area})`;
  const roundedConsoleOutput = `Yarıçapı (${r}) olan dairenin alanı: (${area.toFixed(2)})`;

  const copyConsoleOutput = () => {
    navigator.clipboard.writeText(consoleOutputString);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Shapes className="w-4 h-4 text-amber-400" />
            <span>Dairenin Alanı Geometrik Görselleştirici & Formül İspatı</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formül: <span className="font-mono-code text-amber-300">Alan = π × r²</span> (Çevre = <span className="font-mono-code text-teal-300">2 × π × r</span>)
          </p>
        </div>

        {/* Console String Preview Chip */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Konsol Formatı:</span>
          <code className="text-emerald-400 font-mono-code text-[11px] font-semibold truncate max-w-[240px] sm:max-w-none">
            {roundedConsoleOutput}
          </code>
          <button
            onClick={copyConsoleOutput}
            className="p-1 hover:text-white text-slate-400 transition-colors ml-1"
            title="Formatı Kopyala"
          >
            {copiedFormat ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Canvas Column */}
        <div className="lg:col-span-6 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-between shadow-xl">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Etkileşimli Tuval (r = {r})</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSquare}
                  onChange={(e) => setShowSquare(e.target.checked)}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span>Kare (4r²)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span>Izgara</span>
              </label>
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="relative flex items-center justify-center p-2">
            <svg
              width={svgSize}
              height={svgSize}
              className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
                </pattern>
                <radialGradient id="circleGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Grid */}
              {showGrid && <rect width={svgSize} height={svgSize} fill="url(#grid)" />}

              {/* Axes */}
              <line x1={center} y1="15" x2={center} y2={svgSize - 15} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="15" y1={center} x2={svgSize - 15} y2={center} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              {/* Circumscribed square (Area = 4 * r^2) */}
              {showSquare && (
                <rect
                  x={center - visualRadius}
                  y={center - visualRadius}
                  width={visualRadius * 2}
                  height={visualRadius * 2}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="transition-all duration-200"
                />
              )}

              {/* Circle (Area = π * r^2) */}
              <circle
                cx={center}
                cy={center}
                r={visualRadius}
                fill="url(#circleGrad)"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-200"
              />

              {/* Center point */}
              <circle cx={center} cy={center} r="3" fill="#10b981" />

              {/* Radius line */}
              <line
                x1={center}
                y1={center}
                x2={center + visualRadius}
                y2={center}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-200"
              />

              {/* Radius label */}
              <text
                x={center + visualRadius / 2}
                y={center - 8}
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                className="font-mono-code select-none"
              >
                r = {r}
              </text>

              {/* Center label O */}
              <text
                x={center - 10}
                y={center + 14}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                className="select-none"
              >
                (0,0)
              </text>
            </svg>
          </div>

          {/* Slider and Input Controls */}
          <div className="w-full mt-4 space-y-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Yarıçap Değeri (r):
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300 font-mono-code font-bold text-center text-xs focus:outline-none focus:border-amber-400"
                />
                <span className="text-slate-400 text-xs">birim</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={radius > 25 ? 25 : radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Quick value buttons */}
            <div className="flex items-center justify-between gap-1 text-[11px] pt-1 border-t border-slate-800/80">
              <span className="text-slate-500 text-[10px]">Hızlı Seçim:</span>
              {[1, 3, 5, 7, 10, 12.5, 20].map((val) => (
                <button
                  key={val}
                  onClick={() => setRadius(val)}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    radius === val
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown & Calculation Cards Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Calculation Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Adım Adım Hesaplama Dökümü
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono-code">
                π ≈ 3.14159265
              </span>
            </div>

            {/* Steps */}
            <div className="space-y-3 font-mono-code text-xs">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px]">1. Adım: Yarıçapın Karesi (r²)</span>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {r} × {r} = <span className="text-sky-300">{rSquared.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">
                  r²
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px]">2. Adım: Pi ile Çarpım (π × r²)</span>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {Math.PI.toFixed(6)}... × {rSquared}
                  </div>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  Alan (A)
                </span>
              </div>

              {/* Final Result in Exact Assignment Format */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-sans font-bold text-xs uppercase tracking-wide">
                    Ödev Çıktısı (Konsol)
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Format: Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm break-all">
                  Yarıçapı ({r}) olan dairenin alanı: ({area})
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pt-1">
                  <span>Okunabilir Yuvarlanmış: <strong className="text-amber-300 font-mono-code">{area.toFixed(2)} br²</strong></span>
                  <button
                    onClick={copyConsoleOutput}
                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedFormat ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Geometry Fact / Insight */}
            <div className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
              <strong className="text-amber-300">Neden Alan = π × r²?</strong>
              <p className="mt-1">
                Yarıçapı <code className="text-sky-300">r</code> olan bir daireyi içine alan en küçük karenin kenarı <code className="text-amber-300">2r</code>, alanı ise <code className="text-amber-300">4r²</code> olur. Daire bu karenin yaklaşık <strong>%{ratio.toFixed(1)}</strong>'ini (<code className="text-emerald-300">π / 4 ≈ 0.7854</code>) kaplar. Dolayısıyla daire alanı <code className="text-emerald-300">π × r²</code> dir!
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-medium">YARIÇAP (r)</span>
              <p className="text-base font-bold font-mono-code text-sky-400 mt-0.5">{r}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-medium">ÇAP (2r)</span>
              <p className="text-base font-bold font-mono-code text-teal-400 mt-0.5">{diameter}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-medium">ÇEVRE (2πr)</span>
              <p className="text-base font-bold font-mono-code text-amber-400 mt-0.5">{perimeter.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-medium">ALAN (πr²)</span>
              <p className="text-base font-bold font-mono-code text-emerald-400 mt-0.5">{area.toFixed(2)}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
