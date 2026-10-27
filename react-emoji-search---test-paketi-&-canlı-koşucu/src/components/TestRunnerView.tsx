import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Code2,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TestCaseResult, TestSuiteSummary } from '../test-runner/testTypes';

interface TestRunnerViewProps {
  testCases: TestCaseResult[];
  summary: TestSuiteSummary;
  isRunning: boolean;
  onRunAll: () => void;
  onRunSingle: (testId: string) => void;
  onReset: () => void;
  onViewCode: () => void;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({
  testCases,
  summary,
  isRunning,
  onRunAll,
  onRunSingle,
  onReset,
  onViewCode,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'terminal'>('visual');
  const [expandedTestId, setExpandedTestId] = useState<string | null>('test-header');

  const allPassed = summary.passed === 4 && summary.failed === 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Test Status Control */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                Otomasyon & Test Merkezi
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">React Testing Library + Jest</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Emoji Search Birim Testleri
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              React dokümanlarındaki örnek Emoji Search projesine ait 4 temel gereksinimi canlı olarak test edin, kodları inceleyin ve test sonuçlarını gözlemleyin.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onReset}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
              title="Test durumlarını sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>

            <button
              type="button"
              onClick={onRunAll}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Testler Çalıştırılıyor...' : 'Tüm Testleri Koş (Run All)'}</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Toplam Test</span>
            <span className="text-xl font-bold text-slate-800 tabular-nums">4 Test Paketi</span>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <span className="text-xs text-emerald-700 block mb-1">Başarılı (Passed)</span>
            <span className="text-xl font-bold text-emerald-700 tabular-nums">
              {summary.passed} / 4
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Çalışma Süresi</span>
            <span className="text-xl font-bold text-slate-800 tabular-nums">
              {summary.durationMs} ms
            </span>
          </div>
          <div className="bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100">
            <span className="text-xs text-indigo-700 block mb-1">Geliştirici İmzası</span>
            <span className="text-sm font-bold text-indigo-900 truncate block">Enes Öztürk</span>
          </div>
        </div>

        {/* Success Alert when all passed */}
        {allPassed && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                Tüm Testler Başarıyla Tamamlandı! (4/4 Passed)
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Başlık render testi, ilk açılış 20 öğe render testi, arama filtreleme testi ve panoya kopyalama testi eksiksiz olarak doğrulandı.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs: Visual Suite vs Simulated Terminal */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Görsel Test Kartları
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Jest / Terminal Çıktısı</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onViewCode}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          <Code2 className="w-4 h-4" />
          <span>Test Kodunu Göster (.test.js)</span>
        </button>
      </div>

      {/* Visual Mode */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          {testCases.map((testCase) => {
            const isExpanded = expandedTestId === testCase.id;
            const isPass = testCase.status === 'passed';
            const isFail = testCase.status === 'failed';
            const isTestRunning = testCase.status === 'running';

            return (
              <div
                key={testCase.id}
                className={`bg-white rounded-xl border transition-all ${
                  isPass
                    ? 'border-emerald-200 shadow-xs'
                    : isFail
                    ? 'border-rose-200 shadow-xs'
                    : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {isPass ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isFail ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : isTestRunning ? (
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Gereksinim #{testCase.requirementNumber}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={`text-xs font-semibold ${
                            isPass
                              ? 'text-emerald-700'
                              : isFail
                              ? 'text-rose-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {isPass
                            ? 'BAŞARILI (PASS)'
                            : isFail
                            ? 'BAŞARISIZ (FAIL)'
                            : isTestRunning
                            ? 'KOŞUYOR...'
                            : 'BEKLİYOR'}
                        </span>
                        {testCase.durationMs > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-400 font-mono">
                              {testCase.durationMs}ms
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {testCase.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {testCase.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRunSingle(testCase.id)}
                      disabled={isRunning}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Tekil Koş
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedTestId(isExpanded ? null : testCase.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Detayları genişlet"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Assertions checklist */}
                <div className="px-5 pb-4">
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {testCase.assertions.map((assertion) => (
                      <div
                        key={assertion.id}
                        className="flex items-start justify-between gap-3 text-xs py-1"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              assertion.passed ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          <span className="text-slate-700 font-medium">
                            {assertion.name}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[11px] text-right truncate max-w-xs ${
                            assertion.passed ? 'text-emerald-700 font-medium' : 'text-slate-400'
                          }`}
                        >
                          {assertion.actual}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded details: Code snippet + explanation */}
                {isExpanded && (
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-b-xl border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Test Kaynak Kodu (Jest / React Testing Library)
                      </span>
                      <span>Enes Öztürk İmzasıyla</span>
                    </div>

                    <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-3.5 rounded-lg overflow-x-auto border border-slate-800/80 leading-relaxed">
                      <code>{testCase.codeSnippet}</code>
                    </pre>

                    <div className="mt-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                      <strong className="text-indigo-300 font-semibold block mb-0.5">
                        Neden bu test yazıldı ve nasıl çalışır?
                      </strong>
                      <p>{testCase.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Terminal Mode */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-5 font-mono text-xs shadow-lg overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-semibold text-slate-300">
                Terminal — npm test -- EmojiSearch.test.js
              </span>
            </div>
            <span>Enes Öztürk Test Ortamı</span>
          </div>

          <div className="space-y-2 py-2 leading-relaxed">
            <p className="text-slate-400">&gt; react-scripts test --watchAll=false EmojiSearch.test.js</p>
            <p className="mt-2">
              <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[11px] mr-2">
                PASS
              </span>
              <span className="text-slate-200">src/EmojiSearch.test.js</span>
            </p>
            <p className="text-slate-400 ml-4 font-semibold">
              React Emoji Search - Enes Öztürk Test Paketi
            </p>

            {testCases.map((tc) => (
              <div key={tc.id} className="ml-6 flex items-center gap-2">
                <span className={tc.status === 'passed' ? 'text-emerald-400' : 'text-slate-500'}>
                  {tc.status === 'passed' ? '✓' : '○'}
                </span>
                <span className={tc.status === 'passed' ? 'text-slate-200' : 'text-slate-400'}>
                  {tc.requirementNumber}. {tc.title}
                </span>
                {tc.durationMs > 0 && (
                  <span className="text-slate-500">({tc.durationMs} ms)</span>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-800 text-slate-400 space-y-1">
              <p>
                <span className="font-semibold text-slate-300">Test Suites: </span>
                <span className="text-emerald-400 font-bold">1 passed</span>, 1 total
              </p>
              <p>
                <span className="font-semibold text-slate-300">Tests:       </span>
                <span className="text-emerald-400 font-bold">{summary.passed} passed</span>,{' '}
                {summary.total} total
              </p>
              <p>
                <span className="font-semibold text-slate-300">Snapshots:   </span>
                0 total
              </p>
              <p>
                <span className="font-semibold text-slate-300">Time:        </span>
                {(summary.durationMs / 1000 + 0.85).toFixed(3)} s
              </p>
              <p className="text-emerald-400 pt-2 font-semibold">
                Ran all test suites related to &quot;EmojiSearch.test.js&quot;.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
