import React from 'react';
import { AlertTriangle, X, ShieldAlert, PackageX, DollarSign } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ErrorAlert: React.FC = () => {
  const { lastError, clearError } = useStore();

  if (!lastError) return null;

  const getIcon = () => {
    switch (lastError.code) {
      case 'UnauthorizedAccess':
        return <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'InsufficientStock':
        return <PackageX className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'InvalidPrice':
      case 'InvalidQuantity':
        return <DollarSign className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg bg-slate-900 border border-rose-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-400">
              Rust StoreError::{lastError.code}
            </span>
          </div>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">
            {lastError.message}
          </p>
        </div>
        <button
          onClick={clearError}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
