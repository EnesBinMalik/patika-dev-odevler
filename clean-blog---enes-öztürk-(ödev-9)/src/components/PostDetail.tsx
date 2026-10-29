import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Trash2, Share2, Check, Clock } from 'lucide-react';
import { IPost } from '../types.ts';

interface PostDetailProps {
  post: IPost;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(post.dateCreated).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm('Bu blog gönderisini silmek istediğinizden emin misiniz?')) {
      setIsDeleting(true);
      await onDelete(post._id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Gönderilere Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition"
            title="Bağlantıyı Kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
            title="Gönderiyi Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Header Information */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1.5 font-medium text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <User className="w-3.5 h-3.5 text-teal-600" />
            Yazar: {post.author || 'Enes Öztürk'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            Yaklaşık 3 dk okuma
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight">
          {post.title}
        </h1>
      </div>

      {/* Main Post Detail Content */}
      <div className="prose prose-stone max-w-none text-stone-800 text-lg leading-relaxed font-sans font-light">
        {post.detail.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-6 whitespace-pre-line leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Classic Author Signature Box */}
      <div className="mt-14 p-6 sm:p-8 bg-stone-50 border border-stone-200 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-teal-500 text-teal-300 font-serif text-xl font-bold flex items-center justify-center shrink-0">
            EÖ
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                ENES ÖZTÜRK
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                Yazar & Geliştirici
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Bu yazı Patika.dev Node.js Clean Blog eğitimi 3. Bölüm (Ödev 9) kapsamında 
              <strong> cleanblog-test-db</strong> MongoDB veritabanında depolanan Mongoose Post modeli üzerinden sunulmaktadır.
            </p>
            <p className="text-xs text-stone-500 italic pt-1">
              "Temiz kod, temiz mimari ve temiz blog!" — Enes Öztürk
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold shadow-xs transition"
        >
          ← Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};
