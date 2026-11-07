import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">ENES ÖZTÜRK</span>
          <span aria-hidden="true">·</span>
          <span>Bilimsel Hesap Makinesi (Java OOP)</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <span>Hazır Sınıflar Kullanılmadan Geliştirilmiştir</span>
          <span aria-hidden="true">·</span>
          <span>Java SE Standartları</span>
        </div>
      </div>
    </footer>
  );
};
