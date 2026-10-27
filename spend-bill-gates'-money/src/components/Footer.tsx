import React from 'react';
import { Heart, Github, Award } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isTr = language === 'tr';

  return (
    <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 text-slate-600">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold text-base mb-1">
            <span className="w-5 h-5 rounded bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
              $
            </span>
            <span>{isTr ? "Spend Bill Gates' Money Klonu" : "Spend Bill Gates' Money Clone"}</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            {isTr
              ? 'Ödev 2 gereksinimlerine uygun olarak geliştirilmiş tam teşekküllü web uygulaması.'
              : 'Built in accordance with Assignment 2 requirements.'}
          </p>
        </div>

        {/* Center / Signature */}
        <div className="flex flex-col items-center md:items-end">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Geliştirici: Enes Öztürk' : 'Developer: Enes Öztürk'}</span>
          </div>
          <span className="text-xs text-slate-400 mt-1">
            {isTr ? 'Ödev 2 İmzalı Teslimat' : 'Assignment 2 Submission'} · 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
