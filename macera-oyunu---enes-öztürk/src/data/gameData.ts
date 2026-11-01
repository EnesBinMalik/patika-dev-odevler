import { Character, Weapon, Armor, Monster, LocationId, AwardInfo, AwardType } from '../types/game';

export const INITIAL_WEAPONS: Record<string, Weapon> = {
  FIST: {
    id: 0,
    name: 'Yumruk',
    damage: 0,
    price: 0,
    icon: 'Hand',
    description: 'Temel silahsız saldırı gücü.',
  },
  PISTOL: {
    id: 1,
    name: 'Tabanca',
    damage: 2,
    price: 25,
    icon: 'Crosshair',
    description: 'Hızlı ve pratik bir menzilli tabanca (+2 Hasar).',
  },
  SWORD: {
    id: 2,
    name: 'Kılıç',
    damage: 3,
    price: 35,
    icon: 'Sword',
    description: 'Keskin çelik kılıç (+3 Hasar).',
  },
  RIFLE: {
    id: 3,
    name: 'Tüfek',
    damage: 7,
    price: 45,
    icon: 'Target',
    description: 'Yüksek ateş güçlü av tüfeği (+7 Hasar).',
  },
};

export const INITIAL_ARMORS: Record<string, Armor> = {
  NONE: {
    id: 0,
    name: 'Paçavra',
    block: 0,
    price: 0,
    icon: 'Shirt',
    description: 'Herhangi bir koruma sağlamaz.',
  },
  LIGHT: {
    id: 1,
    name: 'Hafif Zırh',
    block: 1,
    price: 15,
    icon: 'Shield',
    description: 'Hafif deri göğüslük (+1 Engelleme).',
  },
  MEDIUM: {
    id: 2,
    name: 'Orta Zırh',
    block: 3,
    price: 25,
    icon: 'ShieldAlert',
    description: 'Sağlam perçinli zırh (+3 Engelleme).',
  },
  HEAVY: {
    id: 3,
    name: 'Ağır Zırh',
    block: 5,
    price: 40,
    icon: 'ShieldCheck',
    description: 'Ağır çelik plaka zırh (+5 Engelleme).',
  },
};

export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'Samuray',
    title: 'Onurlu Savaşçı',
    damage: 5,
    health: 21,
    maxHealth: 21,
    money: 15,
    icon: 'Swords',
    description: 'Dengeli hasar ve başlangıç altınına sahip kadim savaşçı.',
  },
  {
    id: 2,
    name: 'Okçu',
    title: 'Orman Gözcüsü',
    damage: 7,
    health: 18,
    maxHealth: 18,
    money: 20,
    icon: 'Flame',
    description: 'Yüksek hasar ve bol altınla başlar, fakat canı daha azdır.',
  },
  {
    id: 3,
    name: 'Şövalye',
    title: 'Kraliyet Muhafızı',
    damage: 8,
    health: 24,
    maxHealth: 24,
    money: 5,
    icon: 'Crown',
    description: 'En yüksek sağlık ve temel hasar gücüne sahiptir, parası azdır.',
  },
];

export interface MonsterConfigItem {
  id: number;
  name: string;
  minDamage: number;
  maxDamage: number;
  health: number;
  maxHealth: number;
  money: number;
  icon: string;
  description: string;
  isSnake: boolean;
}

export const MONSTERS_CONFIG: Record<string, MonsterConfigItem> = {
  ZOMBIE: {
    id: 1,
    name: 'Zombi',
    minDamage: 3,
    maxDamage: 3,
    health: 10,
    maxHealth: 10,
    money: 4,
    icon: 'Skull',
    description: 'Mağaralarda yaşayan çürümüş yaşayan ölü.',
    isSnake: false,
  },
  VAMPIRE: {
    id: 2,
    name: 'Vampir',
    minDamage: 4,
    maxDamage: 4,
    health: 14,
    maxHealth: 14,
    money: 7,
    icon: 'Ghost',
    description: 'Karanlık ormanın kan emici yırtıcısı.',
    isSnake: false,
  },
  BEAR: {
    id: 3,
    name: 'Ayı',
    minDamage: 7,
    maxDamage: 7,
    health: 20,
    maxHealth: 20,
    money: 12,
    icon: 'PawPrint',
    description: 'Nehir kenarında pusu kuran devasa vahşi ayı.',
    isSnake: false,
  },
  SNAKE: {
    id: 4,
    name: 'Yılan',
    minDamage: 3,
    maxDamage: 6, // 3 ve 6 arası rastgele hasar
    health: 12,
    maxHealth: 12,
    money: 0, // Para yok, yerine ganimet şansı
    icon: 'Bug',
    description: 'Maden kuyularında gizlenen zehirli yılan. Yenildiğinde özel ganimet düşürebilir!',
    isSnake: true,
  },
};

