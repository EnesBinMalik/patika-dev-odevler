export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

export type AsyncMode = 'async-await' | 'promise';

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'step' | 'success' | 'warn' | 'error' | 'signature' | 'output';
  message: string;
  details?: string;
}

export type SortOrder = 'id-asc' | 'id-desc' | 'date-desc' | 'date-asc' | 'title-asc';
