import React, { useState } from 'react';
import { BlogPost } from '../types';
import { Calendar, User, Clock, Edit3, Trash2, ArrowLeft, Code2, CheckCircle2, Share2, Heart, Copy, Check } from 'lucide-react';

interface PostDetailViewProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onGoToCode: (fileId?: string) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  onBack,
  onEdit,
  onDelete,
  onGoToCode
}) => {
  const [showCodeSnippet, setShowCodeSnippet] = useState(true);
  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 12);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const ejsSnippet = `<!-- ======================================================== -->
<!-- ÖDEV 11 GEREKSİNİMİ 1: post.ejs UPDATE ve DELETE BUTONLARI -->
<!-- İmzalı: Enes Öztürk                                      -->
<!-- ======================================================== -->
<div class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
  <!-- 1. UPDATE BUTONU: Düzenleme sayfasına yönlendirir -->
  <a href="/posts/edit/<%= post._id %>" class="btn btn-warning text-white font-weight-bold px-4 py-2 shadow-sm">
    <i class="fas fa-edit mr-2"></i> UPDATE (GÜNCELLE)
  </a>

  <!-- 2. DELETE BUTONU: method-override (?_method=DELETE) ile postController.deletePost'a istek atar -->
  <a href="/posts/<%= post._id %>?_method=DELETE" 
     class="btn btn-danger font-weight-bold px-4 py-2 shadow-sm"
     onclick="return confirm('Bu yazıyı silmek istediğinizden emin misiniz? (Enes Öztürk - Clean Blog)')">
    <i class="fas fa-trash-alt mr-2"></i> DELETE (SİL)
  </a>
</div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ejsSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar Navigation */}
      <div className="bg-[#1f2428] text-gray-300 py-3 px-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            &larr; Tüm Yazılara Dön (Anasayfa)
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-400">
              Görünüm: <span className="font-mono text-emerald-400">views/post.ejs</span>
            </span>
            <button
              onClick={() => onGoToCode('post-ejs')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <Code2 className="w-3.5 h-3.5" />
              post.ejs Kaynak Kodu
            </button>
          </div>
        </div>
      </div>

      {/* Post Masthead (Clean Blog Header) */}
      <header
        className="relative py-24 md:py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('${post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80'}')`
        }}
      >
        <div className="absolute inset-0 bg-[#212529]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="mb-4">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {post.category || 'Clean Blog'} &bull; Ödev 11
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>

          {post.subtitle && (
            <h2 className="text-lg sm:text-xl font-light text-gray-200 mb-6 leading-relaxed">
              {post.subtitle}
            </h2>
          )}

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-300 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                EÖ
              </div>
              <span className="font-medium text-white">
                Yayınlayan: <span className="underline decoration-emerald-400">{post.author || 'Enes Öztürk'}</span>
              </span>
            </div>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {new Date(post.dateCreated).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.readTimeMinutes || 4} dakika okuma süresi
            </span>

            <span className="text-emerald-400 font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded">
              ID: {post._id.slice(-6)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Post Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none text-[#212529] font-sans">
          {post.detail.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-serif font-bold text-gray-900 mt-8 mb-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('```')) {
              const codeClean = paragraph.replace(/```[a-z]*\n?/g, '').trim();
              return (
                <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono my-4 overflow-x-auto border border-gray-800">
                  <code>{codeClean}</code>
                </pre>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(Boolean);
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5 my-4 text-gray-700">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 font-normal">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Social / Engagement bar */}
        <div className="flex items-center justify-between py-4 my-8 border-y border-gray-200 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              hasLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likesCount} Beğeni</span>
          </button>

          <span className="text-xs text-gray-500 italic">
            Yazar: <strong className="text-gray-800">Enes Öztürk</strong> &bull; Clean Blog Projesi
          </span>
        </div>

        {/* ======================================================================= */}
        {/* ÖDEV 11 GEREKSİNİMİ 1: post.ejs UPDATE VE DELETE BUTONLARI               */}
        {/* ======================================================================= */}
        <section className="bg-gradient-to-br from-amber-50/50 via-white to-rose-50/40 border-2 border-emerald-600/40 rounded-xl p-6 sm:p-8 shadow-sm my-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-gray-200">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ödev 11 &bull; 1. Madde Gereksinimi
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900">
                post.ejs UPDATE ve DELETE Butonları
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Aşağıdaki butonlar ödev şartnamesinde belirtilen <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-emerald-800">views/post.ejs</code> şablonu içerisindeki aktif butonlardır.
              </p>
            </div>

            <button
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors self-start sm:self-auto"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showCodeSnippet ? 'EJS Kodunu Gizle' : 'EJS Kodunu Göster'}
            </button>
          </div>

          {/* Action Buttons: UPDATE and DELETE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2">
            {/* UPDATE BUTTON */}
            <div className="flex-1">
              <button
                onClick={() => onEdit(post)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm tracking-wide group"
                title="Yazıyı Düzenle (GET /posts/edit/:id -> edit.ejs)"
              >
                <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>UPDATE (YAZIYI DÜZENLE)</span>
              </button>
              <p className="text-[11px] text-gray-500 mt-1.5 text-center sm:text-left">
                Rotası: <code className="text-amber-800 font-mono bg-amber-50 px-1 rounded">/posts/edit/{post._id.slice(-6)}</code> &rarr; edit.ejs
              </p>
            </div>

            <div className="hidden sm:block text-gray-300 font-serif font-light text-sm">
              veya
            </div>

            {/* DELETE BUTTON */}
            <div className="flex-1">
              <button
                onClick={() => onDelete(post)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm tracking-wide group"
                title="Yazıyı Sil (DELETE /posts/:id?_method=DELETE)"
              >
                <Trash2 className="w-4 h-4 group-hover:shake transition-transform" />
                <span>DELETE (YAZIYI SİL)</span>
              </button>
              <p className="text-[11px] text-gray-500 mt-1.5 text-center sm:text-left">
                İstek: <code className="text-rose-800 font-mono bg-rose-50 px-1 rounded">/posts/{post._id.slice(-6)}?_method=DELETE</code>
              </p>
            </div>
          </div>

          {/* EJS Snippet Viewer */}
          {showCodeSnippet && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-semibold flex items-center gap-1.5 text-gray-700">
                  <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                  views/post.ejs Şablonundaki Gerçek Kod Parçası:
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-[#1e1e1e] text-gray-200 text-xs font-mono p-4">
                <pre className="overflow-x-auto leading-relaxed">
                  <code>{ejsSnippet}</code>
                </pre>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  💡 <strong>Nasıl Çalışır?</strong> DELETE butonu <code className="text-emerald-700 font-mono">_method=DELETE</code> query parametresiyle Express'teki <code className="text-emerald-700 font-mono">method-override</code> modülünü tetikler ve silme işlemini gerçekleştirir.
                </span>
                <button
                  onClick={() => onGoToCode('post-controller')}
                  className="text-emerald-700 hover:underline font-medium ml-2 whitespace-nowrap"
                >
                  postController.js &rarr;
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Back and Other Posts button */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Gönderilere Dön
          </button>

          <span className="text-xs text-gray-400 font-serif italic">
            Clean Blog &bull; Enes Öztürk İmzalı
          </span>
        </div>
      </main>
    </div>
  );
};
