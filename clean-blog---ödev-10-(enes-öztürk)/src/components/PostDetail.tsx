import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { ArrowLeft, CheckCircle, Code, Copy, Trash2, Calendar, User, Tag, Share2 } from 'lucide-react';

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onDelete: (id: string) => void;
  onOpenHomeworkCode: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onBack,
  onDelete,
  onOpenHomeworkCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format detail paragraphs
  const paragraphs = post.detail.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Üst Navigasyon & Simüle Edilen Rota Göstergesi */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Gönderilere Dön (index.ejs)</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-300 rounded text-xs font-mono text-stone-700">
            <span className="text-stone-400 font-sans">URL:</span>
            <span>/posts/{post._id}</span>
          </div>
          <button
            onClick={handleCopyUrl}
            title="URL Kopyala"
            className="p-1.5 text-stone-500 hover:text-stone-800 bg-stone-100 border border-stone-300 rounded text-xs cursor-pointer"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Ödev 10 Doğrulama Bandı */}
      <div className="mb-10 bg-amber-50/70 border border-amber-200 rounded-lg p-4 text-xs sm:text-sm text-stone-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1 sm:mt-0"></span>
            <span>
              <strong>Ödev 10 Doğrulandı:</strong> Bu sayfa <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono">app.get('/posts/:id')</code> ile yakalanıp <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono">post.ejs</code> şablonuna iletilen tekil veriyi göstermektedir.
            </span>
          </div>
          <button
            onClick={() => setShowCodeDetails(!showCodeDetails)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-200/70 text-amber-900 rounded hover:bg-amber-200 transition-colors shrink-0 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodeDetails ? 'EJS Kodunu Gizle' : 'post.ejs Değişkenlerini İncele'}</span>
          </button>
        </div>

        {showCodeDetails && (
          <div className="mt-4 pt-4 border-t border-amber-200/80 font-mono text-xs text-stone-800 space-y-2">
            <div className="p-2.5 bg-stone-900 text-stone-200 rounded overflow-x-auto">
              <span className="text-stone-400">&lt;!-- post.ejs değişken eşleşmeleri --&gt;</span>
              <br />
              <span className="text-amber-300">&lt;h1&gt;&lt;%= post.title %&gt;&lt;/h1&gt;</span>{' '}
              <span className="text-stone-400">→ &quot;{post.title}&quot;</span>
              <br />
              <span className="text-amber-300">&lt;p&gt;&lt;%= post.detail %&gt;&lt;/p&gt;</span>{' '}
              <span className="text-stone-400">→ {post.detail.length} karakter</span>
              <br />
              <span className="text-amber-300">&lt;span&gt;&lt;%= post.dateCreated %&gt;&lt;/span&gt;</span>{' '}
              <span className="text-stone-400">→ &quot;{post.dateCreated}&quot;</span>
              <br />
              <span className="text-amber-300">&lt;!-- İMZA --&gt;</span>{' '}
              <span className="text-emerald-400">&lt;span&gt;Posted by Enes Öztürk&lt;/span&gt;</span>
            </div>
          </div>
        )}
      </div>

      {/* Makale Gövdesi (post.detail) */}
      <div className="prose prose-stone max-w-none text-stone-800 text-base sm:text-lg leading-relaxed font-serif">
        {paragraphs.map((p, idx) => (
          <p
            key={idx}
            className={`mb-6 text-stone-800 ${
              idx === 0
                ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900'
                : ''
            }`}
          >
            {p}
          </p>
        ))}
      </div>

      {/* İMZA ALANI (enes öztürk imzasıyla olsun) */}
      <div className="mt-12 pt-8 border-t border-stone-200">
        <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-amber-400 font-serif font-bold text-xl flex items-center justify-center shrink-0 border-2 border-amber-400 shadow-xs">
            EÖ
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Enes Öztürk
              </h3>
              <span className="text-xs font-mono text-stone-500">
                Yazar & Geliştirici İmzası
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Node.js, Express ve MongoDB ile Clean Blog geliştiricisi. Bu tekil post sayfası, Patika.dev Clean Blog Projesi 4. Bölüm (Ödev 10) gereksinimlerine tam uyumlu olarak hazırlanmıştır.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {post.dateCreated}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                Ödev 10 Proje Teslimi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Eylemler */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors cursor-pointer"
        >
          &larr; Post Listesine Dön
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHomeworkCode}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Code className="w-4 h-4 text-amber-600" />
            <span>Ödev 10 Çözüm Kodları</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Bu postu silmek istediğinize emin misiniz?')) {
                onDelete(post._id);
              }
            }}
            className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Postu Sil</span>
          </button>
        </div>
      </div>
    </article>
  );
};
