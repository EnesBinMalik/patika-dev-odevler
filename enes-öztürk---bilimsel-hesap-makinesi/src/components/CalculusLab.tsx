import React, { useState, useMemo } from 'react';
import { Polinom, PolinomIslemleri } from '../math/scratchMath';
import { FunctionSquare, Sparkles, Sliders, ArrowRight, Eye, Check } from 'lucide-react';

export const CalculusLab: React.FC = () => {
  const [degree, setDegree] = useState<number>(3);
  // Katsayılar: en yüksek dereceden (x^degree) x^0'a doğru
  const [coefficients, setCoefficients] = useState<number[]>([3, -5, 2, -7]);
  const [evalX, setEvalX] = useState<number>(2);
  const [lowerBound, setLowerBound] = useState<number>(0);
  const [upperBound, setUpperBound] = useState<number>(3);

  // Derece değiştiğinde katsayı dizisini güncelle
  const handleDegreeChange = (newDegree: number) => {
    if (newDegree < 0 || newDegree > 8) return;
    setDegree(newDegree);
    const newCoeffs: number[] = new Array(newDegree + 1).fill(0);
    for (let i = 0; i <= newDegree; i++) {
      // Mevcut değerleri koru
      const offsetOld = coefficients.length - 1 - i;
      const offsetNew = newCoeffs.length - 1 - i;
      if (offsetOld >= 0 && offsetOld < coefficients.length) {
        newCoeffs[offsetNew] = coefficients[offsetOld];
      } else {
        newCoeffs[offsetNew] = i === newDegree ? 1 : 0;
      }
    }
    // Başkatsayı sıfır olmasın
    if (newCoeffs[0] === 0) newCoeffs[0] = 1;
    setCoefficients(newCoeffs);
  };

  const handleCoeffChange = (index: number, valStr: string) => {
    const val = parseFloat(valStr);
    const updated = [...coefficients];
    updated[index] = isNaN(val) ? 0 : val;
    setCoefficients(updated);
  };

  // Polinom nesnesi ve türev/integral hesaplamaları
  const calculations = useMemo(() => {
    try {
      const p = Polinom.azalanDerecedenUret(coefficients);
      const turevSonuc = PolinomIslemleri.turevAl(p);
      const integralSonuc = PolinomIslemleri.belirsizIntegralAl(p);
      const belirliSonuc = PolinomIslemleri.belirliIntegralAl(p, lowerBound, upperBound);
      const fxVal = p.degerHesapla(evalX);
      const fPrimeVal = turevSonuc.turevPolinom.degerHesapla(evalX);

      return {
        polinom: p,
        orijinalMetin: p.formataDonustur(),
        turevMetin: turevSonuc.turevMetni,
        turevAdimlar: turevSonuc.adimlar,
        turevPolinom: turevSonuc.turevPolinom,
        integralMetin: integralSonuc.integralMetni,
        integralAdimlar: integralSonuc.adimlar,
        belirliSonuc: belirliSonuc.sonuc,
        belirliAdimlar: belirliSonuc.adimlar,
        fxVal,
        fPrimeVal
      };
    } catch {
      return null;
    }
  }, [coefficients, evalX, lowerBound, upperBound]);

  // Hazır şablonlar
  const presets = [
    { name: 'Kübik Polinom', deg: 3, coeffs: [3, -5, 2, -7] },
    { name: 'Kare Parabol', deg: 2, coeffs: [1, -4, 3] },
    { name: '4. Derece Dalga', deg: 4, coeffs: [1, 0, -5, 0, 4] },
    { name: 'Doğrusal Fonksiyon', deg: 1, coeffs: [4, -8] },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setDegree(preset.deg);
    setCoefficients([...preset.coeffs]);
  };

  // SVG Grafiği için koordinat hesaplamaları
  const graphData = useMemo(() => {
    if (!calculations) return null;
    const { polinom, turevPolinom } = calculations;
    const width = 500;
    const height = 260;
    const padding = 35;

    const xMin = -4;
    const xMax = 4;
    const steps = 80;
    const dx = (xMax - xMin) / steps;

    const pointsF: { x: number; y: number }[] = [];
    const pointsFPrime: { x: number; y: number }[] = [];

    let yMin = -15;
    let yMax = 15;

    // Örnek değerler toplayıp y aralığını dinamik ölçekle
    const rawF: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const curX = xMin + i * dx;
      const yF = polinom.degerHesapla(curX);
      if (!isNaN(yF) && isFinite(yF)) rawF.push(yF);
    }

    if (rawF.length > 0) {
      const minVal = Math.min(...rawF);
      const maxVal = Math.max(...rawF);
      yMin = Math.max(-100, Math.min(-10, minVal * 1.1));
      yMax = Math.min(100, Math.max(10, maxVal * 1.1));
    }

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    for (let i = 0; i <= steps; i++) {
      const curX = xMin + i * dx;
      const yF = Math.max(yMin - 5, Math.min(yMax + 5, polinom.degerHesapla(curX)));
      const yFP = Math.max(yMin - 5, Math.min(yMax + 5, turevPolinom.degerHesapla(curX)));

      pointsF.push({ x: scaleX(curX), y: scaleY(yF) });
      pointsFPrime.push({ x: scaleX(curX), y: scaleY(yFP) });
    }

    const pathF = pointsF.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const pathFPrime = pointsFPrime.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    const zeroX = scaleX(0);
    const zeroY = scaleY(0);

    return { width, height, pathF, pathFPrime, zeroX, zeroY, xMin, xMax, yMin, yMax };
  }, [calculations]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            POLİNOM TÜREV & İNTEGRAL ÇÖZÜM LABORATUVARI
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kullanıcıdan denklem derecesi ve katsayılar alınarak sembolik türev ve integral hesaplaması yapılır.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Şablonlar:
          </span>
          {presets.map((pr) => (
            <button
              key={pr.name}
              onClick={() => applyPreset(pr)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/60 transition-colors"
            >
              {pr.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Card: Degree and Coefficients */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Denklem Parametreleri</h2>
          </div>

          {/* Degree Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">Denklem Derecesi (n):</label>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
              {[1, 2, 3, 4, 5, 6].map((deg) => (
                <button
                  key={deg}
                  onClick={() => handleDegreeChange(deg)}
                  className={`w-7 h-7 text-xs font-mono rounded transition-colors ${
                    degree === deg
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Coefficients Inputs */}
        <div>
          <div className="text-xs text-slate-400 mb-2">
            Katsayıları en yüksek dereceden sabit terime doğru giriniz:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {coefficients.map((coeff, idx) => {
              const currentPower = degree - idx;
              return (
                <div key={idx} className="bg-slate-950/70 p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center justify-between">
                    <span>{currentPower === 0 ? 'Sabit (a₀)' : `x^${currentPower} (a_${currentPower})`}</span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={coeff}
                    onChange={(e) => handleCoeffChange(idx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white font-mono text-sm px-2 py-1.5 rounded focus:outline-none tabular-nums"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Polynomial Preview */}
        {calculations && (
          <div className="p-3.5 bg-slate-950 rounded border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">f(x) Fonksiyonu:</span>
              <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                f(x) = {calculations.orijinalMetin}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Derece: <span className="text-cyan-300 font-bold">{degree}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid: Derivative & Integral Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derivative Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FunctionSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">1. Türev Alma (Derivative)</h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              d/dx (a·xⁿ) = n·a·xⁿ⁻¹
            </span>
          </div>

          {calculations && (
            <div className="space-y-4">
              {/* Derivative Result Banner */}
              <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono text-slate-400">Türev Fonksiyonu f'(x):</div>
                <div className="text-lg font-mono font-bold text-amber-300">
                  f'(x) = {calculations.turevMetin}
                </div>
              </div>

              {/* Point Evaluation */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Noktasal Türev Hesapla:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">x₀ =</span>
                    <input
                      type="number"
                      value={evalX}
                      onChange={(e) => setEvalX(parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2 py-1 rounded focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-300 pt-1 flex items-center justify-between border-t border-slate-800/80">
                  <span>f({evalX}) = <strong className="text-white">{calculations.fxVal.toFixed(4)}</strong></span>
                  <span>f'({evalX}) = <strong className="text-amber-400">{calculations.fPrimeVal.toFixed(4)}</strong></span>
                </div>
              </div>

              {/* Step-by-Step Derivation */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">Adım Adım Türev Kuralları:</div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {calculations.turevAdimlar.map((st, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/60"
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integral Card */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FunctionSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">2. İntegral Alma (Integral)</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              ∫ a·xⁿ dx = (a/(n+1))·xⁿ⁺¹ + C
            </span>
          </div>

          {calculations && (
            <div className="space-y-4">
              {/* Indefinite Integral Banner */}
              <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono text-slate-400">Belirsiz İntegral:</div>
                <div className="text-lg font-mono font-bold text-cyan-300">
                  ∫ f(x) dx = {calculations.integralMetin}
                </div>
              </div>

              {/* Definite Integral Calculator */}
              <div className="bg-slate-950/60 p-3 rounded border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Belirli İntegral (Alan):</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]">Alt [a]:</span>
                    <input
                      type="number"
                      value={lowerBound}
                      onChange={(e) => setLowerBound(parseFloat(e.target.value) || 0)}
                      className="w-14 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2 py-1 rounded focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[11px]">Üst [b]:</span>
                    <input
                      type="number"
                      value={upperBound}
                      onChange={(e) => setUpperBound(parseFloat(e.target.value) || 0)}
                      className="w-14 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-2 py-1 rounded focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div className="text-xs font-mono text-cyan-300 pt-1 flex items-center justify-between border-t border-slate-800/80">
                  <span>∫_{lowerBound}^{upperBound} f(x) dx =</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {calculations.belirliSonuc.toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Integration */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">Adım Adım İntegral Kuralları:</div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {calculations.integralAdimlar.map((st, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/60"
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Graph Visualizer */}
      {graphData && (
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Fonksiyon & Türev Eğrisi Analizi</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                <span className="text-slate-300">f(x) Fonksiyonu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
                <span className="text-slate-300">f'(x) Türevi</span>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto bg-slate-950 rounded border border-slate-800/80 p-2 flex justify-center">
            <svg
              viewBox={`0 0 ${graphData.width} ${graphData.height}`}
              className="w-full max-w-2xl h-auto select-none"
            >
              {/* Grid Lines */}
              <line
                x1={0}
                y1={graphData.zeroY}
                x2={graphData.width}
                y2={graphData.zeroY}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <line
                x1={graphData.zeroX}
                y1={0}
                x2={graphData.zeroX}
                y2={graphData.height}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Curves */}
              <path
                d={graphData.pathF}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={graphData.pathFPrime}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Ticks and labels */}
              <text x={graphData.width - 25} y={graphData.zeroY - 6} fill="#64748b" fontSize="10" fontFamily="monospace">x</text>
              <text x={graphData.zeroX + 6} y={15} fill="#64748b" fontSize="10" fontFamily="monospace">y</text>
              <text x={graphData.zeroX + 4} y={graphData.zeroY - 4} fill="#64748b" fontSize="9" fontFamily="monospace">(0,0)</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
