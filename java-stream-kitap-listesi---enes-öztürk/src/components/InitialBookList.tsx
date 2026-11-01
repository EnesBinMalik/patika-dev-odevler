import React, { useState } from 'react';
import { Book as BookIcon, Plus, RotateCcw, Search, Calendar, User, FileText, Check, AlertCircle } from 'lucide-react';
import { Book } from '../types/book';

interface InitialBookListProps {
  books: Book[];
  onOpenAddModal: () => void;
  onResetBooks: () => void;
  onSelectBookForMap?: (bookName: string) => void;
}

export const InitialBookList: React.FC<InitialBookListProps> = ({
  books,
  onOpenAddModal,
  onResetBooks,
  onSelectBookForMap,
}) => {
  const [search, setSearch] = useState('');

  const filteredBooks = books.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.authorName.toLowerCase().includes(search.toLowerCase()) ||
    b.publishDate.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Title & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              1. ArrayList&lt;Book&gt; Başlangıç Koleksiyonu
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {books.length} Nesne
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ödev gereksinimi 1: Book sınıfından 10 adet nesne üretilip <code className="text-amber-300 font-mono">ArrayList</code> yapısında saklanmıştır.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kitap veya yazar ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Yeni kitap nesnesi ekle"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitap Ekle</span>
          </button>

          <button
            onClick={onResetBooks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Varsayılan 10 kitaba sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Java instantiation code preview pill */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
        <span className="text-slate-500">// Java Tanımlaması:</span>
        <div className="text-amber-300">
          List&lt;Book&gt; bookList = new ArrayList&lt;&gt;();
        </div>
        <div className="text-slate-400 text-[11px] mt-1">
          bookList.add(new Book(&quot;Küçük Prens&quot;, 96, &quot;Antoine de Saint-Exupéry&quot;, &quot;1943&quot;)); ... ({books.length} adet eklendi)
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book, index) => {
          const isOver100 = book.pageCount > 100;
          return (
            <div
              key={book.id || index}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all group relative flex flex-col justify-between"
            >
              <div>
                {/* Header row: Index & Page count badge */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/70">
                  <span className="text-[11px] font-mono text-slate-500">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-semibold text-slate-200 tabular-nums">
                      {book.pageCount} sayfa
                    </span>
                    {isOver100 ? (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Sayfa sayısı 100'den büyük">
                        &gt;100
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50" title="Sayfa sayısı 100 veya daha az">
                        &le;100
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Title */}
                <h3 className="text-base font-bold text-white mt-2.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                  {book.name}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-1.5 text-xs text-amber-400/90 mt-1 font-medium">
                  <User className="w-3.5 h-3.5 shrink-0 text-amber-400/60" />
                  <span className="truncate">{book.authorName}</span>
                </div>

                {/* Description or genre if present */}
                {book.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>

              {/* Footer row: Publish Date & Type */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Basım: {book.publishDate}</span>
                </div>
                {book.genre && (
                  <span className="text-slate-400 text-[10px]">
                    {book.genre}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <BookIcon className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">Arama kriterinize uygun kitap bulunamadı.</p>
        </div>
      )}
    </div>
  );
};
