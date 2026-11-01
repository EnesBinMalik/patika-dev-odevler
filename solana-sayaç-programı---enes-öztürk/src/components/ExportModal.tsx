import React, { useState } from 'react';
import { X, Download, FileCode, Check, Copy } from 'lucide-react';
import { RUST_FILES } from '../data/rustCodeData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadFile = (filename: string, code: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    // Consolidated Rust bundle for easy submission
    const bundleText = `// ====================================================================
// SOLANA COUNTER SMART CONTRACT ÖDEV ÇÖZÜMÜ
// Öğrenci / Geliştirici: Enes Öztürk
// ====================================================================

// ======================== src/instruction.rs ========================
${RUST_FILES.instruction.code}

// ======================== src/lib.rs ================================
${RUST_FILES.lib.code}

// ======================== src/state.rs ==============================
${RUST_FILES.state.code}

// ======================== tests/counter_test.rs =====================
${RUST_FILES.tests.code}

// ======================== Cargo.toml ================================
${RUST_FILES.cargo.code}
`;

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solana_counter_enes_ozturk_solution.rs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ödev Dosyalarını İndir</h3>
              <p className="text-xs text-slate-400">Enes Öztürk Solana Counter Çözümü</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Aşağıdaki dosyaları tek tek indirebilir veya tüm çözümü tek bir konsolide Rust dosyasında indirebilirsiniz:
        </p>

        {/* File List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {Object.entries(RUST_FILES).map(([key, f]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-mono text-slate-200 font-semibold block">{f.filename}</span>
                  <span className="text-[11px] text-slate-400 block">{f.path}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(key, f.code)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Kopyala"
                >
                  {copiedFile === key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDownloadFile(f.filename, f.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consolidated Action */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Tüm dosyalar tek bir kaynakta birleştirildi.
          </span>
          <button
            onClick={handleDownloadAllBundle}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tüm Çözümü İndir (.rs paketi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
