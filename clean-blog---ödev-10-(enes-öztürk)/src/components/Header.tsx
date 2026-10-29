import React from 'react';
import { BlogPost } from '../types/blog';

interface HeaderProps {
  type: 'home' | 'post' | 'about' | 'add' | 'homework';
  post?: BlogPost;
}

export const Header: React.FC<HeaderProps> = ({ type, post }) => {
  // Background images from generated assets
  const homeBg = '/src/assets/images/clean_blog_home_bg_1793282277135.jpg';
  // Common shared image for all individual posts as required: "(her bir post için ayrı image kullanmayacağız)"
  const postBg = '/src/assets/images/clean_blog_post_bg_1793282276494.jpg';
  const aboutBg = '/src/assets/images/clean_blog_about_bg_1793282277747.jpg';

  let bgImage = homeBg;
  let title = 'Clean Blog';
  let subtitle = 'A Blog Theme by Start Bootstrap / Node.js & EJS';
  let metaText: React.ReactNode = null;

  if (type === 'post' && post) {
    bgImage = postBg; // Shared image for ALL posts
    title = post.title;
    subtitle = post.subtitle || 'Clean Blog - Tekil Gönderi Detay Sayfası (/posts/:id)';
    metaText = (
      <p className="text-stone-200 text-sm md:text-base font-light italic mt-3 flex items-center justify-center gap-2 flex-wrap">
        <span>Yayınlayan:</span>
        <span className="font-semibold text-white underline decoration-amber-400 underline-offset-4">
          {post.author || 'Enes Öztürk'}
        </span>
        <span aria-hidden="true">·</span>
        <span>Tarih:</span>
        <span className="text-amber-300 font-mono text-sm">{post.dateCreated}</span>
      </p>
    );
  } else if (type === 'about') {
    bgImage = aboutBg;
    title = 'Hakkımda';
    subtitle = 'Clean Blog Projesi · Node.js Geliştiricisi Enes Öztürk';
  } else if (type === 'add') {
    bgImage = aboutBg;
    title = 'Yeni Post Ekle';
    subtitle = 'add_post.ejs Şablonu & Veri Tabanına Post Kaydetme';
  } else if (type === 'homework') {
    bgImage = homeBg;
    title = 'Ödev 10 - Clean Blog 4. Bölüm';
    subtitle = 'Tekil Post Sayfası (/posts/:id), index.ejs ve post.ejs Entegrasyonu';
  } else {
    // Home
    metaText = (
      <div className="mt-4 flex items-center justify-center gap-2 text-xs md:text-sm text-stone-300 font-sans">
        <span>Geliştirici:</span>
        <span className="text-amber-300 font-medium">Enes Öztürk</span>
        <span aria-hidden="true">·</span>
        <span>Bölüm 4: Tekil Post Sayfası</span>
      </div>
    );
  }

  return (
    <header className="relative w-full overflow-hidden bg-stone-900 py-20 md:py-28 lg:py-32 select-none shadow-md">
      {/* Background Image with Scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      {/* Measured Dark Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-900/65 to-stone-950/85" />

      {/* Hero Content */}
      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-sm leading-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <h2 className="mt-3 md:mt-4 text-base sm:text-lg md:text-xl font-light text-stone-200 tracking-wide max-w-2xl mx-auto leading-relaxed text-balance">
            {subtitle}
          </h2>
        )}
        {metaText}

        {type === 'post' && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-stone-900/80 border border-stone-700/80 rounded text-xs text-stone-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Ödev 10 Kuralı: Tüm tekil postlar için ortak header görseli kullanılmaktadır</span>
          </div>
        )}
      </div>
    </header>
  );
};
