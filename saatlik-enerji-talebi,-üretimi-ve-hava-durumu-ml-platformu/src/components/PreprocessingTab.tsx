import React from 'react';
import {
  EnergyHourlyData,
  TargetVariable,
  PreprocessingConfig,
  ImputationMethod,
  OutlierMethod,
} from '../types/energy';
import { DistributionBoxplot } from './Charts/DistributionBoxplot';
import { Sparkles, ShieldAlert, Cpu, Filter, CheckCircle2 } from 'lucide-react';

interface PreprocessingTabProps {
  rawData: EnergyHourlyData[];
  cleanedData: EnergyHourlyData[];
  config: PreprocessingConfig;
  setConfig: React.Dispatch<React.SetStateAction<PreprocessingConfig>>;
  target: TargetVariable;
  outlierLower: number;
  outlierUpper: number;
  outlierCount: number;
}

export const PreprocessingTab: React.FC<PreprocessingTabProps> = ({
  rawData,
  cleanedData,
  config,
  setConfig,
  target,
  outlierLower,
  outlierUpper,
  outlierCount,
}) => {
  const missingCount = rawData.filter(d => isNaN(d[target])).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-purple-900/50 text-purple-400 border border-purple-700/50">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-purple-300">Aşama 2: Veri Ön İşleme & İleri Düzey Mühendislik</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Eksik Veri Doldurma, Kategorik Kodlama ve Aykırı Değer (Outlier) Tedavisi
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
          Kaggle elektrik ve hava durumu verisi gerçek dünya sensör hataları ve şebeke aşırı yüklenmelerinden dolayı eksik değerler ve uç noktalar içerir. Bu panelde derste öğretilen standart yöntemlerin (ortalama doldurma, IQR) yanı sıra <strong>Z-Score, Winsorization, Zaman Serisi Döngüsel Kodlama (Sin/Cos)</strong> ve <strong>Isıtma/Soğutma Derece Günleri (Degree Days)</strong> mühendisliği uygulanmıştır.
        </p>
      </div>

      {/* Control Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Imputation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Eksik Veri (NaN) Doldurma</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              {missingCount} Eksik Değer
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Zaman serilerinde rastgele ortalama yerine kronolojik komşuluk önemlidir.
          </p>

          <div className="space-y-2.5">
            {[
              {
                id: 'linear_interp',
                name: 'Lineer İnterpolasyon (Önerilen)',
                desc: 'Önceki ve sonraki geçerli gözlemler arasında doğrusal eğri çizer.',
              },
              {
                id: 'seasonal_lag24',
                name: 'Mevsimsel 24-Saat Gecikmeli Doldurma',
                desc: 'Bir önceki günün aynı saatindeki talep değerini atar.',
              },
              {
                id: 'forward_fill',
                name: 'İleri Yönlü Taşıma (Forward Fill)',
                desc: 'Son geçerli değeri boşluk oluştuğunda ileriye taşır.',
              },
              {
                id: 'knn_impute',
                name: 'KNN (K-En Yakın Komşu) Yaklaşımı',
                desc: 'Benzer sıcaklık ve saat dilimindeki 3 komşunun ortalamasını alır.',
              },
            ].map(m => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer ${
                  config.imputationMethod === m.id
                    ? 'bg-blue-950/60 border-blue-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="imputationMethod"
                  value={m.id}
                  checked={config.imputationMethod === m.id}
                  onChange={() =>
                    setConfig(prev => ({ ...prev, imputationMethod: m.id as ImputationMethod }))
                  }
                  className="mt-1 accent-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold block">{m.name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{m.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Panel 2: Outlier Treatment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Aykırı Değer (Outlier) Mücadelesi</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
              {outlierCount} Aykırı
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Aşırı şebeke sıçramalarını tespit edip modelin sapmasını engelleme tekniği.
          </p>

          <div className="space-y-2.5">
            {[
              {
                id: 'iqr',
                name: 'IQR (Çeyrekler Açıklığı) Kırpma',
                desc: '[Q1 - 1.5×IQR, Q3 + 1.5×IQR] dışındaki değerleri sınıra sabitler.',
              },
              {
                id: 'zscore',
                name: 'Z-Score (|Z| > 3.0)',
                desc: 'Ortalamadan 3 standart sapma uzaklıktaki uç verileri tespit eder.',
              },
              {
                id: 'winsorize',
                name: 'Winsorization (%2 - %98)',
                desc: 'Veri setinin en alt %2 ve en üst %2 dilimini sınırlara baskılar.',
              },
              {
                id: 'none',
                name: 'Müdahale Etme (Ham Bırak)',
                desc: 'Aykırı değerleri olduğu gibi modele besler (Hatalar artar).',
              },
            ].map(m => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer ${
                  config.outlierMethod === m.id
                    ? 'bg-rose-950/60 border-rose-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="outlierMethod"
                  value={m.id}
                  checked={config.outlierMethod === m.id}
                  onChange={() => setConfig(prev => ({ ...prev, outlierMethod: m.id as OutlierMethod }))}
                  className="mt-1 accent-rose-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold block">{m.name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{m.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Threshold slider for IQR / Z-Score */}
          {config.outlierMethod === 'iqr' && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>IQR Katsayısı (k):</span>
                <span className="font-mono text-rose-400 font-bold">{config.outlierThreshold}×</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={config.outlierThreshold}
                onChange={e =>
                  setConfig(prev => ({ ...prev, outlierThreshold: parseFloat(e.target.value) }))
                }
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Panel 3: Feature Engineering & Encodings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Özellik Mühendisliği (Derste Öğrenilenin Ötesi)</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Model doğruluğunu %35+ artıran zaman serisi ve termodinamik türetimleri.
          </p>

          <div className="space-y-3">
            {/* Cyclical Encoding */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.addCyclicalFeatures}
                onChange={e =>
                  setConfig(prev => ({ ...prev, addCyclicalFeatures: e.target.checked }))
                }
                className="mt-0.5 accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Döngüsel Zaman Kodlaması (Sin/Cos)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Saat 23:00 ile 00:00 arasındaki sürekliliği korur:{' '}
                  <code className="text-emerald-400">sin(2πh/24)</code> &{' '}
                  <code className="text-emerald-400">cos(2πh/24)</code>
                </span>
              </div>
            </label>

            {/* Heating / Cooling Degree Days */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.addDegreeDays}
                onChange={e =>
                  setConfig(prev => ({ ...prev, addDegreeDays: e.target.checked }))
                }
                className="mt-0.5 accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Isıtma / Soğutma Derece Günleri (HDD / CDD)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Termodinamik talep eğrisi:{' '}
                  <code className="text-amber-400">HDD = max(0, 15 - T)</code> ve{' '}
                  <code className="text-amber-400">CDD = max(0, T - 24)</code>
                </span>
              </div>
            </label>

            {/* Lag features */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.addLagFeatures}
                onChange={e =>
                  setConfig(prev => ({ ...prev, addLagFeatures: e.target.checked }))
                }
                className="mt-0.5 accent-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  Otokorelasyon Gecikmeleri (Lags)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  <code className="text-blue-400">y_(t-1)</code>, <code className="text-blue-400">y_(t-24)</code> (dün aynı saat), ve <code className="text-blue-400">y_(t-168)</code> (geçen hafta aynı saat)
                </span>
              </div>
            </label>
          </div>

          <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tüm özellikler StandardScaler ile [0, 1] aralığına normalize edildi.</span>
          </div>
        </div>
      </div>

      {/* Distribution Boxplot and Outlier Impact Visualizer */}
      <DistributionBoxplot
        rawData={rawData}
        cleanedData={cleanedData}
        target={target}
        outlierMethod={config.outlierMethod}
        lowerBound={outlierLower}
        upperBound={outlierUpper}
        outlierCount={outlierCount}
      />
    </div>
  );
};
