import React, { useState } from 'react';
import { RestaurantReview } from '../types/review';
import { Star, MapPin, Heart, Edit3, Binary, Check, Copy } from 'lucide-react';

interface ReviewCardProps {
  review: RestaurantReview;
  onEdit: (review: RestaurantReview) => void;
  onInspectBorsh: (review: RestaurantReview) => void;
  onLike: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onInspectBorsh,
  onLike,
}) => {
  const [copiedPDA, setCopiedPDA] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCopyPDA = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(review.pdaAddress);
    setCopiedPDA(true);
    setTimeout(() => setCopiedPDA(false), 2000);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLike(review.id);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(review.createdAt));

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col">
      {/* Visual Header Image or Styled Fallback */}
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden shrink-0">
        {review.imageUrl ? (
          <img
            src={review.imageUrl}
            alt={review.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-amber-950/40 flex items-center justify-center p-6 text-center">
            <span className="text-xl font-semibold text-amber-300/80">{review.title}</span>
          </div>
        )}

        {/* Rating Score Top Corner */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="tabular-nums">{review.rating} / 5</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline per §1.A) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{review.location}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{formattedDate}</span>
            {review.isUserReview && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400">Senin İncelemen</span>
              </>
            )}
          </div>

          {/* Restaurant Title */}
          <h3 className="text-lg font-bold text-white tracking-tight mb-2">
            {review.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {review.description}
          </p>
        </div>

        {/* Footer Area: PDA Info & Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
          {/* PDA Information */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
            <span className="text-slate-500">PDA:</span>
            <div className="flex items-center gap-1.5">
              <span>
                {review.pdaAddress.slice(0, 6)}...{review.pdaAddress.slice(-6)}
              </span>
              <button
                onClick={handleCopyPDA}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="PDA Adresini Kopyala"
              >
                {copiedPDA ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onInspectBorsh(review)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-amber-300 bg-slate-800/80 hover:bg-slate-800 rounded-md transition-colors cursor-pointer border border-slate-700/60"
                title="Borsh Bayt Formatını İncele"
              >
                <Binary className="w-3.5 h-3.5 text-amber-400" />
                <span>Borsh Baytları</span>
              </button>

              {review.isUserReview && (
                <button
                  onClick={() => onEdit(review)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-md transition-colors cursor-pointer border border-slate-700/60"
                  title="İncelemeyi ve Konumu Güncelle"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Düzenle</span>
                </button>
              )}
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                hasLiked
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400 bg-slate-800/40 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400' : ''}`} />
              <span className="tabular-nums">{review.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
