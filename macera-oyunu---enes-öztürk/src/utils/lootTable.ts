import { Weapon, Armor } from '../types/game';
import { INITIAL_WEAPONS, INITIAL_ARMORS } from '../data/gameData';

export interface SnakeLootDrop {
  type: 'nothing' | 'weapon' | 'armor' | 'money';
  title: string;
  description: string;
  weapon?: Weapon;
  armor?: Armor;
  money?: number;
  rollSummary: string;
}

/**
 * Executes the exact loot drop probabilities specified in the homework:
 * Main roll (0-100%):
 *  - 45% Nothing
 *  - 15% Weapon (20% Rifle, 30% Sword, 50% Pistol)
 *  - 15% Armor (20% Heavy, 30% Medium, 50% Light)
 *  - 25% Money (20% 10 Gold, 30% 5 Gold, 50% 1 Gold)
 */
export function rollSnakeLoot(): SnakeLootDrop {
  const mainRoll = Math.random() * 100;

  // 1. Hiçbir şey kazanamama: %45 (0 <= mainRoll < 45)
  if (mainRoll < 45) {
    return {
      type: 'nothing',
      title: 'Hiçbir Şey Düşmedi',
      description: 'Yılanın üzerinden değerli bir eşya çıkmadı.',
      rollSummary: `Zar: ${mainRoll.toFixed(1)}% (Dilim: %45 Boş)`,
    };
  }

  // 2. Silah Kazanma: %15 (45 <= mainRoll < 60)
  if (mainRoll < 60) {
    const subRoll = Math.random() * 100;
    if (subRoll < 20) {
      // %20 Tüfek
      return {
        type: 'weapon',
        title: 'Tüfek Düştü!',
        description: 'Efsanevi Tüfek (+7 Hasar) kazandın!',
        weapon: INITIAL_WEAPONS.RIFLE,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Silah Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%20 Tüfek)`,
      };
    } else if (subRoll < 50) {
      // %30 Kılıç
      return {
        type: 'weapon',
        title: 'Kılıç Düştü!',
        description: 'Keskin Kılıç (+3 Hasar) kazandın!',
        weapon: INITIAL_WEAPONS.SWORD,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Silah Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%30 Kılıç)`,
      };
    } else {
      // %50 Tabanca
      return {
        type: 'weapon',
        title: 'Tabanca Düştü!',
        description: 'Kullanışlı Tabanca (+2 Hasar) kazandın!',
        weapon: INITIAL_WEAPONS.PISTOL,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Silah Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%50 Tabanca)`,
      };
    }
  }

  // 3. Zırh Kazanma: %15 (60 <= mainRoll < 75)
  if (mainRoll < 75) {
    const subRoll = Math.random() * 100;
    if (subRoll < 20) {
      // %20 Ağır Zırh
      return {
        type: 'armor',
        title: 'Ağır Zırh Düştü!',
        description: 'Çelik Ağır Zırh (+5 Engelleme) kazandın!',
        armor: INITIAL_ARMORS.HEAVY,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Zırh Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%20 Ağır Zırh)`,
      };
    } else if (subRoll < 50) {
      // %30 Orta Zırh
      return {
        type: 'armor',
        title: 'Orta Zırh Düştü!',
        description: 'Dayanıklı Orta Zırh (+3 Engelleme) kazandın!',
        armor: INITIAL_ARMORS.MEDIUM,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Zırh Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%30 Orta Zırh)`,
      };
    } else {
      // %50 Hafif Zırh
      return {
        type: 'armor',
        title: 'Hafif Zırh Düştü!',
        description: 'Deri Hafif Zırh (+1 Engelleme) kazandın!',
        armor: INITIAL_ARMORS.LIGHT,
        rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Zırh Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%50 Hafif Zırh)`,
      };
    }
  }

  // 4. Para Kazanma: %25 (75 <= mainRoll <= 100)
  const subRoll = Math.random() * 100;
  if (subRoll < 20) {
    // %20: 10 Para
    return {
      type: 'money',
      title: '10 Para Düştü!',
      description: 'Yılanın yuvasından 10 altın para topladın!',
      money: 10,
      rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Para Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%20 10 Para)`,
    };
  } else if (subRoll < 50) {
    // %30: 5 Para
    return {
      type: 'money',
      title: '5 Para Düştü!',
      description: 'Yılanın yuvasından 5 altın para topladın!',
      money: 5,
      rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Para Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%30 5 Para)`,
    };
  } else {
    // %50: 1 Para
    return {
      type: 'money',
      title: '1 Para Düştü!',
      description: 'Yılanın yuvasından 1 altın para topladın!',
      money: 1,
      rollSummary: `Ana Zar: ${mainRoll.toFixed(1)}% (Para Dilimi) · Alt Zar: ${subRoll.toFixed(1)}% (%50 1 Para)`,
    };
  }
}
