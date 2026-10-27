/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Plus, Minus, FileCode2, AlignLeft, Sparkles, Sliders } from 'lucide-react';
import { FormatType, TextTheme } from '../services/paragraphGenerator';

interface ControlPanelProps {
  paras: number;
  format: FormatType;
  theme: TextTheme;
  includeSignature: boolean;
  startWithLorem: boolean;
  isLoading: boolean;
  onParasChange: (val: number) => void;
  onFormatChange: (val: FormatType) => void;
  onThemeChange: (val: TextTheme) => void;
  onIncludeSignatureToggle: () => void;
  onStartWithLoremToggle: () => void;
  onGenerate: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  paras,
  format,
  theme,
  includeSignature,
  startWithLorem,
  isLoading,
  onParasChange,
  onFormatChange,
  onThemeChange,
  onIncludeSignatureToggle,
  onStartWithLoremToggle,
  onGenerate,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onParasChange(1);
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      onParasChange(Math.max(1, Math.min(100, parsed)));
    }
  };

  const handleStep = (delta: number) => {
    onParasChange(Math.max(1, Math.min(100, paras + delta)));
  };

  return (
    <div id="generator-panel" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-700" />
          <h2 className="text-base font-semibold text-slate-900">
            Paragraf ve Format Parametreleri
          </h2>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Minimum 1 paragraf zorunludur
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5">
        {/* Input 1: Paragraf Sayısı (Gereksinim 2 & 3) */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <label htmlFor="paras-input" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Paragraf Sayısı (paras)</span>
            <span className="font-mono text-xs text-slate-400">Min: 1</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={paras <= 1 || isLoading}
              aria-label="Paragraf sayısını azalt"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              id="paras-input"
              type="number"
              min={1}
              max={100}
              value={paras}
              onChange={handleInputChange}
              className="w-full h-10 px-3 text-center font-mono font-medium text-base text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={paras >= 100 || isLoading}
              aria-label="Paragraf sayısını artır"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 mt-1">
            {[1, 4, 8, 12].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onParasChange(preset)}
                className={`flex-1 py-1 text-xs font-mono rounded-md border transition-colors ${
                  paras === preset
                    ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset} {preset === 4 ? '★' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown 2: Text / HTML Formatı (Gereksinim 4) */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <label htmlFor="format-select" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Çıktı Formatı (Dropdown)</span>
            <span className="text-xs text-slate-400">text / html</span>
          </label>
          <div className="relative">
            <select
              id="format-select"
              value={format}
              onChange={(e) => onFormatChange(e.target.value as FormatType)}
              className="w-full h-10 px-3 pr-10 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="text">Düz Metin (text)</option>
              <option value="html">HTML Kodu (html &lt;p&gt;)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              {format === 'html' ? <FileCode2 className="w-4 h-4 text-indigo-600" /> : <AlignLeft className="w-4 h-4 text-slate-600" />}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {format === 'html' ? 'Her paragraf <p> etiketleri içine alınır' : 'Saf düz metin satır aralıkları ile ayrılır'}
          </div>
        </div>

        {/* Input 3: Metin Teması / API Kaynağı */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <label htmlFor="theme-select" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Metin Kaynağı & Teması</span>
            <span className="text-xs text-slate-400">API Destekli</span>
          </label>
          <div className="relative">
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as TextTheme)}
              className="w-full h-10 px-3 pr-10 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="bacon">Bacon Ipsum (Varsayılan API)</option>
              <option value="classic">Klasik Lorem Ipsum (Cicero)</option>
              <option value="turkish">Türkçe Dolgu Metni (Özgün)</option>
              <option value="tech">Yazılım & Mimari (Tech Ipsum)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {theme === 'bacon' ? 'Bacon Ipsum API (?paras=&format=)' : 'Zengin yerel kelime dağarcığı'}
          </div>
        </div>
      </div>

      {/* Toggles & Generate Action Row */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={includeSignature}
              onChange={onIncludeSignatureToggle}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <span>Enes Öztürk imzasını çıktıya ekle</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={onStartWithLoremToggle}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <span>Standart başlangıç cümlesi kullan</span>
          </label>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Oluşturuluyor...' : 'Yeniden Oluştur'}</span>
        </button>
      </div>
    </div>
  );
};
