import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restartGame } from '../store/memorySlice';
import { soundManager } from '../utils/soundEffects';
import { Trophy, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isGameWon, score, moves, bestScore } = useAppSelector(
    (state) => state.memory
  );

  useEffect(() => {
    if (isGameWon) {
      soundManager.playVictory();

      // Confetti burst
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      } catch {}
    }
  }, [isGameWon]);

  if (!isGameWon) return null;

  const handlePlayAgain = () => {
    soundManager.playFlip();
    dispatch(restartGame());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Decorative subtle ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Trophy Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/30 to-amber-400/20 border border-amber-400/40 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <h2
            id="victory-title"
            className="text-2xl font-bold tracking-tight text-white mb-1"
          >
            Tebrikler!
          </h2>
          <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Tüm kartları başarıyla eşleştirdiniz
          </p>

          {/* Stats summary */}
          <div className="w-full grid grid-cols-3 gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-medium text-slate-500">Skor</span>
              <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                {score}
              </span>
              <span className="text-[10px] text-slate-500">puan</span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Hamle</span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-200">
                {moves}
              </span>
              <span className="text-[10px] text-slate-500">adım</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-medium text-slate-500">En İyi</span>
              <span className="text-xl font-bold font-mono tabular-nums text-amber-400">
                {bestScore}
              </span>
              <span className="text-[10px] text-slate-500">rekor</span>
            </div>
          </div>

          {/* Enes Öztürk Signature Notice */}
          <div className="mb-6 flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 px-3 py-1.5 rounded-lg">
            <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Ödev 3 · Enes Öztürk İmzalı</span>
          </div>

          {/* Primary Action Button: "Yeniden Oyna" */}
          <button
            onClick={handlePlayAgain}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>
        </div>
      </div>
    </div>
  );
};
