import React, { useState } from 'react';
import { RotateCcw, Share2, Check, Award, Flame, Target, Keyboard } from 'lucide-react';
import { TestResult } from '../types';

interface ResultsModalProps {
  result: TestResult;
  onRestart: () => void;
  bestWpm: number;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onRestart,
  bestWpm,
}) => {
  const [copied, setCopied] = useState(false);

  const getRank = (wpm: number) => {
    if (wpm >= 90) return { title: 'Efsane Klavye Canavarı', emoji: '👑', desc: 'Dünya standartlarında parmak hızı ve olağanüstü refleks!' };
    if (wpm >= 70) return { title: 'Usta Daktilocu', emoji: '🏆', desc: 'Profesyonel yazarlar ve kodlayıcılar seviyesinde hız.' };
    if (wpm >= 50) return { title: 'Hızlı Parmaklar', emoji: '🚀', desc: 'Ortalamanın belirgin şekilde üstünde akıcı yazma becerisi.' };
    if (wpm >= 30) return { title: 'Orta Düzey Yazıcı', emoji: '⚡', desc: 'Günlük çalışma için gayet tatmin edici bir hız.' };
    return { title: 'Acemi Parmaklar', emoji: '🌱', desc: 'Antrenman yaptıkça hızınız ve doğruluğunuz hızla artacaktır!' };
  };

  const rank = getRank(result.wpm);
  const isNewBest = result.wpm > 0 && result.wpm >= bestWpm;

  const handleShare = () => {
    const text = `⌨️ Klavye Hız Testi Sonucum (Enes Öztürk İmzalı)
⚡ Hız: ${result.wpm} WPM (Net)
🎯 Doğruluk: %${result.accuracy}
✅ Doğru Kelime: ${result.correctWords} | ❌ Yanlış: ${result.wrongWords}
⌨️ Toplam Vuruş: ${result.totalKeystrokes} (${result.correctChars} doğru, ${result.wrongChars} yanlış)
🏅 Seviye: ${rank.title} ${rank.emoji}
⏱️ Süre: ${result.duration} saniye

Kendi hızınızı test edin!`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Generate SVG points for timeline chart
  const timeline = result.timeline || [];
  const maxWpmInChart = Math.max(...timeline.map((t) => t.wpm), result.wpm, 30);
  const chartWidth = 600;
  const chartHeight = 120;
  const padding = 20;

  const points = timeline.map((pt, idx) => {
    const x = padding + (idx / Math.max(timeline.length - 1, 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (pt.wpm / maxWpmInChart) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      {/* Subtle top signature watermark */}
      <div className="absolute top-4 right-6 text-[11px] font-mono tracking-wider text-amber-500/80 font-medium">
        EL EMEĞİ · ENES ÖZTÜRK İMZALI
      </div>

      {/* Header Result Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rank.emoji}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {rank.title}
            </h2>
            {isNewBest && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Yeni Kişisel Rekor!
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {rank.desc}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Panoya Kopyalandı!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Sonucu Paylaş</span>
              </>
            )}
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Başlat (Tab + Enter)</span>
          </button>
        </div>
      </div>

      {/* Main Big Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        {/* Net WPM */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Net Hız</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="font-mono font-black text-4xl sm:text-5xl text-amber-400 tabular-nums">
              {result.wpm}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              WPM (Kelime / Dakika)
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Doğruluk Oranı</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="font-mono font-black text-4xl sm:text-5xl text-emerald-400 tabular-nums">
              %{result.accuracy}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Hatasız tuş oranı
            </div>
          </div>
        </div>

        {/* Word Counts (Doğru / Yanlış) */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Kelimeler</span>
            <Award className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2 font-mono font-bold text-3xl sm:text-4xl">
              <span className="text-emerald-400" title="Doğru Kelimeler">
                {result.correctWords}
              </span>
              <span className="text-slate-600 font-light">/</span>
              <span className="text-rose-400" title="Yanlış Kelimeler">
                {result.wrongWords}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">{result.correctWords} Doğru</span>
              <span>·</span>
              <span className="text-rose-400 font-medium">{result.wrongWords} Yanlış</span>
            </div>
          </div>
        </div>

        {/* Keystrokes (CPM) */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Tuş Vuruşu</span>
            <Keyboard className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="font-mono font-black text-3xl sm:text-4xl text-slate-100 tabular-nums">
              {result.totalKeystrokes}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-400 font-mono">{result.correctChars}</span> doğru,{' '}
              <span className="text-rose-400 font-mono">{result.wrongChars}</span> hatalı vuruş
            </div>
          </div>
        </div>
      </div>

      {/* Speed Progression Timeline Chart */}
      {timeline.length > 2 && (
        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              60 Saniyelik Hız Akış Grafiği (WPM Zaman Çizelgesi)
            </span>
            <span className="text-xs font-mono text-slate-500">
              Zirve: {maxWpmInChart} WPM
            </span>
          </div>

          <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 sm:p-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-24 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line
                x1={padding}
                y1={padding}
                x2={chartWidth - padding}
                y2={padding}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="0.8"
              />
              <line
                x1={padding}
                y1={chartHeight / 2}
                x2={chartWidth - padding}
                y2={chartHeight / 2}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="0.8"
              />
              <line
                x1={padding}
                y1={chartHeight - padding}
                x2={chartWidth - padding}
                y2={chartHeight - padding}
                stroke="#475569"
                strokeWidth="1"
              />

              {/* Filled area */}
              {points && (
                <polygon
                  points={`${padding},${chartHeight - padding} ${points} ${
                    chartWidth - padding
                  },${chartHeight - padding}`}
                  fill="url(#wpmGradient)"
                />
              )}

              {/* The line */}
              {points && (
                <polyline
                  points={points}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1 px-2">
              <span>0. sn</span>
              <span>15. sn</span>
              <span>30. sn</span>
              <span>45. sn</span>
              <span>60. sn</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Signature */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <span>Özel Yapım & Tasarım:</span>
          <strong className="text-amber-400 font-semibold tracking-wide">
            Enes Öztürk
          </strong>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
          >
            Hemen yeni bir test başlat →
          </button>
        </div>
      </div>
    </div>
  );
};
