import React from 'react';
import { X, History, Trophy, Trash2, Calendar, Target, Zap } from 'lucide-react';
import { TestResult } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestResult[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length)
      : 0;

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
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Geçmiş Skorlar</h3>
            <p className="text-xs text-slate-400">Bu tarayıcıda kaydedilen hız testleriniz</p>
          </div>
        </div>

        {/* Top Summary stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">En Yüksek Hız</div>
              <div className="font-mono font-bold text-xl text-amber-400">{bestWpm} WPM</div>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <Zap className="w-6 h-6 text-sky-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Ortalama Hız</div>
              <div className="font-mono font-bold text-xl text-slate-100">{avgWpm} WPM</div>
            </div>
          </div>
        </div>

        {/* List of past results */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Henüz tamamlanmış bir test kaydı bulunmuyor.
              <br />
              İlk 60 saniyelik testinizi tamamlayarak buraya kaydedin!
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono font-bold text-base text-amber-400 w-14">
                    {item.wpm} <span className="text-[10px] text-slate-500 font-sans">WPM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>%{item.accuracy}</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400 font-mono">{item.correctWords}D</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span className="text-rose-400 font-mono">{item.wrongWords}Y</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <span className="uppercase">{item.language}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
          {history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Geçmişi Temizle</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
