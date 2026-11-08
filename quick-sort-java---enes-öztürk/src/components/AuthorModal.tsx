import React, { useState } from 'react';
import { X, Award, Check, Copy, Code2, Heart, Sparkles, Terminal } from 'lucide-react';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const signatureSnippet = `/**
 * Quick Sort (Hızlı Sıralama) Algoritması
 *
 * @author Enes Öztürk
 * @version 1.0.0
 * @since 2026
 *
 * "Verimli algoritmalar, zarif kod mimarileriyle hayat bulur."
 */`;

  const handleCopySignature = () => {
    navigator.clipboard.writeText(signatureSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar Seal */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg ring-4 ring-amber-400/20">
            EÖ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-100">Enes Öztürk</h3>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              Yazılım Geliştirici &middot; Java &amp; Algoritma Tasarımı
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="space-y-4 text-sm text-slate-300">
          <p className="text-xs leading-relaxed text-slate-400">
            Bu Java sınıfı ve interaktif Quick Sort ortamı, <strong>Enes Öztürk</strong> imzasıyla hazırlanmıştır.
            Kod yapısı; akademik standartlar, modern Java (17/21) sözdizimi, Hoare &amp; Lomuto bölümleme
            şemaları ve üçlü medyan (Median-of-Three) pivot optimizasyonlarını içerecek şekilde titizlikle tasarlanmıştır.
          </p>

          {/* Javadoc signature box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 relative group">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-2 pb-1.5 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Resmi İmza Bloğu (Javadoc Signature)</span>
              </div>
              <button
                onClick={handleCopySignature}
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-amber-300/90 leading-relaxed overflow-x-auto">
              {signatureSnippet}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs">
              <span className="text-slate-500 block mb-0.5">Uygulanan Dil</span>
              <span className="text-slate-200 font-semibold">Java 17+ / 21 LTS</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs">
              <span className="text-slate-500 block mb-0.5">Lisans &amp; Kullanım</span>
              <span className="text-slate-200 font-semibold">Açık Kaynak (MIT / Free)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Enes Öztürk &middot; 2026</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Anladım &amp; Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
