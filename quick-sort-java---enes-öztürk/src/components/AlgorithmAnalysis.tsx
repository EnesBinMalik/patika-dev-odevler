import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { runBenchmark, BenchmarkResult } from '../utils/benchmark';

export const AlgorithmAnalysis: React.FC = () => {
  const [benchmarkSize, setBenchmarkSize] = useState<number>(1000);
  const [benchmarkDist, setBenchmarkDist] = useState<'random' | 'sorted' | 'reversed' | 'duplicates'>('random');
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const benchmarkData = runBenchmark(benchmarkSize, benchmarkDist);
      setResults(benchmarkData);
      setIsRunning(false);
    }, 50);
  };

  const fastestTime = results ? Math.min(...results.map((r) => Math.max(r.timeMs, 0.001))) : 1;

  return (
    <div className="space-y-8">
      {/* Overview Cards: Big-O Complexity */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Karmaşıklık Analizi (Complexity Analysis)
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Quick Sort, pratik uygulamalarda ve modern işlemci mimarilerinde önbellek (CPU Cache) dostu yapısıyla en hızlı genel amaçlı sıralama algoritmasıdır.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">En İyi Durum (Best)</span>
              <span className="text-emerald-400 font-semibold">&Theta;(n log n)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              O(n log n)
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Her adımda pivot alt diziyi tam ortadan iki eşit yarıya böldüğünde gerçekleşir.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Ortalama (Average)</span>
              <span className="text-amber-400 font-semibold">&Theta;(n log n)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              O(n log n)
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dengeli bölmelerde ortalama yaklaşık <code className="text-amber-300">1.39 &times; n log n</code> karşılaştırma yapılır.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">En Kötü Durum (Worst)</span>
              <span className="text-rose-400 font-semibold">&Theta;(n&sup2;)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400">
              O(n&sup2;)
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pivot hep en küçük ya da en büyük seçilirse ortaya çıkar. <strong>Medyan pivot</strong> ile engellenir.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Bellek (Space)</span>
              <span className="text-cyan-400 font-semibold">O(log n)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              In-Place
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dizi yerinde sıralanır. Yalnızca özyinelemeli çağrı yığını (call stack) için <code className="text-cyan-300">O(log n)</code> yer tutar.
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Architecture Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-100 mb-4">
          Bölümleme Şemaları Karşılaştırması
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Şema</th>
                <th className="py-3 px-4">Pivot Konumu</th>
                <th className="py-3 px-4">Ortalama Takas Sayısı</th>
                <th className="py-3 px-4">Kararlılık (Stability)</th>
                <th className="py-3 px-4">En Büyük Avantajı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-amber-400">Lomuto Şeması</td>
                <td className="py-3 px-4 font-mono">Son Eleman (arr[high])</td>
                <td className="py-3 px-4 font-mono text-slate-400">~ n takas</td>
                <td className="py-3 px-4 text-rose-400 font-medium">Kararsız (Unstable)</td>
                <td className="py-3 px-4 text-slate-300">Uygulaması ve anlaşılması en kolay yöntem.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-cyan-400">Hoare Şeması</td>
                <td className="py-3 px-4 font-mono">Orta Eleman (arr[mid])</td>
                <td className="py-3 px-4 font-mono text-emerald-400">~ n/3 takas (%65 daha az)</td>
                <td className="py-3 px-4 text-rose-400 font-medium">Kararsız (Unstable)</td>
                <td className="py-3 px-4 text-slate-300">Lomuto'ya göre 3 kat daha az takas yapar, çok hızlıdır.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-indigo-400">Üçün Medyanı (Median-of-3)</td>
                <td className="py-3 px-4 font-mono">Medyan(low, mid, high)</td>
                <td className="py-3 px-4 font-mono text-slate-400">~ n takas</td>
                <td className="py-3 px-4 text-rose-400 font-medium">Kararsız (Unstable)</td>
                <td className="py-3 px-4 text-slate-300">Zaten sıralı/ters sıralı dizilerde O(n²) worst-case'i tamamen engeller.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Benchmark Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Canlı Tarayıcı Benchmark Aracı
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enes Öztürk Quick Sort uygulamasını Merge Sort ve Bubble Sort ile aynı veri seti üzerinde anlık yarıştırın.
            </p>
          </div>

          {/* Test Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium px-2">Boyut (N):</span>
              {[500, 1000, 3000, 5000].map((s) => (
                <button
                  key={s}
                  onClick={() => setBenchmarkSize(s)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-mono ${
                    benchmarkSize === s
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium px-2">Dağılım:</span>
              {[
                { id: 'random', label: 'Rastgele' },
                { id: 'reversed', label: 'Ters' },
                { id: 'duplicates', label: 'Aynı' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setBenchmarkDist(d.id as any)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    benchmarkDist === d.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isRunning ? 'Çalıştırılıyor...' : 'Testi Çalıştır'}</span>
            </button>
          </div>
        </div>

        {/* Benchmark Results */}
        {results ? (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((res, i) => {
                const isQuickSort = res.algorithm.includes('Quick Sort');
                const isBubbleSort = res.algorithm.includes('Bubble');
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      isQuickSort
                        ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                        : isBubbleSort
                        ? 'bg-slate-950/70 border-slate-800 opacity-80'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="truncate mr-2">{res.algorithm.split('(')[0]}</span>
                      {isQuickSort && (
                        <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/20 px-1.5 py-0.5 rounded">
                          HIZLI
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums my-2">
                      {res.timeMs} <span className="text-sm font-normal text-slate-400">ms</span>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Karşılaştırma:</span>
                        <span className="font-mono text-slate-300">{res.comparisons.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Takas (Swap):</span>
                        <span className="font-mono text-slate-300">{res.swaps.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Karmaşıklık:</span>
                        <span className="font-mono text-slate-300">{res.timeComplexity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual comparative bar chart */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Çalışma Süresi Karşılaştırma Grafiği (Düşük olan daha iyi)
              </div>
              {results.map((res, i) => {
                const maxTime = Math.max(...results.map((r) => r.timeMs), 0.1);
                const widthPercent = Math.max(4, (res.timeMs / maxTime) * 100);
                const isQuick = res.algorithm.includes('Quick Sort');

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isQuick ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                        {res.algorithm}
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {res.timeMs} ms
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${widthPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isQuick
                            ? 'bg-amber-400'
                            : res.algorithm.includes('Bubble')
                            ? 'bg-rose-500'
                            : 'bg-cyan-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-xs">
            Yukarıdaki <span className="text-amber-400 font-medium">"Testi Çalıştır"</span> butonuna tıklayarak
            {benchmarkSize} elemanlı dizi üzerinde anlık hız testini başlatabilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
};
