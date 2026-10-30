import React from 'react';
import { Info, X, ArrowRight } from 'lucide-react';

interface PaginationNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaginationNoticeModal: React.FC<PaginationNoticeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
          Ödev 12 · Clean Blog 6. Bölüm
        </div>

        <h3 className="font-serif-heading text-xl font-bold text-slate-900 mb-3">
          Sayfalama ve Görsel Yükleme Notu
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-sm text-slate-700 leading-relaxed font-sans">
          "Uygulamamızda sayfalama ve görsel yükleme işlemlerini yapmadık. Sonraki projemizde de bu özellikleri kullanacağız."
        </div>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Bu projede odak noktamız <strong>HEROKU</strong> ve <strong>MongoDB Atlas</strong> ücretsiz bulut servislerine dağıtım, dinamik ortam değişkenleri ve temel CRUD mimarisidir. Bir sonraki projemizde multer ile resim yükleme ve express-paginate ile sayfalama eklenecektir.
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 italic">İmza: Enes Öztürk</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Anladım</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
