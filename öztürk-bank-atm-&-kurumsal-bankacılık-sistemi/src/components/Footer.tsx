/**
 * Footer - Öztürk Bank Alt Bilgi & Mimari İmzası
 * Sistem Baş Mimarı: Enes Öztürk
 */

import React from 'react';
import { ShieldCheck, Heart, Terminal, Database, Code2, Download } from 'lucide-react';
import { FileIOService } from '../core/services/FileIOService';

interface FooterProps {
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitecture }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
              ÖB
            </div>
            <div>
              <p className="font-extrabold text-slate-200 text-sm">
                ÖZTÜRK BANK T.A.Ş. — ATM & KURUMSAL BANKACILIK SİSTEMİ
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                5411 Sayılı Bankacılık Kanunu ve PCI-DSS Standartlarına Uygun Olarak Tasarlanmıştır.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <button
              onClick={() => FileIOService.exportDatabaseBackup()}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Veritabanı Yedeği (.JSON)</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onOpenArchitecture}
              className="hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>S.O.L.I.D & Spring Boot</span>
            </button>
          </div>
        </div>

        {/* Baş Mimarlık & İmzası */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">
              Proje Mimarı & Baş Yazılım Mühendisi: <strong className="text-amber-400 font-bold tracking-wide">ENES ÖZTÜRK</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">Java 21 / Spring Boot 3</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">React 19 / TS</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">OOP & Stream API</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">S.O.L.I.D</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400">Clean Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
