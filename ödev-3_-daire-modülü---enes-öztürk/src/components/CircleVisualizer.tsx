import React, { useState } from 'react';
import { Circle, Sliders, Calculator, Check, ArrowRight, BookOpen } from 'lucide-react';

export const CircleVisualizer: React.FC = () => {
  const [radius, setRadius] = useState<number>(5);

  const area = Math.PI * Math.pow(radius, 2);
  const circumference = 2 * Math.PI * radius;
  const diameter = 2 * radius;

  // Scale factor for SVG drawing
  // Max radius in slider is 20, circle container is 320x320, center 160, 160
  // radius 5 => 50px SVG radius, max 20 => 140px SVG radius
  const svgRadius = Math.min(140, Math.max(25, radius * 8));

  return (
    <div className="flex flex-col gap-6">
      {/* Visual Canvas and Calculation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Circle Canvas */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between gap-5 backdrop-blur-md">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Circle className="w-4 h-4 text-emerald-400" />
              Daire Geometrik Modeli
            </span>
            <span className="font-mono text-emerald-400 font-bold">r = {radius} br</span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full drop-shadow-2xl overflow-visible select-none"
            >
              {/* Grid backdrop */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <radialGradient id="circleGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="85%" stopColor="#059669" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
                </radialGradient>
              </defs>

              <rect width="320" height="320" fill="url(#grid)" rx="16" />

              {/* Shaded Area of the circle */}
              <circle
                cx="160"
                cy="160"
                r={svgRadius}
                fill="url(#circleGrad)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="transition-all duration-300"
              />

              {/* Center point */}
              <circle cx="160" cy="160" r="4.5" fill="#34d399" />
              <text x="160" y="152" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Merkez (O)
              </text>

              {/* Radius line (from center to right edge) */}
              <line
                x1="160"
                y1="160"
                x2={160 + svgRadius}
                y2="160"
                stroke="#38bdf8"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              <circle
                cx={160 + svgRadius}
                cy="160"
                r="4"
                fill="#38bdf8"
                className="transition-all duration-300"
              />

              {/* Radius label */}
              <text
                x={160 + svgRadius / 2}
                y="150"
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                r = {radius}
              </text>

              {/* Diameter dotted guide line */}
              <line
                x1={160 - svgRadius}
                y1="160"
                x2="160"
                y2="160"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="transition-all duration-300"
              />

              {/* Circumference Indicator Arc */}
              <path
                d={`M ${160 + svgRadius} 160 A ${svgRadius} ${svgRadius} 0 0 1 160 ${160 + svgRadius}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              <text
                x={160 + svgRadius * 0.75}
                y={160 + svgRadius * 0.75}
                fill="#c084fc"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Çevre (C)
              </text>
            </svg>
          </div>

          {/* Radius Adjustment Controls */}
          <div className="w-full space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Yarıçapı Değiştir:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{radius} br</span>
            </div>

            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>min: 1 br</span>
              <button
                type="button"
                onClick={() => setRadius(5)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Ödev Değerine Sıfırla (r = 5)
              </button>
              <span>max: 20 br</span>
            </div>
          </div>
        </div>

        {/* Mathematical Formulas & Step-by-Step Breakdown */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Formula 1: Daire Alanı */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Daire Alanı (circleArea)
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                A = π × r²
              </span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs sm:text-sm space-y-2">
              <div className="text-slate-400">
                <span>Adım 1: Yarıçapın karesi alınır ➔ </span>
                <span className="text-cyan-300">
                  {radius}² = {Math.pow(radius, 2).toFixed(2)}
                </span>
              </div>
              <div className="text-slate-400">
                <span>Adım 2: Pi (π ≈ 3.14159) ile çarpılır ➔ </span>
                <span className="text-slate-200">
                  Math.PI × {Math.pow(radius, 2).toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-bold">
                <span>Sonuç (circleArea):</span>
                <span className="text-base sm:text-lg">{area.toFixed(2)} br²</span>
              </div>
            </div>
          </div>

          {/* Formula 2: Daire Çevresi */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-mono text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Daire Çevresi (circleCircumference)
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                C = 2 × π × r
              </span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs sm:text-sm space-y-2">
              <div className="text-slate-400">
                <span>Adım 1: Çap (2r) hesaplanır ➔ </span>
                <span className="text-cyan-300">2 × {radius} = {diameter}</span>
              </div>
              <div className="text-slate-400">
                <span>Adım 2: Pi (π ≈ 3.14159) ile çarpılır ➔ </span>
                <span className="text-slate-200">
                  Math.PI × {diameter}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-teal-300 font-bold">
                <span>Sonuç (circleCircumference):</span>
                <span className="text-base sm:text-lg">{circumference.toFixed(2)} br</span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-300 block mb-0.5">
                JavaScript Math Kütüphanesi
              </span>
              <p className="leading-relaxed">
                JavaScript'te pi sayısı için <code className="text-emerald-300 font-mono">Math.PI</code>, 
                üs alma için <code className="text-emerald-300 font-mono">r * r</code> veya <code className="text-emerald-300 font-mono">Math.pow(r, 2)</code> kullanılır. 
                Sayı formatlama ise <code className="text-emerald-300 font-mono">.toFixed(2)</code> ile virgülden sonra 2 basamağa yuvarlanır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
