import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check, ShieldCheck, Sparkles, CornerDownLeft } from 'lucide-react';

interface TerminalTabProps {
  onRunMainCode: () => void;
}

interface CommandLog {
  command: string;
  output: string;
  timestamp: string;
}

export const TerminalTab: React.FC<TerminalTabProps> = ({ onRunMainCode }) => {
  const [history, setHistory] = useState<CommandLog[]>([
    {
      command: 'cargo new my_project',
      output: '     Created binary (application) `my_project` package\n$ cd my_project\n$ ls\nCargo.toml  src/',
      timestamp: '10:00:12',
    },
    {
      command: 'cargo check',
      output: '    Checking my_project v0.1.0 (/home/student/my_project)\n    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.18s',
      timestamp: '10:00:15',
    },
    {
      command: 'cargo run',
      output: `   Compiling my_project v0.1.0 (/home/student/my_project)
    Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 0.42s
     Running \`target/debug/my_project\`
------------------------------------------------------------
Rust Özel Filtreleme Uygulaması - Enes Öztürk
------------------------------------------------------------
Orijinal Liste : [10, 25, 42, 25, 88, 25, 100, 3]
Aranan Koşul   : desired_value = 25
Filtrelenmiş Sonuç: [25, 25, 25]
Eşleşen Eleman Sayısı: 3
------------------------------------------------------------
Durum: Görev Başarıyla Tamamlandı! (İmza: Enes Öztürk)`,
      timestamp: '10:00:18',
    },
  ]);

  const [inputCommand, setInputCommand] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let out = '';
    const now = new Date().toLocaleTimeString();

    if (trimmed === 'cargo new my_project') {
      out = '     Created binary (application) `my_project` package';
    } else if (trimmed === 'cargo run') {
      out = `   Compiling my_project v0.1.0 (/home/student/my_project)
    Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 0.38s
     Running \`target/debug/my_project\`
------------------------------------------------------------
Rust Özel Filtreleme Uygulaması - Enes Öztürk
------------------------------------------------------------
Orijinal Liste : [10, 25, 42, 25, 88, 25, 100, 3]
Aranan Koşul   : desired_value = 25
Filtrelenmiş Sonuç: [25, 25, 25]
Eşleşen Eleman Sayısı: 3
------------------------------------------------------------
Durum: Görev Başarıyla Tamamlandı! (İmza: Enes Öztürk)`;
      onRunMainCode();
    } else if (trimmed === 'cargo check') {
      out = '    Checking my_project v0.1.0\n    Finished dev profile [unoptimized + debuginfo] target(s) in 0.12s\n    Hata veya uyarı bulunamadı (Tüm kurallar geçerli).';
    } else if (trimmed === 'cargo test') {
      out = `   Compiling my_project v0.1.0
    Finished \`test\` profile [unoptimized + debuginfo] target(s) in 0.31s
     Running unittests src/main.rs

running 2 tests
test tests::test_filter_condition_match ... ok
test tests::test_custom_filter_numbers ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s`;
    } else if (trimmed === 'cargo clippy') {
      out = '    Checking my_project v0.1.0\n    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.20s\n    Clippy kontrolü tamamlandı: Kod temiz ve Rust standartlarına uygundur.';
    } else if (trimmed === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    } else if (trimmed === 'ls' || trimmed === 'ls -la') {
      out = 'total 16\ndrwxr-xr-x 4 student student 4096 Nov 2 10:00 .\ndrwxr-xr-x 3 student student 4096 Nov 2 10:00 ..\n-rw-r--r-- 1 student student  180 Nov 2 10:00 Cargo.toml\ndrwxr-xr-x 2 student student 4096 Nov 2 10:00 src\n-rw-r--r-- 1 student student 1850 Nov 2 10:00 src/main.rs';
    } else {
      out = `Komut '${trimmed}' simülatörde tanımlı değil. Kullanabileceğiniz komutlar:\n  - cargo new my_project\n  - cargo run\n  - cargo check\n  - cargo test\n  - cargo clippy\n  - clear`;
    }

    setHistory((prev) => [...prev, { command: trimmed, output: out, timestamp: now }]);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputCommand);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-[#121622] border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TerminalIcon className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Etkileşimli Cargo Terminali ve Komut Rehberi
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Ödevi gerçek bir Linux / macOS / Windows terminalinde nasıl çalıştıracağınızı simüle edin.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Hazırlayan: <strong className="text-amber-300">Enes Öztürk</strong></span>
        </div>
      </div>

      {/* Quick Clickable Command Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-500 font-mono text-[11px]">Hızlı Komutlar:</span>
        {[
          'cargo new my_project',
          'cargo run',
          'cargo check',
          'cargo test',
          'cargo clippy',
          'ls -la',
          'clear',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-orange-300 font-mono text-xs border border-zinc-700 transition-colors"
          >
            $ {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Screen */}
      <div className="bg-[#080a0f] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Window Header */}
        <div className="bg-[#0f121a] px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-zinc-400 ml-2 text-[11px]">student@rust-dev: ~/my_project</span>
          </div>

          <div className="text-[11px] text-zinc-500">bash • rustc 1.85.0</div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[480px] overflow-y-auto">
          {history.map((log, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">student@rust-dev</span>
                  <span className="text-zinc-500">:</span>
                  <span className="text-blue-400">~/my_project</span>
                  <span className="text-zinc-300">$ {log.command}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600">{log.timestamp}</span>
                  <button
                    onClick={() => handleCopy(log.command, index)}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors"
                    title="Komutu kopyala"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {log.output && (
                <pre className="text-zinc-300 whitespace-pre-wrap pl-2 border-l border-zinc-800 text-[11px] sm:text-xs leading-relaxed">
                  {log.output}
                </pre>
              )}
            </div>
          ))}

          {/* Interactive Input Prompt */}
          <div className="flex items-center gap-2 text-zinc-200 pt-2 border-t border-zinc-900">
            <span className="text-emerald-400 font-bold">student@rust-dev</span>
            <span className="text-zinc-500">:</span>
            <span className="text-blue-400">~/my_project</span>
            <span className="text-orange-400 font-bold">$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Komut girin (örn: cargo run)..."
              className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
              autoFocus
            />
            <button
              onClick={() => executeCommand(inputCommand)}
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
            >
              <CornerDownLeft className="w-3 h-3 inline" />
            </button>
          </div>
        </div>

        {/* Terminal Footer with signature */}
        <div className="bg-[#0b0d13] border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
          <span>Rust Paket Yöneticisi: Cargo</span>
          <span className="text-amber-400/90 font-medium">
            İmza: Enes Öztürk
          </span>
        </div>
      </div>
    </div>
  );
};
