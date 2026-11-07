import React, { useState } from 'react';
import { GitState, GitFile } from '../../types/git';
import {
  Files,
  GitBranch,
  GitCommit as GitCommitIcon,
  Plus,
  Minus,
  RotateCcw,
  Check,
  FileCode,
  FileText,
  FileSpreadsheet,
  Save,
  ArrowUp,
  ArrowDown,
  Layers,
  Archive,
  RefreshCw,
  GitPullRequest,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface VsCodeLayoutProps {
  gitState: GitState;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onUpdateFileContent: (path: string, content: string) => void;
  onStageFile: (path: string) => void;
  onUnstageFile: (path: string) => void;
  onDiscardChanges: (path: string) => void;
  onCommit: (message: string) => void;
  onPush: () => void;
  onPull: () => void;
  onSwitchBranch: (branchName: string) => void;
  onCreateBranch: (branchName: string) => void;
}

export const VsCodeLayout: React.FC<VsCodeLayoutProps> = ({
  gitState,
  activeFilePath,
  onSelectFile,
  onUpdateFileContent,
  onStageFile,
  onUnstageFile,
  onDiscardChanges,
  onCommit,
  onPush,
  onPull,
  onSwitchBranch,
  onCreateBranch,
}) => {
  const [sidebarTab, setSidebarTab] = useState<'scm' | 'explorer' | 'stash'>('scm');
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchInput, setNewBranchInput] = useState('');
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [newFileInput, setNewFileInput] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);

  const activeFile = gitState.files[activeFilePath];

  // Group files by Git state
  const stagedFiles = Object.values(gitState.files).filter((f) => f.status === 'staged');
  const modifiedFiles = Object.values(gitState.files).filter((f) => f.status === 'modified');
  const untrackedFiles = Object.values(gitState.files).filter((f) => f.status === 'untracked');
  const totalChanges = stagedFiles.length + modifiedFiles.length + untrackedFiles.length;

  // Remote sync status
  const currentBranch = gitState.head.name || 'main';
  const localCommitId = gitState.head.commitId;
  const remoteCommitId = gitState.remotes.origin?.branches[currentBranch];
  const isAhead = remoteCommitId && localCommitId !== remoteCommitId;

  const handleCommitSubmit = () => {
    if (!commitMessage.trim()) return;
    onCommit(commitMessage);
    setCommitMessage('');
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.js') || filename.endsWith('.ts')) {
      return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (filename.endsWith('.css')) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (filename.endsWith('.html')) {
      return <FileCode className="w-3.5 h-3.5 text-rose-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="flex h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* 1. VS Code Left Activity Bar */}
      <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 select-none">
        <button
          onClick={() => setSidebarTab('scm')}
          title="Kaynak Kontrolü (Source Control / Git)"
          className={`relative p-2.5 rounded-lg mb-2 transition-colors ${
            sidebarTab === 'scm' ? 'text-white bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-5 h-5 text-emerald-400" />
          {totalChanges > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono">
              {totalChanges}
            </span>
          )}
        </button>

        <button
          onClick={() => setSidebarTab('explorer')}
          title="Dosya Gezgini (Explorer)"
          className={`p-2.5 rounded-lg mb-2 transition-colors ${
            sidebarTab === 'explorer' ? 'text-white bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Files className="w-5 h-5 text-cyan-400" />
        </button>

        <button
          onClick={() => setSidebarTab('stash')}
          title="Git Stash (Geçici Raf)"
          className={`relative p-2.5 rounded-lg mb-2 transition-colors ${
            sidebarTab === 'stash' ? 'text-white bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Archive className="w-5 h-5 text-amber-400" />
          {gitState.stashes.length > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono">
              {gitState.stashes.length}
            </span>
          )}
        </button>
      </div>

      {/* 2. VS Code Side Bar (Source Control / Explorer / Stash) */}
      <div className="w-72 bg-slate-950/70 border-r border-slate-800 flex flex-col overflow-hidden">
        {/* Source Control Panel */}
        {sidebarTab === 'scm' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                KAYNAK KONTROLÜ (GIT)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowNewBranchModal(true)}
                  title="Yeni Dal Oluştur"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Active Branch and Sync Bar */}
            <div className="p-2.5 border-b border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <select
                    value={gitState.head.type === 'branch' ? gitState.head.name : ''}
                    onChange={(e) => onSwitchBranch(e.target.value)}
                    className="bg-slate-800 text-slate-200 font-mono text-xs px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(gitState.branches).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Push / Pull Button */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={onPush}
                    title="Uzak Depoya Gönder (git push)"
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      isAhead
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span>Push</span>
                  </button>
                  <button
                    onClick={onPull}
                    title="Uzak Depodan Çek (git pull)"
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Commit Message Box */}
            <div className="p-2.5 border-b border-slate-800 space-y-2 bg-slate-900/20">
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit mesajı (Ctrl+Enter ile onayla)..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleCommitSubmit();
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700/80 rounded p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
              <button
                onClick={handleCommitSubmit}
                disabled={stagedFiles.length === 0 || !commitMessage.trim()}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  stagedFiles.length > 0 && commitMessage.trim()
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Değişiklikleri Commit Et</span>
              </button>
            </div>

            {/* Changes Lists */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar text-xs">
              {/* Staged Changes */}
              <div>
                <div className="flex items-center justify-between text-slate-400 px-1 py-1 font-semibold text-[11px]">
                  <span>HAZIRLANAN DEĞİŞİKLİKLER (STAGED)</span>
                  <span className="font-mono text-emerald-400">{stagedFiles.length}</span>
                </div>
                {stagedFiles.length === 0 ? (
                  <p className="text-[11px] text-slate-600 px-2 italic">Hazırlanmış dosya yok</p>
                ) : (
                  <div className="space-y-0.5 mt-0.5">
                    {stagedFiles.map((file) => (
                      <div
                        key={file.path}
                        onClick={() => onSelectFile(file.path)}
                        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                          activeFilePath === file.path ? 'bg-slate-800 text-white' : 'hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {getFileIcon(file.name)}
                          <span className="truncate font-mono">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">A</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnstageFile(file.path);
                            }}
                            title="Hazırlıktan çıkar (git restore --staged)"
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Working Directory Changes */}
              <div>
                <div className="flex items-center justify-between text-slate-400 px-1 py-1 font-semibold text-[11px]">
                  <span>DEĞİŞİKLİKLER (WORKING TREE)</span>
                  <span className="font-mono text-amber-400">
                    {modifiedFiles.length + untrackedFiles.length}
                  </span>
                </div>

                {modifiedFiles.length === 0 && untrackedFiles.length === 0 ? (
                  <p className="text-[11px] text-slate-600 px-2 italic">Değişiklik yok (temiz)</p>
                ) : (
                  <div className="space-y-0.5 mt-0.5">
                    {modifiedFiles.map((file) => (
                      <div
                        key={file.path}
                        onClick={() => onSelectFile(file.path)}
                        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                          activeFilePath === file.path ? 'bg-slate-800 text-white' : 'hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {getFileIcon(file.name)}
                          <span className="truncate font-mono">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-amber-400 font-bold">M</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDiscardChanges(file.path);
                            }}
                            title="Değişiklikleri geri al"
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStageFile(file.path);
                            }}
                            title="Hazırla (git add)"
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-emerald-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {untrackedFiles.map((file) => (
                      <div
                        key={file.path}
                        onClick={() => onSelectFile(file.path)}
                        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                          activeFilePath === file.path ? 'bg-slate-800 text-white' : 'hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {getFileIcon(file.name)}
                          <span className="truncate font-mono">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">U</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStageFile(file.path);
                            }}
                            title="Hazırla (git add)"
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-emerald-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Explorer Panel */}
        {sidebarTab === 'explorer' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                PROJE DOSYALARI
              </span>
              <button
                onClick={() => setShowNewFileModal(true)}
                title="Yeni Dosya Ekle"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs font-mono">
              {Object.values(gitState.files).map((file) => (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file.path)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeFilePath === file.path ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(file.name)}
                    <span className="truncate">{file.name}</span>
                  </div>
                  {file.status !== 'committed' && (
                    <span
                      className={`text-[10px] font-bold ${
                        file.status === 'staged'
                          ? 'text-emerald-400'
                          : file.status === 'modified'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      ●
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stash Panel */}
        {sidebarTab === 'stash' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                GIT STASH (GEÇİCİ RAF)
              </span>
              <span className="text-xs font-mono text-slate-500">{gitState.stashes.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs">
              {gitState.stashes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-1">
                  <Archive className="w-6 h-6 mx-auto opacity-40" />
                  <p className="text-xs">Stash kutusu boş.</p>
                  <p className="text-[11px] text-slate-600">Terminalden <code className="text-slate-400 font-mono">git stash</code> çalıştırarak kaydedin.</p>
                </div>
              ) : (
                gitState.stashes.map((s) => (
                  <div key={s.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-semibold">stash@&#123;{s.index}&#125;</span>
                      <span className="text-[10px] text-slate-500">{s.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-mono truncate">{s.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Dal: <span className="text-cyan-400">{s.branch}</span> · {Object.keys(s.files).length} dosya
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Code Editor & Viewer Area */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Editor Tab Bar */}
        <div className="flex items-center justify-between bg-slate-950 border-b border-slate-800 select-none overflow-x-auto">
          <div className="flex items-center">
            {Object.values(gitState.files).map((file) => (
              <button
                key={file.path}
                onClick={() => onSelectFile(file.path)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-r border-slate-800/80 transition-colors ${
                  activeFilePath === file.path
                    ? 'bg-slate-900 text-white border-t-2 border-t-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {getFileIcon(file.name)}
                <span>{file.name}</span>
                {file.status !== 'committed' && (
                  <span className="text-[9px] text-amber-400 font-bold ml-1">●</span>
                )}
              </button>
            ))}
          </div>

          {activeFile && (
            <div className="flex items-center gap-2 px-3 text-[11px] text-slate-400">
              <span className="font-mono">Durum:</span>
              <span
                className={`font-mono px-1.5 py-0.2 rounded ${
                  activeFile.status === 'committed'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                    : activeFile.status === 'staged'
                    ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                }`}
              >
                {activeFile.status}
              </span>
            </div>
          )}
        </div>

        {/* Editor Code Textarea with line numbers */}
        {activeFile ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers column */}
            <div className="w-10 py-3 bg-slate-950 border-r border-slate-800/60 text-slate-600 font-mono text-xs select-none text-right pr-2 space-y-1">
              {activeFile.content.split('\n').map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable Text Area */}
            <div className="flex-1 relative flex flex-col">
              <textarea
                value={activeFile.content}
                onChange={(e) => onUpdateFileContent(activeFile.path, e.target.value)}
                className="w-full h-full bg-slate-950 p-3 text-xs text-slate-200 font-mono leading-5 resize-none focus:outline-none custom-scrollbar"
                spellCheck={false}
              />

              {/* Editor bottom floating hints */}
              <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg text-[11px] text-slate-400 pointer-events-auto">
                <span>Dosyayı değiştirdiğinizde Git çalışma ağacında otomatik olarak "modified" işaretlenir.</span>
                {activeFile.status === 'modified' && (
                  <button
                    onClick={() => onStageFile(activeFile.path)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Stage Et (git add)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Açmak için bir dosya seçin.
          </div>
        )}
      </div>

      {/* New Branch Modal */}
      {showNewBranchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Yeni Git Dalı (Branch) Aç
            </h3>
            <p className="text-xs text-slate-400">
              Mevcut HEAD konumundan yeni bir dal açılacak.
            </p>
            <input
              type="text"
              value={newBranchInput}
              onChange={(e) => setNewBranchInput(e.target.value)}
              placeholder="Örn: feature/login, hotfix/navbar"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowNewBranchModal(false);
                  setNewBranchInput('');
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (newBranchInput.trim()) {
                    onCreateBranch(newBranchInput.trim());
                    setNewBranchInput('');
                    setShowNewBranchModal(false);
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
              >
                Dal Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Yeni Dosya Oluştur
            </h3>
            <input
              type="text"
              value={newFileInput}
              onChange={(e) => setNewFileInput(e.target.value)}
              placeholder="Örn: utils.js, contact.html"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileInput('');
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (newFileInput.trim()) {
                    onUpdateFileContent(newFileInput.trim(), `// Yeni dosya: ${newFileInput.trim()}\n`);
                    setNewFileInput('');
                    setShowNewFileModal(false);
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
              >
                Dosya Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
