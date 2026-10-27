import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Palette, Sparkles, CornerDownLeft } from 'lucide-react';
import { NOTE_COLORS } from '../constants/colors';
import { ColorOption } from '../types/note';
import { getColorById } from '../utils/formatters';

interface NoteFormProps {
  onAddNote: (content: string, colorId: string) => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onAddNote }) => {
  const [content, setContent] = useState('');
  const [selectedColorId, setSelectedColorId] = useState<string>('yellow');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedColor: ColorOption = getColorById(selectedColorId);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      setError('Lütfen önce bir not yazın!');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);
    onAddNote(trimmed, selectedColorId);
    setContent('');
    setError(null);
    setIsSubmitting(false);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
        style={{
          backgroundColor: selectedColor.bgHex,
          borderColor: selectedColor.borderHex,
        }}
      >
        {/* Subtle decorative top pin tape */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2.5 bg-white/40 backdrop-blur-xs rounded-b-md border-b border-black/5" />

        <div className="p-4 sm:p-6 space-y-4">
          {/* Header of Note Input: Label + Live color indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-white/60 text-slate-700">
                <Palette className="w-4 h-4" />
              </span>
              <span
                className="text-xs font-bold tracking-wide uppercase"
                style={{ color: selectedColor.textHex }}
              >
                Yeni Not Oluştur &bull; Seçilen Renk: {selectedColor.name}
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 hidden sm:flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-slate-400" />
              <span>Ctrl + Enter ile ekle</span>
            </div>
          </div>

          {/* Textarea - core requirement */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Notunuzu buraya yazın..."
              rows={4}
              className="w-full p-3.5 sm:p-4 rounded-xl text-slate-900 placeholder-slate-500/80 bg-white/70 backdrop-blur-xs border border-black/10 focus:border-black/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-sm sm:text-base resize-y transition-all leading-relaxed shadow-inner"
              style={{ minHeight: '110px' }}
              aria-label="Not içeriği"
            />
            {error && (
              <p className="mt-1 text-xs font-semibold text-rose-600 animate-bounce">
                {error}
              </p>
            )}
          </div>

          {/* Color Palette Picker & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Color buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-700 mr-1">Renk Seçimi:</span>
              <div className="flex items-center gap-2">
                {NOTE_COLORS.map((color) => {
                  const isSelected = selectedColorId === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColorId(color.id)}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs focus:outline-none ${
                        isSelected
                          ? 'ring-2 ring-slate-800 ring-offset-2 scale-105'
                          : 'border border-black/10 hover:shadow-sm'
                      }`}
                      style={{ backgroundColor: color.dotHex }}
                      title={`${color.name} rengini seç`}
                      aria-label={`${color.name} rengi`}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Character count & Submit Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs font-medium text-slate-500">
                {content.length} karakter
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Not Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
