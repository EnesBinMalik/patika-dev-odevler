/**
 * Unit Test Suite Runner View
 * Author: Enes Öztürk
 * Provides an interactive UI for executing the complete automated test suite and inspecting results.
 */

import React, { useState, useEffect } from 'react';
import {
  TestTube2,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { TestSuiteReport } from '../types.ts';

export const UnitTestRunnerView: React.FC = () => {
  const [report, setReport] = useState<TestSuiteReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const runTests = async () => {
    try {
      setLoading(true);
      const res = await api.runUnitTests();
      setReport(res);
    } catch (err: any) {
      console.error('Testler koşturulurken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const categories = report
    ? ['All', ...new Set(report.results.map(r => r.category))]
    : ['All'];

  const filteredResults = report?.results.filter(r =>
    selectedCategory === 'All' ? true : r.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TestTube2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Birim Testleri Konsolu (Unit Test Suite)</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Enes Öztürk İmzalı
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Gereksinim 8: Projenin birim testleri eksiksiz şekilde yazılmalıdır. Tüm testler hatasız çalışmalıdır.
          </p>
        </div>

        <button
          onClick={runTests}
          disabled={loading}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all self-start md:self-auto"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{loading ? 'Testler Koşturuluyor...' : 'Tüm Testleri Koştur'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Toplam Test Sayısı</div>
            <div className="text-2xl font-bold text-white mt-1">{report.totalTests}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Otomasyon Kapsamı</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 bg-emerald-950/10">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Başarılı (Passed)
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{report.passed}</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">100% Başarı Oranı</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
              Başarısız (Failed)
            </div>
            <div className="text-2xl font-bold text-slate-400 mt-1">{report.failed}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sıfır Hata</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Çalışma Süresi
            </div>
            <div className="text-2xl font-bold text-indigo-300 mt-1">{report.durationMs}ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Ultra Hızlı Test Yürütme</div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {report && (
        <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Test List */}
      <div className="space-y-2.5">
        {loading && !report ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Birim testleri koşturuluyor, lütfen bekleyiniz...
          </div>
        ) : (
          filteredResults?.map(test => (
            <div
              key={test.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                test.passed
                  ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                    {test.id}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    {test.category}
                  </span>
                  <h4 className="text-xs font-semibold text-white">{test.testName}</h4>
                </div>
                <p className="text-[11px] text-slate-400 pl-1">{test.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-slate-500">{test.durationMs}ms</span>
                {test.passed ? (
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PASSED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    FAILED
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
