import React, { useState, useEffect } from 'react';
import { Furniture, Category } from '../types';
import { useApp } from '../context/AppContext';
import { X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface FurnitureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFurniture?: Furniture | null;
}

export const FurnitureFormModal: React.FC<FurnitureFormModalProps> = ({
  isOpen,
  onClose,
  initialFurniture
}) => {
  const { addFurniture, updateFurniture } = useApp();

  const isEditing = Boolean(initialFurniture);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'Tümü'>>('Salon');
  const [price, setPrice] = useState<number>(15000);
  const [image, setImage] = useState('/src/assets/images/furniture_nordic_chair_1793204897506.jpg');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('80 x 75 x 75 cm');
  const [material, setMaterial] = useState('Masif Meşe & Keten');
  const [color, setColor] = useState('Doğal Ahşap');
  const [stock, setStock] = useState<number>(3);
  const [featured, setFeatured] = useState(false);
  const [designerNote, setDesignerNote] = useState('Enes Öztürk mimari form ve denge serisi.');
  const [error, setError] = useState<string | null>(null);

  // Preset images for easy selection
  const presetImages = [
    {
      label: 'Kuzey Berjer (Meşe & Bouclé)',
      url: '/src/assets/images/furniture_nordic_chair_1793204897506.jpg'
    },
    {
      label: 'Ceviz Yemek Masası',
      url: '/src/assets/images/furniture_dining_table_1793204898344.jpg'
    },
    {
      label: 'Pirinç & Opal Avize',
      url: '/src/assets/images/furniture_lighting_fixture_1793204897938.jpg'
    },
    {
      label: 'Salon & Yaşam Alanı Kanepe',
      url: '/src/assets/images/hero_furniture_showcase_1793204897342.jpg'
    }
  ];

  useEffect(() => {
    if (initialFurniture) {
      setName(initialFurniture.name);
      setCategory(initialFurniture.category);
      setPrice(initialFurniture.price);
      setImage(initialFurniture.image);
      setDescription(initialFurniture.description);
      setDimensions(initialFurniture.dimensions);
      setMaterial(initialFurniture.material);
      setColor(initialFurniture.color);
      setStock(initialFurniture.stock);
      setFeatured(Boolean(initialFurniture.featured));
      setDesignerNote(initialFurniture.designerNote || '');
    } else {
      // Reset to defaults
      setName('');
      setCategory('Salon');
      setPrice(18500);
      setImage('/src/assets/images/furniture_nordic_chair_1793204897506.jpg');
      setDescription('');
      setDimensions('80 x 75 x 75 cm');
      setMaterial('Masif Meşe');
      setColor('Doğal Ahşap');
      setStock(4);
      setFeatured(false);
      setDesignerNote('Enes Öztürk mimari form serisi.');
    }
    setError(null);
  }, [initialFurniture, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Lütfen mobilya adını belirtiniz.');
      return;
    }
    if (price <= 0) {
      setError('Lütfen geçerli bir fiyat giriniz.');
      return;
    }
    if (!description.trim()) {
      setError('Lütfen ürün açıklamasını giriniz.');
      return;
    }

    if (isEditing && initialFurniture) {
      updateFurniture(initialFurniture.id, {
        name: name.trim(),
        category,
        price,
        image,
        description: description.trim(),
        dimensions: dimensions.trim(),
        material: material.trim(),
        color: color.trim(),
        stock,
        featured,
        designerNote: designerNote.trim()
      });
    } else {
      addFurniture({
        name: name.trim(),
        category,
        price,
        image,
        description: description.trim(),
        dimensions: dimensions.trim(),
        material: material.trim(),
        color: color.trim(),
        stock,
        featured,
        designerNote: designerNote.trim()
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-display">
              {isEditing ? 'Mobilyayı Düzenle' : 'Kataloğa Yeni Mobilya Ekle (Admin CRUD)'}
            </h2>
            <p className="text-xs text-stone-500">SmartEdu mimarisinde mobilya oluşturma ve güncelleme formu</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-name" className="block font-semibold text-stone-700 mb-1">
                Mobilya Adı *
              </label>
              <input
                id="f-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Kobenhavn Meşe Berjer"
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label htmlFor="f-category" className="block font-semibold text-stone-700 mb-1">
                Kategori *
              </label>
              <select
                id="f-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              >
                <option value="Salon">Salon</option>
                <option value="Yemek Odası">Yemek Odası</option>
                <option value="Yatak Odası">Yatak Odası</option>
                <option value="Aydınlatma">Aydınlatma</option>
                <option value="Çalışma & Ofis">Çalışma & Ofis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="f-price" className="block font-semibold text-stone-700 mb-1">
                Fiyat (₺) *
              </label>
              <input
                id="f-price"
                type="number"
                min="0"
                step="50"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono"
                required
              />
            </div>

            <div>
              <label htmlFor="f-stock" className="block font-semibold text-stone-700 mb-1">
                Stok Adedi *
              </label>
              <input
                id="f-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono"
                required
              />
            </div>

            <div>
              <label htmlFor="f-color" className="block font-semibold text-stone-700 mb-1">
                Renk & Doku
              </label>
              <input
                id="f-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Örn: Krem & Doğal Meşe"
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-dimensions" className="block font-semibold text-stone-700 mb-1">
                Ölçüler (GxDxY)
              </label>
              <input
                id="f-dimensions"
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Örn: 82 x 78 x 76 cm"
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div>
              <label htmlFor="f-material" className="block font-semibold text-stone-700 mb-1">
                Malzeme Özellikleri
              </label>
              <input
                id="f-material"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Örn: Masif Amerikan Ceviz, Pirinç"
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="f-desc" className="block font-semibold text-stone-700 mb-1">
              Açıklama *
            </label>
            <textarea
              id="f-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mobilyanın mimari detayları, konfor ve mekan uyumu..."
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label htmlFor="f-designer" className="block font-semibold text-stone-700 mb-1">
              Tasarımcı Notu (Enes Öztürk)
            </label>
            <input
              id="f-designer"
              type="text"
              value={designerNote}
              onChange={(e) => setDesignerNote(e.target.value)}
              placeholder="Örn: 2025 Form & Denge koleksiyonu başyapıtı."
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          {/* Image Presets & URL */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <label className="block font-semibold text-stone-700 text-xs">
              Mobilya Görseli Seç / Belirle:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetImages.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImage(p.url)}
                  className={`p-2 rounded-lg border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    image === p.url
                      ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-12 h-10 object-cover rounded" />
                  <span className="text-[10px] text-stone-600 line-clamp-1 text-center font-medium">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <span className="block text-[11px] text-stone-500 mb-1">veya Özel Görsel URL'i:</span>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-300 bg-white font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="f-featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-stone-900 accent-stone-900"
            />
            <label htmlFor="f-featured" className="font-semibold text-stone-700 cursor-pointer">
              Ana sayfada "Öne Çıkanlar" bölümünde göster
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Değişiklikleri Kaydet' : 'Mobilyayı Kataloğa Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
