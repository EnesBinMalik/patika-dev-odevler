import React from 'react';
import { Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400 font-medium">
            PHP Dizi Fonksiyonları Çözümü · <strong>Enes Öztürk</strong> İmzalıdır
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>array_filter()</span>
          <span>·</span>
          <span>array_rand()</span>
          <span>·</span>
          <span>array_map()</span>
        </div>

        <div>
          <span>PHP 7.4+ &amp; PHP 8.x Uyumlu</span>
        </div>
      </div>
    </footer>
  );
};
