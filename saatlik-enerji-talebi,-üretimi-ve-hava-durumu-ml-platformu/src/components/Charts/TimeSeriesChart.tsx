import React, { useState, useMemo } from 'react';
import { EnergyHourlyData } from '../../types/energy';

interface TimeSeriesChartProps {
  data: EnergyHourlyData[];
  highlightOutliers?: boolean;
}

type SeriesKey = 'total_load_actual' | 'price_actual' | 'generation_wind' | 'generation_solar' | 'temp_madrid';

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, highlightOutliers = true }) => {
  const [selectedSeries, setSelectedSeries] = useState<SeriesKey[]>(['total_load_actual', 'price_actual']);
  const [windowSize, setWindowSize] = useState<number>(72); // show 72 hours (3 days) or up to 200
  const [startIndex, setStartIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayData = useMemo(() => {
    return data.slice(startIndex, startIndex + windowSize);
  }, [data, startIndex, windowSize]);

  // Series metadata
  const seriesConfig: Record<SeriesKey, { label: string; color: string; unit: string; yAxis: 'left' | 'right' }> = {
    total_load_actual: { label: 'Elektrik Talebi (Load)', color: '#3b82f6', unit: 'MW', yAxis: 'left' },
    price_actual: { label: 'Piyasa Fiyatı (Price)', color: '#10b981', unit: '€/MWh', yAxis: 'right' },
    generation_wind: { label: 'Rüzgar Üretimi', color: '#06b6d4', unit: 'MW', yAxis: 'left' },
    generation_solar: { label: 'Güneş Üretimi', color: '#f59e0b', unit: 'MW', yAxis: 'left' },
    temp_madrid: { label: 'Madrid Sıcaklık', color: '#ef4444', unit: '°C', yAxis: 'right' },
  };

  const toggleSeries = (key: SeriesKey) => {
    if (selectedSeries.includes(key)) {
      if (selectedSeries.length > 1) {
        setSelectedSeries(selectedSeries.filter(k => k !== key));
      }
    } else {
      setSelectedSeries([...selectedSeries, key]);
    }
  };

  // SVG dimensions
  const width = 960;
  const height = 360;
  const padding = { top: 25, right: 65, bottom: 45, left: 75 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Left axis (MW) max/min
  const leftSeriesKeys = selectedSeries.filter(k => seriesConfig[k].yAxis === 'left');
  let minLeft = 15000;
  let maxLeft = 45000;
  if (leftSeriesKeys.length > 0) {
    const leftVals = displayData.flatMap(d => leftSeriesKeys.map(k => d[k])).filter(v => !isNaN(v));
    if (leftVals.length > 0) {
      minLeft = Math.floor(Math.min(...leftVals) * 0.95);
      maxLeft = Math.ceil(Math.max(...leftVals) * 1.05);
    }
  }

  // Right axis (Price / Temp) max/min
  const rightSeriesKeys = selectedSeries.filter(k => seriesConfig[k].yAxis === 'right');
  let minRight = 0;
  let maxRight = 120;
  if (rightSeriesKeys.length > 0) {
    const rightVals = displayData.flatMap(d => rightSeriesKeys.map(k => d[k])).filter(v => !isNaN(v));
    if (rightVals.length > 0) {
      minRight = Math.floor(Math.min(...rightVals) * 0.9);
      maxRight = Math.ceil(Math.max(...rightVals) * 1.1);
    }
  }

  // Scales
  const getX = (idx: number) => padding.left + (idx / Math.max(1, displayData.length - 1)) * chartW;
  const getYLeft = (val: number) => padding.top + chartH - ((val - minLeft) / Math.max(1, maxLeft - minLeft)) * chartH;
  const getYRight = (val: number) => padding.top + chartH - ((val - minRight) / Math.max(1, maxRight - minRight)) * chartH;

  // Path generator
  const makePath = (key: SeriesKey) => {
    const isLeft = seriesConfig[key].yAxis === 'left';
    const getY = isLeft ? getYLeft : getYRight;
    let d = '';
    displayData.forEach((point, idx) => {
      const val = point[key];
      if (isNaN(val)) return;
      const x = getX(idx);
      const y = getY(val);
      if (d === '') d += `M ${x} ${y}`;
      else d += ` L ${x} ${y}`;
    });
    return d;
  };

  const hoveredItem = hoveredIndex !== null && displayData[hoveredIndex] ? displayData[hoveredIndex] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Saatlik Dinamik Zaman Serisi Eğrileri</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
              {displayData.length} Saatlik Örneklem
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            İspanya şebeke yükü (MW), spot piyasa fiyatı (€/MWh), rüzgar/güneş üretimi ve sıcaklık etkileşimi
          </p>
        </div>

        {/* Series Filter Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(Object.keys(seriesConfig) as SeriesKey[]).map(key => {
            const isSelected = selectedSeries.includes(key);
            const conf = seriesConfig[key];
            return (
              <button
                key={key}
                onClick={() => toggleSeries(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm border'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
                style={{ borderColor: isSelected ? conf.color : undefined }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: conf.color }} />
                <span>{conf.label}</span>
                <span className="text-[10px] text-slate-400">({conf.unit})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Time Series Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[700px] select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + ratio * chartH;
            const leftVal = Math.round(maxLeft - ratio * (maxLeft - minLeft));
            const rightVal = Math.round(maxRight - ratio * (maxRight - minRight));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                {/* Left Y label */}
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {leftVal.toLocaleString('tr-TR')} MW
                </text>
                {/* Right Y label */}
                <text
                  x={width - padding.right + 10}
                  y={y + 4}
                  fill="#10b981"
                  fontSize="10"
                  textAnchor="start"
                  fontFamily="monospace"
                >
                  {rightVal} {rightSeriesKeys.includes('price_actual') ? '€' : '°C'}
                </text>
              </g>
            );
          })}

          {/* Time axis vertical grid & labels */}
          {displayData.map((d, idx) => {
            if (idx % 8 !== 0) return null;
            const x = getX(idx);
            const timeLabel = d.time.split(' ')[1] || d.time.substring(11, 16);
            const dateLabel = d.time.split(' ')[0] || '';
            return (
              <g key={idx}>
                <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={x} y={height - padding.bottom + 16} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {timeLabel}
                </text>
                <text x={x} y={height - padding.bottom + 28} fill="#64748b" fontSize="9" textAnchor="middle">
                  {dateLabel.substring(5)}
                </text>
              </g>
            );
          })}

          {/* Line paths for selected series */}
          {selectedSeries.map(key => (
            <path
              key={key}
              d={makePath(key)}
              fill="none"
              stroke={seriesConfig[key].color}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          ))}

          {/* Outlier Markers on total_load or price */}
          {highlightOutliers &&
            displayData.map((d, idx) => {
              if (!d.is_outlier && !d.is_missing_load && !d.is_missing_price) return null;
              const x = getX(idx);
              const y = getYLeft(d.total_load_actual || 28000);
              return (
                <g key={`outlier-${idx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5.5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                  <text x={x} y={y - 10} fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {d.is_outlier ? 'Aykırı (Outlier)' : 'Eksik Veri'}
                  </text>
                </g>
              );
            })}

          {/* Hover crosshair line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={height - padding.bottom}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Interactive hover overlay rects */}
          {displayData.map((_, idx) => {
            const x = getX(idx);
            const stepW = chartW / Math.max(1, displayData.length);
            return (
              <rect
                key={`hover-rect-${idx}`}
                x={x - stepW / 2}
                y={padding.top}
                width={stepW}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(idx)}
                className="cursor-crosshair"
              />
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredItem && hoveredIndex !== null && (
          <div
            className="absolute top-4 left-24 pointer-events-none bg-slate-950/95 border border-slate-700/80 rounded-lg p-3 text-xs shadow-2xl backdrop-blur-md z-20 min-w-[210px]"
          >
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
              <span>{hoveredItem.time}</span>
              <span className="text-amber-400 font-mono">{hoveredItem.weather_main}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-blue-400">
                <span>Talep (Load):</span>
                <span className="font-mono font-bold">
                  {isNaN(hoveredItem.total_load_actual)
                    ? 'Eksik (NaN)'
                    : `${hoveredItem.total_load_actual.toLocaleString('tr-TR')} MW`}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>Piyasa Fiyatı:</span>
                <span className="font-mono font-bold">
                  {isNaN(hoveredItem.price_actual) ? 'Eksik (NaN)' : `${hoveredItem.price_actual.toFixed(2)} €/MWh`}
                </span>
              </div>
              <div className="flex justify-between items-center text-cyan-400">
                <span>Rüzgar Üretimi:</span>
                <span className="font-mono">{hoveredItem.generation_wind.toLocaleString('tr-TR')} MW</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>Güneş Üretimi:</span>
                <span className="font-mono">{hoveredItem.generation_solar.toLocaleString('tr-TR')} MW</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Madrid Sıcaklık:</span>
                <span className="font-mono">{hoveredItem.temp_madrid} °C</span>
              </div>
              {hoveredItem.is_outlier && (
                <div className="mt-1 pt-1 border-t border-rose-900/50 text-rose-400 text-[11px] font-semibold">
                  ⚠️ Bu saatte şebeke anomalisi / aykırı değer tespit edildi!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Scrubber / Window Slider */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Zaman Penceresi:</span>
          <div className="flex gap-1.5">
            {[48, 72, 120, 200].map(size => (
              <button
                key={size}
                onClick={() => setWindowSize(size)}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  windowSize === size
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {size} Saat ({Math.round(size / 24)} Gün)
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <span className="text-slate-400 whitespace-nowrap">Dönem Kaydır:</span>
          <input
            type="range"
            min={0}
            max={Math.max(0, data.length - windowSize)}
            value={startIndex}
            onChange={e => setStartIndex(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
