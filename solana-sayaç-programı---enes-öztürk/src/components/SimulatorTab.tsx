import React, { useState } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  RefreshCw,
  Terminal,
  Layers,
  ArrowRight,
  ShieldAlert,
  Binary,
  Check,
  Copy,
  Trash2,
  Sparkles
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warn' | 'success' | 'system';
}

export const SimulatorTab: React.FC = () => {
  const [counter, setCounter] = useState<number>(10);
  const [inputValue, setInputValue] = useState<number>(5);
  const [lastAction, setLastAction] = useState<string>('Hazır');
  const [underflowTriggered, setUnderflowTriggered] = useState<boolean>(false);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: '00:00:01',
      text: 'Program 4xKv8u3... invoke [1]',
      type: 'system',
    },
    {
      id: 'init-2',
      timestamp: '00:00:01',
      text: 'Program log: Solana Counter Programı Başlatıldı [Enes Öztürk]',
      type: 'info',
    },
    {
      id: 'init-3',
      timestamp: '00:00:01',
      text: 'Program log: İlk hesap durumu: Counter = 10',
      type: 'info',
    },
    {
      id: 'init-4',
      timestamp: '00:00:01',
      text: 'Program 4xKv8u3... success',
      type: 'success',
    },
  ]);

  const addLog = (text: string, type: 'info' | 'warn' | 'success' | 'system') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        text,
        type,
      },
    ]);
  };

  const handleIncrement = () => {
    const val = Number(inputValue) || 0;
    const oldCounter = counter;
    // u32 max: 4294967295
    const MAX_U32 = 4294967295;
    const newCounter = Math.min(counter + val, MAX_U32);

    setCounter(newCounter);
    setUnderflowTriggered(false);
    setLastAction(`Increment(${val})`);

    addLog(`Program 4xKv8u3... invoke [1]`, 'system');
    addLog(`Program log: İşlem: Increment(${val}) çağrıldı. Mevcut Sayaç: ${oldCounter}`, 'info');
    if (counter + val > MAX_U32) {
      addLog(`Program log: u32::MAX taşma koruması (saturating_add): 4294967295`, 'warn');
    }
    addLog(`Program log: Yeni Sayaç Değeri: ${newCounter}`, 'info');
    addLog(`Program consumed 420 of 200000 compute units`, 'system');
    addLog(`Program 4xKv8u3... success`, 'success');
  };

  const handleDecrement = () => {
    const val = Number(inputValue) || 0;
    const oldCounter = counter;
    let newCounter = 0;
    let isUnderflow = false;

    // Ödev Kuralı:
    // Not: CounterInstructions::Decrement'te değerin negatif olmasına dikkat etmelisiniz.
    // U32 olarak tanımlandığı için 0'dan az olmamalıdır.
    // Parametre gerçek durumdan büyükse, durumu 0 olarak ayarlamalıdır enes öztürk imzalı olsun
    if (val > oldCounter) {
      newCounter = 0;
      isUnderflow = true;
    } else {
      newCounter = oldCounter - val;
      isUnderflow = false;
    }

    setCounter(newCounter);
    setUnderflowTriggered(isUnderflow);
    setLastAction(`Decrement(${val})`);

    addLog(`Program 4xKv8u3... invoke [1]`, 'system');
    addLog(`Program log: İşlem: Decrement(${val}) çağrıldı. Mevcut Sayaç: ${oldCounter}`, 'info');

    if (isUnderflow) {
      addLog(
        `Program log: ⚠️ UYARI: Azaltılacak değer (${val}) mevcut durumdan (${oldCounter}) büyük!`,
        'warn'
      );
      addLog(
        `Program log: 🛡️ U32 Underflow Koruması [Enes Öztürk]: Sayaç 0 olarak ayarlandı.`,
        'warn'
      );
    } else {
      addLog(`Program log: Yeni Sayaç Değeri: ${newCounter}`, 'info');
    }

    addLog(`Program consumed 450 of 200000 compute units`, 'system');
    addLog(`Program 4xKv8u3... success`, 'success');
  };

  const handleUpdate = () => {
    const val = Number(inputValue) || 0;
    const MAX_U32 = 4294967295;
    const clampedVal = Math.min(Math.max(val, 0), MAX_U32);

    setCounter(clampedVal);
    setUnderflowTriggered(false);
    setLastAction(`Update(${clampedVal})`);

    addLog(`Program 4xKv8u3... invoke [1]`, 'system');
    addLog(`Program log: İşlem: Update(${clampedVal}) çağrıldı.`, 'info');
    addLog(`Program log: Yeni Sayaç Değeri: ${clampedVal}`, 'info');
    addLog(`Program consumed 390 of 200000 compute units`, 'system');
    addLog(`Program 4xKv8u3... success`, 'success');
  };

  const handleReset = () => {
    setCounter(0);
    setUnderflowTriggered(false);
    setLastAction('Reset');

    addLog(`Program 4xKv8u3... invoke [1]`, 'system');
    addLog(`Program log: İşlem: Reset çağrıldı. Sayaç sıfırlanıyor.`, 'info');
    addLog(`Program log: Yeni Sayaç Değeri: 0`, 'info');
    addLog(`Program consumed 340 of 200000 compute units`, 'system');
    addLog(`Program 4xKv8u3... success`, 'success');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  // Little Endian 4-byte calculation
  const getLittleEndianBytes = (num: number): string[] => {
    const clamped = Math.max(0, Math.min(num, 4294967295));
    const b0 = clamped & 0xff;
    const b1 = (clamped >> 8) & 0xff;
    const b2 = (clamped >> 16) & 0xff;
    const b3 = (clamped >> 24) & 0xff;
    return [
      '0x' + b0.toString(16).padStart(2, '0').toUpperCase(),
      '0x' + b1.toString(16).padStart(2, '0').toUpperCase(),
      '0x' + b2.toString(16).padStart(2, '0').toUpperCase(),
      '0x' + b3.toString(16).padStart(2, '0').toUpperCase(),
    ];
  };

  const counterBytes = getLittleEndianBytes(counter);
  const inputBytes = getLittleEndianBytes(inputValue);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Underflow Rule Alert */}
      {underflowTriggered && (
        <div className="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-200">
            <span className="font-semibold text-amber-300">Ödev Notu Devreye Girdi: </span>
            Azaltılmak istenen girdi değeri (<span className="font-mono text-white">{inputValue}</span>),
            hesabın önceki durumundan büyük olduğu için sayaç negatif sayı üretmeyip{' '}
            <strong className="text-emerald-400 font-mono">0</strong> olarak ayarlandı.
            <div className="mt-1 text-slate-400 text-xs font-mono">
              lib.rs kuralı: if val &gt; counter &#123; counter = 0 &#125; (Enes Öztürk)
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: On-chain Account & Interactive Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Solana On-Chain Account State (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-slate-800 bg-slate-900/80 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Solana Hesap Durumu (On-Chain State)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">CounterAccount</span>
            </div>

            {/* Big Counter Value */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                pub counter: u32
              </span>
              <div className="text-5xl sm:text-6xl font-bold font-mono text-white tracking-tight tabular-nums">
                {counter.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span>Hex: 0x{counter.toString(16).toUpperCase().padStart(8, '0')}</span>
                <span>·</span>
                <span>Boyut: 4 Bytes</span>
              </div>
            </div>

            {/* Little-Endian Byte Memory Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-emerald-400" />
                  Borsh Serialization (Little-Endian 4 Bytes)
                </span>
                <span className="font-mono text-[11px] text-slate-400">account.data[0..4]</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {counterBytes.map((byte, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center"
                  >
                    <span className="text-[10px] text-slate-400 block font-mono">Byte {idx}</span>
                    <span className="text-sm font-mono font-semibold text-emerald-400 block mt-0.5">
                      {byte}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Metadata Details */}
            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Program ID:</span>
                <span className="font-mono text-slate-300">4xKv8u3...Enes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hesap Adresi (PDA):</span>
                <span className="font-mono text-slate-300">CntAcct99...7xZ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bakiye (Rent-exempt):</span>
                <span className="font-mono text-slate-300">0.00144768 SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Son Yürütülen İşlem:</span>
                <span className="font-mono text-emerald-400">{lastAction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Instruction Dispatcher (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-slate-800 bg-slate-900/80 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  İşlem Gönderici (Instruction Dispatcher)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Adım 1, 2 & 3 Test Paneli</span>
            </div>

            {/* Input Parameter Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Kullanıcı Girişi (<code className="text-emerald-400">val: u32</code> parametresi):
                </label>
                <span className="text-xs font-mono text-slate-400">Aralık: 0 - 4,294,967,295</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="4294967295"
                  value={inputValue}
                  onChange={(e) => setInputValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg py-2.5 px-4 text-white font-mono text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="u32 tamsayı değeri girin"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-400 text-[11px] mr-1">Hızlı Değerler:</span>
                {[1, 5, 10, 25, 50, 100, 500].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setInputValue(preset)}
                    className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors ${
                      inputValue === preset
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    +{preset}
                  </button>
                ))}
                <button
                  onClick={() => setInputValue(counter + 15)}
                  className="px-2.5 py-1 rounded-md font-mono text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                  title="Underflow durumunu test etmek için durumdan büyük bir sayı girer"
                >
                  Durumdan Fazla ({counter + 15})
                </button>
              </div>
            </div>

            {/* Transaction Execution Action Buttons */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-medium text-slate-400 block">
                Akıllı Sözleşme Talimatını Çalıştır:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Increment Button */}
                <button
                  onClick={handleIncrement}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Increment({inputValue})</span>
                </button>

                {/* Decrement Button */}
                <button
                  onClick={handleDecrement}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                  <span>Decrement({inputValue})</span>
                </button>

                {/* Update Button */}
                <button
                  onClick={handleUpdate}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Update({inputValue})</span>
                </button>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset()</span>
                </button>
              </div>
            </div>

            {/* Instruction Byte Buffer Preview (Adım 2 Unpack Görselleştiricisi) */}
            <div className="border border-slate-800 bg-slate-950/70 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  Ham Talimat Bayt Dizisi (Unpack Öncesi Gönderilen Veri)
                </span>
                <span className="font-mono text-[11px] text-slate-400">instruction_data: &[u8]</span>
              </div>

              <div className="flex items-center gap-2 font-mono flex-wrap">
                <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-emerald-300">
                  <span className="text-[10px] text-slate-400 block">Tag (1 B)</span>
                  [0x00]
                </div>
                <span className="text-slate-400">+</span>
                <div className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-sky-300">
                  <span className="text-[10px] text-slate-400 block">Little-Endian u32 (4 B)</span>
                  [{inputBytes.join(', ')}]
                </div>
                <span className="text-slate-400">=</span>
                <span className="text-slate-300 text-xs font-mono">
                  Toplam 5 Bayt (Adım 2'deki <code className="text-emerald-400">unpack</code> fonksiyonu bunu çözer)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Execution Logs Console */}
      <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Solana Program Yürütme Günlüğü (Validator Logs)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLogs}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              {copiedLog ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLog ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Temizle</span>
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="p-4 max-h-64 overflow-y-auto space-y-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-slate-400 py-6 text-center italic">
              Günlük kaydı bulunmuyor. Bir talimat çalıştırın.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 leading-relaxed">
                <span className="text-slate-400 shrink-0 select-none">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'warn'
                      ? 'text-amber-400 font-medium'
                      : log.type === 'success'
                      ? 'text-emerald-400'
                      : log.type === 'system'
                      ? 'text-slate-400'
                      : 'text-slate-200'
                  }
                >
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
