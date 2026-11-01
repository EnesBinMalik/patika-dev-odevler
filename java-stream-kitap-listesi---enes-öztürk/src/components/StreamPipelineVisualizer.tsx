import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, ArrowRight, Check, X, Layers, Cpu, Database } from 'lucide-react';
import { Book } from '../types/book';

interface StreamPipelineVisualizerProps {
  books: Book[];
}

export const StreamPipelineVisualizer: React.FC<StreamPipelineVisualizerProps> = ({ books }) => {
  const [pipelineType, setPipelineType] = useState<'filter' | 'map'>('filter');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [processedItems, setProcessedItems] = useState<any[]>([]);

  const intervalRef = useRef<any>(null);

  // Reset when pipeline type or books changes
  useEffect(() => {
    handleReset();
  }, [pipelineType, books]);

  // Handle auto-playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNextStep();
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex, books.length]);

  const handleNextStep = () => {
    if (currentIndex >= books.length) {
      setIsPlaying(false);
      return;
    }

    const currentBook = books[currentIndex];
    let resultItem: any = null;

    if (pipelineType === 'filter') {
      const passed = currentBook.pageCount > 100;
      resultItem = {
        book: currentBook,
        passed,
        reason: passed ? `> 100 sayfa (${currentBook.pageCount})` : `≤ 100 sayfa (${currentBook.pageCount})`,
      };
    } else {
      // Map pipeline
      resultItem = {
        key: currentBook.name,
        value: currentBook.authorName,
      };
    }

    setProcessedItems(prev => [...prev, resultItem]);
    setCurrentIndex(prev => prev + 1);

    if (currentIndex + 1 >= books.length) {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setProcessedItems([]);
  };

  const activeBook = currentIndex < books.length ? books[currentIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              4. Stream Pipeline Adım Adım Görselleştirici
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Java Stream boru hattı verileri tek tek akışa alır, ara işlemleri uygular ve sonlandırıcı işlemle hedefe toplar.
          </p>
        </div>

        {/* Pipeline selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setPipelineType('filter')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              pipelineType === 'filter'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Filtre Pipeline (Sayfa &gt; 100)
          </button>
          <button
            onClick={() => setPipelineType('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              pipelineType === 'map'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Map Pipeline (Kitap &rarr; Yazar)
          </button>
        </div>
      </div>

      {/* Control Deck */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentIndex >= books.length}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentIndex >= books.length
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isPlaying
                ? 'bg-amber-500 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentIndex === 0 ? 'Otomatik Oynat' : 'Devam Et'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentIndex >= books.length || isPlaying}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Adım Adım İlerle</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Başa Al</span>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">İşlenen Eleman:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold tabular-nums">
            {currentIndex} / {books.length}
          </span>
          {currentIndex >= books.length && (
            <span className="text-emerald-400 font-medium">Boru Hattı Tamamlandı</span>
          )}
        </div>
      </div>

      {/* 3-Stage Visual Stream Pipeline Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Stage 1: Source (ArrayList) - 3 Cols */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Kaynak (Source)</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1.5">
              ArrayList&lt;Book&gt;.stream()
            </p>

            {/* List of items in source */}
            <div className="mt-3 space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {books.map((b, i) => {
                const isCurrent = i === currentIndex;
                const isDone = i < currentIndex;
                return (
                  <div
                    key={b.id || i}
                    className={`p-2 rounded text-xs flex items-center justify-between border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                        : isDone
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 line-through'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="font-mono text-[10px] shrink-0 ml-1 opacity-70">
                      {b.pageCount}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage 2: Intermediate Operation (Filter or Map Transformer) - 5 Cols */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Cpu className="w-24 h-24 text-cyan-400" />
          </div>

          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-cyan-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {pipelineType === 'filter'
                  ? '2. Ara İşlem: filter(Predicate<Book>)'
                  : '2. Dönüştürücü: toMap(Key, Value)'}
              </span>
            </div>
            
            <p className="text-[11px] font-mono text-cyan-400/80 mt-1.5">
              {pipelineType === 'filter'
                ? '.filter(b -> b.getPageCount() > 100)'
                : '.collect(Collectors.toMap(b::getName, b::getAuthor))'}
            </p>

            {/* Active element examination box */}
            <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Şu Anki İncelenen Eleman
              </span>

              {activeBook ? (
                <div className="space-y-2">
                  <div className="text-base font-bold text-white">
                    &quot;{activeBook.name}&quot;
                  </div>
                  <div className="text-xs text-slate-400">
                    Yazar: {activeBook.authorName} · {activeBook.publishDate}
                  </div>

                  {pipelineType === 'filter' ? (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-3">
                      <span className="text-xs font-mono text-slate-300">
                        Sayfa: <strong className="text-amber-400">{activeBook.pageCount}</strong>
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {activeBook.pageCount} &gt; 100 ?
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          activeBook.pageCount > 100
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {activeBook.pageCount > 100 ? 'TRUE (GEÇTİ)' : 'FALSE (ELENDİ)'}
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-800 text-xs font-mono text-amber-300">
                      Key: &quot;{activeBook.name}&quot; &rarr; Value: &quot;{activeBook.authorName}&quot;
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-xs text-slate-500">
                  {currentIndex >= books.length
                    ? 'Tüm elemanlar işlendi. Sonuç sağdaki hedef koleksiyona yazıldı.'
                    : 'Başlamak için "Otomatik Oynat" veya "Adım Adım İlerle" butonuna basın.'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
            <strong>Stream Prensibi:</strong> Stream&apos;ler tembeldir (lazy evaluation). Sonlandırıcı işlem çağrılana dek ara işlemler nesneleri bellekte tutmadan boru hattından akıtır.
          </div>
        </div>

        {/* Stage 3: Terminal Sink (List or Map) - 4 Cols */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
              <span>
                {pipelineType === 'filter'
                  ? '3. Hedef: List<Book> (Geçenler)'
                  : '3. Hedef: Map<String, String>'}
              </span>
            </div>

            <p className="text-[11px] font-mono text-slate-500 mt-1.5">
              .collect(Collectors.{pipelineType === 'filter' ? 'toList()' : 'toMap(...)'})
            </p>

            {/* Collected items */}
            <div className="mt-3 space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {pipelineType === 'filter' ? (
                processedItems
                  .filter(item => item.passed)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-white font-medium truncate">{item.book.name}</span>
                      </div>
                      <span className="font-mono text-emerald-400 text-[11px] shrink-0 ml-1">
                        {item.book.pageCount}s
                      </span>
                    </div>
                  ))
              ) : (
                processedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-xs"
                  >
                    <div className="text-amber-300 font-semibold truncate">&quot;{item.key}&quot;</div>
                    <div className="text-[11px] text-slate-400 truncate">&rarr; &quot;{item.value}&quot;</div>
                  </div>
                ))
              )}

              {processedItems.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  Henüz hedefe eleman toplanmadı.
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-right text-xs font-mono text-slate-400">
            Toplanan: {pipelineType === 'filter' ? processedItems.filter(i => i.passed).length : processedItems.length} Eleman
          </div>
        </div>

      </div>
    </div>
  );
};
