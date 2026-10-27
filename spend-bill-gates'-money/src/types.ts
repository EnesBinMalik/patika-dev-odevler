export type ItemCategory = 'all' | 'food' | 'tech' | 'luxury' | 'vehicles' | 'properties' | 'mega';

export interface Item {
  id: string;
  name: string;
  nameTr: string;
  price: number;
  category: ItemCategory;
  emoji: string;
  descriptionTr: string;
  descriptionEn: string;
}

export type CartState = Record<string, number>;

export type Language = 'tr' | 'en';
