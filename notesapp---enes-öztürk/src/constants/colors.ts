import { ColorOption, Note } from '../types/note';

export const NOTE_COLORS: ColorOption[] = [
  {
    id: 'yellow',
    name: 'Sarı',
    bgHex: '#FEF9C3', // yellow-100
    borderHex: '#FACC15', // yellow-400
    dotHex: '#EAB308', // yellow-500
    textHex: '#713F12', // yellow-900
    bgClass: 'bg-amber-100',
    borderClass: 'border-amber-300',
    badgeClass: 'bg-amber-200 text-amber-900',
  },
  {
    id: 'pink',
    name: 'Pembe',
    bgHex: '#FCE7F3', // pink-100
    borderHex: '#F472B6', // pink-400
    dotHex: '#EC4899', // pink-500
    textHex: '#831843', // pink-900
    bgClass: 'bg-pink-100',
    borderClass: 'border-pink-300',
    badgeClass: 'bg-pink-200 text-pink-900',
  },
  {
    id: 'purple',
    name: 'Mor',
    bgHex: '#F3E8FF', // purple-100
    borderHex: '#C084FC', // purple-400
    dotHex: '#A855F7', // purple-500
    textHex: '#581C87', // purple-900
    bgClass: 'bg-purple-100',
    borderClass: 'border-purple-300',
    badgeClass: 'bg-purple-200 text-purple-900',
  },
  {
    id: 'blue',
    name: 'Mavi',
    bgHex: '#E0F2FE', // sky-100
    borderHex: '#38BDF8', // sky-400
    dotHex: '#0EA5E9', // sky-500
    textHex: '#0C4A6E', // sky-900
    bgClass: 'bg-sky-100',
    borderClass: 'border-sky-300',
    badgeClass: 'bg-sky-200 text-sky-900',
  },
  {
    id: 'green',
    name: 'Yeşil',
    bgHex: '#DCFCE7', // green-100
    borderHex: '#4ADE80', // green-400
    dotHex: '#22C55E', // green-500
    textHex: '#14532D', // green-900
    bgClass: 'bg-emerald-100',
    borderClass: 'border-emerald-300',
    badgeClass: 'bg-emerald-200 text-emerald-900',
  },
  {
    id: 'orange',
    name: 'Turuncu',
    bgHex: '#FFEDD5', // orange-100
    borderHex: '#FB923C', // orange-400
    dotHex: '#F97316', // orange-500
    textHex: '#7C2D12', // orange-900
    bgClass: 'bg-orange-100',
    borderClass: 'border-orange-300',
    badgeClass: 'bg-orange-200 text-orange-900',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'seed-1',
    content: 'React Ödev 1 projesine hoş geldiniz! Yeni notlar ekleyebilir, renklerini değiştirebilir ve anında filtreleyebilirsiniz.',
    colorId: 'yellow',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    pinned: true,
  },
  {
    id: 'seed-2',
    content: 'Market alışverişi listesi:\n• Süt, yumurta ve tam buğday ekmeği\n• Taze meyveler (muz, elma)\n• Filtre kahve çekirdeği',
    colorId: 'green',
    createdAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    pinned: false,
  },
  {
    id: 'seed-3',
    content: 'Yarın saat 14:00\'te ekip toplantısı var. Proje mimarisi ve yeni sprint görevleri değerlendirilecek.',
    colorId: 'blue',
    createdAt: Date.now() - 1000 * 60 * 20, // 20 mins ago
    pinned: false,
  },
  {
    id: 'seed-4',
    content: 'enes öztürk imzalı not uygulaması. Temiz kod, akıcı animasyonlar ve responsive tasarım içerir.',
    colorId: 'pink',
    createdAt: Date.now() - 1000 * 60 * 5, // 5 mins ago
    pinned: false,
  },
];
