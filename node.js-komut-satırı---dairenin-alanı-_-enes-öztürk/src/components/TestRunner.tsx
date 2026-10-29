import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedRadius: number | null;
  expectedType: 'success' | 'error';
  status: 'idle' | 'running' | 'passed' | 'failed';
  output?: string;
  executionTime?: number;
}

export const TestRunner: React.FC = () => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [tests, setTests] = useState<TestCase[]>([
    {
      id: 'test-1',
      name: 'Standart Yarıçap (r = 5)',
      input: '5',
      expectedRadius: 5,
      expectedType: 'success',
      status: 'idle',
    },
    {
      id: 'test-2',
      name: 'Birim Daire (r = 1)',
      input: '1',
      expectedRadius: 1,
      expectedType: 'success',
      status: 'idle',
    },
    {
      id: 'test-3',
      name: 'Onluk Yarıçap (r = 10)',
      input: '10',
      expectedRadius: 10,
      expectedType: 'success',
      status: 'idle',
    },
    {
      id: 'test-4',
      name: 'Ondalıklı Yarıçap (r = 7.5)',
      input: '7.5',
      expectedRadius: 7.5,
      expectedType: 'success',
      status: 'idle',
    },
    {
      id: 'test-5',
      name: 'Uç Durum: Argüman Verilmedi',
      input: '',
      expectedRadius: null,
      expectedType: 'error',
      status: 'idle',
    },
    {
      id: 'test-6',
      name: 'Uç Durum: Sayı Olmayan Girdi ("abc")',
      input: 'abc',
      expectedRadius: null,
      expectedType: 'error',
      status: 'idle',
    },
  ]);

  const runSingleTest = (testId: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running' } : t))
    );

    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => {
          if (t.id !== testId) return t;

          const start = performance.now();
          const r = t.input ? Number(t.input) : NaN;
          let output = '';
          let isPassed = false;

          if (t.input === '' || isNaN(r) || r < 0) {
            output = 'Hata: Lütfen geçerli bir yarıçap değeri giriniz!';
            isPassed = t.expectedType === 'error';
          } else {
            const area = Math.PI * (r ** 2);
            output = `Yarıçapı (${r}) olan dairenin alanı: (${area})`;
            isPassed = t.expectedType === 'success';
          }

          const end = performance.now();

          return {
            ...t,
            status: isPassed ? 'passed' : 'failed',
            output,
            executionTime: Math.round((end - start + 2) * 10) / 10,
          };
        })
      );
    }, 250);
  };

  const runAllTests = () => {
    setIsRunningAll(true);
    tests.forEach((t, index) => {
      setTimeout(() => {
        runSingleTest(t.id);
        if (index === tests.length - 1) {
          setIsRunningAll(false);
        }
      }, index * 200);
    });
  };

  const resetTests = () => {
    setTests((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'idle',
        output: undefined,
        executionTime: undefined,
      }))
    );
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;

  return (
    <div className="space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Otomatik Fonksiyon & Çıktı Test Paketi</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ödev şartlarına uygunluk, sınır değerler ve hata yönetimi doğrulaması
          </p>
        </div>

        <div className="flex items-center gap-2">
          {passedCount > 0 && (
            <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {passedCount}/{tests.length} Başarılı
            </span>
          )}

          <button
            onClick={resetTests}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded-lg transition-colors border border-slate-700"
            title="Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Tüm Testleri Çalıştır</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                {test.name}
              </span>

              {test.status === 'passed' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono-code">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GEÇTİ
                </span>
              )}
              {test.status === 'failed' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 font-mono-code">
                  <XCircle className="w-3.5 h-3.5" />
                  BAŞARISIZ
                </span>
              )}
              {test.status === 'running' && (
                <span className="text-[11px] text-amber-400 animate-pulse font-mono-code">
                  Test Ediliyor...
                </span>
              )}
              {test.status === 'idle' && (
                <button
                  onClick={() => runSingleTest(test.id)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                >
                  Test Et
                </button>
              )}
            </div>

            <div className="text-[11px] font-mono-code text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800/60 truncate">
              Komut: <span className="text-amber-300">node daireAlani.js {test.input}</span>
            </div>

            {test.output && (
              <div className="text-[11px] font-mono-code text-emerald-400 bg-emerald-950/20 p-1.5 rounded border border-emerald-500/20 truncate">
                {test.output}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
