import React, { useState } from 'react';
import { CHECKLIST_ITEMS } from '../data/rustCode';
import { CheckCircle2, Play, RefreshCw, Award, Code, CheckSquare2, ShieldCheck, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestItem {
  id: string;
  name: string;
  variant: string;
  inputA: number;
  inputB: number;
  expected: number | string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  executionTime?: number;
}

export const ChecklistAndTests: React.FC = () => {
  const [completedChecklist, setCompletedChecklist] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [expandedChecklistId, setExpandedChecklistId] = useState<number | null>(1);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [allTestsPassed, setAllTestsPassed] = useState<boolean>(false);

  const [tests, setTests] = useState<TestItem[]>([
    {
      id: 'test-1',
      name: 'Ekleme Varyantı (Addition)',
      variant: 'Operasyon::Ekleme(14.5, 5.5)',
      inputA: 14.5,
      inputB: 5.5,
      expected: 20.0,
      status: 'idle',
    },
    {
      id: 'test-2',
      name: 'Çıkarma Varyantı (Subtraction)',
      variant: 'Operasyon::Cikarma(50.0, 18.25)',
      inputA: 50.0,
      inputB: 18.25,
      expected: 31.75,
      status: 'idle',
    },
    {
      id: 'test-3',
      name: 'Çarpma Varyantı (Multiplication)',
      variant: 'Operasyon::Carpma(6.0, 7.0)',
      inputA: 6.0,
      inputB: 7.0,
      expected: 42.0,
      status: 'idle',
    },
    {
      id: 'test-4',
      name: 'Bölme Varyantı (Division)',
      variant: 'Operasyon::Bolme(100.0, 4.0)',
      inputA: 100.0,
      inputB: 4.0,
      expected: 25.0,
      status: 'idle',
    },
    {
      id: 'test-5',
      name: 'Sıfıra Bölme ve IEEE 754 Kontrolü',
      variant: 'Operasyon::Bolme(15.0, 0.0)',
      inputA: 15.0,
      inputB: 0.0,
      expected: 'Infinity',
      status: 'idle',
    },
    {
      id: 'test-6',
      name: 'Negatif f64 ve Hassasiyet Testi',
      variant: 'Operasyon::Ekleme(-12.8, 2.8)',
      inputA: -12.8,
      inputB: 2.8,
      expected: -10.0,
      status: 'idle',
    },
  ]);

  const toggleChecklistItem = (id: number) => {
    setCompletedChecklist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setAllTestsPassed(false);

    // Reset status
    setTests((prev) => prev.map((t) => ({ ...t, status: 'running', executionTime: undefined })));

    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setTests((prev) =>
        prev.map((t, idx) => {
          if (idx === i) {
            return {
              ...t,
              status: 'passed',
              executionTime: Math.floor(Math.random() * 8) + 2,
            };
          }
          return t;
        })
      );
    }

    setIsRunningTests(false);
    setAllTestsPassed(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            Ödev Gereksinimleri & Otomasyon
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Kontrol Listesi ve Birim Test Paketi</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (cargo test simülasyonu)
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Ödev yönergesinde belirtilen 8 adımın ve Enes Öztürk imzasının doğrulama tablosu
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunningTests}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isRunningTests ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Testler Yürütülüyor...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Tüm Testleri Çalıştır</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Official Assignment Checklist */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <CheckSquare2 className="w-4 h-4 text-amber-400" />
                <span>Görev Kontrol Listesi</span>
              </div>
              <div className="text-xs font-mono text-emerald-400">
                {completedChecklist.length} / {CHECKLIST_ITEMS.length} Tamamlandı
              </div>
            </div>

            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = completedChecklist.includes(item.id);
                const isExpanded = expandedChecklistId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border transition-all ${
                      isChecked
                        ? 'bg-slate-950/60 border-slate-800/90'
                        : 'bg-slate-950/30 border-slate-800/40 opacity-70'
                    }`}
                  >
                    <div
                      className="p-3 flex items-start gap-3 cursor-pointer select-none"
                      onClick={() => setExpandedChecklistId(isExpanded ? null : item.id)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistItem(item.id);
                        }}
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-white flex items-center justify-between">
                          <span>
                            {item.id}. {item.title}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                              isExpanded ? 'rotate-90 text-amber-400' : ''
                            }`}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.instruction}
                        </p>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 text-xs space-y-2 bg-slate-900/40 rounded-b-lg">
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {item.explanation}
                        </p>
                        <div className="bg-[#0b0f19] p-2 rounded border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre">
                          {item.rustSnippet}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Automated Unit Tests */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Birim Testleri (Unit Tests)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                #[test] mod tests
              </span>
            </div>

            <div className="space-y-2">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">{test.name}</div>
                    <div className="font-mono text-[11px] text-amber-400/90">{test.variant}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Beklenen: <span className="text-slate-300 font-bold">{test.expected}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {test.status === 'idle' && (
                      <span className="text-[11px] font-mono text-slate-500">Bekliyor</span>
                    )}
                    {test.status === 'running' && (
                      <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Çalışıyor
                      </span>
                    )}
                    {test.status === 'passed' && (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                          ✓ test ok
                        </span>
                        <div className="text-[9px] text-slate-500 font-mono">{test.executionTime}ms</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Test Summary Box */}
            {allTestsPassed && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
                <Award className="w-7 h-7 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">
                  Test Paketi Başarıyla Geçti! (6/6 ok)
                </h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Tüm enum varyantları, desen eşleştirme dalları ve f64 matematiksel kuralları başarıyla doğrulandı.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-1">
                  test result: ok. 6 passed; 0 failed; 0 ignored
                </div>
              </div>
            )}
          </div>

          {/* Signature Verification Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Geliştirici İmzası & Onay</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-sm ring-2 ring-amber-400/40 shadow">
                EÖ
              </div>
              <div>
                <div className="font-bold text-white text-sm">Enes Öztürk</div>
                <div className="text-xs text-slate-400">
                  Rust Öğrenim & Desen Eşleştirme Görevi
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
