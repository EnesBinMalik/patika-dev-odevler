/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { VisualSimulator } from './components/VisualSimulator';
import { TerminalSimulator } from './components/TerminalSimulator';
import { CodeViewer } from './components/CodeViewer';
import { ChecklistAndTests } from './components/ChecklistAndTests';
import { TheoryGuide } from './components/TheoryGuide';
import { Footer } from './components/Footer';
import { Calculator, Terminal, Code2, CheckSquare, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'terminal' | 'code' | 'checklist' | 'theory'>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Quick Assignment Context Strip */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-amber-300 font-semibold">Görev Amacı:</span>
            <span className="text-slate-300">
              Enumlar ve desen eşleştirme (pattern matching) kullanarak temel aritmetik işlemleri yapan hesap makinesi.
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] text-amber-400 font-medium">
            <span>İmza:</span>
            <span className="text-white font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Enes Öztürk
            </span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'simulator' && <VisualSimulator />}
        {activeTab === 'terminal' && <TerminalSimulator />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'checklist' && <ChecklistAndTests />}
        {activeTab === 'theory' && <TheoryGuide />}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
