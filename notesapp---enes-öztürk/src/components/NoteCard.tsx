import React, { useState } from 'react';
import {
  Pin,
  Trash2,
  Edit3,
  Copy,
  Check,
  Calendar,
  Clock,
} from 'lucide-react';
import { Note } from '../types/note';
import { getColorById, formatDate } from '../utils/formatters';

interface NoteCardProps {
  note: Note;
  searchQuery?: string;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  searchQuery = '',
  onDelete,
  onEdit,
  onTogglePin,
}) => {
  const [copied, setCopied] = useState(false);
  const color = getColorById(note.colorId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  // Highlight search matches
  const renderHighlightedContent = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-amber-300 text-slate-900 rounded-xs px-0.5 font-semibold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        note.pinned ? 'ring-2 ring-amber-500 shadow-md' : 'shadow-xs'
      }`}
      style={{
        backgroundColor: color.bgHex,
        borderColor: color.borderHex,
        color: color.textHex,
      }}
    >
      {/* Decorative Washi Tape on Top Center */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-white/40 backdrop-blur-xs rounded-xs border-x border-b border-black/5 opacity-80" />

      {/* Card Header: Color tag + Action buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-black/10"
            style={{ backgroundColor: color.dotHex }}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
            {color.name}
          </span>
          {note.pinned && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/80 text-amber-950">
              <Pin className="w-2.5 h-2.5 fill-amber-950" />
              Sabitlendi
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
          {/* Pin toggle */}
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.pinned
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'hover:bg-black/5 text-slate-700'
            }`}
            title={note.pinned ? 'Sabitlemeyi kaldır' : 'En başa sabitle'}
            aria-label="Sabitle"
          >
            <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
          </button>

          {/* Copy content */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
            title={copied ? 'Kopyalandı!' : 'Metni kopyala'}
            aria-label="Kopyala"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Edit note */}
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
            title="Notu düzenle"
            aria-label="Düzenle"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete note */}
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-700 transition-colors"
            title="Notu sil"
            aria-label="Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="text-sm sm:text-base leading-relaxed text-slate-900 whitespace-pre-wrap break-words font-medium my-1 min-h-[60px]">
        {renderHighlightedContent(note.content, searchQuery)}
      </div>

      {/* Card Footer: Timestamp */}
      <div className="flex items-center justify-between text-[11px] pt-3 mt-2 border-t border-black/10 text-slate-600 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          {formatDate(note.createdAt)}
        </span>
        <span className="font-mono text-[10px] opacity-60">
          {note.content.length} k
        </span>
      </div>
    </div>
  );
};
