/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, Code, FileText, User } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Uygulama & API Hakkında</h3>
              <p className="text-xs text-slate-500">Enes Öztürk İmzalı Paragraf Oluşturucu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Gereksinimler & Uyumluluk</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Başlangıçta 4 paragraf:</strong> Uygulama açılışında varsayılan 4 paragraf otomatik yüklenir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Input ile paragraf sayısı:</strong> Sayı girişi ve stepper butonları ile istenen sayı belirlenebilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>En az 1 paragraf:</strong> Minimum sınır 1 olarak kilitlenmiştir, geçersiz değerler engellenir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Dropdown seçimi:</strong> Text veya HTML formatı açılır menüden seçilebilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Enes Öztürk İmzası:</strong> Arayüzde, çıktılarda ve kaynak kodunda Enes Öztürk imzası yer alır.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono">
            <div className="text-slate-500 font-semibold mb-1">API Entegrasyon Bağlantısı:</div>
            <div className="text-slate-800 break-all select-all">
              https://baconipsum.com/api/?type=all-meat&amp;paras=4&amp;format=text
            </div>
            <div className="text-slate-800 break-all select-all mt-1">
              https://baconipsum.com/api/?type=all-meat&amp;paras=4&amp;format=html
            </div>
            <div className="text-slate-400 mt-2 text-[11px]">
              * Çevrimdışı ya da ağ gecikmelerinde anında devreye giren yüksek nitelikli yerel motor mevcuttur.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Enes Öztürk</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
