/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 */

import React from 'react';
import { ShieldCheck, Heart, Terminal, Database, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/60">
          {/* Brand & Dev */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Online CV & İnsan Kaynakları Portalı
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bu uygulama, <strong>Enes Öztürk</strong> tarafından S.O.L.I.D ilkeleri, Nesne Yönelimli Programlama (OOP), Stream API ve Clean Code standartlarına tam uyumlu olarak geliştirilmiştir.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Geliştirici: Enes Öztürk
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="space-y-2 text-xs">
            <h4 className="text-white font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Mimari & Teknolojik Standartlar
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>OOP & S.O.L.I.D:</strong> Kalıtım, Arayüzler, Polimorfizm, DIP</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span><strong>Java Stream API & Optional:</strong> Declarative veri filtreleme</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span><strong>Design Patterns:</strong> Builder, Factory, Repository, Observer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span><strong>Spring Data İlişkileri:</strong> Admin(1) - User(N) (@ManyToOne)</span>
              </li>
            </ul>
          </div>

          {/* Security & Features */}
          <div className="space-y-2 text-xs">
            <h4 className="text-white font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Güvenlik & Veri Bütünlüğü
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span><strong>3 Hatalı Giriş Kilidi:</strong> Otomatik hesap bloke mekanizması</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong>Maskelenmiş Şifreler:</strong> Salted Hash ile güvenli depolama</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>İkili Depolama:</strong> Veritabanı ve I/O Dosya yedekleme</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span><strong>KVKK Uyumu:</strong> CV saklama süresi denetimi & takip</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} Online CV & İK Portalı. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-1">
            <span>Enes Öztürk imzasıyla hazırlandı</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
