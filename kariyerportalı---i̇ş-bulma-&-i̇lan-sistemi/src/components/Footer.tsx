/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: Footer
 * Clean architectural disclaimer, author signature and engineering credentials
 */

import React from 'react';
import { ShieldCheck, Award, Code, Database, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenArchitectureModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitectureModal }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              KariyerPortalı & İstihdam Platformu
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Katmanlı Mimari (Controller ➔ Service ➔ Repository ➔ Entity)</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <button
              onClick={onOpenArchitectureModal}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              <span>S.O.L.I.D & Clean Code Raporu</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="font-medium">
              Geliştirici & Sistem Mimarı:{' '}
              <strong className="text-slate-900 dark:text-white font-bold tracking-wide">
                Enes Öztürk
              </strong>
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Spring Data JPA / @OneToMany - @ManyToOne</span>
            <span aria-hidden="true">·</span>
            <span>BCrypt Password Masking & 3-Attempt Lockout</span>
            <span aria-hidden="true">·</span>
            <span>Stream API & Monadic Optional</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} KariyerPortalı Projesi · Tüm Hakları Saklıdır</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
