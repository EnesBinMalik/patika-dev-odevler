import React from 'react';
import { BlogPost } from '../types/blog';
import { Edit2, Trash2, ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string, title: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <article className="group py-7 sm:py-8 border-b border-slate-200 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 cursor-pointer" onClick={() => onSelect(post)}>
          {/* Post Title */}
          <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-cyan-800 transition-colors tracking-tight leading-snug mb-2 flex items-start gap-1">
            <span>{post.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-800 shrink-0 mt-1" />
          </h2>

          {/* Post Subtitle / Excerpt */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3 line-clamp-2 font-light">
            {post.subtitle}
          </p>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans">
            <span className="font-medium text-slate-700">Yazar: {post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{post.dateCreated}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 font-medium">{post.category}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:self-start shrink-0 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
            title="Yazıyı Düzenle"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id, post.title);
            }}
            title="Yazıyı Sil"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
