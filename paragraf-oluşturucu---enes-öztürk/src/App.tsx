/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Paragraf Oluşturucu - Enes Öztürk İmzalı
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MetricsBar } from './components/MetricsBar';
import { ParagraphView } from './components/ParagraphView';
import { Footer } from './components/Footer';
import { AboutModal } from './components/AboutModal';
import {
  fetchParagraphs,
  FormatType,
  TextTheme,
  GenerationResult,
  generateLocalParagraphs,
} from './services/paragraphGenerator';

export default function App() {
  // Requirement 1: Başlangıçta 4 paragraf gösterilmelidir.
  const [paras, setParas] = useState<number>(4);
  // Requirement 4: Paragraflar bir dropdown aracılığıyla text veya html olarak gösterilebilmelidir.
  const [format, setFormat] = useState<FormatType>('text');
  const [theme, setTheme] = useState<TextTheme>('bacon');
  const [includeSignature, setIncludeSignature] = useState<boolean>(true);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  // Initial initialisation with 4 paragraphs immediately so there is never an empty screen
  const [result, setResult] = useState<GenerationResult>(() => {
    return generateLocalParagraphs({
      paras: 4,
      format: 'text',
      theme: 'bacon',
      startWithLorem: true,
      includeSignature: true,
    });
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadContent = useCallback(
    async (
      targetParas: number,
      targetFormat: FormatType,
      targetTheme: TextTheme,
      targetSignature: boolean,
      targetLorem: boolean
    ) => {
      setIsLoading(true);
      try {
        const generated = await fetchParagraphs({
          paras: Math.max(1, targetParas),
          format: targetFormat,
          theme: targetTheme,
          includeSignature: targetSignature,
          startWithLorem: targetLorem,
        });
        setResult(generated);
      } catch (err) {
        console.error('Paragraf oluşturma hatası:', err);
        // Fallback local
        const fallback = generateLocalParagraphs({
          paras: Math.max(1, targetParas),
          format: targetFormat,
          theme: targetTheme,
          includeSignature: targetSignature,
          startWithLorem: targetLorem,
        });
        setResult(fallback);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load on mount
  useEffect(() => {
    loadContent(paras, format, theme, includeSignature, startWithLorem);
  }, []); // Run once on mount

  // Auto-update with a short debounce when controls change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadContent(paras, format, theme, includeSignature, startWithLorem);
    }, 250);

    return () => clearTimeout(timer);
  }, [paras, format, theme, includeSignature, startWithLorem, loadContent]);

  const handleParasChange = (val: number) => {
    // Requirement 3: En az bir paragraf seçilebilmelidir.
    const safeVal = Math.max(1, val);
    setParas(safeVal);
  };

  const handleResetToDefault = () => {
    setParas(4);
    setFormat('text');
    setTheme('bacon');
    setIncludeSignature(true);
    setStartWithLorem(true);
    loadContent(4, 'text', 'bacon', true, true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header
        onOpenAbout={() => setAboutOpen(true)}
        onQuickReset={handleResetToDefault}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section with Context */}
        <section className="text-center sm:text-left border-b border-slate-200/80 pb-7">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100 mb-3">
            <span>Enes Öztürk Özel Tasarımı</span>
            <span>·</span>
            <span>Modern Paragraf Üretici</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Paragraf ve Dolgu Metni Oluşturucu
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Geliştirme ve prototipleme süreçleriniz için ihtiyaç duyduğunuz paragrafları anında üretin.
            Düz metin (text) veya HTML (&lt;p&gt;) formatında kopyalayın ve projelerinizde kullanın.
          </p>
        </section>

        {/* Control Panel: Paras Input & Format Dropdown */}
        <ControlPanel
          paras={paras}
          format={format}
          theme={theme}
          includeSignature={includeSignature}
          startWithLorem={startWithLorem}
          isLoading={isLoading}
          onParasChange={handleParasChange}
          onFormatChange={setFormat}
          onThemeChange={setTheme}
          onIncludeSignatureToggle={() => setIncludeSignature((prev) => !prev)}
          onStartWithLoremToggle={() => setStartWithLorem((prev) => !prev)}
          onGenerate={() => loadContent(paras, format, theme, includeSignature, startWithLorem)}
        />

        {/* Metrics Row */}
        <MetricsBar
          parasCount={result.paragraphs.length}
          wordCount={result.wordCount}
          charCount={result.charCount}
          readingTime={result.readingTimeMinutes}
          source={result.source}
          format={format}
        />

        {/* Paragraphs Display Area */}
        <ParagraphView
          paragraphs={result.paragraphs}
          rawText={result.rawText}
          format={format}
          includeSignature={includeSignature}
        />
      </main>

      <Footer />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}
