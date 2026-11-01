import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-stone-100/60 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
              Kitap Sıralayıcı
            </span>
            <span aria-hidden="true">·</span>
            <span>Java Comparable & TreeSet Mimarisi</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Tasarım & Geliştirme: <strong className="text-stone-800 dark:text-stone-200">Enes Öztürk</strong></span>
            <span aria-hidden="true">·</span>
            <span>Java 17+</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
