export interface Note {
  id: string;
  content: string;
  colorId: string;
  createdAt: number;
  updatedAt?: number;
  pinned?: boolean;
}

export interface ColorOption {
  id: string;
  name: string;
  bgHex: string;
  borderHex: string;
  dotHex: string;
  textHex: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical';
