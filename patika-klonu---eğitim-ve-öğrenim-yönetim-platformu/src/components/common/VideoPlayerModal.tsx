import React from 'react';
import { ExternalLink, Play, Clock, BookOpen } from 'lucide-react';
import { Modal } from './Modal';
import { Content } from '../../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
  courseTitle?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  content,
  courseTitle,
}) => {
  if (!content) return null;

  // Extract YouTube ID if valid
  const getEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
      }
    } catch {
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(content.youtubeUrl);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
      subtitle={courseTitle || 'Ders İçeriği & Eğitim Videosu'}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Responsive Video Container */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={content.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">YouTube Eğitim Linki</h4>
              <p className="text-sm text-slate-400 max-w-md">
                Bu içerik YouTube üzerindeki video dersine yönlendirir. Aşağıdaki butona tıklayarak videoyu yeni sekmede açabilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Content details and direct link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {content.durationMinutes} Dakika
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Sıra: {content.order}
            </span>
          </div>

          <a
            href={content.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4" />
            YouTube'da Aç (Doğrudan Link)
          </a>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">
          <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            İçerik Açıklaması
          </h5>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {content.description}
          </p>
        </div>
      </div>
    </Modal>
  );
};
