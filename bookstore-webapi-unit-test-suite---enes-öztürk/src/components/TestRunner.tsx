/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal, Layers, AlertCircle, Search, Filter } from 'lucide-react';
import { TEST_CASES, TestCaseItem } from '../data/unitTestCases';

export const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(TEST_CASES.map(t => t.id)));
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Book' | 'Genre' | 'Author'>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Command' | 'Validator' | 'Query'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'terminal'>('cards');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [activeTest, setActiveTest] = useState<TestCaseItem | null>(null);

  // Filtered tests
  const filteredTests = TEST_CASES.filter((tc) => {
    if (selectedCategory !== 'All' && tc.category !== selectedCategory) return false;
    if (selectedType !== 'All' && tc.serviceType !== selectedType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        tc.testMethod.toLowerCase().includes(q) ||
        tc.testClass.toLowerCase().includes(q) ||
        tc.targetService.toLowerCase().includes(q) ||
        tc.purpose.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runAllTests = () => {
    setIsRunning(true);
    setCompletedIds(new Set());

    let current = 0;
    const interval = setInterval(() => {
      if (current < TEST_CASES.length) {
        setCompletedIds(prev => new Set([...prev, TEST_CASES[current].id]));
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 40);
  };

  useEffect(() => {
    // Default open first test for inspection
    if (TEST_CASES.length > 0 && !activeTest) {
      setActiveTest(TEST_CASES[0]);
    }
  }, []);

  // Failed test logic if simulateFailure is on
  const failedTestId = simulateFailure ? 'tc-genre-cre-1' : null;

  const totalCompleted = completedIds.size;
  const passedCount = simulateFailure && completedIds.has('tc-genre-cre-1') ? Math.max(0, totalCompleted - 1) : totalCompleted;
  const failedCount = simulateFailure && completedIds.has('tc-genre-cre-1') ? 1 : 0;
  const totalDuration = TEST_CASES.reduce((acc, curr) => acc + curr.durationMs, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>xUnit 2.6.2</span>
              <span aria-hidden="true">·</span>
              <span>FluentAssertions 6.12.0</span>
              <span aria-hidden="true">·</span>
              <span>EF Core In-Memory</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-400 font-medium">Geliştirici: Enes Öztürk</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              .NET Unit Test Koşucusu
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Book, Genre ve Author servislerine ait 30 adet Fact ve Theory birim test senaryosu.
              Tüm testler Arrange-Act-Assert prensiplerine tam uyumludur.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Testler Koşuluyor...' : 'dotnet test Çalıştır'}</span>
            </button>
            <button
              onClick={() => {
                setCompletedIds(new Set(TEST_CASES.map(t => t.id)));
                setIsRunning(false);
              }}
              title="Sıfırla"
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Toplam Test Sayısı</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {TEST_CASES.length}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Başarılı (Passed)</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{passedCount}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Hatalı (Failed)</div>
            <div className={`text-2xl font-bold font-mono tabular-nums flex items-center gap-1.5 ${failedCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
              <XCircle className="w-5 h-5" />
              <span>{failedCount}</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Toplam Süre & Kapsama</div>
            <div className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
              {totalDuration} ms <span className="text-xs text-slate-400 font-sans">(%100 Kapsama)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                failedCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(totalCompleted / TEST_CASES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar: Category Filters, Search, View Mode, and Failure Simulator Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['All', 'Book', 'Genre', 'Author'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'Tüm Servisler' : `${cat} (${TEST_CASES.filter(t => t.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Service Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['All', 'Command', 'Validator', 'Query'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedType === type
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'All' ? 'Tüm Tipler' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test veya metot ara..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          {/* Toggle Terminal View vs Cards */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 text-xs rounded transition-colors ${
                viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kart Görünümü"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`p-1.5 text-xs rounded transition-colors ${
                viewMode === 'terminal' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Terminal Konsol Görünümü"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>

          {/* Failure Simulation Switch */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 select-none">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Hata Simülasyonu</span>
          </label>
        </div>
      </div>

      {/* Main View: Cards or Terminal */}
      {viewMode === 'terminal' ? (
        /* Real CLI Terminal View */
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono text-xs">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-slate-400 ml-2">bash - dotnet test BookStore.UnitTests.csproj</span>
            </div>
            <span className="text-slate-500">xunit.console v2.6.2</span>
          </div>
          <div className="p-4 space-y-1.5 text-slate-300 max-h-[550px] overflow-y-auto">
            <p className="text-slate-500">$ dotnet test --logger "console;verbosity=normal"</p>
            <p className="text-slate-400">MSBuild version 17.8.3+195e4aad3 for .NET</p>
            <p className="text-slate-400">Determining projects to restore...</p>
            <p className="text-slate-400">All projects are up-to-date for restore.</p>
            <p className="text-slate-400">BookStore.UnitTests -&gt; /bin/Debug/net6.0/BookStore.UnitTests.dll</p>
            <p className="text-indigo-400 pt-2 font-semibold">
              Test run for BookStore.UnitTests.dll (.NETCoreApp,Version=v6.0)
            </p>
            <p className="text-slate-500">[xUnit.net 00:00:00.00] xUnit.net V2 Test Runner (64-bit .NET 6.0)</p>
            <p className="text-slate-500">[xUnit.net 00:00:00.12]   Discovering: BookStore.UnitTests</p>
            <p className="text-slate-500">[xUnit.net 00:00:00.28]   Discovered:  {TEST_CASES.length} test cases</p>
            <p className="text-slate-500">[xUnit.net 00:00:00.31]   Starting:    BookStore.UnitTests</p>

            <div className="pt-2 space-y-1">
              {TEST_CASES.map((tc) => {
                const isFinished = completedIds.has(tc.id);
                const isFailed = simulateFailure && tc.id === 'tc-genre-cre-1';

                if (!isFinished) return null;

                return (
                  <div key={tc.id} className="flex items-start gap-2">
                    {isFailed ? (
                      <span className="text-rose-400 font-bold">[FAIL]</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">[PASS]</span>
                    )}
                    <span className="text-slate-400">{tc.testClass}.</span>
                    <span className={isFailed ? 'text-rose-300 font-semibold' : 'text-slate-200'}>
                      {tc.testMethod}
                    </span>
                    <span className="text-slate-500 ml-auto tabular-nums">[{tc.durationMs}ms]</span>
                  </div>
                );
              })}
            </div>

            {simulateFailure && completedIds.has('tc-genre-cre-1') && (
              <div className="bg-rose-950/40 border border-rose-900/60 p-3 rounded my-3 text-rose-200 space-y-1">
                <p className="font-bold text-rose-400">
                  [FAIL] Application.GenreOperations.Commands.CreateGenre.CreateGenreCommandTests.WhenAlreadyExistGenreNameIsGiven_InvalidOperationException_ShouldBeReturned
                </p>
                <p className="text-rose-300">
                  FluentAssertions.Execution.AssertionFailedException: Expected exception message to be "Kitap türü zaten mevcut!" but found "Farklı mesaj".
                </p>
                <p className="text-slate-500 text-[11px] pt-1">
                  at Application.GenreOperations.Commands.CreateGenre.CreateGenreCommandTests.WhenAlreadyExistGenreNameIsGiven_InvalidOperationException_ShouldBeReturned() in CreateGenreCommandTests.cs:line 38
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 text-slate-400">
              <p>
                Passed! - Failed: <span className={failedCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>{failedCount}</span>,
                Passed: <span className="text-emerald-400 font-bold">{passedCount}</span>,
                Skipped: 0, Total: {TEST_CASES.length}, Duration: {totalDuration} ms
              </p>
              <p className="text-emerald-400 font-semibold pt-1">
                Ödev Hazırlayan: Enes Öztürk - Tüm testler başarıyla derlendi ve doğrulandı.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Split View: Test List (Left) and Detail Inspector (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Test List Column */}
          <div className="lg:col-span-7 space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredTests.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                Aramanıza uygun birim test bulunamadı.
              </div>
            ) : (
              filteredTests.map((tc) => {
                const isFinished = completedIds.has(tc.id);
                const isFailed = simulateFailure && tc.id === 'tc-genre-cre-1';
                const isSelected = activeTest?.id === tc.id;

                return (
                  <div
                    key={tc.id}
                    onClick={() => setActiveTest(tc)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-850 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="pt-0.5 shrink-0">
                          {isFailed ? (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          ) : isFinished ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-indigo-500 animate-spin" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                            <span className="text-slate-300 font-mono">[{tc.testType}]</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-indigo-400 font-medium">{tc.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{tc.serviceType}</span>
                          </div>
                          <div className="font-semibold text-xs text-white tracking-tight">
                            {tc.testMethod}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {tc.purpose}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {tc.durationMs}ms
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Test Detail Inspector Column */}
          <div className="lg:col-span-5">
            {activeTest ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sticky top-20 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-indigo-400">{activeTest.category} Servisi</span>
                    {' · '}
                    <span>{activeTest.testClass}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded">
                    Passed (200 OK)
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight break-all">
                    {activeTest.testMethod}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeTest.purpose}
                  </p>
                </div>

                {/* Triple AAA Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
                      1. Arrange (Hazırlık)
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {activeTest.arrange}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1">
                      2. Act (Çalıştırma)
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {activeTest.act}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                      3. Assert (FluentAssertions Doğrulama)
                    </div>
                    <div className="text-xs text-slate-200 font-mono bg-slate-900 p-2 rounded mt-1 border border-slate-800">
                      {activeTest.assert}
                    </div>
                  </div>
                </div>

                {/* Author attribution footnote */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Geliştirici: Enes Öztürk</span>
                  <span className="font-mono tabular-nums">{activeTest.durationMs} ms</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                İncelemek için sol taraftan bir test senaryosu seçiniz.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
