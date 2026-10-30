import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { ArrowLeft, Save, Eye, FileEdit, AlertCircle } from 'lucide-react';

interface PostFormViewProps {
  initialPost?: BlogPost | null;
  onSave: (postData: Omit<BlogPost, 'id' | 'dateCreated' | 'readTime'>) => void;
  onCancel: () => void;
}

export const PostFormView: React.FC<PostFormViewProps> = ({
  initialPost,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle || '');
  const [category, setCategory] = useState(initialPost?.category || 'Node.js & MongoDB');
  const [author, setAuthor] = useState(initialPost?.author || 'Enes Öztürk');
  const [detail, setDetail] = useState(initialPost?.detail || '');
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = !!initialPost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) return;

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      category: category.trim(),
      author: author.trim() || 'Enes Öztürk',
      authorEmail: 'enesbino38@gmail.com',
      detail: detail.trim()
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vazgeç ve Geri Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            {showPreview ? (
              <>
                <FileEdit className="w-3.5 h-3.5" />
                <span>Düzenleme Modu</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Canlı Önizleme</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-serif-heading text-3xl font-bold text-slate-900 mb-2">
          {isEditing ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı Ekle'}
        </h1>
        <p className="text-sm text-slate-600">
          Clean Blog CRUD mimarisi ile MongoDB Atlas veritabanı modeline uygun yeni içerik oluşturun.
        </p>
      </div>

      {/* Reminder Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3.5 mb-6 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Müfredat Notu:</strong> Bu sürümde görsel dosya yükleme (Multer vb.) ve sayfalama işlemleri ödev gereği yapılmamıştır. Sonraki projemizde bu özellikler dahil edilecektir.
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
            {category || 'Kategori'}
          </div>
          <h2 className="font-serif-heading text-3xl font-bold text-slate-900 mb-3">
            {title || 'Yazı Başlığı'}
          </h2>
          <p className="text-lg text-slate-600 font-light mb-6">
            {subtitle || 'Yazı alt başlığı veya özeti burada yer alacak.'}
          </p>
          <div className="text-xs text-slate-400 mb-6 pb-4 border-b border-slate-100">
            Yazar: {author} · Bugün · Taslak Önizleme
          </div>
          <div className="prose prose-slate max-w-none text-slate-800 space-y-4">
            {detail ? (
              detail.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="italic text-slate-400">İçerik henüz girilmedi...</p>
            )}
          </div>
        </div>
      ) : (
        /* Form Mode */
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Yazı Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Node.js ile MongoDB Atlas Entegrasyonu Nasıl Yapılır?"
              className="w-full px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Alt Başlık / Kısa Özet *
            </label>
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Örn: Bulut tabanlı M0 Sandbox kümesi oluşturup Mongoose ile bağlantı kuruyoruz."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Yazar Adı *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enes Öztürk"
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Node.js Mimarisi">Node.js Mimarisi</option>
                <option value="Express.js & REST">Express.js & REST</option>
                <option value="MongoDB Atlas">MongoDB Atlas</option>
                <option value="Front-End Entegrasyonu">Front-End Entegrasyonu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Yazı İçeriği / Detay *
            </label>
            <textarea
              rows={10}
              required
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Yazınızı buraya yazın. Paragraflar arasında bir satır boşluk bırakabilirsiniz. Alıntılar için satır başına '> ' ekleyebilirsiniz..."
              className="w-full px-4 py-3 text-sm leading-relaxed border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Markdown paragrafları ve alıntılar desteklenir.</span>
              <span>{detail.length} karakter</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Değişiklikleri Güncelle' : 'Yazıyı Yayınla'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
