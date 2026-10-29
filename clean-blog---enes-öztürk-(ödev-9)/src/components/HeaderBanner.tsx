import React from 'react';
import { Calendar, User, Database, CheckCircle2 } from 'lucide-react';
import { IPost } from '../types.ts';

interface HeaderBannerProps {
  view: 'home' | 'add_post' | 'about' | 'contact' | 'post_detail';
  activePost?: IPost | null;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ view, activePost }) => {
  const getBannerDetails = () => {
    switch (view) {
      case 'add_post':
        return {
          title: 'Yeni Yazı Ekle',
          subtitle: 'Add New Post • req.body ve Mongoose Post.create() Entegrasyonu',
          meta: null,
          bgImage:
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
        };
      case 'about':
        return {
          title: 'Hakkımda',
          subtitle: 'Bu Benim Hikayem • Enes Öztürk & Clean Blog Projesi',
          meta: null,
          bgImage:
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
        };
      case 'contact':
        return {
          title: 'İletişim',
          subtitle: 'Sorularınız mı var? Bana bir mesaj gönderin.',
          meta: null,
          bgImage:
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
        };
      case 'post_detail':
        return {
          title: activePost?.title || 'Gönderi Detayı',
          subtitle: 'Clean Blog Gönderisi • Mongoose Post Modeli Dökümanı',
          meta: activePost ? (
            <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300 text-sm font-sans mt-4">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-400" />
                Yazar: <strong className="text-white underline decoration-teal-400 font-semibold">{activePost.author || 'Enes Öztürk'}</strong>
              </span>
              <span className="text-stone-500">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" />
                {new Date(activePost.dateCreated).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          ) : null,
          bgImage:
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80',
        };
      case 'home':
      default:
        return {
          title: 'Clean Blog',
          subtitle: 'Patika.dev Node.js Projesi • 3. Bölüm (Ödev 9)',
          meta: (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-teal-300 border border-teal-500/30 backdrop-blur-sm">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                cleanblog-test-db
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-stone-200 border border-stone-600/40 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                İmza: ENES ÖZTÜRK
              </span>
            </div>
          ),
          bgImage:
            'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80',
        };
    }
  };

  const details = getBannerDetails();

  return (
    <header className="relative pt-24 pb-20 md:pt-32 md:pb-28 text-white overflow-hidden bg-stone-900">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{
          backgroundImage: `url('${details.bgImage}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/75 to-stone-950/90 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-50 drop-shadow-md leading-tight">
          {details.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto drop-shadow-sm">
          {details.subtitle}
        </p>
        {details.meta}
      </div>
    </header>
  );
};
