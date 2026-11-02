import React, { useState } from 'react';
import { Award, X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  passedTasksCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  passedTasksCount,
}) => {
  const [studentName, setStudentName] = useState('Başarılı Öğrenci');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Area */}
        <div id="printable-certificate" className="relative p-6 sm:p-8 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/30 text-center space-y-5">
          {/* Subtle corner decorations */}
          <div className="absolute top-2 left-2 text-amber-500/30 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute top-2 right-2 text-amber-500/30 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute bottom-2 left-2 text-amber-500/30 font-mono text-xs">◆ ◆ ◆</div>
          <div className="absolute bottom-2 right-2 text-amber-500/30 font-mono text-xs">◆ ◆ ◆</div>

          {/* Seal / Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 shadow-inner">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
              Resmi Görev Başarı ve Yetkinlik Belgesi
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Rust Sahiplik ve Referanslar Laboratuvarı
            </h2>
          </div>

          <div className="text-xs text-slate-400 max-w-md mx-auto">
            Bu belge, aşağıda adı geçen öğrencinin Rust dilinde <strong className="text-slate-200">Sahiplik (Ownership)</strong>,{' '}
            <strong className="text-slate-200">Ödünç Alma (Borrowing)</strong> ve <strong className="text-slate-200">Dize Dilimleri (&amp;str)</strong> ile dize birleştirme görevini eksiksiz ve hatasız tamamladığını tasdik eder.
          </div>

          {/* Student Name */}
          <div className="py-2 border-y border-slate-800/80 max-w-sm mx-auto">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-slate-950 border border-amber-500 text-amber-300 font-bold text-center px-3 py-1 rounded text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="text-lg font-bold text-amber-300 cursor-pointer hover:underline flex items-center justify-center gap-2"
                title="İsminizi değiştirmek için tıklayın"
              >
                <span>{studentName}</span>
                <span className="text-[10px] text-slate-500 font-normal font-sans">(Düzenle)</span>
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-0.5">Programlama ve Sistem Mühendisliği Öğrencisi</div>
          </div>

          {/* Checklist confirmation badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-300">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              concatenate_strings (&amp;str)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sıfır Move İhlali
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {passedTasksCount}/6 Adım Onaylı
            </span>
          </div>

          {/* Enes Öztürk Signature Block */}
          <div className="pt-4 flex items-center justify-around border-t border-slate-800 text-left">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Tarih</div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">2026-11-02</div>
              <div className="text-[10px] text-slate-500 font-mono">Kod: #EO-RUST-VERIFIED</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Eğitmen İmzası</div>
              {/* Stylized Handwritten Signature font representation */}
              <div className="font-serif italic font-bold text-base sm:text-lg text-amber-400 tracking-wide mt-0.5 select-none">
                Enes Öztürk
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Dijital Olarak Doğrulandı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="text-xs text-slate-400">
            İsminizi düzenlemek için ismin üzerine tıklayabilirsiniz.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Yazdır / PDF Kaydet
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
