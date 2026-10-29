import React, { useState } from 'react';
import { FileJson, HardDrive, Clock, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { FileStatus } from '../types';
import { AUTHOR_NAME } from '../data/codeSnippets';

interface FileInspectorProps {
  fileStatus: FileStatus | null;
  onRefresh: () => void;
}

export const FileInspector: React.FC<FileInspectorProps> = ({ fileStatus, onRefresh }) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const exists = fileStatus?.exists ?? false;

  const handleCopyContent = () => {
    if (!fileStatus?.rawContent) return;
    navigator.clipboard.writeText(fileStatus.rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* File Inspector Top Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">
                employees.json
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  exists ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
                title={exists ? 'Dosya mevcut' : 'Dosya mevcut değil'}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              ./employees.json
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exists && (
            <div className="flex items-center bg-slate-900 border border-slate-850 p-0.5 rounded-md text-[11px]">
              <button
                onClick={() => setViewMode('formatted')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'formatted'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw Text
              </button>
            </div>
          )}

          {exists && (
            <button
              onClick={handleCopyContent}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
              title="Dosya içeriğini kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onRefresh}
            className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          >
            Yenile
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 border-b border-slate-800/80 bg-slate-950/40 divide-x divide-slate-800/80 text-[11px] font-mono">
        <div className="p-2.5 flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Boyut</span>
            <span className="text-slate-200 font-semibold">
              {exists ? `${fileStatus?.size ?? 0} Bytes` : '0 B'}
            </span>
          </div>
        </div>

        <div className="p-2.5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Son Değişiklik</span>
            <span className="text-slate-200 font-semibold truncate block max-w-[120px]">
              {exists && fileStatus?.modifiedAt
                ? new Date(fileStatus.modifiedAt).toLocaleTimeString('tr-TR')
                : 'Yok'}
            </span>
          </div>
        </div>

        <div className="p-2.5 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Doğrulama</span>
            <span className="text-emerald-300 font-semibold">
              {AUTHOR_NAME}
            </span>
          </div>
        </div>
      </div>

      {/* Content Viewer Body */}
      <div className="p-4 flex-1 min-h-[160px] max-h-[260px] overflow-y-auto font-mono text-xs bg-slate-950/60">
        {exists && fileStatus?.rawContent ? (
          viewMode === 'formatted' ? (
            <div className="space-y-1">
              <span className="text-slate-500 block text-[10px] mb-1">
                // employees.json içeriği:
              </span>
              <pre className="text-amber-300 leading-relaxed overflow-x-auto p-2.5 bg-slate-900/60 rounded border border-slate-800/70">
                {JSON.stringify(fileStatus.data || JSON.parse(fileStatus.rawContent), null, 2)}
              </pre>
            </div>
          ) : (
            <pre className="text-slate-300 p-2.5 bg-slate-900/60 rounded border border-slate-800/70 whitespace-pre-wrap break-all">
              {fileStatus.rawContent}
            </pre>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-400">
            <FileJson className="w-8 h-8 text-slate-600 mb-2 stroke-1" />
            <p className="text-xs font-semibold text-slate-300">
              Dosya mevcut değil
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-1">
              Sol taraftaki <strong>&quot;1. Yarat (Create)&quot;</strong> butonuna tıklayarak <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">employees.json</code> dosyasını oluşturabilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>FS Modülü: fs.writeFile • fs.readFile • fs.unlink</span>
        <span className="text-emerald-400 font-mono font-medium">
          İmza: {AUTHOR_NAME}
        </span>
      </div>
    </div>
  );
};
