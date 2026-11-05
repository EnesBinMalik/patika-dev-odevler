import React from 'react';

interface CorrItem {
  feature1: string;
  feature2: string;
  corr: number;
}

interface CorrelationHeatmapProps {
  correlations: CorrItem[];
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlations }) => {
  // Extract unique feature names
  const features = Array.from(
    new Set(correlations.flatMap(c => [c.feature1, c.feature2]))
  ).slice(0, 7);

  // Friendly display names
  const friendlyNames: Record<string, string> = {
    total_load_actual: 'Elektrik Talebi',
    price_actual: 'Spot Fiyat',
    generation_fossil_gas: 'Doğal Gaz Üretimi',
    generation_wind: 'Rüzgar Üretimi',
    generation_solar: 'Güneş Üretimi',
    temp_madrid: 'Madrid Sıcaklık',
    temp_seville: 'Sevilla Sıcaklık',
    avg_temp_spain: 'Ort. Sıcaklık',
    wind_speed_spain: 'Rüzgar Hızı',
  };

  const getCorrValue = (f1: string, f2: string): number => {
    if (f1 === f2) return 1.0;
    const item = correlations.find(
      c => (c.feature1 === f1 && c.feature2 === f2) || (c.feature1 === f2 && c.feature2 === f1)
    );
    return item ? item.corr : 0.05;
  };

  const getColor = (corr: number) => {
    if (corr > 0) {
      // Emerald / Blue positive gradient
      const alpha = Math.min(1, Math.max(0.15, corr));
      return `rgba(59, 130, 246, ${alpha})`;
    } else {
      // Rose negative gradient
      const alpha = Math.min(1, Math.max(0.15, Math.abs(corr)));
      return `rgba(244, 63, 94, ${alpha})`;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <span>Özellikler Arası Korelasyon Matrisi (Pearson)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Talebi ve fiyatı en çok etkileyen meteorolojik ve üretim parametreleri (Doğal gaz +0.81, Rüzgar -0.54)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-400 font-medium border-b border-slate-800">Değişken</th>
              {features.map(f => (
                <th key={f} className="p-2 text-slate-300 font-medium border-b border-slate-800 whitespace-nowrap">
                  {friendlyNames[f] || f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(f1 => (
              <tr key={f1} className="border-b border-slate-800/50">
                <td className="p-2 text-left text-slate-300 font-medium whitespace-nowrap bg-slate-950/40">
                  {friendlyNames[f1] || f1}
                </td>
                {features.map(f2 => {
                  const val = getCorrValue(f1, f2);
                  const isDiag = f1 === f2;
                  return (
                    <td
                      key={f2}
                      className="p-2.5 font-mono transition hover:scale-105 cursor-default relative group"
                      style={{ backgroundColor: isDiag ? 'rgba(30, 41, 59, 0.7)' : getColor(val) }}
                    >
                      <span className={`font-semibold ${isDiag ? 'text-slate-400' : 'text-white'}`}>
                        {val > 0 && !isDiag ? `+${val.toFixed(2)}` : val.toFixed(2)}
                      </span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 bg-slate-950 border border-slate-700 text-slate-200 text-[11px] p-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        {friendlyNames[f1] || f1} ↔ {friendlyNames[f2] || f2} : <strong className="text-blue-400">{val.toFixed(2)}</strong>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-rose-500/80 inline-block" />
          <span>Güçlü Negatif (-1.00) (Örn: Rüzgar Üretimi ↔ Fiyat İndirimi)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-blue-500/80 inline-block" />
          <span>Güçlü Pozitif (+1.00) (Örn: Gaz Üretimi ↔ Fiyat Artışı)</span>
        </div>
      </div>
    </div>
  );
};
