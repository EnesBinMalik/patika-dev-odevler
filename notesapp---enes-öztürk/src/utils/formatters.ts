import { NOTE_COLORS } from '../constants/colors';
import { ColorOption } from '../types/note';

export function getColorById(colorId: string): ColorOption {
  const found = NOTE_COLORS.find((c) => c.id === colorId);
  return found || NOTE_COLORS[0];
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Az önce';
  if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;
  if (diffInMinutes < 1440 && now.getDate() === date.getDate()) {
    return `Bugün, ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
