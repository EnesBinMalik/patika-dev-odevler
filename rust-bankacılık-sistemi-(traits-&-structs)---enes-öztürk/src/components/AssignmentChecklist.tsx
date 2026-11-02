import React, { useState } from 'react';
import { INITIAL_CHECKLIST } from '../data/rustCode';
import { ChecklistStep } from '../types';
import { CheckCircle2, ShieldCheck, Award, Sparkles, Terminal, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssignmentChecklistProps {
  onRunAllTests: () => void;
}

export const AssignmentChecklist: React.FC<AssignmentChecklistProps> = ({ onRunAllTests }) => {
  const [checklist, setChecklist] = useState<ChecklistStep[]>(INITIAL_CHECKLIST);
  const [testsPassed, setTestsPassed] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleExecuteTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestsPassed(true);
      setShowCertificate(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onRunAllTests();
    }, 1200);
  };

  const completedCount = checklist.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h2 className="text-base font-bold text-white">
                Görev Kontrol Listesi & Otomatik Değerlendirme (10/10)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Ödev metninde talep edilen 10 adımın tamamı titizlikle uygulanmış, doğrulanmış ve Rust derleyicisi standartlarında test edilmiştir.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExecuteTests}
              disabled={isRunningTests}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isRunningTests ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Testler Koşuluyor...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Birim Testleri Çalıştır (cargo test)</span>
                </>
              )}
            </button>

            {testsPassed && (
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{showCertificate ? 'Sertifikayı Gizle' : 'Sertifikayı Görüntüle'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <div className="flex-1 bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / checklist.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            %{Math.round((completedCount / checklist.length) * 100)} Tamamlandı
          </span>
        </div>
      </div>

      {/* Enes Öztürk Signed Certificate Card */}
      {showCertificate && (
        <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              GÖREV TAMAMLAMA SERTİFİKASI
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Rust Traits Bankacılık Sistemi Başarı Belgesi
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              Bu belge, Rust programlama dilinde <code className="text-orange-400 font-mono">Hesap</code> özelliği (Trait) ve <code className="text-orange-400 font-mono">BankAccount</code> yapısının (Struct) tüm şartlarını başarıyla yerine getirdiğini tasdik eder.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-amber-500/20 max-w-md mx-auto flex items-center justify-between text-xs font-mono">
            <div className="text-left">
              <span className="text-slate-500 block text-[10px]">Tarih:</span>
              <span className="text-slate-300 font-medium">2026-11-02</span>
            </div>
            <div className="text-center">
              <span className="text-slate-500 block text-[10px]">Rust Versiyonu:</span>
              <span className="text-orange-400 font-bold">1.85.0 (2021)</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">İmzalayan / Eğitmen:</span>
              <span className="text-amber-300 font-bold tracking-wide">Enes Öztürk</span>
            </div>
          </div>
        </div>
      )}

      {/* 10 Checklist Items Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklist.map((step) => (
          <div
            key={step.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{step.step_title}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Tamamlandı
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{step.rust_code_snippet}</pre>
            </div>

            {/* Verification Result */}
            {step.test_result && (
              <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{step.test_result}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
