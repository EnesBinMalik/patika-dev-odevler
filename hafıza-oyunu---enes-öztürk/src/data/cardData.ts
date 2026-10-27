export interface CardItemDefinition {
  pairId: string;
  name: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  iconName: string;
}

export const TECH_CARDS: CardItemDefinition[] = [
  {
    pairId: 'react',
    name: 'React',
    color: '#00d8ff',
    bgGradient: 'from-cyan-500/20 to-blue-600/30',
    borderColor: 'border-cyan-500/50',
    iconName: 'Atom',
  },
  {
    pairId: 'redux',
    name: 'Redux',
    color: '#764abc',
    bgGradient: 'from-purple-500/20 to-indigo-600/30',
    borderColor: 'border-purple-500/50',
    iconName: 'Layers',
  },
  {
    pairId: 'typescript',
    name: 'TypeScript',
    color: '#3178c6',
    bgGradient: 'from-blue-500/20 to-indigo-700/30',
    borderColor: 'border-blue-500/50',
    iconName: 'FileCode2',
  },
  {
    pairId: 'javascript',
    name: 'JavaScript',
    color: '#f7df1e',
    bgGradient: 'from-amber-400/20 to-yellow-600/30',
    borderColor: 'border-amber-400/50',
    iconName: 'Code2',
  },
  {
    pairId: 'tailwind',
    name: 'Tailwind CSS',
    color: '#38bdf8',
    bgGradient: 'from-sky-400/20 to-teal-600/30',
    borderColor: 'border-sky-400/50',
    iconName: 'Palette',
  },
  {
    pairId: 'nodejs',
    name: 'Node.js',
    color: '#68a063',
    bgGradient: 'from-emerald-500/20 to-green-700/30',
    borderColor: 'border-emerald-500/50',
    iconName: 'Server',
  },
  {
    pairId: 'vite',
    name: 'Vite',
    color: '#bd34fe',
    bgGradient: 'from-fuchsia-500/20 to-purple-600/30',
    borderColor: 'border-fuchsia-500/50',
    iconName: 'Zap',
  },
  {
    pairId: 'git',
    name: 'Git',
    color: '#f05032',
    bgGradient: 'from-orange-500/20 to-red-600/30',
    borderColor: 'border-orange-500/50',
    iconName: 'GitBranch',
  },
  {
    pairId: 'database',
    name: 'Database',
    color: '#10b981',
    bgGradient: 'from-teal-500/20 to-emerald-700/30',
    borderColor: 'border-teal-500/50',
    iconName: 'Database',
  },
  {
    pairId: 'terminal',
    name: 'Terminal',
    color: '#a855f7',
    bgGradient: 'from-violet-500/20 to-purple-800/30',
    borderColor: 'border-violet-500/50',
    iconName: 'Terminal',
  },
  {
    pairId: 'api',
    name: 'Cloud API',
    color: '#3b82f6',
    bgGradient: 'from-blue-500/20 to-sky-700/30',
    borderColor: 'border-blue-500/50',
    iconName: 'Cloud',
  },
  {
    pairId: 'shield',
    name: 'Security',
    color: '#ef4444',
    bgGradient: 'from-rose-500/20 to-red-700/30',
    borderColor: 'border-rose-500/50',
    iconName: 'ShieldCheck',
  },
];

export const JOKER_CARD: CardItemDefinition = {
  pairId: 'joker-enes-ozturk',
  name: 'JOKER · Enes Öztürk',
  color: '#fbbf24',
  bgGradient: 'from-amber-400/30 via-yellow-500/30 to-amber-600/40',
  borderColor: 'border-amber-400',
  iconName: 'Sparkles',
};
