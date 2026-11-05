import React from 'react';
import { UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">BookStore API</span>
          <span>·</span>
          <span>Model Kullanımı Ödevi</span>
          <span>·</span>
          <span className="text-slate-700 font-medium">Hazırlayan: Enes Öztürk</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#genel-bakis" className="hover:text-slate-900 transition-colors">
            Genel Bakış
          </a>
          <a href="#modeller" className="hover:text-slate-900 transition-colors">
            Model Mimarisi
          </a>
          <a href="#interaktif-test" className="hover:text-slate-900 transition-colors">
            İnteraktif Test
          </a>
          <a href="#kod-cozumu" className="hover:text-slate-900 transition-colors">
            C# Kodları
          </a>
          <a href="#rapor" className="hover:text-slate-900 transition-colors">
            Rapor
          </a>
        </div>
      </div>
    </footer>
  );
};
