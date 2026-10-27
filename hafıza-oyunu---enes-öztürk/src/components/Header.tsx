import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { restartGame } from '../store/memorySlice';
import { soundManager } from '../utils/soundEffects';
import { RotateCcw, Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showRules, setShowRules] = useState(false);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playFlip();
    }
  };

  const handleRestart = () => {
    dispatch(restartGame());
    soundManager.playFlip();
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap">
              Hafıza Oyunu
            </span>
            <span className="text-xs text-indigo-400 font-medium block -mt-1">
              Enes Öztürk İmzalı
            </span>
          </div>
        </div>

        {/* Zone 2: Informational / Navigation indicators */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <span className="text-slate-300 font-medium whitespace-nowrap">
            5x5 Matris
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-emerald-400 font-medium whitespace-nowrap">
            Eşleşme: +50 Puan
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-rose-400 font-medium whitespace-nowrap">
            Hata: -10 Puan
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Nasıl Oynanır?</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={handleRestart}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      </div>

      {/* Rules dropdown modal / expander */}
      {showRules && (
        <div className="border-t border-slate-800/80 bg-slate-900/95 px-4 py-3 text-xs text-slate-300">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="font-semibold text-indigo-300">Oyun Kuralları (Ödev 3 Gereksinimleri):</p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>Kart çiftleri 5x5 matris (25 kart) üzerine karmaşık olarak dağıtılmıştır.</li>
                <li>İki kart açıldığında eğer kartlar aynıysa açık kalır ve <span className="text-emerald-400 font-semibold">+50 puan</span> eklenir.</li>
                <li>İki kart açıldığında aynı değilse kartlar geri kapanır ve <span className="text-rose-400 font-semibold">-10 puan</span> eksilir.</li>
                <li>5x5 matristeki 25. kart Enes Öztürk Özel Joker kartıdır; açıldığında anında +50 bonus kazandırır.</li>
                <li>Tüm kartlar açıldığında &quot;Yeniden Oyna&quot; butonu ile yeni oyun başlatılır.</li>
              </ul>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="text-xs text-slate-400 hover:text-slate-100 px-2 py-1 bg-slate-800 rounded self-end cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
