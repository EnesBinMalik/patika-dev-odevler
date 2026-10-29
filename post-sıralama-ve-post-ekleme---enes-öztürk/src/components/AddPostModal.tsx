import React, { useState } from 'react';
import { X, Sparkles, Send, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { BlogPost, AsyncMode } from '../types';
import { SAMPLE_TEMPLATES } from '../data/initialPosts';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<BlogPost, 'id'>, mode: AsyncMode) => void;
  nextId: number;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nextId,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Node.js');
  const [readTime, setReadTime] = useState('4 dk okuma');
  const [tagsInput, setTagsInput] = useState('Node.js, JavaScript, Asenkron');
  const [author] = useState('Enes Öztürk');
  const [mode, setMode] = useState<AsyncMode>('async-await');

  if (!isOpen) return null;

  const handleApplyTemplate = (index: number) => {
    const tmpl = SAMPLE_TEMPLATES[index];
    if (tmpl) {
      setTitle(tmpl.title);
      setSummary(tmpl.summary);
      setContent(tmpl.content);
      setCategory(tmpl.category);
      setReadTime(tmpl.readTime);
      setTagsInput(tmpl.tags.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const today = new Date().toISOString().split('T')[0];

    onSubmit(
      {
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        content: content.trim() || 'Bu post asenkron fonksiyon ile blog sistemine başarıyla eklendi.',
        author: author,
        date: today,
        category: category.trim() || 'Genel',
        readTime: readTime.trim() || '3 dk okuma',
        tags: tags.length > 0 ? tags : ['Blog', 'NodeJS'],
      },
      mode
    );

    // Reset and close
    setTitle('');
    setSummary('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Yeni Post Oluşturma (Post Ekleme)
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Bloga Yeni Post Ekle & Konsolda Sırala
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Templates Strip */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Hızlı Şablon Seç (Tek Tıkla Doldur)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">Örnek Başlıklar</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(idx)}
                  className="text-left p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 hover:shadow-xs transition-all text-xs font-medium text-slate-800 line-clamp-1 cursor-pointer"
                  title={tmpl.title}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Post Başlığı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Node.js ile Asenkron Dosya İşlemleri"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-medium transition-colors"
            />
          </div>

          {/* Category & Read Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-colors cursor-pointer bg-white"
              >
                <option value="Node.js">Node.js</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Modern JS">Modern JS</option>
                <option value="Yazılım Mimarisi">Yazılım Mimarisi</option>
                <option value="Veritabanı">Veritabanı</option>
                <option value="Backend">Backend</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Okuma Süresi
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="Örn: 4 dk okuma"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kısa Özet
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Postun kısa özeti (liste kartlarında görünür)..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              İçerik Detayı
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post içeriğini buraya yazın..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-colors resize-none"
            />
          </div>

          {/* Author and Async Method Selector */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700">İmza & Yazar:</span>
                <span className="ml-2 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {author} (Otomatik İmzalanır)
                </span>
              </div>
              <div className="text-slate-500 font-mono">
                Atanacak ID: #{nextId}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Asenkron Yürütme Yöntemi:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('async-await')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'async-await'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  async / await
                </button>
                <button
                  type="button"
                  onClick={() => setMode('promise')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'promise'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Promise (.then)
                </button>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Postu Ekle & Konsolda Sırala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
