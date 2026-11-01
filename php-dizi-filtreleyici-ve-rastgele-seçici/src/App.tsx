/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Playground } from './components/Playground';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { PromptTestCaseRunner } from './components/PromptTestCaseRunner';
import { CodeDisplay } from './components/CodeDisplay';
import { ExplanationCard } from './components/ExplanationCard';
import { Footer } from './components/Footer';
import { ArrayElement, Preset, SimulationResult } from './types';
import { DEFAULT_PLANETS, PRESETS, runPhpSimulation } from './utils/phpSimulator';
import { Sparkles, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentItems, setCurrentItems] = useState<ArrayElement[]>(DEFAULT_PLANETS);
  const [count, setCount] = useState<number>(2);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('planets');
  const [simulation, setSimulation] = useState<SimulationResult>(() =>
    runPhpSimulation(DEFAULT_PLANETS, 2)
  );
  const [activeSection, setActiveSection] = useState<string>('simulator');

  const handleRunSimulation = () => {
    setSimulation(runPhpSimulation(currentItems, count));
  };

  const handleItemsChange = (newItems: ArrayElement[]) => {
    setCurrentItems(newItems);
    setSelectedPresetId('custom');
    setSimulation(runPhpSimulation(newItems, count));
  };

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
    setSimulation(runPhpSimulation(currentItems, newCount));
  };

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    setCurrentItems(preset.items);
    setSimulation(runPhpSimulation(preset.items, count));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Re-run simulation when count or items change
  useEffect(() => {
    setSimulation(runPhpSimulation(currentItems, count));
  }, [currentItems, count]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero & Briefing Header */}
        <section className="relative pt-4 pb-2">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>PHP Dizi Fonksiyonları Ödevi</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Enes Öztürk Özel Çözümü</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Boş Elemanları Temizleyen &amp; Rastgele Değerler Üreten Fonksiyon
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Verilen dizideki boşluk ve NULL elemanları ayıklayarak belirtilen adette rastgele
              eleman seçen ve 0 indeksli temiz dizi oluşturan PHP mimarisi.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>array_filter()</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>array_rand()</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>array_map()</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enes Öztürk İmzalı</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Live Interactive Simulator */}
        <section id="simulator" className="scroll-mt-20">
          <Playground
            currentItems={currentItems}
            count={count}
            simulation={simulation}
            onItemsChange={handleItemsChange}
            onCountChange={handleCountChange}
            onRunSimulation={handleRunSimulation}
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Section 2: Step-by-Step Pipeline Diagnostic */}
        <section id="pipeline" className="scroll-mt-20">
          <PipelineVisualizer simulation={simulation} />
        </section>

        {/* Section 3: Exact 5 Test Cases from the User Prompt */}
        <section id="tests" className="scroll-mt-20">
          <PromptTestCaseRunner />
        </section>

        {/* Section 4: Deep Pedagogical Explanation */}
        <section className="scroll-mt-20">
          <ExplanationCard />
        </section>

        {/* Section 5: Full PHP Source Code with Enes Öztürk Signature */}
        <section id="code" className="scroll-mt-20">
          <CodeDisplay />
        </section>
      </main>

      <Footer />
    </div>
  );
}
