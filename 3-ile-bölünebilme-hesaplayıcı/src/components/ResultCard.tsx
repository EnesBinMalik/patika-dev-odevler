/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Award,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Share2
} from 'lucide-react';
import { DivisibilityResult } from '../utils/divisibility';

interface ResultCardProps {
  result: DivisibilityResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const formattedOutputText = `Girilen Sayı : ${result.girilenSayi}\n${result.mesaj}\n\nİmza: Enes Öztürk`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Primary Highlight Card */}
      <div
        className={`w-full rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
          result.bolunebilirMi
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 border-emerald-500/30 shadow-xl shadow-emerald-500/10'
            : 'bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 border-indigo-500/30 shadow-xl shadow-indigo-500/10'
        }`}
      >
        {/* Glow ambient light */}
        <div
          className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            result.bolunebilirMi ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
          }`}
        />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-2xl ${
                  result.bolunebilirMi
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {result.bolunebilirMi ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ödev Çıktısı
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Hesaplama Sonucu</span>
                  {result.bolunebilirMi ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      3&apos;e Tam Bölünür
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      3&apos;e Tam Bölünemez
                    </span>
                  )}
                </h3>
              </div>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Sonucu Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* EXACT HOMEWORK SPECIFICATION BOX */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-3 font-mono-code relative group">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-800/60 pb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-sans font-semibold">
                <BookmarkCheck className="w-4 h-4" /> Örnek Formatındaki Yanıt
              </span>
              <span className="text-[11px] font-sans text-slate-400">Ödev Şablonu</span>
            </div>

            <div className="text-base sm:text-lg space-y-1.5">
              <div className="text-slate-300 font-semibold">
                <span className="text-slate-500">Girilen Sayı : </span>
                <span className="text-amber-400 text-xl font-bold">{result.girilenSayi}</span>
              </div>
              <div className="text-white text-lg sm:text-xl font-bold leading-relaxed pt-1">
                {result.bolunebilirMi ? (
                  <span className="text-emerald-400">{result.mesaj}</span>
                ) : (
                  <span>
                    Girdiğiniz sayı 3&apos;e bölünemez.{' '}
                    <span className="text-indigo-300 underline decoration-indigo-500/50 underline-offset-4 font-extrabold">
                      Bölünebilecek ilk sayı {result.ilkBolunebilenSayi}&apos;
                      {result.ilkBolunebilenSayi.toString().endsWith('6') ? 'dır' : 'dir'}.
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Micro pill explaining the calculation */}
            {!result.bolunebilirMi && (
              <div className="pt-2 text-xs font-sans text-slate-400 flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {result.girilenSayi} + {result.eklenecekMiktar} = {result.ilkBolunebilenSayi}
                </span>
                <span>(3 ile bölümünden kalan: {result.kalan}, gereken fark: +{result.eklenecekMiktar})</span>
              </div>
            )}
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Girilen Sayı
              </span>
              <span className="text-2xl font-bold font-mono-code text-white mt-1 block">
                {result.girilenSayi}
              </span>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                3 ile Bölümünden Kalan
              </span>
              <span
                className={`text-2xl font-bold font-mono-code mt-1 block ${
                  result.kalan === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {result.kalan}
              </span>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Bölünebilen İlk Sayı
              </span>
              <span className="text-2xl font-bold font-mono-code text-indigo-300 mt-1 block">
                {result.ilkBolunebilenSayi}
              </span>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Bölüm (Sonuç)
              </span>
              <span className="text-2xl font-bold font-mono-code text-slate-200 mt-1 block">
                {result.bolum}
              </span>
            </div>
          </div>

          {/* OFFICIAL SIGNATURE BLOCK: ENES ÖZTÜRK */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 rounded-2xl p-4 sm:p-5 border border-indigo-500/20">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Doğrulanmış Ödev İmzası
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Algoritma ve matematiksel hesaplama tamamlandı.
                </p>
              </div>
            </div>

            {/* The Handwritten Signature Display */}
            <div className="text-center sm:text-right border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 w-full sm:w-auto">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Geliştirici İmzası
              </span>
              <div className="font-signature text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 tracking-wider font-bold py-1">
                Enes Öztürk
              </div>
              <span className="text-[11px] text-slate-500 block font-mono-code">
                {result.tarih}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
