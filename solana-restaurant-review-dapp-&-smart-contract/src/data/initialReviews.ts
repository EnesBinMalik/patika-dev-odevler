import { RestaurantReview } from '../types/review';
import { deriveRestaurantPDA } from '../solana/borsh';

const DEMO_AUTHOR_1 = '7nYmX2wPv1kLd5V6eU9jZ3f8c4B1A0x7D6s5a4q3w2e1';
const DEMO_AUTHOR_2 = 'EnesOzTurk9999999999999999999999999999999999';
const DEMO_AUTHOR_3 = '4uQev8nLwXWv7Z783jVn4w9e1zF6s4v8w3z6a9b2c1d3';
const DEMO_AUTHOR_4 = '9pX8mN4kL2vW5eR7tY1uI3oP5aS7dF9gH1jK3lZ5xC7v';

export const INITIAL_REVIEWS: RestaurantReview[] = [
  {
    id: 'rev-1',
    title: 'Çiya Sofrası',
    rating: 5,
    location: 'İstanbul, Kadıköy',
    description: 'Anadolu mutfağının kadim lezzetlerini ve unutulmaya yüz tutmuş yöresel otlu mezelerini en otantik şekilde sunan eşsiz bir deneyim. Zahter salatası ve perde pilavı mutlaka denenmeli!',
    authorPubkey: DEMO_AUTHOR_1,
    pdaAddress: deriveRestaurantPDA(DEMO_AUTHOR_1, 'Çiya Sofrası').pda,
    bumpSeed: deriveRestaurantPDA(DEMO_AUTHOR_1, 'Çiya Sofrası').bump,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    imageUrl: '/src/assets/images/turkish_gourmet_dining_1793562810886.jpg',
    likes: 42,
    isUserReview: false,
  },
  {
    id: 'rev-2',
    title: 'Alsancak Dostlar Fırını',
    rating: 5,
    location: 'İzmir, Alsancak',
    description: '1983 yılından bu yana İzmir boyoz kültürünün simgesi. Ispanaklı, tahinli ve labneli sıcak boyozları ile yanında közlenmiş karabiberli haşlanmış yumurtası güne başlamak için harika bir ritüel.',
    authorPubkey: DEMO_AUTHOR_2,
    pdaAddress: deriveRestaurantPDA(DEMO_AUTHOR_2, 'Alsancak Dostlar Fırını').pda,
    bumpSeed: deriveRestaurantPDA(DEMO_AUTHOR_2, 'Alsancak Dostlar Fırını').bump,
    createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    imageUrl: '/src/assets/images/cozy_bistro_cafe_1793562812238.jpg',
    likes: 38,
    isUserReview: true, // Belongs to Enes Öztürk demo user
  },
  {
    id: 'rev-3',
    title: 'Tarihi Sultanahmet Köftecisi',
    rating: 4,
    location: 'İstanbul, Fatih',
    description: 'Yüzyıllık geleneksel tarifiyle pişen sulu ızgara köfteleri, irmik helvası ve meşhur acı sosuyla Tarihi Yarımada gezilerinin vazgeçilmez durağı. Servis son derece hızlı.',
    authorPubkey: DEMO_AUTHOR_3,
    pdaAddress: deriveRestaurantPDA(DEMO_AUTHOR_3, 'Tarihi Sultanahmet Köftecisi').pda,
    bumpSeed: deriveRestaurantPDA(DEMO_AUTHOR_3, 'Tarihi Sultanahmet Köftecisi').bump,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    imageUrl: '/src/assets/images/artisan_kebab_grill_1793562811985.jpg',
    likes: 29,
    isUserReview: false,
  },
  {
    id: 'rev-4',
    title: 'Sunset Grill & Bar',
    rating: 5,
    location: 'İstanbul, Beşiktaş (Ulus)',
    description: 'Boğaz manzarasına karşı Akdeniz ve Japon füzyon mutfağını harmanlayan kusursuz ambiyans. Izgara ahtapot, taze deniz mahsulleri ve gün batımı eşliğindeki servis kalitesi fevkalade.',
    authorPubkey: DEMO_AUTHOR_4,
    pdaAddress: deriveRestaurantPDA(DEMO_AUTHOR_4, 'Sunset Grill & Bar').pda,
    bumpSeed: deriveRestaurantPDA(DEMO_AUTHOR_4, 'Sunset Grill & Bar').bump,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    imageUrl: '/src/assets/images/bosphorus_seafood_terrace_1793562812687.jpg',
    likes: 56,
    isUserReview: false,
  },
];
