export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed' | 'deleted';

export interface GitFile {
  path: string;
  name: string;
  language: string;
  content: string;
  stagedContent?: string;
  headContent?: string;
  status: FileStatus;
}

export interface GitCommit {
  id: string;             // e.g. "a1b2c3d"
  shortId: string;        // e.g. "a1b2c3d"
  message: string;
  author: string;
  email: string;
  timestamp: string;      // ISO string or formatted
  parents: string[];      // 0 for root, 1 for normal, 2 for merge
  branchName: string;     // branch where it was committed
  filesSnapshot: Record<string, string>; // path -> content snapshot
  tag?: string;
}

export interface GitHead {
  type: 'branch' | 'detached';
  name?: string;          // branch name if type === 'branch'
  commitId: string;       // commit hash currently pointed to
}

export interface GitRemote {
  name: string;
  url: string;
  branches: Record<string, string>; // branchName -> commitId (e.g. "main" -> "a1b2c3d")
}

export interface GitStashItem {
  id: string;
  index: number;
  message: string;
  branch: string;
  timestamp: string;
  files: Record<string, { content: string; status: FileStatus }>;
}

export interface ConflictedFile {
  path: string;
  baseContent: string;
  currentContent: string;
  incomingContent: string;
  resolvedContent?: string;
  isResolved: boolean;
}

export interface GitConflictState {
  incomingBranch: string;
  targetBranch: string;
  incomingCommitId: string;
  files: ConflictedFile[];
}

export interface GitState {
  isInitialized: boolean;
  repoName: string;
  files: Record<string, GitFile>;
  commits: Record<string, GitCommit>;
  branches: Record<string, string>; // branchName -> commitId
  head: GitHead;
  remotes: Record<string, GitRemote>;
  stashes: GitStashItem[];
  conflict: GitConflictState | null;
}

export interface TerminalLogEntry {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: string;
}

export interface QuestStep {
  title: string;
  description: string;
  targetCommand: string;
  expectedPattern?: RegExp;
  hint: string;
  actionSummary: string;
}

export interface Quest {
  id: string;
  title: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  description: string;
  steps: QuestStep[];
}
