import React, { useState, useEffect } from 'react';
import {
  STATIC_BRANDS_INSERTION_ORDER,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  getSortedBrands,
} from './data/initialData';
import { Brand, Category, FilterState, Product } from './types';
import { Navbar } from './components/Navbar';
import { ProductTable } from './components/ProductTable';
import { PatikaTerminal } from './components/PatikaTerminal';
import { ProductFormModal } from './components/ProductFormModal';
import { BrandModal } from './components/BrandModal';
import { CategoryModal } from './components/CategoryModal';
import { SubmissionModal } from './components/SubmissionModal';
import {
  Laptop,
  Smartphone,
  Tag,
  Boxes,
  Plus,
  Terminal,
  Table,
  CheckCircle,
  FileCheck2,
  FolderPlus,
  RefreshCw,
  Download,
} from 'lucide-react';
import { formatCurrencyPretty } from './utils/formatters';

const STORAGE_KEYS = {
  PRODUCTS: 'patikastore_products_v2',
  BRANDS: 'patikastore_brands_v2',
  CATEGORIES: 'patikastore_categories_v2',
  THEME: 'patikastore_theme',
};

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDark]);

  // Main Entities State with LocalStorage Persistence
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return STATIC_BRANDS_INSERTION_ORDER;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // View state
  const [activeTab, setActiveTab] = useState<'products' | 'terminal'>('products');

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoryId: 'all',
    brandId: 'all',
    idQuery: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'id_asc',
  });

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Handlers
  const handleSaveProduct = (data: any, idToUpdate?: number) => {
    if (idToUpdate) {
      // Edit
      setProducts((prev) =>
        prev.map((p) => (p.id === idToUpdate ? { ...p, ...data, id: idToUpdate } : p))
      );
      showToast(`ID #${idToUpdate} ürün bilgileri güncellendi.`);
    } else {
      // Add new
      const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
      const nextId = maxId >= 100 ? maxId + 1 : maxId + 1;
      const newProduct: Product = {
        ...data,
        id: nextId,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`"${newProduct.name}" (ID: #${newProduct.id}) sisteme eklendi.`);
    }
  };

  const handleDeleteProduct = (id: number): boolean => {
    const exists = products.some((p) => p.id === id);
    if (!exists) return false;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`ID: #${id} olan ürün başarıyla silindi.`);
    return true;
  };

  const handleQuickStockChange = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStock = Math.max(0, p.stock + delta);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );
  };

  const handleAddBrand = (brandName: string) => {
    const maxId = brands.length > 0 ? Math.max(...brands.map((b) => b.id)) : 0;
    const newBrand: Brand = {
      id: maxId + 1,
      name: brandName,
    };
    setBrands((prev) => [...prev, newBrand]);
    showToast(`"${brandName}" markası başarıyla eklendi.`);
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
    setFilters((prev) => ({ ...prev, categoryId: newCat.id }));
    showToast(`"${newCat.name}" kategorisi başarıyla eklendi.`);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'PatikaStore verilerini ilk ödev durumuna sıfırlamak istediğinize emin misiniz?'
      )
    ) {
      setProducts(INITIAL_PRODUCTS);
      setBrands(STATIC_BRANDS_INSERTION_ORDER);
      setCategories(INITIAL_CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.BRANDS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      showToast('Tüm veriler Patika başlangıç durumuna sıfırlandı.');
    }
  };

  const handleExportJSON = () => {
    const data = {
      store: 'PatikaStore',
      author: 'Enes Öztürk',
      exportedAt: new Date().toISOString(),
      brands: getSortedBrands(brands),
      categories,
      products,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patikastore_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON veri yedek dosyası indirildi.');
  };

  // Metrics
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const notebookCount = products.filter((p) => p.category === 'notebook').length;
  const phoneCount = products.filter((p) => p.category === 'phone').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingProduct(null);
          setIsProductModalOpen(true);
        }}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Section & Developer Signature Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Patika.dev Elektronik Ürün Yönetim Sistemi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              PatikaStore Yönetim Paneli
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Notebook ve Cep Telefonları ürün grupları, alfabetik sıralı marka kataloğu, Java konsol simülasyonu ve filtreleme altyapısı.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Geliştirici İmzası:
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold font-mono">
                Enes Öztürk
              </span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setIsSubmissionModalOpen(true)}
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Ödev Teslim Raporu
              </button>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Yeni Ürün Grubu (Kategori) Ekle"
            >
              <FolderPlus className="w-4 h-4 text-orange-500" />
              <span>+ Yeni Kategori</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Verileri Dışa Aktar"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dışa Aktar</span>
            </button>
            <button
              onClick={handleResetData}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="İlk Ödev Durumuna Sıfırla"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {products.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Toplam Kayıtlı Ürün
              </div>
            </div>
          </div>

          <div
            onClick={() => setIsBrandModalOpen(true)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:border-orange-300 dark:hover:border-orange-800 transition-colors group"
            title="Markaları Listele"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {brands.length} Marka
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Alfabetik Sıralı
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('products');
              setFilters((f) => ({ ...f, categoryId: 'notebook' }));
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {notebookCount} Notebook
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Dizüstü Bilgisayarlar
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('products');
              setFilters((f) => ({ ...f, categoryId: 'phone' }));
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {phoneCount} Cep Telefonu
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Mobil İletişim Cihazı
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'products'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Modern Tablo Görünümü</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'terminal'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Java Konsol Simülatörü (System.out.format)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Stok Değeri:</span>
            <strong className="text-slate-900 dark:text-white">
              {formatCurrencyPretty(totalInventoryValue)}
            </strong>
          </div>
        </div>

        {/* Content View: Table or Terminal */}
        {activeTab === 'products' ? (
          <ProductTable
            products={products}
            brands={brands}
            categories={categories}
            filters={filters}
            onFilterChange={setFilters}
            onEditProduct={(p) => {
              setEditingProduct(p);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onQuickStockChange={handleQuickStockChange}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
          />
        ) : (
          <PatikaTerminal
            products={products}
            brands={brands}
            categories={categories}
            onAddProduct={(p) => handleSaveProduct(p)}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>

      {/* Footer with Mandatory Signature */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-orange-600 text-white flex items-center justify-center font-bold text-[10px]">
              P
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">PatikaStore</span>
            <span>· Ürün Yönetim Sistemi Ödevi</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-orange-600 dark:text-orange-400 font-bold">
              Enes Öztürk İmzalı
            </span>
            <span>·</span>
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white hover:underline"
            >
              Teslim Bağlantısı
            </button>
            <span>·</span>
            <button
              onClick={() => setIsBrandModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white hover:underline"
            >
              Markalar Listesi
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200 border border-slate-800 dark:border-slate-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        categories={categories}
        brands={brands}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        defaultCategoryId={filters.categoryId}
      />

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        brands={brands}
        products={products}
        onAddBrand={handleAddBrand}
        onSelectBrandFilter={(brandId) => {
          setActiveTab('products');
          setFilters((f) => ({ ...f, brandId }));
        }}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        productCount={products.length}
        brandCount={brands.length}
      />
    </div>
  );
}
