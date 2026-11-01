/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Hazırlayan: Enes Öztürk
 */

/**
 * Türkçe ek kurallarına göre sayıların sonuna gelecek ekleri belirler
 * Örnekler:
 * 6 -> "6'dır"
 * 9 -> "9'dur"
 * 3 -> "3'tür"
 * 12 -> "12'dir"
 * 15 -> "15'tir"
 * 100 -> "100'dür"
 */
export function getTurkishCopula(num: number | bigint): string {
  const nStr = num.toString().replace('-', '');
  
  // Son basamak veya son iki basamağa göre okunuşun son hecesi
  // Sayının Türkçe okunuşunun son sesli ve sessiz harfi
  const lastChar = nStr.slice(-1);
  const lastTwo = nStr.slice(-2);
  
  // Özel durumlar (onluklar: 10, 20, 30, 40, 50, 60, 70, 80, 90, 00)
  if (lastTwo === '00' || nStr === '0') {
    if (nStr === '0') return '0\'dır';
    // 100, 200, 300 vb. -> yüz -> dür
    return `${num}'dür`;
  }
  
  if (lastChar === '0') {
    const tens = lastTwo;
    switch (tens) {
      case '10': return `${num}'dur`; // on -> dur
      case '20': return `${num}'dir`; // yirmi -> dir
      case '30': return `${num}'dur`; // otuz -> dur
      case '40': return `${num}'tır`; // kırk -> tır
      case '50': return `${num}'dir`; // elli -> dir
      case '60': return `${num}'tır`; // altmış -> tır
      case '70': return `${num}'tir`; // yetmiş -> tir
      case '80': return `${num}'dir`; // seksen -> dir
      case '90': return `${num}'dır`; // doksan -> dır
    }
  }

  // Tek basamaklar: 1, 2, 3, 4, 5, 6, 7, 8, 9
  switch (lastChar) {
    case '1': return `${num}'dir`; // bir -> dir
    case '2': return `${num}'dir`; // iki -> dir
    case '3': return `${num}'tür`; // üç -> tür (fıstıkçı şahap: ç -> t)
    case '4': return `${num}'tür`; // dört -> tür (t -> t)
    case '5': return `${num}'tir`; // beş -> tir (ş -> t)
    case '6': return `${num}'dır`; // altı -> dır
    case '7': return `${num}'dir`; // yedi -> dir
    case '8': return `${num}'dir`; // sekiz -> dir
    case '9': return `${num}'dur`; // dokuz -> dur
    default: return `${num}'dir`;
  }
}
