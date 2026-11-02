import React, { useState, useMemo } from 'react';
import { serializeReviewInstruction, deriveRestaurantPDA, DEFAULT_PROGRAM_ID } from '../solana/borsh';
import { Binary, Sparkles, MapPin, Check, Copy } from 'lucide-react';

export const BorshExplorer: React.FC = () => {
  const [variant, setVariant] = useState<number>(0); // 0 = Add, 1 = Update
  const [title, setTitle] = useState('Çiya Sofrası');
  const [rating, setRating] = useState<number>(5);
  const [location, setLocation] = useState('İstanbul, Kadıköy');
  const [description, setDescription] = useState('Geleneksel otlu mezeler ve taze güveç.');
  const [copiedHex, setCopiedHex] = useState(false);

  const testUserPubkey = 'EnesOzTurk9999999999999999999999999999999999';

  const serialized = useMemo(() => {
    return serializeReviewInstruction(variant, rating, title, location, description);
  }, [variant, rating, title, location, description]);

  const pdaInfo = useMemo(() => {
    return deriveRestaurantPDA(testUserPubkey, title, DEFAULT_PROGRAM_ID);
  }, [title]);

  const handleCopyHex = () => {
    navigator.clipboard.writeText(serialized.hexString);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-400/10 rounded-lg border border-amber-400/20">
            <Binary className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Borsh Serileştirme & Solana PDA Derinlemesine İnceleme
            </h2>
            <p className="text-xs text-slate-400">
              Adım 1, 2, 3 ve 4 ile eklenen <span className="text-amber-400 font-medium">location (konum)</span> parametresinin Solana blokzincirindeki bayt düzeyi karşılığı
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-4">
          Solana akıllı sözleşmelerinde veri alışverişi ve hesap saklama formatı olarak <strong>Borsh (Binary Object Representation Serializer for Hashing)</strong> kullanılır.
          String alanlar, önce 4 baytlık Little-Endian uzunluk öneki (u32), ardından UTF-8 kodlu karakter baytları şeklinde paketlenir.
        </p>
      </div>

      {/* Interactive Playground Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center justify-between">
              <span>Talimat Parametreleri (Girdi)</span>
              <span className="text-xs text-slate-500 font-mono">ReviewPayload</span>
            </h3>

            {/* Variant Switch */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Talimat Çeşidi (Variant)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVariant(0)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    variant === 0
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  0: AddReview (Ekle)
                </button>
                <button
                  type="button"
                  onClick={() => setVariant(1)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    variant === 1
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  1: UpdateReview (Güncelle)
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="borsh-title" className="block text-xs font-medium text-slate-400 mb-1">
                Restoran Başlığı (title: String)
              </label>
              <input
                id="borsh-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Location Input (Adım 1-4) */}
            <div>
              <label htmlFor="borsh-location" className="block text-xs font-medium text-purple-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Restoran Konumu (location: String - ADIM 1–4)</span>
              </label>
              <input
                id="borsh-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 bg-slate-950 border border-purple-500/60 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Puan (rating: u8 = {rating})
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      star === rating
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="borsh-desc" className="block text-xs font-medium text-slate-400 mb-1">
                Açıklama (description: String)
              </label>
              <textarea
                id="borsh-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono resize-none"
              />
            </div>
          </div>

          {/* PDA Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Türetilen Solana PDA Adresi</span>
            </h3>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-500 block">PDA Tohumları (Seeds):</span>
                <code className="text-amber-300 font-mono text-[11px] block mt-0.5 break-all">
                  [user_pubkey, "{title}"]
                </code>
              </div>

              <div>
                <span className="text-slate-500 block">PDA Hesabı:</span>
                <code className="text-emerald-400 font-mono text-xs block mt-0.5 break-all">
                  {pdaInfo.pda}
                </code>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">Bump Tohumu:</span>
                <span className="font-mono text-slate-300 font-semibold">{pdaInfo.bump}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Binary Breakdown Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Borsh Bayt Akışı (Hex Stream)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Toplam {serialized.totalBytes} bayt talimat verisi
                </span>
              </div>

              <button
                onClick={handleCopyHex}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copiedHex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Hex Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Raw Hex Stream Box */}
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-amber-300/90 break-all leading-relaxed tracking-wider select-all">
              {serialized.hexString}
            </div>

            {/* Segment Breakdown */}
            <div className="mt-5 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                Bayt Alanı Ayrıştırma Tablosu:
              </span>

              <div className="space-y-2">
                {serialized.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${seg.color}`}
                  >
                    <div>
                      <span className="font-semibold block">{seg.label}</span>
                      <span className="text-[11px] opacity-80">{seg.description}</span>
                    </div>

                    <div className="font-mono text-right shrink-0">
                      <span className="bg-slate-950/80 px-2 py-1 rounded border border-white/10 block sm:inline-block">
                        {seg.hex}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solana Rent & Size Summary */}
            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block">Hesap Boyutu (Account Space):</span>
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  {serialized.accountSize} bayt
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  1 + 1 + (4+T) + (4+L) + (4+D)
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 block">Kira Muafiyeti (Min Rent):</span>
                <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  ~{(serialized.minimumRentLamports / 1e9).toFixed(5)} SOL
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {serialized.minimumRentLamports.toLocaleString()} lamports
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
