import React, { useMemo, useState } from 'react';
import { RestaurantReview } from '../types/review';
import { serializeReviewInstruction } from '../solana/borsh';
import { X, Binary, Copy, Check } from 'lucide-react';

interface BorshInspectModalProps {
  review: RestaurantReview | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BorshInspectModal: React.FC<BorshInspectModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const [copiedHex, setCopiedHex] = useState(false);

  const serialized = useMemo(() => {
    if (!review) return null;
    return serializeReviewInstruction(
      0, // AddReview variant
      review.rating,
      review.title,
      review.location,
      review.description
    );
  }, [review]);

  if (!isOpen || !review || !serialized) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(serialized.hexString);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400/10 rounded-lg text-amber-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {review.title} · Borsh Serileştirme Verisi
              </h2>
              <span className="text-xs text-slate-400">
                Solana PDA: <code className="font-mono text-amber-300">{review.pdaAddress.slice(0, 8)}...{review.pdaAddress.slice(-6)}</code>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Hex display */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-300">
                İkili Bayt Akışı (Hex Stream · {serialized.totalBytes} Bayt)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedHex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-amber-300/90 break-all leading-relaxed tracking-wider select-all">
              {serialized.hexString}
            </div>
          </div>

          {/* Segment Details */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-300 block">
              Borsh Yapı Ayrıştırması:
            </span>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {serialized.segments.map((seg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border flex items-center justify-between gap-2 ${seg.color}`}
                >
                  <div>
                    <span className="font-semibold block">{seg.label}</span>
                    <span className="text-[10px] opacity-80">{seg.description}</span>
                  </div>
                  <span className="font-mono bg-slate-950/80 px-1.5 py-0.5 rounded text-[11px] shrink-0 border border-white/10">
                    {seg.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Metrics */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400">
            <span>Solana Hesap Alanı: <strong className="text-white font-mono">{serialized.accountSize} bayt</strong></span>
            <span>Kira Muafiyeti: <strong className="text-emerald-400 font-mono">~{(serialized.minimumRentLamports / 1e9).toFixed(5)} SOL</strong></span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
