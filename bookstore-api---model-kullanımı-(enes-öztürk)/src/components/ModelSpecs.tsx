import React from 'react';
import { ArrowRight, CheckCircle, XCircle, Code, Shield, Sparkles } from 'lucide-react';

export const ModelSpecs: React.FC = () => {
  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Detaylı Model Şemaları
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            UpdateBook & GetById Input / Output Sözleşmeleri
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Ödev isterlerine göre hazırlanan modellerin C# tip tanımları, işlevleri ve Entity'den farkları:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: UpdateBook Models */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    PUT /api/books/{'{id}'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    UpdateBook Metodu Modelleri
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Command Pattern
                </span>
              </div>

              {/* Input Model Details */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Input Model: <span className="font-mono text-indigo-700">UpdateBookModel</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  İstemciden HTTP Body içerisinde alınan JSON gövdesidir. Sadece değiştirilmesine izin verilen özellikler yer alır.
                </p>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/75 text-slate-700 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Özellik (Property)</th>
                        <th className="py-2 px-3 font-semibold">C# Veri Tipi</th>
                        <th className="py-2 px-3 font-semibold">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-indigo-700">Title</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Güncellenen kitap başlığı</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-indigo-700">GenreId</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Kategori ID referansı</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-indigo-700">PageCount</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Sayfa sayısı (&gt; 0)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-indigo-700">PublishDate</td>
                        <td className="py-2 px-3 text-slate-500">DateTime</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Yayınlanma tarihi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Güvenlik:</strong> <code className="font-mono">Id</code>, <code className="font-mono">CreatedDate</code> ve <code className="font-mono">IsDeleted</code> alanları bu modele alınmayarak Mass Assignment saldırısı engellenmiştir.
                  </span>
                </div>
              </div>

              {/* Output Model Details */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Output Model: <span className="font-mono text-emerald-700">UpdateBookViewModel</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Güncelleme tamamlandıktan sonra istemciye dönülen nesnedir.
                </p>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/75 text-slate-700 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Özellik</th>
                        <th className="py-2 px-3 font-semibold">C# Tipi</th>
                        <th className="py-2 px-3 font-semibold">Dönüşüm / Not</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Id</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Güncellenen kitabın kimliği</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Title</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Yeni başlık</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Genre</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Kategori adı (int ID yerine metin!)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">PublishDate</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Formatlanmış tarih ("dd/MM/yyyy")</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">UpdatedAt</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">İşlem zaman damgası</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Message</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Başarı mesajı</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: GetById Models */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    GET /api/books/{'{id}'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    GetById Metodu Modelleri
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Query Pattern
                </span>
              </div>

              {/* Input Model Details */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Input Model: <span className="font-mono text-indigo-700">GetBookDetailQuery (BookId)</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  URL rota parametresinden (<code className="font-mono">Route</code>) alınır. FluentValidation ile doğrulanır.
                </p>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/75 text-slate-700 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Özellik (Property)</th>
                        <th className="py-2 px-3 font-semibold">C# Veri Tipi</th>
                        <th className="py-2 px-3 font-semibold">Kural & Açıklama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-indigo-700">BookId</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">
                          Sorgulanan kitap ID'si (<code className="font-mono">BookId &gt; 0</code> kuralı)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg border border-indigo-200">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Doğrulama:</strong> <code className="font-mono">GetBookDetailQueryValidator</code> sınıfı ile sıfır veya negatif ID girişleri engellenir.
                  </span>
                </div>
              </div>

              {/* Output Model Details */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Output Model: <span className="font-mono text-emerald-700">BookDetailViewModel</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Tek bir kitabın ayrıntılarını istemciye sunmak üzere tasarlanmış özel ViewModel nesnesidir.
                </p>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/75 text-slate-700 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Özellik</th>
                        <th className="py-2 px-3 font-semibold">C# Tipi</th>
                        <th className="py-2 px-3 font-semibold">Entity İle Karşılaştırma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Id</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Kitap kimliği</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Title</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Kitap adı</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">Genre</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">
                          <span className="text-emerald-700 font-medium">Entity'deki int GenreId string ada çevrildi!</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">PageCount</td>
                        <td className="py-2 px-3 text-slate-500">int</td>
                        <td className="py-2 px-3 font-sans text-slate-600">Sayfa sayısı</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-emerald-700">PublishDate</td>
                        <td className="py-2 px-3 text-slate-500">string</td>
                        <td className="py-2 px-3 font-sans text-slate-600">
                          <span className="text-emerald-700 font-medium">DateTime yerine "dd/MM/yyyy" formatlandı!</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] text-rose-700 bg-rose-50/70 p-2 rounded-lg border border-rose-200">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Gizlenen Entity Kolonları:</strong> <code className="font-mono">CreatedDate</code>, <code className="font-mono">ModifiedDate</code>, <code className="font-mono">IsDeleted</code>, <code className="font-mono">RowVersion</code>, <code className="font-mono">InternalBarcode</code> istemciye ASLA sızdırılmaz!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
