import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Info, Calendar } from 'lucide-react';
import { CovidDataCommon, DailyPoint } from '../types/covid';

interface DataChartsProps {
  data: CovidDataCommon | null;
  historicalData: DailyPoint[];
  regionName: string;
  loading: boolean;
}

export const DataCharts: React.FC<DataChartsProps> = ({
  data,
  historicalData,
  regionName,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bar' | 'timeline'>('all');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [scrubberIndex, setScrubberIndex] = useState<number | null>(null);

  if (loading || !data) {
    return (
      <section id="grafik-bolumu" className="bg-white rounded-xl border border-slate-200 p-6 mb-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="h-72 w-full bg-slate-100 rounded-xl" />
      </section>
    );
  }

  const { cases, recovered, deaths, active } = data;

  // Bar chart categories
  const barItems = [
    {
      id: 'cases',
      label: 'Enfekte',
      fullLabel: 'Enfekte Olan (Toplam Vaka)',
      value: cases,
      color: '#4f46e5', // indigo-600
      lightColor: '#e0e7ff',
      textColor: 'text-indigo-600',
      bgClass: 'bg-indigo-600',
      borderClass: 'border-indigo-600',
      percentage: '100%',
    },
    {
      id: 'recovered',
      label: 'İyileşen',
      fullLabel: 'İyileşen Hasta',
      value: recovered,
      color: '#10b981', // emerald-500
      lightColor: '#d1fae5',
      textColor: 'text-emerald-600',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-500',
      percentage: cases > 0 ? `%${((recovered / cases) * 100).toFixed(1)}` : '0%',
    },
    {
      id: 'deaths',
      label: 'Vefat',
      fullLabel: 'Vefat Eden',
      value: deaths,
      color: '#ef4444', // rose-500
      lightColor: '#fee2e2',
      textColor: 'text-rose-600',
      bgClass: 'bg-rose-500',
      borderClass: 'border-rose-500',
      percentage: cases > 0 ? `%${((deaths / cases) * 100).toFixed(2)}` : '0%',
    },
    {
      id: 'active',
      label: 'Aktif',
      fullLabel: 'Aktif Hasta',
      value: active,
      color: '#f59e0b', // amber-500
      lightColor: '#fef3c7',
      textColor: 'text-amber-600',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-500',
      percentage: cases > 0 ? `%${((active / cases) * 100).toFixed(1)}` : '0%',
    },
  ];

  // Max value for bar scaling (using cases as 100% benchmark)
  const maxBarValue = Math.max(cases, 1);

  // Historical Timeline SVG path calculation
  const timelinePoints = historicalData.length > 0 ? historicalData : [];
  const minCases = timelinePoints.length > 0 ? Math.min(...timelinePoints.map((p) => p.cases)) : 0;
  const maxCases = timelinePoints.length > 0 ? Math.max(...timelinePoints.map((p) => p.cases)) : 1;
  const rangeCases = Math.max(maxCases - minCases, 1);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Generate SVG coordinates
  const pointsCoords = timelinePoints.map((p, idx) => {
    const x = paddingX + (idx / Math.max(timelinePoints.length - 1, 1)) * graphWidth;
    const y = paddingY + graphHeight - ((p.cases - minCases) / rangeCases) * graphHeight;
    return { x, y, point: p };
  });

  // Construct smooth bezier curve path
  let pathD = '';
  let areaD = '';
  if (pointsCoords.length > 0) {
    pathD = `M ${pointsCoords[0].x} ${pointsCoords[0].y}`;
    for (let i = 0; i < pointsCoords.length - 1; i++) {
      const curr = pointsCoords[i];
      const next = pointsCoords[i + 1];
      const mx = (curr.x + next.x) / 2;
      pathD += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
    const lastX = pointsCoords[pointsCoords.length - 1].x;
    const firstX = pointsCoords[0].x;
    const bottomY = paddingY + graphHeight;
    areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  const activePoint = scrubberIndex !== null && pointsCoords[scrubberIndex]
    ? pointsCoords[scrubberIndex]
    : pointsCoords[pointsCoords.length - 1];

  return (
    <section id="grafik-bolumu" className="space-y-6 mb-12">
      {/* Header and view selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Veri & Grafik Analizi</span>
            <span className="text-slate-400 font-normal text-sm">
              ({regionName})
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Durum dağılımı sütun grafiği ve 30 günlük zaman serisi trendi
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Grafikler
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'bar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Durum Karşılaştırması
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zaman Serisi
          </button>
        </div>
      </div>

      {/* Grid container for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bar Chart of [Infected, Recovered, Deaths, Active] */}
        {(activeTab === 'all' || activeTab === 'bar') && (
          <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between ${
            activeTab === 'bar' ? 'lg:col-span-2' : ''
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <span>Durum Dağılımı (Bar Chart)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Vakaların genel toplam içerisindeki sayısal ve oransal karşılaştırması
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500 font-mono-numbers">
                  {regionName}
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-64 sm:h-72 w-full pt-4 pb-2 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 relative">
                {/* Horizontal reference grid lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 pointer-events-none" />

                {barItems.map((item) => {
                  // Minimum visual bar height so tiny rates are still visible
                  const heightPercent = Math.max((item.value / maxBarValue) * 100, 3);
                  const isHovered = hoveredBar === item.id;

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredBar(item.id)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-12 z-20 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 whitespace-nowrap shadow-lg pointer-events-none transition-all">
                          <span className="font-bold">{item.fullLabel}:</span>{' '}
                          <span className="font-mono-numbers font-medium">
                            {item.value.toLocaleString('tr-TR')}
                          </span>{' '}
                          <span className="text-slate-300 font-mono-numbers">
                            ({item.percentage})
                          </span>
                        </div>
                      )}

                      {/* Value label on top of bar */}
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 font-mono-numbers mb-1 text-center truncate max-w-full">
                        {item.value >= 1000000
                          ? `${(item.value / 1000000).toFixed(1)}M`
                          : item.value >= 1000
                          ? `${(item.value / 1000).toFixed(0)}K`
                          : item.value.toLocaleString('tr-TR')}
                      </span>

                      {/* The Bar */}
                      <div
                        className="w-full max-w-[56px] rounded-t-lg transition-all duration-300 relative overflow-hidden"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: item.color,
                          opacity: hoveredBar && !isHovered ? 0.6 : 1,
                          boxShadow: isHovered ? `0 0 12px ${item.color}55` : 'none',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
                      </div>

                      {/* Percentage pill below */}
                      <span className="text-[10px] text-slate-400 font-mono-numbers mt-1">
                        {item.percentage}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom labels */}
              <div className="flex items-center justify-between pt-3 gap-2">
                {barItems.map((item) => (
                  <div key={item.id} className="flex-1 text-center">
                    <span className={`block text-xs font-bold ${item.textColor}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono-numbers hidden sm:inline">
                      {item.value.toLocaleString('tr-TR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick footer note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Toplam Vaka Tabanlı Karşılaştırma</span>
              </span>
              <span className="font-mono-numbers text-slate-600 font-medium">
                Aktif Oran: %{((active / Math.max(cases, 1)) * 100).toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Chart 2: Historical Timeline Area Chart */}
        {(activeTab === 'all' || activeTab === 'timeline') && (
          <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between ${
            activeTab === 'timeline' ? 'lg:col-span-2' : ''
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span>Zaman Serisi Trendi (Son 30 Gün)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Kümülatif vaka artış eğrisi ve zamana bağlı değişim
                  </span>
                </div>
                {activePoint && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-indigo-600 font-mono-numbers">
                      {activePoint.point.cases.toLocaleString('tr-TR')} Vaka
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activePoint.point.displayDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive SVG Area Chart */}
              <div className="relative w-full h-64 sm:h-72">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="none"
                  className="w-full h-full cursor-crosshair overflow-visible"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const normalizedX = (mouseX / rect.width) * svgWidth;
                    // Find closest point
                    let closestIdx = 0;
                    let minDist = Infinity;
                    pointsCoords.forEach((p, idx) => {
                      const dist = Math.abs(p.x - normalizedX);
                      if (dist < minDist) {
                        minDist = dist;
                        closestIdx = idx;
                      }
                    });
                    setScrubberIndex(closestIdx);
                  }}
                  onMouseLeave={() => setScrubberIndex(null)}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = paddingY + graphHeight * ratio;
                    return (
                      <line
                        key={ratio}
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Filled Area */}
                  {areaD && <path d={areaD} fill="url(#areaGradient)" />}

                  {/* Main Line */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Interactive scrubber vertical line and dot */}
                  {activePoint && (
                    <g>
                      <line
                        x1={activePoint.x}
                        y1={paddingY}
                        x2={activePoint.x}
                        y2={paddingY + graphHeight}
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={activePoint.x}
                        cy={activePoint.y}
                        r="5"
                        fill="#4f46e5"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Time axis labels */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2 border-t border-slate-100 font-mono-numbers">
                <span>{timelinePoints[0]?.displayDate || 'Başlangıç'}</span>
                <span>{timelinePoints[Math.floor(timelinePoints.length / 2)]?.displayDate || 'Orta'}</span>
                <span>{timelinePoints[timelinePoints.length - 1]?.displayDate || 'Günümüz'}</span>
              </div>
            </div>

            {/* Scrubber stats footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {activePoint ? `${activePoint.point.displayDate} Tarihi Değerleri` : '30 Günlük Veri'}
                </span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 font-semibold font-mono-numbers">
                  {activePoint?.point.cases.toLocaleString('tr-TR')} Toplam Vaka
                </span>
                {activePoint?.point.deaths > 0 && (
                  <span className="text-rose-600 font-semibold font-mono-numbers">
                    {activePoint?.point.deaths.toLocaleString('tr-TR')} Vefat
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auxiliary Statistics Cards Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-500" />
          <span>Sağlık ve Hayatta Kalma Oranları Göstergesi</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recovery rate gauge */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-700">
              <span>İyileşme Oranı</span>
              <span className="text-emerald-600 font-mono-numbers">
                %{cases > 0 ? ((recovered / cases) * 100).toFixed(1) : 0}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((recovered / Math.max(cases, 1)) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {recovered.toLocaleString('tr-TR')} / {cases.toLocaleString('tr-TR')}
            </div>
          </div>

          {/* Mortality rate gauge */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-700">
              <span>Vefat (Mortalite) Oranı</span>
              <span className="text-rose-600 font-mono-numbers">
                %{cases > 0 ? ((deaths / cases) * 100).toFixed(2) : 0}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((deaths / Math.max(cases, 1)) * 100) * 10, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {deaths.toLocaleString('tr-TR')} vefat kaydı
            </div>
          </div>

          {/* Active rate gauge */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1 text-slate-700">
              <span>Aktif Tedavi Oranı</span>
              <span className="text-amber-600 font-mono-numbers">
                %{cases > 0 ? ((active / cases) * 100).toFixed(1) : 0}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((active / Math.max(cases, 1)) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {active.toLocaleString('tr-TR')} halen tedavi görüyor
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
