/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, Copy, Check, Calendar, User, Code2, Server, Download } from 'lucide-react';
import { README_MD_SNIPPET } from '../data/codeTemplates';

export const SubmissionCard: React.FC = () => {
  const [copiedMd, setCopiedMd] = useState(false);

  const handleCopyMd = () => {
    navigator.clipboard.writeText(README_MD_SNIPPET);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([README_MD_SNIPPET], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Official Certificate Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          {/* Badge & Seal */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest shadow-inner">
            <Award className="w-4 h-4" />
            Ödev 5 Teslim ve Doğrulama Belgesi
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Node.js Web Sunucusu Ödevi
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Patika.dev / Kodluyoruz Node.js Temelleri Dersi
            </p>
          </div>

          {/* Student Profile Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-left shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  EÖ
                </div>
                <div>
                  <div className="text-xs text-slate-400">Geliştirici & Öğrenci</div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    Enes Öztürk
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">Durum</div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Tamamlandı & Onaylandı
                </span>
              </div>
            </div>

            {/* Assignment Specs Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Metot:</strong> http.createServer</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Port:</strong> 5000 (localhost:5000)</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Sayfalar:</strong> index, hakkimda, iletisim</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Başlıklar:</strong> &lt;h2&gt;xxx sayfasına hoşgeldiniz&lt;/h2&gt;</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-300 sm:col-span-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>İmza:</strong> Kod, sayfa çıktısı ve sunucu konsolunda Enes Öztürk imzası</span>
              </div>
            </div>
          </div>

          {/* Signature Stamp */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Teslim Tarihi: Ekim 2026</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <User className="w-4 h-4" />
              <span>İmza: Enes Öztürk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Markdown Export for GitHub / Patika */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              GitHub & Patika Teslim Metni (README.md)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bu metni doğrudan GitHub reponuza veya ödev yükleme formuna yapıştırabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMd}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Metni Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadReadme}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>README.md İndir</span>
            </button>
          </div>
        </div>

        {/* Readme preview */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-64 overflow-y-auto leading-relaxed">
          <pre className="whitespace-pre-wrap">{README_MD_SNIPPET}</pre>
        </div>
      </div>
    </div>
  );
};
