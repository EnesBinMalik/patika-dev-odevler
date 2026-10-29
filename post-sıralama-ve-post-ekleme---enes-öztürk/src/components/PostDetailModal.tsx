import React from 'react';
import { X, Calendar, Clock, User, Bookmark, Share2, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface PostDetailModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          {/* Zero-Pill clean metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">ID: #{post.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">
            {post.title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center gap-3 py-3 border-y border-slate-100">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span>{post.author}</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1 font-medium">
                  Yazar & İmzalı
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Yayın Tarihi: {post.date}
              </div>
            </div>
          </div>

          {/* Summary Quote Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 italic leading-relaxed">
            "{post.summary}"
          </div>

          {/* Main Content */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Etiketler:</span>
              {post.tags.map((t, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            enes-ozturk-blog // post-{post.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
