import React from 'react';
import { BlogPost } from '../types/blog';
import { ArrowRight, CheckCircle2, Code, ExternalLink, Sparkles } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onOpenHomeworkTab: () => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelectPost, onOpenHomeworkTab }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Ödev 10 Bilgilendirme ve EJS Rota İpucu Kutusu */}
      <div className="mb-10 p-5 bg-stone-50 border border-stone-200 rounded-lg shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-md shrink-0 mt-0.5">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <span>Ödev 10 - Adım 1 (index.ejs Dinamik Linkler)</span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Aktif & Doğrulandı
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Aşağıdaki her bir post kartı, <code className="px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded font-mono text-xs">/posts/&lt;%= posts[i]._id %&gt;</code> yapısıyla yönlendirilmektedir. Gönderiye tıklayarak Express{' '}
                <code className="px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded font-mono text-xs">app.get('/posts/:id')</code> ve{' '}
                <code className="px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded font-mono text-xs">post.ejs</code> çıktısını canlı olarak deneyimleyebilirsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHomeworkTab}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
          >
            <span>Kodları İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Post Listesi (index.ejs for döngüsü simülasyonu) */}
      <div className="divide-y divide-stone-200">
        {posts.map((post, idx) => (
          <article key={post._id} className="py-8 group transition-all">
            {/* Dinamik URL rozeti (Ödev 10: /posts/<%= posts[i]._id %>) */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-mono">
              <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                <span className="text-stone-400 font-sans">Rota:</span> /posts/{post._id}
              </span>
              <span className="text-stone-400 font-sans text-xs">Gönderi #{idx + 1}</span>
            </div>

            {/* Post Başlığı ve Alt Başlık (index.ejs içindeki <a> etiketi) */}
            <button
              onClick={() => onSelectPost(post)}
              className="text-left w-full block group cursor-pointer focus:outline-none"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                {post.title}
              </h2>
              {post.subtitle && (
                <p className="mt-2 text-base text-stone-600 font-light leading-relaxed group-hover:text-stone-800 transition-colors">
                  {post.subtitle}
                </p>
              )}
            </button>

            {/* Post Detayından Önizleme */}
            <p className="mt-3 text-sm text-stone-500 line-clamp-2 leading-relaxed">
              {post.detail}
            </p>

            {/* Meta Bilgisi (Byline: Posted by Enes Öztürk on ...) */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
              <p className="italic">
                Yayınlayan:{' '}
                <span className="font-medium text-stone-800 not-italic">
                  {post.author || 'Enes Öztürk'}
                </span>{' '}
                tarihinde <span className="font-mono text-stone-600">{post.dateCreated}</span>
              </p>

              <button
                onClick={() => onSelectPost(post)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
              >
                <span>Yazıyı Oku (post.ejs)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Pager (Start Bootstrap Clean Blog Klasik Sayfalama) */}
      <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between">
        <span className="text-xs text-stone-500 font-mono">
          Toplam {posts.length} gönderi listelendi
        </span>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
        >
          <span>Sayfa Başına Dön &uarr;</span>
        </button>
      </div>
    </div>
  );
};
