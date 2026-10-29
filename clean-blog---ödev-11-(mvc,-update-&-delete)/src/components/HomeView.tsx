import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types';
import { Search, Calendar, User, Clock, Edit3, Trash2, ArrowRight, Sparkles, Filter, Code, Eye } from 'lucide-react';

interface HomeViewProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (post: BlogPost) => void;
  onAddNewPost: () => void;
  onGoToCode: () => void;
  onOpenChecklist: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  posts,
  onSelectPost,
  onEditPost,
  onDeletePost,
  onAddNewPost,
  onGoToCode,
  onOpenChecklist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.detail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead Header (Classic Clean Blog Hero) */}
      <header
        className="relative py-28 md:py-36 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-[#212529]/75 backdrop-blur-[1px]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Ödev 11 • Clean Blog Projesi 5. Bölüm
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight mb-4 drop-shadow-sm">
            Clean Blog
          </h1>

          <p className="text-lg sm:text-xl font-light text-gray-200 max-w-2xl mx-auto mb-6">
            Model-View-Controller (MVC) Mimarisi, post.ejs Üzerinde UPDATE & DELETE İşlemleri
          </p>

          <div className="inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 backdrop-blur-md">
            <p className="text-xs text-gray-300">
              Proje Geliştiricisi: <span className="font-semibold text-white">Enes Öztürk</span> &bull; <span className="text-emerald-400">Patika.dev Node.js</span>
            </p>
          </div>
        </div>
      </header>

      {/* Assignment 11 Announcement Bar */}
      <div className="bg-emerald-900/10 border-b border-emerald-500/20 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              ÖDEV 11 GÖREVLERİ
            </span>
            <span>1. post.ejs UPDATE & DELETE &bull; 2. Post Güncelleme &bull; 3. Post Silme &bull; 4. MVC Mimarisi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChecklist}
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1"
            >
              Kriterleri Gör
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onGoToCode}
              className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              Kaynak Kodları İncele
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter & Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Search and Category Filter */}
        <div className="mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Clean Blog yazılarında ara (başlık, içerik veya etiket)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-500 font-medium flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filtrele:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#212529] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tümü ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Post List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8">
            <h3 className="text-lg font-serif font-bold text-gray-800 mb-2">Eşleşen Yazı Bulunamadı</h3>
            <p className="text-sm text-gray-500 mb-6">
              Arama kriterlerinizi değiştirebilir veya yeni bir post ekleyebilirsiniz.
            </p>
            <button
              onClick={onAddNewPost}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              + Yeni Post Oluştur (add_post.ejs)
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <article key={post._id} className="py-8 group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Category Tag */}
                    <div className="mb-2">
                      <span className="inline-block text-[11px] font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {post.category || 'Genel'}
                      </span>
                    </div>

                    {/* Post Title - Clicking views post.ejs */}
                    <h2
                      onClick={() => onSelectPost(post)}
                      className="text-2xl sm:text-3xl font-serif font-bold text-[#212529] group-hover:text-emerald-700 cursor-pointer transition-colors leading-tight mb-2"
                    >
                      {post.title}
                    </h2>

                    {/* Post Subtitle */}
                    {post.subtitle && (
                      <h3
                        onClick={() => onSelectPost(post)}
                        className="text-base text-gray-600 font-light cursor-pointer mb-3 leading-relaxed"
                      >
                        {post.subtitle}
                      </h3>
                    )}

                    {/* Meta info: Author, Date, Reading time */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1 font-medium text-gray-800">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        {post.author || 'Enes Öztürk'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(post.dateCreated).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {post.readTimeMinutes || 4} dk okuma
                      </span>
                    </div>

                    {/* Quick Excerpt */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed font-sans">
                      {post.detail}
                    </p>

                    {/* Action Bar for Ödev 11: Direct Post Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => onSelectPost(post)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Yazıyı Oku (post.ejs)
                      </button>

                      <button
                        onClick={() => onEditPost(post)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                        title="Ödev 11: UPDATE butonu & edit.ejs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        UPDATE (Güncelle)
                      </button>

                      <button
                        onClick={() => onDeletePost(post)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                        title="Ödev 11: DELETE butonu & method-override"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        DELETE (Sil)
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  {post.imageUrl && (
                    <div 
                      onClick={() => onSelectPost(post)}
                      className="w-full md:w-48 h-36 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-gray-200 group-hover:shadow-md transition-shadow"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Older Posts Pagination Button (Clean Blog Standard) */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-6">
          <p className="text-xs text-gray-500">
            Toplam <span className="font-semibold text-gray-800">{posts.length}</span> blog yazısı &bull; Enes Öztürk MVC Koleksiyonu
          </p>

          <button
            onClick={onAddNewPost}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#212529] hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            + Yeni Yazı Ekle
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
