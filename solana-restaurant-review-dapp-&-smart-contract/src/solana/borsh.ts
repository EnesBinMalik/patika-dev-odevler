import { PublicKey } from '@solana/web3.js';

// Varsayılan Solana Program ID'si (Mezuniyet Projesi için)
export const PROGRAM_ID_STR = 'RestRev111111111111111111111111111111111111';
export const DEFAULT_PROGRAM_ID = new PublicKey(PROGRAM_ID_STR);

export interface ByteSegment {
  label: string;
  bytes: number[];
  hex: string;
  description: string;
  color: string;
}

export interface SerializedReviewData {
  rawBytes: Uint8Array;
  hexString: string;
  totalBytes: number;
  segments: ByteSegment[];
  accountSize: number;
  minimumRentLamports: number;
}

/**
 * 4 baytlık Little-Endian uzunluk öneki üretir (Borsh String standardı)
 */
function getU32LEBytes(len: number): number[] {
  return [
    len & 0xff,
    (len >> 8) & 0xff,
    (len >> 16) & 0xff,
    (len >> 24) & 0xff,
  ];
}

/**
 * Borsh formatına göre ReviewInstruction serileştirir
 * Variant 0: AddReview
 * Variant 1: UpdateReview
 */
export function serializeReviewInstruction(
  variant: number,
  rating: number,
  title: string,
  location: string,
  description: string
): SerializedReviewData {
  const encoder = new TextEncoder();
  const titleBytes = Array.from(encoder.encode(title));
  const locationBytes = Array.from(encoder.encode(location));
  const descBytes = Array.from(encoder.encode(description));

  const titleLenBytes = getU32LEBytes(titleBytes.length);
  const locationLenBytes = getU32LEBytes(locationBytes.length);
  const descLenBytes = getU32LEBytes(descBytes.length);

  const segments: ByteSegment[] = [
    {
      label: 'İşlem Çeşidi (Variant)',
      bytes: [variant],
      hex: variant.toString(16).padStart(2, '0').toUpperCase(),
      description: variant === 0 ? '0x00: AddReview (Yeni İnceleme)' : '0x01: UpdateReview (Güncelleme)',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    },
    {
      label: 'Derecelendirme (Rating)',
      bytes: [rating],
      hex: rating.toString(16).padStart(2, '0').toUpperCase(),
      description: `${rating} Yıldız (1-5 Arası Puan)`,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    {
      label: 'Başlık Uzunluğu (Title Len)',
      bytes: titleLenBytes,
      hex: titleLenBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `4 Bayt (u32 LE): ${titleBytes.length} karakter`,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    },
    {
      label: 'Restoran Adı (Title UTF-8)',
      bytes: titleBytes,
      hex: titleBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `"${title}" (${titleBytes.length} bayt)`,
      color: 'bg-blue-600/20 text-blue-300 border-blue-600/40',
    },
    {
      label: '📍 Konum Uzunluğu (Location Len - ADIM 2)',
      bytes: locationLenBytes,
      hex: locationLenBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `4 Bayt (u32 LE): ${locationBytes.length} karakter`,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
    {
      label: '📍 Restoran Konumu (Location UTF-8 - ADIM 2)',
      bytes: locationBytes,
      hex: locationBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `"${location}" (${locationBytes.length} bayt)`,
      color: 'bg-purple-600/20 text-purple-300 border-purple-600/40',
    },
    {
      label: 'Açıklama Uzunluğu (Desc Len)',
      bytes: descLenBytes,
      hex: descLenBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `4 Bayt (u32 LE): ${descBytes.length} karakter`,
      color: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    },
    {
      label: 'İnceleme Metni (Desc UTF-8)',
      bytes: descBytes,
      hex: descBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      description: `"${description.length > 25 ? description.slice(0, 25) + '...' : description}" (${descBytes.length} bayt)`,
      color: 'bg-teal-600/20 text-teal-300 border-teal-600/40',
    },
  ];

  const allBytes = segments.flatMap((s) => s.bytes);
  const rawBytes = new Uint8Array(allBytes);
  const hexString = Array.from(rawBytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');

  // Solana Account Boyutu Hesaplaması (state.rs: 1 + 1 + 4+title + 4+location + 4+description)
  const accountSize = 1 + 1 + (4 + titleBytes.length) + (4 + locationBytes.length) + (4 + descBytes.length);

  // Kira muafiyeti tahmini: ~6960 lamports/byte + ~890880 base lamports
  const minimumRentLamports = 890880 + accountSize * 6960;

  return {
    rawBytes,
    hexString,
    totalBytes: rawBytes.length,
    segments,
    accountSize,
    minimumRentLamports,
  };
}

/**
 * Gerçek Solana PDA (Program Derived Address) Türetimi
 * seeds = [initializer_pubkey, title]
 */
export function deriveRestaurantPDA(
  userPubkeyStr: string,
  title: string,
  programId: PublicKey = DEFAULT_PROGRAM_ID
): { pda: string; bump: number } {
  try {
    const userPubkey = new PublicKey(userPubkeyStr);
    const titleBytes = new TextEncoder().encode(title);

    const [pda, bump] = (PublicKey as any).findProgramAddressSync
      ? (PublicKey as any).findProgramAddressSync([userPubkey.toBytes(), titleBytes], programId)
      : [new PublicKey('RestRevPDA111111111111111111111111111111111'), 255];

    return {
      pda: pda.toBase58(),
      bump,
    };
  } catch {
    // Geçersiz pubkey durumunda fallback
    return {
      pda: 'EnesReviewPDA111111111111111111111111111111111',
      bump: 255,
    };
  }
}
