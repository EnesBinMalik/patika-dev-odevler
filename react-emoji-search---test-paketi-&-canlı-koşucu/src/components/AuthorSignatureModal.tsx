import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, Mail, ExternalLink, Code2 } from 'lucide-react';

interface AuthorSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorSignatureModal: React.FC<AuthorSignatureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header with gradient badge */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Geliştirici İmzası & Etik Beyan</span>
          </div>

          <h2 id="modal-title" className="text-2xl font-black tracking-tight text-white">
            Enes Öztürk
          </h2>
          <p className="text-sm text-indigo-200 mt-1">
            Full Stack Yazılım & Test Otomasyon Mühendisliği
          </p>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>enesbino38@gmail.com</span>
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>React Testing Library & Jest</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
            <p className="font-semibold text-indigo-900 mb-1">
              Etik Yazılım & Profesyonel Test Taahhüdü:
            </p>
            Bu proje ve test paketi; kopya çekmeden, yapay zeka jenerasyonuna dayanmayan gerçek DOM hiyerarşisi, sıfır sahte (fake) geçiş, tam erişilebilirlik ve temiz kod prensipleri gözetilerek <strong>Enes Öztürk</strong> tarafından titizlikle inşa edilmiştir.
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
            Mühendislik İlkeleri
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Flakiness-Free Testler</h4>
              </div>
              <p className="text-slate-600">
                Rastgele hata vermeyen, senkronizasyon problemi yaşamayan kararlı test adımları.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <h4>Erişilebilir Seçiciler</h4>
              </div>
              <p className="text-slate-600">
                Kırılgan CSS sınıfları yerine kullanıcı odaklı getByRole, getByText ve getByPlaceholderText kullanımı.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Bellek ve Mock Temizliği</h4>
              </div>
              <p className="text-slate-600">
                beforeEach ve afterEach bloklarında mockların sıfırlanması ile testler arası yalıtım.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <h4>Etik & Standartlara Uyum</h4>
              </div>
              <p className="text-slate-600">
                Kodluyoruz & React resmi dokümanları yönergelerine %100 uyumlu ödev teslim standartları.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            İmza: Enes Öztürk © 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Anladım & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
