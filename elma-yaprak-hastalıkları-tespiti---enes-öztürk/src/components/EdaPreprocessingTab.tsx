import React, { useState } from 'react';
import { 
  BarChart2, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  Sun, 
  Contrast, 
  Grid, 
  Eye, 
  Check, 
  AlertCircle,
  FileCheck2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { CLASSES_DATA, SAMPLE_LEAVES } from '../data/mockData';

export const EdaPreprocessingTab: React.FC = () => {
  // Augmentation playground state
  const [rotation, setRotation] = useState<number>(15);
  const [brightness, setBrightness] = useState<number>(105);
  const [contrastVal, setContrastVal] = useState<number>(110);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [hasCutout, setHasCutout] = useState<boolean>(true);
  const [hasCutMix, setHasCutMix] = useState<boolean>(false);
  const [activeSampleId, setActiveSampleId] = useState<string>('sample_rust');

  const activeSample = SAMPLE_LEAVES.find(s => s.id === activeSampleId) || SAMPLE_LEAVES[0];

  const resetAugmentation = () => {
    setRotation(0);
    setBrightness(100);
    setContrastVal(100);
    setHueRotate(0);
    setHasCutout(false);
    setHasCutMix(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Adım 1 & 2: Veri Okuma, EDA, Eksik Değer & Outlier Analizi
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Kaggle FGVC7 Veri Seti Mimarisi ve Ön İşleme
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Ham elma yaprağı görsellerinin analizi, sınıf dengesizliğinin tespiti ve ders kapsamının ötesinde aykırı değer (outlier) temizliği.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-center">
            <div className="text-slate-400 text-[10px]">Toplam Görsel</div>
            <div className="font-bold text-white text-sm">3,642 Adet</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-center">
            <div className="text-slate-400 text-[10px]">Eksik Değer (NaN)</div>
            <div className="font-bold text-emerald-400 text-sm">0 (Eksiksiz)</div>
          </div>
        </div>
      </div>

      {/* Grid: Dataset Inspection & Imbalance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Class Distribution & Missing Values */}
        <div className="lg:col-span-6 space-y-6">
          {/* Class Distribution Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Eğitim Seti Sınıf Dağılımı (1,821 Görsel)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                Kritik Dengesizlik Uyarısı
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Veri kümesinde <strong>multiple_diseases</strong> sınıfı sadece %5.00 (91 örnek) temsil oranına sahiptir. 
              Bu nedenle standart doğruluk (accuracy) aldatıcıdır ve model azınlık sınıfı görmezden gelebilir.
            </p>

            <div className="space-y-3 pt-2">
              {CLASSES_DATA.map((cls) => (
                <div key={cls.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-200">{cls.name}</span>
                    <span className="text-slate-400 font-mono">
                      <strong>{cls.count}</strong> görsel (%{cls.percent})
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cls.percent * 2.5}%`,
                        backgroundColor: cls.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Çözüm Stratejisi:</strong> Azınlık sınıfı için <strong>Focal Loss</strong>, 
                sınıf ağırlıklı çapraz entropi (Weighted Cross-Entropy) ve sentetik çoğaltma (MixUp/CutMix) uygulanmıştır.
              </span>
            </div>
          </div>

          {/* Missing & Categorical Variables Handling */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Eksik & Kategorik Değişken İncelemesi (train.csv)
            </h3>

            <p className="text-xs text-slate-300">
              Kaggle veri formatında her satır bir <code>image_id</code> ve 4 adet One-Hot sütunundan oluşmaktadır:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
                    <th className="p-2">image_id</th>
                    <th className="p-2 text-emerald-400">healthy</th>
                    <th className="p-2 text-purple-400">multiple_diseases</th>
                    <th className="p-2 text-amber-400">rust</th>
                    <th className="p-2 text-red-400">scab</th>
                    <th className="p-2">Eksik (NaN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-2 text-indigo-300">Train_0</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2 font-bold text-red-400">1</td>
                    <td className="p-2 text-emerald-400">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-indigo-300">Train_1</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2 font-bold text-amber-400">1</td>
                    <td className="p-2">0</td>
                    <td className="p-2 text-emerald-400">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-indigo-300">Train_2</td>
                    <td className="p-2 font-bold text-emerald-400">1</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2 text-emerald-400">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-indigo-300">Train_6</td>
                    <td className="p-2">0</td>
                    <td className="p-2 font-bold text-purple-400">1</td>
                    <td className="p-2">0</td>
                    <td className="p-2">0</td>
                    <td className="p-2 text-emerald-400">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-200 font-semibold">PyTorch Dönüştürme Mantığı:</div>
              <p className="text-slate-400 font-mono text-[11px]">
                train_df['label'] = np.argmax(train_df[['healthy','multiple_diseases','rust','scab']].values, axis=1)
              </p>
              <p className="text-slate-300 text-[11px] mt-1">
                Tek etiketli sınıflandırma için CrossEntropyLoss kullanılabilirken, yarışma olasılık dağılımı için 
                BCEWithLogitsLoss veya Label Smoothing CrossEntropy uygulanmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dersin Ötesinde: Outlier Analizi */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Dersin Ötesinde: Aykırı Değer (Outlier) & Kalite Filtreleme
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                Özel Mühendislik
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Görüntü verilerinde aykırı değerler sayısal tablolardaki gibi basit Z-skoru ile bulunamaz. 
              Enes Öztürk tarafından bu projede <strong>3 farklı bilgisayarlı görü aykırı değer analizi</strong> geliştirilmiştir:
            </p>

            <div className="space-y-3">
              {/* Outlier Type 1 */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">1. Laplacian Varyansı ile Bulanıklık (Blur) Outlier'ları</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">14 Görsel</span>
                </div>
                <p className="text-xs text-slate-400">
                  Rüzgar veya el titremesi sonucu odaklanamamış yapraklar tespit edilir. 
                  <code>Laplacian(img).var() &lt; 100</code> eşiği altındaki aşırı bulanık fotoğraflar etiketlenmiş ve eğitimde ağırlıkları düşürülmüştür.
                </p>
              </div>

              {/* Outlier Type 2 */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400">2. Parlaklık / Kontrast Anomalileri (Işık Parlaması)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">24 Görsel</span>
                </div>
                <p className="text-xs text-slate-400">
                  Açık arazide doğrudan dik güneş ışığının vurduğu ve beyaz doygunluğa (over-exposure) uğramış pikseller 
                  <strong> CLAHE (Contrast Limited Adaptive Histogram Equalization)</strong> ile normalleştirilmiştir.
                </p>
              </div>

              {/* Outlier Type 3 */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-400">3. Arka Plan Kirliliği (Domain Clutter)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">38 Görsel</span>
                </div>
                <p className="text-xs text-slate-400">
                  Yaprak arkasında toprak, insan parmakları veya metal levhalar bulunan görsellerde 
                  modelin arka plana aşırı uymasını (overfitting) engellemek için <strong>RandomResizedCrop</strong> ve <strong>Cutout</strong> kullanılmıştır.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <strong>Sonuç:</strong> Outlier temizliği ve normalizasyon uygulanmadan önceki tekil ResNet-50 modeli 0.932 ROC-AUC alırken, 
              bu ön işleme adımları sonrasında skor <strong>0.958'e</strong> yükselmiştir (+0.026 artış!).
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Augmentation Playground */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              İnteraktif Veri Çoğaltma (Augmentation & Albumentations) Laboratuvarı
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gerçek zamanlı parametreleri değiştirerek modelin eğitim sırasında yaprakları nasıl gördüğünü test edin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Örnek Seç:</span>
            {SAMPLE_LEAVES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSampleId(s.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  activeSampleId === s.id
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.diseaseType.toUpperCase()}
              </button>
            ))}
            <button
              onClick={resetAugmentation}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Sıfırla"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Rotation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  Rastgele Döndürme (Random Rotate)
                </span>
                <span className="font-mono text-emerald-400">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Parlaklık Jitter (Brightness)
                </span>
                <span className="font-mono text-amber-400">%{brightness}</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-indigo-400" />
                  Kontrast Jitter (Contrast)
                </span>
                <span className="font-mono text-indigo-400">%{contrastVal}</span>
              </div>
              <input
                type="range"
                min="60"
                max="160"
                value={contrastVal}
                onChange={(e) => setContrastVal(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Hue Shift */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Renk Tonu Kaydırma (Hue Shift)
                </span>
                <span className="font-mono text-purple-400">{hueRotate}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={hueRotate}
                onChange={(e) => setHueRotate(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Advanced Toggles: Cutout and CutMix */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setHasCutout(!hasCutout)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  hasCutout
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <span>Coarse Dropout (Cutout)</span>
                {hasCutout && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={() => setHasCutMix(!hasCutMix)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  hasCutMix
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <span>CutMix Simülatörü</span>
                {hasCutMix && <Check className="w-4 h-4 text-purple-400" />}
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-slate-700 bg-black/80 flex items-center justify-center shadow-2xl">
              {/* Augmented Image */}
              <div
                className="w-full h-full transition-transform duration-150"
                style={{
                  transform: `rotate(${rotation}deg) scale(0.95)`,
                  filter: `brightness(${brightness}%) contrast(${contrastVal}%) hue-rotate(${hueRotate}deg)`
                }}
              >
                <img
                  src={activeSample.imageUrl}
                  alt={activeSample.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Cutout Holes Overlay */}
              {hasCutout && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-black/90 rounded border border-slate-600/40" />
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-black/90 rounded border border-slate-600/40" />
                </div>
              )}

              {/* CutMix Patch Overlay */}
              {hasCutMix && (
                <div className="absolute top-4 right-4 w-28 h-28 border-2 border-dashed border-purple-400 rounded-lg overflow-hidden bg-purple-950/80 shadow-lg">
                  <div className="text-[9px] bg-purple-600 text-white font-bold px-1 py-0.5">
                    CutMix: Scab Lekesi Eklendi
                  </div>
                  <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-purple-200">
                    Azınlık 'multiple' sınıfını güçlendiren sentetik yama
                  </div>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-slate-700 text-[10px] text-slate-300">
                Augmented: 380x380 px
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Albumentations pipeline'ı ile her epoch'ta yapraklar farklı açılardan gösterilerek aşırı ezberleme (overfitting) engellenir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
