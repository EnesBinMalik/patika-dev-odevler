import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { PlusCircle, ArrowLeft, Send } from 'lucide-react';

interface AddPostProps {
  onAddPost: (post: Omit<BlogPost, '_id' | 'dateCreated' | 'author'>) => void;
  onCancel: () => void;
}

export const AddPost: React.FC<AddPostProps> = ({ onAddPost, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) {
      setError('Lütfen başlık ve detay alanlarını doldurunuz.');
      return;
    }
    setError('');
    onAddPost({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      detail: detail.trim(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vazgeç ve Anasayfaya Dön</span>
        </button>
        <span className="text-xs font-mono text-stone-400">
          Template: views/add_post.ejs
        </span>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="border-b border-stone-100 pb-5 mb-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Yeni Yazı Oluştur
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Gönderi kaydedildiğinde otomatik bir MongoDB <code className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">_id</code> atanacak ve doğrudan <code className="font-mono text-xs bg-stone-100 px-1 py-0.5 rounded">/posts/:id</code> tekil sayfasına yönlendirileceksiniz.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="post-title" className="block text-sm font-semibold text-stone-800 mb-1">
              Post Başlığı (post.title) *
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: MongoDB İndeksleme Stratejileri"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none text-stone-900 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="post-subtitle" className="block text-sm font-semibold text-stone-800 mb-1">
              Alt Başlık / Özet (post.subtitle)
            </label>
            <input
              id="post-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Örn: Veritabanı sorgularını hızlandıran kritik adımlar"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none text-stone-900 text-sm"
            />
          </div>

          <div>
            <label htmlFor="post-detail" className="block text-sm font-semibold text-stone-800 mb-1">
              Post İçeriği & Detayı (post.detail) *
            </label>
            <textarea
              id="post-detail"
              rows={8}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Yazınızın detaylı metnini buraya giriniz..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none text-stone-900 text-sm leading-relaxed"
              required
            />
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Yazar Bilgisi:</span> Gönderi Enes Öztürk imzasıyla yayınlanacaktır (Ödev yönergesi gereği).
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Gönderiyi Yayınla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
