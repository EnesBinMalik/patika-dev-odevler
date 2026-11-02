import React from 'react';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  allPassed: boolean;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRun,
  onReset,
  isRunning,
  allPassed,
  onOpenCertificate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm text-slate-950 font-bold font-mono text-sm">
            🦀
          </div>
          <a href="#" className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors">
            Rust Sahiplik Laboratuvarı
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#gorev-detaylari" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
            Görev Detayları
          </a>
          <a href="#kod-editoru" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
            Kod Editörü
          </a>
          <a href="#bellek-gorsellestirici" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
            Stack & Heap Modeli
          </a>
          <a href="#sahiplik-rehberi" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
            Sahiplik Rehberi
          </a>
          <a href="#egitmen-bilgisi" className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
            Eğitmen İmzası
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {allPassed && (
            <button
              onClick={onOpenCertificate}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Enes Öztürk imzalı başarı belgesini görüntüle"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Sertifikayı Gör
            </button>
          )}

          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
            title="Kodu ve Durumu Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Derleniyor...' : 'Programı Çalıştır'}
          </button>
        </div>
      </div>
    </header>
  );
};
