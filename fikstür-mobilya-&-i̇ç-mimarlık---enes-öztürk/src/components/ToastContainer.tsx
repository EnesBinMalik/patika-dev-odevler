import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all ${
            n.type === 'error'
              ? 'bg-rose-50/95 border-rose-200 text-rose-900'
              : n.type === 'info'
              ? 'bg-stone-900/95 border-stone-800 text-stone-100'
              : 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-stone-300 shrink-0" />}
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            <p className="text-sm font-medium">{n.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(n.id)}
            className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
