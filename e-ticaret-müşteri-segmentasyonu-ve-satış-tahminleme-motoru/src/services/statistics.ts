import { DescriptiveStats } from '../types';

export function calculateDescriptiveStats(values: number[]): DescriptiveStats {
  if (!values || values.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      mode: 0,
      variance: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
      kurtosis: 0,
    };
  }

  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);

  // Mean (Aritmetik Ortalama): \bar{x} = \frac{1}{n} \sum x_i
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Median (Medyan / Q2)
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Mode (Mod / En Sık Tekrarlanan)
  const freqMap: Record<number, number> = {};
  let maxFreq = 0;
  let mode = sorted[0];
  sorted.forEach((val) => {
    freqMap[val] = (freqMap[val] || 0) + 1;
    if (freqMap[val] > maxFreq) {
      maxFreq = freqMap[val];
      mode = val;
    }
  });

  // Quantiles (Q1 and Q3 via linear interpolation)
  const getPercentile = (arr: number[], p: number) => {
    const idx = (arr.length - 1) * p;
    const lower = Math.floor(idx);
    const fraction = idx - lower;
    if (lower + 1 < arr.length) {
      return arr[lower] + fraction * (arr[lower + 1] - arr[lower]);
    }
    return arr[lower];
  };

  const q1 = getPercentile(sorted, 0.25);
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;

  // Sample Variance: s^2 = \frac{1}{n - 1} \sum (x_i - \bar{x})^2
  const squaredDiffs = sorted.map((x) => Math.pow(x - mean, 2));
  const variance = n > 1 ? squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Skewness (Çarpıklık / 3. Moment): Pearson's Moment Coefficient of Skewness
  // \gamma_1 = \frac{n}{(n-1)(n-2)} \sum \left(\frac{x_i - \bar{x}}{s}\right)^3
  let skewness = 0;
  let kurtosis = 0;
  if (stdDev > 0 && n > 2) {
    const m3 = sorted.reduce((acc, x) => acc + Math.pow((x - mean) / stdDev, 3), 0);
    skewness = (n / ((n - 1) * (n - 2))) * m3;

    // Kurtosis (Basıklık / 4. Moment): Excess Kurtosis (Normal dist = 0)
    if (n > 3) {
      const m4 = sorted.reduce((acc, x) => acc + Math.pow((x - mean) / stdDev, 4), 0);
      const term1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
      const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
      kurtosis = term1 * m4 - term2;
    }
  }

  return {
    count: n,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    mode: Math.round(mode * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    min: sorted[0],
    max: sorted[n - 1],
    q1: Math.round(q1 * 100) / 100,
    q3: Math.round(q3 * 100) / 100,
    iqr: Math.round(iqr * 100) / 100,
    skewness: Math.round(skewness * 1000) / 1000,
    kurtosis: Math.round(kurtosis * 1000) / 1000,
  };
}

// Pearson Correlation Coefficient (Pearson Korelasyon Katsayısı)
// r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 1000;
}

// Normal Distribution PDF (Olasılık Yoğunluk Fonksiyonu)
export function normalPdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

// Histogram binning generator
export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
  relativeFreq: number;
  density: number;
  label: string;
}

export function createHistogramBins(values: number[], binCount = 18): HistogramBin[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const binWidth = range / binCount;

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const x0 = min + i * binWidth;
    const x1 = i === binCount - 1 ? max : min + (i + 1) * binWidth;
    return {
      x0: Math.round(x0 * 10) / 10,
      x1: Math.round(x1 * 10) / 10,
      count: 0,
      relativeFreq: 0,
      density: 0,
      label: `${Math.round(x0)} - ${Math.round(x1)}`,
    };
  });

  values.forEach((val) => {
    let placed = false;
    for (let i = 0; i < binCount; i++) {
      if (val >= bins[i].x0 && (val < bins[i].x1 || (i === binCount - 1 && val <= bins[i].x1))) {
        bins[i].count++;
        placed = true;
        break;
      }
    }
    if (!placed && bins.length > 0) {
      bins[bins.length - 1].count++;
    }
  });

  const total = values.length;
  bins.forEach((b) => {
    b.relativeFreq = Math.round((b.count / total) * 1000) / 1000;
    b.density = Math.round((b.count / (total * binWidth)) * 10000) / 10000;
  });

  return bins;
}

// Tukey IQR Outlier Detection
export interface OutlierAnalysis {
  q1: number;
  q3: number;
  iqr: number;
  lowerBound: number;
  upperBound: number;
  outliers: { index: number; value: number; type: 'low' | 'high' }[];
  cleanValues: number[];
}

export function detectOutliersTukey(values: number[], k = 1.5): OutlierAnalysis {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const getPercentile = (arr: number[], p: number) => {
    const idx = (arr.length - 1) * p;
    const lower = Math.floor(idx);
    const fraction = idx - lower;
    if (lower + 1 < arr.length) return arr[lower] + fraction * (arr[lower + 1] - arr[lower]);
    return arr[lower];
  };

  const q1 = getPercentile(sorted, 0.25);
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - k * iqr;
  const upperBound = q3 + k * iqr;

  const outliers: { index: number; value: number; type: 'low' | 'high' }[] = [];
  const cleanValues: number[] = [];

  values.forEach((val, idx) => {
    if (val < lowerBound) {
      outliers.push({ index: idx, value: val, type: 'low' });
    } else if (val > upperBound) {
      outliers.push({ index: idx, value: val, type: 'high' });
    } else {
      cleanValues.push(val);
    }
  });

  return {
    q1: Math.round(q1 * 100) / 100,
    q3: Math.round(q3 * 100) / 100,
    iqr: Math.round(iqr * 100) / 100,
    lowerBound: Math.round(lowerBound * 100) / 100,
    upperBound: Math.round(upperBound * 100) / 100,
    outliers,
    cleanValues,
  };
}
