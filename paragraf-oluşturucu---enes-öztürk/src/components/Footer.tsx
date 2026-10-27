/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Code2, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Signature Statement */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Paragraf Oluşturucu
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-sm font-medium text-indigo-600">
                Enes Öztürk İmzalı
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Frontend projeleri, tasarım taslakları ve içerik modellemeleri için text ve HTML formatında hızlı paragraf üretici aracı.
            </p>
          </div>

          {/* Signature badge & rights */}
          <div className="flex flex-col items-center md:items-end text-xs text-slate-500 gap-1.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span>Geliştirici & Tasarımcı:</span>
              <span className="text-slate-900 font-bold px-2 py-0.5 rounded bg-slate-100">
                Enes Öztürk
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Bacon Ipsum API & Yerel Motor</span>
              <span>·</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        {/* Clean divider and specification checklist */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Başlangıç: 4 Paragraf</span>
            <span>·</span>
            <span>Min: 1 Paragraf</span>
            <span>·</span>
            <span>Dropdown: Text / HTML</span>
          </div>
          <div>
            Tasarım ve uygulama Enes Öztürk tarafından hazırlanmıştır.
          </div>
        </div>
      </div>
    </footer>
  );
};
