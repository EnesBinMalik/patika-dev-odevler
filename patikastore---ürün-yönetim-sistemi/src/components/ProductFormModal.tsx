import React, { useState, useEffect } from 'react';
import { Brand, Category, Product } from '../types';
import { X, CheckCircle, Laptop, Smartphone, Sparkles } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
  onSave: (productData: any, idToUpdate?: number) => void;
  editingProduct?: Product | null;
  defaultCategoryId?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  brands,
  onSave,
  editingProduct,
  defaultCategoryId,
}) => {
  const [category, setCategory] = useState<string>('notebook');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('0');
  const [stock, setStock] = useState<string>('10');
  const [brandId, setBrandId] = useState<number>(brands[0]?.id || 1);

  // Notebook specific
  const [notebookRam, setNotebookRam] = useState('16 GB');
  const [notebookStorage, setNotebookStorage] = useState('512 SSD');
  const [notebookScreen, setNotebookScreen] = useState('14.0 inç');

  // Phone specific
  const [phoneStorage, setPhoneStorage] = useState('128 GB');
  const [phoneScreen, setPhoneScreen] = useState('6.5 inç');
  const [phoneCamera, setPhoneCamera] = useState('32 MP');
  const [phoneBattery, setPhoneBattery] = useState('4000');
  const [phoneRam, setPhoneRam] = useState('6 GB');
  const [phoneColor, setPhoneColor] = useState('Siyah');

  // Custom specs
  const [customSpecs, setCustomSpecs] = useState<Record<string, any>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate form when opened or editing
  useEffect(() => {
    if (editingProduct) {
      setCategory(editingProduct.category);
      setName(editingProduct.name);
      setPrice(String(editingProduct.price));
      setDiscountRate(String(editingProduct.discountRate));
      setStock(String(editingProduct.stock));
      setBrandId(editingProduct.brandId);

      if (editingProduct.category === 'notebook') {
        const nb = editingProduct as any;
        setNotebookRam(nb.ram || '16 GB');
        setNotebookStorage(nb.storage || '512 SSD');
        setNotebookScreen(nb.screenSize || '14.0 inç');
      } else if (editingProduct.category === 'phone') {
        const ph = editingProduct as any;
        setPhoneStorage(ph.storage || '128 GB');
        setPhoneScreen(ph.screenSize || '6.5 inç');
        setPhoneCamera(ph.camera || '32 MP');
        setPhoneBattery(String(ph.battery || 4000));
        setPhoneRam(ph.ram || '6 GB');
        setPhoneColor(ph.color || 'Siyah');
      } else {
        const cs = editingProduct as any;
        setCustomSpecs(cs.customSpecs || {});
      }
    } else {
      // Default new
      setCategory(defaultCategoryId && defaultCategoryId !== 'all' ? defaultCategoryId : 'notebook');
      setName('');
      setPrice('');
      setDiscountRate('0');
      setStock('15');
      setBrandId(brands[0]?.id || 1);
      setNotebookRam('16 GB');
      setNotebookStorage('512 SSD');
      setNotebookScreen('14.0 inç');
      setPhoneStorage('128 GB');
      setPhoneScreen('6.5 inç');
      setPhoneCamera('32 MP');
      setPhoneBattery('4000');
      setPhoneRam('6 GB');
      setPhoneColor('Siyah');
      setCustomSpecs({});
    }
    setErrors({});
  }, [isOpen, editingProduct, defaultCategoryId, brands]);

  if (!isOpen) return null;

  // Markalar listelenirken her zaman alfabe sırasıyla listelenmelidir
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Ürün adı zorunludur.';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) newErrors.price = 'Geçerli bir birim fiyatı giriniz.';
    const numDiscount = parseFloat(discountRate);
    if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
      newErrors.discountRate = 'İndirim oranı %0 ile %100 arasında olmalıdır.';
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) newErrors.stock = 'Geçerli bir stok miktarı giriniz.';
    if (!brandId) newErrors.brandId = 'Marka seçimi zorunludur.';

    if (category === 'phone') {
      const bat = parseInt(phoneBattery, 10);
      if (isNaN(bat) || bat <= 0) newErrors.phoneBattery = 'Geçerli bir pil gücü (mAh) giriniz.';
      if (!phoneCamera.trim()) newErrors.phoneCamera = 'Kamera bilgisi gereklidir.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload: any = {
      name: name.trim(),
      price: parseFloat(price),
      discountRate: parseFloat(discountRate) || 0,
      stock: parseInt(stock, 10) || 0,
      brandId: Number(brandId),
      category,
    };

    if (category === 'notebook') {
      payload = {
        ...payload,
        ram: notebookRam,
        storage: notebookStorage,
        screenSize: notebookScreen,
      };
    } else if (category === 'phone') {
      payload = {
        ...payload,
        storage: phoneStorage,
        screenSize: phoneScreen,
        camera: phoneCamera.includes('MP') ? phoneCamera : `${phoneCamera} MP`,
        battery: parseInt(phoneBattery, 10),
        ram: phoneRam,
        color: phoneColor,
      };
    } else {
      payload = {
        ...payload,
        customSpecs,
      };
    }

    onSave(payload, editingProduct?.id);
    onClose();
  };

  const selectedCategoryObj = categories.find((c) => c.id === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              {category === 'phone' ? (
                <Smartphone className="w-5 h-5" />
              ) : (
                <Laptop className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingProduct ? `ID: #${editingProduct.id}` : 'PatikaStore kataloğuna yeni elektronik ürün kaydı'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Category Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Ürün Grubu (Kategori)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                      isActive
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 font-semibold ring-1 ring-orange-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.id === 'notebook' && <Laptop className="w-4 h-4 text-orange-500 shrink-0" />}
                    {cat.id === 'phone' && <Smartphone className="w-4 h-4 text-orange-500 shrink-0" />}
                    {cat.id !== 'notebook' && cat.id !== 'phone' && (
                      <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ürün Adı *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: HUAWEI Matebook 14, iPhone 11 64 GB..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Brand (Sorted Alphabetically) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marka (Alfabetik Liste) *
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
              >
                {sortedBrands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (ID: {b.id})
                  </option>
                ))}
              </select>
              {errors.brandId && <p className="text-xs text-rose-500 mt-1">{errors.brandId}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Birim Fiyatı (TL) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 7000.0"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            {/* Discount Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                İndirim Oranı (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                placeholder="Örn: 10"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
              />
              {errors.discountRate && (
                <p className="text-xs text-rose-500 mt-1">{errors.discountRate}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Stok Miktarı *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Örn: 25"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
              />
              {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Category Specific Technical Specs */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Teknik Özellikler ({selectedCategoryObj?.name})
            </h3>

            {category === 'notebook' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    RAM
                  </label>
                  <select
                    value={notebookRam}
                    onChange={(e) => setNotebookRam(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="8 GB">8 GB</option>
                    <option value="16 GB">16 GB</option>
                    <option value="32 GB">32 GB</option>
                    <option value="64 GB">64 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Depolama
                  </label>
                  <select
                    value={notebookStorage}
                    onChange={(e) => setNotebookStorage(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="256 SSD">256 SSD</option>
                    <option value="512 SSD">512 SSD</option>
                    <option value="1024 SSD">1024 SSD (1 TB)</option>
                    <option value="2048 SSD">2048 SSD (2 TB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Ekran Boyutu
                  </label>
                  <select
                    value={notebookScreen}
                    onChange={(e) => setNotebookScreen(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="13.3 inç">13.3 inç</option>
                    <option value="13.6 inç">13.6 inç</option>
                    <option value="14.0 inç">14.0 inç</option>
                    <option value="15.6 inç">15.6 inç</option>
                    <option value="16.0 inç">16.0 inç</option>
                    <option value="17.3 inç">17.3 inç</option>
                  </select>
                </div>
              </div>
            )}

            {category === 'phone' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Hafıza
                  </label>
                  <select
                    value={phoneStorage}
                    onChange={(e) => setPhoneStorage(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="64 GB">64 GB</option>
                    <option value="128 GB">128 GB</option>
                    <option value="256 GB">256 GB</option>
                    <option value="512 GB">512 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Ekran Boyutu
                  </label>
                  <select
                    value={phoneScreen}
                    onChange={(e) => setPhoneScreen(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="5.8 inç">5.8 inç</option>
                    <option value="6.1 inç">6.1 inç</option>
                    <option value="6.5 inç">6.5 inç</option>
                    <option value="6.7 inç">6.7 inç</option>
                    <option value="6.8 inç">6.8 inç</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Kamera
                  </label>
                  <input
                    type="text"
                    value={phoneCamera}
                    onChange={(e) => setPhoneCamera(e.target.value)}
                    placeholder="Örn: 32 MP, 48 MP"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                  {errors.phoneCamera && (
                    <p className="text-xs text-rose-500 mt-1">{errors.phoneCamera}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Pil Gücü (mAh)
                  </label>
                  <input
                    type="number"
                    value={phoneBattery}
                    onChange={(e) => setPhoneBattery(e.target.value)}
                    placeholder="Örn: 4000"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
                  />
                  {errors.phoneBattery && (
                    <p className="text-xs text-rose-500 mt-1">{errors.phoneBattery}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    RAM
                  </label>
                  <select
                    value={phoneRam}
                    onChange={(e) => setPhoneRam(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="4 GB">4 GB</option>
                    <option value="6 GB">6 GB</option>
                    <option value="8 GB">8 GB</option>
                    <option value="12 GB">12 GB</option>
                    <option value="16 GB">16 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Renk
                  </label>
                  <select
                    value={phoneColor}
                    onChange={(e) => setPhoneColor(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  >
                    <option value="Siyah">Siyah</option>
                    <option value="Kırmızı">Kırmızı</option>
                    <option value="Mavi">Mavi</option>
                    <option value="Beyaz">Beyaz</option>
                    <option value="Gümüş">Gümüş</option>
                    <option value="Yeşil">Yeşil</option>
                    <option value="Platin">Platin</option>
                  </select>
                </div>
              </div>
            )}

            {/* Custom Category dynamic fields */}
            {category !== 'notebook' && category !== 'phone' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Özel ürün grubu için ek özellik alanları:
                </p>
                {selectedCategoryObj?.specs.map((spec) => (
                  <div key={spec.key}>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {spec.label} {spec.unit ? `(${spec.unit})` : ''}
                    </label>
                    {spec.type === 'select' && spec.options ? (
                      <select
                        value={customSpecs[spec.key] || spec.options[0]}
                        onChange={(e) =>
                          setCustomSpecs((prev) => ({ ...prev, [spec.key]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                      >
                        {spec.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={spec.type}
                        value={customSpecs[spec.key] || ''}
                        onChange={(e) =>
                          setCustomSpecs((prev) => ({ ...prev, [spec.key]: e.target.value }))
                        }
                        placeholder={`${spec.label} giriniz`}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};
