import { Author, Genre, Book } from '../types';

export const INITIAL_GENRES: Genre[] = [
  { id: 1, name: 'Roman', isActive: true },
  { id: 2, name: 'Bilim Kurgu & Distopya', isActive: true },
  { id: 3, name: 'Dünya Klasiği', isActive: true },
  { id: 4, name: 'Şiir & Edebiyat', isActive: true },
  { id: 5, name: 'Tarih & Felsefe', isActive: true },
  { id: 6, name: 'Psikoloji & Kişisel Gelişim', isActive: true },
];

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 1,
    firstName: 'Sabahattin',
    lastName: 'Ali',
    birthDate: '1907-02-25',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 2,
    firstName: 'Yaşar',
    lastName: 'Kemal',
    birthDate: '1923-10-06',
    createdAt: '2026-01-11T10:30:00.000Z',
  },
  {
    id: 3,
    firstName: 'Halide Edib',
    lastName: 'Adıvar',
    birthDate: '1884-06-11',
    createdAt: '2026-01-12T14:15:00.000Z',
  },
  {
    id: 4,
    firstName: 'George',
    lastName: 'Orwell',
    birthDate: '1903-06-25',
    createdAt: '2026-01-13T11:20:00.000Z',
  },
  {
    id: 5,
    firstName: 'Ahmet Hamdi',
    lastName: 'Tanpınar',
    birthDate: '1901-06-23',
    createdAt: '2026-01-14T16:45:00.000Z',
  },
  {
    id: 6,
    firstName: 'Franz',
    lastName: 'Kafka',
    birthDate: '1883-07-03',
    createdAt: '2026-01-15T13:10:00.000Z',
  },
  {
    id: 7,
    firstName: 'Deneme',
    lastName: 'Yazarı (Kitapsız)',
    birthDate: '1990-05-15',
    createdAt: '2026-02-01T12:00:00.000Z',
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Kürk Mantolu Madonna',
    pageCount: 160,
    publishDate: '1943-01-01',
    genreId: 1, // Roman
    authorId: 1, // Sabahattin Ali
    isPublished: true,
    description: 'Raif Efendi ile Maria Puder arasındaki unutulmaz aşk ve insan psikolojisi.',
  },
  {
    id: 2,
    title: 'İçimizdeki Şeytan',
    pageCount: 268,
    publishDate: '1940-05-12',
    genreId: 1, // Roman
    authorId: 1, // Sabahattin Ali
    isPublished: true,
    description: 'Toplumsal ahlak, iç çatışmalar ve aydınların ruhsal durumunu ele alan eser.',
  },
  {
    id: 3,
    title: 'İnce Memed 1',
    pageCount: 436,
    publishDate: '1955-08-10',
    genreId: 1, // Roman
    authorId: 2, // Yaşar Kemal
    isPublished: true,
    description: 'Toros köylüsünün ağalık düzenine karşı başkaldırısı ve destansı direniş.',
  },
  {
    id: 4,
    title: 'Teneke',
    pageCount: 112,
    publishDate: '1955-11-20',
    genreId: 1, // Roman
    authorId: 2, // Yaşar Kemal
    isPublished: false, // Taslak / Yayında değil
    description: 'Çukurova’da genç bir kaymakam ile çeltik ağaları arasındaki mücadele.',
  },
  {
    id: 5,
    title: 'Ateşten Gömlek',
    pageCount: 224,
    publishDate: '1923-03-15',
    genreId: 5, // Tarih & Felsefe
    authorId: 3, // Halide Edib Adıvar
    isPublished: true,
    description: 'Milli Mücadele yıllarını anlatan ilk romanlardan biri.',
  },
  {
    id: 6,
    title: '1984',
    pageCount: 328,
    publishDate: '1949-06-08',
    genreId: 2, // Bilim Kurgu & Distopya
    authorId: 4, // George Orwell
    isPublished: true,
    description: 'Büyük Birader gözetiminde totaliter bir dünya distopyası.',
  },
  {
    id: 7,
    title: 'Hayvan Çiftliği',
    pageCount: 152,
    publishDate: '1945-08-17',
    genreId: 2, // Bilim Kurgu & Distopya
    authorId: 4, // George Orwell
    isPublished: true,
    description: 'Bütün hayvanlar eşittir ama bazı hayvanlar daha eşittir fablı.',
  },
  {
    id: 8,
    title: 'Saatleri Ayarlama Enstitüsü',
    pageCount: 382,
    publishDate: '1961-09-01',
    genreId: 1, // Roman
    authorId: 5, // Ahmet Hamdi Tanpınar
    isPublished: true,
    description: 'Doğu ile Batı arasında bocalayan Türk toplumunun hiciv dolu alegorisi.',
  },
  {
    id: 9,
    title: 'Dönüşüm',
    pageCount: 104,
    publishDate: '1915-10-01',
    genreId: 3, // Dünya Klasiği
    authorId: 6, // Franz Kafka
    isPublished: true,
    description: 'Gregor Samsa’nın bir sabah kendini devasa bir böceğe dönüşmüş bulması.',
  },
];
