export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'ghost', name: 'Hayalet', emoji: '👻', iconName: 'Ghost' },
  { id: 'hacker', name: 'Hacker', emoji: '🕵️', iconName: 'ShieldAlert' },
  { id: 'cat', name: 'Siber Kedi', emoji: '🐱', iconName: 'Cat' },
  { id: 'owl', name: 'Gece Baykuşu', emoji: '🦉', iconName: 'Eye' },
  { id: 'astronaut', name: 'Astronot', emoji: '🧑‍🚀', iconName: 'Compass' },
  { id: 'robot', name: 'Android', emoji: '🤖', iconName: 'Bot' },
  { id: 'ninja', name: 'Gölge Ninja', emoji: '🥷', iconName: 'Sword' },
  { id: 'alien', name: 'Yabancı', emoji: '👽', iconName: 'Sparkles' },
  { id: 'wolf', name: 'Kutup Kurdu', emoji: '🐺', iconName: 'Flame' },
  { id: 'wizard', name: 'Büyücü', emoji: '🧙‍♂️', iconName: 'Wand2' },
];

export const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6', // Blue
];

const ADJECTIVES = [
  'Anonim',
  'Gizemli',
  'Siber',
  'Kuantum',
  'Gölge',
  'Kripto',
  'Neon',
  'Galaktik',
  'Kozmik',
  'Sonsuz',
  'Dijital',
  'Sessiz',
];

const NOUNS = [
  'Yolcu',
  'Kedi',
  'Gözlemci',
  'Hayalet',
  'Astronot',
  'Baykuş',
  'Savaşçı',
  'Gezgin',
  'Kodcu',
  'Kaşif',
  'Piksel',
  'Gölge',
];

export function generateRandomIdentity() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return {
    nickname: `${adj} ${noun} #${num}`,
    avatar,
    color,
  };
}

export function getAvatarEmoji(avatarId: string): string {
  const found = AVATARS.find((a) => a.id === avatarId);
  return found ? found.emoji : '👻';
}
