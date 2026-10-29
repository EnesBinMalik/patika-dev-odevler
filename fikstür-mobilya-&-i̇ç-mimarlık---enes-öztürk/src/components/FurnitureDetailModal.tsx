import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CalendarCheck, ShieldCheck, Truck, Sparkles, Ruler, Layers, Palette } from 'lucide-react';

export const FurnitureDetailModal: React.FC = () => {
  const { selectedFurniture, setSelectedFurniture, setReservingFurniture, currentUser, setActivePage } = useApp();

  if (!selectedFurniture) return null;

  const handleReserve = () => {
    const target = selectedFurniture;
    setSelectedFurniture(null);
    if (!currentUser) {
      setActivePage('login');
      return;
    }
    setReservingFurniture(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              {selectedFurniture.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Katalog No: {selectedFurniture.id}</span>
          </div>
          <button
            onClick={() => setSelectedFurniture(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedFurniture.image}
                alt={selectedFurniture.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/hero_furniture_showcase_1793204897342.jpg';
                }}
              />
            </div>

            {/* Main Specs */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display">
                  {selectedFurniture.name}
                </h2>
                <div className="mt-2 text-xl font-bold text-stone-900 font-mono tabular-nums">
                  {selectedFurniture.price.toLocaleString('tr-TR')} ₺
                </div>

                <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                  {selectedFurniture.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-start gap-2">
                  <Ruler className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-semibold">Ölçüler</span>
                    <span className="font-medium text-stone-800">{selectedFurniture.dimensions}</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-start gap-2">
                  <Layers className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-semibold">Malzeme</span>
                    <span className="font-medium text-stone-800">{selectedFurniture.material}</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-start gap-2">
                  <Palette className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-semibold">Renk & Doku</span>
                    <span className="font-medium text-stone-800">{selectedFurniture.color}</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-semibold">Mevcut Stok</span>
                    <span className={`font-semibold ${selectedFurniture.stock > 0 ? 'text-stone-900' : 'text-rose-600'}`}>
                      {selectedFurniture.stock > 0 ? `${selectedFurniture.stock} Adet` : 'Tükendi'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Designer Note Callout */}
          {selectedFurniture.designerNote && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                Tasarımcı Notu — Enes Öztürk
              </span>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{selectedFurniture.designerNote}"
              </p>
            </div>
          )}

          {/* Guarantees */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-700" />
              <span>5 Yıl Atölye ve İskelet Garantisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-stone-700" />
              <span>Türkiye Geneli Sigortalı Özel Sevkiyat</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedFurniture(null)}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Kapat
          </button>

          <button
            onClick={handleReserve}
            disabled={selectedFurniture.stock <= 0}
            className={`px-5 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
              selectedFurniture.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>
              {currentUser?.role === 'member'
                ? 'Bu Ürünü Rezerve Et'
                : currentUser?.role === 'admin'
                ? 'Admin Rezervasyonu Aç'
                : 'Giriş Yaparak Rezerve Et'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
