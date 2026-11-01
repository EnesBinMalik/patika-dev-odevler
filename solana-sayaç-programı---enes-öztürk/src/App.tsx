/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { EnesSignatureBadge } from './components/EnesSignatureBadge';
import { SimulatorTab } from './components/SimulatorTab';
import { DiffViewerTab } from './components/DiffViewerTab';
import { SourceCodeTab } from './components/SourceCodeTab';
import { TestRunnerTab } from './components/TestRunnerTab';
import { TheoryGuideTab } from './components/TheoryGuideTab';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Signature & Verification Banner */}
        <EnesSignatureBadge />

        {/* Tab Content Viewport */}
        <div className="transition-opacity duration-200">
          {activeTab === 'simulator' && <SimulatorTab />}
          {activeTab === 'diff' && <DiffViewerTab />}
          {activeTab === 'source' && <SourceCodeTab />}
          {activeTab === 'tests' && <TestRunnerTab />}
          {activeTab === 'guide' && <TheoryGuideTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Solana Counter Smart Contract</span>
            <span>·</span>
            <span>Ödev Teslim Çözümü: Enes Öztürk</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('diff')}
              className="hover:text-slate-200 transition-colors"
            >
              Adım 1, 2, 3 İncele
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className="hover:text-slate-200 transition-colors"
            >
              Birim Testleri
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Kodları İndir
            </button>
          </div>
        </div>
      </footer>

      {/* Export / Download Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
