import React, { useState } from 'react';
import { Send, Eye, Code, CheckCircle, Info, Sparkles, AlertCircle } from 'lucide-react';
import { IPost } from '../types.ts';

interface AddPostProps {
  onPostCreated: (post: IPost) => void;
  onCancel: () => void;
}

export const AddPost: React.FC<AddPostProps> = ({ onPostCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [author, setAuthor] = useState('Enes Öztürk');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) {
      setError('Lütfen başlık (title) ve detay (detail) alanlarını doldurunuz.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Ödev 9 Görev 2 & 3:
      // req.body ile yakalanacak verileri gönderiyoruz
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          detail: detail.trim(),
          author: author.trim() || 'Enes Öztürk',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gönderi oluşturulamadı.');
      }

      const created = await res.json();
      setSuccessMessage('Gönderi req.body ile başarıyla yakalandı ve cleanblog-test-db veritabanına kaydedildi!');
      setTimeout(() => {
        onPostCreated(created);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Gönderi oluşturulurken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Educational Notice Banner about Ödev 9 */}
      <div className="mb-8 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <strong className="font-semibold block mb-0.5 text-teal-950">
            Ödev 9 - Görev 2 & 3: "Add New Post" Sayfası & req.body Entegrasyonu
          </strong>
          Bu formdan gönderilen veriler backend tarafında{' '}
          <code className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-mono font-semibold">
            {"app.use(express.urlencoded({ extended: true }))"}
          </code>{' '}
          ve{' '}
          <code className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-mono font-semibold">
            express.json()
          </code>{' '}
          middleware fonksiyonları ile{' '}
          <code className="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-mono font-semibold">
            req.body
          </code>{' '}
          üzerinden yakalanır ve Mongoose Post modeline ({"{ title, detail, dateCreated, author }"}) kaydedilir.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Yeni Gönderi Oluştur
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Clean Blog şablonu form arayüzü
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold text-stone-600 hover:text-teal-700 flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? 'Önizlemeyi Gizle' : 'Önizleme Yap'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Gönderi Başlığı (title: String) <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Node.js ile Temiz Kod Prensipleri..."
                className="w-full px-4 py-3 text-stone-900 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-serif placeholder:font-sans placeholder:text-stone-400 text-base transition"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                Post modelindeki <code className="font-mono">title: String</code> alanına atanacaktır.
              </span>
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Yazar İmzası (author)
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm font-medium transition"
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                Ödev 9 gereği varsayılan imza: <strong className="text-stone-700">Enes Öztürk</strong>
              </span>
            </div>

            {/* Detail Field */}
            <div>
              <label htmlFor="detail" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Gönderi Detayı / İçerik (detail: String) <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="detail"
                name="detail"
                rows={7}
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Bu alanda blog yazınızın detaylı içeriğini paylaşabilirsiniz..."
                className="w-full px-4 py-3 text-stone-900 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-sans text-sm leading-relaxed placeholder:text-stone-400 transition"
              />
              <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                <span>Post modelindeki <code className="font-mono">detail: String</code> alanına atanacaktır.</span>
                <span>{detail.length} karakter</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:bg-stone-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Yazıyı Yayınla (Create Post)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar / Live Inspector & Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live req.body Inspector */}
          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-teal-400">
                <Code className="w-4 h-4" />
                <span>req.body Canlı İnceleyici</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
                JSON / Form Data
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-3">
              Form submit edildiğinde Express backend'e gidecek veri yapısı:
            </p>

            <pre className="bg-stone-950 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-stone-800/80">
{JSON.stringify(
  {
    title: title || '(Başlık bekleniyor...)',
    detail: detail ? detail.slice(0, 50) + (detail.length > 50 ? '...' : '') : '(İçerik bekleniyor...)',
    author: author || 'Enes Öztürk',
    dateCreated: 'Date.now() [Varsayılan]',
  },
  null,
  2
)}
            </pre>

            <div className="mt-4 pt-3 border-t border-stone-800 space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>{"urlencoded({ extended: true })"}</strong> middleware devrede</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>cleanblog-test-db</strong> veritabanına doğrudan kayıt</span>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Canlı Clean Blog Önizlemesi</span>
            </div>

            <div className="border border-dashed border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                {title || 'Yazı Başlığınız Burada Görünecek'}
              </h3>
              <p className="mt-2 text-stone-600 text-xs leading-relaxed line-clamp-3">
                {detail || 'Yazınızın detay metni bu kısımda canlı olarak biçimlendirilecektir.'}
              </p>
              <p className="mt-3 text-[11px] italic font-serif text-stone-400 border-t border-stone-200 pt-2">
                Posted by <strong className="text-stone-800 not-italic font-sans">{author || 'Enes Öztürk'}</strong> on{' '}
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