export const AWARDS: Record<AwardType, AwardInfo> = {
  YEMEK: {
    id: 'YEMEK',
    name: 'Food',
    turkishName: 'Yemek',
    sourceLocation: 'CAVE',
    icon: 'Apple',
    description: 'Mağara temizlendiğinde kazanılan erzak.',
  },
  ODUN: {
    id: 'ODUN',
    name: 'Firewood',
    turkishName: 'Odun',
    sourceLocation: 'FOREST',
    icon: 'Flame',
    description: 'Orman temizlendiğinde kazanılan yakacak odun.',
  },
  SU: {
    id: 'SU',
    name: 'Water',
    turkishName: 'Su',
    sourceLocation: 'RIVER',
    icon: 'Droplets',
    description: 'Nehir temizlendiğinde kazanılan taze su kaynağı.',
  },
};

export interface LocationConfig {
  id: LocationId;
  name: string;
  type: 'SAFE' | 'STORE' | 'BATTLE';
  award?: AwardType;
  monsterConfig?: MonsterConfigItem;
  minMonsters?: number;
  maxMonsters?: number;
  description: string;
  image: string;
  tagline: string;
}

export const LOCATIONS: LocationConfig[] = [
  {
    id: 'SAFE_HOUSE',
    name: 'Güvenli Ev',
    type: 'SAFE',
    description: 'Burası sizin için güvenli bir mekan, düşman yoktur! Canınız tamamen yenilenir. Tüm bölge ödüllerini toplayıp buraya gelirseniz oyunu kazanırsınız.',
    image: '/src/assets/images/hero_safehouse_tavern_1793433592573.jpg',
    tagline: 'Sığınak & Şifa Alanı',
  },
  {
    id: 'TOOL_STORE',
    name: 'Eşya Dükkanı',
    type: 'STORE',
    description: 'Altınlarınızla zırh ve silah satın alabileceğiniz donanım mağazası.',
    image: '/src/assets/images/hero_safehouse_tavern_1793433592573.jpg',
    tagline: 'Silah & Zırh Tedariği',
  },
  {
    id: 'CAVE',
    name: 'Mağara',
    type: 'BATTLE',
    award: 'YEMEK',
    monsterConfig: MONSTERS_CONFIG.ZOMBIE,
    minMonsters: 1,
    maxMonsters: 3,
    description: 'Karanlık ve rutubetli bir mağara. Dikkatli ol, Zombilerle karşılaşabilirsin!',
    image: '/src/assets/images/location_cave_dungeon_1793433591930.jpg',
    tagline: 'Ödül: Yemek (Food) · Zombi Bölgesi (1-3 Adet)',
  },
  {
    id: 'FOREST',
    name: 'Orman',
    type: 'BATTLE',
    award: 'ODUN',
    monsterConfig: MONSTERS_CONFIG.VAMPIRE,
    minMonsters: 1,
    maxMonsters: 3,
    description: 'Sisli ve tekinsiz bir orman. Ağaçların arasından Vampirler saldırabilir!',
    image: '/src/assets/images/location_forest_night_1793433592696.jpg',
    tagline: 'Ödül: Odun (Firewood) · Vampir Bölgesi (1-3 Adet)',
  },
  {
    id: 'RIVER',
    name: 'Nehir',
    type: 'BATTLE',
    award: 'SU',
    monsterConfig: MONSTERS_CONFIG.BEAR,
    minMonsters: 1,
    maxMonsters: 3,
    description: 'Vahşi nehir kıyısı. Balık tutan Ayılar alanlarını koruyor!',
    image: '/src/assets/images/location_forest_night_1793433592696.jpg',
    tagline: 'Ödül: Su (Water) · Ayı Bölgesi (1-3 Adet)',
  },
  {
    id: 'MINE',
    name: 'Maden',
    type: 'BATTLE',
    monsterConfig: MONSTERS_CONFIG.SNAKE,
    minMonsters: 1,
    maxMonsters: 5, // 1-5 adet yılan
    description: 'Terk edilmiş derin maden ocağı. Zehirli yılanları alt ederek zengin ganimetler (Silah, Zırh, Para) kazanabilirsin!',
    image: '/src/assets/images/location_mine_depths_1793433592129.jpg',
    tagline: 'Özellik: Savaş ve Ganimet · Yılan Bölgesi (1-5 Adet)',
  },
];
