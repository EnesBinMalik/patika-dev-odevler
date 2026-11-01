import React, { useState } from 'react';
import { X, Plus, BookOpen, AlertCircle } from 'lucide-react';
import { Book } from '../types/book';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (newBook: Book) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAddBook }) => {
  const [name, setName] = useState('');
  const [pageCount, setPageCount] = useState<number>(120);
  const [authorName, setAuthorName] = useState('');
  const [publishDate, setPublishDate] = useState('2024');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Kitap ismi boş bırakılamaz.');
      return;
    }
    if (!authorName.trim()) {
      setError('Yazar ismi boş bırakılamaz.');
      return;
    }
    if (pageCount <= 0) {
      setError('Sayfa sayısı 0\'dan büyük olmalıdır.');
      return;
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      name: name.trim(),
      pageCount: Number(pageCount),
      authorName: authorName.trim(),
      publishDate: publishDate.trim() || '2024',
      genre: 'Özel Eklenen',
      description: 'Kullanıcı tarafından listeye dinamik olarak eklenen kitap.',
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Yeni Book Nesnesi Ekle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Kitap İsmi (name):
            </label>
            <input
              type="text"
              placeholder="Örn: Suç ve Ceza"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Yazarın İsmi (authorName):
            </label>
            <input
              type="text"
              placeholder="Örn: Fyodor Dostoyevski"
              value={authorName}
              onChange={(e) => { setAuthorName(e.target.value); setError(''); }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Sayfa Sayısı (pageCount):
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={pageCount}
                onChange={(e) => { setPageCount(Number(e.target.value)); setError(''); }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                required
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {pageCount > 100 ? '✓ > 100 filtresini geçer' : '✕ ≤ 100 elenir'}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Yayın Tarihi (publishDate):
              </label>
              <input
                type="text"
                placeholder="Örn: 1866"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Listeye Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
