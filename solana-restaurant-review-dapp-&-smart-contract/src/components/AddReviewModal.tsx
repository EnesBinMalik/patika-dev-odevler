import React, { useState, useMemo } from 'react';
import { RestaurantReview } from '../types/review';
import { serializeReviewInstruction, deriveRestaurantPDA } from '../solana/borsh';
import { X, Star, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: RestaurantReview) => void;
  userPubkey: string;
}

const QUICK_LOCATIONS = [
  'İstanbul, Kadıköy',
  'İzmir, Alsancak',
  'Ankara, Çankaya',
  'Antalya, Kaş',
  'Bursa, Nilüfer',
  'Muğla, Bodrum',
  'Gaziantep, Şahinbey',
  'Trabzon, Ortahisar',
];

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userPubkey,
}) => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live serialization preview
  const liveBorsh = useMemo(() => {
    if (!title && !location && !description) return null;
    return serializeReviewInstruction(
      0, // AddReview
      rating,
      title || 'Örnek Restoran',
      location || 'Şehir, Semt',
      description || 'Açıklama'
    );
  }, [title, rating, location, description]);

  const livePDA = useMemo(() => {
    if (!title) return null;
    return deriveRestaurantPDA(userPubkey, title);
  }, [userPubkey, title]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Lütfen bir restoran adı giriniz.');
      return;
    }
    if (title.length > 50) {
      setError('Restoran adı en fazla 50 karakter olabilir.');
      return;
    }
    if (!location.trim()) {
      setError('Lütfen restoranın konumunu giriniz (Adım 1-4 entegrasyonu).');
      return;
    }
    if (location.length > 100) {
      setError('Konum en fazla 100 karakter olabilir.');
      return;
    }
    if (!description.trim()) {
      setError('Lütfen bir değerlendirme açıklaması yazınız.');
      return;
    }
    if (description.length > 500) {
      setError('Açıklama en fazla 500 karakter olabilir.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const derived = deriveRestaurantPDA(userPubkey, title);
      const newReview: RestaurantReview = {
        id: `rev-${Date.now()}`,
        title: title.trim(),
        rating,
        location: location.trim(),
        description: description.trim(),
        authorPubkey: userPubkey,
        pdaAddress: derived.pda,
        bumpSeed: derived.bump,
        createdAt: Date.now(),
        likes: 0,
        isUserReview: true,
      };

      onSubmit(newReview);
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore in non-browser
      }

      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Yeni Restoran İncelemesi Ekle
            </h2>
            <p className="text-xs text-amber-400 mt-1">
              Adım 1–4 Entegrasyonu: Başlık, Puan, Açıklama ve Konum (Location)
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Restoran Adı (Title) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="title" className="font-medium text-slate-300">
                Restoran Adı (Title) <span className="text-rose-400">*</span>
              </label>
              <span className="text-slate-500 tabular-nums">{title.length} / 50 bayt</span>
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Tarihi Çınaraltı Lokantası"
              maxLength={50}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Solana PDA tohumu (seed) olarak kullanılır: <code className="text-slate-400 font-mono">[user_pubkey, title]</code>
            </p>
          </div>

          {/* Konum (Location) - ADIM 1-4 */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="location" className="font-medium text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Restoran Konumu (Location - Adım 1 & 2 & 4)</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-slate-500 tabular-nums">{location.length} / 100 bayt</span>
            </div>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Örn: İstanbul, Kadıköy veya İzmir, Alsancak"
              maxLength={100}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            
            {/* Hızlı Konum Seçimi */}
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

          {/* Puanlama (Rating: 1 - 5) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Değerlendirme Puanı (Rating: 1-5) <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                  title={`${star} Yıldız`}
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

          {/* Açıklama (Description) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="description" className="font-medium text-slate-300">
                İnceleme Metni (Description) <span className="text-rose-400">*</span>
              </label>
              <span className="text-slate-500 tabular-nums">{description.length} / 500 bayt</span>
            </div>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yemeklerin lezzeti, porsiyonlar, servis ve ambiyans hakkında detayları yazın..."
              maxLength={500}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
          </div>

          {/* Canlı Solana PDA & Borsh Verisi */}
          {liveBorsh && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tahsis Edilecek PDA Hesabı:</span>
                <span className="font-mono text-amber-400">
                  {livePDA?.pda.slice(0, 10)}...{livePDA?.pda.slice(-8)} (Bump: {livePDA?.bump})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Toplam Borsh Boyutu:</span>
                <span className="font-mono text-emerald-400 tabular-nums">
                  {liveBorsh.accountSize} bayt · (~{(liveBorsh.minimumRentLamports / 1e9).toFixed(5)} SOL Kira)
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
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
              className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Blokzincire Yazılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>İncelemeyi Blokzincire Gönder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
