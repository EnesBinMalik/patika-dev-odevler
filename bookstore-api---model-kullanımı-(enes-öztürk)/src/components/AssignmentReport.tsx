import React, { useState } from 'react';
import { Copy, Check, Printer, UserCheck, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface AssignmentReportProps {
  onCopyAll: () => void;
  copied: boolean;
}

export const AssignmentReport: React.FC<AssignmentReportProps> = ({ onCopyAll, copied }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="rapor" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Document Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Resmi Ödev Teslim Raporu
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Ödev: Model Kullanımı Raporu
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır / PDF
            </button>
            <button
              onClick={onCopyAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Rapor Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Markdown Olarak Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Paper Document Container */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-10 text-slate-800 space-y-8 font-sans">
          {/* Document Metadata Header */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-mono text-slate-400">Öğrenci / Geliştirici</div>
              <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Enes Öztürk</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-sans">
                  Onaylı İmza
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Ders: .NET Core Web API Bootcamp</div>
              <div>Konu: Model (DTO / ViewModel) Mimarisi</div>
              <div>Tarih: Kasım 2026</div>
            </div>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">
              1. Ödevin Amacı ve Kapsamı
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bu ödev kapsamında, BookStore Web API projesindeki <strong className="text-slate-900">UpdateBook</strong> ve{' '}
              <strong className="text-slate-900">GetById</strong> operasyonlarının input ve output yapıları için
              özel model sınıfları (DTO / ViewModel) tasarlanmıştır. Ödevin en katı kuralı olan;
            </p>
            <blockquote className="my-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs sm:text-sm font-medium border-l-4 border-indigo-500">
              "Proje içerisinden Input/Output olarak entity kullanan bir yapının bulunmuyor olması gerekiyor."
            </blockquote>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              kuralı eksiksiz şekilde yerine getirilmiş; ne Controller ne de dış servis seviyesinde veritabanı
              varlığı olan <code className="font-mono text-indigo-700">Book</code> sınıfı doğrudan girdi veya çıktı olarak kullanılmamıştır.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">
              2. UpdateBook Metodu İçin Tasarlanan Model Yapısı
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-indigo-700 font-mono text-xs mb-1">
                  A. Input Model: UpdateBookModel
                </div>
                <p className="text-xs text-slate-600">
                  İstemciden HTTP Body içerisinde kabul edilen modeldir. Sadece güncellenmesine izin verilen
                  <code className="font-mono">Title</code>, <code className="font-mono">GenreId</code>,{' '}
                  <code className="font-mono">PageCount</code> ve <code className="font-mono">PublishDate</code> özelliklerini barındırır.
                  Kitabın <code className="font-mono">Id</code> bilgisi URL rotasından (<code className="font-mono">Route</code>) alınır;
                  böylece gövdede ID ezilme (tampering) riski önlenir.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-emerald-700 font-mono text-xs mb-1">
                  B. Output Model: UpdateBookViewModel
                </div>
                <p className="text-xs text-slate-600">
                  Güncelleme tamamlandıktan sonra istemciye dönülen nesnedir.
                  Entity yerine; güncellenen <code className="font-mono">Id</code>, <code className="font-mono">Title</code>,
                  sayısal GenreId yerine çözülmüş metinsel <code className="font-mono">Genre</code> (Örn: "Bilim Kurgu"),
                  formatlanmış <code className="font-mono">PublishDate</code>, <code className="font-mono">UpdatedAt</code> zaman damgası ve
                  işlem mesajı (<code className="font-mono">Message</code>) döndürülür.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">
              3. GetById Metodu İçin Tasarlanan Model Yapısı
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-indigo-700 font-mono text-xs mb-1">
                  A. Input Model: GetBookDetailQuery
                </div>
                <p className="text-xs text-slate-600">
                  Sorgulanmak istenen kitabın benzersiz anahtarını temsil eden <code className="font-mono">BookId (int)</code> özelliğini taşır.
                  <code className="font-mono">GetBookDetailQueryValidator</code> ile 0 veya negatif değerler engellenerek controller katmanına geçmeden reddedilir.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-emerald-700 font-mono text-xs mb-1">
                  B. Output Model: BookDetailViewModel
                </div>
                <p className="text-xs text-slate-600">
                  İstemciye sunulan nihai veri modelidir.
                  Veritabanı tablosundaki <code className="font-mono">CreatedDate</code>, <code className="font-mono">ModifiedDate</code>,{' '}
                  <code className="font-mono">IsDeleted</code>, <code className="font-mono">RowVersion</code> ve{' '}
                  <code className="font-mono">InternalBarcode</code> gibi iç mekanizma alanları tamamen filtrelenmiştir.
                  Kullanıcı sadece okuma ihtiyacı duyduğu alanları görür.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">
              4. Entity'nin Dışarı Açılmama Gerekçeleri (Mimari Değerlendirme)
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">1.</span>
                <span>
                  <strong className="text-slate-900">Over-Posting / Mass Assignment Koruması:</strong> İstemci doğrudan Entity gönderdiğinde, kötü niyetli kullanıcılar ID veya sistem tarafından yönetilen audit alanlarını ezebilir. DTO kullanımı bu zafiyeti kökten çözer.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">2.</span>
                <span>
                  <strong className="text-slate-900">Veri Sızıntısının Önlenmesi (Security & Privacy):</strong> Veritabanı tablolarındaki şifreler, dahili barkodlar, silinme durumları ve satır versiyonları dış istemcilere sızdırılamaz.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">3.</span>
                <span>
                  <strong className="text-slate-900">Circular Reference ve Serileştirme Krizleri:</strong> Entity Framework ilişkisel gezinme özellikleri (Navigation Properties) JSON serileştirmede sonsuz döngüye girip HTTP 500 hatası üretir. ViewModel bu bağı koparır.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">4.</span>
                <span>
                  <strong className="text-slate-900">Veritabanı ile API Sözleşmesinin Ayrılması (Decoupling):</strong> Veritabanı şemasında yapılan bir kolon adı değişikliği veya optimizasyon, mobil ve web istemcilerinin kullandığı API sözleşmesini bozmaz.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">5.</span>
                <span>
                  <strong className="text-slate-900">Sunum Katmanı İhtiyaçları (Format & UI Logic):</strong> İstemci ham ID (1) yerine kategori adını ("Kişisel Gelişim") ve biçimlendirilmiş tarihi ("13/09/2011") görmek ister. Entity bu biçimlendirmeyi yapamaz; ViewModel yapar.
                </span>
              </li>
            </ul>
          </div>

          {/* Signature Box */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-mono">Ödev Teslim Onayı:</div>
              <div className="text-sm font-extrabold text-slate-900">
                Enes Öztürk
              </div>
              <div className="text-xs text-slate-500">
                Software Engineer Candidate · .NET Web API
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mimari Kurallara %100 Uygun Teslim</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
