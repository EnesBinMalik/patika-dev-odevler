import React, { useState, useEffect } from 'react';
import { BookItem } from '../types/book';
import { X, Book, Hash, User, Calendar, Tag } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<BookItem, 'id'>, editId?: string) => void;
  editingBook?: BookItem | null;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBook,
}) => {
  const [name, setName] = useState('');
  const [pageCount, setPageCount] = useState<number | ''>(200);
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState<string | number>(new Date().getFullYear());
  const [genre, setGenre] = useState('Klasik Roman');
  const [coverStyle, setCoverStyle] = useState<BookItem['coverStyle']>('stone');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBook) {
      setName(editingBook.name);
      setPageCount(editingBook.pageCount);
      setAuthor(editingBook.author);
      setPublishDate(Number(editingBook.publishDate) || 2000);
      setGenre(editingBook.genre || 'Roman');
      setCoverStyle(editingBook.coverStyle || 'stone');
    } else {
      setName('');
      setPageCount(200);
      setAuthor('');
      setPublishDate(2020);
      setGenre('Roman');
      setCoverStyle('amber');
    }
    setError('');
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Kitap ismi boş bırakılamaz.');
      return;
    }
    if (!pageCount || Number(pageCount) <= 0) {
      setError('Sayfa sayısı sıfırdan büyük bir sayı olmalıdır.');
      return;
    }
    if (!author.trim()) {
      setError('Yazar ismi boş bırakılamaz.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        pageCount: Number(pageCount),
        author: author.trim(),
        publishDate: publishDate || 2024,
        genre,
        coverStyle,
      },
      editingBook?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 text-stone-900 dark:text-stone-100">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            {editingBook ? 'Kitap Bilgilerini Düzenle' : 'Yeni Kitap Nesnesi Oluştur'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Kitap İsmi (name)
            </label>
            <div className="relative">
              <Book className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Beyaz Diş"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Sayfa Sayısı (pageCount)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="number"
                  min="1"
                  required
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="240"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Yayın Tarihi (publishDate)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  placeholder="1906"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Yazarın İsmi (author)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Örn: Jack London"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Tür (İsteğe Bağlı)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Macera Romanı"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 rounded-lg shadow-xs transition-colors"
            >
              {editingBook ? 'Değişiklikleri Kaydet' : 'Ağaca ve Set\'e Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
