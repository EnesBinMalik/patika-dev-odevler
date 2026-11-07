import React from 'react';
import { GitState } from '../../types/git';
import { HardDrive, CheckSquare, Database, Cloud, ArrowRight, ArrowLeft, Plus, Check, UploadCloud, DownloadCloud, RotateCcw } from 'lucide-react';

interface GitStagesOverviewProps {
  gitState: GitState;
  onExecuteCommand: (command: string) => void;
}

export const GitStagesOverview: React.FC<GitStagesOverviewProps> = ({
  gitState,
  onExecuteCommand,
}) => {
  const untrackedAndModified = Object.values(gitState.files).filter(
    (f) => f.status === 'modified' || f.status === 'untracked' || f.status === 'deleted'
  );
  const staged = Object.values(gitState.files).filter((f) => f.status === 'staged');
  const commitsCount = Object.keys(gitState.commits).length;
  const currentBranch = gitState.head.name || 'main';
  const remoteCommitId = gitState.remotes.origin?.branches[currentBranch];
  const isAhead = remoteCommitId && gitState.head.commitId !== remoteCommitId;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Git 4 Aşamalı Mimari Akışı (Workspace Lifecycle)
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Çalışma Alanı → Hazırlık (Stage) → Yerel Depo → Uzak Depo (Remote)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {/* Stage 1: Working Directory */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                1. Çalışma Alanı
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                {untrackedAndModified.length} dosya
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Kod düzenleyicide değiştirilen veya yeni eklenen takip edilmeyen dosyalar.
            </p>
            <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
              {untrackedAndModified.length === 0 ? (
                <div className="text-[11px] text-slate-600 italic">Değişiklik yok (temiz)</div>
              ) : (
                untrackedAndModified.map((f) => (
                  <div key={f.path} className="text-[11px] font-mono text-slate-300 truncate flex items-center justify-between">
                    <span>{f.name}</span>
                    <span className="text-amber-400 text-[10px] uppercase font-bold">{f.status[0]}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-2">
            <button
              onClick={() => onExecuteCommand('git add .')}
              disabled={untrackedAndModified.length === 0}
              className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>git add .</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stage 2: Staging Area / Index */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 mb-1">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                2. Hazırlık Alanı (Stage)
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                {staged.length} dosya
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Sonraki commit paketine dahil edilmek üzere seçilmiş değişiklikler.
            </p>
            <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
              {staged.length === 0 ? (
                <div className="text-[11px] text-slate-600 italic">Hazırlık boş</div>
              ) : (
                staged.map((f) => (
                  <div key={f.path} className="text-[11px] font-mono text-cyan-300 truncate flex items-center justify-between">
                    <span>{f.name}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">STAGED</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-2 flex gap-1">
            <button
              onClick={() => onExecuteCommand('git commit -m "feat: degisiklikler uygulandi"')}
              disabled={staged.length === 0}
              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>git commit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onExecuteCommand('git reset')}
              disabled={staged.length === 0}
              title="Hazırlığı geri al (git reset)"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stage 3: Local Repository */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                3. Yerel Depo (.git)
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                {commitsCount} commit
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Mevcut dalın ({currentBranch}) yerel geçmişi ve commit zinciri.
            </p>
            <div className="text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">HEAD:</span>
                <span className="text-emerald-400">{gitState.head.commitId.slice(0, 7)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Durum:</span>
                <span className={isAhead ? 'text-amber-400' : 'text-slate-400'}>
                  {isAhead ? 'Uzak depodan önde' : 'Senkron'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-2">
            <button
              onClick={() => onExecuteCommand(`git push origin ${currentBranch}`)}
              className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono transition-colors"
            >
              <UploadCloud className="w-3 h-3" />
              <span>git push</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stage 4: Remote Repository (GitHub) */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" />
                4. Uzak Depo (Remote)
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
                origin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Buluttaki merkezi repo (GitHub / GitLab). Ekip arkadaşlarıyla paylaşım.
            </p>
            <div className="text-[11px] font-mono text-slate-300 space-y-1">
              <div className="truncate text-slate-400 text-[10px]">
                github.com/enes-ozturk/git-cli-proje
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">origin/{currentBranch}:</span>
                <span className="text-blue-400">
                  {gitState.remotes.origin?.branches[currentBranch]?.slice(0, 7) || 'yok'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-2">
            <button
              onClick={() => onExecuteCommand(`git pull origin ${currentBranch}`)}
              className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-mono transition-colors"
            >
              <DownloadCloud className="w-3 h-3" />
              <span>git pull</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
