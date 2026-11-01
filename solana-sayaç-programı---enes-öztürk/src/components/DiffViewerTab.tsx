import React, { useState } from 'react';
import { HOMEWORK_STEPS, StepDiff } from '../data/rustCodeData';
import { GitCompare, CheckCircle2, ArrowRight, Copy, Check, FileCode, ShieldAlert } from 'lucide-react';

export const DiffViewerTab: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeStep: StepDiff =
    HOMEWORK_STEPS.find((s) => s.stepNumber === selectedStep) || HOMEWORK_STEPS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Step Selector Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {HOMEWORK_STEPS.map((step) => (
          <button
            key={step.stepNumber}
            onClick={() => setSelectedStep(step.stepNumber)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              selectedStep === step.stepNumber
                ? 'bg-slate-800 text-white border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                selectedStep === step.stepNumber
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step.stepNumber}
            </span>
            <span>{step.title.split(':')[0]}</span>
            <span className="text-slate-400 hidden sm:inline">· {step.targetFile}</span>
          </button>
        ))}
      </div>

      {/* Active Step Details */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 sm:p-6 space-y-6">
        {/* Title and Target File */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Ödev Gereksinimi #{activeStep.stepNumber}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                {activeStep.targetFile}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{activeStep.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeStep.newCode, `new-${activeStep.stepNumber}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
            >
              {copiedId === `new-${activeStep.stepNumber}` ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Yeni Kodu Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3 Special Callout for the Prompt's Underflow Rule */}
        {activeStep.stepNumber === 3 && (
          <div className="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 space-y-1">
              <span className="font-semibold text-amber-300">
                Önemli Ödev Notu (Enes Öztürk İmzalı):
              </span>
              <p className="text-slate-300">
                "Not: CounterInstructions::Decrement'te değerin negatif olmasına dikkat etmelisiniz.
                U32 olarak tanımlandığı için 0'dan az olmamalıdır. Parametre gerçek durumdan büyükse,
                durumu 0 olarak ayarlamalıdır."
              </p>
              <div className="text-slate-400 text-xs font-mono pt-1">
                if val &gt; counter_account.counter &#123; counter_account.counter = 0; &#125; else &#123; counter_account.counter -= val; &#125;
              </div>
            </div>
          </div>
        )}

        {/* Code Diff Comparison (Old vs New) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Old Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-400 font-medium px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Eski Kod (Ödev Öncesi Başlangıç Durumu)
              </span>
              <span className="text-slate-400 font-mono">Değiştirilecek satırlar</span>
            </div>

            <div className="border border-rose-950 bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300 relative group">
              <pre className="text-slate-300 leading-relaxed">{activeStep.oldCode}</pre>
            </div>
          </div>

          {/* New Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Yeni Kod (Enes Öztürk Tarafından Hazırlanan Çözüm)
              </span>
              <span className="text-emerald-400 font-mono">Tam Uyumlu</span>
            </div>

            <div className="border border-emerald-950 bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto text-emerald-300 relative group">
              <pre className="text-emerald-300 leading-relaxed">{activeStep.newCode}</pre>
            </div>
          </div>
        </div>

        {/* Explanation & Technical Breakdown */}
        <div className="border-t border-slate-800 pt-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Bu Değişiklik Nasıl Çalışır?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {activeStep.explanationTr}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Teknik İnceleme ve Güvenlik Noktaları:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeStep.technicalPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
