import React, { useState } from 'react';
import { Play, Copy, Check, RotateCcw, Terminal } from 'lucide-react';
import { DEFAULT_PLANETS, runPhpSimulation, formatBatchPrintR } from '../utils/phpSimulator';

export const PromptTestCaseRunner: React.FC = () => {
  const testCounts = [2, 3, 2, 4, 5];

  // Run the 5 tests initially
  const [results, setResults] = useState<{ count: number; result: string[] }[]>(() => {
    return testCounts.map(cnt => ({
      count: cnt,
      result: runPhpSimulation(DEFAULT_PLANETS, cnt).finalResult,
    }));
  });

  const [copied, setCopied] = useState(false);

  const handleRunAll = () => {
    setResults(
      testCounts.map(cnt => ({
        count: cnt,
        result: runPhpSimulation(DEFAULT_PLANETS, cnt).finalResult,
      }))
    );
  };

  const handleRunSingle = (index: number) => {
    const updated = [...results];
    updated[index] = {
      count: testCounts[index],
      result: runPhpSimulation(DEFAULT_PLANETS, testCounts[index]).finalResult,
    };
    setResults(updated);
  };

  const batchOutput = formatBatchPrintR(results);

  const handleCopy = () => {
    navigator.clipboard.writeText(batchOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Ödev 5'li Test Koşumu &amp; Ekran Çıktısı</span>
            <span className="text-xs text-indigo-400 font-mono font-medium">
              print_r(fonksiyon($planets, N))
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Soruda verilen $planets dizisi üzerinde 2, 3, 2, 4 ve 5 elemanlı seçimlerin anlık çıktısı.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAll}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tümünü Yeniden Çalıştır</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-colors border border-slate-700/60"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Çıktıyı Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 individual tests interactive cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {testCounts.map((cnt, idx) => {
            const currentRes = results[idx]?.result || [];
            return (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500">Test #{idx + 1}</span>
                    <span className="font-mono text-indigo-400 font-semibold">
                      print_r(rastgeleSecici($planets, {cnt}));
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentRes.map((val, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                      >
                        <span className="text-slate-500 text-[10px] mr-1">[{itemIdx}]</span>
                        {val}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRunSingle(idx)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors shrink-0 flex items-center gap-1 font-mono"
                  title="Yalnızca bu testi yeniden çalıştır"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tekrarla</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Consolidated Terminal Output (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>PHP Konsol Çıktısı (Tam Metin)</span>
            </span>
            <span className="text-[11px] text-slate-500">CLI / Bash</span>
          </div>

          <pre className="text-emerald-400 text-xs leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre p-2 bg-black/40 rounded border border-slate-800/50">
            {batchOutput}
          </pre>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>5 fonksiyon çağrısı başarıyla çalıştırıldı</span>
            <span className="text-indigo-400">Enes Öztürk İmzalı</span>
          </div>
        </div>
      </div>
    </div>
  );
};
