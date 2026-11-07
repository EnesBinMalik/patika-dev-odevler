import React, { useState, useRef, useEffect } from 'react';
import { TerminalLogEntry, GitState } from '../../types/git';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, Copy, Check, Sparkles, ChevronRight } from 'lucide-react';

interface GitTerminalProps {
  logs: TerminalLogEntry[];
  gitState: GitState;
  onExecuteCommand: (command: string) => void;
  onClearLogs: () => void;
}

const COMMON_COMMANDS = [
  'git status',
  'git add .',
  'git commit -m "feat: yeni ozellik"',
  'git log --oneline',
  'git branch',
  'git checkout -b feature/auth',
  'git merge feature/auth',
  'git push origin main',
  'git stash',
];

export const GitTerminal: React.FC<GitTerminalProps> = ({
  logs,
  gitState,
  onExecuteCommand,
  onClearLogs,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'git status',
    'git log --oneline',
  ]);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever logs update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputVal.trim()) return;

      const cmd = inputVal;
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      setInputVal('');
      onExecuteCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab autocompletion
      const current = inputVal.trim();
      const suggestions = [
        'git status',
        'git add .',
        'git commit -m ""',
        'git branch',
        'git checkout',
        'git switch',
        'git merge',
        'git push origin main',
        'git pull origin main',
        'git log --oneline',
        'git diff',
        'git stash',
        'git reset --hard HEAD~1',
        ...Object.keys(gitState.branches).map(b => `git checkout ${b}`),
        ...Object.keys(gitState.files).map(f => `git add ${f}`),
      ];

      const match = suggestions.find(s => s.startsWith(current) && s !== current);
      if (match) {
        setInputVal(match);
      }
    }
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `${l.type === 'command' ? '$ ' : ''}${l.content}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const branchDisplay = gitState.head.type === 'branch' 
    ? gitState.head.name 
    : `detached@${gitState.head.commitId.slice(0, 7)}`;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2.5">
          {/* macOS / VS Code style window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-sans font-medium text-xs ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>bash — enes@dev-box: ~/proje</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              ({branchDisplay})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            title="Terminal geçmişini kopyala"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClearLogs}
            title="Terminali temizle (clear)"
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 p-3.5 overflow-y-auto space-y-2 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800/60 flex items-center justify-between">
          <span>Git Versiyon Kontrol Simülatörü v2.4 (Enes Öztürk Özel Sürüm)</span>
          <span>'help' yazarak yardım alabilirsiniz</span>
        </div>

        {logs.map((log) => {
          if (log.type === 'command') {
            return (
              <div key={log.id} className="flex items-start gap-2 text-slate-200 pt-1">
                <span className="text-emerald-400 select-none font-bold">$</span>
                <span className="font-semibold text-slate-100">{log.content}</span>
              </div>
            );
          }

          if (log.type === 'error') {
            return (
              <pre
                key={log.id}
                className="whitespace-pre-wrap text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-900/30 leading-relaxed"
              >
                {log.content}
              </pre>
            );
          }

          if (log.type === 'success') {
            return (
              <pre
                key={log.id}
                className="whitespace-pre-wrap text-emerald-300 bg-emerald-950/20 p-2 rounded border border-emerald-900/30 leading-relaxed"
              >
                {log.content}
              </pre>
            );
          }

          if (log.type === 'info') {
            return (
              <pre
                key={log.id}
                className="whitespace-pre-wrap text-cyan-300 bg-cyan-950/20 p-2 rounded border border-cyan-900/30 leading-relaxed"
              >
                {log.content}
              </pre>
            );
          }

          // Default output
          return (
            <pre
              key={log.id}
              className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono"
            >
              {log.content}
            </pre>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Quick Commands */}
      <div className="px-3 py-1.5 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] custom-scrollbar">
        <span className="text-slate-500 whitespace-nowrap flex items-center gap-1 font-sans">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Hızlı Komut:
        </span>
        {COMMON_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setInputVal(cmd);
              inputRef.current?.focus();
            }}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors whitespace-nowrap border border-slate-700/60"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Line */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center gap-1 text-emerald-400 font-bold select-none whitespace-nowrap">
          <span>enes@dev</span>
          <span className="text-slate-500">:</span>
          <span className="text-cyan-400">~/proje</span>
          <span className="text-amber-400">({branchDisplay})</span>
          <span className="text-emerald-400">$</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="git komutunu yazın (örn: git status, git commit -m ...)"
          className="flex-1 bg-transparent text-slate-100 focus:outline-none placeholder:text-slate-600 font-mono text-xs"
          autoFocus
          spellCheck={false}
        />

        <button
          onClick={() => {
            if (!inputVal.trim()) return;
            const cmd = inputVal;
            setCommandHistory(prev => [...prev, cmd]);
            setInputVal('');
            onExecuteCommand(cmd);
          }}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Çalıştır (Enter)"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
