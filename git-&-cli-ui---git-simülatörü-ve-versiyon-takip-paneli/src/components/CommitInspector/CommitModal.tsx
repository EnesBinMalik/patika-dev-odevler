import React, { useState } from 'react';
import { GitCommit } from '../../types/git';
import { X, GitCommit as GitCommitIcon, GitBranch, Calendar, User, Copy, Check, CornerDownRight, FileText, ChevronRight } from 'lucide-react';

interface CommitModalProps {
  commit: GitCommit | null;
  onClose: () => void;
  onCheckout: (commitId: string) => void;
  onCreateBranch: (commitId: string) => void;
  onSelectParent: (parentId: string) => void;
}

export const CommitModal: React.FC<CommitModalProps> = ({
  commit,
  onClose,
  onCheckout,
  onCreateBranch,
  onSelectParent,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  if (!commit) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(commit.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileKeys = Object.keys(commit.filesSnapshot || {});
  const selectedFilePath = activeFile || fileKeys[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitCommitIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">{commit.shortId}</h3>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {commit.branchName}
                </span>
                {commit.tag && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    {commit.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{commit.message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Yazar:</span>
              <span className="text-slate-200">{commit.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Tarih:</span>
              <span className="text-slate-200">{commit.timestamp}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Ebeveyn (Parent):</span>
              {commit.parents.length === 0 ? (
                <span className="text-slate-500 italic">Kök Commit (Root)</span>
              ) : (
                <div className="flex gap-1">
                  {commit.parents.map((p) => (
                    <button
                      key={p}
                      onClick={() => onSelectParent(p)}
                      className="text-emerald-400 hover:underline px-1 bg-slate-900 rounded"
                    >
                      {p.slice(0, 7)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Tam Hash:</span>
              <span className="text-slate-300 text-[10px] truncate max-w-[120px]">{commit.id}</span>
              <button
                onClick={handleCopyHash}
                title="Hash'i Kopyala"
                className="text-slate-500 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Snapshot File Viewer */}
        <div className="flex-1 flex flex-col min-h-[160px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
          <div className="flex items-center bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold mr-3">Bu Committeki Dosyalar:</span>
            <div className="flex gap-1 overflow-x-auto">
              {fileKeys.map((path) => (
                <button
                  key={path}
                  onClick={() => setActiveFile(path)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedFilePath === path
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {path}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-3 overflow-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed custom-scrollbar">
            {selectedFilePath && commit.filesSnapshot?.[selectedFilePath] ? (
              <pre className="whitespace-pre-wrap">{commit.filesSnapshot[selectedFilePath]}</pre>
            ) : (
              <p className="text-slate-600 italic">Dosya içeriği bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onCheckout(commit.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bu Commite Checkout Yap (Detached HEAD)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onCreateBranch(commit.id);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Buradan Yeni Dal Aç</span>
          </button>
        </div>
      </div>
    </div>
  );
};
