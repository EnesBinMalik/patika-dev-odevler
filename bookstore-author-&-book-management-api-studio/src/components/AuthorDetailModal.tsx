import React from 'react';
import { X, BookOpen, Calendar, Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { AuthorDetailViewModel } from '../types';

interface AuthorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorDetail: AuthorDetailViewModel | null;
  onToggleBookPublish?: (bookId: number) => void;
  onDeleteBook?: (bookId: number) => void;
  onNavigateToBooks?: () => void;
}

export const AuthorDetailModal: React.FC<AuthorDetailModalProps> = ({
  isOpen,
  onClose,
  authorDetail,
  onToggleBookPublish,
  onDeleteBook,
  onNavigateToBooks,
}) => {
  if (!isOpen || !authorDetail) return null;

  const publishedBooks = authorDetail.books.filter((b) => b.isPublished);
  const hasPublishedBooks = publishedBooks.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-mono font-medium text-indigo-300 uppercase tracking-wider">
              DTO: AuthorDetailViewModel &bull; GET /api/author/{authorDetail.id}
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {authorDetail.fullName}
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-normal">
                Id: {authorDetail.id}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top Attributes Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Doğum Tarihi</span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800 text-sm">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {authorDetail.formattedBirthDate}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Hesaplanan Yaş</span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800 text-sm">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {authorDetail.age} Yaşında
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Toplam Kitap</span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800 text-sm">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                {authorDetail.books.length} Eser
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Silinme Durumu</span>
              <div className="mt-1">
                {hasPublishedBooks ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    Silinemez (Kilitli)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Silinebilir
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Business Rule Banner */}
          {hasPublishedBooks ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  Ödev Kuralı (Madde 3 &amp; 7): Kitabı yayında olan yazar silinemez!
                </p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Bu yazara ait yayında olan <strong>{publishedBooks.length} adet kitap</strong> bulunmaktadır.
                  Yazarı silebilmek için önce yayındaki kitapları silmeli veya taslağa çekmelisiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">
                  Silme İş Kuralı Uygun: Yayında Kitap Yok
                </p>
                <p className="mt-0.5 text-emerald-800 leading-relaxed">
                  Bu yazarın yayında herhangi bir eseri bulunmamaktadır. İstenirse yazar güvenle silinebilir.
                </p>
              </div>
            </div>
          )}

          {/* Books Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Yazara Ait Kitaplar ({authorDetail.books.length})
              </h4>
              {onNavigateToBooks && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToBooks();
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Kitaplar Sekmesinde Gör &rarr;
                </button>
              )}
            </div>

            {authorDetail.books.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                Bu yazara henüz kayıtlı bir kitap eklenmemiş.
              </div>
            ) : (
              <div className="space-y-2">
                {authorDetail.books.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{b.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {b.genreName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.isPublished
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {b.isPublished ? 'Yayında' : 'Taslak (Yayında Değil)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Yayımlanma: {b.publishDate} &bull; Sayfa: {b.pageCount} &bull; Kitap Id: {b.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {onToggleBookPublish && (
                        <button
                          onClick={() => onToggleBookPublish(b.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                            b.isPublished
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {b.isPublished ? 'Yayından Kaldır' : 'Yayına Al'}
                        </button>
                      )}
                      {onDeleteBook && (
                        <button
                          onClick={() => onDeleteBook(b.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        >
                          Kitabı Sil
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-mono">
            AutoMapper: CreateMap&lt;Author, AuthorDetailViewModel&gt;()
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
