import React, { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (data: { id: string; name: string; description: string; icon: string }) => Promise<void>;
}

const ICONS = [
  { id: 'Hash', label: 'Kanal' },
  { id: 'MessageSquare', label: 'Sohbet' },
  { id: 'Code2', label: 'Kod' },
  { id: 'Moon', label: 'Gece' },
  { id: 'Flame', label: 'Ateş' },
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Hash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    try {
      setIsSubmitting(true);
      await onCreateRoom({
        id,
        name: name.trim(),
        description: description.trim() || 'Yeni anonim sohbet odası',
        icon,
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Oda oluşturulamadı:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Yeni Anonim Sohbet Odası Oluştur
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">
              Oda İsmi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Kripto Para Sohbetleri, Kitap Kulübü..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">
              Açıklama
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Odanın konusunu kısaca açıklayın..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Oda İkonu
            </label>
            <div className="flex items-center gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIcon(ic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    icon === ic.id
                      ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300'
                      : 'border-slate-800 text-slate-400 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-md shadow-indigo-600/30 transition"
            >
              {isSubmitting ? 'Oluşturuluyor...' : 'Odayı Aç (GraphQL Mutation)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
