import React from 'react';
import { Database, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Developer Signature */}
          <div className="text-center md:text-left">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Java Araç Kiralama Portalı & Veritabanı Sistemi
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tasarım, Algoritma ve Veritabanı Mimarisi:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">Enes Öztürk</strong>
            </div>
          </div>

          {/* Specs Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>İlişkisel Veritabanı (RDBMS)</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>24 Saat İptal Kuralı</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span>Çakışmasız Takvim Doğrulaması</span>
          </div>

          {/* Copyright & Signature */}
          <div className="text-xs text-slate-400 text-center md:text-right">
            © 2026 Tüm Hakları Saklıdır · Enes Öztürk
          </div>
        </div>
      </div>
    </footer>
  );
};
