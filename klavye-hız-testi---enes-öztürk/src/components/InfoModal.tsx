import React from 'react';
import { X, HelpCircle, CheckCircle, Calculator, Zap } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Nasıl Hesaplanır?</h3>
            <p className="text-xs text-slate-400">Hız testi puanlama ve istatistik formülleri</p>
          </div>
        </div>

        <div className="py-4 space-y-4 text-sm text-slate-300">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-amber-400 mb-1">
              <Calculator className="w-4 h-4" />
              <span>Net WPM (Words Per Minute)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uluslararası standart daktilo ölçümünde 1 kelime 5 karakter kabul edilir.
              <br />
              <code className="text-amber-300 font-mono mt-1 inline-block">
                WPM = (Doğru Yazılan Karakter Sayısı / 5) / (Geçen Dakika)
              </code>
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Doğruluk Oranı (%)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yaptığınız toplam tuş vuruşlarının ne kadarının hatasız olduğunu gösterir.
              <br />
              <code className="text-emerald-300 font-mono mt-1 inline-block">
                Doğruluk = (Doğru Tuş Vuruşları / Toplam Tuş Vuruşları) × 100
              </code>
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 font-semibold text-sky-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>60 Saniye Kuralı</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Süre siz ilk tuşa dokunduğunuz milisaniyede otomatik başlar. Her kelimeden sonra Boşluk (Space) tuşuna basarak kelimeyi onaylarsınız. Doğru kelimeler yeşil, yanlışlar kırmızı olarak işaretlenir.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
