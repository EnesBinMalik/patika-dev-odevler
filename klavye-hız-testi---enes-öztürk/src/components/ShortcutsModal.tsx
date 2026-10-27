import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Boşluk (Space)', desc: 'Yazılan kelimeyi onaylar, doğru/yanlış rengi uygular ve sıradaki kelimeye geçer.' },
    { key: 'Esc', desc: 'Testi anında durdurur, yeni rastgele kelimeler üretir ve 60 saniyeyi sıfırlar.' },
    { key: 'Tab + Enter', desc: 'Sonuç ekranındayken veya test esnasında hızlıca testi baştan başlatır.' },
    { key: 'Backspace', desc: 'Yazmakta olduğunuz kelimenin son harfini siler.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Command className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Klavye Kısayolları</h3>
            <p className="text-xs text-slate-400">Hızlı ve akıcı kullanım için tuş kombinasyonları</p>
          </div>
        </div>

        <div className="py-4 space-y-3">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80"
            >
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono font-bold text-amber-300 shadow-sm whitespace-nowrap">
                {sc.key}
              </kbd>
              <span className="text-xs text-slate-300 text-right">{sc.desc}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
