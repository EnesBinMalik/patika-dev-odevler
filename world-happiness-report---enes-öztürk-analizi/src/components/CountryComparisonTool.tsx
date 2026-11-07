import React, { useState } from 'react';
import { ArrowLeftRight, Check, HelpCircle, Scale } from 'lucide-react';
import { HAPPINESS_DATASET, CountryHappiness } from '../data/happinessData';

export const CountryComparisonTool: React.FC = () => {
  const [countryAId, setCountryAId] = useState<string>('TUR'); // Türkiye
  const [countryBId, setCountryBId] = useState<string>('NOR'); // Norveç

  const countryA = HAPPINESS_DATASET.find((c) => c.id === countryAId) || HAPPINESS_DATASET[0];
  const countryB = HAPPINESS_DATASET.find((c) => c.id === countryBId) || HAPPINESS_DATASET[1];

  const factors = [
    { key: 'gdpPerCapita', label: 'Ekonomik Üretim (GSYİH)', max: 1.9 },
    { key: 'socialSupport', label: 'Sosyal Destek & Aile Ağı', max: 1.7 },
    { key: 'healthyLifeExpectancy', label: 'Sağlıklı Yaşam Beklentisi', max: 1.0 },
    { key: 'freedom', label: 'Yaşam Tercihleri Özgürlüğü', max: 0.7 },
    { key: 'trustGovCorruption', label: 'Yolsuzluğun Olmaması (Güven)', max: 0.5 },
    { key: 'generosity', label: 'Cömertlik & Hayırseverlik', max: 0.9 },
  ] as const;

  // Radar chart SVG calculation (6 axes)
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const totalAxes = factors.length;

  const getCoordinates = (value: number, max: number, axisIndex: number) => {
    const angle = (Math.PI * 2 / totalAxes) * axisIndex - Math.PI / 2;
    const normalized = Math.min(1, Math.max(0, value / max));
    const x = center + radius * normalized * Math.cos(angle);
    const y = center + radius * normalized * Math.sin(angle);
    return { x, y };
  };

  const pathA = factors
    .map((f, i) => {
      const { x, y } = getCoordinates(countryA[f.key] as number, f.max, i);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') + ' Z';

  const pathB = factors
    .map((f, i) => {
      const { x, y } = getCoordinates(countryB[f.key] as number, f.max, i);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold font-mono">
            Birebir Kıyaslama Motoru
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
            İki Ülkeyi 6 Boyutta Karşılaştırın
          </h3>
        </div>
        <p className="text-xs text-stone-500 max-w-sm">
          Farklı kalkınma modellerine sahip ülkeleri yan yana getirerek güçlü ve kırılgan yönlerini analiz edin.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            1. Ülkeyi Seçin:
          </label>
          <select
            value={countryAId}
            onChange={(e) => setCountryAId(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
          >
            {HAPPINESS_DATASET.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.nameTr} (#{c.rank2017} - {c.score2017.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            2. Ülkeyi Seçin:
          </label>
          <select
            value={countryBId}
            onChange={(e) => setCountryBId(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
          >
            {HAPPINESS_DATASET.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.nameTr} (#{c.rank2017} - {c.score2017.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by side KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50/40 border border-amber-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{countryA.flag}</span>
            <span className="text-xs font-mono font-bold text-amber-950 px-2 py-0.5 bg-amber-100 rounded">
              Dünya #{countryA.rank2017}
            </span>
          </div>
          <h4 className="text-lg font-serif font-bold text-stone-900 mt-2">
            {countryA.nameTr}
          </h4>
          <div className="text-xs text-stone-600">{countryA.regionTr}</div>
          <div className="mt-3 text-2xl font-serif font-bold text-stone-950 tabular-nums">
            {countryA.score2017.toFixed(3)}
            <span className="text-xs font-sans text-stone-500 font-normal ml-1">/ 10</span>
          </div>
        </div>

        <div className="p-4 bg-blue-50/40 border border-blue-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{countryB.flag}</span>
            <span className="text-xs font-mono font-bold text-blue-950 px-2 py-0.5 bg-blue-100 rounded">
              Dünya #{countryB.rank2017}
            </span>
          </div>
          <h4 className="text-lg font-serif font-bold text-stone-900 mt-2">
            {countryB.nameTr}
          </h4>
          <div className="text-xs text-stone-600">{countryB.regionTr}</div>
          <div className="mt-3 text-2xl font-serif font-bold text-stone-950 tabular-nums">
            {countryB.score2017.toFixed(3)}
            <span className="text-xs font-sans text-stone-500 font-normal ml-1">/ 10</span>
          </div>
        </div>
      </div>

      {/* Comparative Radar and Detailed Bar Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Radar Graphic */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-stone-50 border border-stone-200 rounded-xl">
          <div className="text-xs font-serif font-bold text-stone-700 mb-2">
            6 Faktörlü Radar Profili
          </div>
          <svg width={size} height={size} className="overflow-visible">
            {/* Concentric reference rings */}
            {[0.25, 0.5, 0.75, 1].map((lvl) => (
              <circle
                key={lvl}
                cx={center}
                cy={center}
                r={radius * lvl}
                fill="none"
                stroke="#E7E5E4"
                strokeDasharray="2,2"
              />
            ))}

            {/* Axes */}
            {factors.map((_, i) => {
              const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="#D6D3D1" />;
            })}

            {/* Country A Polygon */}
            <path
              d={pathA}
              fill="rgba(180, 83, 9, 0.25)"
              stroke="#B45309"
              strokeWidth="2"
            />

            {/* Country B Polygon */}
            <path
              d={pathB}
              fill="rgba(30, 58, 138, 0.25)"
              stroke="#1E3A8A"
              strokeWidth="2"
            />
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium mt-3">
            <span className="inline-flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 bg-amber-700/60 rounded-xs border border-amber-800" />
              {countryA.nameTr}
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-900">
              <span className="w-3 h-3 bg-blue-800/60 rounded-xs border border-blue-900" />
              {countryB.nameTr}
            </span>
          </div>
        </div>

        {/* Detailed Factor Breakdowns */}
        <div className="lg:col-span-7 space-y-3.5">
          {factors.map((f) => {
            const valA = countryA[f.key] as number;
            const valB = countryB[f.key] as number;
            const diff = valA - valB;

            return (
              <div key={f.key} className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-stone-800">{f.label}</span>
                  <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                    Fark: {diff > 0 ? `+${diff.toFixed(3)} (${countryA.nameTr})` : `${diff.toFixed(3)} (${countryB.nameTr})`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-amber-900 font-medium">{countryA.flag} {countryA.nameTr}</span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">{valA.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-700 h-full rounded-full"
                        style={{ width: `${(valA / f.max) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-blue-900 font-medium">{countryB.flag} {countryB.nameTr}</span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">{valB.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-800 h-full rounded-full"
                        style={{ width: `${(valB / f.max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
