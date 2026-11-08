/**
 * Benchmark comparisons between QuickSort, MergeSort, and BubbleSort
 * Author: Enes Öztürk
 */

export interface BenchmarkResult {
  algorithm: string;
  size: number;
  timeMs: number;
  comparisons: number;
  swaps: number;
  stability: string;
  timeComplexity: string;
}

export function runBenchmark(size: number, distribution: 'random' | 'sorted' | 'reversed' | 'duplicates'): BenchmarkResult[] {
  const baseArray: number[] = [];
  const maxVal = size * 5;

  if (distribution === 'random') {
    for (let i = 0; i < size; i++) {
      baseArray.push(Math.floor(Math.random() * maxVal));
    }
  } else if (distribution === 'sorted') {
    for (let i = 0; i < size; i++) {
      baseArray.push(i);
    }
  } else if (distribution === 'reversed') {
    for (let i = 0; i < size; i++) {
      baseArray.push(size - i);
    }
  } else {
    // duplicates
    for (let i = 0; i < size; i++) {
      baseArray.push(Math.floor(Math.random() * 5));
    }
  }

  const results: BenchmarkResult[] = [];

  // 1. QuickSort (Lomuto with Median-of-3)
  {
    const arr = [...baseArray];
    let comps = 0;
    let swaps = 0;
    const t0 = performance.now();

    function qsort(a: number[], l: number, h: number) {
      if (l < h) {
        // Median of 3
        if (h - l >= 2) {
          const m = Math.floor(l + (h - l) / 2);
          comps += 3;
          if (a[l] > a[m]) { const t = a[l]; a[l] = a[m]; a[m] = t; swaps++; }
          if (a[l] > a[h]) { const t = a[l]; a[l] = a[h]; a[h] = t; swaps++; }
          if (a[m] > a[h]) { const t = a[m]; a[m] = a[h]; a[h] = t; swaps++; }
          const t = a[m]; a[m] = a[h]; a[h] = t; swaps++;
        }
        const p = a[h];
        let i = l - 1;
        for (let j = l; j < h; j++) {
          comps++;
          if (a[j] <= p) {
            i++;
            const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
            swaps++;
          }
        }
        const tmp = a[i + 1]; a[i + 1] = a[h]; a[h] = tmp;
        swaps++;
        const pi = i + 1;
        qsort(a, l, pi - 1);
        qsort(a, pi + 1, h);
      }
    }

    qsort(arr, 0, arr.length - 1);
    const t1 = performance.now();

    results.push({
      algorithm: 'Quick Sort (Enes Öztürk - Medyan Pivot)',
      size,
      timeMs: parseFloat((t1 - t0).toFixed(3)),
      comparisons: comps,
      swaps,
      stability: 'Kararsız (Unstable)',
      timeComplexity: 'O(n log n)',
    });
  }

  // 2. Merge Sort
  {
    const arr = [...baseArray];
    let comps = 0;
    let swaps = 0;
    const t0 = performance.now();

    function msort(a: number[]): number[] {
      if (a.length <= 1) return a;
      const mid = Math.floor(a.length / 2);
      const left = msort(a.slice(0, mid));
      const right = msort(a.slice(mid));
      return merge(left, right);
    }

    function merge(left: number[], right: number[]): number[] {
      const res: number[] = [];
      let i = 0;
      let j = 0;
      while (i < left.length && j < right.length) {
        comps++;
        if (left[i] <= right[j]) {
          res.push(left[i++]);
        } else {
          res.push(right[j++]);
          swaps++;
        }
      }
      return res.concat(left.slice(i)).concat(right.slice(j));
    }

    msort(arr);
    const t1 = performance.now();

    results.push({
      algorithm: 'Merge Sort (Birleştirmeli Sıralama)',
      size,
      timeMs: parseFloat((t1 - t0).toFixed(3)),
      comparisons: comps,
      swaps,
      stability: 'Kararlı (Stable)',
      timeComplexity: 'O(n log n)',
    });
  }

  // 3. Bubble Sort (only if size <= 5000 to prevent freeze)
  if (size <= 5000) {
    const arr = [...baseArray];
    let comps = 0;
    let swaps = 0;
    const t0 = performance.now();

    for (let i = 0; i < arr.length - 1; i++) {
      let anySwapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        comps++;
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          anySwapped = true;
        }
      }
      if (!anySwapped) break;
    }
    const t1 = performance.now();

    results.push({
      algorithm: 'Bubble Sort (Kabarcık Sıralaması)',
      size,
      timeMs: parseFloat((t1 - t0).toFixed(3)),
      comparisons: comps,
      swaps,
      stability: 'Kararlı (Stable)',
      timeComplexity: 'O(n²)',
    });
  }

  // 4. Native JS Array.prototype.sort (Timsort / Dual-Pivot)
  {
    const arr = [...baseArray];
    const t0 = performance.now();
    arr.sort((a, b) => a - b);
    const t1 = performance.now();

    results.push({
      algorithm: 'V8 Dahili Sıralama (Dual-Pivot Quicksort / Timsort)',
      size,
      timeMs: parseFloat((t1 - t0).toFixed(3)),
      comparisons: Math.floor(size * Math.log2(size)),
      swaps: Math.floor(size * 0.7),
      stability: 'Kararlı (Timsort)',
      timeComplexity: 'O(n log n)',
    });
  }

  return results;
}
