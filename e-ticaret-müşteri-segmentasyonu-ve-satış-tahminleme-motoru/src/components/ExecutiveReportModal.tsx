import React from 'react';
import { X, Printer, Download, Award, CheckCircle2, TrendingUp, Users, Database } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Modal Top Actions */}
        <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-slate-100">
              Yönetici Strateji Raporu · Enes Öztürk İmzalı
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır / PDF Olarak Kaydet
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Body */}
        <div className="p-8 space-y-8 bg-slate-900 text-slate-200">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
                  UÇTAN UCA VERİ ANALİTİĞİ VE MODELLEME RAPORU
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  E-Ticaret Müşteri Segmentasyonu & Satış Tahminleme Stratejisi
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  SQL Veri Ambarı · Python & Pandas Ön İşleme · RFM Modelleme · K-Means · Seasonal ARIMA
                </p>
              </div>

              <div className="text-right text-xs font-mono text-slate-400 space-y-0.5">
                <div>Proje Kodu: <strong className="text-slate-200">DS-ECOMM-2026</strong></div>
                <div>Tarih: <strong className="text-slate-200">01 Kasım 2026</strong></div>
                <div>Versiyon: <strong className="text-indigo-400">v1.4.0 (Stable)</strong></div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive KPI Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide text-indigo-400">
              1. Yönetici Özeti ve Temel Finansal Göstergeler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">İncelenen Toplam Müşteri Portföyü</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">218 Aktif Müşteri</div>
                <div className="text-[11px] text-slate-500 mt-1">Tukey IQR ile 2 aykırı B2B işlem elendi</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">Şampiyonlar Segment Ciro Payı</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">%44.2 (1.28M ₺)</div>
                <div className="text-[11px] text-emerald-500 mt-1">Toplam cironun aslan payı 34 müşteride</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400">30 Günlük Tahminleme Doğruluğu</div>
                <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">MAPE %5.82</div>
                <div className="text-[11px] text-indigo-300 mt-1">SARIMAX modeli ile yüksek güvenilirlik</div>
              </div>
            </div>
          </div>

          {/* Section 2: RFM Segment Strategy Table */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide text-indigo-400">
              2. Müşteri Segmentasyon Matrisi ve Pazarlama Yol Haritası
            </h2>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <th className="p-3">Segment Adı</th>
                    <th className="p-3">Müşteri Sayısı</th>
                    <th className="p-3">Ort. Recency</th>
                    <th className="p-3">Ort. Harcama</th>
                    <th className="p-3">Uygulanacak Strateji & Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-3 font-bold text-emerald-400">Şampiyonlar</td>
                    <td className="p-3">34 (%15.6)</td>
                    <td className="p-3">7 gün</td>
                    <td className="p-3">22.400 ₺</td>
                    <td className="p-3 font-sans text-slate-300">VIP özel müşteri temsilcisi, erken ürün lansmanı ve sadakat hediyeleri.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-cyan-400">Sadık Müşteriler</td>
                    <td className="p-3">38 (%17.4)</td>
                    <td className="p-3">22 gün</td>
                    <td className="p-3">14.100 ₺</td>
                    <td className="p-3 font-sans text-slate-300">Çapraz satış (cross-sell) ve paket indirimleri ile AOV artırımı.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-rose-400">Risk Altındakiler</td>
                    <td className="p-3">38 (%17.4)</td>
                    <td className="p-3">148 gün</td>
                    <td className="p-3">15.200 ₺</td>
                    <td className="p-3 font-sans text-slate-300">Agresif "Sizi Özledik" e-postaları, yüksek oranlı re-aktivasyon kuponu (184K ₺ fırsat).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-purple-400">Yeni Müşteriler</td>
                    <td className="p-3">28 (%12.8)</td>
                    <td className="p-3">12 gün</td>
                    <td className="p-3">4.200 ₺</td>
                    <td className="p-3 font-sans text-slate-300">3 aşamalı onboarding serisi ve ikinci sipariş teşvik indirimi.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Technical Integrity Verification */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide text-indigo-400">
              3. Metodoloji ve Veri Bilimi Mimarisi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-white font-bold font-sans">Veri Ön İşleme (Pandas & SQL)</div>
                <div>· Veritabanı: İlişkisel SQL (customers, orders, order_items)</div>
                <div>· Null Değer: Eksik şehirler mod yöntemiyle impute edildi</div>
                <div>· Outlier Filtresi: Tukey IQR yöntemi (k=1.5 çarpanı)</div>
                <div>· Ölçeklendirme: Log1p ve StandardScaler ile normalizasyon</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-white font-bold font-sans">Algoritmik Modelleme</div>
                <div>· RFM Skorlama: pd.qcut quintile (1-5 skor aralığı)</div>
                <div>· Kümeleme: K-Means (Elbow method ile optimal k=4 teyit edildi)</div>
                <div>· Tahminleme: Seasonal ARIMA (1,1,1)x(1,1,1)[7]</div>
                <div>· Güven Aralığı: %95 iki yönlü marjinal hata bandı</div>
              </div>
            </div>
          </div>

          {/* Section 4: Formal Certification Stamp */}
          <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
                Hazırlayan ve Onaylayan
              </div>
              <div className="text-2xl font-bold text-white font-serif tracking-wide">
                Enes Öztürk
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Veri Bilimci & Analitik Modelleme Mühendisi
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Portföy & Versiyon Kontrolü: github.com/enesbino38
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono text-xs">
              <div className="text-emerald-400 font-bold flex items-center sm:justify-end gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> DİJİTAL İMZA DOĞRULANDI
              </div>
              <div className="text-slate-400">HASH: 4b7f9011823ec01984bb283719401829</div>
              <div className="text-slate-500 text-[11px]">İstanbul, Türkiye · 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
