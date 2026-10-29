import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm backdrop-blur-md transition-all transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-500'
              : toast.type === 'danger'
              ? 'bg-rose-900/90 text-white border-rose-500'
              : 'bg-gray-900/90 text-white border-gray-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'danger' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <h4 className="font-bold text-xs">{toast.title}</h4>
            {toast.description && (
              <p className="text-[11px] text-gray-200 mt-0.5 font-mono">
                {toast.description}
              </p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
