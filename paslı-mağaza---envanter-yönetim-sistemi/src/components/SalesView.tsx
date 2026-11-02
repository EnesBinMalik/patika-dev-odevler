import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Printer, 
  X, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Receipt
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Sale } from '../types/store';

interface SalesViewProps {
  initialProductId?: number | null;
  onClearInitialProduct?: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ initialProductId, onClearInitialProduct }) => {
  const { products, sales, recordSale, financials, currentUser } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<number>(() => {
    if (initialProductId) return initialProductId;
    return products.length > 0 ? products[0].id : 1;
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [successReceipt, setSuccessReceipt] = useState<Sale | null>(null);
  const [viewReceipt, setViewReceipt] = useState<Sale | null>(null);

  // Initial product prop güncellendiğinde senkronize et
  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
      if (onClearInitialProduct) onClearInitialProduct();
    }
  }, [initialProductId]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Ürün değiştiğinde varsayılan satış fiyatını doldur
  useEffect(() => {
    if (selectedProduct) {
      setSellingPrice(String(selectedProduct.sellingPrice));
    }
  }, [selectedProductId, selectedProduct]);

  // Canlı Hesaplama Mantığı
  const currentPrice = Number(sellingPrice) || (selectedProduct ? selectedProduct.sellingPrice : 0);
  const unitCost = selectedProduct ? selectedProduct.costPrice : 0;
  const totalAmount = quantity * currentPrice;
  const totalCost = quantity * unitCost;
  const profit = totalAmount - totalCost;
  const profitMargin = totalAmount > 0 ? (profit / totalAmount) * 100 : 0;
  const remainingStockAfterSale = selectedProduct ? selectedProduct.quantity - quantity : 0;

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const res = recordSale({
      productId: selectedProduct.id,
      quantity,
      sellingPrice: currentPrice,
      note,
    });

    if (res.success && res.sale) {
      setSuccessReceipt(res.sale);
      setNote('');
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Toplam Satış Hasılatı</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {financials.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {sales.length} işlem kaydı
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Toplam Brüt Kâr</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            +{financials.grossProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Net ticari kâr kazancı
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Ortalama Kâr Marjı</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            %{financials.profitMarginPercent.toFixed(1)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Satış hasılatı üzerinden
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Aktif Kasiyer</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentUser.role}
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 truncate mt-1">
            {currentUser.fullName}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Satış fişleri adınıza işlenir
          </span>
        </div>
      </div>

      {/* İki Kolonlu Satış Düzeni: Sol = Satış Kaydı & Canlı Kâr Motoru, Sağ = Satış Geçmişi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL: Satış İşlemi Oluşturucu */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-white">Yeni Satış Kaydet</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Rust SalesManager::record_sale
            </span>
          </div>

          <form onSubmit={handleSaleSubmit} className="space-y-4">
            
            {/* Ürün Seçimi */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Satılacak Ürünü Seçin *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                    [{p.sku}] {p.name} — Stok: {p.quantity} {p.unit} ({p.sellingPrice.toFixed(2)} ₺)
                  </option>
                ))}
              </select>

              {selectedProduct && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Mevcut Stok:</span>{' '}
                    <span className={`font-mono font-bold ${selectedProduct.quantity <= selectedProduct.minStock ? 'text-amber-400' : 'text-slate-200'}`}>
                      {selectedProduct.quantity} {selectedProduct.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Birim Maliyet:</span>{' '}
                    <span className="font-mono text-slate-300">
                      {selectedProduct.costPrice.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Miktar ve Satış Fiyatı */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Satış Miktarı ({selectedProduct?.unit || 'Adet'}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.quantity || 1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                  {selectedProduct && quantity > selectedProduct.quantity && (
                    <span className="text-[10px] text-rose-400 block mt-1">
                      ⚠️ Stok yetersiz ({selectedProduct.quantity} adet var)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Birim Satış Fiyatı (₺) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 font-semibold focus:outline-none focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Not / Müşteri Bilgisi */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                İşlem Notu / Fiş Açıklaması
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: Nakit, Kredi Kartı, Kurumsal Alım..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* CANLI KÂR VE HESAPLAMA PANELİ */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Toplam Satış Tutarı (Ciro):</span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {totalAmount.toFixed(2)} ₺
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Satılan Malın Maliyeti (SMM):</span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  - {totalCost.toFixed(2)} ₺
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block">
                    Tahakkuk Eden Brüt Kâr:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Kâr Marjı: %{profitMargin.toFixed(1)}
                  </span>
                </div>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                  +{profit.toFixed(2)} ₺
                </span>
              </div>

              {selectedProduct && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
                  <span>İşlem Sonrası Kalan Stok:</span>
                  <span className={`font-mono font-medium ${remainingStockAfterSale < 0 ? 'text-rose-400 font-bold' : remainingStockAfterSale <= selectedProduct.minStock ? 'text-amber-400' : 'text-slate-300'}`}>
                    {remainingStockAfterSale} {selectedProduct.unit}
                  </span>
                </div>
              )}
            </div>

            {/* Satış Butonu */}
            <button
              type="submit"
              disabled={!selectedProduct || selectedProduct.quantity < quantity || quantity <= 0}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Satışı Tamamla ve Kârı Kaydet</span>
            </button>
          </form>
        </div>

        {/* SAĞ: Satış Geçmişi Tablosu */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Satış İşlemleri Geçmişi</h2>
              <p className="text-xs text-slate-400">Son gerçekleştirilen perakende satışlar ve kâr dağılımı</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {sales.length} Toplam İşlem
            </span>
          </div>

          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Fiş No</th>
                  <th className="py-2.5 px-3">Ürün</th>
                  <th className="py-2.5 px-3 text-center">Adet</th>
                  <th className="py-2.5 px-3 text-right">Tutar</th>
                  <th className="py-2.5 px-3 text-right">Kâr</th>
                  <th className="py-2.5 px-3 text-right">Fiş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Henüz kaydedilmiş satış işlemi bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                        {s.receiptNo}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(s.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 max-w-[180px]">
                        <span className="font-medium text-slate-200 block truncate">
                          {s.productName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.sku} · {s.cashierName}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-200">
                        {s.quantity}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-100 tabular-nums">
                        {s.totalAmount.toFixed(2)} ₺
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        +{s.profit.toFixed(2)} ₺
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setViewReceipt(s)}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Satış Fişini Görüntüle"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* BAŞARILI SATIŞ BİLDİRİMİ / FİŞ POPUP */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Satış Başarıyla Gerçekleşti</h3>
              <p className="text-xs text-slate-400 font-mono">{successReceipt.receiptNo}</p>
            </div>

            {/* Fiş Detayı */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="text-center border-b border-slate-800 pb-2 mb-2 text-slate-300">
                <p className="font-bold text-white">🦀 PASLI MAĞAZA SATIŞ FİŞİ</p>
                <p className="text-[10px] text-slate-400">Yönetim: Enes Öztürk</p>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Ürün:</span>
                <span className="text-white text-right max-w-[200px] truncate">{successReceipt.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Miktar x Birim Fiyat:</span>
                <span className="text-slate-200">{successReceipt.quantity} x {successReceipt.unitSellingPrice.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">TOPLAM TUTAR:</span>
                <span className="text-emerald-400 text-sm">{successReceipt.totalAmount.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 text-[11px]">
                <span>Elde Edilen Ticari Kâr:</span>
                <span className="text-emerald-400 font-semibold">+{successReceipt.profit.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Kasiyer:</span>
                <span>{successReceipt.cashierName}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Tarih:</span>
                <span>{new Date(successReceipt.timestamp).toLocaleString('tr-TR')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır</span>
              </button>
              <button
                onClick={() => setSuccessReceipt(null)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FİŞ İNCELEME MODALI */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Satış Fişi Detayı</h3>
              </div>
              <button
                onClick={() => setViewReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="text-center border-b border-slate-800 pb-2 mb-2">
                <p className="font-bold text-white">🦀 PASLI MAĞAZA PERAKENDE FİŞİ</p>
                <p className="text-[10px] text-slate-400">Enes Öztürk İmzalı Perakende Çözümü</p>
                <p className="text-[10px] text-slate-400">Fiş No: {viewReceipt.receiptNo}</p>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Ürün:</span>
                <span className="text-white text-right max-w-[200px] truncate">{viewReceipt.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Miktar:</span>
                <span className="text-slate-200">{viewReceipt.quantity} Adet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Birim Satış:</span>
                <span className="text-slate-200">{viewReceipt.unitSellingPrice.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Birim Maliyet:</span>
                <span className="text-slate-400">{viewReceipt.unitCostPrice.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">TOPLAM TUTAR:</span>
                <span className="text-emerald-400 text-sm">{viewReceipt.totalAmount.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1">
                <span>Elde Edilen Net Kâr:</span>
                <span className="text-emerald-400 font-bold">+{viewReceipt.profit.toFixed(2)} ₺</span>
              </div>
              <div className="border-t border-slate-900 pt-2 text-[10px] text-slate-400 space-y-0.5">
                <div>Kasiyer: {viewReceipt.cashierName}</div>
                <div>Tarih: {new Date(viewReceipt.timestamp).toLocaleString('tr-TR')}</div>
                {viewReceipt.note && <div>Not: {viewReceipt.note}</div>}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
