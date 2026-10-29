import React, { useState } from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, PlusCircle, AlertCircle, Sparkles, Code2 } from 'lucide-react';

interface AddPostViewProps {
  onAdd: (newPost: BlogPost) => void;
  onCancel: () => void;
  onGoToCode: (fileId?: string) => void;
}

export const AddPostView: React.FC<AddPostViewProps> = ({
  onAdd,
  onCancel,
  onGoToCode
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [detail, setDetail] = useState('');
  const [category, setCategory] = useState('Node.js & Mimari');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const samplePresets = [
    {
      title: 'Express.js ile RESTful Routing ve Controller Ayrımı',
      subtitle: 'Kodları spagetti olmaktan kurtarıp modüler hale getiriyoruz.',
      detail: `Express framework'ü ile çalışırken tüm rotaları tek bir app.js dosyasında tutmak projenin büyümesiyle birlikte kaos yaratır.

Bunun önüne geçmek için Controller katmanını devreye sokuyoruz:
1. controllers/postController.js: Tüm post operasyonları burada toplanır.
2. controllers/pageController.js: Statik sayfa yönlendirmeleri burada toplanır.

Clean Blog projemizin 5. bölümünde bu düzenlemeyi kusursuz biçimde tamamladık. Enes Öztürk imzalı projemizde hem okunabilirlik hem de test edilebilirlik üst seviyeye ulaştı.`,
      category: 'Node.js & Mimari'
    },
    {
      title: 'method-override Paketi ile HTML Formlarında PUT ve DELETE Kullanımı',
      subtitle: 'Standart form sınırlarını aşarak modern HTTP fiillerini etkinleştirmek.',
      detail: `Geleneksel HTML formları yalnızca GET ve POST isteklerini destekler. Ancak Clean Blog 5. bölümünde bir postu güncellemek için PUT, silmek için ise DELETE isteklerine ihtiyaç duyarız.

method-override paketi, form action URL'sine eklenen ?_method=PUT veya ?_method=DELETE parametrelerini yakalar ve Express'in ilgili route handler'ına yönlendirir.

Böylece kodlarımız REST mimarisinin en temel prensiplerine sadık kalır.`,
      category: 'Ödev Çözümleri'
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setDetail(preset.detail);
    setCategory(preset.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Lütfen yazı başlığı giriniz.';
    if (!detail.trim()) newErrors.detail = 'Lütfen yazı içeriği giriniz.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPost: BlogPost = {
      _id: 'post_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      subtitle: subtitle.trim(),
      detail: detail.trim(),
      author: 'Enes Öztürk',
      category: category.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
      dateCreated: new Date().toISOString(),
      readTimeMinutes: Math.max(1, Math.ceil(detail.trim().split(/\s+/).length / 150)),
      likes: 0
    };

    onAdd(newPost);
  };

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
            &larr; Anasayfaya Dön
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              Şablon: <span className="font-mono text-emerald-400">views/add_post.ejs</span>
            </span>
            <button
              onClick={() => onGoToCode('post-controller')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 ml-2"
            >
              <Code2 className="w-3.5 h-3.5" />
              postController.createPost
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header
        className="relative py-16 md:py-24 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-[#212529]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 backdrop-blur-md">
            <PlusCircle className="w-3.5 h-3.5" />
            Yeni Yazı Ekleme Sayfası &bull; add_post.ejs
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-2">
            Yeni Blog Yazısı Oluştur
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-300">
            Yazınızı oluşturun, ardından post.ejs üzerinde UPDATE ve DELETE butonlarını test edin.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Quick presets helper */}
          <div className="bg-emerald-50/70 border-b border-emerald-200/60 p-4">
            <div className="flex items-center justify-between text-xs text-emerald-900 mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Hızlı Test İçin Örnek Şablon Doldur:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 border border-emerald-300 rounded text-xs text-emerald-800 font-medium transition-colors"
                >
                  Doldur: "{preset.title.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Yazı Başlığı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                placeholder="Örn: Node.js ile Modern Web Mimarisi"
                className={`w-full px-4 py-3 rounded-lg border text-base font-serif font-bold text-gray-900 transition-colors focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
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
                Alt Başlık
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Örn: Express ve MVC Mimarisi Rehberi"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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

            {/* Detail */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Yazı İçeriği (Detay) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={10}
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value);
                  if (errors.detail) setErrors(prev => ({ ...prev, detail: '' }));
                }}
                placeholder="Blog yazınızın içeriğini buraya yazınız..."
                className={`w-full p-4 rounded-lg border text-sm text-gray-800 font-sans leading-relaxed transition-colors focus:outline-none focus:ring-2 ${
                  errors.detail
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.detail && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.detail}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kapak Fotoğrafı URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Buttons */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
              >
                İptal
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yazıyı Yayınla (POST /posts)</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
