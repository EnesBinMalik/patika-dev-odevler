export interface BookItem {
  id: string;
  name: string;
  pageCount: number;
  author: string;
  publishDate: number | string;
  genre?: string;
  coverStyle?: 'amber' | 'emerald' | 'blue' | 'rose' | 'indigo' | 'stone';
}

export type SortMode = 'name_asc' | 'page_asc' | 'name_desc' | 'page_desc';
