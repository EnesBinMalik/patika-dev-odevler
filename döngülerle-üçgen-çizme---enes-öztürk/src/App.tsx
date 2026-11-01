import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InteractiveConsole } from './components/InteractiveConsole';
import { StepVisualizer } from './components/StepVisualizer';
import { MultiLanguageCode } from './components/MultiLanguageCode';
import { AssignmentReport } from './components/AssignmentReport';
import { CODE_SNIPPETS } from './utils/triangleGenerators';

export default function App() {
  const [activeTab, setActiveTab] = useState<'console' | 'trace' | 'code' | 'report'>('console');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleQuickCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS.javascript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onQuickCopy={handleQuickCopy}
        copied={copied}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'console' && (
          <InteractiveConsole
            onGoToTrace={() => setActiveTab('trace')}
            onGoToCode={() => setActiveTab('code')}
          />
        )}

        {activeTab === 'trace' && <StepVisualizer />}

        {activeTab === 'code' && <MultiLanguageCode />}

        {activeTab === 'report' && <AssignmentReport />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">ucgen(n) Fonksiyonu</span>
            <span aria-hidden="true">·</span>
            <span>While ve For Döngüleri Birlikte Kullanımı</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Ödev Sahibi: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Enes Öztürk</strong></span>
            <span aria-hidden="true">·</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
