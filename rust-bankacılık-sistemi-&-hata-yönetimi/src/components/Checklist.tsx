import React from 'react';
import { CheckCircle2, Code2, ArrowRight } from 'lucide-react';
import { TASK_STEPS } from '../data/rustCode';

interface ChecklistProps {
  activeStepId: number | null;
  onSelectStep: (id: number) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ activeStepId, onSelectStep }) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Görev Kontrol Listesi (Checklist)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ödevde talep edilen tüm gereksinimler eksiksiz tamamlanmış ve doğrulanmıştır.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>8 / 8 Tamamlandı</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {TASK_STEPS.map((step) => {
          const isSelected = activeStepId === step.id;
          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500/10 border-orange-500/60 shadow-md shadow-orange-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      Adım {step.id}: {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50 shrink-0">
                      Satır {step.lines[0]}-{step.lines[1]}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <div className="font-mono text-xs text-orange-300/90 truncate max-w-md bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      <code>{step.rustCodeSnippet.split('\n')[0]}</code>
                    </div>
                    <span className="text-orange-400 flex items-center gap-1 font-medium hover:underline text-[11px]">
                      <span>Kodda Gör</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
