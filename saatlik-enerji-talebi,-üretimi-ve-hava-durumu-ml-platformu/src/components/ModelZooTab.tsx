import React, { useState } from 'react';
import { ModelEvaluation, TargetVariable } from '../types/energy';
import { ResidualPlot } from './Charts/ResidualPlot';
import { Trophy, Zap, Clock, ArrowUpDown, ChevronRight } from 'lucide-react';

interface ModelZooTabProps {
  models: ModelEvaluation[];
  target: TargetVariable;
}

type SortField = 'testRMSE' | 'testMAE' | 'testRMSLE' | 'testMAPE' | 'r2' | 'trainingTime';

export const ModelZooTab: React.FC<ModelZooTabProps> = ({ models, target }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    models.find(m => m.isChampion)?.id || models[0]?.id || ''
  );
  const [sortField, setSortField] = useState<SortField>('testRMSE');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];
  const championModel = models.find(m => m.isChampion) || models[0];

  const unit = target === 'total_load_actual' ? 'MW' : '€/MWh';

  // Sort logic
  const sortedModels = [...models].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'testRMSE') { valA = a.testMetrics.rmse; valB = b.testMetrics.rmse; }
    else if (sortField === 'testMAE') { valA = a.testMetrics.mae; valB = b.testMetrics.mae; }
    else if (sortField === 'testRMSLE') { valA = a.testMetrics.rmsle; valB = b.testMetrics.rmsle; }
    else if (sortField === 'testMAPE') { valA = a.testMetrics.mape; valB = b.testMetrics.mape; }
    else if (sortField === 'r2') { valA = a.testMetrics.r2; valB = b.testMetrics.r2; }
    else if (sortField === 'trainingTime') { valA = a.trainingTimeSec; valB = b.trainingTimeSec; }

    if (sortField === 'r2') {
      return sortAsc ? valA - valB : valB - valA; // for R2 higher is better
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'r2'); // default ascending for errors, descending for R2
    }
  };

  return (
    <div className="space-y-6">
      {/* Champion Model Banner with Signature */}
      <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-purple-950/90 border border-blue-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Enes Öztürk İmzalı Şampiyon Model</span>
              </span>
              <span className="text-xs text-blue-300">
                Test Kümesi En Düşük RMSE & MAPE Şampiyonu
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{championModel.name}</span>
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {championModel.description}
            </p>
          </div>

          {/* Quick Metrics of Champion */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase">Test RMSE</span>
              <span className="text-lg font-black text-blue-400 font-mono">
                {championModel.testMetrics.rmse.toLocaleString('tr-TR')}
              </span>
              <span className="text-[10px] text-slate-400 block">{unit}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase">Test MAPE</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                %{championModel.testMetrics.mape}
              </span>
              <span className="text-[10px] text-slate-400 block">Hata Oranı</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-lg text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase">R² Skoru</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {championModel.testMetrics.r2}
              </span>
              <span className="text-[10px] text-slate-400 block">Açıklanan Varyans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Zoo Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Model Kıyaslama Liderlik Tablosu (Leaderboard)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              6 farklı algoritmanın 2018 test kümesi üzerindeki tüm hata metrikleri karşılaştırması
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sütun başlıklarına tıklayarak sıralayabilirsiniz</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="p-3">Model</th>
                <th className="p-3">Aile</th>
                <th
                  onClick={() => handleSort('testRMSE')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-bold text-blue-300">
                    <span>Test RMSE ({unit})</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('testMAE')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Test MAE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('testRMSLE')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Test RMSLE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('testMAPE')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-bold text-emerald-300">
                    <span>Test MAPE (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('r2')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <span>R² Skoru</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('trainingTime')}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Eğitim (sn)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedModels.map(model => {
                const isSelected = model.id === selectedModelId;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-950/40 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 font-sans font-medium text-white flex items-center gap-2">
                      {model.isChampion && (
                        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span>{model.name}</span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {model.family}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-blue-400">
                      {model.testMetrics.rmse.toLocaleString('tr-TR')}
                    </td>
                    <td className="p-3 text-slate-300">
                      {model.testMetrics.mae.toLocaleString('tr-TR')}
                    </td>
                    <td className="p-3 text-purple-300">{model.testMetrics.rmsle}</td>
                    <td className="p-3 font-bold text-emerald-400">
                      %{model.testMetrics.mape}
                    </td>
                    <td className="p-3 font-bold text-amber-400">
                      {model.testMetrics.r2}
                    </td>
                    <td className="p-3 text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{model.trainingTimeSec}</span>
                    </td>
                    <td className="p-3 font-sans text-right">
                      <span className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]">
                        <span>Grafik</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive: Residual Chart & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Residual & Tracking Plot (2 Cols) */}
        <div className="lg:col-span-2">
          <ResidualPlot model={selectedModel} target={target} />
        </div>

        {/* Right: Feature Importance & Hyperparameters (1 Col) */}
        <div className="space-y-6">
          {/* Feature Importance (SHAP / Gini) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <span>Özellik Önem Düzeyleri (Feature Importance)</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {selectedModel.name} modelinin tahmin üretirken en çok ağırlık verdiği değişkenler
            </p>

            <div className="space-y-3 text-xs">
              {selectedModel.featureImportance.map((fi, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-medium truncate max-w-[200px]" title={fi.feature}>
                      {fi.feature}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      %{(fi.importance * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${fi.importance * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperparameters Config */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-2">
              Model Hiperparametreleri
            </h4>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
              {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-300 border-b border-slate-900 pb-1">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-blue-300 font-semibold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
