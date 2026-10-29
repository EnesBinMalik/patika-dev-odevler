/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TerminalView } from './components/TerminalView';
import { CodeViewer } from './components/CodeViewer';
import { CircleVisualizer } from './components/CircleVisualizer';
import { ChecklistView } from './components/ChecklistView';
import { CODE_FILES } from './data/codeFiles';
import {
  Terminal as TerminalIcon,
  Code2,
  Circle,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Github,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'code' | 'visual' | 'rubric'>('terminal');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('node odev3/index.js');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadAll = () => {
    CODE_FILES.slice(0, 2).forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient decorative glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md shadow-emerald-500/20">
              <Circle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Node.js Ödev 3
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">Patika.dev</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Daire Modüler Dosyası (circle.js & index.js)
              </h1>
            </div>
          </div>

          {/* Author Badge & Fast Download */}
          <div className="flex items-center gap-3">
            {/* Signature Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                EÖ
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block leading-none">İmza</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono leading-tight">
                  Enes Öztürk
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadAll}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/15 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.js Dosyalarını İndir</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-800/60 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'terminal'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <TerminalIcon className="w-4 h-4" />
              <span>Canlı Konsol Çıktısı (r = 5)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Modül Kodları (circle.js & index.js)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'visual'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Circle className="w-4 h-4" />
              <span>Geometrik Model & Formüller</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rubric')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'rubric'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ödev Kriterleri Kontrol Listesi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quick Intro Card */}
        <div className="mb-6 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                Ödev 3 Başarıyla Hazırlandı
              </h2>
              <p className="text-xs text-slate-400">
                <span className="font-mono text-emerald-400 font-semibold">circle.js</span> dosyasında{' '}
                <code className="text-slate-200 font-mono">circleArea</code> ve{' '}
                <code className="text-slate-200 font-mono">circleCircumference</code> fonksiyonları tanımlandı,{' '}
                <code className="text-emerald-400 font-mono">module.exports</code> ile export edildi.{' '}
                <span className="font-mono text-cyan-400 font-semibold">index.js</span> dosyasında{' '}
                <code className="text-cyan-300 font-mono">require</code> ve{' '}
                <code className="text-cyan-300 font-mono">object destructuring</code> ile alınıp yarıçap{' '}
                <span className="text-emerald-400 font-bold font-mono">r = 5</span> için konsola yazdırıldı.
              </p>
            </div>
          </div>

          {/* Quick CLI command pill */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono ml-auto">
            <span className="text-slate-500">$</span>
            <span className="text-slate-300 font-semibold">node odev3/index.js</span>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="p-1 hover:text-emerald-400 text-slate-400 transition-colors ml-1"
              title="Komutu kopyala"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tab Body */}
        {activeTab === 'terminal' && <TerminalView initialRadius={5} />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'visual' && <CircleVisualizer />}
        {activeTab === 'rubric' && <ChecklistView />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Node.js Ödev 3: Daire Modüler Dosyası — Hazırlayan:{' '}
              <strong className="text-slate-300 font-mono font-semibold">Enes Öztürk</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>CommonJS (module.exports & require)</span>
            <span>•</span>
            <span>Object Destructuring</span>
            <span>•</span>
            <span>r = 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
