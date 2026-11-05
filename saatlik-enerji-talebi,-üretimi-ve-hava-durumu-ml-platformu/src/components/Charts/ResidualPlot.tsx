import React, { useState } from 'react';
import { ModelEvaluation, TargetVariable } from '../../types/energy';

interface ResidualPlotProps {
  model: ModelEvaluation;
  target: TargetVariable;
}

export const ResidualPlot: React.FC<ResidualPlotProps> = ({ model, target }) => {
  const [viewMode, setViewMode] = useState<'tracking' | 'residuals' | 'histogram'>('tracking');
  const predictions = model.predictions;
  const unit = target === 'total_load_actual' ? 'MW' : '€/MWh';

  const width = 850;
  const height = 280;
  const pad = { top: 20, right: 30, bottom: 40, left: 65 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Actual vs Predicted ranges
  const allVals = predictions.flatMap(p => [p.actual, p.predicted]);
  const minVal = Math.floor(Math.min(...allVals) * 0.95);
  const maxVal = Math.ceil(Math.max(...allVals) * 1.05);

  const getX = (idx: number) => pad.left + (idx / Math.max(1, predictions.length - 1)) * chartW;
  const getY = (val: number) => pad.top + chartH - ((val - minVal) / Math.max(1, maxVal - minVal)) * chartH;

  // Actual path
  let actualPath = '';
  let predPath = '';
  predictions.forEach((p, idx) => {
    const x = getX(idx);
    const yAct = getY(p.actual);
    const yPred = getY(p.predicted);
    if (idx === 0) {
      actualPath += `M ${x} ${yAct}`;
      predPath += `M ${x} ${yPred}`;
    } else {
      actualPath += ` L ${x} ${yAct}`;
      predPath += ` L ${x} ${yPred}`;
    }
  });

  // Residual ranges
  const residuals = predictions.map(p => p.residual);
  const maxAbsRes = Math.max(...residuals.map(r => Math.abs(r))) * 1.1 || 10;
  const getYRes = (res: number) => pad.top + chartH / 2 - (res / maxAbsRes) * (chartH / 2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <span>{model.name}</span>
            {model.isChampion && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                En Yüksek Başarım 🏆
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Test Kümesi Performansı | RMSE: <strong className="text-blue-400">{model.testMetrics.rmse.toLocaleString('tr-TR')} {unit}</strong> | MAPE: <strong className="text-emerald-400">%{model.testMetrics.mape}</strong> | R²: <strong className="text-amber-400">{model.testMetrics.r2}</strong>
          </p>
        </div>

        {/* View toggles */}
        <div className="flex gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('tracking')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              viewMode === 'tracking' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gerçek vs Tahmin Eğrisi
          </button>
          <button
            onClick={() => setViewMode('residuals')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              viewMode === 'residuals' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hata Artıkları (Residuals)
          </button>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[650px] select-none">
          {viewMode === 'tracking' ? (
            <>
              {/* Horizontal Grid */}
              {[0, 0.33, 0.66, 1].map((r, i) => {
                const y = pad.top + r * chartH;
                const v = Math.round(maxVal - r * (maxVal - minVal));
                return (
                  <g key={i}>
                    <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                    <text x={pad.left - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {v.toLocaleString('tr-TR')} {unit}
                    </text>
                  </g>
                );
              })}

              {/* Actual Line (Slate / White) */}
              <path d={actualPath} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
              {/* Predicted Line (Blue / Emerald) */}
              <path d={predPath} fill="none" stroke={model.isChampion ? '#10b981' : '#3b82f6'} strokeWidth="2.5" />

              {/* Data point dots */}
              {predictions.map((p, idx) => {
                if (idx % 4 !== 0) return null;
                const x = getX(idx);
                const yPred = getY(p.predicted);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={yPred}
                    r="3"
                    fill={model.isChampion ? '#10b981' : '#3b82f6'}
                  />
                );
              })}

              {/* X Time Labels */}
              {predictions.map((p, idx) => {
                if (idx % 10 !== 0) return null;
                const x = getX(idx);
                return (
                  <text key={idx} x={x} y={height - 12} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {p.time}
                  </text>
                );
              })}
            </>
          ) : (
            <>
              {/* Residuals Zero Line */}
              <line x1={pad.left} y1={getYRes(0)} x2={width - pad.right} y2={getYRes(0)} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x={pad.left - 8} y={getYRes(0) + 4} fill="#f43f5e" fontSize="10" textAnchor="end" fontWeight="bold">
                0 {unit}
              </text>

              {/* Residual stems & dots */}
              {predictions.map((p, idx) => {
                const x = getX(idx);
                const yZero = getYRes(0);
                const yRes = getYRes(p.residual);
                const isPositive = p.residual >= 0;
                return (
                  <g key={idx}>
                    <line x1={x} y1={yZero} x2={x} y2={yRes} stroke={isPositive ? '#38bdf8' : '#fb7185'} strokeWidth="1.2" opacity="0.75" />
                    <circle cx={x} cy={yRes} r="2.5" fill={isPositive ? '#38bdf8' : '#fb7185'} />
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
            <span className="text-slate-300">Gerçekleşen (Actual)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-500 inline-block" />
            <span className="text-emerald-400 font-medium">Model Tahmini (Predicted)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-400">Ortalama Mutlak Hata (MAE): <strong className="text-white">{model.testMetrics.mae} {unit}</strong></span>
          <span className="text-slate-400">RMSLE: <strong className="text-white">{model.testMetrics.rmsle}</strong></span>
          <span className="text-slate-400">Eğitim Süresi: <strong className="text-amber-400">{model.trainingTimeSec} sn</strong></span>
        </div>
      </div>
    </div>
  );
};
