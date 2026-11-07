import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Shuffle, TrendingUp, Code2, Sliders } from 'lucide-react';
import { SortingAlgorithm, SortingStep } from '../../types';

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState<number>(14);
  const [speed, setSpeed] = useState<number>(250);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial random array
  const generateRandomArray = (size: number) => {
    const arr: number[] = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * 85) + 10);
    }
    return arr;
  };

  const [initialArray, setInitialArray] = useState<number[]>(() => generateRandomArray(14));

  // --- Step Generators for each algorithm ---
  const generateSteps = (arr: number[], algo: SortingAlgorithm): SortingStep[] => {
    const list = [...arr];
    const generated: SortingStep[] = [];
    let comparisons = 0;
    let swaps = 0;

    // Push initial step
    generated.push({
      array: [...list],
      comparedIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      description: 'Sıralama hazır. Başlat düğmesine tıklayarak veya Adım Adım ilerleyerek izleyebilirsiniz.',
      codeLine: 1,
      comparisons: 0,
      swaps: 0,
    });

    if (algo === 'bubble') {
      const n = list.length;
      const sorted: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          generated.push({
            array: [...list],
            comparedIndices: [j, j + 1],
            swappedIndices: [],
            sortedIndices: [...sorted],
            description: `Karşılaştırma: array[${j}] (${list[j]}) ve array[${j + 1}] (${list[j + 1]})`,
            codeLine: 3,
            comparisons,
            swaps,
          });

          if (list[j] > list[j + 1]) {
            swaps++;
            const temp = list[j];
            list[j] = list[j + 1];
            list[j + 1] = temp;

            generated.push({
              array: [...list],
              comparedIndices: [],
              swappedIndices: [j, j + 1],
              sortedIndices: [...sorted],
              description: `Yer Değiştirildi (Swap): ${list[j + 1]} > ${list[j]}`,
              codeLine: 5,
              comparisons,
              swaps,
            });
          }
        }
        sorted.push(n - 1 - i);
      }
      sorted.push(0);
      generated.push({
        array: [...list],
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: list.map((_, idx) => idx),
        description: 'Kabarcık Sıralaması (Bubble Sort) tamamlandı! Dizi tamamen sıralandı.',
        codeLine: 8,
        comparisons,
        swaps,
      });
    } else if (algo === 'selection') {
      const n = list.length;
      const sorted: number[] = [];
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          generated.push({
            array: [...list],
            comparedIndices: [minIdx, j],
            swappedIndices: [],
            sortedIndices: [...sorted],
            description: `Minimum Aranıyor: Mevcut en küçük array[${minIdx}] (${list[minIdx]}) ile array[${j}] (${list[j]}) karşılaştırılıyor.`,
            codeLine: 4,
            comparisons,
            swaps,
          });

          if (list[j] < list[minIdx]) {
            minIdx = j;
          }
        }

        if (minIdx !== i) {
          swaps++;
          const temp = list[i];
          list[i] = list[minIdx];
          list[minIdx] = temp;

          generated.push({
            array: [...list],
            comparedIndices: [],
            swappedIndices: [i, minIdx],
            sortedIndices: [...sorted, i],
            description: `Minimum eleman (${list[i]}) pozisyon ${i}'ye taşındı.`,
            codeLine: 7,
            comparisons,
            swaps,
          });
        }
        sorted.push(i);
      }
      generated.push({
        array: [...list],
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: list.map((_, idx) => idx),
        description: 'Seçmeli Sıralama (Selection Sort) tamamlandı!',
        codeLine: 9,
        comparisons,
        swaps,
      });
    } else if (algo === 'insertion') {
      const n = list.length;
      const sorted: number[] = [0];
      for (let i = 1; i < n; i++) {
        const key = list[i];
        let j = i - 1;

        generated.push({
          array: [...list],
          comparedIndices: [i],
          swappedIndices: [],
          sortedIndices: [...sorted],
          description: `Seçilen Eleman: ${key} (İndeks: ${i}). Sıralı sol bölüme yerleştirilecek.`,
          codeLine: 2,
          comparisons,
          swaps,
        });

        while (j >= 0) {
          comparisons++;
          if (list[j] > key) {
            swaps++;
            list[j + 1] = list[j];
            generated.push({
              array: [...list],
              comparedIndices: [j, j + 1],
              swappedIndices: [j + 1],
              sortedIndices: [...sorted],
              description: `${list[j]} > ${key} olduğu için ${list[j]} sağa kaydırıldı.`,
              codeLine: 5,
              comparisons,
              swaps,
            });
            j--;
          } else {
            break;
          }
        }
        list[j + 1] = key;
        sorted.push(i);

        generated.push({
          array: [...list],
          comparedIndices: [],
          swappedIndices: [j + 1],
          sortedIndices: [...sorted],
          description: `${key} değeri uygun konuma (indeks ${j + 1}) yerleştirildi.`,
          codeLine: 8,
          comparisons,
          swaps,
        });
      }
      generated.push({
        array: [...list],
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: list.map((_, idx) => idx),
        description: 'Eklemeli Sıralama (Insertion Sort) tamamlandı!',
        codeLine: 10,
        comparisons,
        swaps,
      });
    } else if (algo === 'quick') {
      const sorted: number[] = [];

      const quickSortHelper = (low: number, high: number) => {
        if (low < high) {
          const pivotIdx = partition(low, high);
          sorted.push(pivotIdx);
          quickSortHelper(low, pivotIdx - 1);
          quickSortHelper(pivotIdx + 1, high);
        } else if (low === high) {
          sorted.push(low);
        }
      };

      const partition = (low: number, high: number): number => {
        const pivot = list[high];
        let i = low - 1;

        generated.push({
          array: [...list],
          comparedIndices: [],
          swappedIndices: [],
          pivotIndex: high,
          sortedIndices: [...sorted],
          description: `Pivot Seçildi: array[${high}] (${pivot}). Bu değerden küçükler sola, büyükler sağa ayrılacak.`,
          codeLine: 3,
          comparisons,
          swaps,
        });

        for (let j = low; j < high; j++) {
          comparisons++;
          generated.push({
            array: [...list],
            comparedIndices: [j, high],
            swappedIndices: [],
            pivotIndex: high,
            sortedIndices: [...sorted],
            description: `Karşılaştırma: array[${j}] (${list[j]}) ve Pivot (${pivot})`,
            codeLine: 5,
            comparisons,
            swaps,
          });

          if (list[j] < pivot) {
            i++;
            if (i !== j) {
              swaps++;
              const temp = list[i];
              list[i] = list[j];
              list[j] = temp;
              generated.push({
                array: [...list],
                comparedIndices: [],
                swappedIndices: [i, j],
                pivotIndex: high,
                sortedIndices: [...sorted],
                description: `${list[i]} pivot'tan küçük olduğu için sol bölüme alındı.`,
                codeLine: 7,
                comparisons,
                swaps,
              });
            }
          }
        }

        swaps++;
        const temp = list[i + 1];
        list[i + 1] = list[high];
        list[high] = temp;

        generated.push({
          array: [...list],
          comparedIndices: [],
          swappedIndices: [i + 1, high],
          pivotIndex: i + 1,
          sortedIndices: [...sorted, i + 1],
          description: `Pivot (${pivot}) kesin doğru konumuna (${i + 1}. indeks) yerleştirildi.`,
          codeLine: 10,
          comparisons,
          swaps,
        });

        return i + 1;
      };

      quickSortHelper(0, list.length - 1);

      generated.push({
        array: [...list],
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: list.map((_, idx) => idx),
        description: 'Hızlı Sıralama (Quick Sort) tamamlandı!',
        codeLine: 12,
        comparisons,
        swaps,
      });
    } else if (algo === 'merge') {
      const sorted: number[] = [];

      const mergeSortHelper = (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
      };

      const merge = (start: number, mid: number, end: number) => {
        const leftArr = list.slice(start, mid + 1);
        const rightArr = list.slice(mid + 1, end + 1);

        generated.push({
          array: [...list],
          comparedIndices: Array.from({ length: end - start + 1 }, (_, k) => start + k),
          swappedIndices: [],
          sortedIndices: [...sorted],
          description: `Birleştirme Adımı: Sol [${start}..${mid}] ve Sağ [${mid + 1}..${end}] alt dizileri harmanlanıyor.`,
          codeLine: 4,
          comparisons,
          swaps,
        });

        let i = 0;
        let j = 0;
        let k = start;

        while (i < leftArr.length && j < rightArr.length) {
          comparisons++;
          if (leftArr[i] <= rightArr[j]) {
            swaps++;
            list[k] = leftArr[i];
            i++;
          } else {
            swaps++;
            list[k] = rightArr[j];
            j++;
          }
          generated.push({
            array: [...list],
            comparedIndices: [k],
            swappedIndices: [k],
            sortedIndices: [...sorted],
            description: `array[${k}] = ${list[k]} sıralı olarak yerleştirildi.`,
            codeLine: 7,
            comparisons,
            swaps,
          });
          k++;
        }

        while (i < leftArr.length) {
          swaps++;
          list[k] = leftArr[i];
          i++;
          k++;
        }

        while (j < rightArr.length) {
          swaps++;
          list[k] = rightArr[j];
          j++;
          k++;
        }
      };

      mergeSortHelper(0, list.length - 1);

      generated.push({
        array: [...list],
        comparedIndices: [],
        swappedIndices: [],
        sortedIndices: list.map((_, idx) => idx),
        description: 'Birleştirmeli Sıralama (Merge Sort) başarıyla tamamlandı!',
        codeLine: 11,
        comparisons,
        swaps,
      });
    }

    return generated;
  };

  // Re-generate steps when array or algorithm changes
  useEffect(() => {
    const s = generateSteps(initialArray, algorithm);
    setSteps(s);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [initialArray, algorithm]);

  // Autoplay playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleNewRandom = () => {
    setIsPlaying(false);
    setInitialArray(generateRandomArray(arraySize));
  };

  const handleReversedArray = () => {
    setIsPlaying(false);
    const rev: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      rev.push(Math.round(95 - (i * 80) / arraySize));
    }
    setInitialArray(rev);
  };

  const handleNearlySorted = () => {
    setIsPlaying(false);
    const sorted: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      sorted.push(15 + i * 5);
    }
    // Swap 2 random elements
    if (sorted.length > 3) {
      const temp = sorted[2];
      sorted[2] = sorted[sorted.length - 2];
      sorted[sorted.length - 2] = temp;
    }
    setInitialArray(sorted);
  };

  const handleCustomArray = () => {
    if (!customInput.trim()) return;
    const parts = customInput.split(',').map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x) && x > 0 && x <= 100);
    if (parts.length < 3) return;
    setIsPlaying(false);
    setArraySize(parts.length);
    setInitialArray(parts);
    setCustomInput('');
  };

  const currentStep = steps[currentStepIdx] || {
    array: initialArray,
    comparedIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    description: '',
    codeLine: 1,
    comparisons: 0,
    swaps: 0,
  };

  // Big-O metadata
  const algoSpecs: Record<
    SortingAlgorithm,
    { name: string; best: string; avg: string; worst: string; space: string; stable: boolean }
  > = {
    bubble: { name: 'Kabarcık Sıralaması (Bubble Sort)', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
    selection: { name: 'Seçmeli Sıralama (Selection Sort)', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false },
    insertion: { name: 'Eklemeli Sıralama (Insertion Sort)', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
    quick: { name: 'Hızlı Sıralama (Quick Sort)', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
    merge: { name: 'Birleştirmeli Sıralama (Merge Sort)', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
  };

  const codeSnippets: Record<SortingAlgorithm, string[]> = {
    bubble: [
      'function bubbleSort(arr) {',
      '  for (let i = 0; i < arr.length; i++) {',
      '    for (let j = 0; j < arr.length - i - 1; j++) {',
      '      if (arr[j] > arr[j + 1]) {',
      '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
      '      }',
      '    }',
      '  }',
      '  return arr;',
      '}',
    ],
    selection: [
      'function selectionSort(arr) {',
      '  for (let i = 0; i < arr.length; i++) {',
      '    let min = i;',
      '    for (let j = i + 1; j < arr.length; j++) {',
      '      if (arr[j] < arr[min]) min = j;',
      '    }',
      '    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];',
      '  }',
      '  return arr;',
      '}',
    ],
    insertion: [
      'function insertionSort(arr) {',
      '  for (let i = 1; i < arr.length; i++) {',
      '    let key = arr[i]; let j = i - 1;',
      '    while (j >= 0 && arr[j] > key) {',
      '      arr[j + 1] = arr[j];',
      '      j--;',
      '    }',
      '    arr[j + 1] = key;',
      '  }',
      '  return arr;',
      '}',
    ],
    quick: [
      'function quickSort(arr, low = 0, high = arr.length - 1) {',
      '  if (low < high) {',
      '    let pivotIdx = partition(arr, low, high);',
      '    quickSort(arr, low, pivotIdx - 1);',
      '    quickSort(arr, pivotIdx + 1, high);',
      '  }',
      '  return arr;',
      '}',
    ],
    merge: [
      'function mergeSort(arr) {',
      '  if (arr.length <= 1) return arr;',
      '  const mid = Math.floor(arr.length / 2);',
      '  const left = mergeSort(arr.slice(0, mid));',
      '  const right = mergeSort(arr.slice(mid));',
      '  return merge(left, right);',
      '}',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <span>04. Modül</span>
              <span>·</span>
              <span>Algoritmik Karşılaştırma & Sıralama Simülatörü</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Sıralama Algoritmaları (Sorting Visualizer)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Bubble, Quick, Selection, Insertion ve Merge Sort algoritmalarının çalışma mekanizmasını çubuk grafikler ve karşılaştırma sayaçları üzerinden adım adım izleyin.
            </p>
          </div>

          {/* Algorithm Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
            {(['bubble', 'quick', 'selection', 'insertion', 'merge'] as SortingAlgorithm[]).map((algoKey) => (
              <button
                key={algoKey}
                onClick={() => setAlgorithm(algoKey)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  algorithm === algoKey
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {algoKey.charAt(0).toUpperCase() + algoKey.slice(1)} Sort
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: The Bar Chart */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        {/* Top Indicators & Metrics Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400">Adım: </span>
              <span className="text-white font-bold tabular-nums">
                {currentStepIdx} / {steps.length > 0 ? steps.length - 1 : 0}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Karşılaştırma: </span>
              <span className="text-amber-400 font-bold tabular-nums">{currentStep.comparisons}</span>
            </div>
            <div>
              <span className="text-slate-400">Yer Değiştirme (Swap): </span>
              <span className="text-rose-400 font-bold tabular-nums">{currentStep.swaps}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span>
              Karşılaştırılan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
              Swap / Değişen
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span>
              Pivot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
              Sıralı (Sorted)
            </span>
          </div>
        </div>

        {/* Visual Bar Canvas */}
        <div className="py-8 min-h-[320px] flex items-end justify-center gap-2 md:gap-3 bg-slate-950/60 rounded-xl px-4 my-4 border border-slate-800/80">
          {currentStep.array.map((value, idx) => {
            const isCompared = currentStep.comparedIndices.includes(idx);
            const isSwapped = currentStep.swappedIndices.includes(idx);
            const isPivot = currentStep.pivotIndex === idx;
            const isSorted = currentStep.sortedIndices.includes(idx);

            let barColor = 'bg-slate-700 hover:bg-slate-600';
            if (isSwapped) {
              barColor = 'bg-rose-500 shadow-lg shadow-rose-950 scale-105';
            } else if (isCompared) {
              barColor = 'bg-amber-400 shadow-lg shadow-amber-950 scale-105';
            } else if (isPivot) {
              barColor = 'bg-purple-500 shadow-lg shadow-purple-950';
            } else if (isSorted) {
              barColor = 'bg-emerald-500 shadow-sm shadow-emerald-950';
            }

            const heightPercent = Math.max(12, Math.round((value / 100) * 100));

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end max-w-[50px] transition-all duration-150"
              >
                <span className="text-[10px] font-mono font-bold text-slate-300 mb-1 tabular-nums">
                  {value}
                </span>
                <div
                  style={{ height: `${heightPercent * 2.2}px` }}
                  className={`w-full rounded-t-lg transition-all duration-200 ${barColor}`}
                ></div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Real-time Narrative Description */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-mono text-indigo-300 flex items-center justify-between">
          <span>&gt; {currentStep.description || 'Hazır.'}</span>
          <span className="text-slate-500 text-[11px] font-sans">
            {algoSpecs[algorithm].name}
          </span>
        </div>

        {/* Playback Controls Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          {/* Main Transport Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBackward}
              disabled={currentStepIdx === 0}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Bir Adım Geri"
            >
              <Rewind className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Durdur' : 'Oynat'}</span>
            </button>
            <button
              onClick={handleStepForward}
              disabled={currentStepIdx >= steps.length - 1}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Bir Adım İleri"
            >
              <FastForward className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Array Size Controls */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Hız:</span>
              <input
                type="range"
                min="40"
                max="600"
                step="20"
                value={640 - speed}
                onChange={(e) => setSpeed(640 - parseInt(e.target.value, 10))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="text-slate-500 tabular-nums">{speed}ms</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Eleman:</span>
              <input
                type="range"
                min="8"
                max="24"
                value={arraySize}
                onChange={(e) => {
                  const s = parseInt(e.target.value, 10);
                  setArraySize(s);
                  setInitialArray(generateRandomArray(s));
                }}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="text-slate-500 tabular-nums">{arraySize}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewRandom}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Rastgele</span>
            </button>
            <button
              onClick={handleReversedArray}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="En Kötü Durum (Worst Case)"
            >
              Ters Sıralı
            </button>
            <button
              onClick={handleNearlySorted}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="En İyi Durum (Best Case)"
            >
              Neredeyse Sıralı
            </button>
          </div>
        </div>
      </div>

      {/* Details & Complexity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Big-O Complexity Panel */}
        <div className="lg:col-span-5 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Zaman ve Alan Karmaşıklığı (Big-O Analizi)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">En İyi (Best Case):</span>
              <span className="text-emerald-400 font-bold text-sm">{algoSpecs[algorithm].best}</span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Ortalama (Average):</span>
              <span className="text-amber-400 font-bold text-sm">{algoSpecs[algorithm].avg}</span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">En Kötü (Worst Case):</span>
              <span className="text-rose-400 font-bold text-sm">{algoSpecs[algorithm].worst}</span>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Bellek (Space):</span>
              <span className="text-indigo-400 font-bold text-sm">{algoSpecs[algorithm].space}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 font-sans leading-relaxed">
            {algorithm === 'bubble' &&
              'Kabarcık Sıralaması, yan yana elemanları karşılaştırıp en büyük elemanı her geçişte en sona "kabarcık" gibi taşır. Basit ancak O(n²) nedeniyle büyük veri kümelerinde yavaştır.'}
            {algorithm === 'selection' &&
              'Seçmeli Sıralama, kalan dizideki en küçük elemanı bulup sıradaki konuma koyar. Karşılaştırma sayısı sabit O(n²) olsa da swap sayısı düşüktür (O(n)).'}
            {algorithm === 'insertion' &&
              'Eklemeli Sıralama, elemanları tek tek sıralı sol alt diziye yerleştirir. Neredeyse sıralı dizilerde O(n) ile çok hızlı çalışır.'}
            {algorithm === 'quick' &&
              'Hızlı Sıralama (Quick Sort), "Böl ve Yönet" (Divide & Conquer) stratejisi kullanır. Pivot etrafında bölme işlemi yaparak pratikte en hızlı çalışan genel amaçlı algoritmalardandır.'}
            {algorithm === 'merge' &&
              'Birleştirmeli Sıralama (Merge Sort), diziyi tek eleman kalana dek ikiye böler, sonra sıralı birleştirir. Kararlı (Stable) ve her durumda O(n log n) garantilidir ancak O(n) ek bellek gerektirir.'}
          </div>

          {/* Custom Array Input */}
          <div className="pt-4 border-t border-slate-800">
            <label className="text-xs text-slate-400 block mb-1.5">Özel Dizi Testi (Virgülle ayırın):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Örn: 55, 12, 89, 34, 7, 60"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleCustomArray}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                Yükle
              </button>
            </div>
          </div>
        </div>

        {/* Code Snippet Inspector */}
        <div className="lg:col-span-7 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>JavaScript Algoritma İmplementasyonu</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{algorithm}.js</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs overflow-x-auto">
              {codeSnippets[algorithm].map((line, idx) => {
                const isHighlight = currentStep.codeLine === idx + 1;
                return (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      isHighlight
                        ? 'bg-indigo-600/30 text-indigo-200 font-bold border-l-2 border-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="inline-block w-6 text-slate-600 select-none">{idx + 1}</span>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400 font-mono">
            İpucu: Adımları ilerlettikçe o an icra edilen JavaScript satırı yukarıda sarı/mavi çerçeve ile vurgulanır.
          </div>
        </div>
      </div>
    </div>
  );
};
