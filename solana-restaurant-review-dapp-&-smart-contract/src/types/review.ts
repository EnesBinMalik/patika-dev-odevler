export interface RestaurantReview {
  id: string;
  title: string;
  rating: number; // 1 to 5
  location: string; // Adım 1 & Bonus: Konum alanı (örn. "İstanbul, Kadıköy")
  description: string;
  authorPubkey: string;
  pdaAddress: string;
  bumpSeed: number;
  createdAt: number;
  imageUrl?: string;
  likes: number;
  isUserReview?: boolean;
}

export type ActiveTab = 'reviews' | 'add' | 'code' | 'borsh' | 'readme';

export interface WalletState {
  connected: boolean;
  publicKey: string;
  balanceSol: number;
  network: 'devnet' | 'localnet' | 'mainnet-beta';
}
