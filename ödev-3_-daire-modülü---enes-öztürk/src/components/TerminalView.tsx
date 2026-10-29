import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, Sparkles, Sliders, CornerDownLeft } from 'lucide-react';

interface TerminalViewProps {
  initialRadius?: number;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ initialRadius = 5 }) => {
  const [radius, setRadius] = useState<number>(initialRadius);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<Array<{
    cmd: string;
    output: string[];
    timestamp: string;
    radius: number;
    area: number;
    circumference: number;
  }>>([]);
  const [activeCommand, setActiveCommand] = useState<string>('node index.js');
  const [copied, setCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Generate output for a given radius
  const runCode = (rVal: number, cmdText: string = 'node index.js') => {
    setIsRunning(true);

    const area = Math.PI * Math.pow(rVal, 2);
    const circumference = 2 * Math.PI * rVal;
    const now = new Date().toLocaleTimeString('tr-TR');

    const outputLines = [
      '==================================================',
      '       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       ',
      '           Geliştirici: Enes Öztürk               ',
      '==================================================',
      '',
      `> Parametre: Yarıçap (r) = ${rVal}`,
      '',
      '[1] circleArea(r) Çağrıldı:',
      `Yarıçapı (${rVal}) olan dairenin alanı: ${area.toFixed(2)}  (Tam: ${area.toFixed(6)})`,
      '',
      '[2] circleCircumference(r) Çağrıldı:',
      `Yarıçapı (${rVal}) olan dairenin çevresi: ${circumference.toFixed(2)}  (Tam: ${circumference.toFixed(6)})`,
      '',
      '==================================================',
      '  İşlem başarıyla tamamlandı. — İmza: Enes Öztürk  ',
      '==================================================',
    ];

    setTimeout(() => {
      setCommandHistory((prev) => [
        ...prev,
        {
          cmd: cmdText,
          output: outputLines,
          timestamp: now,
          radius: rVal,
          area,
          circumference,
        },
      ]);
      setIsRunning(false);
    }, 280);
  };

  // Run on mount with default r = 5
  useEffect(() => {
    runCode(5, 'node index.js');
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory, isRunning]);

  const handleCopyOutput = () => {
    if (commandHistory.length === 0) return;
    const lastItem = commandHistory[commandHistory.length - 1];
    const text = `$ ${lastItem.cmd}\n` + lastItem.output.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCommandHistory([]);
  };

  const handlePreset = (val: number) => {
    setRadius(val);
    runCode(val, `node index.js (r=${val})`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCode(radius, activeCommand || 'node index.js');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Control Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Yarıçap (r) Değeri:
          </span>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5">
            {[5, 3, 7, 10, 15].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePreset(val)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all border ${
                  radius === val
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                r={val} {val === 5 && <span className="text-[10px] text-emerald-400 ml-1">(Ödev)</span>}
              </button>
            ))}
          </div>

          {/* Manual radius slider / input */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value) || 1)}
              className="w-16 bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono text-center rounded-lg py-1 text-emerald-400 outline-none"
            />
            <span className="text-xs text-slate-500 font-mono">br</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Temizle
          </button>

          <button
            type="button"
            onClick={handleCopyOutput}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Çıktıyı Kopyala</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => runCode(radius, `node index.js (r=${radius})`)}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>Çalıştır (node index.js)</span>
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-[#0c121e] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs sm:text-sm">
        {/* Terminal Header */}
        <div className="bg-[#111927] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50"></div>
            <span className="ml-3 text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              bash — node v22.x (CommonJS Terminal)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Aktif Oturum
            </span>
            <span className="text-[11px] text-slate-500">Ödev 3 • Enes Öztürk</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 min-h-[380px] max-h-[520px] overflow-y-auto space-y-6 text-slate-300 select-text">
          {commandHistory.length === 0 ? (
            <div className="text-slate-500 text-center py-16 flex flex-col items-center gap-3">
              <TerminalIcon className="w-10 h-10 text-slate-600" />
              <p>Terminal temizlendi. Yukarıdaki 'Çalıştır' butonuna tıklayarak çıktıyı alabilirsiniz.</p>
            </div>
          ) : (
            commandHistory.map((item, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-800/60 pb-5 last:border-b-0">
                {/* Prompt command */}
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">enes@developer-pc</span>
                  <span className="text-slate-600">:</span>
                  <span className="text-cyan-400">~/odev3</span>
                  <span className="text-slate-500">$</span>
                  <span className="text-slate-100 font-semibold">{item.cmd}</span>
                  <span className="ml-auto text-[10px] text-slate-600">{item.timestamp}</span>
                </div>

                {/* Output with colored formatting */}
                <div className="bg-[#070b12] p-4 rounded-xl border border-slate-800/80 text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {item.output.map((line, lIdx) => {
                    const isDivider = line.includes('=====');
                    const isHeader = line.includes('NODE.JS ÖDEV 3') || line.includes('Geliştirici');
                    const isRadius = line.includes('> Parametre');
                    const isAreaTitle = line.includes('[1] circleArea');
                    const isCircTitle = line.includes('[2] circleCircumference');
                    const isResultArea = line.includes('dairenin alanı:');
                    const isResultCirc = line.includes('dairenin çevresi:');
                    const isSignature = line.includes('Enes Öztürk');

                    let textColor = 'text-slate-300';
                    if (isDivider) textColor = 'text-slate-600';
                    else if (isHeader) textColor = 'text-amber-300 font-bold';
                    else if (isRadius) textColor = 'text-cyan-300 font-medium';
                    else if (isAreaTitle || isCircTitle) textColor = 'text-slate-400 font-semibold';
                    else if (isResultArea) textColor = 'text-emerald-400 font-bold';
                    else if (isResultCirc) textColor = 'text-teal-300 font-bold';
                    else if (isSignature) textColor = 'text-purple-300 font-bold';

                    return (
                      <div key={lIdx} className={`${textColor} transition-colors`}>
                        {line || ' '}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {isRunning && (
            <div className="flex items-center gap-2 text-slate-400 animate-pulse">
              <span className="text-emerald-400 font-bold">enes@developer-pc</span>
              <span className="text-slate-600">:</span>
              <span className="text-cyan-400">~/odev3</span>
              <span className="text-slate-500">$</span>
              <span className="text-slate-300">node index.js ...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="bg-[#0f172a] px-4 py-2.5 border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold text-xs select-none">❯</span>
          <input
            type="text"
            value={activeCommand}
            onChange={(e) => setActiveCommand(e.target.value)}
            placeholder="node index.js"
            className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Komutu Çalıştır"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Yarıçap (r)</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{radius}</span>
          <span className="text-[11px] text-slate-400">Ödevde istenen test değeri: 5</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Hesaplanan Alan (π * r²)</span>
          <span className="text-xl font-bold font-mono text-teal-300">
            {(Math.PI * Math.pow(radius, 2)).toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">circleArea(r) fonksiyonu</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Hesaplanan Çevre (2 * π * r)</span>
          <span className="text-xl font-bold font-mono text-indigo-400">
            {(2 * Math.PI * radius).toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-400">circleCircumference(r) fonksiyonu</span>
        </div>
      </div>
    </div>
  );
};
