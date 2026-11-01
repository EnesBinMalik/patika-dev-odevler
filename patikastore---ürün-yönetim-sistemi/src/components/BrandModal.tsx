import React, { useState } from 'react';
import { Brand, Product } from '../types';
import { X, Plus, Tag, ArrowDownAZ, CheckCircle2 } from 'lucide-react';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: Brand[];
  products: Product[];
  onAddBrand: (name: string) => void;
  onSelectBrandFilter: (brandId: number) => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  brands,
  products,
  onAddBrand,
  onSelectBrandFilter,
}) => {
  const [newBrandName, setNewBrandName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Markalar her zaman alfabetik listelenmelidir
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = newBrandName.trim();
    if (!trimmed) {
      setError('Marka adı boş bırakılamaz.');
      return;
    }

    const exists = brands.some((b) => b.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setError(`"${trimmed}" markası zaten sistemde kayıtlıdır.`);
      return;
    }

    onAddBrand(trimmed);
    setSuccess(`"${trimmed}" markası başarıyla eklendi!`);
    setNewBrandName('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Sistem Markaları
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <ArrowDownAZ className="w-3.5 h-3.5 text-orange-500" />
                Alfabetik sırayla listelenmektedir ({brands.length} Marka)
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Notice */}
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-xl text-xs text-orange-900 dark:text-orange-200 leading-relaxed">
            <span className="font-semibold">Patika Kuralı:</span> Markalar sistemde kod içerisinden statik olarak (Samsung, Lenovo, Apple, Huawei, Casper, Asus, HP, Xiaomi, Monster) eklenmiş olup, kurallar gereği her zaman alfabetik sırayla sunulur.
          </div>

          {/* Add Brand Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Yeni Marka Ekle
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => {
                  setNewBrandName(e.target.value);
                  setError('');
                }}
                placeholder="Örn: Dell, Sony, Google..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Ekle
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            {success && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {success}
              </p>
            )}
          </form>

          {/* Brand Grid / List */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>Marka Adı</span>
              <span>Bağlı Ürün Sayısı</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              {sortedBrands.map((brand) => {
                const count = products.filter((p) => p.brandId === brand.id).length;
                return (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectBrandFilter(brand.id);
                      onClose();
                    }}
                    title="Bu markanın ürünlerini filtrele"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono flex items-center justify-center font-bold">
                        {brand.id}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {brand.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {count} Ürün
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Filtrele &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
