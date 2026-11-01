/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { VisualMemoryArray } from './components/VisualMemoryArray.tsx';
import { OperationControls } from './components/OperationControls.tsx';
import { ConsoleOutput } from './components/ConsoleOutput.tsx';
import { CodeViewer } from './components/CodeViewer.tsx';
import { DocsAndAnalysis } from './components/DocsAndAnalysis.tsx';
import { MyListSim, StepAction } from './models/MyListEngine.ts';
import { 
  Sparkles, 
  Terminal, 
  CheckCircle, 
  Award, 
  Code2, 
  Layers, 
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'docs'>('visualizer');
  
  // Simulation Engine State
  const [sim, setSim] = useState<MyListSim<any>>(() => {
    // Start with prompt Scenario 1 initialized
    const initialSim = new MyListSim<number>();
    initialSim.add(10);
    initialSim.add(20);
    initialSim.add(30);
    initialSim.add(40);
    return initialSim;
  });

  const [dataSnapshot, setDataSnapshot] = useState<(any | null)[]>([]);
  const [size, setSize] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(10);
  const [lastAction, setLastAction] = useState<StepAction | undefined>(undefined);
  const [logs, setLogs] = useState<string[]>([
    "MyList<Integer> liste = new MyList<>();",
    "liste.add(10);",
    "liste.add(20);",
    "liste.add(30);",
    "liste.add(40);",
    "Dizideki Eleman Sayısı : 4",
    "Dizinin Kapasitesi : 10",
  ]);
  const [history, setHistory] = useState<StepAction[]>([]);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  const syncStateFromSim = useCallback((currentSim: MyListSim<any>) => {
    setDataSnapshot(currentSim.getDataSnapshot());
    setSize(currentSim.size());
    setCapacity(currentSim.getCapacity());
    const hist = [...currentSim.history];
    setHistory(hist);
    if (hist.length > 0) {
      setLastAction(hist[hist.length - 1]);
    }
  }, []);

  useEffect(() => {
    syncStateFromSim(sim);
  }, [sim, syncStateFromSim]);

  const handleStateChange = () => {
    syncStateFromSim(sim);
    const lastHist = sim.history[sim.history.length - 1];
    if (lastHist) {
      setLogs((prev) => [...prev, `${lastHist.description}${lastHist.returnValue !== undefined ? ` => ${lastHist.returnValue}` : ''}`]);
    }
  };

  const handleRunScenario = (scenarioNum: 1 | 2 | 3) => {
    setActiveScenario(scenarioNum);
    let result;

    if (scenarioNum === 1) {
      result = MyListSim.runScenario1();
    } else if (scenarioNum === 2) {
      result = MyListSim.runScenario2();
    } else {
      result = MyListSim.runScenario3();
    }

    setSim(result.sim);
    setLogs(result.logs);
    syncStateFromSim(result.sim);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header with Navigation and Copy/Download */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner with Enes Öztürk Signature */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">
              Generic Dinamik Dizi Koleksiyon Mimarisi
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-mono font-semibold">
              Kendi Liste Sınıfımızı Yazmak
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-500">Hazırlayan:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Enes Öztürk
            </span>
          </div>
        </div>

        {/* Tab 1: Visualizer & Live Interactive Simulator */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Visual RAM Memory Array */}
            <VisualMemoryArray
              data={dataSnapshot}
              size={size}
              capacity={capacity}
              lastAction={lastAction}
            />

            {/* Grid of Controls and Terminal Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left / Top: Interactive Operation Controls */}
              <div className="lg:col-span-7 space-y-4">
                <OperationControls
                  sim={sim}
                  onStateChange={handleStateChange}
                  onRunScenario={handleRunScenario}
                />
              </div>

              {/* Right / Bottom: Live Terminal & Console Output */}
              <div className="lg:col-span-5">
                <ConsoleOutput
                  logs={logs}
                  history={history}
                  onClearLogs={handleClearLogs}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Clean Java Source Code Viewer & Downloader */}
        {activeTab === 'code' && (
          <CodeViewer />
        )}

        {/* Tab 3: Documentation, Specification & Big-O Analysis */}
        {activeTab === 'docs' && (
          <DocsAndAnalysis />
        )}

      </main>

      {/* Signature Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-amber-400 font-bold">MyList&lt;T&gt;</span>
            <span>—</span>
            <span>Collection Kütüphanesiz Dinamik Dizi Sınıfı</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Geliştirici & İmza: <strong>Enes Öztürk</strong></span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono text-[11px]">Java SE Standartları</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
