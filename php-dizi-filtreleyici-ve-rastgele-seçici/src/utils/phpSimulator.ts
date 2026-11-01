import { ArrayElement, Preset, SimulationResult } from '../types';

export const PHP_CODE_SNIPPET = `<?php
/**
 * Verilen dizideki boş elemanları temizleyerek belirtilen adette
 * rastgele değerlerden oluşan yeni bir dizi oluşturur.
 * 
 * @author Enes Öztürk
 * @version 1.0.0
 * 
 * @param array $array İşlenecek ham dizi
 * @param int $count Rastgele seçilmek istenen eleman adedi
 * @return array Belirtilen sayıda rastgele seçilmiş temiz eleman dizisi
 */
function rastgeleGezegenler(array $array, int $count): array
{
    // 1. ADIM: array_filter()
    // Dizideki boş string ("") ve NULL değerlerini filtreler
    $temizDizi = array_filter($array, function ($eleman) {
        return !is_null($eleman) && $eleman !== "";
    });

    $toplamEleman = count($temizDizi);
    if ($toplamEleman === 0) {
        return [];
    }

    // İstenen adedin filtrelenmiş eleman sayısını aşmaması sağlanır
    $secimAdedi = min($count, $toplamEleman);

    // 2. ADIM: array_rand()
    // Filtrelenmiş diziden belirtilen adette rastgele anahtar (key) seçer
    // Seçim adedi 1 ise array_rand int/string döner, bu yüzden (array) ile diziye dönüştürülür
    $rastgeleAnahtarlar = (array) array_rand($temizDizi, $secimAdedi);

    // 3. ADIM: array_map()
    // Seçilen anahtarları temiz dizideki değerlerine eşleyerek 0 tabanlı yeni dizi döndürür
    return array_map(function ($anahtar) use ($temizDizi) {
        return $temizDizi[$anahtar];
    }, $rastgeleAnahtarlar);
}

// ==========================================
// Test ve Örnek Kullanım
// ==========================================
$planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "", "", NULL];

print_r(rastgeleGezegenler($planets, 2));
print_r(rastgeleGezegenler($planets, 3));
print_r(rastgeleGezegenler($planets, 2));
print_r(rastgeleGezegenler($planets, 4));
print_r(rastgeleGezegenler($planets, 5));
`;

export const DEFAULT_PLANETS: ArrayElement[] = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  '',
  '',
  null,
];

export const PRESETS: Preset[] = [
  {
    id: 'planets',
    name: 'Gezegenler ($planets)',
    iconName: 'Orbit',
    items: DEFAULT_PLANETS,
    description: 'Ödev sorusundaki 8 gezegen, 2 boş dize ve 1 NULL değerli orijinal dizi.',
  },
  {
    id: 'languages',
    name: 'Yazılım Dilleri',
    iconName: 'Code',
    items: ['PHP', 'TypeScript', 'Python', 'Go', 'Rust', 'C#', 'Java', '', null, 'Swift', ''],
    description: 'Popüler yazılım dilleri ve arada kalan boş/null girdiler.',
  },
  {
    id: 'cities',
    name: 'Türkiye Şehirleri',
    iconName: 'MapPin',
    items: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kayseri', 'Trabzon', '', null, 'Eskişehir', null],
    description: 'Şehir isimleri ve temizlenmesi gereken eksik veri alanları.',
  },
  {
    id: 'colors',
    name: 'Tasarım Renkleri',
    iconName: 'Palette',
    items: ['Emerald', 'Indigo', 'Amber', 'Violet', 'Rose', 'Cyan', 'Fuchsia', '', '', null],
    description: 'Modern renk paleti isimleri ve test için boşluklar.',
  },
];

/**
 * Executes the simulated PHP function and returns step-by-step diagnostics
 */
export function runPhpSimulation(rawArray: ArrayElement[], count: number): SimulationResult {
  // Step 1: array_filter()
  // In PHP, array_filter preserves keys:
  const filteredArray: { key: number; value: string }[] = [];
  rawArray.forEach((item, index) => {
    if (item !== null && item !== '') {
      filteredArray.push({ key: index, value: item });
    }
  });

  const totalFiltered = filteredArray.length;
  if (totalFiltered === 0) {
    return {
      originalArray: rawArray,
      countRequested: count,
      filteredArray: [],
      selectedKeys: [],
      finalResult: [],
      phpPrintROutput: 'Array\n(\n)\n',
      timestamp: Date.now(),
    };
  }

  const effectiveCount = Math.min(count, totalFiltered);

  // Step 2: array_rand($filtered, $secimAdedi)
  // PHP's array_rand picks random keys from the array without replacement
  const availableIndices = filteredArray.map((_, i) => i);
  // Fisher-Yates shuffle to pick effectiveCount items randomly
  const shuffledIndices = [...availableIndices];
  for (let i = shuffledIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }
  const pickedIndicesInFiltered = shuffledIndices.slice(0, effectiveCount);
  // Sort indices if needed or keep in array_rand key order (PHP array_rand keeps keys sorted by original position when returning multiple)
  pickedIndicesInFiltered.sort((a, b) => a - b);

  const selectedOriginalKeys = pickedIndicesInFiltered.map(i => filteredArray[i].key);

  // Step 3: array_map()
  // Maps the selected keys back to their values:
  const finalResult = pickedIndicesInFiltered.map(i => filteredArray[i].value);

  // Format exact PHP print_r output
  const lines: string[] = ['Array', '('];
  finalResult.forEach((val, idx) => {
    lines.push(`    [${idx}] => ${val}`);
  });
  lines.push(')\n');
  const phpPrintROutput = lines.join('\n');

  return {
    originalArray: rawArray,
    countRequested: count,
    filteredArray,
    selectedKeys: selectedOriginalKeys,
    finalResult,
    phpPrintROutput,
    timestamp: Date.now(),
  };
}

/**
 * Formats multiple print_r outputs as displayed in PHP terminal
 */
export function formatBatchPrintR(results: { count: number; result: string[] }[]): string {
  let output = '';
  results.forEach(item => {
    output += 'Array\n(\n';
    item.result.forEach((val, idx) => {
      output += `    [${idx}] => ${val}\n`;
    });
    output += ')\n';
  });
  return output.trim();
}

/**
 * Downloads the complete PHP file
 */
export function downloadPhpFile(): void {
  const blob = new Blob([PHP_CODE_SNIPPET], { type: 'application/x-php' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'enes_ozturk_dizi_fonksiyonu.php';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
