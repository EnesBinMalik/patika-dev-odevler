import React, { useState } from 'react';
import { BookOpen, Layers, ArrowUpDown, Terminal } from 'lucide-react';

interface HeroSectionProps {
  totalBooks: number;
  onExploreCode: () => void;
  onExploreTree: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalBooks,
  onExploreCode,
  onExploreTree,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative pt-6 pb-10 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <span>Java Collections Framework</span>
              <span aria-hidden="true">·</span>
              <span>Comparable & Comparator</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">Enes Öztürk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              Kitap Nesnelerini İki Ayrı Ölçütle Sıralayan TreeSet Mimarisi
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-sm text-stone-800 dark:text-stone-200">Book</code> sınıfı 
              üzerinde <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-sm text-stone-800 dark:text-stone-200">Comparable&lt;Book&gt;</code> arayüzü ile 
              kitapları A'dan Z'ye isme göre sıralayın; ardından özel bir <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-sm text-stone-800 dark:text-stone-200">Comparator</code> ile 
              sayfa sayısına göre ikinci bir <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-sm text-stone-800 dark:text-stone-200">Set</code> yapısında organize edin.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreTree}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-xs transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>TreeSet Ağacını Görselleştir</span>
              </button>
              <button
                onClick={onExploreCode}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>Java Kodunu & Çıktıyı İncele</span>
              </button>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg bg-stone-900 aspect-16/10">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_book_study_1793514049449.jpg"
                  alt="Klasik kütüphane ve kitap inceleme masası"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-800 text-stone-200">
                  <BookOpen className="w-12 h-12 mb-3 text-stone-400" />
                  <p className="font-serif text-lg font-bold">Kitap Sıralayıcı</p>
                  <p className="text-xs text-stone-400 mt-1">TreeSet & Comparable Mimarisi</p>
                </div>
              )}
              {/* Overlay quote card */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-transparent">
                <p className="text-xs text-stone-300 font-mono">
                  TreeSet&lt;Book&gt; · Red-Black Tree · O(log n)
                </p>
                <p className="text-sm font-serif italic text-stone-100 mt-0.5">
                  "Bir kitap, içimizdeki donmuş denizi parçalayacak bir balta olmalıdır." — Franz Kafka
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="space-y-1">
            <span className="text-xs text-stone-500 dark:text-stone-400">Aktif Nesne Sayısı</span>
            <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {totalBooks} Kitap
            </div>
            <div className="text-xs text-stone-500">Standart 5 nesne</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-stone-500 dark:text-stone-400">1. Set Ölçütü</span>
            <div className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>İsme Göre (A-Z)</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">Comparable.compareTo()</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-stone-500 dark:text-stone-400">2. Set Ölçütü</span>
            <div className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span>Sayfa Sayısı</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">Comparator.compare()</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-stone-500 dark:text-stone-400">Veri Yapısı Modeli</span>
            <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
              TreeSet&lt;Book&gt;
            </div>
            <div className="text-xs text-stone-500">Kırmızı-Siyah Ağaç tabanlı</div>
          </div>
        </div>
      </div>
    </section>
  );
};
