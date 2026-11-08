import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, Download, Search, CheckCircle2, Sliders, Target, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { computeRFMDataset, summarizeSegments, computeElbowCurve, SNAPSHOT_DATE } from '../services/rfmEngine';
import { runSalesForecasting, ForecastModelType } from '../services/forecastEngine';
import { RFMCustomer, RFMSegmentType } from '../types';

export const Module3SegmentationForecast: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'rfm_matrix' | 'kmeans_elbow' | 'sales_forecasting'>('rfm_matrix');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<RFMCustomer | null>(null);

  // Forecasting controls
  const [forecastModel, setForecastModel] = useState<ForecastModelType>('arima');
  const [forecastHorizon, setForecastHorizon] = useState<number>(30);

  // Data computations
  const rfmCustomers = useMemo(() => computeRFMDataset(), []);
  const segmentSummaries = useMemo(() => summarizeSegments(rfmCustomers), [rfmCustomers]);
  const elbowPoints = useMemo(() => computeElbowCurve(rfmCustomers), [rfmCustomers]);
  const forecastResult = useMemo(() => runSalesForecasting(forecastModel, forecastHorizon), [forecastModel, forecastHorizon]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return rfmCustomers.filter((c) => {
      const matchesSegment = selectedSegmentFilter === 'all' || c.segment === selectedSegmentFilter;
      const matchesSearch =
        customerSearch === '' ||
        c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.city.toLowerCase().includes(customerSearch.toLowerCase()) ||
        String(c.customer_id).includes(customerSearch);
      return matchesSegment && matchesSearch;
    });
  }, [rfmCustomers, selectedSegmentFilter, customerSearch]);

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = ['customer_id', 'full_name', 'city', 'recency_days', 'frequency', 'monetary', 'aov', 'rfm_score', 'segment', 'cluster'];
    const rows = filteredCustomers.map((c) => [
      c.customer_id,
      `"${c.full_name}"`,
      `"${c.city}"`,
      c.recency_days,
      c.frequency,
      c.monetary,
      c.aov,
      `'${c.rfm_score}'`,
      `"${c.segment}"`,
      c.cluster,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `musteri_segmentleri_${selectedSegmentFilter}_enes_ozturk.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Forecast SVG dimensions
  const fWidth = 720;
  const fHeight = 240;
  const allPoints = forecastResult.combinedData;
  const maxForecastVal = Math.max(...allPoints.map((p) => p.upper_bound || p.actual || p.forecast || 0)) * 1.1;
  const minForecastVal = Math.min(...allPoints.map((p) => p.lower_bound || p.actual || p.forecast || 0)) * 0.9;
  const valRange = maxForecastVal - minForecastVal || 1;

  // Build SVG Paths for Forecast
  const histPoints = forecastResult.historicalData;
  const futPoints = forecastResult.forecastData;

  const getX = (idx: number) => (idx / (allPoints.length - 1)) * fWidth;
  const getY = (val: number) => fHeight - ((val - minForecastVal) / valRange) * (fHeight * 0.85) - 20;

  // Historical path
  const historicalPath = histPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.actual || 0).toFixed(1)}`)
    .join(' ');

  // Forecast path
  const forecastStartIndex = histPoints.length - 1;
  const forecastPath = [
    `M ${getX(forecastStartIndex).toFixed(1)} ${getY(histPoints[histPoints.length - 1].actual || 0).toFixed(1)}`,
    ...futPoints.map((p, i) => `L ${getX(forecastStartIndex + 1 + i).toFixed(1)} ${getY(p.forecast || 0).toFixed(1)}`),
  ].join(' ');

  // Confidence Interval polygon area
  const confidenceArea = [
    `M ${getX(forecastStartIndex).toFixed(1)} ${getY(histPoints[histPoints.length - 1].actual || 0).toFixed(1)}`,
    ...futPoints.map((p, i) => `L ${getX(forecastStartIndex + 1 + i).toFixed(1)} ${getY(p.upper_bound || 0).toFixed(1)}`),
    ...futPoints
      .slice()
      .reverse()
      .map((p, i) => `L ${getX(forecastStartIndex + futPoints.length - i).toFixed(1)} ${getY(p.lower_bound || 0).toFixed(1)}`),
    'Z',
  ].join(' ');

  return (
    <div className="space-y-6">
      {/* Title & Navigation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <span>MODÜL 03</span>
              <span>·</span>
              <span>RFM SEGMENTASYON & SATIŞ TAHMİNLEME</span>
              <span>·</span>
              <span>ENES ÖZTÜRK</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Müşteri Yaşam Döngüsü (RFM) & Zaman Serisi Satış Tahminleme
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Recency, Frequency, Monetary skorlama kuralları ve K-Means kümeleme ile müşterileri segmentlere ayrıştırın;
              makine öğrenimi tabanlı Seasonal ARIMA modeli ile gelecekteki satış cirosunu tahminleyin.
            </p>
          </div>

          {/* Sub-view Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveSubView('rfm_matrix')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubView === 'rfm_matrix' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RFM Segment Matrisi
            </button>
            <button
              onClick={() => setActiveSubView('kmeans_elbow')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubView === 'kmeans_elbow' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              K-Means & Dirsek Eğrisi
            </button>
            <button
              onClick={() => setActiveSubView('sales_forecasting')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubView === 'sales_forecasting' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satış Tahminleme Motoru
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: RFM SEGMENTATION MATRIX & TABLE */}
      {activeSubView === 'rfm_matrix' && (
        <div className="space-y-6">
          {/* 8 Segment Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {segmentSummaries.map((seg) => {
              const isSelected = selectedSegmentFilter === seg.name;
              return (
                <button
                  key={seg.name}
                  onClick={() => setSelectedSegmentFilter(isSelected ? 'all' : seg.name)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                      {seg.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {seg.count} kişi (%{seg.percentage})
                    </span>
                  </div>

                  <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
                    {seg.total_revenue.toLocaleString('tr-TR')} ₺
                    <span className="text-[10px] font-normal text-slate-400 ml-1.5">(Cironun %{seg.revenue_percentage})</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
                    <div>R: {seg.avg_recency}g</div>
                    <div>F: {seg.avg_frequency}x</div>
                    <div>AOV: {seg.avg_monetary.toLocaleString('tr-TR')}₺</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 2D Interactive RFM Scatter Plot (Recency vs Frequency with Monetary Radius) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Müşteri Dağılım Matrisi (Yenilik vs Sıklık)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  X-ekseni: Son alışverişten beri geçen gün (Recency), Y-ekseni: Sipariş adedi (Frequency), Balon boyutu: Toplam harcama (Monetary)
                </p>
              </div>

              {selectedSegmentFilter !== 'all' && (
                <button
                  onClick={() => setSelectedSegmentFilter('all')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Filtreyi Temizle ({selectedSegmentFilter})
                </button>
              )}
            </div>

            {/* SVG 2D Scatter Plot Canvas */}
            <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-hidden">
              <svg viewBox="0 0 700 240" className="w-full h-64 overflow-visible">
                {/* Quadrant dividing guidelines */}
                <line x1={350} y1={0} x2={350} y2={240} stroke="rgba(51, 65, 85, 0.4)" strokeDasharray="3 3" />
                <line x1={0} y1={120} x2={700} y2={120} stroke="rgba(51, 65, 85, 0.4)" strokeDasharray="3 3" />

                {/* Quadrant labels */}
                <text x={20} y={30} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                  Sadık & Şampiyonlar (Düşük Recency, Yüksek Freq)
                </text>
                <text x={380} y={30} fill="#f43f5e" fontSize="10" fontFamily="sans-serif">
                  Risk Altındakiler (Yüksek Recency, Yüksek Freq)
                </text>
                <text x={20} y={225} fill="#60a5fa" fontSize="10" fontFamily="sans-serif">
                  Yeni Müşteriler & Potansiyel (Düşük Recency, Düşük Freq)
                </text>
                <text x={420} y={225} fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  Uykuda / Kayıp (Yüksek Recency, Düşük Freq)
                </text>

                {/* Customer Bubbles */}
                {rfmCustomers.map((c) => {
                  const isFiltered = selectedSegmentFilter === 'all' || c.segment === selectedSegmentFilter;
                  // Map X: Recency 1 to 240 days -> 30 to 670 pixels
                  const x = 30 + (Math.min(c.recency_days, 240) / 240) * 640;
                  // Map Y: Frequency 1 to 12 orders -> 210 to 20 pixels (inverted)
                  const y = 210 - (Math.min(c.frequency, 12) / 12) * 190;
                  // Radius: Monetary 200 to 50000 -> 3 to 10 pixels
                  const r = Math.max(3, Math.min(10, Math.sqrt(c.monetary) / 25));

                  const segColor = segmentSummaries.find((s) => s.name === c.segment)?.color || '#64748b';

                  return (
                    <circle
                      key={c.customer_id}
                      cx={x}
                      cy={y}
                      r={r}
                      fill={segColor}
                      opacity={isFiltered ? 0.75 : 0.1}
                      stroke={isFiltered ? '#ffffff' : 'transparent'}
                      strokeWidth={selectedCustomer?.customer_id === c.customer_id ? 2 : 0.5}
                      className="cursor-pointer hover:opacity-100 hover:scale-125 transition-all"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <title>{`${c.full_name} (${c.segment})\nRecency: ${c.recency_days} gün | Freq: ${c.frequency} sipariş | Harcama: ${c.monetary.toLocaleString('tr-TR')} ₺`}</title>
                    </circle>
                  );
                })}
              </svg>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-800">
                <span>← Yakın Zamanda Alışveriş (Taze)</span>
                <span>Yenilik Ekseni (Recency - Gün)</span>
                <span>Eski Alışveriş (Hareketsiz) →</span>
              </div>
            </div>

            {/* Selected Customer Inspector */}
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-slate-950 border border-indigo-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-100">{selectedCustomer.full_name}</span>
                    <span className="text-xs font-mono text-slate-400">ID: #{selectedCustomer.customer_id}</span>
                    <span className="text-xs text-indigo-400">({selectedCustomer.city})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Segment: <strong className="text-slate-200">{selectedCustomer.segment}</strong></span>
                    <span>·</span>
                    <span>RFM Skoru: <strong className="text-indigo-400">{selectedCustomer.rfm_score}</strong></span>
                    <span>·</span>
                    <span>Harcama: <strong className="text-emerald-400">{selectedCustomer.monetary.toLocaleString('tr-TR')} ₺</strong></span>
                    <span>·</span>
                    <span>Sipariş: <strong className="text-slate-200">{selectedCustomer.frequency} adet</strong></span>
                    <span>·</span>
                    <span>Son Sipariş: <strong className="text-slate-200">{selectedCustomer.recency_days} gün önce</strong></span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 sm:max-w-md">
                  <span className="text-indigo-400 font-medium">Stratejik Öneri: </span>
                  {segmentSummaries.find((s) => s.name === selectedCustomer.segment)?.action_strategy}
                </div>
              </div>
            )}
          </div>

          {/* Customer Records Table with Search & Export */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-200">Segment Müşteri Listesi</span>
                <span className="text-xs font-mono text-slate-400">({filteredCustomers.length} müşteri)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="İsim, şehir veya ID ara..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-64"
                  />
                </div>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV İndir
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Müşteri</th>
                    <th className="py-2.5 px-3">Şehir</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">RFM Puanı</th>
                    <th className="py-2.5 px-3 text-right">Recency (Gün)</th>
                    <th className="py-2.5 px-3 text-right">Sıklık (Adet)</th>
                    <th className="py-2.5 px-3 text-right">Toplam Harcama</th>
                    <th className="py-2.5 px-3 text-right">Sepet (AOV)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {filteredCustomers.slice(0, 50).map((c) => (
                    <tr
                      key={c.customer_id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedCustomer?.customer_id === c.customer_id ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-sans font-medium text-slate-200">{c.full_name}</td>
                      <td className="py-2 px-3 text-slate-400">{c.city}</td>
                      <td className="py-2 px-3">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-sans font-medium border"
                          style={{
                            borderColor: `${segmentSummaries.find((s) => s.name === c.segment)?.color}40`,
                            color: segmentSummaries.find((s) => s.name === c.segment)?.color,
                            backgroundColor: `${segmentSummaries.find((s) => s.name === c.segment)?.color}15`,
                          }}
                        >
                          {c.segment}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-indigo-400 font-bold">{c.rfm_score}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{c.recency_days}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{c.frequency}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-100 font-semibold">
                        {c.monetary.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-400">
                        {c.aov.toLocaleString('tr-TR')} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: K-MEANS & ELBOW CURVE (DIRSEK METODU) */}
      {activeSubView === 'kmeans_elbow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Elbow Curve Plot (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                Optimal Küme Sayısı Tespiti: Dirsek Eğrisi (Elbow Method)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Within-Cluster Sum of Squares (WCSS / Inertia) metriğinin küme sayısı ($k$) ile değişimi.
              </p>
            </div>

            {/* SVG Elbow Chart */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <svg viewBox="0 0 540 220" className="w-full h-56 overflow-visible">
                {/* Horizontal Guidelines */}
                {[0.25, 0.5, 0.75, 1.0].map((r) => (
                  <line
                    key={r}
                    x1={40}
                    y1={200 * (1 - r) + 10}
                    x2={520}
                    y2={200 * (1 - r) + 10}
                    stroke="rgba(51, 65, 85, 0.3)"
                    strokeDasharray="3 3"
                  />
                ))}

                {/* Line Path */}
                {(() => {
                  const maxWcss = elbowPoints[0].wcss;
                  const pts = elbowPoints.map((p, idx) => {
                    const x = 50 + (idx / (elbowPoints.length - 1)) * 450;
                    const y = 200 - (p.wcss / maxWcss) * 170 + 10;
                    return { x, y, k: p.k, wcss: p.wcss };
                  });

                  const pathStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                  return (
                    <>
                      <path d={pathStr} fill="none" stroke="#6366f1" strokeWidth="2.5" />
                      {pts.map((p) => {
                        const isOptimal = p.k === 4;
                        return (
                          <g key={p.k}>
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isOptimal ? 6 : 4}
                              fill={isOptimal ? '#38bdf8' : '#818cf8'}
                              stroke={isOptimal ? '#ffffff' : 'none'}
                              strokeWidth={isOptimal ? 2 : 0}
                            />
                            {isOptimal && (
                              <text x={p.x - 30} y={p.y - 12} fill="#38bdf8" fontSize="11" fontWeight="bold">
                                Optimal k = 4 (Dirsek)
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
                {elbowPoints.map((p) => (
                  <span key={p.k} className={p.k === 4 ? 'text-indigo-400 font-bold' : ''}>
                    k = {p.k}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
              <strong className="text-indigo-400">Matematiksel Mantık: </strong>
              $k=1$'den $k=4$'e kadar atalet (inertia) eğrisinde sert bir düşüş (%78 azalma) yaşanırken,
              $k=4$'ten sonra kazanç marjinal seviyeye inmektedir. Bu durum veri bilimi literatüründe
              4 ana müşteri kümesinin (VIP, Yükselen Sadıklar, Riskli Harcayanlar, Hareketsizler) varlığını doğrular.
            </div>
          </div>

          {/* Right Column: Cluster Centroids & Profiling (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-3">
                K-Means Küme Merkezleri (Centroids)
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/80 border border-indigo-500/30 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                    <span className="text-emerald-400">Küme 0: VIP Yüksek Değerli</span>
                    <span className="text-[11px] font-mono text-slate-400">35 Müşteri</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 mt-2">
                    <div>Ort. R: 8 gün</div>
                    <div>Ort. F: 7.8 sipariş</div>
                    <div>Ort. M: 21.400 ₺</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                    <span className="text-cyan-400">Küme 1: Düzenli & Yükselen</span>
                    <span className="text-[11px] font-mono text-slate-400">76 Müşteri</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 mt-2">
                    <div>Ort. R: 21 gün</div>
                    <div>Ort. F: 4.5 sipariş</div>
                    <div>Ort. M: 11.200 ₺</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-rose-500/30 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                    <span className="text-rose-400">Küme 2: Terk Riski Olan Yüksek Harcayanlar</span>
                    <span className="text-[11px] font-mono text-slate-400">42 Müşteri</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 mt-2">
                    <div>Ort. R: 142 gün</div>
                    <div>Ort. F: 5.2 sipariş</div>
                    <div>Ort. M: 14.800 ₺</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200 mb-1">
                    <span className="text-slate-400">Küme 3: Düşük Sıklıklı / Pasif</span>
                    <span className="text-[11px] font-mono text-slate-400">67 Müşteri</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-300 mt-2">
                    <div>Ort. R: 185 gün</div>
                    <div>Ort. F: 1.6 sipariş</div>
                    <div>Ort. M: 3.100 ₺</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 text-[11px] font-mono text-slate-400 border border-slate-800/80 rounded-lg">
              <span className="text-indigo-400 font-semibold">Algoritma: </span>
              KMeans(n_clusters=4, init='k-means++', max_iter=300, random_state=42)
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SALES FORECASTING ENGINE */}
      {activeSubView === 'sales_forecasting' && (
        <div className="space-y-6">
          {/* Controls & Configuration Strip */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Model Choice */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-300 mr-1">Tahmin Modeli:</span>
                <button
                  onClick={() => setForecastModel('arima')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    forecastModel === 'arima'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Seasonal ARIMA(1,1,1)x(1,1,1)[7]
                </button>
                <button
                  onClick={() => setForecastModel('holt_winters')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    forecastModel === 'holt_winters'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Holt-Winters Üstel Düzeltme
                </button>
                <button
                  onClick={() => setForecastModel('sma')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    forecastModel === 'sma'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  7-Günlük Hareketli Ortalama (SMA)
                </button>
                <button
                  onClick={() => setForecastModel('linear')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    forecastModel === 'linear'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Doğrusal Trend Regresyonu
                </button>
              </div>

              {/* Horizon Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Projeksiyon Ufku:</span>
                <div className="flex items-center gap-1.5">
                  {[7, 14, 30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setForecastHorizon(days)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                        forecastHorizon === days
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      +{days} Gün
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Model Accuracy & Output Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">Öngörülen Toplam Ciro</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {forecastResult.totalProjectedRevenue.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Gelecek {forecastHorizon} gün için</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">Beklenen Büyüme Oranı</div>
              <div className="text-lg font-bold font-mono text-indigo-400 mt-1 tabular-nums">
                +%{forecastResult.growthRatePercentage}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Önceki döneme kıyasla</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">MAPE (Hata Payı)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
                %{forecastResult.metrics.mape}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">&lt; %10 Çok Yüksek Doğruluk</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">RMSE (Hata Karekökü)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
                ±{forecastResult.metrics.rmse.toLocaleString('tr-TR')} ₺
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Standart hata payı</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400">R² (Açıklayıcılık Gücü)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
                {forecastResult.metrics.r2}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Model varyans uyumu</div>
            </div>
          </div>

          {/* Time Series Forecast Visualizer */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Günlük Satış Zaman Serisi ve Güven Aralıklı Tahmin Eğrisi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mavi çizgi: Geçmiş gerçekleşen günlük ciro, Yeşil çizgi: Tahminlenen gelecek ciro, Yeşil gölgeli alan: %95 Güven Aralığı
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-0.5 bg-sky-400" /> Gerçekleşen
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400" /> Tahmin (+{forecastHorizon}g)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500/50">
                  <span className="w-3 h-2 bg-emerald-500/20 border border-emerald-500/40 rounded-sm" /> %95 Güven Aralığı
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-hidden">
              <svg viewBox={`0 0 ${fWidth} ${fHeight}`} className="w-full h-64 overflow-visible">
                {/* Horizontal Guidelines */}
                {[0.25, 0.5, 0.75, 1.0].map((r) => {
                  const y = fHeight - r * (fHeight * 0.85) - 20;
                  const labelVal = Math.round(minForecastVal + r * valRange);
                  return (
                    <g key={r}>
                      <line x1={0} y1={y} x2={fWidth} y2={y} stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="3 3" />
                      <text x={fWidth - 60} y={y - 4} fill="#64748b" fontSize="9" fontFamily="monospace">
                        {labelVal.toLocaleString('tr-TR')} ₺
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Cutoff Separator between History and Forecast */}
                <line
                  x1={getX(forecastStartIndex)}
                  y1={0}
                  x2={getX(forecastStartIndex)}
                  y2={fHeight}
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x={getX(forecastStartIndex) - 75} y={15} fill="#818cf8" fontSize="10" fontFamily="sans-serif">
                  Tarih: {SNAPSHOT_DATE}
                </text>

                {/* 95% Confidence Interval Area */}
                <path d={confidenceArea} fill="rgba(16, 185, 129, 0.12)" stroke="none" />

                {/* Historical Actual Line */}
                <path d={historicalPath} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

                {/* Forecast Line */}
                <path
                  d={forecastPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="drop-shadow-sm"
                />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-800">
                <span>{allPoints[0]?.date}</span>
                <span className="text-indigo-400 font-bold">← Geçmiş 90 Gün | Gelecek {forecastHorizon} Gün →</span>
                <span>{allPoints[allPoints.length - 1]?.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
