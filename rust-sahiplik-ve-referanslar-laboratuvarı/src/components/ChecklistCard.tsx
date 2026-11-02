import React from 'react';
import { ChecklistItem } from '../types/rust';
import { CheckCircle2, Circle, HelpCircle, ShieldCheck } from 'lucide-react';

interface ChecklistCardProps {
  checklist: ChecklistItem[];
  allPassed: boolean;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({ checklist, allPassed }) => {
  const passedCount = checklist.filter((item) => item.passed).length;
  const progressPercent = Math.round((passedCount / checklist.length) * 100);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Ödev Kontrol Listesi &amp; Otomatik Doğrulama
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-300">
            {passedCount} / {checklist.length} Tamamlandı
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
            %{progressPercent}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            allPassed ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {checklist.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border transition-all ${
              item.passed
                ? 'bg-emerald-950/20 border-emerald-800/40'
                : 'bg-slate-950/40 border-slate-800/60'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-slate-400">{index + 1}.</span>
                  <span className="truncate">{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {item.requirement}
                </p>

                {item.passed && item.details ? (
                  <div className="text-[10px] font-mono text-emerald-400/90 pt-0.5 flex items-center gap-1">
                    <span>✓</span> {item.details}
                  </div>
                ) : !item.passed ? (
                  <div className="text-[10px] text-amber-400/80 pt-0.5 flex items-start gap-1">
                    <HelpCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{item.hint}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
