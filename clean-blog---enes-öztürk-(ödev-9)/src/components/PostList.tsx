import React from 'react';
import { PlusCircle, RotateCcw, Calendar, ArrowRight, Sparkles, Database, Check } from 'lucide-react';
import { IPost } from '../types.ts';

interface PostListProps {
  posts: IPost[];
  loading: boolean;
  onSelectPost: (post: IPost) => void;
  onNavigateAddPost: () => void;
  onResetPosts: () => void;
  onOpenHomework: () => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  onSelectPost,
  onNavigateAddPost,
  onResetPosts,
  onOpenHomework,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Homework Info & Status Strip */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-5 mb-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-100/90 px-2.5 py-0.5 rounded-full border border-teal-200">
                <Database className="w-3.5 h-3.5 text-teal-700" />
                cleanblog-test-db
              </span>
              <span className="text-xs font-medium text-stone-500">
                Mongoose Post Modeli (title, detail, dateCreated)
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
              Clean Blog 3. Bölüm Gönderi Listesi
            </h3>
            <p className="text-xs text-stone-600">
              Tüm gönderiler <strong className="text-stone-900 font-semibold underline decoration-teal-500">ENES ÖZTÜRK</strong> imzasıyla veritabanında tutulmakta ve listelenmektedir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200">
            <button
              onClick={onNavigateAddPost}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1.5 shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              Yeni Yazı Ekle
            </button>

            <button
              onClick={onResetPosts}
              title="Ödev için 3 başlangıç postunu geri yükler"
              className="px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              3 Posta Sıfırla
            </button>

            <button
              onClick={onOpenHomework}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Ödev Kodları
            </button>
          </div>
        </div>
      </div>

      {/* Post List Section */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-stone-300 border-t-teal-600 rounded-full animate-spin mb-4" />
          <p className="text-stone-600 text-sm font-medium">
            cleanblog-test-db veritabanından gönderiler yükleniyor...
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-xl p-8">
          <p className="text-stone-600 font-serif text-lg mb-3">Henüz hiçbir gönderi bulunamadı.</p>
          <p className="text-xs text-stone-500 mb-6">
            Ödev 9 gereği veritabanına 3 adet post eklemek için aşağıdaki butonu kullanabilirsiniz.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onResetPosts}
              className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-semibold hover:bg-teal-800 transition"
            >
              3 Varsayılan Postu Yükle
            </button>
            <button
              onClick={onNavigateAddPost}
              className="px-4 py-2 bg-stone-100 text-stone-800 rounded-lg text-sm font-semibold hover:bg-stone-200 transition"
            >
              Yeni Yazı Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-stone-200">
          {posts.map((post, index) => {
            const formattedDate = new Date(post.dateCreated).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article
                key={post._id || index}
                className="py-8 group transition-all duration-200 first:pt-2"
              >
                <div className="cursor-pointer" onClick={() => onSelectPost(post)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80">
                      Post #{posts.length - index}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {formattedDate}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="mt-3 text-stone-600 font-sans text-base leading-relaxed line-clamp-3">
                    {post.detail}
                  </p>
                </div>

                {/* Classic Clean Blog Meta line with ENES Öztürk signature */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-500 pt-1">
                  <p className="italic font-serif">
                    Posted by{' '}
                    <strong className="text-stone-900 not-italic font-sans font-semibold underline decoration-teal-500/80 decoration-2 underline-offset-2">
                      {post.author || 'ENES ÖZTÜRK'}
                    </strong>{' '}
                    on {formattedDate}
                  </p>

                  <button
                    onClick={() => onSelectPost(post)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Yazının Tamamını Oku</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Signature Banner at the bottom of homepage */}
      <div className="mt-14 p-6 bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-stone-700">
        <div className="text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400">
            Ödev 9 • Clean Blog 3. Bölüm
          </span>
          <h4 className="font-serif text-xl font-bold mt-1 text-white">
            İmza: ENES ÖZTÜRK
          </h4>
          <p className="text-xs text-stone-400 mt-0.5">
            Mongoose şeması, req.body middleware fonksiyonları ve 3 adet başlangıç dökümanı ile başarıyla tamamlandı.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateAddPost}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition"
          >
            Yeni Post Gönder (req.body)
          </button>
        </div>
      </div>
    </div>
  );
};
