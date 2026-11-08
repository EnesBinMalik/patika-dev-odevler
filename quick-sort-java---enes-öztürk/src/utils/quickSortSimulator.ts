/**
 * Quick Sort Step-by-Step Simulation Engine
 * Generates discrete snapshots for interactive visualization.
 * 
 * Implemented with Lomuto, Hoare, and Median-of-Three strategies.
 * Author signature: Enes Öztürk
 */

export interface SimulationStep {
  stepIndex: number;
  array: number[];
  low: number;
  high: number;
  pivotIndex: number | null;
  pivotValue: number | null;
  i: number | null;
  j: number | null;
  swapping: [number, number] | null;
  sortedIndices: number[];
  description: string;
  stepType: 'start' | 'partition-init' | 'compare' | 'swap' | 'pivot-placed' | 'recurse' | 'finished';
  comparisons: number;
  swaps: number;
  recursionDepth: number;
  activeRange: [number, number];
}

export type PartitionStrategy = 'lomuto' | 'hoare' | 'median3';

export function generateQuickSortSteps(
  initialArray: number[],
  strategy: PartitionStrategy = 'lomuto'
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedSet = new Set<number>();

  if (n === 0) {
    return [];
  }

  // Initial step
  steps.push({
    stepIndex: 0,
    array: [...arr],
    low: 0,
    high: n - 1,
    pivotIndex: null,
    pivotValue: null,
    i: null,
    j: null,
    swapping: null,
    sortedIndices: [],
    description: `Sıralama başlıyor: ${n} elemanlı dizi hazırlandı. Quick Sort algoritması böl-ve-yönet ilkesiyle çalışır.`,
    stepType: 'start',
    comparisons: 0,
    swaps: 0,
    recursionDepth: 0,
    activeRange: [0, n - 1],
  });

  if (strategy === 'hoare') {
    runHoareQuickSort(arr, 0, n - 1, 1);
  } else {
    runLomutoQuickSort(arr, 0, n - 1, 1, strategy === 'median3');
  }

  // Mark all as sorted when finished
  for (let idx = 0; idx < n; idx++) {
    sortedSet.add(idx);
  }

  steps.push({
    stepIndex: steps.length,
    array: [...arr],
    low: 0,
    high: n - 1,
    pivotIndex: null,
    pivotValue: null,
    i: null,
    j: null,
    swapping: null,
    sortedIndices: Array.from(sortedSet),
    description: `Tebrikler! Dizi başarıyla sıralandı. Toplam ${comparisons} karşılaştırma ve ${swaps} takas gerçekleştirildi.`,
    stepType: 'finished',
    comparisons,
    swaps,
    recursionDepth: 0,
    activeRange: [0, n - 1],
  });

  return steps;

  // ----------------------------------------------------
  // Lomuto Implementation with Step Recording
  // ----------------------------------------------------
  function runLomutoQuickSort(
    array: number[],
    low: number,
    high: number,
    depth: number,
    useMedian: boolean
  ) {
    if (low >= high) {
      if (low === high) {
        sortedSet.add(low);
        steps.push({
          stepIndex: steps.length,
          array: [...array],
          low,
          high,
          pivotIndex: low,
          pivotValue: array[low],
          i: null,
          j: null,
          swapping: null,
          sortedIndices: Array.from(sortedSet),
          description: `Aralık [${low}..${high}] tek bir elemandan oluştuğu için arr[${low}] = ${array[low]} zaten sıralıdır.`,
          stepType: 'pivot-placed',
          comparisons,
          swaps,
          recursionDepth: depth,
          activeRange: [low, high],
        });
      }
      return;
    }

    // Median of 3 optimization if chosen
    if (useMedian && high - low >= 2) {
      const mid = Math.floor(low + (high - low) / 2);
      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low,
        high,
        pivotIndex: mid,
        pivotValue: array[mid],
        i: low,
        j: high,
        swapping: null,
        sortedIndices: Array.from(sortedSet),
        description: `Üçün Medyanı (Median-of-Three): Baş (${array[low]}), Orta (${array[mid]}), Son (${array[high]}) inceleniyor.`,
        stepType: 'partition-init',
        comparisons,
        swaps,
        recursionDepth: depth,
        activeRange: [low, high],
      });

      // Sort low, mid, high
      comparisons += 3;
      if (array[low] > array[mid]) {
        [array[low], array[mid]] = [array[mid], array[low]];
        swaps++;
      }
      if (array[low] > array[high]) {
        [array[low], array[high]] = [array[high], array[low]];
        swaps++;
      }
      if (array[mid] > array[high]) {
        [array[mid], array[high]] = [array[high], array[mid]];
        swaps++;
      }
      // Move median to high
      [array[mid], array[high]] = [array[high], array[mid]];
      swaps++;
    }

    const pivot = array[high];
    let i = low - 1;

    steps.push({
      stepIndex: steps.length,
      array: [...array],
      low,
      high,
      pivotIndex: high,
      pivotValue: pivot,
      i,
      j: low,
      swapping: null,
      sortedIndices: Array.from(sortedSet),
      description: `Bölümleme başlatıldı: [${low}..${high}] aralığı. Pivot olarak son eleman (${pivot}) seçildi.`,
      stepType: 'partition-init',
      comparisons,
      swaps,
      recursionDepth: depth,
      activeRange: [low, high],
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmallerOrEqual = array[j] <= pivot;

      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low,
        high,
        pivotIndex: high,
        pivotValue: pivot,
        i,
        j,
        swapping: null,
        sortedIndices: Array.from(sortedSet),
        description: `Karşılaştırma: arr[${j}] = ${array[j]} ile pivot ${pivot}. ${
          isSmallerOrEqual
            ? `${array[j]} <= ${pivot} (küçük/eşit), i indeksi artırılacak.`
            : `${array[j]} > ${pivot} (büyük), takas yok, j ilerliyor.`
        }`,
        stepType: 'compare',
        comparisons,
        swaps,
        recursionDepth: depth,
        activeRange: [low, high],
      });

      if (isSmallerOrEqual) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          swaps++;

          steps.push({
            stepIndex: steps.length,
            array: [...array],
            low,
            high,
            pivotIndex: high,
            pivotValue: pivot,
            i,
            j,
            swapping: [i, j],
            sortedIndices: Array.from(sortedSet),
            description: `Takas yapıldı: arr[${i}] (${array[i]}) <-> arr[${j}] (${array[j]}). Küçük eleman sol tarafa taşındı.`,
            stepType: 'swap',
            comparisons,
            swaps,
            recursionDepth: depth,
            activeRange: [low, high],
          });
        }
      }
    }

    // Place pivot in correct position
    const finalPivotIndex = i + 1;
    [array[finalPivotIndex], array[high]] = [array[high], array[finalPivotIndex]];
    swaps++;
    sortedSet.add(finalPivotIndex);

    steps.push({
      stepIndex: steps.length,
      array: [...array],
      low,
      high,
      pivotIndex: finalPivotIndex,
      pivotValue: pivot,
      i: finalPivotIndex,
      j: high,
      swapping: [finalPivotIndex, high],
      sortedIndices: Array.from(sortedSet),
      description: `Pivot (${pivot}) ait olduğu kalıcı konuma arr[${finalPivotIndex}] yerleştirildi! Solundakiler ≤ ${pivot}, sağındakiler > ${pivot}.`,
      stepType: 'pivot-placed',
      comparisons,
      swaps,
      recursionDepth: depth,
      activeRange: [low, high],
    });

    // Recursive call left
    if (finalPivotIndex - 1 >= low) {
      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low,
        high: finalPivotIndex - 1,
        pivotIndex: null,
        pivotValue: null,
        i: null,
        j: null,
        swapping: null,
        sortedIndices: Array.from(sortedSet),
        description: `Özyinelemeli çağrı (Sol Kanat): [${low} .. ${finalPivotIndex - 1}] aralığı sıralanacak. (Derinlik: ${depth + 1})`,
        stepType: 'recurse',
        comparisons,
        swaps,
        recursionDepth: depth + 1,
        activeRange: [low, finalPivotIndex - 1],
      });
      runLomutoQuickSort(array, low, finalPivotIndex - 1, depth + 1, useMedian);
    }

    // Recursive call right
    if (high >= finalPivotIndex + 1) {
      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low: finalPivotIndex + 1,
        high,
        pivotIndex: null,
        pivotValue: null,
        i: null,
        j: null,
        swapping: null,
        sortedIndices: Array.from(sortedSet),
        description: `Özyinelemeli çağrı (Sağ Kanat): [${finalPivotIndex + 1} .. ${high}] aralığı sıralanacak. (Derinlik: ${depth + 1})`,
        stepType: 'recurse',
        comparisons,
        swaps,
        recursionDepth: depth + 1,
        activeRange: [finalPivotIndex + 1, high],
      });
      runLomutoQuickSort(array, finalPivotIndex + 1, high, depth + 1, useMedian);
    }
  }

  // ----------------------------------------------------
  // Hoare Implementation with Step Recording
  // ----------------------------------------------------
  function runHoareQuickSort(
    array: number[],
    low: number,
    high: number,
    depth: number
  ) {
    if (low >= high) {
      if (low === high) {
        sortedSet.add(low);
      }
      return;
    }

    const mid = Math.floor(low + (high - low) / 2);
    const pivot = array[mid];

    steps.push({
      stepIndex: steps.length,
      array: [...array],
      low,
      high,
      pivotIndex: mid,
      pivotValue: pivot,
      i: low,
      j: high,
      swapping: null,
      sortedIndices: Array.from(sortedSet),
      description: `Hoare Bölümleme: Aralık [${low}..${high}]. Orta eleman arr[${mid}] = ${pivot} pivot seçildi. İki yönlü tarama başlıyor.`,
      stepType: 'partition-init',
      comparisons,
      swaps,
      recursionDepth: depth,
      activeRange: [low, high],
    });

    let i = low - 1;
    let j = high + 1;

    let pIndex = low;

    while (true) {
      do {
        i++;
        comparisons++;
      } while (array[i] < pivot);

      do {
        j--;
        comparisons++;
      } while (array[j] > pivot);

      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low,
        high,
        pivotIndex: mid,
        pivotValue: pivot,
        i,
        j,
        swapping: null,
        sortedIndices: Array.from(sortedSet),
        description: `İşaretçiler durdu: Sol i=${i} (arr[i]=${array[i]} >= ${pivot}), Sağ j=${j} (arr[j]=${array[j]} <= ${pivot}).`,
        stepType: 'compare',
        comparisons,
        swaps,
        recursionDepth: depth,
        activeRange: [low, high],
      });

      if (i >= j) {
        pIndex = j;
        steps.push({
          stepIndex: steps.length,
          array: [...array],
          low,
          high,
          pivotIndex: null,
          pivotValue: pivot,
          i,
          j,
          swapping: null,
          sortedIndices: Array.from(sortedSet),
          description: `İşaretçiler kesişti (i=${i} >= j=${j}). Hoare bölümleme tamamlandı. Bölümleme sınırı j=${j}.`,
          stepType: 'pivot-placed',
          comparisons,
          swaps,
          recursionDepth: depth,
          activeRange: [low, high],
        });
        break;
      }

      [array[i], array[j]] = [array[j], array[i]];
      swaps++;

      steps.push({
        stepIndex: steps.length,
        array: [...array],
        low,
        high,
        pivotIndex: mid,
        pivotValue: pivot,
        i,
        j,
        swapping: [i, j],
        sortedIndices: Array.from(sortedSet),
        description: `Takas: arr[${i}] (${array[i]}) <-> arr[${j}] (${array[j]}). Ters duran iki eleman karşılıklı düzeltildi.`,
        stepType: 'swap',
        comparisons,
        swaps,
        recursionDepth: depth,
        activeRange: [low, high],
      });
    }

    runHoareQuickSort(array, low, pIndex, depth + 1);
    runHoareQuickSort(array, pIndex + 1, high, depth + 1);
  }
}
