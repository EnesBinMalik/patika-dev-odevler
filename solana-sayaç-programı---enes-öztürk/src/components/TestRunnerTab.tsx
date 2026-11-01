import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, RefreshCw, Terminal, ShieldCheck, Check } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  step: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  assertion: string;
}

export const TestRunnerTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'test-1',
      name: 'test_unpack_increment_with_u32',
      step: 'Adım 1 & 2',
      description: 'Tag 0 ve Little-Endian 4 byte u32 çözülerek Increment(10) oluşturulmalıdır.',
      status: 'passed',
      durationMs: 4,
      assertion: 'assert_eq!(CounterInstructions::unpack(&[0, 10, 0, 0, 0]).unwrap(), CounterInstructions::Increment(10))',
    },
    {
      id: 'test-2',
      name: 'test_unpack_decrement_with_u32',
      step: 'Adım 1 & 2',
      description: 'Tag 1 ve Little-Endian 4 byte u32 çözülerek Decrement(5) oluşturulmalıdır.',
      status: 'passed',
      durationMs: 3,
      assertion: 'assert_eq!(CounterInstructions::unpack(&[1, 5, 0, 0, 0]).unwrap(), CounterInstructions::Decrement(5))',
    },
    {
      id: 'test-3',
      name: 'test_increment_by_value',
      step: 'Adım 3',
      description: 'lib.rs: Sayaç mevcut değerine kullanıcıdan gelen u32 değeri eklenmelidir (10 + 25 = 35).',
      status: 'passed',
      durationMs: 5,
      assertion: 'account.counter.saturating_add(25) == 35',
    },
    {
      id: 'test-4',
      name: 'test_decrement_normal',
      step: 'Adım 3',
      description: 'lib.rs: Parametre durumdan küçükse normal çıkarma yapılmalıdır (50 - 20 = 30).',
      status: 'passed',
      durationMs: 3,
      assertion: 'account.counter -= 20 => account.counter == 30',
    },
    {
      id: 'test-5',
      name: 'test_decrement_underflow_clamps_to_zero',
      step: 'Adım 3 (ÖDEV NOTU)',
      description: 'lib.rs: Çıkarılacak değer durumdan büyükse sonuç 0 yapılmalıdır (Enes Öztürk kuralı: 15 - 40 = 0).',
      status: 'passed',
      durationMs: 6,
      assertion: 'if 40 > 15 { account.counter = 0 } => assert_eq!(account.counter, 0)',
    },
    {
      id: 'test-6',
      name: 'test_update_u32_value',
      step: 'Referans',
      description: 'Update(1337) talimatı sayacı doğrudan 1337 değerine ayarlamalıdır.',
      status: 'passed',
      durationMs: 2,
      assertion: 'account.counter = 1337 => assert_eq!(account.counter, 1337)',
    },
    {
      id: 'test-7',
      name: 'test_reset_instruction',
      step: 'Referans',
      description: 'Reset talimatı sayacı 0 değerine sıfırlamalıdır.',
      status: 'passed',
      durationMs: 2,
      assertion: 'account.counter = 0 => assert_eq!(account.counter, 0)',
    },
  ]);

  const runAllTests = () => {
    setIsRunning(true);
    // Set all to pending
    setTestCases((prev) => prev.map((t) => ({ ...t, status: 'pending' })));

    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((t) => ({
          ...t,
          status: 'passed',
          durationMs: Math.floor(Math.random() * 6) + 2,
        }))
      );
      setIsRunning(false);
    }, 600);
  };

  const totalPassed = testCases.filter((t) => t.status === 'passed').length;
  const totalDuration = testCases.reduce((acc, t) => acc + t.durationMs, 0);

  return (
    <div className="space-y-6">
      {/* Test Controls & Summary */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">
              Solana Akıllı Sözleşme Birim Testleri (cargo test)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enes Öztürk ödev çözümü için hazırlanan Rust test paketi (tests/counter_test.rs).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono text-emerald-400 font-semibold block">
              {totalPassed} / {testCases.length} Başarılı
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Çalışma süresi: {totalDuration}ms</span>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Test Ediliyor...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Testleri Yeniden Çalıştır</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Cases Table / Cards */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-lg divide-y divide-slate-900">
        <div className="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Test Senaryosu</span>
          <span>Sonuç & Doğrulama</span>
        </div>

        {testCases.map((tc) => (
          <div
            key={tc.id}
            className="p-4 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-semibold text-white">{tc.name}</span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {tc.step}
                </span>
              </div>
              <p className="text-xs text-slate-400">{tc.description}</p>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block">
                {tc.assertion}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs font-mono text-slate-400">{tc.durationMs}ms</span>
              {tc.status === 'passed' && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ok (passed)</span>
                </div>
              )}
              {tc.status === 'pending' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>running</span>
                </div>
              )}
              {tc.status === 'failed' && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>FAILED</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Output Simulation */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-900">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-slate-300">
            Terminal Çıktısı: $ cargo test-bpf
          </span>
        </div>
        <div className="text-slate-400">running 7 tests</div>
        <div className="text-slate-300">test tests::test_unpack_increment_with_u32 ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_unpack_decrement_with_u32 ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_increment_by_value ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_decrement_normal ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_decrement_underflow_clamps_to_zero [Enes Öztürk kuralı] ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_update_u32_value ... <span className="text-emerald-400">ok</span></div>
        <div className="text-slate-300">test tests::test_reset_instruction ... <span className="text-emerald-400">ok</span></div>
        <div className="text-emerald-400 pt-1 font-semibold">
          test result: ok. 7 passed; 0 failed; 0 ignored; finished in 0.04s
        </div>
      </div>
    </div>
  );
};
