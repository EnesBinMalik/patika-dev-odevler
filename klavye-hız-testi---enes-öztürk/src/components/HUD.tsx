import React from 'react';
import { Timer, Zap, CheckCircle2, Award } from 'lucide-react';
import { TestStatus } from '../types';

interface HUDProps {
  status: TestStatus;
  timeLeft: number;
  totalTime: number;
  wpm: number;
  accuracy: number;
  correctKeystrokes: number;
  wrongKeystrokes: number;
  correctWords: number;
  wrongWords: number;
}

export const HUD: React.FC<HUDProps> = ({
  status,
  timeLeft,
  totalTime,
  wpm,
  accuracy,
  correctKeystrokes,
  wrongKeystrokes,
  correctWords,
  wrongWords,
}) => {
  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const isUrgent = timeLeft <= 10 && status === 'RUNNING';

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
      {/* Top progress strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        {/* Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg border transition-all ${
              isUrgent
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-400 animate-pulse'
                : status === 'RUNNING'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
            }`}
          >
            <Timer className="w-5 h-5 mr-0.5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Kalan Süre
            </div>
            <div className="flex items-baseline gap-1 font-mono font-bold text-2xl text-white tabular-nums">
              <span className={isUrgent ? 'text-rose-400' : 'text-amber-400'}>
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
              <span className="text-xs text-slate-500 font-sans font-normal">sn</span>
            </div>
          </div>
        </div>

        {/* Live WPM */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Hız (WPM)
            </div>
            <div className="font-mono font-bold text-2xl text-white tabular-nums">
              {wpm}
              <span className="text-xs text-slate-500 font-sans font-normal ml-1">kelime/dk</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Doğruluk
            </div>
            <div className="font-mono font-bold text-2xl text-white tabular-nums">
              %{accuracy}
            </div>
          </div>
        </div>

        {/* Keystrokes & Words breakdown */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-sky-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Kelime / Vuruş
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm">
              <span className="text-emerald-400 font-semibold" title="Doğru Kelimeler">
                {correctWords}D
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-semibold" title="Yanlış Kelimeler">
                {wrongWords}Y
              </span>
              <span className="text-xs text-slate-500 ml-1">
                ({correctKeystrokes + wrongKeystrokes} tuş)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
