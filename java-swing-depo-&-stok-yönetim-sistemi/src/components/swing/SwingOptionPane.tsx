import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { SwingTheme } from '../../types/warehouse';

export interface OptionPaneProps {
  isOpen: boolean;
  type: 'ERROR' | 'WARNING' | 'INFO' | 'QUESTION';
  title: string;
  message: string;
  detail?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  theme?: SwingTheme;
}

export const SwingOptionPane: React.FC<OptionPaneProps> = ({
  isOpen,
  type,
  title,
  message,
  detail,
  onConfirm,
  onCancel,
  confirmLabel = 'Tamam',
  cancelLabel,
  theme = 'darcula',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';
  const isClassic = theme === 'classic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-md shadow-2xl transition-all duration-150 ${
          isDark
            ? 'bg-[#3c3f41] border border-[#555] text-[#bbb]'
            : isNimbus
            ? 'bg-[#e7eaf0] border border-[#a0a8b5] text-[#2c3e50]'
            : 'bg-[#d4d0c8] border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] text-black'
        } select-none`}
        style={{
          boxShadow: isDark
            ? '0 10px 30px rgba(0,0,0,0.6)'
            : '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Swing Dialog Title Bar */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold ${
            isDark
              ? 'bg-[#2b2b2b] text-[#dfdfdf] border-b border-[#444]'
              : isNimbus
              ? 'bg-gradient-to-r from-[#2f5597] to-[#1e3b6d] text-white border-b border-[#1c3660]'
              : 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-amber-400 font-bold">☕</span>
            <span className="truncate">{title}</span>
          </div>
          <button
            onClick={onCancel || onConfirm}
            className={`p-0.5 rounded transition-colors ${
              isDark
                ? 'hover:bg-[#4f5355] text-slate-300'
                : 'hover:bg-red-600 text-white'
            }`}
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dialog Body with Java Swing JOptionPane layout */}
        <div className="p-4 flex gap-4 items-start">
          <div className="shrink-0 mt-0.5">
            {type === 'ERROR' && (
              <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500">
                <AlertCircle className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
            {type === 'WARNING' && (
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-500">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
            {type === 'INFO' && (
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-500">
                <Info className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
            {type === 'QUESTION' && (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-sm leading-relaxed">
            <p className="font-semibold text-slate-100">{message}</p>
            {detail && (
              <div
                className={`p-2 rounded text-xs font-mono whitespace-pre-wrap max-h-36 overflow-y-auto border ${
                  isDark
                    ? 'bg-[#2b2b2b] text-amber-300 border-[#4a4a4a]'
                    : isNimbus
                    ? 'bg-white text-slate-800 border-[#ccd]'
                    : 'bg-white text-slate-900 border-[#808080]'
                }`}
              >
                {detail}
              </div>
            )}
          </div>
        </div>

        {/* Swing Dialog Button Strip */}
        <div
          className={`flex items-center justify-end gap-2 px-4 py-2.5 border-t ${
            isDark
              ? 'bg-[#313335] border-[#444]'
              : isNimbus
              ? 'bg-[#d6dae2] border-[#b0b8c5]'
              : 'bg-[#d4d0c8] border-[#808080]'
          }`}
        >
          {cancelLabel && (
            <button
              onClick={onCancel}
              className={`px-4 py-1 text-xs font-medium transition-all ${
                isDark
                  ? 'bg-[#4c5052] hover:bg-[#5c6164] text-[#dfdfdf] border border-[#5e6468] rounded-xs'
                  : isNimbus
                  ? 'bg-[#e4e7ee] hover:bg-white text-[#222] border border-[#a2a9b6] rounded'
                  : 'bg-[#d4d0c8] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] text-black'
              }`}
            >
              {cancelLabel}
            </button>
          )}
          <button
            autoFocus
            onClick={onConfirm}
            className={`px-5 py-1 text-xs font-semibold transition-all ${
              isDark
                ? 'bg-[#365880] hover:bg-[#436c9e] text-white border border-[#4d7ca6] rounded-xs'
                : isNimbus
                ? 'bg-[#2f5597] hover:bg-[#3b67b3] text-white rounded'
                : 'bg-[#000080] text-white border-2 border-t-white border-l-white border-b-black border-r-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
