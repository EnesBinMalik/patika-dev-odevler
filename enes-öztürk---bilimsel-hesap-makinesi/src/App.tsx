/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ
 */

import React, { useState } from 'react';
import { CalculatorTab } from './types/calculator';
import { Header } from './components/Header';
import { ScientificKeypad } from './components/ScientificKeypad';
import { CalculusLab } from './components/CalculusLab';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { JavaConsoleSimulator } from './components/JavaConsoleSimulator';
import { AlgorithmExplainer } from './components/AlgorithmExplainer';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('calculator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar with Brand & Navigation */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'calculator' && (
          <ScientificKeypad onSelectCalculusTab={() => setActiveTab('calculus')} />
        )}

        {activeTab === 'calculus' && (
          <CalculusLab />
        )}

        {activeTab === 'java-code' && (
          <JavaCodeViewer />
        )}

        {activeTab === 'terminal' && (
          <JavaConsoleSimulator />
        )}

        {activeTab === 'algorithms' && (
          <AlgorithmExplainer />
        )}
      </main>

      {/* Clean Footer with Signature */}
      <Footer />
    </div>
  );
}
