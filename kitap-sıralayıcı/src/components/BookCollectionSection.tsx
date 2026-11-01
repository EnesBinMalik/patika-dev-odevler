import React, { useState } from 'react';
import { BookItem } from '../types/book';
import { compareBooksByName, compareBooksByPage } from '../data/defaultBooks';
import {
  ArrowDownAZ,
  FileText,
  Columns,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Search,
  Scale,
} from 'lucide-react';

interface BookCollectionSectionProps {
  books: BookItem[];
  onAddBook: () => void;
  onEditBook: (book: BookItem) => void;
  onDeleteBook: (id: string) => void;
  onResetBooks: () => void;
  onSelectForCompare: (bookA: BookItem, bookB: BookItem) => void;
}

export const BookCollectionSection: React.FC<BookCollectionSectionProps> = ({
  books,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onResetBooks,
  onSelectForCompare,
}) => {
  const [activeSetView, setActiveSetView] = useState<'name' | 'page' | 'split'>('split');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedByName = [...filteredBooks].sort(compareBooksByName);
  const sortedByPage = [...filteredBooks].sort(compareBooksByPage);

  const getCoverBg = (style?: string) => {
    switch (style) {
      case 'rose':
        return 'border-rose-300/40 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20';
      case 'emerald':
        return 'border-emerald-300/40 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20';
      case 'amber':
        return 'border-amber-300/40 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20';
      case 'blue':
        return 'border-sky-300/40 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/20';
      default:
        return 'border-stone-300/40 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30';
    }
  };

  const renderBookCard = (
    book: BookItem,
    index: number,
    sortBasis: 'name' | 'page'
  ) => {
    return (
      <div
        key={`${book.id}-${sortBasis}`}
        className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getCoverBg(
          book.coverStyle
        )} flex flex-col justify-between`}
      >
        <div>
          {/* Card Top: Sequential Position & Quick action */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
              #{index + 1}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEditBook(book)}
                title="Kitabı Düzenle"
                className="p-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteBook(book.id)}
                title="Kitabı Sil"
                className="p-1 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
            {book.name}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separators (Zero-Pill Compliance) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 mt-2">
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {book.author}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-medium">{book.pageCount} sayfa</span>
            <span aria-hidden="true">·</span>
            <span>{book.publishDate}</span>
          </div>

          {book.genre && (
            <div className="text-xs text-stone-400 dark:text-stone-500 mt-1 italic">
              {book.genre}
            </div>
          )}
        </div>

        {/* Sort Basis Highlight */}
        <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/60 flex items-center justify-between text-xs">
          <span className="text-stone-500 dark:text-stone-400">
            {sortBasis === 'name' ? 'Sıralama Anahtarı: İsim' : 'Sıralama Anahtarı: Sayfa'}
          </span>
          <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
            {sortBasis === 'name' ? book.name[0]?.toUpperCase() : `${book.pageCount} sf`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="collection" className="py-8 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              <span>Bölüm 01</span>
              <span aria-hidden="true">·</span>
              <span>Java TreeSet Koleksiyonları</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Set Karşılaştırma Tablosu
            </h2>
          </div>

          {/* Controls: Search, View Tabs & Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Kitap veya yazar ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-400 w-44 sm:w-52"
              />
            </div>

            {/* Segmented View Mode Tabs */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
              <button
                onClick={() => setActiveSetView('name')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeSetView === 'name'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                1. Set (A-Z)
              </button>
              <button
                onClick={() => setActiveSetView('page')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeSetView === 'page'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                2. Set (Sayfa)
              </button>
              <button
                onClick={() => setActiveSetView('split')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeSetView === 'split'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                Yan Yana
              </button>
            </div>

            <button
              onClick={onResetBooks}
              title="Varsayılan 5 Kitabı Geri Yükle"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-800 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
            <p className="text-stone-600 dark:text-stone-400 mb-3">
              Henüz listede kitap bulunmuyor.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onResetBooks}
                className="px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg"
              >
                Varsayılan 5 Kitabı Yükle
              </button>
              <button
                onClick={onAddBook}
                className="px-4 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-lg"
              >
                Yeni Kitap Ekle
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Split View */}
            {activeSetView === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Set Column */}
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowDownAZ className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          1. Set: A'dan Z'ye İsme Göre
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-stone-500">
                        Comparable&lt;Book&gt;
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <code className="text-xs font-mono">compareTo()</code> metodu kitap ismini
                      alfabetik inceler.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {sortedByName.map((book, idx) => renderBookCard(book, idx, 'name'))}
                  </div>
                </div>

                {/* 2. Set Column */}
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          2. Set: Sayfa Sayısına Göre
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-stone-500">
                        Comparator&lt;Book&gt;
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Özel Comparator sayfa sayılarını küçükten büyüğe sıralar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {sortedByPage.map((book, idx) => renderBookCard(book, idx, 'page'))}
                  </div>
                </div>
              </div>
            )}

            {/* Name Only View */}
            {activeSetView === 'name' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      1. Set: A'dan Z'ye İsme Göre Sıralı Liste (Comparable)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      TreeSet yapısı eklenen her nesne için Book.compareTo(other) metodunu çağırarak sıralar.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-stone-600 dark:text-stone-400">
                    {sortedByName.length} Eleman
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedByName.map((book, idx) => renderBookCard(book, idx, 'name'))}
                </div>
              </div>
            )}

            {/* Page Only View */}
            {activeSetView === 'page' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      2. Set: Sayfa Sayısına Göre Sıralı Liste (Comparator)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      TreeSet yapıcı metoduna sağlanan Comparator ile kitaplar sayfa adedine göre dizilir.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-stone-600 dark:text-stone-400">
                    {sortedByPage.length} Eleman
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedByPage.map((book, idx) => renderBookCard(book, idx, 'page'))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
