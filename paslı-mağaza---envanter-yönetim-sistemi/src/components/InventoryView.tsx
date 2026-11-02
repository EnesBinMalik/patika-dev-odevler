import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Edit3, 
  Trash2, 
  ShoppingCart, 
  Truck, 
  X,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface InventoryViewProps {
  onQuickSale: (productId: number) => void;
  onQuickPurchase: (productId: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onQuickSale, onQuickPurchase }) => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    financials, 
    currentUser 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'normal' | 'low' | 'out'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: 'El Aletleri',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    minStock: '5',
    unit: 'Adet',
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filtreleme
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'normal') matchesStock = p.quantity > p.minStock;
    if (stockFilter === 'low') matchesStock = p.quantity > 0 && p.quantity <= p.minStock;
    if (stockFilter === 'out') matchesStock = p.quantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    const nextSkuNum = products.length + 1;
    setFormData({
      sku: `PAS-${String(nextSkuNum).padStart(3, '0')}`,
      name: '',
      description: '',
      category: categories[0] || 'El Aletleri',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      minStock: '5',
      unit: 'Adet',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sku: p.sku,
      name: p.name,
      description: p.description,
      category: p.category,
      costPrice: String(p.costPrice),
      sellingPrice: String(p.sellingPrice),
      quantity: String(p.quantity),
      minStock: String(p.minStock),
      unit: p.unit,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addProduct({
      sku: formData.sku,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      quantity: Number(formData.quantity) || 0,
      minStock: Number(formData.minStock) || 5,
      unit: formData.unit,
    });

    if (res.success) {
      setIsAddModalOpen(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const res = updateProduct(editingProduct.id, {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      minStock: Number(formData.minStock),
      unit: formData.unit,
    });

    if (res.success) {
      setEditingProduct(null);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`'${name}' adlı ürünü envanterden silmek istediğinize emin misiniz?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Bilgi Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Toplam Ürün Çeşidi</span>
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {financials.totalProductsCount}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {financials.totalStockQuantity} toplam birim stok
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Toplam Envanter Maliyeti</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {financials.totalInventoryCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Depodaki fiziksel varlık
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Perakende Satış Potansiyeli</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {financials.totalRetailPotential.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Beklenen brüt satış değeri
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Kritik Stok Uyarısı</span>
            <AlertTriangle className={`w-4 h-4 ${financials.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${financials.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            {financials.lowStockCount} Kalem
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {financials.outOfStockCount > 0 ? `${financials.outOfStockCount} ürün tamamen tükendi` : 'Acil tedarik gerekli'}
          </span>
        </div>
      </div>

      {/* Kontrol ve Filtreleme Araç Çubuğu */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Arama */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ürün adı, SKU veya açıklama ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Kategori ve Stok Filtreleri */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">Tüm Kategoriler</option>
              {categories.map(c => (
                <option key={c} value={c} className="bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Stok Durumu Filtresi */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${stockFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tümü ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-2.5 py-1 rounded transition-colors ${stockFilter === 'low' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kritik ({financials.lowStockCount})
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-2.5 py-1 rounded transition-colors ${stockFilter === 'out' ? 'bg-rose-500/20 text-rose-300 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tükendi ({financials.outOfStockCount})
            </button>
          </div>

          {/* Yeni Ürün Ekle Butonu */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors shadow-xs ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Ürün Ekle</span>
          </button>
        </div>

      </div>

      {/* Envanter Tablosu */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 px-4">SKU / Kod</th>
                <th className="py-3 px-4">Ürün Bilgisi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Alış (Maliyet)</th>
                <th className="py-3 px-4 text-right">Satış Fiyatı</th>
                <th className="py-3 px-4 text-right">Brüt Marj</th>
                <th className="py-3 px-4 text-center">Mevcut Stok</th>
                <th className="py-3 px-4 text-right">Hızlı İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-medium text-slate-300">Aramanıza uygun ürün bulunamadı.</p>
                    <p className="text-xs text-slate-400 mt-1">Filtreleri sıfırlayabilir veya yeni bir ürün ekleyebilirsiniz.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const marginAmount = p.sellingPrice - p.costPrice;
                  const marginPct = p.sellingPrice > 0 ? (marginAmount / p.sellingPrice) * 100 : 0;
                  const isLow = p.quantity <= p.minStock && p.quantity > 0;
                  const isOut = p.quantity === 0;

                  return (
                    <tr 
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-orange-400 whitespace-nowrap">
                        {p.sku}
                      </td>

                      {/* Ürün Adı & Açıklama */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-100 group-hover:text-white transition-colors truncate">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {p.description || 'Açıklama belirtilmemiş'}
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3 px-4 text-xs text-slate-300 whitespace-nowrap">
                        {p.category}
                      </td>

                      {/* Alış (Birim Maliyet) */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                        {p.costPrice.toFixed(2)} ₺
                      </td>

                      {/* Satış Fiyatı */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-100">
                        {p.sellingPrice.toFixed(2)} ₺
                      </td>

                      {/* Kâr Marjı */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs">
                        <span className={marginPct >= 40 ? 'text-emerald-400' : 'text-slate-300'}>
                          %{marginPct.toFixed(1)}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          +{marginAmount.toFixed(1)}₺
                        </span>
                      </td>

                      {/* Stok Miktarı & Durumu */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono tabular-nums font-bold text-sm">
                          <span className={isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-slate-100'}>
                            {p.quantity}
                          </span>
                          <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                        </div>
                        {isOut ? (
                          <div className="text-[10px] text-rose-400 font-medium mt-0.5">TÜKENDİ</div>
                        ) : isLow ? (
                          <div className="text-[10px] text-amber-400 font-medium mt-0.5">KRİTİK ({p.minStock})</div>
                        ) : null}
                      </td>

                      {/* Aksiyonlar */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Satış Yap */}
                          <button
                            onClick={() => onQuickSale(p.id)}
                            disabled={p.quantity === 0}
                            className="p-1.5 rounded-lg bg-orange-600/10 text-orange-400 hover:bg-orange-600 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Bu üründen sat"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>

                          {/* Stok Alımı Yap */}
                          <button
                            onClick={() => onQuickPurchase(p.id)}
                            className="p-1.5 rounded-lg bg-sky-600/10 text-sky-400 hover:bg-sky-600 hover:text-white transition-colors"
                            title="Stok girişi / Satın alma yap"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>

                          {/* Düzenle */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Sil (Sadece Admin yetkisi kontrolü görseli) */}
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentUser.role === 'Admin'
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-rose-400'
                            }`}
                            title={currentUser.role === 'Admin' ? 'Ürünü Sil' : 'Ürün Sil (Admin yetkisi gerekir)'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* YENİ ÜRÜN EKLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Yeni Ürün Tanımla</h3>
                  <p className="text-xs text-slate-400 font-mono">Rust InventoryManager::add_product()</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">SKU / Barkod *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-orange-400 focus:outline-none focus:border-orange-500"
                    placeholder="Örn: RUST-SP-002"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                    placeholder="Örn: El Aletleri"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  placeholder="Örn: Krom Vanadyum Açık Ağız Anahtar Seti"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  placeholder="Malzeme, ebat ve kullanım özellikleri..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Birim Alış Maliyeti (₺) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Perakende Satış Fiyatı (₺) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 font-semibold focus:outline-none focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Başlangıç Stoğu *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kritik Eşik</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Birim</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Adet">Adet</option>
                    <option value="Paket">Paket</option>
                    <option value="Set">Set</option>
                    <option value="Kg">Kg</option>
                    <option value="Metre">Metre</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-xs"
                >
                  Ürünü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ÜRÜN DÜZENLE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Ürün Bilgilerini Güncelle</h3>
                  <p className="text-xs text-slate-400 font-mono">SKU: {editingProduct.sku}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ürün Adı</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Birim Alış Maliyeti (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Satış Fiyatı (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kritik Stok Eşiği</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-xs"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
