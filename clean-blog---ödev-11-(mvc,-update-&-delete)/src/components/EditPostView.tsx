import React, { useState } from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Save, Code2, AlertCircle, CheckCircle2, RefreshCw, FileEdit } from 'lucide-react';

interface EditPostViewProps {
  post: BlogPost;
  onSave: (updatedPost: BlogPost) => void;
  onCancel: () => void;
  onGoToCode: (fileId?: string) => void;
}

export const EditPostView: React.FC<EditPostViewProps> = ({
  post,
  onSave,
  onCancel,
  onGoToCode
}) => {
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle || '');
  const [detail, setDetail] = useState(post.detail);
  const [category, setCategory] = useState(post.category || 'Node.js & Mimari');
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Lütfen yazı başlığı giriniz.';
    if (!detail.trim()) newErrors.detail = 'Lütfen yazı içeriği giriniz.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updated: BlogPost = {
      ...post,
      title: title.trim(),
      subtitle: subtitle.trim(),
      detail: detail.trim(),
      category: category.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    };

    onSave(updated);
  };

  const sampleImages = [
    { label: 'Yazılım / Kod', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80' },
    { label: 'Laptop / Çalışma', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80' },
    { label: 'Minimalist Masalar', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80' },
    { label: 'Teknoloji / Matrix', url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Bar Navigation */}
      <div className="bg-[#1f2428] text-gray-300 py-3 px-4 border-b border-gray-700">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            &larr; Post Detayına Dön
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              Şablon: <span className="font-mono text-amber-400">views/edit.ejs</span>
            </span>
            <button
              onClick={() => onGoToCode('edit-ejs')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 ml-2"
            >
              <Code2 className="w-3.5 h-3.5" />
              edit.ejs Kodu
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header
        className="relative py-16 md:py-24 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-[#212529]/85 backdrop-blur-[2px]"></div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 backdrop-blur-md">
            <FileEdit className="w-3.5 h-3.5" />
            Ödev 11 &bull; 2. Madde: Post Güncelleme (UPDATE)
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-2">
            Yazıyı Güncelle
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-300">
            Mevcut blog yazısı verilerini düzenleyip veritabanına kaydetme sayfası (<span className="font-mono text-amber-300">edit.ejs</span>)
          </p>
        </div>
      </header>

      {/* Main Edit Form */}
      <main className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Method-override explanatory bar */}
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[11px]">PUT</span>
              <span>action="/posts/{post._id}?_method=PUT"</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showCode ? 'Kodları Gizle' : 'Controller & EJS Kodu'}
            </button>
          </div>

          {/* Optional Code drawer */}
          {showCode && (
            <div className="bg-[#1e1e1e] text-gray-200 p-4 border-b border-gray-700 text-xs font-mono">
              <p className="text-amber-400 font-bold mb-2">// controllers/postController.js (updatePost)</p>
              <pre className="text-gray-300 overflow-x-auto pb-2">
{`exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.title = req.body.title;
  post.subtitle = req.body.subtitle;
  post.detail = req.body.detail;
  await post.save();
  res.redirect('/posts/' + req.params.id);
};`}
              </pre>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Yazı Başlığı (post.title) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                placeholder="Örn: Node.js ile MVC Mimarisi"
                className={`w-full px-4 py-3 rounded-lg border text-base font-serif font-bold text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-300 focus:ring-amber-500/20 focus:border-amber-500'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Alt Başlık (post.subtitle)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Örn: Express ve EJS kullanarak temiz kod yazımı"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="Node.js & Mimari">Node.js & Mimari</option>
                  <option value="Ödev Çözümleri">Ödev Çözümleri</option>
                  <option value="Veritabanı">Veritabanı</option>
                  <option value="Frontend & Template">Frontend & Template</option>
                  <option value="Backend Geliştirme">Backend Geliştirme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Yazar (Author)
                </label>
                <input
                  type="text"
                  disabled
                  value="Enes Öztürk"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Detail / Content */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Yazı İçeriği (post.detail) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={10}
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value);
                  if (errors.detail) setErrors(prev => ({ ...prev, detail: '' }));
                }}
                placeholder="Yazının tüm detaylarını ve paragraflarını buraya yazın..."
                className={`w-full p-4 rounded-lg border text-sm text-gray-800 font-sans leading-relaxed transition-colors focus:outline-none focus:ring-2 ${
                  errors.detail
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-300 focus:ring-amber-500/20 focus:border-amber-500'
                }`}
              />
              {errors.detail && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.detail}
                </p>
              )}
            </div>

            {/* Image URL & presets */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kapak Fotoğrafı URL (post.imageUrl)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 mb-2"
              />
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-gray-500 text-[11px] self-center">Hazır Görseller:</span>
                {sampleImages.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-medium transition-colors"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
              >
                İptal Et & Geri Dön
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Güncellemeleri Kaydet (PUT)</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
