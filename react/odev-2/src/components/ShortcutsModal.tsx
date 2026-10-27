import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter', description: 'Yeni görev ekle / Düzenlenen görevi kaydet' },
    { key: 'Esc', description: 'Düzenlemeyi iptal et / Modalı kapat' },
    { key: 'Çift Tıklama', description: 'Herhangi bir görevi anında düzenlemeye başla' },
    { key: '#/', description: 'Tüm görevleri filtrele (URL hash: #/)' },
    { key: '#/active', description: 'Aktif görevleri filtrele (URL hash: #/active)' },
    { key: '#/completed', description: 'Tamamlanan görevleri filtrele (URL hash: #/completed)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Keyboard className="w-4 h-4 text-slate-600" />
            <span>Klavye Kısayolları ve Kullanım</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0 text-xs"
            >
              <span className="text-slate-600">{sc.description}</span>
              <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-800 shadow-2xs font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
