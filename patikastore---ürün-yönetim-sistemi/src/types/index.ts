export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  specs: CategorySpecField[];
  isCustom?: boolean;
}

export interface CategorySpecField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  unit?: string;
  required?: boolean;
}

export interface BaseProduct {
  id: number;
  name: string;
  price: number; // Birim Fiyatı (TL)
  discountRate: number; // İndirim Oranı (%)
  stock: number; // Stok Miktarı
  brandId: number;
  category: string; // 'notebook' | 'phone' | custom
  createdAt: string;
}

export interface NotebookProduct extends BaseProduct {
  category: 'notebook';
  ram: string; // 8 GB, 16 GB, 32 GB
  storage: string; // 512 SSD, 1024 SSD
  screenSize: string; // 14.0 inç, 15.6 inç
}

export interface PhoneProduct extends BaseProduct {
  category: 'phone';
  storage: string; // 64 GB, 128 GB
  screenSize: string; // 6.1 inç, 6.5 inç
  camera: string; // 32 MP, 12 MP
  battery: number; // 4000 mAh
  ram: string; // 6 GB, 12 GB
  color: string; // Siyah, Kırmızı, Mavi, Beyaz
}

export interface CustomProduct extends BaseProduct {
  customSpecs: Record<string, string | number>;
}

export type Product = NotebookProduct | PhoneProduct | CustomProduct;

export interface FilterState {
  search: string;
  categoryId: string; // 'all' or category id
  brandId: number | 'all';
  idQuery: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'id_asc' | 'id_desc' | 'price_asc' | 'price_desc' | 'name_asc' | 'discount_desc' | 'stock_asc';
}
