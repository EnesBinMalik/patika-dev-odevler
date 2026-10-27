import React from 'react';
import { Activity, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenDoc: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDoc }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center font-bold text-xs">
              EÖ
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                COVID-19 Canlı Takip Paneli
              </div>
              <div className="text-xs text-slate-500">
                Geliştirici & Tasarım: <strong className="text-slate-800">Enes Öztürk</strong>
              </div>
            </div>
          </div>

          {/* Links & Documentation */}
          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <button
              onClick={onOpenDoc}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              API Dokümantasyonu
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href="https://disease.sh"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Veri Kaynağı: disease.sh</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">Ekim 2026</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            Bu çalışma Dünya Sağlık Örgütü (DSÖ) ve uluslararası epidemiyolojik raporlama standartlarına uygun geliştirilmiştir.
          </p>
          <p className="shrink-0 flex items-center gap-1">
            Enes Öztürk imzalı çalışma
          </p>
        </div>
      </div>
    </footer>
  );
};
