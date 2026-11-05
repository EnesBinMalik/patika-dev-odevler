import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Zap, 
  BarChart, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpDown, 
  Activity, 
  TrendingUp,
  LineChart,
  Layers,
  HelpCircle
} from 'lucide-react';
import { BENCHMARK_MODELS, AUTHOR_NAME } from '../data/mockData';
import { ModelBenchmark } from '../types/pathology';

export const ModelBenchmarkTab: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('efficientnet_b4');
  const [sortField, setSortField] = useState<keyof ModelBenchmark>('rocAuc');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: keyof ModelBenchmark) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedModels = [...BENCHMARK_MODELS].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const selectedModel = BENCHMARK_MODELS.find(m => m.id === selectedModelId) || BENCHMARK_MODELS[6];

  // Confusion matrix for the best model (EfficientNet-B4)
  const confusionMatrix = [
    { trueLabel: 'Sağlıklı (Healthy)', preds: [102, 0, 1, 0], total: 103, recall: 99.0 },
    { trueLabel: 'Elma Pası (Rust)', preds: [1, 122, 1, 1], total: 125, recall: 97.6 },
    { trueLabel: 'Karaleke (Scab)', preds: [2, 1, 114, 1], total: 118, recall: 96.6 },
    { trueLabel: 'Çoklu Hastalık (Multiple)', preds: [0, 1, 1, 16], total: 18, recall: 88.9 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Adım 5: 8 Farklı Mimari ile Kapsamlı Karşılaştırma & Model Seçimi
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Model Benchmark ve En İyi Mimarinin Belirlenmesi
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            "Olabildiğince fazla model denemek ve metriğimizde en iyi yapanı seçmek" hedefi doğrultusunda eğitilen 8 modelin performansı.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-xs">
            <span className="text-emerald-400 font-bold block text-sm">EfficientNet-B4</span>
            <span className="text-slate-300 font-mono">0.9842 ROC-AUC (En İyi Tekil)</span>
          </div>
        </div>
      </div>

      {/* Benchmark Models Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart className="w-4 h-4 text-emerald-400" />
            Eğitilen Modellerin Performans Tablosu (5-Fold OOF Skorları)
          </h3>
          <span className="text-xs text-slate-400">
            Sütun başlıklarına tıklayarak sıralayabilirsiniz
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 border-b border-slate-800 font-mono">
                <th className="p-3 font-semibold text-slate-300">Model Adı</th>
                <th className="p-3 font-semibold text-slate-300">Mimari Ailesi</th>
                <th className="p-3 font-semibold text-slate-300">Parametre</th>
                <th 
                  onClick={() => handleSort('rocAuc')}
                  className="p-3 font-semibold text-emerald-400 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Mean ROC-AUC ⭐</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('f1Score')}
                  className="p-3 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Macro F1</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('logLoss')}
                  className="p-3 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Log-Loss</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('accuracy')}
                  className="p-3 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Doğruluk (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('inferenceTimeMs')}
                  className="p-3 font-semibold text-slate-300 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Çıkarım (ms)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {sortedModels.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/40 text-emerald-100 font-medium'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      {model.isBest && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span className="font-semibold">{model.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {model.family}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{model.params}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {model.rocAuc.toFixed(4)}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {model.f1Score.toFixed(4)}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {model.logLoss.toFixed(4)}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      %{model.accuracy.toFixed(1)}
                    </td>
                    <td className="p-3 font-mono text-amber-300">
                      {model.inferenceTimeMs} ms
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Specs Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Seçili Model İncelemesi: {selectedModel.name}
            </h3>
            {selectedModel.isBest && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ⭐ En Başarılı
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedModel.notes}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">ROC-AUC Skoru</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {selectedModel.rocAuc.toFixed(4)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">F1 Skoru</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {selectedModel.f1Score.toFixed(4)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">Parametreler</span>
              <span className="text-base font-bold text-indigo-300 font-mono">
                {selectedModel.params}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 block">Gecikme (Latency)</span>
              <span className="text-base font-bold text-amber-300 font-mono">
                {selectedModel.inferenceTimeMs} ms
              </span>
            </div>
          </div>

          {/* Speed vs Accuracy Analysis */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-2 text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Hız / Doğruluk Dengesi (Trade-off Analizi):
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              - <strong>Saha Dağıtımı (Edge / Offline):</strong> MobileNet-V3 sadece 8 ms gecikme ve 5.4M parametre ile çiftçilerin tarlada internet olmadan akıllı telefonlarında çalıştırması için idealdir.<br />
              - <strong>Bulut Sunucusu (Cloud Inference):</strong> EfficientNet-B4 (0.9842 ROC-AUC) en yüksek doğruluk/hesaplama oranıyla üretim hattında standart olarak seçilmiştir.
            </p>
          </div>
        </div>

        {/* Confusion Matrix Card for Winning Model */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Doğrulama Konfüzyon Matrisi (EfficientNet-B4 - Fold 1)
            </h3>
            <span className="text-xs text-slate-400 font-mono">364 Doğrulama Görseli</span>
          </div>

          <p className="text-xs text-slate-300">
            Modelin sınıflar arası karışıklık analizi. Köşegen üzerindeki sayılar doğru tahminleri, satır sonundaki değerler sınıf duyarlılığını (Recall) gösterir:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400">
                  <th className="p-2 text-left">Gerçek \ Tahmin</th>
                  <th className="p-2 text-emerald-400">Sağlıklı</th>
                  <th className="p-2 text-amber-400">Pas</th>
                  <th className="p-2 text-red-400">Karaleke</th>
                  <th className="p-2 text-purple-400">Çoklu</th>
                  <th className="p-2 text-slate-300">Recall (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {confusionMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-left font-sans text-slate-300 text-[11px]">
                      {row.trueLabel}
                    </td>
                    {row.preds.map((predVal, colIdx) => {
                      const isDiagonal = idx === colIdx;
                      return (
                        <td
                          key={colIdx}
                          className={`p-2 font-bold ${
                            isDiagonal
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : predVal > 0
                              ? 'bg-red-500/10 text-red-400'
                              : 'text-slate-600'
                          }`}
                        >
                          {predVal}
                        </td>
                      );
                    })}
                    <td className="p-2 font-bold text-emerald-400">
                      %{row.recall.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
            <strong>Analiz:</strong> Sağlıklı yapraklar %99.0 duyarlılıkla neredeyse kusursuz ayrışırken; 
            en çok zorlanılan durum beklendiği üzere <em>çoklu hastalık</em> ile <em>karaleke</em> arasındaki örtüşmedir (Recall: %88.9).
          </div>
        </div>
      </div>

      {/* Model Selection Conclusion by Enes Öztürk */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <Sparkles className="w-4 h-4" />
          Enes Öztürk'ün Model Seçim Kararı ve Mühendislik Raporu:
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          "Kaggle Plant Pathology yarışması verisinde yaptığımız deneyler sonucunda; <strong>EfficientNet-B4</strong> mimarisi, 
          bileşik ölçekleme katsayısı (compound coefficient) sayesinde 380x380 çözünürlükte elma yaprağı üzerindeki mikroskobik 
          pas püstülleri ile karaleke dokularını en yüksek duyarlılıkla ayrıştırmıştır (0.9842 ROC-AUC). 
          Yarışma seviyesinde en tepe skora ulaşmak için ise 5-Fold modelleri <strong>EfficientNet-B4 + ViT-Base + DenseNet-121</strong> 
          ağırlıklı harmanlama (Weighted Blending) ile birleştirilerek nihai <strong>0.9891 Mean ROC-AUC</strong> skoruna erişilmiştir."
        </p>
      </div>
    </div>
  );
};
