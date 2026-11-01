import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';
import { generateTraceSteps } from '../utils/triangleGenerators';
import { TraceStep } from '../types';

export const StepVisualizer: React.FC = () => {
  const [visualN, setVisualN] = useState<number>(6); // 6 is ideal for educational step debugging
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(600); // ms per step

  const traceSteps: TraceStep[] = generateTraceSteps(visualN, 'O', 120);
  const currentStep = traceSteps[currentStepIndex] || traceSteps[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= traceSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, traceSteps.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < traceSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Determine active highlighted line in the JavaScript function snippet
  const getActiveCodeLine = () => {
    switch (currentStep.activeLoop) {
      case 'while-check':
        return 5; // while (i <= satirSayisi)
      case 'for-iteration':
        return 8; // for (let j = 0; j < i; j++)
      case 'row-complete':
        return 13; // console.log(satir); i++;
      case 'done':
        return 17; // console.log("Ödev Hazırlayan: Enes Öztürk");
      default:
        return 3;
    }
  };

  const activeLine = getActiveCodeLine();

  return (
    <div className="space-y-6">
      {/* Editorial Title Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <span>Döngü Mekaniği</span>
              <span aria-hidden="true">·</span>
              <span>Görsel Algoritma İzleyici</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Adım Adım While ve For Döngüsü Simülatörü
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl text-balance">
              Dış <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">while</code> döngüsü her bir satırı, iç <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">for</code> döngüsü ise o satırdaki &apos;O&apos; karakterlerini adım adım nasıl inşa eder? Buradan canlı izleyin.
            </p>
          </div>

          {/* Row selection for simulation */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg text-xs">
            <span className="text-slate-500 dark:text-slate-400 px-1 font-medium">Örnek Satır:</span>
            {[4, 6, 8, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setVisualN(n);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                  visualN === n
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Playback action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            title="Başa Dön"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            title="Önceki Adım"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Durdur</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Oynat</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex >= traceSteps.length - 1}
            title="Sonraki Adım"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Scrubber & Indicator */}
        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Adım {currentStepIndex + 1} / {traceSteps.length}
          </span>
          <input
            type="range"
            min="0"
            max={traceSteps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Speed adjustment */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Hız:</span>
          {[
            { label: '0.5x', ms: 900 },
            { label: '1x', ms: 500 },
            { label: '2x', ms: 250 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setPlaySpeed(s.ms)}
              className={`px-2 py-0.5 rounded font-mono ${
                playSpeed === s.ms
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time State & Step Explanation Callout */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          {currentStepIndex + 1}
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
            <span>Şu Anki İşlem:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {currentStep.activeLoop === 'while-check' && 'WHILE Koşul Kontrolü'}
              {currentStep.activeLoop === 'for-iteration' && 'FOR Döngüsü Karakter Ekleme'}
              {currentStep.activeLoop === 'row-complete' && 'Satır Tamamlandı & İlerleme'}
              {currentStep.activeLoop === 'done' && 'Program Bitti & İmza Basıldı'}
            </span>
          </div>
          <p className="text-xs text-indigo-900/80 dark:text-indigo-300/90 leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Two Column Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Code Snippet with Active Line Highlight (6 cols) */}
        <div className="lg:col-span-6 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-md">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <span>ucgen({visualN}) Algoritma Yürütmesi</span>
            <span className="text-emerald-400">Aktif Satır: {activeLine}</span>
          </div>

          <div className="space-y-1 text-slate-300">
            {[
              { num: 1, text: `function ucgen(satirSayisi) {` },
              { num: 2, text: `  // i satır sayacı (1'den başlar)` },
              { num: 3, text: `  let i = 1;` },
              { num: 4, text: `` },
              { num: 5, text: `  while (i <= satirSayisi) {` },
              { num: 6, text: `    let satir = "";` },
              { num: 7, text: `    // İç döngü: i adet 'O' karakteri basar` },
              { num: 8, text: `    for (let j = 0; j < i; j++) {` },
              { num: 9, text: `      satir += (j === 0 ? "O" : " O");` },
              { num: 10, text: `    }` },
              { num: 11, text: `` },
              { num: 12, text: `    console.log(satir);` },
              { num: 13, text: `    i++; // Satır sayacını artır` },
              { num: 14, text: `  }` },
              { num: 15, text: `` },
              { num: 16, text: `  // Enes Öztürk Ödev İmzası` },
              { num: 17, text: `  console.log("Ödev Hazırlayan: Enes Öztürk");` },
              { num: 18, text: `}` },
            ].map((line) => {
              const isHighlighted = line.num === activeLine;
              return (
                <div
                  key={line.num}
                  className={`flex items-center px-2 py-0.5 rounded transition-colors ${
                    isHighlighted
                      ? 'bg-indigo-600/30 text-white border-l-2 border-indigo-400 font-semibold'
                      : 'hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <span className="w-6 text-slate-600 text-right pr-3 select-none text-[10px]">
                    {line.num}
                  </span>
                  <span className="whitespace-pre">{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Variable Table + Live Triangle Stage (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Live Variable Inspector */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Bellek Değişkenleri (Variables Inspector)
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">satirSayisi</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{visualN}</span>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block font-sans">i (while sayacı)</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{currentStep.i}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-sans">j (for sayacı)</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{currentStep.j}</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-sans">while durumu</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                  {currentStep.i <= visualN ? 'DEVAM' : 'BİTTİ'}
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 font-mono text-sm shadow-md min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="text-[11px] text-slate-500 pb-2 mb-3 border-b border-slate-800 flex justify-between">
                <span>Canlı Çıktı Görünümü</span>
                <span>{currentStep.accumulatedOutput.length} satır üretildi</span>
              </div>

              <div className="space-y-1">
                {currentStep.accumulatedOutput.map((row, idx) => (
                  <div key={idx} className="flex items-baseline text-emerald-400 text-xs sm:text-sm">
                    <span className="w-6 text-slate-600 text-xs pr-2 text-right select-none">{idx + 1}</span>
                    <span className="font-bold tracking-widest">{row}</span>
                  </div>
                ))}

                {/* In-progress line currently being built */}
                {currentStep.currentLine && currentStep.activeLoop === 'for-iteration' && (
                  <div className="flex items-baseline text-amber-300 text-xs sm:text-sm animate-pulse">
                    <span className="w-6 text-slate-600 text-xs pr-2 text-right select-none">{currentStep.i}</span>
                    <span className="font-bold tracking-widest">{currentStep.currentLine}</span>
                    <span className="ml-2 text-[10px] text-amber-400/80 font-sans">(oluşturuluyor...)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hazırlayan: <strong className="text-white">Enes Öztürk</strong></span>
              <span className="text-indigo-400">while + for döngüleri doğrulanıyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
