import React from 'react';
import { Sprout, UserCheck, Heart, ExternalLink, GitBranch } from 'lucide-react';
import { AUTHOR_NAME, KAGGLE_COMPETITION_URL } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-10 px-4 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-200 font-semibold">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Elma Ağaçlarındaki Yaprak Hastalıklarının Belirlenmesi</span>
          </div>
          <p className="text-slate-400 text-[11px] max-w-xl">
            Tarımsal fungisit kullanımını optimize etmek, dirençli mantar türlerinin oluşmasını önlemek ve 
            rekolte kaybını minimize etmek amacıyla geliştirilmiş derin öğrenme karar destek sistemi.
          </p>
        </div>

        {/* Signature Box */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Hazırlayan & Araştırmacı:</span>
            <strong className="text-emerald-400 font-bold">{AUTHOR_NAME}</strong>
          </div>
          <div className="text-[11px] text-slate-400">
            İletişim: <span className="text-slate-300 font-mono">enesbino38@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px]">
        <span className="text-slate-400">
          Kaggle Plant Pathology 2020 - FGVC7 Challenge © {new Date().getFullYear()} Enes Öztürk
        </span>
        <div className="flex items-center gap-4">
          <a
            href={KAGGLE_COMPETITION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <span>Kaggle Yarışması</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <GitBranch className="w-3 h-3" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
