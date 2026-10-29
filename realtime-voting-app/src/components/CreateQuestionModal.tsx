import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Check, AlertCircle, Wand2 } from 'lucide-react';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    category: string;
    creator: string;
    options: { text: string }[];
  }) => Promise<void>;
  isSubmitting: boolean;
}

const CATEGORIES = [
  'Yazılım',
  'Yapay Zeka',
  'Backend',
  'Frontend',
  'Tasarım',
  'Kariyer',
  'Genel Kültür',
  'Teknoloji',
];

export const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Yazılım');
  const [creator, setCreator] = useState('Enes Öztürk');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setError('Bir oylamada en az 2 seçenek bulunmalıdır.');
      return;
    }
    setError(null);
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  // Quick presets to make creating polls fun and fast
  const applyPreset = (presetOptions: string[]) => {
    setOptions(presetOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || title.trim().length < 5) {
      setError('Lütfen en az 5 karakterlik anlamlı bir soru başlığı girin.');
      return;
    }

    const filledOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (filledOptions.length < 2) {
      setError('Lütfen en az 2 geçerli seçenek girin.');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        creator: creator.trim() || 'Enes Öztürk',
        options: filledOptions.map((text) => ({ text })),
      });
      // reset form
      setTitle('');
      setDescription('');
      setCategory('Yazılım');
      setOptions(['', '']);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Soru oluşturulurken bir hata oluştu.';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/60 p-6 sm:p-8 my-8 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Yeni Oylama & Soru Ekle</h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Gerçek zamanlı GraphQL akışında yayınlanacak soruyu ve dilediğiniz sayıda seçeneği ekleyin.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Soru Başlığı <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: 2026'da favori backend GraphQL kütüphaneniz hangisi?"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Açıklama / Detay <span className="text-slate-500 text-[11px] font-normal">(İsteğe bağlı)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Oylama hakkında ek bağlam, kriterler veya detaylar..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Category & Creator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Hazırlayan / İsim
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Örn: Enes Öztürk"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-white text-sm outline-none"
              />
            </div>
          </div>

          {/* Dynamic Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Seçenekler <span className="text-rose-400">*</span>{' '}
                <span className="text-slate-500 font-normal text-[11px]">
                  (Dilediğiniz kadar seçenek ekleyebilirsiniz)
                </span>
              </label>

              {/* Quick Presets */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> Şablon:
                </span>
                <button
                  type="button"
                  onClick={() => applyPreset(['Evet', 'Hayır', 'Kararsızım'])}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                >
                  Evet/Hayır
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(['1 Yıldız (Zayıf)', '2 Yıldız', '3 Yıldız (Orta)', '4 Yıldız', '5 Yıldız (Mükemmel)'])}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                >
                  1-5 Puan
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-xs font-mono font-bold text-indigo-400 shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <input
                    type="text"
                    required
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Seçenek ${index + 1}`}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    title={options.length <= 2 ? 'En az 2 seçenek olmalıdır' : 'Seçeneği sil'}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      options.length <= 2
                        ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-slate-800 hover:border-rose-500/30 cursor-pointer'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-950/40 hover:bg-indigo-950/20 text-slate-300 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Daha Fazla Seçenek Ekle ({options.length + 1}. Seçenek)</span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              İmza: <span className="text-slate-400 font-medium">Enes Öztürk Realtime Engine</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                İptal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Yayınlanıyor...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Oylamayı Başlat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
