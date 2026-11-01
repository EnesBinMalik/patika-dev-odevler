import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationTab } from './components/SimulationTab';
import { CodeViewerTab } from './components/CodeViewerTab';
import { TerminalTab } from './components/TerminalTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { ReportTab } from './components/ReportTab';
import { AppTab } from './types';
import { Cpu, FileCode2, Terminal, GitBranch, FileText, CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('simulation');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'simulation' && (
          <SimulationTab onGoToCode={() => setActiveTab('code')} />
        )}

        {activeTab === 'code' && <CodeViewerTab />}

        {activeTab === 'terminal' && <TerminalTab />}

        {activeTab === 'architecture' && <ArchitectureTab />}

        {activeTab === 'report' && <ReportTab />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-mono text-[10px] font-bold">
              10K
            </div>
            <span>
              Java Multithreading Ödevi &bull; 1-10000 Arası Sayıların 4 Thread ile Ayrıştırılması
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-200">
              <span className="text-slate-400">Hazırlayan & İmza:</span>
              <strong className="text-amber-400 font-semibold">Enes Öztürk</strong>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
