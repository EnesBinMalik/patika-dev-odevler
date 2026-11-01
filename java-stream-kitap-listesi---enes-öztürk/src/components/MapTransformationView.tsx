import React, { useState } from 'react';
import { ArrowRight, Search, Check, Copy, Key, Hash, HelpCircle, Sparkles } from 'lucide-react';
import { Book } from '../types/book';

interface MapTransformationViewProps {
  books: Book[];
}

export const MapTransformationView: React.FC<MapTransformationViewProps> = ({ books }) => {
  const [selectedKey, setSelectedKey] = useState<string>(books[0]?.name || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syntaxMode, setSyntaxMode] = useState<'lambda' | 'methodRef'>('lambda');

  // Convert books to Map<String, String> as required by assignment
  // Using Map logic: Book Name -> Author Name
  const bookMap: Record<string, string> = books.reduce((acc, book) => {
    acc[book.name] = book.authorName;
    return acc;
  }, {} as Record<string, string>);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedAuthor = selectedKey ? bookMap[selectedKey] : null;

  return (
    <div className="space-y-6">
      {/* Header & Concept Intro */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              2. Stream & Lambda ile Map&lt;String, String&gt; Eşlemesi
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Ödev gereksinimi 2: <code className="text-amber-300 font-mono">stream()</code> yapısı ve lambda ifadeleri kullanılarak; Key (Kitap İsmi) &rarr; Value (Yazar İsmi) olacak şekilde yeni bir <code className="text-amber-300 font-mono">Map&lt;String, String&gt;</code> üretilmiştir.
          </p>
        </div>

        {/* Syntax Selector Switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setSyntaxMode('lambda')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              syntaxMode === 'lambda'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lambda Sözdizimi
          </button>
          <button
            onClick={() => setSyntaxMode('methodRef')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              syntaxMode === 'methodRef'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Method Reference
          </button>
        </div>
      </div>

      {/* Code Card for Map Stream Transformation */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-2 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Java Stream Pipeline: Collectors.toMap</span>
          </span>
          <button
            onClick={() => handleCopy(
              syntaxMode === 'lambda'
                ? 'Map<String, String> bookAuthorMap = bookList.stream().collect(Collectors.toMap(b -> b.getName(), b -> b.getAuthorName()));'
                : 'Map<String, String> bookAuthorMap = bookList.stream().collect(Collectors.toMap(Book::getName, Book::getAuthorName));',
              'stream-map-code'
            )}
            className="flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer"
          >
            {copiedKey === 'stream-map-code' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Kopyalandı
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3 h-3" /> Kodu Kopyala
              </span>
            )}
          </button>
        </div>

        <div className="pt-3 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200">
          <div className="text-slate-500">// Stream ve Lambda ile Map oluşturma:</div>
          <div>
            <span className="text-indigo-400">Map</span>&lt;<span className="text-emerald-400">String</span>, <span className="text-emerald-400">String</span>&gt; bookAuthorMap = bookList.<span className="text-amber-400">stream</span>()
          </div>
          <div className="pl-6">
            .<span className="text-cyan-400">collect</span>(<span className="text-indigo-400">Collectors</span>.<span className="text-amber-400">toMap</span>(
          </div>
          <div className="pl-12">
            {syntaxMode === 'lambda' ? (
              <>
                <span className="text-orange-300">book</span> -&gt; <span className="text-orange-300">book</span>.<span className="text-amber-300">getName</span>(), <span className="text-slate-500">// KEY: Kitap İsmi (String)</span>
                <br />
                <span className="text-orange-300">book</span> -&gt; <span className="text-orange-300">book</span>.<span className="text-amber-300">getAuthorName</span>() <span className="text-slate-500">// VALUE: Yazarın İsmi (String)</span>
              </>
            ) : (
              <>
                <span className="text-indigo-400">Book</span>::<span className="text-amber-300">getName</span>, <span className="text-slate-500">// KEY (Method Reference)</span>
                <br />
                <span className="text-indigo-400">Book</span>::<span className="text-amber-300">getAuthorName</span> <span className="text-slate-500">// VALUE (Method Reference)</span>
              </>
            )}
          </div>
          <div className="pl-6">));</div>
        </div>
      </div>

      {/* Interactive Map Lookup Simulation Widget */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              İnteraktif Map.get(Key) Testi: O(1) Zaman Karmaşıklığı
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Toplam Giriş: {Object.keys(bookMap).length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
          {/* Key selector dropdown */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Key Seçin (Kitap İsmi):
            </label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {Object.keys(bookMap).map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Lookup Arrow */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-slate-500 mb-1">map.get(key)</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Value Display */}
          <div className="md:col-span-5 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Dönen Value (Yazar İsmi):
            </span>
            <div className="text-base font-bold text-amber-300 mt-1">
              {selectedAuthor || "Bulunamadı"}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Hızlı Hash Tablosu Erişimi (Average O(1))
            </span>
          </div>
        </div>
      </div>

      {/* Complete Map Table (Key -> Value) */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            Üretilen Map&lt;String, String&gt; Tablosu (Tam Liste)
          </span>
          <span className="text-xs font-mono text-amber-400">
            {Object.keys(bookMap).length} Giriş (Entry)
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {Object.entries(bookMap).map(([title, author], idx) => {
            const isSelected = selectedKey === title;
            return (
              <div
                key={title}
                onClick={() => setSelectedKey(title)}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                  isSelected ? 'bg-amber-500/5 border-l-2 border-amber-400' : ''
                }`}
              >
                {/* Left: Key */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-mono text-slate-500 w-6">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                      KEY
                    </span>
                    <div className="text-sm font-semibold text-white truncate">
                      &quot;{title}&quot;
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden sm:block text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Right: Value */}
                <div className="flex items-center justify-between sm:justify-end gap-3 min-w-0">
                  <div className="text-left sm:text-right min-w-0">
                    <span className="text-[10px] uppercase font-mono text-amber-500/80 tracking-wider">
                      VALUE
                    </span>
                    <div className="text-sm font-medium text-amber-300 truncate">
                      &quot;{author}&quot;
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(`"${title}" => "${author}"`, `row-${idx}`);
                    }}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Bu eşleşmeyi kopyala"
                  >
                    {copiedKey === `row-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
