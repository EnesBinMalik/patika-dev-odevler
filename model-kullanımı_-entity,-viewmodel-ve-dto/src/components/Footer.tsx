import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenReport: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReport, onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Model Mimarisi · Ödev Çözümü
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Entity, ViewModel ve DTO kavramlarının mimari ayrımı, veri akış simülatörü ve güvenlik analizi.
            </p>
          </div>

          {/* Signature Badge */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left md:text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Ödev Sahibi & İmza:</div>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
              Enes Öztürk
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Yazılım Geliştirme & Sistem Mimarisi
            </div>
          </div>
        </div>

        {/* Bottom Bar with zero-pill metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Enes Öztürk</span>
            <span aria-hidden="true">·</span>
            <span>Clean Architecture & MVC İlkeleri</span>
            <span aria-hidden="true">·</span>
            <span>Ödev Çözüm Rehberi</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('concepts')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Kavramlar
            </button>
            <button
              onClick={() => onNavigate('pipeline')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Simülatör
            </button>
            <button
              onClick={() => onNavigate('security')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Güvenlik
            </button>
            <button
              onClick={onOpenReport}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Raporu Yazdır
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
