import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, HelpCircle, ArrowUpRight, ArrowDownRight, Activity, Percent } from 'lucide-react';
import { computeRFMDataset } from '../services/rfmEngine';
import { calculateDescriptiveStats, calculatePearsonCorrelation, createHistogramBins, normalPdf } from '../services/statistics';

export const Module2EdaStatistics: React.FC = () => {
  const [selectedMetricKey, setSelectedMetricKey] = useState<'monetary' | 'frequency' | 'recency_days' | 'aov'>('monetary');
  const [binCount, setBinCount] = useState<number>(16);
  const [showNormalCurve, setShowNormalCurve] = useState<boolean>(true);
  const [selectedCorrelationPair, setSelectedCorrelationPair] = useState<[string, string]>(['frequency', 'monetary']);

  // Compute RFM records for statistics
  const rfmData = useMemo(() => computeRFMDataset(), []);

  // Extract arrays for correlation matrix
  const datasetVectors = useMemo(() => {
    return {
      recency_days: rfmData.map((d) => d.recency_days),
      frequency: rfmData.map((d) => d.frequency),
      monetary: rfmData.map((d) => d.monetary),
      aov: rfmData.map((d) => d.aov),
      // Synthetic discount sensitivity proxy based on AOV and frequency
      discount_ratio: rfmData.map((d) => Math.round((0.05 + (d.customer_id % 7) * 0.03) * 100) / 100),
    };
  }, [rfmData]);

  // Selected metric values & stats
  const activeValues = datasetVectors[selectedMetricKey];
  const stats = useMemo(() => calculateDescriptiveStats(activeValues), [activeValues]);
  const histogramBins = useMemo(() => createHistogramBins(activeValues, binCount), [activeValues, binCount]);

  // Correlation Matrix Variables
  const correlationVariables = [
    { key: 'recency_days', label: 'Yenilik (Recency)' },
    { key: 'frequency', label: 'Sıklık (Frequency)' },
    { key: 'monetary', label: 'Harcama (Monetary)' },
    { key: 'aov', label: 'Sepet (AOV)' },
    { key: 'discount_ratio', label: 'İndirim Duyarlılığı' },
  ];

  // Correlation Matrix Computation
  const correlationMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    correlationVariables.forEach((v1) => {
      matrix[v1.key] = {};
      correlationVariables.forEach((v2) => {
        const r = calculatePearsonCorrelation((datasetVectors as any)[v1.key], (datasetVectors as any)[v2.key]);
        matrix[v1.key][v2.key] = r;
      });
    });
    return matrix;
  }, [datasetVectors]);

  // Metric labels & unit formatters
  const metricConfigs = {
    monetary: { label: 'Toplam Harcama (Monetary)', unit: '₺', desc: 'Müşterinin sisteme kazandırdığı toplam brüt ciro' },
    frequency: { label: 'Sipariş Sıklığı (Frequency)', unit: 'adet', desc: 'Müşterinin tamamladığı toplam benzersiz sipariş sayısı' },
    recency_days: { label: 'Son Alışveriş Süresi (Recency)', unit: 'gün', desc: 'Analiz referans tarihinden son siparişe kadar geçen gün' },
    aov: { label: 'Ortalama Sepet Tutarı (AOV)', unit: '₺', desc: 'Sipariş başına ortalama düşen harcama (Monetary / Frequency)' },
  };

  const currentConfig = metricConfigs[selectedMetricKey];

  // Calculate SVG curve for normal distribution
  const maxBinCount = Math.max(...histogramBins.map((b) => b.count), 1);
  const chartHeight = 220;
  const chartWidth = 560;

  // Normal curve points mapped to chart dimensions
  const normalCurvePath = useMemo(() => {
    if (!showNormalCurve || stats.stdDev <= 0) return '';
    const points: string[] = [];
    const minVal = stats.min;
    const maxVal = stats.max;
    const steps = 60;
    const stepSize = (maxVal - minVal) / steps;

    // Normalizing scale factor to fit histogram height
    const peakPdf = normalPdf(stats.mean, stats.mean, stats.stdDev);
    const scaleFactor = (chartHeight * 0.88) / (peakPdf || 1);

    for (let i = 0; i <= steps; i++) {
      const xVal = minVal + i * stepSize;
      const pdfVal = normalPdf(xVal, stats.mean, stats.stdDev);
      const xPixel = (i / steps) * chartWidth;
      const yPixel = chartHeight - pdfVal * scaleFactor;
      points.push(`${i === 0 ? 'M' : 'L'} ${xPixel.toFixed(1)} ${yPixel.toFixed(1)}`);
    }
    return points.join(' ');
  }, [stats, showNormalCurve]);

  // Interpretation for selected correlation
  const activeR = correlationMatrix[selectedCorrelationPair[0]]?.[selectedCorrelationPair[1]] ?? 0;
  const getCorrelationInterpretation = (r: number) => {
    if (r === 1) return 'Mükemmel pozitif tam doğrusal ilişki (özdeş değişkenler).';
    if (r >= 0.7) return 'Çok güçlü pozitif yönlü ilişki; bir değişken arttığında diğeri de belirgin şekilde artar.';
    if (r >= 0.4) return 'Orta-güçlü pozitif yönlü ilişki; birlikte artma eğilimi mevcuttur.';
    if (r > 0) return 'Zayıf pozitif yönlü ilişki; hafif bir beraberlik gözlenir.';
    if (r <= -0.7) return 'Çok güçlü negatif yönlü ters ilişki; bir değişken artarken diğeri sert düşer.';
    if (r <= -0.4) return 'Belirgin negatif yönlü ilişki; örneğin gün uzadıkça (recency) harcama sıklığı azalır.';
    return 'Hemen hemen sıfır korelasyon; değişkenler birbirinden bağımsız hareket eder.';
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <span>MODÜL 02</span>
              <span>·</span>
              <span>EDA & TEMEL MATEMATİKSEL İSTATİSTİK</span>
              <span>·</span>
              <span>ENES ÖZTÜRK</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Keşifçi Veri Analizi (EDA) & İstatistiksel Olasılık Dağılımları
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Merkezi eğilim ölçüleri (ortalama, medyan, mod), dağılım saçılımı (standart sapma, varyans, IQR) ve
              değişkenler arası Pearson korelasyon katsayıları ile müşteri davranışlarının matematiksel profilini çıkarın.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg shrink-0 overflow-x-auto">
            {(Object.keys(metricConfigs) as (keyof typeof metricConfigs)[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMetricKey(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedMetricKey === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {key === 'monetary' ? 'Harcama (M)' : key === 'frequency' ? 'Sıklık (F)' : key === 'recency_days' ? 'Yenilik (R)' : 'Sepet (AOV)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Essential Statistical KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Mean */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Aritmetik Ortalama (μ)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.mean.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">{currentConfig.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">x̄ = Σxᵢ / n</div>
        </div>

        {/* Median */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Medyan (Q2 / Ortanca)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.median.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">{currentConfig.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">%50 persentil</div>
        </div>

        {/* Mode */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Mod (En Sık Değer)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.mode.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">{currentConfig.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">En yüksek frekans</div>
        </div>

        {/* Std Dev */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Standart Sapma (σ)</div>
          <div className="text-base font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            ±{stats.stdDev.toLocaleString('tr-TR')}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">σ = √(Varyans)</div>
        </div>

        {/* Variance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Varyans (σ²)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.variance > 1000000 ? `${(stats.variance / 1000000).toFixed(1)}M` : stats.variance.toLocaleString('tr-TR')}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Σ(x - μ)² / (n-1)</div>
        </div>

        {/* IQR */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">IQR (Çeyrekler Açıklığı)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.iqr.toLocaleString('tr-TR')}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Q3 - Q1</div>
        </div>

        {/* Skewness */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Çarpıklık (Skewness)</div>
          <div className={`text-base font-bold font-mono mt-1 tabular-nums ${stats.skewness > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
            {stats.skewness.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {stats.skewness > 0.5 ? 'Sağa Çarpık' : stats.skewness < -0.5 ? 'Sola Çarpık' : 'Simetrik'}
          </div>
        </div>

        {/* Kurtosis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="text-[11px] text-slate-400">Basıklık (Kurtosis)</div>
          <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {stats.kurtosis.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {stats.kurtosis > 0 ? 'Sivri (Leptokurtic)' : 'Basık (Platykurtic)'}
          </div>
        </div>
      </div>

      {/* Main EDA Split: Distribution Histogram vs Correlation Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Histogram with Normal Density Curve (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  {currentConfig.label} Frekans Dağılımı (Histogram & Gauss PDF)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentConfig.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNormalCurve}
                    onChange={(e) => setShowNormalCurve(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Gauss Çanı (PDF)</span>
                </label>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Bin:</span>
                  <select
                    value={binCount}
                    onChange={(e) => setBinCount(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 font-mono"
                  >
                    <option value={10}>10</option>
                    <option value={16}>16</option>
                    <option value={24}>24</option>
                    <option value={32}>32</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SVG Combined Histogram and Curve Visualizer */}
            <div className="relative bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 overflow-visible">
                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
                  <line
                    key={ratio}
                    x1={0}
                    y1={chartHeight * (1 - ratio)}
                    x2={chartWidth}
                    y2={chartHeight * (1 - ratio)}
                    stroke="rgba(51, 65, 85, 0.35)"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Histogram Bars */}
                {histogramBins.map((bin, i) => {
                  const barWidth = chartWidth / histogramBins.length;
                  const barHeight = (bin.count / maxBinCount) * (chartHeight * 0.85);
                  const x = i * barWidth;
                  const y = chartHeight - barHeight;

                  return (
                    <g key={i} className="group">
                      <rect
                        x={x + 1}
                        y={y}
                        width={Math.max(2, barWidth - 2)}
                        height={barHeight}
                        className="fill-indigo-600/60 hover:fill-indigo-500 transition-colors"
                        rx={2}
                      />
                      {/* Tooltip text simulation on hover */}
                      <title>{`${bin.label}: ${bin.count} müşteri (%${(bin.relativeFreq * 100).toFixed(1)})`}</title>
                    </g>
                  );
                })}

                {/* Normal Gaussian Bell Curve Line */}
                {showNormalCurve && normalCurvePath && (
                  <path
                    d={normalCurvePath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                )}
              </svg>

              {/* X-Axis labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800">
                <span>Min: {stats.min.toLocaleString('tr-TR')} {currentConfig.unit}</span>
                <span>Q1: {stats.q1.toLocaleString('tr-TR')}</span>
                <span className="text-indigo-400 font-bold">Medyan: {stats.median.toLocaleString('tr-TR')}</span>
                <span>Q3: {stats.q3.toLocaleString('tr-TR')}</span>
                <span>Max: {stats.max.toLocaleString('tr-TR')} {currentConfig.unit}</span>
              </div>
            </div>
          </div>

          {/* Statistical Insight footer */}
          <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-300">
            <span className="font-semibold text-slate-200">Veri Bilimi Çıkarımı: </span>
            {stats.skewness > 0.8 ? (
              <span>
                Veri sağa doğru belirgin şekilde uzayan kuyruğa (<span className="text-amber-400 font-mono">sağa çarpık / positive skew</span>) sahiptir.
                Aritmetik ortalama ({stats.mean.toLocaleString('tr-TR')} {currentConfig.unit}), medyan değerinden ({stats.median.toLocaleString('tr-TR')} {currentConfig.unit})
                daha yüksektir. Bu durum K-Means gibi uzaklık temelli algoritmalarda Log Dönüşümü (log1p) gerektirir.
              </span>
            ) : (
              <span>
                Veri dengeli ve simetrik bir dağılıma yakındır. Ortalama ve medyan değerleri birbirine yakın seyretmektedir.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Pearson Correlation Heatmap (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Pearson Korelasyon Matrisi (r)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Değişkenler arası doğrusal ilişki katsayıları [-1, +1]</p>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-1.5 text-left text-[11px] font-mono text-slate-500">Değişken</th>
                    {correlationVariables.map((v) => (
                      <th key={v.key} className="p-1.5 text-[10px] font-mono text-slate-400 font-normal">
                        {v.key === 'recency_days' ? 'Recency' : v.key === 'frequency' ? 'Freq' : v.key === 'monetary' ? 'Monet' : v.key === 'aov' ? 'AOV' : 'İndirim'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationVariables.map((rowVar) => (
                    <tr key={rowVar.key} className="border-t border-slate-800/40">
                      <td className="p-1.5 text-left text-[11px] font-mono font-medium text-slate-300">
                        {rowVar.key === 'recency_days' ? 'Recency' : rowVar.key === 'frequency' ? 'Frequency' : rowVar.key === 'monetary' ? 'Monetary' : rowVar.key === 'aov' ? 'AOV' : 'İndirim'}
                      </td>
                      {correlationVariables.map((colVar) => {
                        const r = correlationMatrix[rowVar.key]?.[colVar.key] ?? 0;
                        const isSelected = selectedCorrelationPair[0] === rowVar.key && selectedCorrelationPair[1] === colVar.key;

                        // Color intensity based on correlation
                        let cellBg = 'bg-slate-900/40 text-slate-300';
                        if (r === 1) cellBg = 'bg-indigo-950/50 text-indigo-300 font-bold';
                        else if (r >= 0.6) cellBg = 'bg-emerald-950/60 text-emerald-300 font-semibold';
                        else if (r >= 0.3) cellBg = 'bg-emerald-950/30 text-emerald-400';
                        else if (r <= -0.4) cellBg = 'bg-rose-950/60 text-rose-300 font-semibold';
                        else if (r <= -0.2) cellBg = 'bg-rose-950/30 text-rose-400';

                        return (
                          <td key={colVar.key} className="p-1">
                            <button
                              onClick={() => setSelectedCorrelationPair([rowVar.key, colVar.key])}
                              className={`w-full py-1.5 px-1 rounded text-[11px] font-mono tabular-nums transition-all ${cellBg} ${
                                isSelected ? 'ring-2 ring-indigo-400 scale-105' : 'hover:opacity-90'
                              }`}
                            >
                              {r >= 0 ? `+${r.toFixed(2)}` : r.toFixed(2)}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Correlation Deep Dive */}
            <div className="mt-4 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200">
                  {correlationVariables.find((v) => v.key === selectedCorrelationPair[0])?.label} ↔{' '}
                  {correlationVariables.find((v) => v.key === selectedCorrelationPair[1])?.label}
                </span>
                <span className={`font-mono font-bold text-xs ${activeR >= 0.4 ? 'text-emerald-400' : activeR <= -0.4 ? 'text-rose-400' : 'text-slate-300'}`}>
                  r = {activeR >= 0 ? `+${activeR.toFixed(3)}` : activeR.toFixed(3)}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {getCorrelationInterpretation(activeR)}
              </p>
            </div>
          </div>

          {/* Mathematical Formula Preview Box */}
          <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[11px] font-mono text-slate-400">
            <span className="text-indigo-400 font-semibold">Pearson Formülü: </span>
            r = Σ[(x - x̄)(y - ȳ)] / √[Σ(x - x̄)² · Σ(y - ȳ)²]
          </div>
        </div>
      </div>
    </div>
  );
};
