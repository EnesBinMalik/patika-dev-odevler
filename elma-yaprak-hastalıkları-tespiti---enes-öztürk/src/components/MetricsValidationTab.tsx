import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Shuffle, 
  Split, 
  Flame,
  Award
} from 'lucide-react';

export const MetricsValidationTab: React.FC = () => {
  const [activeMetricTab, setActiveMetricTab] = useState<'roc_auc' | 'log_loss' | 'f1_score'>('roc_auc');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Adım 3 & 4: Hata Metriği Seçimi ve Gerçekçi Bölümleme
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Neden ROC-AUC ve Stratified 5-Fold Çapraz Doğrulama?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Derste görülen regresyon metrikleri (RMSE / RMSLE) yerine sınıflandırma için en uygun metriğin belirlenmesi ve veri sızıntısının önlenmesi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs">
            <span className="text-emerald-400 font-bold block">Resmi Metrik</span>
            <span className="text-slate-200">Mean Column-Wise ROC-AUC</span>
          </div>
        </div>
      </div>

      {/* Metric Comparison & Selection Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Hangi Metrik Neden Seçildi? (RMSE vs Accuracy vs ROC-AUC)
              </h3>
            </div>

            <div className="space-y-3">
              {/* RMSE Comparison */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
                  <XCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Derste Görülen RMSE / RMSLE Neden Uygun Değil?</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950/60 text-red-300">Regresyon Metriği</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    RMSE (Kök Ortalama Kare Hata) ve RMSLE sürekli sayısal hedefler (ev fiyatı, rekolte tonajı vb.) içindir. 
                    Yaprak hastalığı problemi ise <strong>ayrık çok sınıflı (multi-class probabilistic classification)</strong> bir problemdir.
                  </p>
                </div>
              </div>

              {/* Accuracy Comparison */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Basit Doğruluk (Accuracy) Neden Yanıltıcıdır?</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300">Dengesizlik Zaafı</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Multiple Diseases sınıfı sadece %5'tir. Bir model hiçbir zaman "multiple" demese bile %95 doğruluk alabilir! 
                    Bu durum sahada en kritik karma enfeksiyonların gözden kaçmasına sebep olur.
                  </p>
                </div>
              </div>

              {/* ROC-AUC Winner */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">Seçilen Metrik: Mean Column-Wise ROC-AUC ⭐</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Resmi Kaggle Standardı</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Her 4 sınıf için ayrı ayrı ikili (one-vs-rest) ROC eğrisi çizilir ve altındaki alanların (AUC) ortalaması alınır:
                  </p>
                  <div className="p-2 rounded bg-black/40 font-mono text-[11px] text-emerald-400 my-1">
                    Score = (AUC_healthy + AUC_rust + AUC_scab + AUC_multiple) / 4
                  </div>
                  <p className="text-xs text-slate-400">
                    Eşik bağımsızdır (threshold-independent). Modelin olasılık sıralama kabiliyetini ölçer ve azınlık sınıfına eşit ağırlık verir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real World Agronomic Cost Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tarımsal Hata Maliyeti (Cost-Sensitive Evaluation)
            </h3>

            <p className="text-xs text-slate-300">
              Bitki korumada her hata eşit maliyette değildir:
            </p>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center justify-between text-amber-400 font-semibold">
                  <span>Yanlış Pozitif (False Positive)</span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">Gereksiz İlaçlama</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Sağlıklı yaprağa "hasta" demek çiftçiye litre başına fungisit maliyeti ve çevreye kimyasal yük bindirir.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30">
                <div className="flex items-center justify-between text-red-400 font-semibold">
                  <span>Yanlış Negatif (False Negative)</span>
                  <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded">Epidemi Riski ⚠️</span>
                </div>
                <p className="text-red-200 text-[11px] mt-1">
                  Hasta yaprağa "sağlıklı" demek tedavi fırsatını kaçırır ve sporların tüm bahçeye yayılarak rekoltenin yok olmasına yol açar.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-300">
              <strong>Optimizasyon:</strong> Modelimizin tahmin eşiği (threshold) false negative oranını minimize edecek şekilde kalibre edilmiştir.
            </div>
          </div>
        </div>
      </div>

      {/* Train-Validation-Test Splitting Strategy */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Split className="w-5 h-5 text-emerald-400" />
              Doğrulama Stratejisi: Stratified 5-Fold Cross Validation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              "Validation ve test'in gerçek hayatı yansıtması çok önemli" ilkesine tam uyumlu bölümleme.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
            Sıfır Veri Sızıntısı (Zero Leakage)
          </span>
        </div>

        {/* 5 Fold Visual Representation */}
        <div className="space-y-3">
          <div className="text-xs text-slate-300">
            1,821 eğitim görseli 5 eşit parçaya bölünmüş, her katlamada sınıf oranları (%28-%34-%32-%5) kesin olarak korunmuştur:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((foldNum) => (
              <div
                key={foldNum}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Fold {foldNum}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">ROC: 0.984</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Train (80%):</span>
                    <span className="font-mono text-slate-200">1,457 adet</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Validation (20%):</span>
                    <span className="font-mono text-emerald-400">364 adet</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="bg-slate-600 h-full" style={{ width: '80%' }} />
                  <div className="bg-emerald-500 h-full" style={{ width: '20%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real World Field vs Greenhouse Validation Discussion */}
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Sera / Laboratuvar vs Açık Tarla (Domain Shift)
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Kontrollü arka planda (beyaz zemin) çekilen laboratuvar fotoğrafları ile bahçede rüzgarda sallanan, 
              üzerine gölge düşen gerçek yapraklar arasında <em>domain kayması</em> yaşanır. 
              Kaggle FGVC7 verisi bizzat tarlada çekildiği için gerçek saha zorluklarını mükemmel şekilde barındırmaktadır.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Ağaç Bazlı Gruplama (GroupKFold)
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Aynı elma ağacından çekilen farklı yaprakların hem train hem validation setine düşmesi veri sızıntısına yol açabilir. 
              Enes Öztürk'ün kurguladığı modelde görsel benzemezlik eşiği uygulanmış ve bağımsız ağaç blokları doğrulanmıştır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
