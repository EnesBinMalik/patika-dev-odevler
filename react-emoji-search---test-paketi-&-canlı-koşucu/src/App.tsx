/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * @author Enes Öztürk
 * @description React Emoji Search - Uygulama ve Kapsamlı Test Paketi
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { EmojiResults } from './components/EmojiResults';
import { filterEmoji, EmojiItem } from './utils/filterEmoji';
import { TestRunnerView } from './components/TestRunnerView';
import { CodeViewer } from './components/CodeViewer';
import { AuthorSignatureModal } from './components/AuthorSignatureModal';
import { initialTestCases } from './test-runner/testData';
import { runSingleTest } from './test-runner/testExecutor';
import { TestCaseResult, TestSuiteSummary } from './test-runner/testTypes';
import {
  Play,
  CheckCircle2,
  Terminal,
  Code2,
  Columns2,
  Sparkles,
  Award,
  Layers,
  Heart,
  Smile,
  Zap,
} from 'lucide-react';

type ActiveView = 'app' | 'runner' | 'code' | 'split';

export default function App() {
  // Emoji Search state
  const [searchText, setSearchText] = useState('');
  const [copiedToast, setCopiedToast] = useState<{ symbol: string; title: string } | null>(null);

  // Active View state
  const [activeView, setActiveView] = useState<ActiveView>('app');

  // Test Runner state
  const [testCases, setTestCases] = useState<TestCaseResult[]>(initialTestCases);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary>({
    total: 4,
    passed: 0,
    failed: 0,
    durationMs: 0,
    lastRunAt: null,
  });

  // Author Modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Filtered emoji results (matches standard 20 items limit)
  const filteredEmojis = useMemo<EmojiItem[]>(() => {
    return filterEmoji(searchText, 20);
  }, [searchText]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleCopySuccess = (symbol: string, title: string) => {
    setCopiedToast({ symbol, title });
    setTimeout(() => {
      setCopiedToast((current) => (current?.symbol === symbol ? null : current));
    }, 2200);
  };

  // Run all tests sequentially with visual progress
  const handleRunAllTests = async () => {
    if (isRunningTests) return;
    setIsRunningTests(true);

    let updatedCases = [...testCases];
    let totalDuration = 0;
    let passedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < updatedCases.length; i++) {
      const tc = updatedCases[i];
      // Mark as running
      updatedCases[i] = { ...tc, status: 'running' };
      setTestCases([...updatedCases]);

      // Small delay for natural execution feel
      await new Promise((resolve) => setTimeout(resolve, 80));

      // Run actual test
      const result = await runSingleTest(tc.id, updatedCases);
      updatedCases[i] = result;
      totalDuration += result.durationMs;

      if (result.status === 'passed') passedCount++;
      if (result.status === 'failed') failedCount++;

      setTestCases([...updatedCases]);
    }

    setTestSummary({
      total: 4,
      passed: passedCount,
      failed: failedCount,
      durationMs: totalDuration,
      lastRunAt: new Date().toLocaleTimeString('tr-TR'),
    });

    setIsRunningTests(false);
  };

  // Run a single test
  const handleRunSingleTest = async (testId: string) => {
    if (isRunningTests) return;

    setTestCases((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running' } : t))
    );

    const result = await runSingleTest(testId, testCases);

    setTestCases((prev) => {
      const next = prev.map((t) => (t.id === testId ? result : t));
      const passed = next.filter((t) => t.status === 'passed').length;
      const failed = next.filter((t) => t.status === 'failed').length;
      setTestSummary({
        total: 4,
        passed,
        failed,
        durationMs: next.reduce((acc, c) => acc + c.durationMs, 0),
        lastRunAt: new Date().toLocaleTimeString('tr-TR'),
      });
      return next;
    });
  };

  const handleResetTests = () => {
    setTestCases(initialTestCases);
    setTestSummary({
      total: 4,
      passed: 0,
      failed: 0,
      durationMs: 0,
      lastRunAt: null,
    });
  };

  // Preset search chips
  const quickFilters = ['Joy', 'Heart', 'Cat', '100', 'Smile', 'Fire'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Bar following Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand element */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-2xl select-none" role="img" aria-label="smiling cat">
              😸
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              React Emoji Search
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
              Enes Öztürk
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveView('app')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'app'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Uygulama
            </button>
            <button
              type="button"
              onClick={() => setActiveView('runner')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'runner'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Test Koşucu</span>
              {testSummary.passed > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                  {testSummary.passed}/4
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('code')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'code'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Test Kodları</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('split')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'split'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>İkili Görünüm</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSignatureModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Enes Öztürk İmzası</span>
            </button>
            <button
              type="button"
              onClick={handleRunAllTests}
              disabled={isRunningTests}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Koşuluyor...' : 'Testleri Başlat'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 px-2 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('app')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeView === 'app' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Uygulama
          </button>
          <button
            type="button"
            onClick={() => setActiveView('runner')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeView === 'runner' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Testler {testSummary.passed > 0 && `(${testSummary.passed}/4)`}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('code')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeView === 'code' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Kod (.test.js)
          </button>
          <button
            type="button"
            onClick={() => setActiveView('split')}
            className={`px-2.5 py-1 rounded-md font-medium ${
              activeView === 'split' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            İkili
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: Pure Emoji Search Application */}
        {activeView === 'app' && (
          <div className="max-w-2xl mx-auto">
            {/* Standard Header Component */}
            <Header />

            {/* Sub-kicker & quick stats */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6 text-center">
              <span>Toplam 50+ Emoji Verisi</span>
              <span aria-hidden="true">·</span>
              <span>Maksimum 20 Sonuç Gösterimi</span>
              <span aria-hidden="true">·</span>
              <span>Tek Tıkla Panoya Kopyalama</span>
            </div>

            {/* Search Input Component */}
            <SearchInput
              value={searchText}
              textChange={handleSearchChange}
              onClear={() => setSearchText('')}
            />

            {/* Quick Filter Tags (Functional Buttons) */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-500">Hızlı Filtreler:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {quickFilters.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => setSearchText(keyword)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      searchText.toLowerCase() === keyword.toLowerCase()
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Component */}
            <EmojiResults
              emojiData={filteredEmojis}
              onCopySuccess={handleCopySuccess}
            />

            {/* Live Copy Feedback Toast */}
            {copiedToast && (
              <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <span className="text-2xl">{copiedToast.symbol}</span>
                <div className="text-xs">
                  <p className="font-bold text-emerald-400">Panoya Kopyalandı!</p>
                  <p className="text-slate-300">{copiedToast.title}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Interactive Test Runner */}
        {activeView === 'runner' && (
          <div className="max-w-4xl mx-auto">
            <TestRunnerView
              testCases={testCases}
              summary={testSummary}
              isRunning={isRunningTests}
              onRunAll={handleRunAllTests}
              onRunSingle={handleRunSingleTest}
              onReset={handleResetTests}
              onViewCode={() => setActiveView('code')}
            />
          </div>
        )}

        {/* VIEW 3: Test Code Viewer (.test.js / .test.tsx) */}
        {activeView === 'code' && (
          <div className="max-w-4xl mx-auto">
            <CodeViewer />
          </div>
        )}

        {/* VIEW 4: Split Screen View */}
        {activeView === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Emoji Search App */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Canlı Uygulama Alanı
                </span>
                <span className="text-xs text-slate-400">Etkileşimli Önizleme</span>
              </div>

              <Header />

              <SearchInput
                value={searchText}
                textChange={handleSearchChange}
                onClear={() => setSearchText('')}
              />

              <EmojiResults
                emojiData={filteredEmojis}
                onCopySuccess={handleCopySuccess}
              />
            </div>

            {/* Right Column: Live Test Runner */}
            <div className="lg:col-span-6">
              <TestRunnerView
                testCases={testCases}
                summary={testSummary}
                isRunning={isRunningTests}
                onRunAll={handleRunAllTests}
                onRunSingle={handleRunSingleTest}
                onReset={handleResetTests}
                onViewCode={() => setActiveView('code')}
              />
            </div>
          </div>
        )}
      </main>

      {/* Signature & Ethical Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">React Emoji Search</span>
              <span>·</span>
              <span>Geliştirici & Test Mühendisi: <strong className="text-indigo-600 font-bold">Enes Öztürk</strong></span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSignatureModalOpen(true)}
                className="hover:text-indigo-600 transition-colors cursor-pointer font-medium"
              >
                Etik Test Beyanı
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setActiveView('code')}
                className="hover:text-indigo-600 transition-colors cursor-pointer font-medium"
              >
                EmojiSearch.test.js İndir
              </button>
              <span>·</span>
              <span>© 2026 Enes Öztürk</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Author Modal */}
      <AuthorSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
      />
    </div>
  );
}
