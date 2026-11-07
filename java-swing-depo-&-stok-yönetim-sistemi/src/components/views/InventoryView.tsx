import React, { useState } from 'react';
import { Product, ProductType, SwingTheme } from '../../types/warehouse';
import {
  Search,
  Filter,
  Plus,
  Minus,
  AlertTriangle,
  Layers,
  ThermometerSnowflake,
  ShieldAlert,
  Cpu,
  Package,
  Info,
  ChevronRight,
  Folder,
  FolderOpen,
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  theme: SwingTheme;
  onSelectProduct: (p: Product) => void;
  onStockIn: (p: Product) => void;
  onStockOut: (p: Product) => void;
  onSimulateCritical: (p: Product) => void;
  calculateStorageCost: (p: Product) => number;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  theme,
  onSelectProduct,
  onStockIn,
  onStockOut,
  onSimulateCritical,
  calculateStorageCost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OK' | 'CRITICAL' | 'DEPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const categories = [
    { id: 'ALL', name: 'Tüm Depo Ürünleri', icon: Package, count: products.length },
    {
      id: 'Endüstriyel Elektronik',
      name: 'Endüstriyel Elektronik',
      icon: Cpu,
      count: products.filter((p) => p.category === 'Endüstriyel Elektronik').length,
    },
    {
      id: 'Soğuk Hava Deposu',
      name: 'Soğuk Hava Deposu (Bozulabilir)',
      icon: ThermometerSnowflake,
      count: products.filter((p) => p.category === 'Soğuk Hava Deposu').length,
    },
    {
      id: 'Kimyasal & Tehlikeli',
      name: 'Kimyasal & Tehlikeli (ADR)',
      icon: ShieldAlert,
      count: products.filter((p) => p.category === 'Kimyasal & Tehlikeli').length,
    },
    {
      id: 'Mekanik & Yedek Parça',
      name: 'Mekanik & Yedek Parça',
      icon: Layers,
      count: products.filter((p) => p.category === 'Mekanik & Yedek Parça').length,
    },
    {
      id: 'Genel Depo',
      name: 'Genel Depo',
      icon: Package,
      count: products.filter((p) => p.category === 'Genel Depo').length,
    },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
      return false;
    }
    if (statusFilter === 'OK' && p.stockQuantity <= p.reorderThreshold) {
      return false;
    }
    if (statusFilter === 'CRITICAL' && (p.stockQuantity === 0 || p.stockQuantity > p.reorderThreshold)) {
      return false;
    }
    if (statusFilter === 'DEPLETED' && p.stockQuantity !== 0) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchName = p.name.toLowerCase().includes(q);
      const matchLocation = p.shelfLocation.toLowerCase().includes(q);
      if (!matchSku && !matchName && !matchLocation) return false;
    }
    return true;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const getProductTypeBadge = (type: ProductType) => {
    switch (type) {
      case 'PERISHABLE':
        return (
          <span className="inline-flex items-center gap-1 text-cyan-400 font-mono text-[11px]">
            <ThermometerSnowflake className="w-3 h-3" /> PerishableProduct
          </span>
        );
      case 'HAZARDOUS':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[11px]">
            <ShieldAlert className="w-3 h-3" /> HazardousProduct
          </span>
        );
      case 'ELECTRONIC':
        return (
          <span className="inline-flex items-center gap-1 text-blue-400 font-mono text-[11px]">
            <Cpu className="w-3 h-3" /> ElectronicProduct
          </span>
        );
      case 'STANDARD':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[11px]">
            <Package className="w-3 h-3" /> StandardProduct
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top Controls Bar (Search + Quick Filter tabs) */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b text-xs ${
          isDark
            ? 'bg-[#3c3f41] border-[#313335] text-slate-300'
            : isNimbus
            ? 'bg-[#edf0f5] border-[#b8c0cc] text-slate-800'
            : 'bg-[#d4d0c8] border-[#808080] text-black'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SKU, ürün adı veya raf kodu ara (örn. STM32, A-02)..."
              className={`w-full pl-8 pr-3 py-1 rounded-xs text-xs font-mono outline-hidden border transition-colors ${
                isDark
                  ? 'bg-[#2b2b2b] border-[#4a4a4a] text-slate-100 focus:border-blue-500'
                  : isNimbus
                  ? 'bg-white border-[#a0a8b5] text-slate-900 focus:border-blue-600'
                  : 'bg-white border-2 border-t-black border-l-black border-b-white border-r-white text-black'
              }`}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 text-xs"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Status filter tabs (Segmented control) */}
        <div
          className={`flex items-center p-0.5 rounded-xs border ${
            isDark ? 'bg-[#2b2b2b] border-[#4a4a4a]' : 'bg-[#e0e4eb] border-[#b0b8c5]'
          }`}
        >
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'ALL'
                ? isDark
                  ? 'bg-[#3c3f41] text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tümü ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('OK')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'OK'
                ? isDark
                  ? 'bg-[#3c3f41] text-emerald-300 shadow-xs'
                  : 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yeterli ({products.filter((p) => p.stockQuantity > p.reorderThreshold).length})
          </button>
          <button
            onClick={() => setStatusFilter('CRITICAL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'CRITICAL'
                ? isDark
                  ? 'bg-[#3c3f41] text-amber-300 shadow-xs'
                  : 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kritik Seviye ({products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.reorderThreshold).length})
          </button>
          <button
            onClick={() => setStatusFilter('DEPLETED')}
            className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors ${
              statusFilter === 'DEPLETED'
                ? isDark
                  ? 'bg-[#3c3f41] text-red-400 shadow-xs'
                  : 'bg-white text-red-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tükendi ({products.filter((p) => p.stockQuantity === 0).length})
          </button>
        </div>
      </div>

      {/* Main Split: Left JTree Category Sidebar + Center JTable */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left JTree Category Pane */}
        <aside
          className={`w-60 border-r flex flex-col shrink-0 select-none overflow-y-auto ${
            isDark
              ? 'bg-[#313335] border-[#2b2b2b] text-slate-300'
              : isNimbus
              ? 'bg-[#e2e7ef] border-[#b0b8c5] text-slate-800'
              : 'bg-[#d4d0c8] border-[#808080] text-black'
          }`}
        >
          <div
            className={`px-3 py-1.5 text-[11px] font-semibold border-b tracking-wide flex items-center justify-between ${
              isDark ? 'bg-[#2b2b2b] border-[#383a3c] text-slate-400' : 'bg-[#d0d6e2] border-[#b0b8c5]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" /> JTree: Kategori Ağacı
            </span>
          </div>

          <div className="p-2 space-y-1 text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs transition-colors text-left ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2f65ca] text-white font-medium'
                        : 'bg-[#2f5597] text-white font-medium'
                      : isDark
                      ? 'hover:bg-[#3c3f41] text-slate-300'
                      : 'hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-black/30 text-slate-400'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* OOP Class Legend Box */}
          <div className={`mt-auto p-3 m-2 border rounded-xs text-[11px] ${
            isDark ? 'bg-[#2b2b2b] border-[#444] text-slate-300' : 'bg-white border-[#ccd] text-slate-700'
          }`}>
            <div className="font-semibold text-amber-400 flex items-center gap-1 mb-1.5">
              <Layers className="w-3 h-3" /> OOP Kalıtım Hiyerarşisi
            </div>
            <div className="space-y-1 font-mono text-[10px]">
              <div className="text-slate-400">abstract Product</div>
              <div className="pl-2 border-l border-slate-600 text-cyan-400">↳ PerishableProduct</div>
              <div className="pl-2 border-l border-slate-600 text-amber-400">↳ HazardousProduct</div>
              <div className="pl-2 border-l border-slate-600 text-blue-400">↳ ElectronicProduct</div>
              <div className="pl-2 border-l border-slate-600 text-slate-300">↳ StandardProduct</div>
            </div>
          </div>
        </aside>

        {/* Right JTable Data View */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#2b2b2b] overflow-hidden">
          {/* Table Header Bar */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead
                className={`sticky top-0 z-10 select-none border-b text-[11px] font-semibold ${
                  isDark
                    ? 'bg-[#313335] text-[#bbb] border-[#444]'
                    : isNimbus
                    ? 'bg-[#dce1e9] text-[#2c3e50] border-[#b0b8c5]'
                    : 'bg-[#d4d0c8] text-black border-[#808080]'
                }`}
              >
                <tr>
                  <th className="py-2 px-3 border-r border-slate-700/50">SKU</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">Ürün Adı & Tanımı</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">OOP Tipi (Polymorphic)</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-center">Raf Kodu</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Mevcut Stok</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Kritik Eşik</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Birim Fiyat</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Toplam Değer</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right" title="Çok biçimli depolama gider katsayısı">Aylık Depo Gideri</th>
                  <th className="py-2 px-3 text-center">Hızlı İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 font-sans">
                      Arama kriterlerine uygun ürün bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isSelected = p.id === selectedProductId;
                    const isDepleted = p.stockQuantity === 0;
                    const isCritical = p.stockQuantity > 0 && p.stockQuantity <= p.reorderThreshold;
                    const storageCost = calculateStorageCost(p);

                    return (
                      <tr
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          onSelectProduct(p);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? isDark
                              ? 'bg-[#1e3b6d] text-white'
                              : 'bg-[#2f5597] text-white'
                            : isDark
                            ? 'hover:bg-[#34383a] text-slate-200'
                            : 'hover:bg-slate-100 text-slate-900'
                        }`}
                      >
                        {/* SKU */}
                        <td className="py-2.5 px-3 font-bold text-amber-400 border-r border-slate-800">
                          {p.sku}
                        </td>

                        {/* Name & description */}
                        <td className="py-2.5 px-3 border-r border-slate-800 max-w-xs font-sans">
                          <div className="font-semibold truncate">{p.name}</div>
                          <div className="text-[11px] opacity-70 truncate font-mono">{p.category}</div>
                        </td>

                        {/* OOP Type */}
                        <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap">
                          {getProductTypeBadge(p.productType)}
                        </td>

                        {/* Shelf Location */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-center font-bold text-slate-300">
                          {p.shelfLocation}
                        </td>

                        {/* Current Stock */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums">
                          {isDepleted ? (
                            <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800 text-[11px]">
                              0 (TÜKENDİ)
                            </span>
                          ) : isCritical ? (
                            <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800 text-[11px]">
                              {p.stockQuantity} {p.unit} (KRİTİK)
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold">
                              {p.stockQuantity} {p.unit}
                            </span>
                          )}
                        </td>

                        {/* Critical Threshold */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums opacity-80">
                          {p.reorderThreshold} {p.unit}
                        </td>

                        {/* Unit Price */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums">
                          {p.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        {/* Total Valuation */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums font-semibold text-slate-100">
                          {(p.stockQuantity * p.unitPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        {/* Storage Cost (Polymorphic) */}
                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums text-cyan-300">
                          {storageCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺/ay
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onStockIn(p)}
                              className="p-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                              title="Stok Girişi Yap (+)"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onStockOut(p)}
                              className="p-1 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                              title="Stok Çıkışı Yap (-)"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSimulateCritical(p)}
                              className="p-1 rounded bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white transition-colors"
                              title="Kritik Stok Uyarısı Simülasyonu (Event-Driven)"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Selected Product Bottom Inspector (Encapsulated State Viewer) */}
          {selectedProduct && (
            <div
              className={`p-3 border-t text-xs select-none ${
                isDark ? 'bg-[#313335] border-[#444] text-slate-300' : 'bg-[#e7eaf0] border-[#b0b8c5] text-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 text-sm font-mono">{selectedProduct.sku}</span>
                  <span className="font-semibold text-slate-100">{selectedProduct.name}</span>
                  <span className="opacity-60 text-xs">· Raf: {selectedProduct.shelfLocation}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>
                    Birim Fiyat: <strong>{selectedProduct.unitPrice} ₺</strong>
                  </span>
                  <span>
                    Mevcut Stok: <strong className="text-emerald-400">{selectedProduct.stockQuantity} {selectedProduct.unit}</strong>
                  </span>
                  <span>
                    Kritik Eşik: <strong className="text-amber-400">{selectedProduct.reorderThreshold} {selectedProduct.unit}</strong>
                  </span>
                </div>
              </div>

              {/* Polymorphic Special Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono">
                {selectedProduct.productType === 'PERISHABLE' && (
                  <>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-cyan-400">SKT:</span> {selectedProduct.expiryDate || 'N/A'}
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-cyan-400">Depo Sıcaklığı:</span> {selectedProduct.storageTempCelsius}°C (İklimlendirmeli)
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-cyan-400">Lot / Parti No:</span> {selectedProduct.batchNumber || 'N/A'}
                    </div>
                  </>
                )}

                {selectedProduct.productType === 'HAZARDOUS' && (
                  <>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-amber-400">Tehlike Sınıfı:</span> {selectedProduct.hazardClass || 'Sınıf 3'}
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-amber-400">UN Kodu:</span> {selectedProduct.unCode || 'UN 1203'}
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-amber-400">Havalandırma:</span> {selectedProduct.ventilationRequired ? 'ZORUNLU' : 'Opsiyonel'}
                    </div>
                  </>
                )}

                {selectedProduct.productType === 'ELECTRONIC' && (
                  <>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-blue-400">Seri No:</span> {selectedProduct.serialNumber || 'SN-ARM-001'}
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-blue-400">Garanti:</span> {selectedProduct.warrantyMonths} Ay
                    </div>
                    <div className="p-1.5 rounded bg-black/20 border border-slate-700/50">
                      <span className="text-blue-400">ESD Koruma:</span> {selectedProduct.esdProtected ? 'Antistatik Ambalaj' : 'Standart'}
                    </div>
                  </>
                )}

                {selectedProduct.productType === 'STANDARD' && (
                  <div className="col-span-3 p-1.5 rounded bg-black/20 border border-slate-700/50 text-slate-300">
                    Standart Sanayi Depolama: Özel iklimlendirme veya kimyasal güvenlik gerektirmez.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
