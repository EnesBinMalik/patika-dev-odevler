import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  onUndo?: () => void;
  showUndo?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  onUndo,
  showUndo = true,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-800"
        >
          <span>{message}</span>
          {showUndo && onUndo && (
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Geri Al</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
