import React from 'react';
import { EmojiResultRow } from './EmojiResultRow';
import { EmojiItem } from '../utils/filterEmoji';
import { Frown } from 'lucide-react';

interface EmojiResultsProps {
  emojiData: EmojiItem[];
  onCopySuccess?: (symbol: string, title: string) => void;
}

export const EmojiResults: React.FC<EmojiResultsProps> = ({ emojiData, onCopySuccess }) => {
  if (emojiData.length === 0) {
    return (
      <div
        data-testid="no-results"
        className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200"
      >
        <Frown className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">Aranan kriterlere uygun emoji bulunamadı.</p>
        <p className="text-xs text-slate-400 mt-1">Farklı anahtar kelimeler deneyebilirsiniz (örneğin: smile, heart, 100).</p>
      </div>
    );
  }

  return (
    <div
      data-testid="emoji-results"
      className="component-emoji-results bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs"
    >
      {emojiData.map((emoji) => (
        <EmojiResultRow
          key={emoji.title}
          emoji={emoji}
          onCopySuccess={onCopySuccess}
        />
      ))}
    </div>
  );
};
