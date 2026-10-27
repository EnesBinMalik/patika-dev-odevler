import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { EmojiItem } from '../utils/filterEmoji';

interface EmojiResultRowProps {
  emoji: EmojiItem;
  onCopySuccess?: (symbol: string, title: string) => void;
}

export const EmojiResultRow: React.FC<EmojiResultRowProps> = ({
  emoji,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emoji.symbol);
      }
    } catch {
      // Fallback
    }

    setCopied(true);
    onCopySuccess?.(emoji.symbol, emoji.title);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="emoji-row"
      data-clipboard-text={emoji.symbol}
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy();
        }
      }}
      className="component-emoji-result-row copy-to-clipboard group relative flex items-center justify-between px-4 py-3.5 bg-white hover:bg-indigo-50/50 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors"
      title={`${emoji.title} - Kopyalamak için tıklayın`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          className="text-2xl sm:text-3xl shrink-0 select-none group-hover:scale-110 transition-transform"
          aria-label={emoji.title}
        >
          {emoji.symbol}
        </span>
        <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-indigo-950 truncate">
          {emoji.title}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Kopyalandı!</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <Copy className="w-3.5 h-3.5" />
            <span className="info">Click to copy emoji</span>
          </span>
        )}
      </div>
    </div>
  );
};
