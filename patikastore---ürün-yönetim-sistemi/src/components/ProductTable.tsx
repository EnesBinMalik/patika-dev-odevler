import React, { useState } from 'react';
import { Brand, Category, FilterState, NotebookProduct, PhoneProduct, Product } from '../types';
import { calculateDiscountedPrice, formatTL } from '../utils/formatters';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Laptop,
  Smartphone,
  Plus,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  Tag,
} from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onQuickStockChange: (id: number, delta: number) => void;
  onOpenAddModal: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  brands,
  categories,
  filters,
  onFilterChange,
  onEditProduct,
  onDeleteProduct,
  onQuickStockChange,
  onOpenAddModal,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Map of brandId -> brand name
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));

  // Sorted brands for dropdown (always alphabetical as per rule)
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  // Filtering
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (filters.categoryId !== 'all' && p.category !== filters.categoryId) {
      return false;
    }

    // Exact ID or prefix query
    if (filters.idQuery.trim()) {
      const q = filters.idQuery.trim();
      if (String(p.id) !== q && !String(p.id).includes(q)) {
        return false;
      }
    }

    // Brand filter
    if (filters.brandId !== 'all' && p.brandId !== filters.brandId) {
      return false;
    }

    // Text search (name or brand)
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase().trim();
      const bName = (brandMap.get(p.brandId) || '').toLowerCase();
      const pName = p.name.toLowerCase();
      if (!pName.includes(s) && !bName.includes(s)) {
        return false;
      }
    }

    // Price range
    if (filters.minPrice && p.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > parseFloat(filters.maxPrice)) return false;

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'id_asc':
        return a.id - b.id;
      case 'id_desc':
        return b.id - a.id;
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'name_asc':
        return a.name.localeCompare(b.name, 'tr');
      case 'discount_desc':
        return b.discountRate - a.discountRate;
      case 'stock_asc':
        return a.stock - b.stock;
      default:
        return a.id - b.id;
    }
  });

  const resetFilters = () => {
    onFilterChange({
      search: '',
      categoryId: filters.categoryId,
      brandId: 'all',
      idQuery: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'id_asc',
    });
  };

  const activeCategoryObj = categories.find((c) => c.id === filters.categoryId);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onFilterChange({ ...filters, categoryId: 'all' })}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            filters.categoryId === 'all'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Tüm Ürünler</span>
          <span className="text-[10px] font-mono opacity-80">({products.length})</span>
        </button>

        {categories.map((cat) => {
          const isActive = filters.categoryId === cat.id;
          const count = products.filter((p) => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, categoryId: cat.id })}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.id === 'notebook' && <Laptop className="w-3.5 h-3.5" />}
              {cat.id === 'phone' && <Smartphone className="w-3.5 h-3.5" />}
              {cat.id !== 'notebook' && cat.id !== 'phone' && <Sparkles className="w-3.5 h-3.5" />}
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Text Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Ürün adı veya marka ara..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Exact ID Filter (Assignment Requirement: ID'ye göre filtreleyebilme) */}
          <div className="relative">
            <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold pointer-events-none">
              #
            </span>
            <input
              type="text"
              value={filters.idQuery}
              onChange={(e) => onFilterChange({ ...filters, idQuery: e.target.value })}
              placeholder="Ürün ID ile filtrele (örn: 1, 102)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Brand Filter (Assignment Requirement: Markalara göre filtreleyebilme) */}
          <div className="relative">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.brandId}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  brandId: e.target.value === 'all' ? 'all' : Number(e.target.value),
                })
              }
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tüm Markalar (Alfabetik)</option>
              {sortedBrands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="id_asc">Sırala: ID (1 &rarr; 99)</option>
              <option value="id_desc">Sırala: ID (99 &rarr; 1)</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name_asc">Ürün Adı: A &rarr; Z</option>
              <option value="discount_desc">En Çok İndirimli</option>
              <option value="stock_asc">Stok: Azdan Çoğa</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Reset */}
        {(filters.search || filters.idQuery || filters.brandId !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              <span>
                Filtrelenen: <strong>{filteredProducts.length}</strong> / {products.length} ürün
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Main Product Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold select-none">
                <th className="py-3 px-3.5 font-mono w-16">ID</th>
                <th className="py-3 px-3.5 min-w-[200px]">Ürün Adı</th>
                <th className="py-3 px-3.5 min-w-[120px] text-right">Fiyat</th>
                <th className="py-3 px-3.5 min-w-[110px]">Marka</th>

                {/* Columns based on active category */}
                {filters.categoryId === 'notebook' && (
                  <>
                    <th className="py-3 px-3.5 min-w-[100px]">Depolama</th>
                    <th className="py-3 px-3.5 min-w-[90px]">Ekran</th>
                    <th className="py-3 px-3.5 min-w-[80px]">RAM</th>
                  </>
                )}

                {filters.categoryId === 'phone' && (
                  <>
                    <th className="py-3 px-3.5 min-w-[90px]">Depolama</th>
                    <th className="py-3 px-3.5 min-w-[90px]">Ekran</th>
                    <th className="py-3 px-3.5 min-w-[90px]">Kamera</th>
                    <th className="py-3 px-3.5 min-w-[90px]">Pil</th>
                    <th className="py-3 px-3.5 min-w-[80px]">RAM</th>
                    <th className="py-3 px-3.5 min-w-[80px]">Renk</th>
                  </>
                )}

                {filters.categoryId === 'all' && (
                  <>
                    <th className="py-3 px-3.5 min-w-[100px]">Kategori</th>
                    <th className="py-3 px-3.5 min-w-[200px]">Önemli Nitelikler</th>
                  </>
                )}

                {/* Custom Category dynamic headers */}
                {filters.categoryId !== 'all' &&
                  filters.categoryId !== 'notebook' &&
                  filters.categoryId !== 'phone' && (
                    <th className="py-3 px-3.5 min-w-[200px]">Özel Nitelikler</th>
                  )}

                <th className="py-3 px-3.5 min-w-[110px] text-center">Stok</th>
                <th className="py-3 px-3.5 text-right w-24">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="py-12 px-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium">
                        Kriterlere uygun ürün bulunamadı.
                      </p>
                      <button
                        onClick={onOpenAddModal}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Yeni Ürün Ekle
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => {
                  const brandName = brandMap.get(product.brandId) || 'Bilinmiyor';
                  const discountedPrice = calculateDiscountedPrice(
                    product.price,
                    product.discountRate
                  );
                  const isNotebook = product.category === 'notebook';
                  const isPhone = product.category === 'phone';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                        #{product.id}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{product.name}</span>
                          {product.discountRate > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-mono">
                              %{product.discountRate} İndirim
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price (Tabular nums) */}
                      <td className="py-3 px-3.5 text-right font-mono tabular-nums">
                        {product.discountRate > 0 ? (
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatTL(discountedPrice)}
                            </span>
                            <span className="block text-[10px] text-slate-400 line-through">
                              {formatTL(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatTL(product.price)}
                          </span>
                        )}
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-3.5">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {brandName}
                        </span>
                      </td>

                      {/* Notebook Columns */}
                      {filters.categoryId === 'notebook' && isNotebook && (
                        <>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as NotebookProduct).storage}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as NotebookProduct).screenSize}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-semibold text-slate-700 dark:text-slate-200">
                            {(product as NotebookProduct).ram}
                          </td>
                        </>
                      )}

                      {/* Phone Columns */}
                      {filters.categoryId === 'phone' && isPhone && (
                        <>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as PhoneProduct).storage}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as PhoneProduct).screenSize}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as PhoneProduct).camera}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {(product as PhoneProduct).battery} mAh
                          </td>
                          <td className="py-3 px-3.5 font-mono font-semibold text-slate-700 dark:text-slate-200">
                            {(product as PhoneProduct).ram}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="text-slate-700 dark:text-slate-300">
                              {(product as PhoneProduct).color}
                            </span>
                          </td>
                        </>
                      )}

                      {/* All Category Combined Columns */}
                      {filters.categoryId === 'all' && (
                        <>
                          <td className="py-3 px-3.5">
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 capitalize">
                              {product.category === 'notebook'
                                ? 'Notebook'
                                : product.category === 'phone'
                                ? 'Cep Telefonu'
                                : product.category}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                            {isNotebook && (
                              <span>
                                {(product as NotebookProduct).ram} ·{' '}
                                {(product as NotebookProduct).storage} ·{' '}
                                {(product as NotebookProduct).screenSize}
                              </span>
                            )}
                            {isPhone && (
                              <span>
                                {(product as PhoneProduct).storage} ·{' '}
                                {(product as PhoneProduct).screenSize} ·{' '}
                                {(product as PhoneProduct).camera} ·{' '}
                                {(product as PhoneProduct).color}
                              </span>
                            )}
                            {!isNotebook && !isPhone && (
                              <span>
                                {JSON.stringify((product as any).customSpecs || {})}
                              </span>
                            )}
                          </td>
                        </>
                      )}

                      {/* Custom Category dynamic details */}
                      {filters.categoryId !== 'all' && !isNotebook && !isPhone && (
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                          {Object.entries((product as any).customSpecs || {}).map(([k, v]) => (
                            <span key={k} className="mr-2">
                              {k}: <strong>{String(v)}</strong>
                            </span>
                          ))}
                        </td>
                      )}

                      {/* Stock with quick buttons */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onQuickStockChange(product.id, -1)}
                            disabled={product.stock <= 0}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
                            title="Stok 1 Azalt"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                          <span
                            className={`font-mono font-semibold tabular-nums px-2 py-0.5 rounded text-[11px] ${
                              product.stock === 0
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : product.stock < 10
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {product.stock}
                          </span>
                          <button
                            onClick={() => onQuickStockChange(product.id, 1)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            title="Stok 1 Arttır"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Ürünü Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onDeleteProduct(product.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-500 transition-colors"
                              >
                                Evet, Sil
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 text-slate-500 hover:text-slate-700 text-[10px]"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                              title="Ürünü Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Gösterilen: <strong className="text-slate-900 dark:text-white">{sortedProducts.length}</strong> / {products.length} ürün
          </div>
          <div className="text-[11px] font-mono">
            PatikaStore · Enes Öztürk
          </div>
        </div>
      </div>
    </div>
  );
};
