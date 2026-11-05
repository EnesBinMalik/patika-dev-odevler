import React, { useState } from 'react';
import { 
  Microscope, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Layers, 
  Pill, 
  Calendar, 
  Sliders, 
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { SAMPLE_LEAVES, CLASSES_DATA } from '../data/mockData';
import { DiagnosisResult, SampleLeafImage } from '../types/pathology';

export const LiveDiagnosisTab: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SampleLeafImage>(SAMPLE_LEAVES[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [gradCamOpacity, setGradCamOpacity] = useState<number>(65);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>({
    primaryDiagnosis: 'rust',
    turkishDiagnosis: 'Elma Memeli Pası (Cedar Apple Rust)',
    pathogen: 'Gymnosporangium juniperi-virginianae',
    confidenceScores: { healthy: 0.012, rust: 0.968, scab: 0.015, multiple_diseases: 0.005 },
    visualFindings: [
      'Yaprak üst yüzeyinde belirgin dairesel turuncu-sarı aecial püstüller',
      'Lezyon merkezinde koyu spermagonyum noktaları',
      'Klorofil kaybı ve lezyon çevresinde hafif klorotik hale'
    ],
    diseaseSeverityPercent: 34,
    pathologyAnalysis: 'Bu mantari hastalık kışı ardıç ağaçlarında geçirir ve ilkbaharda elma yapraklarına spor saçar. Dokularda hücre nekrozu başlatmış ve fotosentetik yüzeyi daraltmıştır.',
    treatmentRecommendations: {
      chemical: ['Mankozeb veya Kaptan etken maddeli koruyucu fungisitler', 'Tebuconazole veya Difenoconazole sistemik preparatlar'],
      cultural: ['Bahçe etrafındaki 1 km çapındaki ardıç (Juniperus virginiana) konukçularını temizleyin', 'Düşen enfekte yaprakları toplayıp imha edin'],
      timing: 'Pembe tomurcuk ve taç yaprakların döküldüğü kritik fenolojik evrede uygulama yapınız.'
    },
    gradCamHotspots: [
      { x: 42, y: 38, radius: 18, intensity: 0.94, label: 'Primer Pas Püstülü' },
      { x: 67, y: 54, radius: 14, intensity: 0.88, label: 'Sekonder Lezyon Odağı' },
      { x: 28, y: 62, radius: 12, intensity: 0.76, label: 'Klorotik Hale' }
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiagnosis = async () => {
    setIsLoading(true);
    try {
      const payload: any = {};
      if (customImageBase64) {
        payload.imageBase64 = customImageBase64;
      } else {
        payload.sampleId = selectedSample.diseaseType;
      }

      const response = await fetch('/api/diagnose-leaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
      }
    } catch (err) {
      console.error('Diagnosis request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeImageSrc = customImageBase64 || selectedSample.imageUrl;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Microscope className="w-3.5 h-3.5" />
            İnteraktif Çıkarım & Açıklanabilir Yapay Zeka (XAI)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Canlı Yaprak Tanı ve Grad-CAM Isı Haritası Laboratuvarı
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Test görseli seçin veya kendi yaprak fotoğrafınızı yükleyin; modelin lezyonları nasıl tespit ettiğini Grad-CAM ile inceleyin.
          </p>
        </div>

        <button
          onClick={runDiagnosis}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs md:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Teşhis Yapılıyor...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Modeli Çalıştır & Teşhis Et</span>
            </>
          )}
        </button>
      </div>

      {/* Main Diagnosis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Viewer + Grad-CAM Canvas + Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Sample Selector Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Kaggle Test Numunesi Seç:</span>
              <label className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Fotoğraf Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_LEAVES.map((sample) => {
                const isSelected = !customImageBase64 && selectedSample.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setCustomImageBase64(null);
                      setSelectedSample(sample);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{sample.diseaseType.toUpperCase()}</div>
                    <div className="text-[9px] text-slate-400 truncate">{sample.tag}</div>
                  </button>
                );
              })}
            </div>
            {customImageBase64 && (
              <div className="text-[11px] text-emerald-400 flex items-center justify-between pt-1">
                <span>Özel kullanıcı görseli yüklendi.</span>
                <button
                  onClick={() => setCustomImageBase64(null)}
                  className="text-red-400 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            )}
          </div>

          {/* Leaf Visual & Grad-CAM Heatmap Layer */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black/90 aspect-square flex items-center justify-center shadow-2xl">
            {/* Base Leaf Image */}
            <img
              src={activeImageSrc}
              alt="Leaf for Diagnosis"
              className="w-full h-full object-contain"
            />

            {/* Grad-CAM Heatmap Overlay Layer */}
            {diagnosis && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{ opacity: gradCamOpacity / 100 }}
              >
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="gradcamSpot" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.95" />
                      <stop offset="35%" stop-color="#f97316" stop-opacity="0.8" />
                      <stop offset="65%" stop-color="#eab308" stop-opacity="0.5" />
                      <stop offset="90%" stop-color="#3b82f6" stop-opacity="0.2" />
                      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Render neural network attention hotspots */}
                  {diagnosis.gradCamHotspots.map((spot, idx) => (
                    <circle
                      key={idx}
                      cx={spot.x}
                      cy={spot.y}
                      r={spot.radius}
                      fill="url(#gradcamSpot)"
                    />
                  ))}
                </svg>

                {/* Hotspot Annotation Badges */}
                {diagnosis.gradCamHotspots.map((spot, idx) => (
                  <div
                    key={idx}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-black/80 border border-amber-400 text-[10px] text-amber-300 font-mono shadow pointer-events-auto"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    {spot.label}
                  </div>
                ))}
              </div>
            )}

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-slate-700 text-[10px] text-slate-300">
              Input: 380x380 px | ResNet / EfficientNet-B4
            </div>

            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Grad-CAM Şeffaflığı:</span>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradCamOpacity}
                  onChange={(e) => setGradCamOpacity(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs text-emerald-400 w-8 text-right">
                  %{gradCamOpacity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Output, Probabilities & Expert Agronomic Advice */}
        <div className="lg:col-span-6 space-y-4">
          {diagnosis ? (
            <>
              {/* Primary Diagnosis Header */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                    Tahmin Edilen Sınıf: {diagnosis.primaryDiagnosis}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Hasar Şiddeti:</span>
                    <strong className="text-amber-400 font-mono">
                      %{diagnosis.diseaseSeverityPercent}
                    </strong>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {diagnosis.turkishDiagnosis}
                </h3>
                <p className="text-xs font-mono text-emerald-400">
                  Etmen: {diagnosis.pathogen}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {diagnosis.pathologyAnalysis}
                </p>
              </div>

              {/* 4-Class Probability Distribution */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Model Olasılık Dağılımı (Softmax / Multi-Class)
                </h4>

                <div className="space-y-2.5 pt-1">
                  {CLASSES_DATA.map((cls) => {
                    const prob = diagnosis.confidenceScores[cls.id] || 0;
                    const percentVal = (prob * 100).toFixed(1);
                    return (
                      <div key={cls.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{cls.name}</span>
                          <span className="font-mono font-bold" style={{ color: cls.color }}>
                            %{percentVal}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentVal}%`,
                              backgroundColor: cls.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual Findings & Features Detected */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  Konvolüsyonel Özellik Haritası Bulguları
                </h4>
                <div className="space-y-1.5 pt-1">
                  {diagnosis.visualFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agronomic Recommendations (Chemical Misuse Prevention) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  Zirai Mücadele ve Doğru İlaçlama Reçetesi
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Tavsiye Edilen Etken Maddeler:</span>
                    <ul className="list-disc list-inside text-slate-300 mt-0.5 space-y-0.5">
                      {diagnosis.treatmentRecommendations.chemical.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block">Kültürel Önlemler:</span>
                    <ul className="list-disc list-inside text-slate-300 mt-0.5 space-y-0.5">
                      {diagnosis.treatmentRecommendations.cultural.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span><strong>Uygulama Zamanı:</strong> {diagnosis.treatmentRecommendations.timing}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 space-y-3">
              <Microscope className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Teşhis başlatmak için "Modeli Çalıştır" butonuna tıklayınız.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
