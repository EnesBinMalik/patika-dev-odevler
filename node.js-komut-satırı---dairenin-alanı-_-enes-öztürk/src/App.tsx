/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TerminalView } from './components/TerminalView';
import { GeometryVisualizer } from './components/GeometryVisualizer';
import { CodeViewer } from './components/CodeViewer';
import { ExplanationGuide } from './components/ExplanationGuide';
import { TestRunner } from './components/TestRunner';
import { ArtisanModal } from './components/ArtisanModal';
import { Terminal, Shapes, Code2, Sparkles, ShieldCheck, Heart, Github, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'visualizer' | 'code' | 'guide' | 'tests'>('terminal');
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenArtisanModal={() => setIsArtisanModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono-code">
                  Ödev 1 • Node.JS CLI
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dairenin Alanı = π × r²
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-handwriting text-amber-300/90 font-bold">
                  Enes Öztürk İmzasıyla
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Node.JS Komut Satırından <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-400">
                  Daire Alanı Hesaplayıcı
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Yarıçap değerini <code className="text-amber-300 font-mono-code bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">process.argv[2]</code> ile konsoldan parametre olarak alıp, matematiksel <code className="text-emerald-300 font-mono-code bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Alan = π × r²</code> formülü ile hesaplayan el emeği Node.JS çözümü.
              </p>
            </div>

            {/* Artisan Stamp Badge */}
            <div
              onClick={() => setIsArtisanModalOpen(true)}
              className="lg:shrink-0 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-black/80 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold font-handwriting text-xl group-hover:scale-105 transition-transform">
                  EÖ
                </div>
                <div>
                  <span className="text-[10px] text-amber-400/90 font-semibold uppercase tracking-wider block">
                    ✦ El Emeği Tasarım ✦
                  </span>
                  <div className="text-lg font-bold text-amber-200 font-handwriting">
                    Enes Öztürk
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Sertifikayı İncele</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Node.JS CLI Terminali</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'visualizer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>2. Geometri Simülatörü</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. Kaynak Kod (daireAlani.js)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. process.argv Rehberi</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>5. Test Paketi</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="transition-opacity duration-200">
          {activeTab === 'terminal' && <TerminalView />}
          {activeTab === 'visualizer' && <GeometryVisualizer />}
          {activeTab === 'code' && <CodeViewer />}
          {activeTab === 'guide' && <ExplanationGuide />}
          {activeTab === 'tests' && <TestRunner />}
        </div>

        {/* Bottom Educational Assignment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-1.5">
            <span className="text-amber-400 font-mono-code text-xs font-bold">01. Parametre Girişi</span>
            <h4 className="text-xs font-semibold text-slate-200">process.argv[2] Mantığı</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konsoldan <code className="text-amber-300 font-mono-code">node daireAlani.js 5</code> yazıldığında 5 değeri 2. indeksten String olarak alınır ve Number() ile dönüştürülür.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-1.5">
            <span className="text-emerald-400 font-mono-code text-xs font-bold">02. Matematiksel Formül</span>
            <h4 className="text-xs font-semibold text-slate-200">Math.PI * (r ** 2)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daire alanı, yarıçapın karesinin pi sabitiyle çarpımıdır. JavaScript'in yerleşik <code className="text-emerald-300 font-mono-code">Math.PI</code> kütüphanesi en yüksek hassasiyeti sunar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800 space-y-1.5">
            <span className="text-sky-400 font-mono-code text-xs font-bold">03. Konsol Çıktısı</span>
            <h4 className="text-xs font-semibold text-slate-200">Birebir Ödev Şablonu</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Konsola yazdırılan çıktı: <br />
              <code className="text-teal-300 font-mono-code text-[11px]">Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)</code> şeklinde tam olarak formatlanır.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Ödev 1: Node.JS Komut Satırı Kullanımı • Dairenin Alanı</span>
          </div>

          {/* Artisanal Signature */}
          <div className="flex items-center gap-2">
            <span>Hazırlayan & İmzalı:</span>
            <span className="font-handwriting text-lg text-amber-300 font-bold">
              Enes Öztürk
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400/80 text-[11px]">"El Emeği, Temiz Kod"</span>
          </div>
        </div>
      </footer>

      {/* Artisan Modal */}
      <ArtisanModal
        isOpen={isArtisanModalOpen}
        onClose={() => setIsArtisanModalOpen(false)}
      />
    </div>
  );
}
