import { Brand, Category, Product } from '../types';

/**
 * Markalar statik olarak kod blokları içerisinden aşağıdaki sıra ile eklenmiştir:
 * Samsung, Lenovo, Apple, Huawei, Casper, Asus, HP, Xiaomi, Monster
 */
export const STATIC_BRANDS_INSERTION_ORDER: { id: number; name: string }[] = [
  { id: 1, name: 'Samsung' },
  { id: 2, name: 'Lenovo' },
  { id: 3, name: 'Apple' },
  { id: 4, name: 'Huawei' },
  { id: 5, name: 'Casper' },
  { id: 6, name: 'Asus' },
  { id: 7, name: 'HP' },
  { id: 8, name: 'Xiaomi' },
  { id: 9, name: 'Monster' },
];

/**
 * Markalar listelenirken her zaman alfabe sırasıyla listelenmelidir kuralı
 * Türk alfabesi duyarlı sıralama (localeCompare 'tr')
 */
export function getSortedBrands(brands: Brand[]): Brand[] {
  return [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'notebook',
    name: 'Notebook',
    description: 'Dizüstü bilgisayarlar, taşınabilir iş ve oyun istasyonları',
    specs: [
      { key: 'ram', label: 'RAM', type: 'select', options: ['8 GB', '16 GB', '32 GB', '64 GB'], required: true },
      { key: 'storage', label: 'Depolama', type: 'select', options: ['256 SSD', '512 SSD', '1024 SSD', '2048 SSD'], required: true },
      { key: 'screenSize', label: 'Ekran Boyutu', type: 'select', options: ['13.3 inç', '14.0 inç', '15.6 inç', '16.0 inç', '17.3 inç'], required: true },
    ],
  },
  {
    id: 'phone',
    name: 'Cep Telefonları',
    description: 'Akıllı telefonlar, mobil iletişim ve kamera cihazları',
    specs: [
      { key: 'storage', label: 'Hafıza', type: 'select', options: ['64 GB', '128 GB', '256 GB', '512 GB'], required: true },
      { key: 'screenSize', label: 'Ekran Boyutu', type: 'select', options: ['5.8 inç', '6.1 inç', '6.5 inç', '6.7 inç', '6.8 inç'], required: true },
      { key: 'camera', label: 'Kamera', type: 'text', unit: 'MP', required: true },
      { key: 'battery', label: 'Pil Gücü', type: 'number', unit: 'mAh', required: true },
      { key: 'ram', label: 'RAM', type: 'select', options: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'], required: true },
      { key: 'color', label: 'Renk', type: 'select', options: ['Siyah', 'Kırmızı', 'Mavi', 'Beyaz', 'Gümüş', 'Yeşil', 'Mor'], required: true },
    ],
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Prompt Örnek Notebook Ürünleri
  {
    id: 1,
    name: 'HUAWEI Matebook 14',
    price: 7000.0,
    discountRate: 10,
    stock: 24,
    brandId: 4, // Huawei
    category: 'notebook',
    ram: '16 GB',
    storage: '512 SSD',
    screenSize: '14.0 inç',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 2,
    name: 'LENOVO V14 IGL',
    price: 3699.0,
    discountRate: 5,
    stock: 45,
    brandId: 2, // Lenovo
    category: 'notebook',
    ram: '8 GB',
    storage: '1024 SSD',
    screenSize: '14.0 inç',
    createdAt: '2026-01-12T11:30:00Z',
  },
  {
    id: 3,
    name: 'ASUS Tuf Gaming',
    price: 8199.0,
    discountRate: 8,
    stock: 12,
    brandId: 6, // Asus
    category: 'notebook',
    ram: '32 GB',
    storage: '2048 SSD',
    screenSize: '15.6 inç',
    createdAt: '2026-01-15T14:15:00Z',
  },
  {
    id: 4,
    name: 'MONSTER Abra A5 V19.2',
    price: 11499.0,
    discountRate: 12,
    stock: 18,
    brandId: 9, // Monster
    category: 'notebook',
    ram: '16 GB',
    storage: '1024 SSD',
    screenSize: '15.6 inç',
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 5,
    name: 'APPLE MacBook Air M2',
    price: 18999.0,
    discountRate: 0,
    stock: 30,
    brandId: 3, // Apple
    category: 'notebook',
    ram: '16 GB',
    storage: '512 SSD',
    screenSize: '13.6 inç',
    createdAt: '2026-01-22T16:00:00Z',
  },
  {
    id: 6,
    name: 'HP Pavilion 15-EG2000',
    price: 6850.0,
    discountRate: 15,
    stock: 15,
    brandId: 7, // HP
    category: 'notebook',
    ram: '16 GB',
    storage: '512 SSD',
    screenSize: '15.6 inç',
    createdAt: '2026-01-25T13:20:00Z',
  },

  // Prompt Örnek Cep Telefonu Ürünleri
  {
    id: 101,
    name: 'SAMSUNG GALAXY A51',
    price: 3199.0,
    discountRate: 15,
    stock: 60,
    brandId: 1, // Samsung
    category: 'phone',
    storage: '128 GB',
    screenSize: '6.5 inç',
    camera: '32 MP',
    battery: 4000,
    ram: '6 GB',
    color: 'Siyah',
    createdAt: '2026-01-11T12:00:00Z',
  },
  {
    id: 102,
    name: 'iPhone 11 64 GB',
    price: 7379.0,
    discountRate: 0,
    stock: 18,
    brandId: 3, // Apple
    category: 'phone',
    storage: '64 GB',
    screenSize: '6.1 inç',
    camera: '12 MP',
    battery: 3046,
    ram: '6 GB',
    color: 'Mavi',
    createdAt: '2026-01-13T10:45:00Z',
  },
  {
    id: 103,
    name: 'Redmi Note 10 Pro 8GB',
    price: 4012.0,
    discountRate: 12,
    stock: 35,
    brandId: 8, // Xiaomi
    category: 'phone',
    storage: '128 GB',
    screenSize: '6.5 inç',
    camera: '35 MP',
    battery: 4000,
    ram: '12 GB',
    color: 'Beyaz',
    createdAt: '2026-01-16T15:20:00Z',
  },
  {
    id: 104,
    name: 'HUAWEI Nova 9',
    price: 5899.0,
    discountRate: 7,
    stock: 22,
    brandId: 4, // Huawei
    category: 'phone',
    storage: '128 GB',
    screenSize: '6.57 inç',
    camera: '50 MP',
    battery: 4300,
    ram: '8 GB',
    color: 'Mavi',
    createdAt: '2026-01-18T17:10:00Z',
  },
  {
    id: 105,
    name: 'CASPER VIA F30',
    price: 2999.0,
    discountRate: 10,
    stock: 40,
    brandId: 5, // Casper
    category: 'phone',
    storage: '128 GB',
    screenSize: '6.5 inç',
    camera: '20 MP',
    battery: 5000,
    ram: '4 GB',
    color: 'Siyah',
    createdAt: '2026-01-21T08:30:00Z',
  },
];
