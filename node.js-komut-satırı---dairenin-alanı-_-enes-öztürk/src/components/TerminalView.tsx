import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, Sparkles, ChevronRight, CornerDownLeft, Info } from 'lucide-react';
import { NODE_SCRIPT_CODE } from '../data/codeSnippet';

interface LogItem {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  text: string;
  timestamp: string;
}

export const TerminalView: React.FC = () => {
  const [inputVal, setInputVal] = useState('node daireAlani.js 5');
  const [history, setHistory] = useState<string[]>([
    'node daireAlani.js 5',
    'node daireAlani.js 7.5',
    'cat daireAlani.js',
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [useExactPrecision, setUseExactPrecision] = useState(true);

  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Node.js v22.14.0 Linux/x86_64 Terminal Ortamı',
      timestamp: '01:38:20',
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Ödev 1: Node.JS Komut Satırı Kullanımı • Hazırlayan: Enes Öztürk',
      timestamp: '01:38:21',
    },
    {
      id: 'cmd-1',
      type: 'command',
      text: 'node daireAlani.js 5',
      timestamp: '01:38:22',
    },
    {
      id: 'out-1',
      type: 'output',
      text: 'Yarıçapı (5) olan dairenin alanı: (78.53981633974483)',
      timestamp: '01:38:22',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getTimeString = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const executeCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!rawCmd) return;

    const time = getTimeString();
    const newLogs: LogItem[] = [
      ...logs,
      {
        id: Math.random().toString(),
        type: 'command',
        text: rawCmd,
        timestamp: time,
      },
    ];

    // Add to history
    setHistory((prev) => [rawCmd, ...prev.filter((c) => c !== rawCmd)].slice(0, 30));
    setHistoryIndex(-1);

    const parts = rawCmd.split(/\s+/);
    const main = parts[0];

    if (rawCmd === 'clear' || rawCmd === 'cls') {
      setLogs([]);
      setInputVal('');
      return;
    }

    if (rawCmd === 'help') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'system',
        text: [
          'Kullanılabilir Komutlar:',
          '  node daireAlani.js <yarıçap>  -> Daire alanını hesaplar (Örn: node daireAlani.js 5)',
          '  node daireAlani.js <r> --round-> Sonucu 2 ondalık basamak yuvarlar',
          '  cat daireAlani.js             -> Kaynak kod dosyasını görüntüler',
          '  ls -la                        -> Dizin içeriğini listeler',
          '  whoami                        -> Çalışmayı yapan öğrenci / geliştirici',
          '  node --version                -> Node sürümünü gösterir',
          '  clear                         -> Terminal ekranını temizler',
        ].join('\n'),
        timestamp: time,
      });
    } else if (rawCmd === 'whoami') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        text: 'Enes Öztürk (Öğrenci & Yazılım Geliştirici) - "El emeği, temiz kod."',
        timestamp: time,
      });
    } else if (rawCmd === 'node --version' || rawCmd === 'node -v') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        text: 'v22.14.0',
        timestamp: time,
      });
    } else if (rawCmd === 'ls' || rawCmd === 'ls -la' || rawCmd === 'dir') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        text: [
          '-rw-r--r-- 1 enes enes  1042 Oct 29 01:38 daireAlani.js',
          '-rw-r--r-- 1 enes enes   520 Oct 29 01:38 package.json',
          '-rw-r--r-- 1 enes enes  1820 Oct 29 01:38 README.md',
        ].join('\n'),
        timestamp: time,
      });
    } else if (rawCmd.startsWith('cat daireAlani.js') || rawCmd === 'cat') {
      newLogs.push({
        id: Math.random().toString(),
        type: 'output',
        text: NODE_SCRIPT_CODE,
        timestamp: time,
      });
    } else if (main === 'node' && (parts[1] === 'daireAlani.js' || parts[1] === 'index.js' || parts[1] === 'daire.js')) {
      // Node execution simulation
      const argValue = parts[2];
      const isRoundFlag = parts.includes('--round') || !useExactPrecision;

      if (argValue === undefined || argValue.trim() === '') {
        newLogs.push({
          id: Math.random().toString(),
          type: 'error',
          text: [
            'Hata: Lütfen geçerli bir yarıçap değeri giriniz!',
            'Kullanım: node daireAlani.js <yarıçap>',
            'Örnek  : node daireAlani.js 5',
          ].join('\n'),
          timestamp: time,
        });
      } else {
        const r = Number(argValue);
        if (isNaN(r) || r < 0) {
          newLogs.push({
            id: Math.random().toString(),
            type: 'error',
            text: `Hata: '${argValue}' geçerli pozitif bir sayısal yarıçap değeri değildir!\nÖrnek: node daireAlani.js 7.5`,
            timestamp: time,
          });
        } else {
          // Alan = π * r^2
          const rawArea = Math.PI * (r ** 2);
          const formattedArea = isRoundFlag ? Number(rawArea.toFixed(2)) : rawArea;
          
          // Exact required format:
          // "Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)"
          newLogs.push({
            id: Math.random().toString(),
            type: 'output',
            text: `Yarıçapı (${r}) olan dairenin alanı: (${formattedArea})`,
            timestamp: time,
          });
        }
      }
    } else {
      newLogs.push({
        id: Math.random().toString(),
        type: 'error',
        text: `bash: ${main}: komut bulunamadı. Desteklenen komutları görmek için 'help' yazabilirsiniz.`,
        timestamp: time,
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const copyLogText = (item: LogItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedLogId(item.id);
    setTimeout(() => setCopiedLogId(null), 1500);
  };

  const clearTerminal = () => {
    setLogs([]);
    inputRef.current?.focus();
  };

  const presets = [
    { label: 'r = 5 (Standart)', cmd: 'node daireAlani.js 5' },
    { label: 'r = 7.5 (Ondalıklı)', cmd: 'node daireAlani.js 7.5' },
    { label: 'r = 10', cmd: 'node daireAlani.js 10' },
    { label: 'r = 1 (Birim Daire)', cmd: 'node daireAlani.js 1' },
    { label: 'Boş Parametre (Hata Testi)', cmd: 'node daireAlani.js' },
    { label: 'cat daireAlani.js (Kod Görüntüle)', cmd: 'cat daireAlani.js' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top Banner / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300">
            İnteraktif Node.JS CLI Simülatörü
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">•</span>
          <span className="text-xs text-amber-400/90 font-mono-code hidden sm:inline">
            process.argv parametre testi
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700">
            <input
              type="checkbox"
              checked={useExactPrecision}
              onChange={(e) => setUseExactPrecision(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span>Tam Hassasiyet (Math.PI)</span>
          </label>

          <button
            onClick={clearTerminal}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
            title="Terminali Temizle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>
      </div>

      {/* Terminal Window Box */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-black/80 overflow-hidden font-mono-code text-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></div>
            <span className="ml-2 text-xs text-slate-400 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>enes@nodejs-dev: ~/odev-1/daireAlani.js</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="hidden sm:inline">Node.js 22.x</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
              BASH
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 min-h-[320px] max-h-[460px] overflow-y-auto space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="group relative flex items-start gap-2.5">
              {log.type === 'command' && (
                <div className="w-full">
                  <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                    <span className="text-emerald-400 font-bold">enes@nodejs:~/odev-1$</span>
                    <span className="text-amber-200 font-semibold">{log.text}</span>
                  </div>
                </div>
              )}

              {log.type === 'output' && (
                <div className="w-full flex items-start justify-between bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="whitespace-pre-wrap text-emerald-400 font-medium leading-relaxed">
                    {log.text}
                  </div>
                  <button
                    onClick={() => copyLogText(log)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-opacity"
                    title="Çıktıyı Kopyala"
                  >
                    {copiedLogId === log.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {log.type === 'error' && (
                <div className="w-full bg-red-950/20 border border-red-800/40 p-2.5 rounded-xl text-red-300 whitespace-pre-wrap text-xs sm:text-sm">
                  {log.text}
                </div>
              )}

              {log.type === 'system' && (
                <div className="w-full text-slate-500 text-xs italic border-l-2 border-slate-700 pl-3 py-0.5">
                  {log.text}
                </div>
              )}
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
            <span className="text-emerald-400 font-bold shrink-0 text-xs sm:text-sm">
              enes@nodejs:~/odev-1$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="node daireAlani.js <yarıçap>"
              className="w-full bg-transparent text-amber-200 focus:outline-none placeholder:text-slate-700 font-semibold text-xs sm:text-sm"
              autoFocus
            />
            <button
              onClick={() => executeCommand()}
              className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Çalıştır</span>
            </button>
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Quick Presets Bar */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Hızlı Komut Parametreleri:</span>
            <span className="text-slate-500 text-[11px]">(Tıklayarak doğrudan çalıştırın)</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputVal(p.cmd);
                  executeCommand(p.cmd);
                }}
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-amber-500/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-200 border border-slate-700/60 text-xs transition-all cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                <span className="font-mono-code">{p.cmd}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400/80 font-sans ml-1">
                  ({p.label.split(' ')[0]})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Requirement Reminder Box */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/30 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300">İstenen Ödev Şartı & Konsol Çıktısı:</span>
          <div className="mt-1 font-mono-code text-emerald-200 bg-slate-950/60 px-2.5 py-1 rounded border border-emerald-500/20 inline-block">
            Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)
          </div>
          <p className="mt-1 text-slate-400">
            Node.JS komut satırından <code className="text-amber-300 font-mono-code">process.argv[2]</code> ile girilen değer doğrudan yakalanır ve Math.PI sabitiyle formül hesaplanır.
          </p>
        </div>
      </div>
    </div>
  );
};
