import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Building2, 
  ShieldAlert, 
  PackagePlus,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Purchase } from '../types/store';

interface PurchasesViewProps {
  initialProductId?: number | null;
  onClearInitialProduct?: () => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ initialProductId, onClearInitialProduct }) => {
  const { products, purchases, recordPurchase, financials, currentUser } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<number>(() => {
    if (initialProductId) return initialProductId;
    return products.length > 0 ? products[0].id : 1;
  });

  const [quantity, setQuantity] = useState<number>(10);
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('Anadolu Endüstriyel Hırdavat A.Ş.');
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [successPurchase, setSuccessPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
      if (onClearInitialProduct) onClearInitialProduct();
    }
  }, [initialProductId]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (selectedProduct) {
      setPurchasePrice(String(selectedProduct.costPrice));
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const nextInv = purchases.length + 1;
      setInvoiceNo(`ALM-${dateStr}-${String(nextInv).padStart(3, '0')}`);
    }
  }, [selectedProductId, selectedProduct, purchases.length]);

  const priceNum = Number(purchasePrice) || 0;
  const totalCost = quantity * priceNum;

  // Ağırlıklı ortalama birim maliyet önizleme hesabı
  const currentQty = selectedProduct ? selectedProduct.quantity : 0;
  const currentCost = selectedProduct ? selectedProduct.costPrice : 0;
  const newTotalQty = currentQty + quantity;
  const projectedWeightedCost = newTotalQty > 0 
    ? ((currentQty * currentCost) + (quantity * priceNum)) / newTotalQty 
    : priceNum;

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const res = recordPurchase({
      productId: selectedProduct.id,
      quantity,
      purchasePrice: priceNum,
      supplier,
      invoiceNo,
      note,
    });

    if (res.success && res.purchase) {
      setSuccessPurchase(res.purchase);
      setNote('');
      setQuantity(10);
    }
  };

  const isAuthorized = currentUser.role === 'Admin' || currentUser.role === 'Manager';

  return (
    <div className="space-y-6">
      
      {/* KPI Şeridi */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Toplam Alım Harcaması</span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {financials.totalPurchasesCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {purchases.length} adet satın alma faturası
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Giriş Yapılan Toplam Stok</span>
            <Truck className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {purchases.reduce((sum, p) => sum + p.quantity, 0)} Birim
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Depoya aktarılan ürün hacmi
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Aktif Tedarikçi Ağı</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {Array.from(new Set(purchases.map(p => p.supplier))).length} Firma
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Kayıtlı tedarikçi partnerleri
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Yetki Denetimi</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isAuthorized ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30'}`}>
              {currentUser.role}
            </span>
          </div>
          <div className="text-sm font-bold text-white mt-1">
            {isAuthorized ? 'Satın Alma Yetkisi Var' : 'Erişim Kısıtlı'}
          </div>
          <span className="text-xs text-slate-400 mt-0.5 block">
            {isAuthorized ? 'Enes Öztürk onaylı işlem' : 'Yalnızca Admin ve Müdür'}
          </span>
        </div>
      </div>

      {!isAuthorized && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <strong className="block font-semibold">Yetkisiz Rol Uyarısı (Rust RBAC Koruması)</strong>
            Şu an <strong>{currentUser.fullName} ({currentUser.role})</strong> olarak oturum açtınız. Satın alma işlemi gerçekleştirmek için sağ üstteki profilden <strong>Enes Öztürk (Admin)</strong> veya <strong>Ayşe Yılmaz (Müdür)</strong> seçiniz.
          </div>
        </div>
      )}

      {/* İki Kolonlu Alım Düzeni */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL: Satın Alma Formu */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <PackagePlus className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-white">Yeni Satın Alma / Stok Girişi</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Rust PurchaseManager::record_purchase
            </span>
          </div>

          <form onSubmit={handlePurchaseSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Alım Yapılacak Ürün *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} — Mevcut Stok: {p.quantity} {p.unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Satın Alınan Miktar ({selectedProduct?.unit || 'Adet'}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Birim Alış Fiyatı (₺) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-sky-400 font-semibold focus:outline-none focus:border-sky-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tedarikçi Firma Adı *
                </label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Firma veya toptancı adı..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fatura / İrsaliye No *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                İşlem Notu (Opsiyonel)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: Nakliye dahil, 30 gün vadeli..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* AĞIRLIKLI ORTALAMA MALİYET & STOK HESAPLAMA PANELİ */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Toplam Satın Alma Maliyeti:</span>
                <span className="font-mono text-sm font-bold text-sky-400 tabular-nums">
                  {totalCost.toFixed(2)} ₺
                </span>
              </div>

              <div className="border-t border-slate-800/80 pt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Stok Durumu:</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-300">
                    <span>{currentQty}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{newTotalQty} {selectedProduct?.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Ağırlıklı Ortalama Maliyet:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400">{currentCost.toFixed(2)} ₺</span>
                    <ArrowRight className="w-3 h-3 text-sky-400" />
                    <span className="text-sky-300 font-bold">{projectedWeightedCost.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-900 pt-1">
                Ağırlıklı maliyet formülü: <code>(Eski Stok × Eski Maliyet + Alım Adedi × Alım Fiyatı) / Yeni Stok</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isAuthorized || priceNum <= 0 || quantity <= 0}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Satın Almayı Onayla ve Stoğa İşle</span>
            </button>
          </form>
        </div>

        {/* SAĞ: Satın Alma Geçmişi Günlüğü */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Satın Alma İşlemleri Günlüğü</h2>
              <p className="text-xs text-slate-400">Tedarikçi faturaları ve depo stok artırımları</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {purchases.length} Alım Kaydı
            </span>
          </div>

          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Fatura No</th>
                  <th className="py-2.5 px-3">Ürün</th>
                  <th className="py-2.5 px-3 text-center">Miktar</th>
                  <th className="py-2.5 px-3 text-right">Birim Alış</th>
                  <th className="py-2.5 px-3 text-right">Toplam Maliyet</th>
                  <th className="py-2.5 px-3">Tedarikçi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Henüz kayıtlı satın alma bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                        {p.invoiceNo}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(p.timestamp).toLocaleDateString('tr-TR')}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 max-w-[170px]">
                        <span className="font-medium text-slate-200 block truncate">
                          {p.productName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.sku} · {p.managerName}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-200">
                        +{p.quantity}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-slate-300 tabular-nums">
                        {p.unitPurchasePrice.toFixed(2)} ₺
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-400 tabular-nums">
                        {p.totalCost.toFixed(2)} ₺
                      </td>

                      <td className="py-2.5 px-3 max-w-[130px] text-slate-300 truncate">
                        {p.supplier}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* BAŞARILI ALIM BİLDİRİMİ POPUP */}
      {successPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-sky-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Satın Alma Stoğa İşlendi</h3>
              <p className="text-xs text-slate-400 font-mono">{successPurchase.invoiceNo}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Ürün:</span>
                <span className="text-white text-right max-w-[200px] truncate">{successPurchase.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Giriş Yapılan Adet:</span>
                <span className="text-emerald-400 font-bold">+{successPurchase.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Birim Alış:</span>
                <span className="text-slate-200">{successPurchase.unitPurchasePrice.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-white">TOPLAM MALİYET:</span>
                <span className="text-sky-400 text-sm">{successPurchase.totalCost.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 text-[11px]">
                <span>Tedarikçi:</span>
                <span className="text-slate-300">{successPurchase.supplier}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Onaylayan Yönetici:</span>
                <span>{successPurchase.managerName}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessPurchase(null)}
              className="w-full py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
