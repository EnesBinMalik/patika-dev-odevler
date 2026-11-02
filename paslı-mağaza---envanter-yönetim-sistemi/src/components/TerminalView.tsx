import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, HelpCircle, Shield, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface LogEntry {
  id: string;
  command?: string;
  output: string;
  isError?: boolean;
  timestamp: string;
}

export const TerminalView: React.FC = () => {
  const { executeTerminalCommand, currentUser } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      output: `╔══════════════════════════════════════════════════════════════════╗
║       🦀 PASLI MAĞAZA ENVANTER VE SATIŞ YÖNETİM SİSTEMİ 🦀       ║
║                   Geliştirici: Enes Öztürk                       ║
╚══════════════════════════════════════════════════════════════════╝
Rust 1.78+ Type-Safe Memory-Managed Store Shell initialized.
Oturum Açan Kullanıcı: ${currentUser.fullName} (${currentUser.role})

Başlamak için 'cargo run', 'cargo test' veya 'help' yazınız.`,
      timestamp: new Date().toLocaleTimeString('tr-TR'),
    }
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    const res = executeTerminalCommand(trimmed);

    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output: res.output,
        isError: res.isError,
        timestamp: new Date().toLocaleTimeString('tr-TR'),
      }
    ]);

    setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)]);
    setHistoryIndex(-1);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const quickCommands = [
    { label: 'cargo run', cmd: 'cargo run', desc: 'Ana Menüyü Başlat' },
    { label: 'cargo test', cmd: 'cargo test', desc: '14 Rust Testini Koş' },
    { label: 'Envanteri Listele', cmd: 'inventory list', desc: 'Metin Tablosu' },
    { label: 'Kâr & Gelir Raporu', cmd: 'report financial', desc: 'Finansal Analiz' },
    { label: 'Satış Yap (1 x 2 Adet)', cmd: 'sale record 1 2', desc: 'Kâr Hesapla' },
    { label: 'Kullanıcı Bilgisi', cmd: 'whoami', desc: 'Oturum & RBAC' },
    { label: 'Kritik Stoklar', cmd: 'inventory low', desc: 'Uyarılar' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Terminal Başlık & Hızlı Butonlar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-bold text-white font-mono ml-2">
              pasli_magaza::cli (Rust TUI / REPL Simülatörü)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Metin tabanlı kullanıcı arayüzü gereksinimlerini karşılayan etkileşimli Rust konsolu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunCommand('cargo test')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-mono shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>cargo test</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hızlı Komut Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 text-[11px] uppercase tracking-wider font-mono whitespace-nowrap">
          Hızlı Komutlar:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q.cmd}
            onClick={() => handleRunCommand(q.cmd)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:text-orange-400 text-slate-300 rounded-md font-mono whitespace-nowrap transition-colors"
            title={q.desc}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Terminal Ekranı */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm min-h-[440px] max-h-[580px] overflow-y-auto shadow-2xl flex flex-col cursor-text space-y-3"
      >
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            {log.command && (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-orange-400 font-bold">pasli-magaza&gt;</span>
                <span className="text-white font-semibold">{log.command}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{log.timestamp}</span>
              </div>
            )}
            <div className={`whitespace-pre-wrap leading-relaxed ${log.isError ? 'text-rose-400 font-semibold' : 'text-slate-300'}`}>
              {log.output}
            </div>
          </div>
        ))}

        {/* Aktif Giriş Satırı */}
        <div className="flex items-center gap-2 pt-2 text-slate-100">
          <span className="text-orange-400 font-bold select-none whitespace-nowrap">
            pasli-magaza&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bir Rust komutu yazınız (Örn: inventory list, cargo test, help)..."
            className="flex-1 bg-transparent border-none outline-hidden text-emerald-400 font-mono text-xs sm:text-sm placeholder:text-slate-400"
            autoFocus
          />
        </div>

        <div ref={endRef} />
      </div>

      {/* Alt Bilgi */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono px-2">
        <div>Klavye: ↑ / ↓ tuşları geçmiş komutları getirir, Enter komutu işletir.</div>
        <div>Sistem Mimarı: Enes Öztürk · Rust Edition 2021</div>
      </div>

    </div>
  );
};
