export interface Character {
  id: number;
  name: string;
  title: string;
  damage: number;
  health: number;
  maxHealth: number;
  money: number;
  icon: string;
  description: string;
}

export interface Weapon {
  id: number;
  name: string;
  damage: number;
  price: number;
  icon: string;
  description: string;
}

export interface Armor {
  id: number;
  name: string;
  block: number;
  price: number;
  icon: string;
  description: string;
}

export interface Monster {
  id: number;
  name: string;
  minDamage: number;
  maxDamage: number;
  health: number;
  maxHealth: number;
  money: number;
  icon: string;
  description: string;
  isSnake?: boolean;
}

export type LocationId = 'SAFE_HOUSE' | 'TOOL_STORE' | 'CAVE' | 'FOREST' | 'RIVER' | 'MINE';

export type AwardType = 'YEMEK' | 'ODUN' | 'SU';

export interface AwardInfo {
  id: AwardType;
  name: string;
  turkishName: string;
  sourceLocation: LocationId;
  icon: string;
  description: string;
}

export interface Inventory {
  weapon: Weapon;
  armor: Armor;
  awards: AwardType[];
  clearedLocations: LocationId[];
  mineRunsCompleted: number;
  totalSnakesKilled: number;
  lootHistory: LootDropRecord[];
}

export interface LootDropRecord {
  id: string;
  snakeNumber: number;
  type: 'nothing' | 'weapon' | 'armor' | 'money';
  name: string;
  detail: string;
  timestamp: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'info' | 'player_hit' | 'monster_hit' | 'loot' | 'award' | 'initiative' | 'danger' | 'victory';
  timestamp: number;
}

export type TurnState = 'INITIATIVE' | 'PLAYER_TURN' | 'MONSTER_TURN' | 'VICTORY' | 'DEFEAT' | 'FLED';
