import React, { useState } from 'react';
import { RestaurantReview } from '../types/review';
import { X, Star, MapPin, Check, AlertCircle } from 'lucide-react';

interface EditReviewModalProps {
  review: RestaurantReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updated: RestaurantReview) => void;
}

const QUICK_LOCATIONS = [
  'İstanbul, Kadıköy',
  'İzmir, Alsancak',
  'Ankara, Çankaya',
  'Antalya, Kaş',
  'Bursa, Nilüfer',
  'Muğla, Bodrum',
];

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !review) return null;

  const [rating, setRating] = useState<number>(review.rating);
  const [location, setLocation] = useState(review.location);
  const [description, setDescription] = useState(review.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location.trim()) {
      setError('Lütfen restoranın güncel konumunu giriniz.');
      return;
    }
    if (location.length > 100) {
      setError('Konum en fazla 100 karakter olabilir.');
      return;
    }
    if (!description.trim()) {
      setError('Lütfen açıklama metnini giriniz.');
      return;
    }
    if (description.length > 500) {
      setError('Açıklama en fazla 500 karakter olabilir.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updatedReview: RestaurantReview = {
        ...review,
        rating,
        location: location.trim(),
        description: description.trim(),
      };

      onSubmit(updatedReview);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              İncelemeyi Güncelle
            </h2>
            <p className="text-xs text-amber-400 mt-1">
              Adım 4 (B): update_restaurant_review içinde Konum (Location) ve Açıklama Güncelleme
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Restoran Adı (Read-only because it is PDA seed) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Restoran Adı (Değiştirilemez PDA Tohumu)
            </label>
            <input
              type="text"
              value={review.title}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-400 font-medium cursor-not-allowed"
            />
          </div>

          {/* Konum Güncellemesi - Adım 4 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="edit-location" className="font-medium text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Restoran Konumu (Adım 4 Güncellemesi)</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-slate-500 tabular-nums">{location.length} / 100</span>
            </div>
            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Örn: İzmir, Alsancak"
              maxLength={100}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Hızlı Seç:</span>
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Puanlama */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Puanlama (Rating: 1-5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-semibold text-amber-400 ml-2 tabular-nums">
                {rating} / 5 Yıldız
              </span>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="edit-desc" className="font-medium text-slate-300">
                Açıklama (Description)
              </label>
              <span className="text-slate-500 tabular-nums">{description.length} / 500</span>
            </div>
            <textarea
              id="edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Güncelleniyor...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Güncellemeyi Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
