import React, { useState } from 'react';
import { Product, MovementType, SwingTheme } from '../../types/warehouse';
import { Plus, Minus, X, AlertCircle, FileText, User, Hash } from 'lucide-react';

interface StockMovementModalProps {
  isOpen: boolean;
  type: MovementType;
  product: Product | null;
  allProducts: Product[];
  theme: SwingTheme;
  onClose: () => void;
  onSubmit: (data: {
    sku: string;
    quantity: number;
    reason: string;
    documentNo: string;
    operatorName: string;
    notes?: string;
  }) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  type,
  product,
  allProducts,
  theme,
  onClose,
  onSubmit,
}) => {
  const [selectedSku, setSelectedSku] = useState<string>(product?.sku || allProducts[0]?.sku || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [documentNo, setDocumentNo] = useState<string>(
    type === 'STOCK_IN' ? `İRS-2026-${Math.floor(1000 + Math.random() * 9000)}` : `SEVK-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [operatorName, setOperatorName] = useState<string>('Enes Öztürk (Depo Müdürü)');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeProduct = allProducts.find((p) => p.sku === selectedSku) || product || allProducts[0];
  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const defaultReasons =
    type === 'STOCK_IN'
      ? ['Tedarikçi Giriş Kabulü', 'İade Ürün Kabulü', 'Depolar Arası Transfer', 'Sayım Fazlası Düzeltme']
      : ['Müşteri Satış Sevkiyatı', 'Üretim Bandı Teslimi', 'Arızalı / İade Çıkışı', 'Sayım Eksiği Düzeltme'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError('Miktar en az 1 olmalıdır.');
      return;
    }

    if (type === 'STOCK_OUT' && activeProduct && quantity > activeProduct.stockQuantity) {
      setError(
        `InsufficientStockException: Talep edilen ${quantity} ${activeProduct.unit}, mevcut stok ise ${activeProduct.stockQuantity} ${activeProduct.unit}!`
      );
      return;
    }

    onSubmit({
      sku: activeProduct.sku,
      quantity,
      reason: reason || defaultReasons[0],
      documentNo,
      operatorName,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        className={`w-full max-w-lg shadow-2xl transition-all duration-150 rounded-xs overflow-hidden ${
          isDark
            ? 'bg-[#3c3f41] border border-[#555] text-[#bbb]'
            : isNimbus
            ? 'bg-[#e7eaf0] border border-[#a0a8b5] text-[#2c3e50]'
            : 'bg-[#d4d0c8] border-2 border-t-white border-l-white border-b-black border-r-black text-black'
        }`}
      >
        {/* JDialog Title Bar */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold select-none ${
            isDark
              ? 'bg-[#2b2b2b] text-slate-100 border-b border-[#444]'
              : isNimbus
              ? 'bg-gradient-to-r from-[#2f5597] to-[#1e3b6d] text-white'
              : 'bg-[#000080] text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {type === 'STOCK_IN' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Plus className="w-3.5 h-3.5" /> JDialog: Depo Giriş İşlemi (Stock In)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <Minus className="w-3.5 h-3.5" /> JDialog: Depo Çıkış İşlemi (Stock Out)
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-red-600 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-red-950/80 border border-red-700 text-red-300 font-mono text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Select */}
          <div>
            <label className="block font-medium mb-1 opacity-90">İşlem Yapılacak Ürün:</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.sku}>
                  {p.sku} - {p.name} (Mevcut Stok: {p.stockQuantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Product quick info pill */}
          {activeProduct && (
            <div className={`p-2 rounded-xs border text-[11px] font-mono flex items-center justify-between ${
              isDark ? 'bg-[#2b2b2b] border-[#444] text-slate-300' : 'bg-white border-slate-300 text-slate-700'
            }`}>
              <div>
                Raf Konumu: <strong className="text-amber-400">{activeProduct.shelfLocation}</strong>
              </div>
              <div>
                Mevcut: <strong className={activeProduct.stockQuantity === 0 ? 'text-red-400' : 'text-emerald-400'}>
                  {activeProduct.stockQuantity} {activeProduct.unit}
                </strong>
              </div>
              <div>
                Kritik Eşik: <strong className="text-amber-300">{activeProduct.reorderThreshold} {activeProduct.unit}</strong>
              </div>
            </div>
          )}

          {/* Quantity & Document No Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 opacity-90">
                Miktar ({activeProduct ? activeProduct.unit : 'Adet'}):
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className={`w-full p-1.5 rounded-xs font-mono font-bold text-sm outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 opacity-90">İrsaliye / Belge No:</label>
              <input
                type="text"
                value={documentNo}
                onChange={(e) => setDocumentNo(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-medium mb-1 opacity-90">Hareket Sebebi:</label>
            <div className="flex gap-2">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-sans outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
              >
                {defaultReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operator Name */}
          <div>
            <label className="block font-medium mb-1 opacity-90">Yetkili Operatör:</label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className={`w-full p-1.5 rounded-xs outline-hidden border font-sans ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1 opacity-90">Notlar & Kalite Kontrol Açıklaması:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Barkod kontrolü yapıldı, parti lot numarası eşleşti."
              className={`w-full p-1.5 rounded-xs outline-hidden border font-sans ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
            />
          </div>

          {/* Button Strip */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xs text-xs font-medium transition-colors ${
                isDark ? 'bg-[#4e5254] hover:bg-[#5e6264] text-white' : 'bg-slate-200 hover:bg-slate-300 text-black'
              }`}
            >
              İptal
            </button>
            <button
              type="submit"
              className={`px-5 py-1.5 rounded-xs text-xs font-bold transition-all shadow-xs ${
                type === 'STOCK_IN'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {type === 'STOCK_IN' ? 'Depo Girişini Onayla (+)' : 'Depo Çıkışını Onayla (-)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
