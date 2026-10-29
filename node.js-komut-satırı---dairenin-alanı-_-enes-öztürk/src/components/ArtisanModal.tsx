import React from 'react';
import { X, Award, Sparkles, Check, Heart, Code2, Terminal } from 'lucide-react';

interface ArtisanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanModal: React.FC<ArtisanModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Border Decoration */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-emerald-500/20 border border-amber-500/40 shadow-inner">
            <Award className="w-8 h-8 text-amber-300" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-mono-code">
              ✦ El Emeği • Özgün Çalışma ✦
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-sans">
              Enes Öztürk
            </h3>
            <p className="text-xs text-slate-400">
              Node.JS Geliştirici & Yazılım Öğrencisi
            </p>
          </div>
        </div>

        {/* Certificate Body Text */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Bu çalışma, <strong>Patika / Node.JS Temelleri Ödev 1</strong> kapsamında komut satırından parametre alma (<code className="text-amber-300 font-mono-code">process.argv</code>) ve daire alanı hesaplama formülünün (<code className="text-emerald-300 font-mono-code">A = π × r²</code>) kusursuz uygulanması amacıyla <strong>Enes Öztürk</strong> tarafından özenle, her satırı düşünülerek hazırlanmıştır.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Temiz Kod İlkeleri</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tip & Hata Kontrolü</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Birebir Şablon Çıktısı</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Edilmiş Çözüm</span>
            </div>
          </div>
        </div>

        {/* Handcrafted Signature Area */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Geliştirici İmzası
            </span>
            <span className="text-2xl text-amber-300 font-handwriting font-bold">
              Enes Öztürk
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Tarih & Durum</span>
            <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Onaylandı & Çalışıyor
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
        >
          Anladım, Harika!
        </button>
      </div>
    </div>
  );
};
