import React from 'react';
import { X, CheckCircle2, XCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { TestStepResult } from '../graphql/testRunner.ts';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  steps: TestStepResult[];
  onRerun: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  isRunning,
  steps,
  onRerun,
}) => {
  if (!isOpen) return null;

  const allPassed = steps.length > 0 && steps.every((s) => s.status === 'success');
  const hasFailed = steps.some((s) => s.status === 'failed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Ödev 3: GraphQL Subscriptions Otomatik Doğrulama
              </h3>
              <p className="text-xs text-slate-400">
                userCreated, eventCreated ve participantAdded mutasyon-subscription akış testleri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status Banner */}
          {allPassed && !isRunning && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-200">
                  Tüm Ödev Gereksinimleri %100 Başarıyla Doğrulandı!
                </h4>
                <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
                  Tüm GraphQL Subscriptions akışları, veri filtrelemeleri ve mutasyon tetikleyicileri
                  beklenen standartlarda kesintisiz çalışmaktadır.
                </p>
                <div className="mt-2 text-[11px] font-mono text-emerald-400">
                  İmza: Enes Öztürk · Patika / Kodluyoruz Ödev 3
                </div>
              </div>
            </div>
          )}

          {hasFailed && !isRunning && (
            <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-200">Doğrulama Sırasında Hata Alındı</h4>
                <p className="text-xs text-rose-300 mt-1">
                  Aşağıdaki adımlardan biri başarısız oldu. Hata detayını inceleyebilirsiniz.
                </p>
              </div>
            </div>
          )}

          {/* Test Steps List */}
          <div className="space-y-3">
            {steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${
                    step.status === 'success'
                      ? 'bg-slate-950/80 border-emerald-900/40'
                      : step.status === 'failed'
                      ? 'bg-slate-950/80 border-rose-900/60'
                      : step.status === 'running'
                      ? 'bg-slate-950 border-indigo-500/60'
                      : 'bg-slate-950/40 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      {step.status === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {step.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}

                      <h5 className="text-xs font-semibold text-white">{step.name}</h5>
                    </div>

                    {step.durationMs !== undefined && (
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 pl-6 mb-1">{step.description}</p>

                  {step.details && (
                    <div className="mt-2 pl-6">
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed">
                        {step.details}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <span className="text-xs text-slate-500">
            {isRunning ? 'Testler yürütülüyor...' : 'Test senaryoları tamamlandı'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onRerun}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRunning ? 'Çalıştırılıyor...' : 'Yeniden Test Et'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
