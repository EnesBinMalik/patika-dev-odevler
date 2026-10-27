import React, { useState, useEffect } from 'react';
import { X, Check, Save, Palette } from 'lucide-react';
import { Note } from '../types/note';
import { NOTE_COLORS } from '../constants/colors';
import { getColorById } from '../utils/formatters';

interface NoteEditModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newContent: string, newColorId: string) => void;
}

export const NoteEditModal: React.FC<NoteEditModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('yellow');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setSelectedColorId(note.colorId);
      setError(null);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const currentColor = getColorById(selectedColorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError('Not içeriği boş olamaz!');
      return;
    }
    onSave(note.id, trimmed, selectedColorId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: currentColor.bgHex,
          borderColor: currentColor.borderHex,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Notu Düzenle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              rows={5}
              className="w-full p-3.5 rounded-xl bg-white/80 border border-black/10 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-sm sm:text-base leading-relaxed"
              placeholder="Notunuzu düzenleyin..."
            />
            {error && (
              <p className="text-xs font-semibold text-rose-600">{error}</p>
            )}
          </div>

          {/* Color Picker in Modal */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Renk Değiştir:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {NOTE_COLORS.map((color) => {
                const isSelected = selectedColorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColorId(color.id)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      isSelected
                        ? 'ring-2 ring-slate-800 ring-offset-2 scale-105'
                        : 'border border-black/10'
                    }`}
                    style={{ backgroundColor: color.dotHex }}
                    title={color.name}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-black/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
