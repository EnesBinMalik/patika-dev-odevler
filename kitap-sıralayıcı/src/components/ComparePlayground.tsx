import React, { useState } from 'react';
import { BookItem } from '../types/book';
import { ArrowLeftRight, Check, AlertCircle, Sparkles } from 'lucide-react';

interface ComparePlaygroundProps {
  books: BookItem[];
}

export const ComparePlayground: React.FC<ComparePlaygroundProps> = ({ books }) => {
  const [bookAId, setBookAId] = useState<string>(books[0]?.id || '');
  const [bookBId, setBookBId] = useState<string>(books[1]?.id || '');
  const [compareMetric, setCompareMetric] = useState<'name' | 'page'>('name');

  const bookA = books.find((b) => b.id === bookAId) || books[0];
  const bookB = books.find((b) => b.id === bookBId) || books[1] || books[0];

  const handleSwap = () => {
    const temp = bookAId;
    setBookAId(bookBId);
    setBookBId(temp);
  };

  if (!bookA || !bookB) return null;

  let comparisonValue = 0;
  let breakdownText = '';
  let interpretationText = '';

  if (compareMetric === 'name') {
    // String compareToIgnoreCase emulation
    const strA = bookA.name.toLocaleLowerCase('tr');
    const strB = bookB.name.toLocaleLowerCase('tr');
    comparisonValue = strA.localeCompare(strB, 'tr');

    const firstCharA = bookA.name[0] || '';
    const firstCharB = bookB.name[0] || '';
    const charCodeA = firstCharA.charCodeAt(0);
    const charCodeB = firstCharB.charCodeAt(0);

    breakdownText = `bookA.getName().compareToIgnoreCase(bookB.getName())
"${bookA.name}" vs "${bookB.name}"
İlk Karakter Farkı: '${firstCharA}' (${charCodeA}) - '${firstCharB}' (${charCodeB}) = ${charCodeA - charCodeB}`;

    if (comparisonValue < 0) {
      interpretationText = `compareTo < 0 döndü. "${bookA.name}" alfabetik olarak "${bookB.name}" kitabından ÖNCE yer alır. TreeSet yapısında sol dala veya önceki indekse yerleşir.`;
    } else if (comparisonValue > 0) {
      interpretationText = `compareTo > 0 döndü. "${bookA.name}" alfabetik olarak "${bookB.name}" kitabından SONRA yer alır. TreeSet yapısında sağ dala veya sonraki indekse yerleşir.`;
    } else {
      interpretationText = `compareTo == 0 döndü! İki kitabın ismi aynı kabul edildi. (TreeSet bunu kopya sayar).`;
    }
  } else {
    // Page count comparator
    const pageDiff = bookA.pageCount - bookB.pageCount;
    comparisonValue = pageDiff !== 0 ? pageDiff : bookA.name.localeCompare(bookB.name, 'tr');

    breakdownText = `Integer.compare(${bookA.pageCount}, ${bookB.pageCount})
Matematiksel Fark: ${bookA.pageCount} - ${bookB.pageCount} = ${pageDiff}`;

    if (pageDiff < 0) {
      interpretationText = `compare < 0 döndü (${pageDiff}). "${bookA.name}" (${bookA.pageCount} sf), "${bookB.name}" (${bookB.pageCount} sf) kitabından DAHA AZ sayfalıdır ve ÖNCE listelenir.`;
    } else if (pageDiff > 0) {
      interpretationText = `compare > 0 döndü (+${pageDiff}). "${bookA.name}" (${bookA.pageCount} sf), "${bookB.name}" (${bookB.pageCount} sf) kitabından DAHA ÇOK sayfalıdır ve SONRA listelenir.`;
    } else {
      interpretationText = `Sayfa sayıları eşit (${bookA.pageCount} == ${bookB.pageCount})! Tie-breaker devreye girdi: Kitap isimleri alfabetik karşılaştırıldı -> ${bookA.name.localeCompare(bookB.name, 'tr')}`;
    }
  }

  return (
    <section id="compare" className="py-8 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              <span>Bölüm 03</span>
              <span aria-hidden="true">·</span>
              <span>Metot Seviyesi Hata Ayıklayıcı</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              İkili Karşılaştırma Laboratuvarı (compareTo & Comparator)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Herhangi iki kitabı seçin; Java'nın <code className="font-mono">compareTo</code> ve <code className="font-mono">compare</code> metotlarının arka plandaki sayısal çıktısını canlı inceleyin.
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shrink-0">
            <button
              onClick={() => setCompareMetric('name')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                compareMetric === 'name'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              İsme Göre (compareTo)
            </button>
            <button
              onClick={() => setCompareMetric('page')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                compareMetric === 'page'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Sayfa Sayısına Göre (compare)
            </button>
          </div>
        </div>

        {/* Selection Strip */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center p-6 rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
          {/* Book A Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
              1. Kitap (this / b1)
            </label>
            <select
              value={bookAId}
              onChange={(e) => setBookAId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus:ring-1 focus:ring-stone-400 focus:outline-hidden"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.pageCount} sf, {b.author})
                </option>
              ))}
            </select>
            <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                {bookA.name}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span>Sayfa: <strong className="font-mono">{bookA.pageCount}</strong></span>
                <span>·</span>
                <span>Yazar: {bookA.author}</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              title="Kitapları Değiştir (Sıralama Simetrisi)"
              className="p-3 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shadow-xs"
            >
              <ArrowLeftRight className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            </button>
          </div>

          {/* Book B Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
              2. Kitap (other / b2)
            </label>
            <select
              value={bookBId}
              onChange={(e) => setBookBId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus:ring-1 focus:ring-stone-400 focus:outline-hidden"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.pageCount} sf, {b.author})
                </option>
              ))}
            </select>
            <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                {bookB.name}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span>Sayfa: <strong className="font-mono">{bookB.pageCount}</strong></span>
                <span>·</span>
                <span>Yazar: {bookB.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Result Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Result Scoreboard */}
          <div className="lg:col-span-5 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Metot Dönüş Değeri (int)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-mono font-bold text-stone-900 dark:text-stone-100">
                  {comparisonValue > 0 ? `+${comparisonValue}` : comparisonValue}
                </span>
                <span className="text-sm font-mono text-stone-500">
                  {comparisonValue < 0
                    ? '(Negatif: A < B)'
                    : comparisonValue > 0
                    ? '(Pozitif: A > B)'
                    : '(Sıfır: A == B)'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                {interpretationText}
              </p>
            </div>
          </div>

          {/* Technical Breakdown Box */}
          <div className="lg:col-span-7 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-900 text-stone-200 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800 text-stone-400 text-[11px]">
              <span>JAVA ÇALIŞMA ZAMANI İFADESİ</span>
              <span>{compareMetric === 'name' ? 'Comparable.compareTo' : 'Comparator.compare'}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-stone-300 font-mono">
              {breakdownText}
            </pre>
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span>Simetri Kuralı:</span>
              <span className="text-stone-300">
                sgn(a.compareTo(b)) == -sgn(b.compareTo(a))
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
