import React, { useState } from 'react';
import { Product, ProductType, Supplier, SwingTheme } from '../../types/warehouse';
import { Plus, X, Layers, AlertCircle, ThermometerSnowflake, ShieldAlert, Cpu } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  suppliers: Supplier[];
  theme: SwingTheme;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  suppliers,
  theme,
  onClose,
  onSubmit,
}) => {
  const [sku, setSku] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Endüstriyel Elektronik');
  const [productType, setProductType] = useState<ProductType>('STANDARD');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [reorderThreshold, setReorderThreshold] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(150);
  const [shelfLocation, setShelfLocation] = useState<string>('A-01-01');
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || 'sup-1');
  const [unit, setUnit] = useState<string>('Adet');
  const [description, setDescription] = useState<string>('');

  // Polymorphic custom fields
  const [expiryDate, setExpiryDate] = useState<string>('2026-12-31');
  const [storageTempCelsius, setStorageTempCelsius] = useState<number>(4);
  const [batchNumber, setBatchNumber] = useState<string>('LOT-2026-NEW');
  const [hazardClass, setHazardClass] = useState<string>('Sınıf 3 - Yanıcı Sıvı');
  const [unCode, setUnCode] = useState<string>('UN 1993');
  const [ventilationRequired, setVentilationRequired] = useState<boolean>(true);
  const [serialNumber, setSerialNumber] = useState<string>('SN-2026-X01');
  const [warrantyMonths, setWarrantyMonths] = useState<number>(24);
  const [esdProtected, setEsdProtected] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'darcula';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) {
      setError('Lütfen SKU ve Ürün Adını eksiksiz giriniz.');
      return;
    }
    if (unitPrice < 0) {
      setError('Birim fiyat negatif olamaz!');
      return;
    }
    if (stockQuantity < 0) {
      setError('Başlangıç stoğu negatif olamaz!');
      return;
    }

    const newProd: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      sku: sku.toUpperCase().trim(),
      name: name.trim(),
      category,
      productType,
      stockQuantity,
      reorderThreshold,
      unitPrice,
      shelfLocation,
      supplierId,
      unit,
      description: description || 'Depo otomasyonu üzerinden yeni kaydedilen ürün.',
      ...(productType === 'PERISHABLE' && {
        expiryDate,
        storageTempCelsius,
        batchNumber,
      }),
      ...(productType === 'HAZARDOUS' && {
        hazardClass,
        unCode,
        ventilationRequired,
      }),
      ...(productType === 'ELECTRONIC' && {
        serialNumber,
        warrantyMonths,
        esdProtected,
      }),
    };

    onSubmit(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-150 rounded-xs ${
          isDark
            ? 'bg-[#3c3f41] border border-[#555] text-[#bbb]'
            : 'bg-[#e7eaf0] border border-[#a0a8b5] text-[#2c3e50]'
        }`}
      >
        {/* Title bar */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold select-none ${
            isDark
              ? 'bg-[#2b2b2b] text-slate-100 border-b border-[#444]'
              : 'bg-gradient-to-r from-[#2f5597] to-[#1e3b6d] text-white'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">☕</span>
            <span>JDialog: Yeni OOP Ürün Tanımla (Product Model)</span>
          </div>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-red-600 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          {error && (
            <div className="p-2 rounded bg-red-950/80 border border-red-700 text-red-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">SKU Stok Kodu:</label>
              <input
                type="text"
                placeholder="Örn: ELK-STM-102"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-mono font-bold uppercase outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">OOP Somut Sınıfı (Polymorphism):</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
              >
                <option value="STANDARD">StandardProduct (Genel Sanayi)</option>
                <option value="PERISHABLE">PerishableProduct (Soğuk Hava/SKT)</option>
                <option value="HAZARDOUS">HazardousProduct (ADR Kimyasal)</option>
                <option value="ELECTRONIC">ElectronicProduct (ESD/Elektronik)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Ürün / Parça Adı:</label>
            <input
              type="text"
              placeholder="Örn: Endüstriyel Sıcaklık Transmitteri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-1.5 rounded-xs outline-hidden border ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-1.5 rounded-xs outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
              >
                <option value="Endüstriyel Elektronik">Endüstriyel Elektronik</option>
                <option value="Soğuk Hava Deposu">Soğuk Hava Deposu</option>
                <option value="Kimyasal & Tehlikeli">Kimyasal & Tehlikeli</option>
                <option value="Mekanik & Yedek Parça">Mekanik & Yedek Parça</option>
                <option value="Genel Depo">Genel Depo</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Depo Raf Kodu:</label>
              <input
                type="text"
                placeholder="Örn: B-02-14"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1">Başlangıç Stoğu:</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Kritik Stok Eşiği:</label>
              <input
                type="number"
                min="1"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(parseInt(e.target.value) || 1)}
                className={`w-full p-1.5 rounded-xs font-mono text-amber-300 font-bold outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Birim Fiyat (₺):</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Anlaşmalı Tedarikçi Firma:</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className={`w-full p-1.5 rounded-xs outline-hidden border ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city} - {s.leadTimeDays} Gün Termin)
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Polymorphic Fields */}
          {productType === 'PERISHABLE' && (
            <div className="p-3 rounded bg-cyan-950/20 border border-cyan-700/50 space-y-2">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5" /> PerishableProduct Özellikleri
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] mb-0.5">Son Kullanma Tarihi:</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-0.5">Depo Sıcaklığı (°C):</label>
                  <input
                    type="number"
                    value={storageTempCelsius}
                    onChange={(e) => setStorageTempCelsius(parseFloat(e.target.value) || 0)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-0.5">Parti / Lot No:</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {productType === 'HAZARDOUS' && (
            <div className="p-3 rounded bg-amber-950/20 border border-amber-700/50 space-y-2">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> HazardousProduct Özellikleri (ADR)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] mb-0.5">Tehlike Sınıfı:</label>
                  <input
                    type="text"
                    value={hazardClass}
                    onChange={(e) => setHazardClass(e.target.value)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-0.5">UN Kodu:</label>
                  <input
                    type="text"
                    value={unCode}
                    onChange={(e) => setUnCode(e.target.value)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {productType === 'ELECTRONIC' && (
            <div className="p-3 rounded bg-blue-950/20 border border-blue-700/50 space-y-2">
              <div className="font-bold text-blue-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> ElectronicProduct Özellikleri
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] mb-0.5">Seri No / Seri Ön Eki:</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-0.5">Garanti Süresi (Ay):</label>
                  <input
                    type="number"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(parseInt(e.target.value) || 24)}
                    className="w-full p-1 rounded bg-[#2b2b2b] border border-slate-600 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
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
              className="px-5 py-1.5 rounded-xs text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs"
            >
              Ürünü Depo Veritabanına Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
