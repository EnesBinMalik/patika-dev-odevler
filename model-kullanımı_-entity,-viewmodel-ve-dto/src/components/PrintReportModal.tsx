import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import { COMPARISON_MATRIX } from '../data/homeworkData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Ödev Teslim Formatı
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              A4 Yazdırma / PDF Çıktısı Hazır
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 text-slate-900 dark:text-slate-100 text-sm leading-relaxed max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Header Info */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Yazılım Tasarımı ve Mimarisi Dersi
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Ödev Çözüm Raporu: Model Kullanımı
                </h1>
                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  Entity, ViewModel ve DTO (Data Transfer Object) Kavramlarının Analizi
                </div>
              </div>

              {/* Student Signature Box */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 sm:text-right shrink-0">
                <div className="text-xs text-slate-500 dark:text-slate-400">Ödevi Hazırlayan:</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Enes Öztürk
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tarih: Kasım 2026 · Sürüm: 1.0
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              1. Özet ve Giriş
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Bu ödev kapsamında modern nesne yönelimli ve katmanlı yazılım mimarilerinde (Clean Architecture, N-Tier, Domain-Driven Design) modellerin doğru şekilde soyutlanması araştırılmıştır. Bir web veya mobil uygulamada veritabanı tablolarının doğrudan arayüz veya API uç noktalarına sunulması, ciddi güvenlik zafiyetlerine (Mass Assignment), yüksek ağ maliyetine ve sistemin katı (tightly-coupled) hale gelmesine sebep olur. Bu nedenle <strong>Entity</strong>, <strong>DTO</strong> ve <strong>ViewModel</strong> ayrımı zorunludur.
            </p>
          </div>

          {/* Section 2: Concepts Breakdown */}
          <div className="mb-8 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              2. Temel Kavramların İncelenmesi
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                A. Entity (Varlık Modeli)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Veritabanı tablosunun ve iş kurallarının (Domain) birebir karşılığıdır. Birincil anahtara (Id) sahiptir. Şifre hash'leri, sistem audit logları ve ilişkileri tutar. UI bağımlılığı kesinlikle sıfırdır ve dış dünyaya doğrudan açılmamalıdır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">
                B. DTO (Data Transfer Object)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Katmanlar veya ağ üzerinden sistemler arasında yalnızca gerekli veriyi taşıyan, içinde iş mantığı bulunmayan hafif veri taşıyıcılarıdır. Request DTO ve Response DTO olarak iki yönde çalışır; gereksiz kolonları eleyerek ağ bant genişliğini korur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                C. ViewModel (Görünüm Modeli)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Kullanıcı arayüzüne (View / UI) özel olarak tasarlanmış sunum modelidir. Ekranda gösterilecek formatlanmış metinleri, hata mesajlarını, çift şifre teyitlerini (ConfirmPassword) ve dropdown (SelectListItem) seçeneklerini barındırır.
              </p>
            </div>
          </div>

          {/* Section 3: Comparison Matrix Table */}
          <div className="mb-8 print-break-inside-avoid">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              3. Karşılaştırma Matrisi
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2 border">Kriter</th>
                    <th className="p-2 border text-emerald-700 dark:text-emerald-400">Entity</th>
                    <th className="p-2 border text-blue-700 dark:text-blue-400">DTO</th>
                    <th className="p-2 border text-amber-700 dark:text-amber-400">ViewModel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {COMPARISON_MATRIX.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border font-semibold">{row.feature}</td>
                      <td className="p-2 border">{row.entity}</td>
                      <td className="p-2 border">{row.dto}</td>
                      <td className="p-2 border">{row.viewModel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Security Analysis */}
          <div className="mb-8 print-break-inside-avoid">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              4. Güvenlik Riski: Overposting / Mass Assignment
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Eğer bir API denetleyicisi (Controller) <code className="font-mono font-bold">Register([FromBody] User user)</code> şeklinde doğrudan Entity sınıfını parametre alırsa, saldırgan JSON içine <code className="font-mono">"isAdmin": true</code> ekleyerek yetkisiz olarak sistem yöneticisi olabilir. DTO kullanıldığında ise gelen payload sınırlandırılır ve yetkisiz alanlar sisteme sızamaz.
            </p>
          </div>

          {/* Section 5: Signature & Sign-Off */}
          <div className="pt-8 border-t-2 border-slate-900 dark:border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print-break-inside-avoid">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Ödev Teslim Onayı:</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                Enes Öztürk
              </div>
              <div className="text-xs text-slate-500">
                Yazılım Mimarisi & Model Yönetimi Ödevi Çözümü
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Award className="w-5 h-5 text-indigo-600" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Akademik Doğruluk:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">Onaylandı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
