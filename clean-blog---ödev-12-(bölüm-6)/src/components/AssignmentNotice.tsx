import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export const AssignmentNotice: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6 mb-8 text-slate-800 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-slate-200/80 rounded-md text-slate-700 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
              Ödev 12 · Clean Blog Projesi 6. Bölüm
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              Heroku & MongoDB Atlas Entegrasyonu
            </div>
          </div>
          
          <p className="text-sm text-slate-700 leading-relaxed font-sans mb-3">
            <strong>Eğitmen & Müfredat Notu:</strong> Uygulamamızda sayfalama (pagination) ve görsel yükleme (image upload) işlemlerini yapmadık. Sonraki projemizde de bu özellikleri kullanacağız.
          </p>

          <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Hazırlayan & İmzalayan: <strong>Enes Öztürk</strong></span>
            </div>
            <div>
              Platform: <span>Node.js / Express · Mongoose · MongoDB Atlas · Heroku</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
