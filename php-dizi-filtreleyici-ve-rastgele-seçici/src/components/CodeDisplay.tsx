import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle, Award } from 'lucide-react';
import { PHP_CODE_SNIPPET, downloadPhpFile } from '../utils/phpSimulator';

export const CodeDisplay: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [codeVariant, setCodeVariant] = useState<'standard' | 'arrow'>('standard');

  const ARROW_FN_SNIPPET = `<?php
/**
 * Modern PHP 7.4+ / PHP 8+ Kısa Ok Fonksiyonu (fn) Sözdizimi
 * 
 * @author Enes Öztürk
 */
function rastgeleSecici(array $dizi, int $adet): array
{
    // 1. array_filter ile boşluk ve NULL değerleri elenir
    $filtreli = array_filter($dizi, fn($item) => !is_null($item) && $item !== "");

    if (empty($filtreli)) {
        return [];
    }

    // 2. array_rand ile filtrelenmiş diziden anahtarlar seçilir
    $anahtarlar = (array) array_rand($filtreli, min($adet, count($filtreli)));

    // 3. array_map ile seçilen anahtarlar değerlere dönüştürülür
    return array_map(fn($key) => $filtreli[$key], $anahtarlar);
}
`;

  const activeSnippet = codeVariant === 'standard' ? PHP_CODE_SNIPPET : ARROW_FN_SNIPPET;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Code Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>PHP Çözüm Kodu</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
                Tam Uyumlu
              </span>
            </h3>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Yazar: <strong>Enes Öztürk</strong></span>
              <span>·</span>
              <span>PHP 7.4+ / PHP 8.x Uyumlu</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Variant Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setCodeVariant('standard')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                codeVariant === 'standard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standart Çözüm
            </button>
            <button
              onClick={() => setCodeVariant('arrow')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                codeVariant === 'arrow'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Modern Arrow (fn)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700/60"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={downloadPhpFile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.PHP İndir</span>
          </button>
        </div>
      </div>

      {/* Author Badge Callout */}
      <div className="px-6 py-2.5 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            Bu algoritma <strong>Enes Öztürk</strong> imzası ve telif koruması ile hazırlanmıştır.
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px] hidden sm:block">
          array_map() · array_filter() · array_rand()
        </div>
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="p-6 bg-slate-950 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[460px]">
        <pre className="whitespace-pre">
          {activeSnippet.split('\n').map((line, i) => {
            // Simple syntax color cues
            let lineClass = 'text-slate-300';
            if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
              lineClass = 'text-slate-500 italic';
            } else if (line.includes('function') || line.includes('return') || line.includes('use')) {
              lineClass = 'text-indigo-400';
            } else if (line.includes('array_filter') || line.includes('array_rand') || line.includes('array_map') || line.includes('print_r')) {
              lineClass = 'text-emerald-400 font-semibold';
            } else if (line.includes('$planets') || line.includes('$array') || line.includes('$count')) {
              lineClass = 'text-amber-300';
            }

            return (
              <div key={i} className="table-row">
                <span className="table-cell pr-4 text-right text-slate-600 select-none text-[11px] w-8">
                  {i + 1}
                </span>
                <span className={`table-cell ${lineClass}`}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
