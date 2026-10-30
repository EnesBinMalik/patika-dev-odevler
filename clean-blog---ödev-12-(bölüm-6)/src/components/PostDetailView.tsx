import React, { useState } from 'react';
import { BlogPost, PostComment } from '../types/blog';
import { ArrowLeft, Edit2, Trash2, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface PostDetailViewProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string, title: string) => void;
  comments: PostComment[];
  onAddComment: (postId: string, name: string, comment: string) => void;
  authorAvatarUrl: string;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  onBack,
  onEdit,
  onDelete,
  comments,
  onAddComment,
  authorAvatarUrl
}) => {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const postComments = comments.filter((c) => c.postId === post.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    onAddComment(post.id, commentName.trim(), commentText.trim());
    setCommentName('');
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Top Navigation & Action Controls */}
      <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Yazılara Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Yazıyı Düzenle</span>
          </button>
          <button
            onClick={() => onDelete(post.id, post.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sil</span>
          </button>
        </div>
      </div>

      {/* Main Post Header */}
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
          {post.category}
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4" style={{ textWrap: 'balance' }}>
          {post.title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-6">
          {post.subtitle}
        </p>

        {/* Clean Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 pt-4 border-t border-slate-100">
          <span className="font-semibold text-slate-800">Yazar: {post.author}</span>
          <span aria-hidden="true">·</span>
          <span>Yayınlanma: {post.dateCreated}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      {/* Post Article Body */}
      <article className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-lg mb-12 space-y-6">
        {post.detail.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={index} className="pl-5 border-l-2 border-slate-300 italic text-slate-700 my-6">
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          } else if (paragraph.startsWith('```')) {
            const cleanCode = paragraph.replace(/```[a-z]*/g, '').trim();
            return (
              <pre key={index} className="p-4 bg-slate-900 text-slate-100 rounded-lg text-sm font-mono-code overflow-x-auto my-4">
                <code>{cleanCode}</code>
              </pre>
            );
          } else {
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          }
        })}
      </article>

      {/* Author Card & Signature */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={authorAvatarUrl}
            alt={post.author}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Yazar & Geliştirici
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-slate-900 mb-1">
              {post.author}
            </h3>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              Node.js, Express ve MongoDB mimarileri üzerine çalışan web geliştiricisi. Clean Blog projesini Heroku ve MongoDB Atlas ücretsiz servisleri üzerinde başarıyla canlıya almıştır.
            </p>
            <div className="text-xs text-slate-500 italic font-serif">
              "Temiz kod, güvenilir mimari ve kesintisiz bulut entegrasyonu." — Enes Öztürk
            </div>
          </div>
        </div>
      </section>

      {/* Reader Comments Section */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif-heading text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            <span>Yorumlar ({postComments.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Etkileşimli Ziyaretçi Paneli</span>
        </div>

        {/* Existing Comments */}
        <div className="space-y-4 mb-8">
          {postComments.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-lg text-center text-sm text-slate-500">
              Bu yazıya henüz yorum yapılmamış. İlk yorumu siz yapın!
            </div>
          ) : (
            postComments.map((comment) => (
              <div key={comment.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-800">{comment.name}</span>
                  <span className="text-xs text-slate-400">{comment.date}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{comment.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="bg-white border border-slate-200 rounded-lg p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Yorum Bırakın</h4>
          <div className="grid grid-cols-1 gap-3 mb-3">
            <input
              type="text"
              placeholder="Adınız Soyadınız"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
            <textarea
              rows={3}
              placeholder="Düşüncelerinizi paylaşın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>
          <div className="flex items-center justify-between">
            {commentSubmitted ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Yorumunuz başarıyla eklendi!</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Yorumunuz anında yayınlanır.</span>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yorum Gönder</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
