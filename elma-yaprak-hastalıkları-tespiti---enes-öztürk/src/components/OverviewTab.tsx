import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  FlaskConical, 
  TrendingDown, 
  Eye, 
  Cpu, 
  ShieldAlert, 
  Activity,
  Layers
} from 'lucide-react';
import { CLASSES_DATA, AUTHOR_NAME, KAGGLE_COMPETITION_URL } from '../data/mockData';

export const OverviewTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Problem Statement Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Tarımsal Kriz & Fitopatolojik Motivasyon
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Neden Elma Ağacı Yaprak Hastalıklarının Otomatik Tespiti Hayatidir?
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Tarımsal ürünleri etkileyen birçok fungal hastalığın <strong>yanlış teşhisi</strong>, çiftçileri gereksiz ya da 
            yanlış spektrumlu kimyasal fungisit kullanımına sevk eder. Bu durum sadece yüksek girdi maliyeti yaratmakla kalmaz; 
            aynı zamanda <strong>dirençli patojen türlerin (resistant strains)</strong> evrimleşmesine yol açarak tedavisi imkansız 
            yeni salgınları tetikler ve yer altı sularında kalıcı kimyasal kirlilik oluşturur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Ekonomik & Verim Kaybı</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Kontrolsüz karaleke veya pas salgınları, elma bahçelerinde rekolteyi %70'e varan oranlarda düşürür ve meyveyi satılamaz hale getirir.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Dirençli Patojenler</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Yanlış fungisit dozajı ve zamanlaması, <em>Venturia inaequalis</em> mantarının etken maddelere karşı bağışıklık kazanmasına yol açar.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">İnsan Gözünün Kısıtları</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Geniş bahçelerde yaprakların tek tek taranması zaman alıcı, pahalıdır ve ışık koşulları veya yaprak yaşı semptomları gizleyebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kaggle FGVC7 Challenge & Project Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Proje Metodolojisi & Uygulanan Adımlar
            </h3>
            <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              Enes Öztürk İmzalı
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-300">
            Kaggle'ın saygın <strong>Plant Pathology 2020 - FGVC7</strong> (Fine-Grained Visual Categorization) yarışması verisi temel alınarak, 
            derste işlenen temel konuların ötesinde modern bilgisayarlı görü teknikleri uygulanmıştır:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Veri İndirme, Okuma & Yapılandırma</h4>
                <p className="text-xs text-slate-400">1,821 eğitim ve 1,821 test görseli indirilerek one-hot formatından çok sınıflı modele dönüştürüldü.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Eksik Değer, Outlier & İleri Augmentasyon (Dersin Ötesinde)</h4>
                <p className="text-xs text-slate-400">Laplacian varyansı ile bulanık fotoğraflar tespit edildi, CutMix ve Color Jitter ile veri çoğaltıldı.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Error Metriği: Mean ROC-AUC Seçimi</h4>
                <p className="text-xs text-slate-400">%5'lik aşırı dengesiz "multiple_diseases" sınıfı için standart Accuracy yerine eşik bağımsız Mean Column-Wise ROC-AUC seçildi.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Stratified 5-Fold Cross Validation</h4>
                <p className="text-xs text-slate-400">Veri sızıntısını önlemek ve her fold'da azınlık sınıflarının eşit temsilini sağlamak için Stratified K-Fold kurgulandı.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">5</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">8 Farklı Mimari ile Kapsamlı Benchmark & Ensemble</h4>
                <p className="text-xs text-slate-400">Baseline CNN'den ViT ve EfficientNet-B4'e kadar 8 model test edilerek 0.9891 ROC-AUC değerine ulaşıldı.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Author & Specs Panel */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                EÖ
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{AUTHOR_NAME}</h4>
                <p className="text-xs text-emerald-300">Makine Öğrenmesi & Bilgisayarlı Görü</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Veri Seti:</span>
                <span className="text-slate-200 font-medium">Kaggle FGVC7</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Toplam Örnek:</span>
                <span className="text-slate-200 font-medium">3,642 Görsel (1821 Train / 1821 Test)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Orijinal Çözünürlük:</span>
                <span className="text-slate-200 font-medium">2048 x 1365 piksel</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Optimal Giriş Boyutu:</span>
                <span className="text-slate-200 font-medium">380 x 380 (EfficientNet-B4)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Kullanılan Donanım:</span>
                <span className="text-slate-200 font-medium">Tesla P100 / T4 GPU</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Cpu className="w-4 h-4" />
              Saha Dağıtımı & Mobil Uygulanabilirlik
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Model sadece sunucuda değil, sahada çiftçilerin offline kullanabileceği 
              <strong> MobileNet-V3</strong> kuantize versiyonuyla da optimize edilmiştir (8 ms çıkarım).
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pathology Classes Deep Dive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              Sınıflandırılan 4 Temel Durum ve Fitopatolojik Belirtiler
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kaggle Plant Pathology 2020 veri kümesindeki 4 sınıfın morfolojik ve biyolojik anatomisi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLASSES_DATA.map((cls) => (
            <div
              key={cls.id}
              className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              style={{ borderTopColor: cls.color, borderTopWidth: 3 }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${cls.color}20`, color: cls.color }}
                  >
                    %{cls.percent} ({cls.count} Adet)
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    {cls.id}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{cls.name}</h4>
                <p className="text-xs text-slate-400 italic font-mono">{cls.scientificName}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{cls.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Karakteristik Bulgular:</span>
                {cls.typicalSymptoms.map((sym, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{sym}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
