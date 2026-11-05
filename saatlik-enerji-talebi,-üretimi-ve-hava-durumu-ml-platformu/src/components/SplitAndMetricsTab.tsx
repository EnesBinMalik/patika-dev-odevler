import React from 'react';
import { PreprocessingConfig, TargetVariable } from '../types/energy';
import { Calendar, AlertTriangle, CheckCircle, BarChart3, HelpCircle, Layers } from 'lucide-react';

interface SplitAndMetricsTabProps {
  config: PreprocessingConfig;
  setConfig: React.Dispatch<React.SetStateAction<PreprocessingConfig>>;
  target: TargetVariable;
}

export const SplitAndMetricsTab: React.FC<SplitAndMetricsTabProps> = ({
  config,
  setConfig,
  target,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-amber-900/50 text-amber-400 border border-amber-700/50">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-amber-300">Aşama 3: Doğru Bölme & Metrik Seçimi</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Train - Validation - Test Ayrımı ve Hata Metriği Karar Süreci
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
          Zaman serisi problemlerinde rastgele karıştırma (random shuffle) yapmak modeli &quot;geleceği görerek geçmişi tahmin eden&quot; bir yapay zekaya dönüştürür (<strong>Data Leakage / Bilgi Sızıntısı</strong>). Bu nedenle modelleme kesinlikle kronolojik zaman sırasına göre bölünmeli ve sektörün risk yapısına göre doğru metrikler seçilmelidir.
        </p>
      </div>

      {/* Part 1: Train / Val / Test Chronological Split */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Gerçek Hayatı Birebir Yansıtan Kronolojik Zaman Bölünmesi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              2015-2018 İspanya verisinin kronolojik zaman ekseni üzerinde bölünmesi
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
            Sıfır Veri Sızıntısı (No Data Leakage)
          </span>
        </div>

        {/* Visual Timeline Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>2015-01-01</span>
            <span>2016-06</span>
            <span>2017-06</span>
            <span>2017-12</span>
            <span>2018-12-31</span>
          </div>

          <div className="h-10 w-full rounded-lg overflow-hidden flex font-medium text-xs shadow-inner">
            <div
              style={{ width: `${config.trainRatio}%` }}
              className="bg-blue-600 flex items-center justify-center text-white px-2 transition-all relative group"
            >
              <span>Eğitim Kümesi (Train - %{config.trainRatio})</span>
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-950 p-2 rounded text-[11px] border border-slate-700 whitespace-nowrap z-20">
                Model ağırlıkları bu dönemde öğrenilir (2015 - 2017 Ortası)
              </div>
            </div>

            <div
              style={{ width: `${config.valRatio}%` }}
              className="bg-amber-500 flex items-center justify-center text-slate-950 px-2 transition-all relative group font-semibold"
            >
              <span>Doğrulama (%{config.valRatio})</span>
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-950 p-2 rounded text-[11px] text-white border border-slate-700 whitespace-nowrap z-20">
                Hiperparametre ayarlama ve erken durdurma (2017 İkinci Yarı)
              </div>
            </div>

            <div
              style={{ width: `${config.testRatio}%` }}
              className="bg-emerald-600 flex items-center justify-center text-white px-2 transition-all relative group"
            >
              <span>Test Kümesi (%{config.testRatio})</span>
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-950 p-2 rounded text-[11px] border border-slate-700 whitespace-nowrap z-20">
                Tamamen görülmemiş gelecekteki son yıl (2018 Tamamı)
              </div>
            </div>
          </div>
        </div>

        {/* Comparison: Why Random Split Fails vs Chronological Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-rose-950/30 border border-rose-900/60 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-rose-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Hatalı Yöntem: Rastgele Bölme (Random train_test_split)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Veri karıştırılırsa 15 Ocak saat 14:00 test kümesine düşerken, 15 Ocak saat 15:00 eğitim kümesinde kalır. Model geleceğe bakıp geçmişi tahmin eder. Model kağıt üzerinde %99 R² verir ama gerçek hayata canlıya alındığında tamamen iflas eder!
            </p>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-900/60 p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Bizim Yaklaşımımız: Katı Zamansal Bölme (Chronological Split)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Eğitim (2015-2017) tamamen geçmişte biter. Test kümesi ise 2018 yılının tamamını kapsar. Model 2018&apos;de yaşanacak hiçbir olayı bilmeden tahmin üretmek zorundadır. Bu tam olarak belediyelerin ve şebekenin ertesi günle karşılaşacağı gerçekliği simüle eder.
            </p>
          </div>
        </div>

        {/* Split Slider */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span>Bölme Oranı Seçenekleri:</span>
            {[
              { t: 70, v: 15, te: 15, label: '%70 Train / %15 Val / %15 Test (Önerilen Standart)' },
              { t: 80, v: 10, te: 10, label: '%80 Train / %10 Val / %10 Test' },
              { t: 60, v: 20, te: 20, label: '%60 Train / %20 Val / %20 Test (Geniş Test Seti)' },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() =>
                  setConfig(prev => ({
                    ...prev,
                    trainRatio: preset.t,
                    valRatio: preset.v,
                    testRatio: preset.te,
                  }))
                }
                className={`px-3 py-1.5 rounded transition cursor-pointer text-xs ${
                  config.trainRatio === preset.t
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Part 2: Error Metrics Decision Framework */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Hata Metriklerine Karar Verme Süreci (RMSE, RMSLE, MAE, MAPE, R²)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Elektrik talebi (MW) ve spot fiyatı (€/MWh) problemleri için metrik seçim gerekçeleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* RMSE */}
          <div className="bg-slate-950 p-4 rounded-lg border border-blue-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">RMSE (Karekök Ortalama Kare Hata)</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800 text-[10px]">
                  Ana Metrik 🥇
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-blue-300 mb-2">
                RMSE = √( 1/n Σ (y - ŷ)² )
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Neden Seçildi?</strong> Büyük sapmaların karesini aldığı için modele sert bir ceza uygular. Elektrik şebekesinde 200 MW hata tolere edilebilirken, pik saatte 3,000 MW sapma şebekeyi çökertebilir. Bu yüzden <strong>şebeke güvenliği için en kritik metriktir</strong>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-blue-400 font-medium">
              Birim: Doğrudan {target === 'total_load_actual' ? 'MW' : '€/MWh'} cinsindendir.
            </div>
          </div>

          {/* RMSLE */}
          <div className="bg-slate-950 p-4 rounded-lg border border-purple-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">RMSLE (Logaritmik RMSE)</span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-800 text-[10px]">
                  Fiyat Tahmininde Kritik
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-purple-300 mb-2">
                RMSLE = √( 1/n Σ (log(y+1) - log(ŷ+1))² )
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Neden Seçildi?</strong> Elektrik spot fiyatlarında gaz kıtlığı veya fırtına anında fiyatlar 40 €&apos;dan 115 €&apos;ya sıçrayabilir. RMSLE logaritma aldığı için oransal hatayı dengeler ve modelin birkaç uç fiyat patlamasına aşırı uyum sağlamasını önler.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-purple-400 font-medium">
              Birim: Boyutsuz (Nispi logaritmik sapma).
            </div>
          </div>

          {/* MAE & MAPE */}
          <div className="bg-slate-950 p-4 rounded-lg border border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">MAE & MAPE (Yüzdesel Hata)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800 text-[10px]">
                  Yönetici & Belediye Raporu
                </span>
              </div>
              <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-emerald-300 mb-2">
                MAPE = ( 1/n Σ |(y - ŷ)/y| ) × 100
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Neden Seçildi?</strong> Belediye başkanları ve kamu karar vericileri matematiksel kareleri anlamak yerine &quot;Tahminimiz ortalama yüzde kaç sapıyor?&quot; sorusunu sorar. MAPE bize modelin <strong>%2.1 - %2.8 hata payıyla</strong> çalıştığını net şekilde gösterir.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-emerald-400 font-medium">
              Birim: Yüzde (%) ve mutlak MW.
            </div>
          </div>
        </div>

        {/* Summary note */}
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Karar Özeti:</strong> Bu projede model karşılaştırması ve hiperparametre optimizasyonunda <strong>RMSE</strong> birincil kayıp fonksiyonu (loss function) olarak seçilmiş, raporlamada ise yöneticilere <strong>MAPE</strong> ve <strong>MAE</strong> sunulmuştur.
          </span>
        </div>
      </div>
    </div>
  );
};
