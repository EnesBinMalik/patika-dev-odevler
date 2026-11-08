import React, { useState } from 'react';
import { bankingEngineInstance } from './services/bankingEngine';
import { Header } from './components/Header';
import { TerminalView } from './components/TerminalView';
import { Module1Accounts } from './components/Module1Accounts';
import { Module2DataStructures } from './components/Module2DataStructures';
import { Module3CreditRisk } from './components/Module3CreditRisk';
import { Module4LoggingGit } from './components/Module4LoggingGit';
import { ArchitectureView } from './components/ArchitectureView';
import { LinkedInShareModal } from './components/LinkedInShareModal';
import { Shield, Layers, Sparkles, GitBranch, Terminal, Share2, Code2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('terminal');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);
  const [, setTick] = useState<number>(0);

  const forceRefresh = () => {
    setTick((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar Contract compliant with Frontend Design skill */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'terminal' && (
          <TerminalView
            engine={bankingEngineInstance}
            onRefresh={forceRefresh}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'module1' && (
          <Module1Accounts
            engine={bankingEngineInstance}
            onRefresh={forceRefresh}
          />
        )}

        {activeTab === 'module2' && (
          <Module2DataStructures
            engine={bankingEngineInstance}
            onRefresh={forceRefresh}
          />
        )}

        {activeTab === 'module3' && (
          <Module3CreditRisk
            engine={bankingEngineInstance}
            onRefresh={forceRefresh}
          />
        )}

        {activeTab === 'module4' && (
          <Module4LoggingGit
            engine={bankingEngineInstance}
            onRefresh={forceRefresh}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Footer with Developer Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs font-mono text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">SmartBanking.Core</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Enes Öztürk İmzalı</span>
            <span aria-hidden="true">·</span>
            <span>.NET 9 Clean Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>C# 12</span>
            <span>OOP & Encapsulation</span>
            <span>Stack & Queue</span>
            <span>BDDK DTI Risk Engine</span>
          </div>
        </div>
      </footer>

      {/* LinkedIn Post & Screenshot Generator Modal */}
      <LinkedInShareModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />
    </div>
  );
}
