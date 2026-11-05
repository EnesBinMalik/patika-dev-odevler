import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { AuthorsViewModel, AuthorDetailViewModel, CreateAuthorModel, Author } from '../types';
import { libraryStore } from '../services/libraryStore';
import { AuthorModal } from './AuthorModal';
import { AuthorDetailModal } from './AuthorDetailModal';

interface AuthorsTabProps {
  onNavigateToBooks: () => void;
}

export const AuthorsTab: React.FC<AuthorsTabProps> = ({ onNavigateToBooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'canDelete' | 'locked'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [viewingDetail, setViewingDetail] = useState<AuthorDetailViewModel | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  // Fetch from store via Controller method simulation (GET /api/authors)
  const response = libraryStore.getAllAuthors();
  const authors: AuthorsViewModel[] = response.data || [];
  const rawAuthors = libraryStore.getRawAuthors();

  // Filter logic
  const filteredAuthors = authors.filter((author) => {
    const matchesSearch =
      author.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.bookTitles.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'canDelete') {
      return author.publishedBookCount === 0;
    }
    if (filterType === 'locked') {
      return author.publishedBookCount > 0;
    }
    return true;
  });

  const handleCreateAuthor = (model: CreateAuthorModel) => {
    const res = libraryStore.createAuthor(model);
    if (res.success) {
      setNotification({
        type: 'success',
        title: 'Yazar Başarıyla Eklendi (POST /api/author)',
        message: res.message || 'Yazar başarıyla kaydedildi.',
      });
      return { success: true };
    } else {
      return { success: false, message: res.message };
    }
  };

  const handleUpdateAuthor = (model: CreateAuthorModel) => {
    if (!editingAuthor) return { success: false };
    const res = libraryStore.updateAuthor(editingAuthor.id, model);
    if (res.success) {
      setNotification({
        type: 'success',
        title: 'Yazar Bilgileri Güncellendi (PUT /api/author/{id})',
        message: res.message || 'Yazar başarıyla güncellendi.',
      });
      setEditingAuthor(null);
      return { success: true };
    } else {
      return { success: false, message: res.message };
    }
  };

  const handleDeleteAuthor = (authorId: number, authorName: string) => {
    const res = libraryStore.deleteAuthor(authorId);

    if (res.success) {
      setNotification({
        type: 'success',
        title: 'Yazar Başarıyla Silindi (DELETE /api/author/{id})',
        message: res.message || `${authorName} silindi.`,
      });
    } else {
      // Meaningful error message triggered! (Requirement 3 & 7)
      setNotification({
        type: 'error',
        title: 'İş Kuralı İhlali: Yazar Silinemez! (HTTP 422)',
        message: res.message,
      });
    }
  };

  const handleOpenDetail = (authorId: number) => {
    const res = libraryStore.getAuthorById(authorId);
    if (res.success && res.data) {
      setViewingDetail(res.data);
    } else {
      setNotification({
        type: 'error',
        title: 'Hata',
        message: res.message || 'Yazar detayları alınamadı.',
      });
    }
  };

  const handleOpenEdit = (authorId: number) => {
    const raw = rawAuthors.find((a) => a.id === authorId);
    if (raw) {
      setEditingAuthor(raw);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation of Requirements */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
                Ödev Madde 1, 2, 3, 4, 5, 6 &amp; 7
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Author Controller &amp; Servis Yönetim Merkezi
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Tüm CRUD işlemleri DTO modelleri (<code className="text-amber-300">CreateAuthorModel</code>,{' '}
                <code className="text-amber-300">AuthorsViewModel</code>), AutoMapper ve FluentValidation
                doğrulamaları ile çalışır.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yeni Yazar Ekle</span>
            </button>
          </div>

          {/* Critical Rule Highlight */}
          <div className="mt-4 pt-3 border-t border-indigo-800/60 flex flex-wrap items-center gap-3 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 font-semibold text-amber-300">
              <ShieldAlert className="w-4 h-4" />
              Kritik İş Kuralı:
            </span>
            <span>
              Kitabı yayında olan bir yazar silinemez! Öncelikle kitabın silinmesi veya yayından kaldırılması
              gerekir.
            </span>
          </div>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-sm">{notification.title}</h4>
              <p className="text-xs mt-0.5 leading-relaxed">{notification.message}</p>
              {notification.type === 'error' && (
                <div className="mt-2">
                  <button
                    onClick={onNavigateToBooks}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
                  >
                    Kitaplar Sekmesine Git ve Kitabı Sil/Taslağa Çek <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-semibold p-1"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Yazar adı, soyadı veya kitap adına göre ara..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Filtrele:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tümü ({authors.length})
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition cursor-pointer ${
              filterType === 'locked'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Yayında Kitabı Olanlar ({authors.filter((a) => a.publishedBookCount > 0).length})
          </button>
          <button
            onClick={() => setFilterType('canDelete')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition cursor-pointer ${
              filterType === 'canDelete'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Silinebilir Olanlar ({authors.filter((a) => a.publishedBookCount === 0).length})
          </button>
        </div>
      </div>

      {/* Authors List Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            Sistemdeki Yazarlar (Toplam {filteredAuthors.length})
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Model: List&lt;AuthorsViewModel&gt;
          </span>
        </div>

        {filteredAuthors.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Arama kriterine uygun yazar bulunamadı.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAuthors.map((author) => {
              const isLocked = author.publishedBookCount > 0;

              return (
                <div
                  key={author.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Author info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm shrink-0">
                      {author.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {author.fullName}
                        </h3>
                        {isLocked ? (
                          <span
                            title="Yayında kitabı olduğu için doğrudan silinemez"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                          >
                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                            {author.publishedBookCount} Yayında Kitap (Silinemez)
                          </span>
                        ) : (
                          <span
                            title="Yayında kitabı yok, güvenle silinebilir"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Silinebilir
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Doğum: <strong>{author.birthDate}</strong>
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {author.age} yaşında
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Toplam Eser: <strong>{author.bookCount}</strong>
                        </span>
                      </div>

                      {/* Book tags */}
                      {author.bookTitles.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[11px] text-slate-400">Kitapları:</span>
                          {author.bookTitles.map((title, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleOpenDetail(author.id)}
                      title="Yazar Detayı (GET /api/author/{id})"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Detay</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(author.id)}
                      title="Yazar Düzenle (PUT /api/author/{id})"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAuthor(author.id, author.fullName)}
                      title={
                        isLocked
                          ? 'Kitabı yayında olduğu için silme kuralı devreye girer (Hata mesajını test et)'
                          : 'Yazarı sil (DELETE /api/author/{id})'
                      }
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                        isLocked
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isLocked ? 'Sil (Kuralı Test Et)' : 'Sil'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AuthorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAuthor}
        mode="create"
      />

      {/* Edit Modal */}
      <AuthorModal
        isOpen={!!editingAuthor}
        onClose={() => setEditingAuthor(null)}
        onSubmit={handleUpdateAuthor}
        initialAuthor={editingAuthor}
        mode="edit"
      />

      {/* Detail Modal */}
      <AuthorDetailModal
        isOpen={!!viewingDetail}
        onClose={() => setViewingDetail(null)}
        authorDetail={viewingDetail}
        onToggleBookPublish={(bookId) => {
          libraryStore.toggleBookPublishStatus(bookId);
          if (viewingDetail) {
            const updated = libraryStore.getAuthorById(viewingDetail.id);
            if (updated.data) setViewingDetail(updated.data);
          }
        }}
        onDeleteBook={(bookId) => {
          libraryStore.deleteBook(bookId);
          if (viewingDetail) {
            const updated = libraryStore.getAuthorById(viewingDetail.id);
            if (updated.data) setViewingDetail(updated.data);
          }
        }}
        onNavigateToBooks={onNavigateToBooks}
      />
    </div>
  );
};
