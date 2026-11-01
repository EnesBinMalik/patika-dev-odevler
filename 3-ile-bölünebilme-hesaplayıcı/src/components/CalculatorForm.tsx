/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, AlertTriangle, ArrowRight, X, Sparkles } from 'lucide-react';

interface CalculatorFormProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage: string | null;
  onSelectPreset: (preset: number) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  errorMessage,
  onSelectPreset,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const presets = [
    { label: '4 (Ödev Örneği)', value: 4, highlight: true },
    { label: '9 (Tam Kat)', value: 9, highlight: false },
    { label: '14 (Kalan: 2)', value: 14, highlight: false },
    { label: '27 (Tam Kat)', value: 27, highlight: false },
    { label: '100 (Kalan: 1)', value: 100, highlight: false },
    { label: '0 (Sıfır)', value: 0, highlight: false },
    { label: '-5 (Negatif)', value: -5, highlight: false },
  ];

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Veri Giriş Formu
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Sayı Değerini Giriniz
            </h2>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          3 ile bölümünden kalanın 0 olup olmadığını kontrol etmek istediğiniz tam sayıyı yazınız. Bölünemiyorsa, 3&apos;e bölünebilecek bir sonraki ilk sayı otomatik hesaplanacaktır.
        </p>

        {/* The Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="number-input" className="block text-xs font-medium text-slate-300 mb-2">
              Kontrol Edilecek Sayı <span className="text-rose-400">*</span>
            </label>
            <div
              className={`relative rounded-2xl border transition-all duration-200 ${
                errorMessage
                  ? 'border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/20'
                  : isFocused
                  ? 'border-indigo-500 bg-slate-900/90 ring-2 ring-indigo-500/30'
                  : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              <input
                id="number-input"
                type="text"
                inputMode="numeric"
                value={inputValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Örneğin: 4"
                className="w-full px-5 py-4 text-xl sm:text-2xl font-mono-code font-bold text-white bg-transparent outline-none placeholder:text-slate-600 tracking-wide"
                autoComplete="off"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => onInputChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Girdiyi temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Validation Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm animate-in fade-in slide-in-from-top-1"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-xs uppercase tracking-wider text-rose-300">
                    Giriş Hatası
                  </strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <span>Bölünebilirliği Kontrol Et</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Quick presets */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Hızlı Test Değerleri
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onSelectPreset(preset.value)}
                className={`text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  preset.highlight
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-bold shadow-sm shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
