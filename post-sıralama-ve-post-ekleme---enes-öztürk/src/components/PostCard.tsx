import React from 'react';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, User, Trash2, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
  onDelete: (id: number) => void;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, onDelete, index }) => {
  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Zero-Pill Metadata row: Clean unboxed text with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
            {post.category}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{post.readTime}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-400 font-mono text-[11px]">ID: #{post.id}</span>
        </div>

        {/* Post Title */}
        <h3
          onClick={() => onSelect(post)}
          className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2.5"
        >
          {post.title}
        </h3>

        {/* Post Summary */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {post.summary}
        </p>

        {/* Tags (Zero-Pill: subtle text markers) */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-4">
            <span className="text-slate-400 font-medium">Etiketler:</span>
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-slate-600">
                #{t}
                {idx < post.tags.length - 1 && <span className="text-slate-300 ml-2">,</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        {/* Author / Signature */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {post.author.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-700">
            {post.author}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Postu Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelect(post)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer group-hover:translate-x-0.5 duration-150"
          >
            <span>Oku</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
