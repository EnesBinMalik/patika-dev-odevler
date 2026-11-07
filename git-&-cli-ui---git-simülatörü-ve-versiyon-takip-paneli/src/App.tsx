/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GitState,
  TerminalLogEntry,
  GitCommit,
} from './types/git';
import {
  createInitialState,
  executeGitCommand,
  createHash,
} from './services/gitEngine';
import { GitGraphDAG } from './components/GitGraph/GitGraphDAG';
import { GitTerminal } from './components/Terminal/GitTerminal';
import { VsCodeLayout } from './components/Workspace/VsCodeLayout';
import { GitStagesOverview } from './components/Stages/GitStagesOverview';
import { GitQuests } from './components/InteractiveTutorials/GitQuests';
import { LinkedInShowcaseModal } from './components/LinkedInShowcase/LinkedInShowcaseModal';
import { CommitModal } from './components/CommitInspector/CommitModal';
import { ConflictModal } from './components/ConflictResolver/ConflictModal';
import { GitCheatsheetModal } from './components/Cheatsheet/GitCheatsheetModal';
import {
  GitBranch,
  Terminal,
  Layers,
  BookOpen,
  Share2,
  FileCode,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Minimize2,
  Maximize2,
  Github,
} from 'lucide-react';

export default function App() {
  const [gitState, setGitState] = useState<GitState>(() => createInitialState('starter'));
  const [activeTab, setActiveTab] = useState<'graph' | 'workspace' | 'stages' | 'quests'>('graph');
  const [activeFilePath, setActiveFilePath] = useState<string>('index.html');
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(null);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  // Modals
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showCheatsheetModal, setShowCheatsheetModal] = useState(false);

  // Terminal Logs
  const [logs, setLogs] = useState<TerminalLogEntry[]>([
    {
      id: 'init-1',
      type: 'info',
      content: 'Git & CLI UI Simülatörü başarıyla başlatıldı.\nDepo: /app/proje (main)\nGeliştirici: Enes Öztürk',
      timestamp: '10:00:00',
    },
    {
      id: 'init-2',
      type: 'command',
      content: 'git status',
      timestamp: '10:00:01',
    },
    {
      id: 'init-3',
      type: 'output',
      content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean',
      timestamp: '10:00:02',
    },
  ]);

  // Terminal Execution Handler
  const handleExecuteCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Handle clear
    if (trimmed === 'clear') {
      setLogs([]);
      return;
    }

    const commandEntry: TerminalLogEntry = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type: 'command',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    const res = executeGitCommand(gitState, trimmed);

    const outputEntry: TerminalLogEntry = {
      id: `res-${Date.now()}-${Math.random()}`,
      type: res.type,
      content: res.output,
      timestamp: new Date().toLocaleTimeString(),
    };

    setGitState(res.state);
    setLogs((prev) => [...prev, commandEntry, outputEntry]);
  };

  // Reset preset
  const handleResetPreset = (preset: 'starter' | 'branching' | 'conflict') => {
    const fresh = createInitialState(preset);
    setGitState(fresh);
    setLogs([
      {
        id: `reset-${Date.now()}`,
        type: 'info',
        content: `Depo '${preset}' şablonu ile yeniden başlatıldı.\nGeliştirici: Enes Öztürk`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // File Operations from VS Code layout
  const handleUpdateFileContent = (path: string, content: string) => {
    setGitState((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as GitState;
      if (!next.files[path]) {
        next.files[path] = {
          path,
          name: path,
          language: 'javascript',
          content,
          status: 'untracked',
        };
      } else {
        next.files[path].content = content;
        if (next.files[path].status === 'committed') {
          next.files[path].status = 'modified';
        }
      }
      return next;
    });
  };

  const handleStageFile = (path: string) => {
    handleExecuteCommand(`git add ${path}`);
  };

  const handleUnstageFile = (path: string) => {
    setGitState((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as GitState;
      if (next.files[path] && next.files[path].status === 'staged') {
        next.files[path].status = 'modified';
      }
      return next;
    });
    setLogs((prev) => [
      ...prev,
      {
        id: `unstage-${Date.now()}`,
        type: 'output',
        content: `Unstaged: ${path}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleDiscardChanges = (path: string) => {
    setGitState((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as GitState;
      if (next.files[path]) {
        next.files[path].content = next.files[path].headContent || next.files[path].content;
        next.files[path].status = 'committed';
      }
      return next;
    });
  };

  const handleCommit = (message: string) => {
    handleExecuteCommand(`git commit -m "${message}"`);
  };

  const handlePush = () => {
    const curBranch = gitState.head.name || 'main';
    handleExecuteCommand(`git push origin ${curBranch}`);
  };

  const handlePull = () => {
    const curBranch = gitState.head.name || 'main';
    handleExecuteCommand(`git pull origin ${curBranch}`);
  };

  const handleSwitchBranch = (branchName: string) => {
    handleExecuteCommand(`git checkout ${branchName}`);
  };

  const handleCreateBranch = (branchName: string) => {
    handleExecuteCommand(`git checkout -b ${branchName}`);
  };

  const handleCheckoutCommit = (commitId: string) => {
    handleExecuteCommand(`git checkout ${commitId}`);
    setSelectedCommit(null);
  };

  const handleCreateBranchAtCommit = (commitId: string) => {
    const newName = `feature/branch-${commitId.slice(0, 4)}`;
    const nextState = JSON.parse(JSON.stringify(gitState)) as GitState;
    nextState.branches[newName] = commitId;
    nextState.head = {
      type: 'branch',
      name: newName,
      commitId,
    };
    setGitState(nextState);
    setLogs((prev) => [
      ...prev,
      {
        id: `branch-at-${Date.now()}`,
        type: 'success',
        content: `'${newName}' dalı ${commitId.slice(0, 7)} commitinde açıldı ve aktif yapıldı.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setSelectedCommit(null);
  };

  // Conflict Resolution
  const handleResolveConflict = (resolvedFiles: Record<string, string>) => {
    const nextState = JSON.parse(JSON.stringify(gitState)) as GitState;
    const conflict = nextState.conflict;
    if (!conflict) return;

    Object.entries(resolvedFiles).forEach(([path, content]) => {
      if (nextState.files[path]) {
        nextState.files[path].content = content;
        nextState.files[path].headContent = content;
        nextState.files[path].status = 'committed';
      }
    });

    const mergeCommitId = createHash();
    const curCommitId = nextState.branches[conflict.targetBranch];
    const incomingCommitId = conflict.incomingCommitId;

    const mergeCommit: GitCommit = {
      id: mergeCommitId,
      shortId: mergeCommitId,
      message: `Merge branch '${conflict.incomingBranch}' into ${conflict.targetBranch} (çakışma çözüldü)`,
      author: 'Enes Öztürk',
      email: 'enes@ozturk.dev',
      timestamp: 'Az önce',
      parents: [curCommitId, incomingCommitId],
      branchName: conflict.targetBranch,
      filesSnapshot: {
        ...(nextState.commits[curCommitId]?.filesSnapshot || {}),
        ...resolvedFiles,
      },
    };

    nextState.commits[mergeCommitId] = mergeCommit;
    nextState.branches[conflict.targetBranch] = mergeCommitId;
    nextState.head.commitId = mergeCommitId;
    nextState.conflict = null;

    setGitState(nextState);
    setLogs((prev) => [
      ...prev,
      {
        id: `conflict-res-${Date.now()}`,
        type: 'success',
        content: `Çakışma başarıyla çözüldü ve [${mergeCommitId}] merge commiti kaydedildi.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleAbortMerge = () => {
    const nextState = JSON.parse(JSON.stringify(gitState)) as GitState;
    if (nextState.conflict) {
      // Revert files to head
      const targetCommit = nextState.commits[nextState.head.commitId];
      if (targetCommit?.filesSnapshot) {
        Object.keys(targetCommit.filesSnapshot).forEach((p) => {
          if (nextState.files[p]) {
            nextState.files[p].content = targetCommit.filesSnapshot[p];
            nextState.files[p].status = 'committed';
          }
        });
      }
      nextState.conflict = null;
      setGitState(nextState);
      setLogs((prev) => [
        ...prev,
        {
          id: `abort-${Date.now()}`,
          type: 'info',
          content: 'Merge işlemi iptal edildi (git merge --abort).',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar (Follows Strict 3-Zone Top Bar Contract) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GitBranch className="w-5 h-5 text-slate-950" />
            </div>
            <span>Git & CLI UI</span>
          </a>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            v2.4 · Enes Öztürk
          </span>
        </div>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('graph')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'graph' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Versiyon Ağacı</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'workspace' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>VS Code Paneli</span>
          </button>

          <button
            onClick={() => setActiveTab('stages')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'stages' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4 Aşamalı Akış</span>
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'quests' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Senaryolar</span>
          </button>

          <button
            onClick={() => setShowCheatsheetModal(true)}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Komut Rehberi</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowLinkedInModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>LinkedIn Sunumu</span>
          </button>
        </div>
      </header>

      {/* Presentation Headline / Hero Banner */}
      <section className="px-6 py-4 bg-slate-900/60 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>Enes Öztürk İmzalı Git & SCM Simülatörü</span>
            <span>·</span>
            <span>Interactive Front-End Terminal & DAG</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            Versiyon kontrol sistemlerinin çalışma mantığını ön yüzde görselleştiren, Git komut simülasyon aracı.
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Terminalden Git komutlarını yazın veya VS Code kaynak kontrolü arayüzünden dosyalarınızı stage edin, commit atın, dallanmaları ve merge çakışmalarını dinamik ağaç grafiğinde gerçek zamanlı izleyin.
          </p>
        </div>

        {/* Preset Switcher for Quick Demo */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 text-xs">
          <span className="text-slate-500 text-[11px] font-mono px-2 hidden lg:inline">Örnek Depo:</span>
          <button
            onClick={() => handleResetPreset('starter')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Temel (main)
          </button>
          <button
            onClick={() => handleResetPreset('branching')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white transition-colors"
          >
            Çoklu Dal (feature)
          </button>
          <button
            onClick={() => handleResetPreset('conflict')}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white transition-colors"
          >
            Çakışma Senaryosu
          </button>
        </div>
      </section>

      {/* Mobile Tab Selector (shown on small screens) */}
      <div className="md:hidden flex items-center justify-around border-b border-slate-800 bg-slate-950 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-2 py-1 rounded ${activeTab === 'graph' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Versiyon Ağacı
        </button>
        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-2 py-1 rounded ${activeTab === 'workspace' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          VS Code
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-2 py-1 rounded ${activeTab === 'stages' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          4 Aşama
        </button>
        <button
          onClick={() => setActiveTab('quests')}
          className={`px-2 py-1 rounded ${activeTab === 'quests' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Senaryolar
        </button>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 md:p-6 space-y-4 max-w-[1700px] w-full mx-auto">
        {/* Render Tab Contents */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
            {/* Top/Left: Visual DAG Graph */}
            <div className="lg:col-span-7 h-full">
              <GitGraphDAG
                gitState={gitState}
                selectedCommitId={selectedCommit?.id || null}
                onSelectCommit={(commit) => setSelectedCommit(commit)}
                onCheckoutCommit={handleCheckoutCommit}
                onCreateBranchAtCommit={handleCreateBranchAtCommit}
              />
            </div>

            {/* Right: Interactive Terminal */}
            <div className="lg:col-span-5 h-full">
              <GitTerminal
                logs={logs}
                gitState={gitState}
                onExecuteCommand={handleExecuteCommand}
                onClearLogs={() => setLogs([])}
              />
            </div>
          </div>
        )}

        {activeTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px]">
            {/* VS Code File & SCM Workspace */}
            <div className="lg:col-span-8 h-full">
              <VsCodeLayout
                gitState={gitState}
                activeFilePath={activeFilePath}
                onSelectFile={(path) => setActiveFilePath(path)}
                onUpdateFileContent={handleUpdateFileContent}
                onStageFile={handleStageFile}
                onUnstageFile={handleUnstageFile}
                onDiscardChanges={handleDiscardChanges}
                onCommit={handleCommit}
                onPush={handlePush}
                onPull={handlePull}
                onSwitchBranch={handleSwitchBranch}
                onCreateBranch={handleCreateBranch}
              />
            </div>

            {/* Linked Terminal */}
            <div className="lg:col-span-4 h-full">
              <GitTerminal
                logs={logs}
                gitState={gitState}
                onExecuteCommand={handleExecuteCommand}
                onClearLogs={() => setLogs([])}
              />
            </div>
          </div>
        )}

        {activeTab === 'stages' && (
          <div className="space-y-4">
            <GitStagesOverview
              gitState={gitState}
              onExecuteCommand={handleExecuteCommand}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[380px]">
              <div className="lg:col-span-7 h-full">
                <GitGraphDAG
                  gitState={gitState}
                  selectedCommitId={selectedCommit?.id || null}
                  onSelectCommit={(commit) => setSelectedCommit(commit)}
                  onCheckoutCommit={handleCheckoutCommit}
                  onCreateBranchAtCommit={handleCreateBranchAtCommit}
                />
              </div>
              <div className="lg:col-span-5 h-full">
                <GitTerminal
                  logs={logs}
                  gitState={gitState}
                  onExecuteCommand={handleExecuteCommand}
                  onClearLogs={() => setLogs([])}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px]">
            <div className="lg:col-span-7 h-full">
              <GitQuests
                gitState={gitState}
                onExecuteCommand={handleExecuteCommand}
                onResetPreset={handleResetPreset}
              />
            </div>
            <div className="lg:col-span-5 h-full">
              <GitTerminal
                logs={logs}
                gitState={gitState}
                onExecuteCommand={handleExecuteCommand}
                onClearLogs={() => setLogs([])}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Geliştirici: Enes Öztürk</span>
            <span>·</span>
            <span>Git & Versiyon Kontrol Simülatörü</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowLinkedInModal(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              LinkedIn Sunum Metni
            </button>
            <button
              onClick={() => setShowCheatsheetModal(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Komut Rehberi
            </button>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-500">
              MIT License © Enes Öztürk
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CommitModal
        commit={selectedCommit}
        onClose={() => setSelectedCommit(null)}
        onCheckout={handleCheckoutCommit}
        onCreateBranch={handleCreateBranchAtCommit}
        onSelectParent={(parentId) => {
          const parentCommit = gitState.commits[parentId];
          if (parentCommit) setSelectedCommit(parentCommit);
        }}
      />

      <ConflictModal
        conflict={gitState.conflict}
        onResolveConflict={handleResolveConflict}
        onAbortMerge={handleAbortMerge}
      />

      <LinkedInShowcaseModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        onLoadPreset={handleResetPreset}
      />

      <GitCheatsheetModal
        isOpen={showCheatsheetModal}
        onClose={() => setShowCheatsheetModal(false)}
        onRunCommand={handleExecuteCommand}
      />
    </div>
  );
}
