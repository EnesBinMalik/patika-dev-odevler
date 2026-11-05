import React from 'react';
import { EnergyHourlyData, TargetVariable, OutlierMethod } from '../../types/energy';

interface DistributionBoxplotProps {
  rawData: EnergyHourlyData[];
  cleanedData: EnergyHourlyData[];
  target: TargetVariable;
  outlierMethod: OutlierMethod;
  lowerBound: number;
  upperBound: number;
  outlierCount: number;
}

export const DistributionBoxplot: React.FC<DistributionBoxplotProps> = ({
  rawData,
  cleanedData,
  target,
  outlierMethod,
  lowerBound,
  upperBound,
  outlierCount,
}) => {
  const getStats = (data: EnergyHourlyData[]) => {
    const vals = data.map(d => d[target]).filter(v => !isNaN(v)).sort((a, b) => a - b);
    const n = vals.length;
    const min = vals[0] || 0;
    const max = vals[n - 1] || 1;
    const q1 = vals[Math.floor(n * 0.25)] || 0;
    const median = vals[Math.floor(n * 0.5)] || 0;
    const q3 = vals[Math.floor(n * 0.75)] || 0;
    const mean = vals.reduce((a, b) => a + b, 0) / (n || 1);
    return { min, max, q1, median, q3, mean, count: n };
  };

  const rawStats = getStats(rawData);
  const cleanStats = getStats(cleanedData);

  const unit = target === 'total_load_actual' ? 'MW' : '€/MWh';
  const label = target === 'total_load_actual' ? 'Saatlik Elektrik Talebi (Load)' : 'Elektrik Spot Fiyatı';

  // Overall scale
  const globalMin = Math.min(rawStats.min, lowerBound, cleanStats.min) * 0.95;
  const globalMax = Math.max(rawStats.max, upperBound, cleanStats.max) * 1.05;

  const scale = (val: number) => {
    return Math.max(0, Math.min(100, ((val - globalMin) / (globalMax - globalMin)) * 100));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Aykırı Değer (Outlier) & Kutu Grafiği (Boxplot) Analizi</span>
            {outlierCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                {outlierCount} Aykırı Nokta Tespit Edildi
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {label} için {outlierMethod.toUpperCase()} sınırları: [{lowerBound.toLocaleString('tr-TR')} {unit} - {upperBound.toLocaleString('tr-TR')} {unit}]
          </p>
        </div>
      </div>

      {/* Boxplot Visualizer */}
      <div className="space-y-6 my-6 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
        {/* Raw Data Boxplot */}
        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Orijinal Ham Veri (Aykırı Değerler İçeriyor)</span>
            </span>
            <span className="text-slate-400 font-mono">
              Min: {rawStats.min.toLocaleString('tr-TR')} | Medyan: {rawStats.median.toLocaleString('tr-TR')} | Max: {rawStats.max.toLocaleString('tr-TR')} {unit}
            </span>
          </div>

          <div className="relative h-12 bg-slate-900 rounded border border-slate-800 flex items-center px-2">
            {/* Lower & Upper Bound Outlier Threshold Lines */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
              style={{ left: `${scale(lowerBound)}%` }}
              title={`Alt Sınır: ${lowerBound}`}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
              style={{ left: `${scale(upperBound)}%` }}
              title={`Üst Sınır: ${upperBound}`}
            />

            {/* Whiskers */}
            <div
              className="absolute h-0.5 bg-slate-500"
              style={{
                left: `${scale(rawStats.min)}%`,
                width: `${scale(rawStats.max) - scale(rawStats.min)}%`,
              }}
            />

            {/* Interquartile Box (Q1 to Q3) */}
            <div
              className="absolute h-7 bg-rose-950/80 border border-rose-600 rounded"
              style={{
                left: `${scale(rawStats.q1)}%`,
                width: `${Math.max(2, scale(rawStats.q3) - scale(rawStats.q1))}%`,
              }}
            />

            {/* Median line */}
            <div
              className="absolute h-8 w-1 bg-amber-400 z-20 shadow-sm"
              style={{ left: `${scale(rawStats.median)}%` }}
              title={`Medyan: ${rawStats.median}`}
            />

            {/* Outlier Dots */}
            {rawData.filter(d => d.is_outlier).map((d, idx) => {
              const val = d[target];
              return (
                <div
                  key={idx}
                  className="absolute w-2 h-2 rounded-full bg-rose-500 border border-white z-20 -translate-x-1"
                  style={{ left: `${scale(val)}%` }}
                  title={`Aykırı Değer: ${val} ${unit}`}
                />
              );
            })}
          </div>
        </div>

        {/* Cleaned Data Boxplot */}
        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Ayıklanmış & Dönüştürülmüş Veri ({outlierMethod.toUpperCase()} Sonrası)</span>
            </span>
            <span className="text-slate-400 font-mono">
              Min: {cleanStats.min.toLocaleString('tr-TR')} | Medyan: {cleanStats.median.toLocaleString('tr-TR')} | Max: {cleanStats.max.toLocaleString('tr-TR')} {unit}
            </span>
          </div>

          <div className="relative h-12 bg-slate-900 rounded border border-slate-800 flex items-center px-2">
            {/* Whiskers */}
            <div
              className="absolute h-0.5 bg-emerald-700"
              style={{
                left: `${scale(cleanStats.min)}%`,
                width: `${scale(cleanStats.max) - scale(cleanStats.min)}%`,
              }}
            />

            {/* Interquartile Box (Q1 to Q3) */}
            <div
              className="absolute h-7 bg-emerald-950/80 border border-emerald-500 rounded"
              style={{
                left: `${scale(cleanStats.q1)}%`,
                width: `${Math.max(2, scale(cleanStats.q3) - scale(cleanStats.q1))}%`,
              }}
            />

            {/* Median line */}
            <div
              className="absolute h-8 w-1 bg-amber-400 z-20 shadow-sm"
              style={{ left: `${scale(cleanStats.median)}%` }}
              title={`Medyan: ${cleanStats.median}`}
            />
          </div>
        </div>
      </div>

      {/* Metrics comparison cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Ham Ortalama</span>
          <span className="text-base font-bold text-white font-mono">{rawStats.mean.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} {unit}</span>
          <span className="text-[10px] text-rose-400 block mt-0.5">Aykırılar ortalamayı kaydırır</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Temizlenmiş Ortalama</span>
          <span className="text-base font-bold text-emerald-400 font-mono">{cleanStats.mean.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} {unit}</span>
          <span className="text-[10px] text-emerald-500 block mt-0.5">Sağlam (Robust) istatistik</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Tespit Edilen Aykırı Sayısı</span>
          <span className="text-base font-bold text-amber-400 font-mono">{outlierCount} Gözlem</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Toplam verinin %{((outlierCount / rawData.length) * 100).toFixed(1)}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 block">Uygulanan Müdahale</span>
          <span className="text-base font-bold text-blue-400 truncate block">{outlierMethod === 'none' ? 'Yok' : 'Kırpma / Winsorize'}</span>
          <span className="text-[10px] text-blue-300 block mt-0.5">Model kararlılığı korundu</span>
        </div>
      </div>
    </div>
  );
};
