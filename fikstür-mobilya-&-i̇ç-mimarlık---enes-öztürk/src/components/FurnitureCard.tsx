import React from 'react';
import { Furniture } from '../types';
import { useApp } from '../context/AppContext';
import { Eye, CalendarCheck, Edit3, Trash2 } from 'lucide-react';

interface FurnitureCardProps {
  furniture: Furniture;
  onEdit?: (furniture: Furniture) => void;
  onDelete?: (id: string) => void;
}

export const FurnitureCard: React.FC<FurnitureCardProps> = ({ furniture, onEdit, onDelete }) => {
  const { currentUser, setSelectedFurniture, setReservingFurniture, setActivePage } = useApp();

  const handleReserveClick = () => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }
    setReservingFurniture(furniture);
  };

  const isOutOfStock = furniture.stock <= 0;

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={furniture.image}
          alt={furniture.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          onError={(e) => {
            // Fallback image in case of load glitch
            const target = e.currentTarget;
            target.src = '/src/assets/images/hero_furniture_showcase_1793204897342.jpg';
          }}
        />

        {/* Quiet status or stock indicator (NO static pill sandwiches, clean unboxed label) */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium tracking-wide">
          {furniture.category}
        </div>

        {furniture.featured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
            Öne Çıkan
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-stone-950/80 rounded">
              Tükendi
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span>{furniture.material}</span>
            <span aria-hidden="true">·</span>
            <span>{furniture.dimensions}</span>
            <span aria-hidden="true">·</span>
            <span className={furniture.stock <= 2 ? 'text-amber-700 font-medium' : 'text-stone-500'}>
              {furniture.stock > 0 ? `${furniture.stock} Adet Stok` : 'Stok Yok'}
            </span>
          </div>

          <h3 className="text-base font-bold text-stone-900 font-display line-clamp-1 group-hover:text-amber-800 transition-colors">
            {furniture.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
            {furniture.description}
          </p>
        </div>

        {/* Pricing and Action Strip */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-stone-400">
              Fiyat
            </span>
            <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
              {furniture.price.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Admin Controls */}
            {currentUser?.role === 'admin' && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(furniture)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Mobilyayı Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(furniture.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Mobilyayı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            {/* View Details Button */}
            <button
              onClick={() => setSelectedFurniture(furniture)}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Detayları İncele"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Reserve Action Button */}
            <button
              onClick={handleReserveClick}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : currentUser?.role === 'member'
                  ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                  : currentUser?.role === 'admin'
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>
                {currentUser?.role === 'member'
                  ? 'Rezerve Et'
                  : currentUser?.role === 'admin'
                  ? 'Yönet / İncele'
                  : 'Giriş & Rezerve'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
