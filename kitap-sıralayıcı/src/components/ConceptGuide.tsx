import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export const ConceptGuide: React.FC = () => {
  return (
    <section className="py-10 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
            <span>Bölüm 05</span>
            <span aria-hidden="true">·</span>
            <span>Teorik Bilgiler & Mülakat Notları</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Java Koleksiyon Mimarisi Rehberi
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Bu projede uygulanan <code className="font-mono">Comparable</code>, <code className="font-mono">Comparator</code> ve <code className="font-mono">TreeSet</code> mekanizmalarının temel prensipleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Comparable vs Comparator */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold font-serif text-stone-900 dark:text-stone-100">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Comparable vs Comparator</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-100">Comparable (Doğal Sıralama):</strong> Sınıfın kendi tanımına implement edilir (<code className="font-mono">compareTo</code>). Kitap için varsayılan alfabetik A'dan Z'ye sıralama bu yolla tanımlanır.
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-100">Comparator (Esnek Sıralama):</strong> Sınıftan bağımsız olarak dışarıdan iletilir (<code className="font-mono">compare</code>). Sayfa sayısına göre sıralama gibi alternatif ölçütler için idealdir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-mono text-stone-500">
              java.lang.Comparable & java.util.Comparator
            </div>
          </div>

          {/* Card 2: TreeSet Neden Kullanılır? */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold font-serif text-stone-900 dark:text-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>TreeSet ve Sıralama Garantisi</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                <code className="font-mono">HashSet</code> elemanları rastgele hash sırasıyla saklarken, <code className="font-mono">TreeSet</code> arka planda Kırmızı-Siyah İkili Arama Ağacı (Red-Black Tree) barındırır.
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Yeni bir kitap eklendiğinde ağaç kökünden başlanarak <code className="font-mono">compareTo</code> çağrılır ve <span className="font-mono">O(log n)</span> zamanda doğru yerine yerleştirilir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-mono text-stone-500">
              NavigableSet & SortedSet Arayüzleri
            </div>
          </div>

          {/* Card 3: Hayati TreeSet Tuzağı (Tie-Breaker) */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold font-serif text-stone-900 dark:text-stone-100">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Eşitlik Tuzağı & Çözümü</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                TreeSet, iki elemanın eşit olup olmadığına <code className="font-mono">equals()</code> ile değil, sıralama metodunun <code className="font-mono">0</code> dönüp dönmediğine bakarak karar verir.
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Eğer iki farklı kitabın sayfa sayısı aynıysa ve sadece sayfa sayısına bakarsanız, TreeSet ikinci kitabı <strong>kopya kabul edip siler!</strong> Bu yüzden eşitlikte kitap ismine bakan tie-breaker kodladık.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-mono text-stone-500">
              diff == 0 ? b1.name.compareTo(b2.name) : diff
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
