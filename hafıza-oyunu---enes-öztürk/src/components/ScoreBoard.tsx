import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Trophy, Flame, Target } from 'lucide-react';

export const ScoreBoard: React.FC = () => {
  const { score, moves, matchedPairsCount, totalPairsNeeded, bestScore, recentScorePopups, streak } =
    useAppSelector((state) => state.memory);

  const latestPopup = recentScorePopups[recentScorePopups.length - 1];

  return (
    <div className="w-full max-w-2xl mx-auto mb-5">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          {/* MAIN SCORE (Kullanıcı Puanı) */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Puan</span>
            <div className="flex items-baseline gap-2 relative">
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight ${
                  score > 0
                    ? 'text-emerald-400'
                    : score < 0
                    ? 'text-rose-400'
                    : 'text-slate-100'
                }`}
              >
                {score}
              </span>

              {/* Animated Score Delta Indicator */}
              {latestPopup && (
                <span
                  key={latestPopup.id}
                  className={`animate-score-popup font-mono font-bold text-sm select-none ${
                    latestPopup.delta > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {latestPopup.delta > 0 ? `+${latestPopup.delta}` : latestPopup.delta}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Doğru +50 · Hata -10
            </span>
          </div>

          {/* MOVES */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">Hamle</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-200">
                {moves}
              </span>
              <span className="text-xs text-slate-500">deneme</span>
            </div>
            {streak > 1 ? (
              <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5 font-medium">
                <Flame className="w-3 h-3" />
                {streak} Seri Eşleşme!
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 mt-0.5">Kart açma</span>
            )}
          </div>

          {/* PROGRESS */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400">İlerleme</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-indigo-400">
                {matchedPairsCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ {totalPairsNeeded}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${totalPairsNeeded > 0 ? (matchedPairsCount / totalPairsNeeded) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* BEST SCORE */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              En Yüksek
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">
                {bestScore}
              </span>
              <span className="text-xs text-slate-500">rekor</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Tüm zamanlar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
