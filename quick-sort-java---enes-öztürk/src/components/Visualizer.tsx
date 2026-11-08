import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  CheckCircle2,
  GitBranch,
  ArrowDown,
  Info
} from 'lucide-react';
import {
  generateQuickSortSteps,
  SimulationStep,
  PartitionStrategy,
} from '../utils/quickSortSimulator';

const PRESETS: { [key: string]: number[] } = {
  random: [45, 18, 72, 33, 91, 12, 64, 27, 85, 39, 56, 8, 77, 23],
  reversed: [95, 82, 71, 63, 50, 42, 35, 28, 19, 10, 4],
  almostSorted: [12, 18, 25, 41, 33, 52, 60, 78, 71, 89, 94],
  duplicates: [35, 12, 50, 35, 12, 70, 50, 35, 80, 12, 70],
};

export const Visualizer: React.FC = () => {
  const [strategy, setStrategy] = useState<PartitionStrategy>('lomuto');
  const [arrayPreset, setArrayPreset] = useState<string>('random');
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');

  const [initialArray, setInitialArray] = useState<number[]>(PRESETS.random);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(700); // ms per step

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps when initial array or strategy changes
  useEffect(() => {
    const generated = generateQuickSortSteps(initialArray, strategy);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [initialArray, strategy]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, steps.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleStepPrev = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePresetSelect = (presetKey: string) => {
    setArrayPreset(presetKey);
    setInitialArray(PRESETS[presetKey]);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    const rawValues = customInput
      .split(/[, ]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (rawValues.length < 3) {
      setCustomError('Lütfen en az 3 sayı girin.');
      return;
    }
    if (rawValues.length > 25) {
      setCustomError('Görsel netlik için en fazla 25 sayı girebilirsiniz.');
      return;
    }

    const numbers: number[] = [];
    for (const val of rawValues) {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        setCustomError(`Geçersiz sayı: "${val}"`);
        return;
      }
      numbers.push(Math.max(1, Math.min(num, 999)));
    }

    setInitialArray(numbers);
    setArrayPreset('custom');
    setShowCustomModal(false);
  };

  const currentStep = steps[currentStepIndex] || {
    array: initialArray,
    low: 0,
    high: initialArray.length - 1,
    pivotIndex: null,
    pivotValue: null,
    i: null,
    j: null,
    swapping: null,
    sortedIndices: [],
    description: 'Hazırlanıyor...',
    stepType: 'start',
    comparisons: 0,
    swaps: 0,
    recursionDepth: 0,
    activeRange: [0, initialArray.length - 1],
  };

  // Find maximum value to normalize bar heights
  const maxVal = Math.max(...currentStep.array, 100);

  return (
    <div className="space-y-6">
      {/* Configuration & Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Strategy selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Bölümleme Şeması:
            </span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setStrategy('lomuto')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  strategy === 'lomuto'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lomuto (Klasik)
              </button>
              <button
                onClick={() => setStrategy('hoare')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  strategy === 'hoare'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hoare (Hızlı)
              </button>
              <button
                onClick={() => setStrategy('median3')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  strategy === 'median3'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Üçün Medyanı (Median-3)
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Dizi Tipi:
            </span>
            <button
              onClick={() => handlePresetSelect('random')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                arrayPreset === 'random'
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-medium'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Rastgele
            </button>
            <button
              onClick={() => handlePresetSelect('reversed')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                arrayPreset === 'reversed'
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-medium'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Ters Sıralı
            </button>
            <button
              onClick={() => handlePresetSelect('almostSorted')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                arrayPreset === 'almostSorted'
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-medium'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Neredeyse Sıralı
            </button>
            <button
              onClick={() => handlePresetSelect('duplicates')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                arrayPreset === 'duplicates'
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-medium'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Yinelenenler
            </button>
            <button
              onClick={() => setShowCustomModal(true)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                arrayPreset === 'custom'
                  ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-medium'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Özel Dizi Gir
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Step Explanation Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-amber-400/10 text-amber-400 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5 font-medium">
                  Adım {currentStepIndex + 1} / {steps.length || 1} &middot;{' '}
                  <span className="text-amber-400 font-semibold">
                    {currentStep.stepType === 'finished'
                      ? 'Tamamlandı'
                      : currentStep.stepType === 'compare'
                      ? 'Karşılaştırma Yapılıyor'
                      : currentStep.stepType === 'swap'
                      ? 'Elemanlar Takas Edildi'
                      : currentStep.stepType === 'pivot-placed'
                      ? 'Pivot Konumlandırıldı'
                      : 'Bölümleme & Özyineleme'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-100 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            </div>

            {/* Recursion Depth badge */}
            <div className="shrink-0 flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>Özyineleme Derinliği: {currentStep.recursionDepth}</span>
            </div>
          </div>
        </div>

        {/* Visualizer Canvas Area */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-end">
          {/* Active Partition Window Indicator */}
          <div className="relative w-full h-[260px] flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-6">
            {currentStep.array.map((value, idx) => {
              const isPivot = idx === currentStep.pivotIndex;
              const isI = idx === currentStep.i;
              const isJ = idx === currentStep.j;
              const isSwapping =
                currentStep.swapping &&
                (idx === currentStep.swapping[0] || idx === currentStep.swapping[1]);
              const isSorted = currentStep.sortedIndices.includes(idx);
              const inActiveRange =
                idx >= currentStep.activeRange[0] &&
                idx <= currentStep.activeRange[1];

              const heightPercent = Math.max(15, (value / maxVal) * 90);

              // Determine bar styling
              let barColor = 'bg-slate-700/70 border-slate-600 text-slate-300';

              if (isSorted) {
                barColor = 'bg-emerald-500/90 border-emerald-400 text-emerald-950 font-bold shadow-lg shadow-emerald-500/20';
              } else if (isSwapping) {
                barColor = 'bg-rose-500 border-rose-300 text-white font-bold scale-105 shadow-lg shadow-rose-500/30';
              } else if (isPivot) {
                barColor = 'bg-amber-400 border-amber-300 text-slate-950 font-extrabold shadow-lg shadow-amber-400/30 ring-2 ring-amber-400/50';
              } else if (isI && isJ) {
                barColor = 'bg-cyan-500 border-cyan-300 text-slate-950 font-bold';
              } else if (isI) {
                barColor = 'bg-cyan-600/90 border-cyan-400 text-cyan-50 font-bold';
              } else if (isJ) {
                barColor = 'bg-indigo-600/90 border-indigo-400 text-indigo-50 font-bold';
              } else if (inActiveRange) {
                barColor = 'bg-slate-600 border-slate-500 text-slate-200';
              } else {
                // Dimmed (outside active range)
                barColor = 'bg-slate-800/40 border-slate-800/60 text-slate-500 opacity-40';
              }

              return (
                <div
                  key={idx}
                  className="flex-1 max-w-[50px] min-w-[20px] flex flex-col items-center justify-end group transition-all duration-300"
                >
                  {/* Top indicators: Pivot tag or Swap arrow */}
                  <div className="h-6 flex items-center justify-center mb-1">
                    {isPivot && (
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider animate-bounce">
                        PIVOT
                      </span>
                    )}
                    {isSwapping && (
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        TAKAS
                      </span>
                    )}
                  </div>

                  {/* The Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg border flex flex-col items-center justify-start pt-1.5 transition-all duration-300 relative ${barColor}`}
                  >
                    <span className="text-xs sm:text-sm font-mono tabular-nums leading-none">
                      {value}
                    </span>
                  </div>

                  {/* Index and Pointer labels */}
                  <div className="w-full flex flex-col items-center pt-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      [{idx}]
                    </span>

                    {/* Pointer markers: i and j */}
                    <div className="h-6 flex items-center justify-center gap-1 mt-0.5">
                      {isI && (
                        <span className="text-[10px] font-bold px-1 rounded bg-cyan-400 text-slate-950 shadow-sm">
                          i
                        </span>
                      )}
                      {isJ && (
                        <span className="text-[10px] font-bold px-1 rounded bg-indigo-400 text-slate-950 shadow-sm">
                          j
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Partition Range visual brackets */}
          <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Aktif Bölümlenen Alt Dizi:</span>
              <span className="font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                arr[{currentStep.activeRange[0]} .. {currentStep.activeRange[1]}]
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
                <span>Pivot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400 inline-block"></span>
                <span>i (Sol)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-400 inline-block"></span>
                <span>j (Sağ/Tarama)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span>Sıralı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playback Controls & Progress Bar Deck */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Step buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Başa Dön"
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleStepPrev}
                disabled={currentStepIndex === 0}
                title="Bir Adım Geri"
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span className="text-xs uppercase tracking-wide">
                  {isPlaying ? 'Duraklat' : currentStepIndex >= steps.length - 1 ? 'Yeniden Başlat' : 'Oynat'}
                </span>
              </button>

              <button
                onClick={handleStepNext}
                disabled={currentStepIndex >= steps.length - 1}
                title="Bir Adım İleri"
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Step Slider */}
            <div className="flex-1 max-w-md flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                Adım {currentStepIndex + 1}
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(0, steps.length - 1)}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                {steps.length}
              </span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Hız:</span>
              <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                {[
                  { label: '0.5x', speed: 1200 },
                  { label: '1x', speed: 700 },
                  { label: '2x', speed: 350 },
                  { label: '4x', speed: 120 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setPlaybackSpeed(item.speed)}
                    className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                      playbackSpeed === item.speed
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Eleman Sayısı (N)</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {currentStep.array.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Dizi boyutu</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Karşılaştırmalar</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            {currentStep.comparisons}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Yapılan if (arr[j] &le; pivot)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Takas (Swap) Sayısı</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {currentStep.swaps}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">In-place eleman yer değişimi</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Sıralanan Elemanlar</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {currentStep.sortedIndices.length} / {currentStep.array.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Kesin yerleşen pivotlar</div>
        </div>
      </div>

      {/* Custom Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Özel Dizi Tanımlayın
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Virgül veya boşluk ile ayrılmış 3 ile 25 arasında pozitif tamsayı girin.
              Örnek: <code className="text-amber-400 font-mono">42, 17, 89, 3, 56, 21, 74</code>
            </p>

            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="38, 27, 43, 3, 9, 82, 10"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {customError && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    {customError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Uygula ve Sırala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
