import React, { useState } from 'react';
import { GitConflictState } from '../../types/git';
import { AlertTriangle, Check, Split, ArrowRight, X } from 'lucide-react';

interface ConflictModalProps {
  conflict: GitConflictState | null;
  onResolveConflict: (resolvedFiles: Record<string, string>) => void;
  onAbortMerge: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  conflict,
  onResolveConflict,
  onAbortMerge,
}) => {
  if (!conflict) return null;

  const currentFile = conflict.files[0];
  const [customText, setCustomText] = useState(
    currentFile ? currentFile.incomingContent : ''
  );

  const handleAcceptCurrent = () => {
    if (currentFile) setCustomText(currentFile.currentContent);
  };

  const handleAcceptIncoming = () => {
    if (currentFile) setCustomText(currentFile.incomingContent);
  };

  const handleAcceptBoth = () => {
    if (currentFile) {
      setCustomText(`${currentFile.currentContent}\n\n// --- Birleştirilen Gelen İçerik ---\n${currentFile.incomingContent}`);
    }
  };

  const handleCompleteResolution = () => {
    if (!currentFile) return;
    onResolveConflict({
      [currentFile.path]: customText,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-3xl w-full p-5 space-y-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Merge Çakışması Algılandı (Conflict Resolver)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                  {currentFile?.path}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                <span className="text-emerald-400">{conflict.targetBranch}</span> dalı ile{' '}
                <span className="text-cyan-400">{conflict.incomingBranch}</span> dalı aynı dosyada çakışıyor.
              </p>
            </div>
          </div>
          <button
            onClick={onAbortMerge}
            title="Birleştirmeyi İptal Et"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Way Quick Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={handleAcceptCurrent}
            className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/40 text-emerald-300 text-left transition-colors"
          >
            <div className="font-semibold">Mevcut Değişikliği Kabul Et</div>
            <div className="text-[10px] text-emerald-500/80 font-mono mt-0.5">HEAD ({conflict.targetBranch})</div>
          </button>

          <button
            onClick={handleAcceptIncoming}
            className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-900/40 text-cyan-300 text-left transition-colors"
          >
            <div className="font-semibold">Gelen Değişikliği Kabul Et</div>
            <div className="text-[10px] text-cyan-500/80 font-mono mt-0.5">{conflict.incomingBranch}</div>
          </button>

          <button
            onClick={handleAcceptBoth}
            className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/60 hover:bg-purple-900/40 text-purple-300 text-left transition-colors"
          >
            <div className="font-semibold">Her İki Değişikliği Birleştir</div>
            <div className="text-[10px] text-purple-500/80 font-mono mt-0.5">Accept Both Changes</div>
          </button>
        </div>

        {/* Diff preview / Editor */}
        <div className="flex-1 flex flex-col min-h-[220px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Çözülen Dosya İçeriği (İstediğiniz gibi düzenleyebilirsiniz):</span>
            <span className="text-emerald-400">git add {currentFile?.path} aşaması</span>
          </div>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="flex-1 p-3 bg-slate-950 text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onAbortMerge}
            className="px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            Merge İşlemini İptal Et (git merge --abort)
          </button>

          <button
            onClick={handleCompleteResolution}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Çakışmayı Çöz ve Commit Et</span>
          </button>
        </div>
      </div>
    </div>
  );
};
