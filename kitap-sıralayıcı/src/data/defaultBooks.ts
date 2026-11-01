import { BookItem } from '../types/book';

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    name: 'Suç ve Ceza',
    pageCount: 687,
    author: 'Fyodor Dostoyevski',
    publishDate: 1866,
    genre: 'Klasik Roman',
    coverStyle: 'rose',
  },
  {
    id: 'book-2',
    name: 'Kürk Mantolu Madonna',
    pageCount: 160,
    author: 'Sabahattin Ali',
    publishDate: 1943,
    genre: 'Türk Edebiyatı',
    coverStyle: 'amber',
  },
  {
    id: 'book-3',
    name: 'Dönüşüm',
    pageCount: 104,
    author: 'Franz Kafka',
    publishDate: 1915,
    genre: 'Modern Klasik',
    coverStyle: 'stone',
  },
  {
    id: 'book-4',
    name: 'Simyacı',
    pageCount: 188,
    author: 'Paulo Coelho',
    publishDate: 1988,
    genre: 'Felsefi Roman',
    coverStyle: 'emerald',
  },
  {
    id: 'book-5',
    name: 'Şeker Portakalı',
    pageCount: 184,
    author: 'José Mauro de Vasconcelos',
    publishDate: 1968,
    genre: 'Dünya Edebiyatı',
    coverStyle: 'blue',
  },
];

// Helper comparator matching Java's compareTo (Turkish locale sensitive)
export function compareBooksByName(a: BookItem, b: BookItem): number {
  return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
}

// Helper comparator matching Java's Comparator for page count
export function compareBooksByPage(a: BookItem, b: BookItem): number {
  const pageDiff = a.pageCount - b.pageCount;
  if (pageDiff !== 0) return pageDiff;
  // Tie-breaker by name so TreeSet doesn't discard books with identical page counts
  return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
}
