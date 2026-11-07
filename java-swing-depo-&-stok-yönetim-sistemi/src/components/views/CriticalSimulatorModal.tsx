import React, { useState } from 'react';
import { Product, SwingTheme } from '../../types/warehouse';
import { ShieldAlert, X, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

interface CriticalSimulatorModalProps {
  isOpen: boolean;
  products: Product[];
  theme: SwingTheme;
  onClose: () => void;
  onSimulate: (sku: string, targetStock: number, reason: string) => void;
}

export const CriticalSimulatorModal: React.FC<CriticalSimulatorModalProps> = ({
  isOpen,
  products,
  theme,
  onClose,
  onSimulate,
}) => {
  const [selectedSku, setSelectedSku] = useState<string>(products[0]?.sku || '');

  if (!isOpen) return null;

  const activeProduct = products.find((p) => p.sku === selectedSku) || products[0];
  const isDark = theme === 'darcula';

  const handleSimulateCritical = () => {
    if (!activeProduct) return;
    // Set to threshold - 2
    const target = Math.max(1, activeProduct.reorderThreshold - 2);
    onSimulate(
      activeProduct.sku,
      target,
      'Event-Driven Test: Stok seviyesi kritik eşik altına düşürüldü.'
    );
    onClose();
  };

  const handleSimulateDepleted = () => {
    if (!activeProduct) return;
    onSimulate(
      activeProduct.sku,
      0,
      'Event-Driven Test: Stok tamamen tüketildi (0 adet). Acil tedarik emri tetiklenmeli.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        className={`w-full max-w-lg shadow-2xl rounded-xs overflow-hidden ${
          isDark
            ? 'bg-[#3c3f41] border border-[#555] text-[#bbb]'
            : 'bg-[#e7eaf0] border border-[#a0a8b5] text-[#2c3e50]'
        }`}
      >
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold select-none ${
            isDark ? 'bg-[#2b2b2b] text-slate-100 border-b border-[#444]' : 'bg-gradient-to-r from-[#2f5597] to-[#1e3b6d] text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>JDialog: Event-Driven Kritik Stok & Tükenme Simülatörü</span>
          </div>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-red-600 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed">
            Bu simülatör, <strong>Event-Driven (Olay Güdümlü) Observer Pattern</strong> mekanizmasını anında canlı test etmeniz için tasarlanmıştır. Bir ürünün stoğunu tükettiğinizde veya kritik eşik altına çektiğinizde, arka planda <code className="text-amber-300 font-mono">StockAlertListener</code> arayüzü tetiklenir, Java Swing <code className="text-red-400 font-mono">JOptionPane</code> uyarı penceresi açılır ve anlaşmalı tedarikçiye otomatik satın alma emri üretilir.
          </p>

          <div>
            <label className="block font-medium mb-1 text-slate-200">Test Edilecek Ürünü Seçin:</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className={`w-full p-2 rounded-xs font-mono outline-hidden border ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
            >
              {products.map((p) => (
                <option key={p.id} value={p.sku}>
                  {p.sku} - {p.name} (Mevcut: {p.stockQuantity} {p.unit} | Eşik: {p.reorderThreshold} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {activeProduct && (
            <div className={`p-3 rounded-xs border text-xs font-mono space-y-1 ${
              isDark ? 'bg-[#2b2b2b] border-[#444] text-slate-300' : 'bg-white border-slate-300 text-slate-700'
            }`}>
              <div className="flex justify-between">
                <span>Ürün:</span>
                <strong className="text-slate-100">{activeProduct.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mevcut Stok:</span>
                <strong className={activeProduct.stockQuantity === 0 ? 'text-red-400' : 'text-emerald-400'}>
                  {activeProduct.stockQuantity} {activeProduct.unit}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Kritik Eşik Seviyesi:</span>
                <strong className="text-amber-300">{activeProduct.reorderThreshold} {activeProduct.unit}</strong>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSimulateCritical}
              className="p-3 rounded-xs bg-amber-600 hover:bg-amber-500 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Kritik Seviyeye Düşür</span>
              <span className="text-[10px] font-normal opacity-80">(Eşik Altı Testi)</span>
            </button>

            <button
              onClick={handleSimulateDepleted}
              className="p-3 rounded-xs bg-red-600 hover:bg-red-500 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Stoku Sıfırla (0 Adet)</span>
              <span className="text-[10px] font-normal opacity-80">(Tükenme & Acil Sipariş)</span>
            </button>
          </div>

          <div className="pt-2 text-right border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xs text-xs font-medium bg-[#4e5254] hover:bg-[#5e6264] text-white"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
