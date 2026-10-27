/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Code, FileText, CheckCheck } from 'lucide-react';
import { FormatType } from '../services/paragraphGenerator';

interface ParagraphViewProps {
  paragraphs: string[];
  rawText: string;
  format: FormatType;
  includeSignature: boolean;
}

export const ParagraphView: React.FC<ParagraphViewProps> = ({
  paragraphs,
  rawText,
  format,
  includeSignature,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [htmlDisplayMode, setHtmlDisplayMode] = useState<'code' | 'preview'>('code');

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = rawText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (text: string, index: number) => {
    const textToCopy = format === 'html' ? `<p>${text}</p>` : text;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleDownload = () => {
    const extension = format === 'html' ? 'html' : 'txt';
    const mimeType = format === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8';
    
    let fileContent = rawText;
    if (format === 'html' && !rawText.includes('<!DOCTYPE html>')) {
      fileContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Paragraf Çıktısı - Enes Öztürk</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.7; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    p { margin-bottom: 1.5em; text-align: justify; }
    .signature { margin-top: 3em; border-top: 1px solid #e2e8f0; padding-top: 1em; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
${rawText}
</body>
</html>`;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paragraflar-enes-ozturk.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="output-display" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header bar of the display */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900">
              {format === 'html' ? 'HTML Çıktısı' : 'Düz Metin Çıktısı'}
            </h3>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {paragraphs.length} Paragraf
          </span>
        </div>

        {/* Mode switcher for HTML, and Action Buttons */}
        <div className="flex items-center gap-2">
          {format === 'html' && (
            <div className="flex items-center p-0.5 bg-slate-200/80 rounded-lg mr-2">
              <button
                type="button"
                onClick={() => setHtmlDisplayMode('code')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  htmlDisplayMode === 'code'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Kod</span>
              </button>
              <button
                type="button"
                onClick={() => setHtmlDisplayMode('preview')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  htmlDisplayMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Önizleme</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownload}
            title="Dosya olarak indir"
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">İndir</span> (.{format === 'html' ? 'html' : 'txt'})
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs ${
              copiedAll
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copiedAll ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Tümünü Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-7">
        {format === 'html' && htmlDisplayMode === 'code' ? (
          /* HTML Code View */
          <div className="relative font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 rounded-lg p-4 sm:p-5 overflow-x-auto leading-relaxed border border-slate-800">
            {includeSignature && (
              <div className="text-slate-500 pb-2 mb-2 border-b border-slate-800">
                &lt;!-- Hazırlayan: Enes Öztürk --&gt;
              </div>
            )}
            <div className="space-y-4">
              {paragraphs.map((p, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-slate-300">
                      <span className="text-sky-400 font-semibold">&lt;p&gt;</span>
                      <span className="text-slate-100">{p}</span>
                      <span className="text-sky-400 font-semibold">&lt;/p&gt;</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(p, index)}
                      title="Bu paragrafı kopyala"
                      className="opacity-60 group-hover:opacity-100 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs shrink-0 transition-opacity"
                    >
                      {copiedIndex === index ? '✓ Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>
                </div>
              ))}

              {includeSignature && (
                <div className="pt-2 text-slate-400">
                  <span className="text-sky-400">&lt;p <span className="text-amber-300">class</span>=<span className="text-emerald-300">&quot;signature&quot;</span>&gt;</span>
                  <span className="text-sky-400">&lt;small&gt;</span>
                  <span>Oluşturan: Enes Öztürk</span>
                  <span className="text-sky-400">&lt;/small&gt;</span>
                  <span className="text-sky-400">&lt;/p&gt;</span>
                </div>
              )}
            </div>
          </div>
        ) : format === 'html' && htmlDisplayMode === 'preview' ? (
          /* HTML Rendered Live Preview */
          <div className="prose prose-slate max-w-none text-slate-800 space-y-4 leading-relaxed text-base">
            <div className="text-xs text-slate-400 font-mono mb-4 pb-2 border-b border-slate-100">
              Web Sayfası Görsel Render Önizlemesi (&lt;p&gt; stili)
            </div>
            {paragraphs.map((p, index) => (
              <p key={index} className="text-slate-700 leading-relaxed text-justify">
                {p}
              </p>
            ))}
            {includeSignature && (
              <div className="mt-8 pt-4 border-t border-slate-200 text-sm text-slate-500 italic">
                Oluşturan: Enes Öztürk
              </div>
            )}
          </div>
        ) : (
          /* Plain Text View */
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => {
              const sentenceCount = (paragraph.match(/[.!?]+/g) || []).length;
              const wordCount = paragraph.trim().split(/\s+/).filter(Boolean).length;

              return (
                <div
                  key={index}
                  className="group relative bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-lg p-4 sm:p-5 transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/60 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {(index + 1).toString().padStart(2, '0')}. Paragraf
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-slate-400">
                        {wordCount} kelime · {sentenceCount} cümle
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySingle(paragraph, index)}
                        className="px-2 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-800 leading-relaxed text-sm sm:text-base text-justify">
                    {paragraph}
                  </p>
                </div>
              );
            })}

            {includeSignature && (
              <div className="pt-2 text-right text-xs text-slate-500 font-medium">
                — Enes Öztürk
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
