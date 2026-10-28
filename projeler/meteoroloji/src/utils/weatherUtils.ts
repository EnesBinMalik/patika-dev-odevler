import { City, TURKEY_CITIES } from '../data/turkeyCities';
import { TempUnit, WeatherCondition } from '../types/weather';

export const TURKISH_DAYS = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

export const TURKISH_DAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const TURKISH_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

export function getWeatherCondition(code: number): WeatherCondition {
  switch (code) {
    case 0:
      return {
        label: 'Güneşli / Açık',
        description: 'Gökyüzü tamamen açık, parlak güneş ışığı hakim.',
        iconName: 'sun',
        theme: 'sunny',
        badgeColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      };
    case 1:
      return {
        label: 'Çoğunlukla Açık',
        description: 'Hafif serpilmiş tül bulutlar, açık ve aydınlık hava.',
        iconName: 'sun',
        theme: 'sunny',
        badgeColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      };
    case 2:
      return {
        label: 'Parçalı Bulutlu',
        description: 'Güneş aralıklarla bulut arkasında, dengeli hava şartları.',
        iconName: 'cloud-sun',
        theme: 'cloudy',
        badgeColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      };
    case 3:
      return {
        label: 'Çok Bulutlu / Kapalı',
        description: 'Gök yüzeyi yoğun bulut tabakasıyla kaplı.',
        iconName: 'cloud',
        theme: 'cloudy',
        badgeColor: 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
      };
    case 45:
    case 48:
      return {
        label: 'Sisli ve Puslu',
        description: 'Yatay görüş mesafesi düşük, nemli ve serin sis tabakası.',
        iconName: 'cloud-fog',
        theme: 'foggy',
        badgeColor: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Çisenti / Hafif Yağmur',
        description: 'Aralıklı hafif serpinti yağış, ıslak zemin uyarısı.',
        iconName: 'cloud-drizzle',
        theme: 'rainy',
        badgeColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      };
    case 56:
    case 57:
      return {
        label: 'Dondurucu Çisenti',
        description: 'Düşük sıcaklıkta donan hafif yağış, gizli buzlanma riski.',
        iconName: 'cloud-snow',
        theme: 'snowy',
        badgeColor: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Yağmurlu',
        description: 'Düzenli yağmur yağışı, şemsiyenizi almayı unutmayın.',
        iconName: 'cloud-rain',
        theme: 'rainy',
        badgeColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700',
      };
    case 66:
    case 67:
      return {
        label: 'Dondurucu Yağmur',
        description: 'Sıfırın altında yağmur damlaları, yollarda dikkat gerektirir.',
        iconName: 'cloud-snow',
        theme: 'snowy',
        badgeColor: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-700',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Kar Yağışlı',
        description: 'Beyaz örtü oluşturan kar yağışı, kış şartları etkili.',
        iconName: 'cloud-snow',
        theme: 'snowy',
        badgeColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      };
    case 77:
      return {
        label: 'Kar Grenleri',
        description: 'Sert kar tanecikleri, soğuk hava dalgası.',
        iconName: 'cloud-snow',
        theme: 'snowy',
        badgeColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Sağanak Yağış',
        description: 'Kuvvetli ani sağanak yağışlar, ani su birikintisi ihtimali.',
        iconName: 'cloud-rain',
        theme: 'rainy',
        badgeColor: 'text-blue-700 bg-blue-100 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600',
      };
    case 85:
    case 86:
      return {
        label: 'Kar Sağanağı',
        description: 'Yoğun aralıklı tipi ve kar sağanağı.',
        iconName: 'cloud-snow',
        theme: 'snowy',
        badgeColor: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600',
      };
    case 95:
      return {
        label: 'Gök Gürültülü Fırtına',
        description: 'Şimşek ve gök gürültülü fırtınalı hava şartları.',
        iconName: 'cloud-lightning',
        theme: 'stormy',
        badgeColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      };
    case 96:
    case 99:
      return {
        label: 'Dolu ve Şimşekli Fırtına',
        description: 'Dolu yağışı riskiyle birlikte şiddetli fırtına.',
        iconName: 'cloud-lightning',
        theme: 'stormy',
        badgeColor: 'text-violet-700 bg-violet-100 dark:bg-violet-950/60 border-violet-400 dark:border-violet-600',
      };
    default:
      return {
        label: 'Parçalı Bulutlu',
        description: 'Değişken bulutluluk oranı ile mevsim normalleri.',
        iconName: 'cloud-sun',
        theme: 'cloudy',
        badgeColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      };
  }
}

export function formatTemperature(celsius: number, unit: TempUnit): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function getTurkishWindDirection(degrees: number): string {
  const directions = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getUVDescription(uv: number): { label: string; color: string; advice: string } {
  if (uv <= 2) {
    return {
      label: 'Düşük',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      advice: 'Güneş kremi veya koruma gerektirmez.',
    };
  }
  if (uv <= 5) {
    return {
      label: 'Orta',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      advice: 'Öğle saatlerinde şapka ve güneş gözlüğü önerilir.',
    };
  }
  if (uv <= 7) {
    return {
      label: 'Yüksek',
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40',
      advice: 'Güneş koruyucu krem ve gölge alanları tercih edin.',
    };
  }
  if (uv <= 10) {
    return {
      label: 'Çok Yüksek',
      color: 'text-red-500 bg-red-50 dark:bg-red-950/40',
      advice: 'Güneşe doğrudan maruz kalmaktan kaçının.',
    };
  }
  return {
    label: 'Aşırı Tehlikeli',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40',
    advice: 'Mümkünse kapalı alanlarda kalın.',
  };
}

export function findNearestTurkishCity(latitude: number, longitude: number): City {
  let closestCity = TURKEY_CITIES[33]; // Default to İstanbul if no match
  let minDistance = Infinity;

  // Haversine formula
  const toRad = (x: number) => (x * Math.PI) / 180;
  for (const city of TURKEY_CITIES) {
    const dLat = toRad(city.lat - latitude);
    const dLon = toRad(city.lon - longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(latitude)) * Math.cos(toRad(city.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth's radius in km

    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  return closestCity;
}

export function formatTurkishDate(dateStr: string): {
  dayName: string;
  dayShort: string;
  formattedDate: string;
} {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  const dayIndex = date.getDay();
  const dayName = TURKISH_DAYS[dayIndex];
  const dayShort = TURKISH_DAYS_SHORT[dayIndex];
  const monthName = TURKISH_MONTHS[month];

  return {
    dayName,
    dayShort,
    formattedDate: `${day} ${monthName} ${dayName}`,
  };
}

export function formatTimeStr(isoString: string): string {
  if (!isoString) return '--:--';
  const timePart = isoString.split('T')[1];
  return timePart ? timePart.substring(0, 5) : '--:--';
}
