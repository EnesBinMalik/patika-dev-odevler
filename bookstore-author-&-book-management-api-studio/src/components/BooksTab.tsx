import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Users,
  Tag,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { libraryStore } from '../services/libraryStore';
import { Book, CreateBookModel } from '../types';

export const BooksTab: React.FC = () => {
  const books = libraryStore.getBooks();
  const authors = libraryStore.getRawAuthors();
  const genres = libraryStore.getGenres();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | 'all'>('all');
  const [selectedGenreId, setSelectedGenreId] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newPageCount, setNewPageCount] = useState(200);
  const [newPublishDate, setNewPublishDate] = useState('2024-01-15');
  const [newAuthorId, setNewAuthorId] = useState<number>(authors[0]?.id || 1);
  const [newGenreId, setNewGenreId] = useState<number>(genres[0]?.id || 1);
  const [newIsPublished, setNewIsPublished] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthor = selectedAuthorId === 'all' || b.authorId === selectedAuthorId;
    const matchesGenre = selectedGenreId === 'all' || b.genreId === selectedGenreId;
    return matchesSearch && matchesAuthor && matchesGenre;
  });

  const handleTogglePublish = (bookId: number) => {
    const res = libraryStore.toggleBookPublishStatus(bookId);
    setNotification(res.message);
  };

  const handleDeleteBook = (bookId: number) => {
    const res = libraryStore.deleteBook(bookId);
    setNotification(res.message);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const model: CreateBookModel = {
      title: newTitle.trim(),
      pageCount: Number(newPageCount) || 100,
      publishDate: newPublishDate,
      authorId: Number(newAuthorId),
      genreId: Number(newGenreId),
      isPublished: newIsPublished,
      description: newDescription,
    };

    const res = libraryStore.createBook(model);
    if (res.success) {
      setNotification(res.message);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const genreMap = new Map(genres.map((g) => [g.id, g.name]));
  const authorMap = new Map(authors.map((a) => [a.id, `${a.firstName} ${a.lastName}`]));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
              Ödev Madde 3: Kitap - Yazar - Tür Entity İlişkileri
            </span>
            <h2 className="text-xl font-bold tracking-tight">Kitap Yönetimi &amp; İlişki Kontrolü</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Her kitabın yalnızca 1 yazarı ve 1 türü vardır (1-to-N). Bir yazarın yayında olan kitabı varsa,
              yazar silinemez. Buradan kitapların yayım durumunu değiştirerek kuralı anında test edebilirsiniz.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kitap Ekle</span>
          </button>
        </div>

        {/* Entity Relationship Diagram Box */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-indigo-300 font-semibold block">Author (1)</span>
            <span className="text-slate-300 text-[11px]">ICollection&lt;Book&gt; Books</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-emerald-300 font-semibold block">&larr; Book (N) &rarr;</span>
            <span className="text-slate-300 text-[11px]">AuthorId (FK) &bull; GenreId (FK)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-purple-300 font-semibold block">Genre (1)</span>
            <span className="text-slate-300 text-[11px]">ICollection&lt;Book&gt; Books</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-indigo-500 hover:text-indigo-800 text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kitap başlığına göre ara..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Author filter */}
          <select
            value={selectedAuthorId}
            onChange={(e) =>
              setSelectedAuthorId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">Tüm Yazarlar ({authors.length})</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </select>

          {/* Genre filter */}
          <select
            value={selectedGenreId}
            onChange={(e) =>
              setSelectedGenreId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">Tüm Türler ({genres.length})</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Kitap Listesi ({filteredBooks.length})
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            Yayındaki kitaplar yazarlarının silinmesini engeller.
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredBooks.map((book) => {
            const authorName = authorMap.get(book.authorId) || 'Bilinmeyen Yazar';
            const genreName = genreMap.get(book.genreId) || 'Belirtilmemiş';

            return (
              <div
                key={book.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                    #{book.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{book.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {genreName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          book.isPublished
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {book.isPublished ? 'Yayında' : 'Taslak (Yayında Değil)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Yazar:{' '}
                        <strong className="text-slate-700 hover:underline cursor-pointer">
                          {authorName}
                        </strong>
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Yayın: {book.publishDate}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span>Sayfa: {book.pageCount}</span>
                    </div>

                    {book.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                        "{book.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleTogglePublish(book.id)}
                    title={
                      book.isPublished
                        ? 'Kitabı yayından kaldırarak yazarın silinebilir olmasını test et'
                        : 'Kitabı yayına al'
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      book.isPublished
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {book.isPublished ? 'Yayından Kaldır' : 'Yayına Al'}
                  </button>

                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    title="Kitabı sil (Yazarın silinmesine izin vermek için)"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-semibold text-sm">Yeni Kitap Ekle (Kitap - Yazar - Tür İlişkisi)</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kitap Başlığı</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Kuyucaklı Yusuf"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sayfa Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    value={newPageCount}
                    onChange={(e) => setNewPageCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Yayımlanma Tarihi</label>
                  <input
                    type="date"
                    value={newPublishDate}
                    onChange={(e) => setNewPublishDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Yazar Seçimi (AuthorId - FK)
                </label>
                <select
                  value={newAuthorId}
                  onChange={(e) => setNewAuthorId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName} (Id: {a.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tür Seçimi (GenreId - FK)
                </label>
                <select
                  value={newGenreId}
                  onChange={(e) => setNewGenreId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Id: {g.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="isPub"
                  checked={newIsPublished}
                  onChange={(e) => setNewIsPublished(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="isPub" className="text-slate-700 font-medium cursor-pointer">
                  Kitap Yayında Olsun mu? (İşaretlenirse yazarı silinemez!)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Kitabı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
