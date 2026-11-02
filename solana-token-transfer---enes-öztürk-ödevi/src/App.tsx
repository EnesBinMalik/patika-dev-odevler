import React, { useState } from 'react';
import { Header } from './components/Header';
import { AssignmentGuide } from './components/AssignmentGuide';
import { CodeViewer } from './components/CodeViewer';
import { CargoTerminal } from './components/CargoTerminal';
import { TokenTransferSimulator } from './components/TokenTransferSimulator';
import { SubmissionModal } from './components/SubmissionModal';
import { AssignmentMode } from './types';
import { BookOpen, Code2, Terminal, Coins, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('guide');
  const [currentMode, setCurrentMode] = useState<AssignmentMode>('step1');
  const [isSubmissionOpen, setIsSubmissionOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* 3-Zone Standard Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmission={() => setIsSubmissionOpen(true)}
      />

      {/* Secondary Mobile/Tablet Tab Bar */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/50 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Rehber
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Rust Kodu
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'test' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Cargo Test
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'simulator' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
          }`}
        >
          Simülatör
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb / Mode Pills */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Solana Anchor</span>
            <span aria-hidden="true">/</span>
            <span>Token Transfer Programı</span>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium capitalize">
              {activeTab === 'guide'
                ? 'Ödev Rehberi'
                : activeTab === 'code'
                ? 'Akıllı Sözleşme Kodu'
                : activeTab === 'test'
                ? 'Cargo Test Terminali'
                : 'Canlı Simülatör'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Aktif Çözüm:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[11px] font-semibold">
              {currentMode === 'step1'
                ? 'Adım 1: Sabit Miktar (50)'
                : currentMode === 'optional'
                ? 'Opsiyonel: Girdi + Enes Öztürk İmzalı'
                : 'Önceki: Hatalı Tüm Bakiye'}
            </span>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'guide' && (
          <AssignmentGuide
            currentMode={currentMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'code' && (
          <CodeViewer
            currentMode={currentMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {activeTab === 'test' && (
          <CargoTerminal
            currentMode={currentMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {activeTab === 'simulator' && (
          <TokenTransferSimulator
            currentMode={currentMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
          />
        )}
      </main>

      {/* Clean Footer with Enes Öztürk Signature and Metadata */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">
              Bu ödev projesi <strong>Enes Öztürk</strong> imzalı olarak hazırlanmış ve doğrulanmıştır.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Solana Anchor v0.29.0</span>
            <span aria-hidden="true">·</span>
            <span>SPL Token CPI</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">cargo test: PASSED</span>
          </div>
        </div>
      </footer>

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
      />
    </div>
  );
}
