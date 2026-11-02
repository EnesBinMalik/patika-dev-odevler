import React, { useState } from 'react';
import { RUST_CODE_TURKISH, CARGO_TOML, README_MD } from '../data/rustCode';
import { Download, Copy, Check, FileCode, X, Terminal, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<'main' | 'cargo' | 'readme'>('main');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getFileContent = () => {
    switch (activeFile) {
      case 'main':
        return { name: 'src/main.rs', content: RUST_CODE_TURKISH, type: 'rust' };
      case 'cargo':
        return { name: 'Cargo.toml', content: CARGO_TOML, type: 'toml' };
      case 'readme':
        return { name: 'README.md', content: README_MD, type: 'markdown' };
    }
  };

  const current = getFileContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([current.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = current.name.split('/').pop() || 'file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
              🦀
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Kaynak Kodları ve Cargo Projesi</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono">
                  Enes Öztürk İmzalı
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Projeyi yerel bilgisayarınızda Cargo ile çalıştırmak için dosyaları indirin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('main')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeFile === 'main'
                  ? 'bg-orange-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              src/main.rs
            </button>
            <button
              onClick={() => setActiveFile('cargo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeFile === 'cargo'
                  ? 'bg-orange-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              Cargo.toml
            </button>
            <button
              onClick={() => setActiveFile('readme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeFile === 'readme'
                  ? 'bg-orange-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              README.md
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-medium shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{current.name.split('/').pop()} İndir</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-black/90 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          <pre className="whitespace-pre-wrap leading-relaxed">{current.content}</pre>
        </div>

        {/* CLI Helper Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Terminalde çalıştırma: <code className="text-orange-400">cargo run</code></span>
          </div>
          <div className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Hazırlayan & İmzacı: Enes Öztürk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
