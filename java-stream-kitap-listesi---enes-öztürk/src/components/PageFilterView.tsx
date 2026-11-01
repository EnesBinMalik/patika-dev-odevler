import React, { useState } from 'react';
import { Filter, CheckCircle, XCircle, Copy, Check, Sliders, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Book } from '../types/book';

interface PageFilterViewProps {
  books: Book[];
}

export const PageFilterView: React.FC<PageFilterViewProps> = ({ books }) => {
  const [threshold, setThreshold] = useState<number>(100);
  const [copiedCode, setCopiedCode] = useState(false);

  // Stream filter logic: book.pageCount > threshold
  const matchingBooks = books.filter(b => b.pageCount > threshold);
  const excludedBooks = books.filter(b => b.pageCount <= threshold);

  // Statistics
  const avgPagesMatching = matchingBooks.length > 0 
    ? Math.round(matchingBooks.reduce((sum, b) => sum + b.pageCount, 0) / matchingBooks.length) 
    : 0;
  
  const thickestBook = matchingBooks.length > 0
    ? [...matchingBooks].sort((a, b) => b.pageCount - a.pageCount)[0]
    : null;

  const handleCopyCode = () => {
    const code = `List<Book> filteredBooks = bookList.stream()\n    .filter(book -> book.getPageCount() > ${threshold})\n    .collect(Collectors.toList());`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              3. Stream Filter ile Sayfa Sayısı &gt; 100 Filtreleme
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Ödev gereksinimi 3: 10 elemanlık <code className="text-emerald-300 font-mono">Book</code> listesinden sayfa sayısı 100&apos;den fazla olan kitaplar <code className="text-emerald-300 font-mono">filter()</code> ve lambda ifadesi ile filtrelenip yeni bir <code className="text-emerald-300 font-mono">List&lt;Book&gt;</code> olarak toplanmıştır.
          </p>
        </div>

        {/* Dynamic Threshold Slider Preset Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setThreshold(100)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              threshold === 100
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            100 Sayfa (Ödev Kuralı)
          </button>
          <button
            onClick={() => setThreshold(150)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              threshold === 150
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            150 Sayfa
          </button>
          <button
            onClick={() => setThreshold(300)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              threshold === 300
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            300 Sayfa
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Java Stream Pipeline: Intermediate Filter &amp; Collector</span>
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer"
          >
            {copiedCode ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Kopyalandı
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3 h-3" /> Filtre Kodunu Kopyala
              </span>
            )}
          </button>
        </div>

        <div className="pt-3 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200">
          <div className="text-slate-500">// Sayfa sayısı {threshold}&apos;den büyük olanları filtreleme:</div>
          <div>
            <span className="text-indigo-400">List</span>&lt;<span className="text-emerald-400">Book</span>&gt; booksFiltered = bookList.<span className="text-amber-400">stream</span>()
          </div>
          <div className="pl-6">
            .<span className="text-emerald-400 font-bold">filter</span>(<span className="text-orange-300">book</span> -&gt; <span className="text-orange-300">book</span>.<span className="text-amber-300">getPageCount</span>() &gt; <span className="text-emerald-300 font-bold">{threshold}</span>) <span className="text-slate-500">// Predicate&lt;Book&gt; Lambda</span>
          </div>
          <div className="pl-6">
            .<span className="text-cyan-400">collect</span>(<span className="text-indigo-400">Collectors</span>.<span className="text-amber-400">toList</span>()); <span className="text-slate-500">// Yeni Liste Üretimi</span>
          </div>
        </div>
      </div>

      {/* Interactive Threshold Slider Strip */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">
              Dinamik Eşik Değeri (Threshold Slider):
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 tabular-nums">
              &gt; {threshold} sayfa
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {matchingBooks.length} kitap geçti, {excludedBooks.length} kitap elendi
          </span>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-xs font-mono text-slate-500">50</span>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-xs font-mono text-slate-500">500</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] text-slate-400">Filtreyi Geçen Kitap</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {matchingBooks.length} <span className="text-xs text-slate-500 font-normal">/ {books.length}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            %{Math.round((matchingBooks.length / books.length) * 100)} Kabul Oranı
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] text-slate-400">Ortalama Sayfa (Geçenler)</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {avgPagesMatching}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Sayfa / Kitap
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] text-slate-400">En Kalın Kitap</span>
          <div className="text-sm font-bold text-white truncate mt-2">
            {thickestBook ? thickestBook.name : "-"}
          </div>
          <span className="text-[10px] font-mono text-amber-400 block mt-0.5">
            {thickestBook ? `${thickestBook.pageCount} sayfa` : ""}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] text-slate-400">Elenen Kitap Sayısı</span>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {excludedBooks.length}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            &le; {threshold} sayfa
          </span>
        </div>
      </div>

      {/* Two Column Layout: Passed List vs Excluded List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Filtered Result (New List) */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 overflow-hidden">
          <div className="p-4 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Yeni Liste: Koşulu Sağlayanlar (&gt; {threshold} Sayfa)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {matchingBooks.length} Kitap
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-800/80 max-h-[460px] overflow-y-auto">
            {matchingBooks.map((book, idx) => (
              <div key={book.id || idx} className="py-3 px-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {book.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {book.authorName} · {book.publishDate}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-emerald-300 tabular-nums">
                    {book.pageCount}
                  </span>
                  <span className="text-[10px] text-slate-500 block">sayfa</span>
                </div>
              </div>
            ))}

            {matchingBooks.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                Seçilen eşik değerinden ({threshold} sayfa) büyük kitap bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Excluded books (<= threshold) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Elenenler: Koşulu Sağlamayanlar (&le; {threshold} Sayfa)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {excludedBooks.length} Kitap
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-800/80 max-h-[460px] overflow-y-auto">
            {excludedBooks.map((book, idx) => {
              const diff = threshold - book.pageCount;
              return (
                <div key={book.id || idx} className="py-3 px-2 flex items-center justify-between gap-3 opacity-75">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      ✕
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-300 truncate">
                        {book.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {book.authorName} · {book.publishDate}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono text-slate-400 tabular-nums">
                      {book.pageCount}
                    </span>
                    <span className="text-[10px] text-slate-600 block">
                      {diff >= 0 ? `(-${diff} sayfa)` : ''}
                    </span>
                  </div>
                </div>
              );
            })}

            {excludedBooks.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                Hiçbir kitap elenmedi. Tüm kitaplar eşik değerinin üzerinde.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
