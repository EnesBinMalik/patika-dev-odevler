import React, { useState, useRef, useEffect } from 'react';
import { TerminalMessage } from '../types';
import { Trash2, CornerDownLeft, Sparkles, X, Power, RefreshCw } from 'lucide-react';

interface TerminalWindowProps {
  title: string;
  subtitle: string;
  isServer?: boolean;
  isConnected?: boolean;
  history: TerminalMessage[];
  onSendMessage?: (message: string) => void;
  onClearHistory: () => void;
  onClose?: () => void;
  onTogglePower?: () => void;
  quickCommands?: string[];
  placeholder?: string;
  promptPrefix?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title,
  subtitle,
  isServer = false,
  isConnected = true,
  history,
  onSendMessage,
  onClearHistory,
  onClose,
  onTogglePower,
  quickCommands = [],
  placeholder = 'Komut veya mesaj yazıp Enter\'a basınız...',
  promptPrefix = '>',
}) => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !onSendMessage) return;
    const cmd = input.trim();
    onSendMessage(cmd);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    if (onSendMessage) {
      onSendMessage(cmd);
    }
  };

  const renderMessageContent = (msg: TerminalMessage) => {
    let colorClass = 'text-slate-300';

    if (msg.type === 'banner') {
      colorClass = 'text-cyan-400 font-bold';
    } else if (msg.type === 'system') {
      colorClass = 'text-cyan-300 font-medium';
    } else if (msg.type === 'error') {
      colorClass = 'text-rose-400 font-semibold';
    } else if (msg.type === 'whisper') {
      colorClass = 'text-fuchsia-300 font-medium';
    } else if (msg.type === 'join') {
      colorClass = 'text-emerald-400 font-medium';
    } else if (msg.type === 'leave') {
      colorClass = 'text-amber-400 font-medium';
    } else if (msg.type === 'user') {
      colorClass = 'text-slate-100';
    }

    return (
      <div key={msg.id} className="leading-relaxed whitespace-pre-wrap break-words flex gap-2">
        <span className="text-slate-600 select-none text-[11px] font-mono shrink-0">
          {msg.timestamp}
        </span>
        <span className={`${colorClass} flex-1`}>{msg.text}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[520px] bg-[#090d16] border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/40">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0e1524] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {/* Status Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500'
            }`}
          />
          <div>
            <span className="text-xs font-bold font-mono text-slate-200">{title}</span>
            <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">{subtitle}</span>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          {onTogglePower && (
            <button
              onClick={onTogglePower}
              title={isConnected ? 'Sunucuyu Durdur' : 'Sunucuyu Başlat'}
              className={`p-1.5 rounded hover:bg-slate-800 text-xs transition-colors ${
                isConnected ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClearHistory}
            title="Ekranı Temizle (cls / clear)"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Terminali Kapat"
              className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-3.5 overflow-y-auto font-mono text-[13px] space-y-1 select-text bg-[#070a12]/95"
      >
        {history.length === 0 ? (
          <div className="text-slate-600 text-xs italic">Terminal günlüğü temizlendi.</div>
        ) : (
          history.map(renderMessageContent)
        )}
      </div>

      {/* Quick Action Chips */}
      {quickCommands.length > 0 && isConnected && (
        <div className="px-3 py-1.5 bg-[#0b101c] border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Hızlı:</span>
          {quickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickCommand(cmd)}
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition-colors shrink-0 border border-slate-700/50"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Input Line */}
      {onSendMessage && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2 bg-[#0d1424] border-t border-slate-800"
        >
          <span className="text-emerald-400 font-mono font-bold select-none text-xs">
            {promptPrefix}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={!isConnected}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? placeholder : 'Bağlantı kapalı...'}
            className="flex-1 bg-transparent border-0 outline-none text-slate-100 font-mono text-xs placeholder:text-slate-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
