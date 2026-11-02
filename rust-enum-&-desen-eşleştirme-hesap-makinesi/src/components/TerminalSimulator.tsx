import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Trash2, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'cmd' | 'build' | 'prompt' | 'input' | 'output' | 'error' | 'success';
  content: string;
}

export const TerminalSimulator: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentStep, setCurrentStep] = useState<'idle' | 'num1' | 'op' | 'num2' | 'finished'>('idle');
  const [userInput, setUserInput] = useState<string>('');
  const [num1, setNum1] = useState<number | null>(null);
  const [opSymbol, setOpSymbol] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  // Focus input on step change
  useEffect(() => {
    if (currentStep !== 'idle' && currentStep !== 'finished' && !isAutoPlaying) {
      inputRef.current?.focus();
    }
  }, [currentStep, isAutoPlaying]);

  // Initialize or start program
  const startProgram = () => {
    setUserInput('');
    setNum1(null);
    setOpSymbol(null);
    setIsAutoPlaying(false);

    const initialLines: TerminalLine[] = [
      { id: '1', type: 'cmd', content: '$ cargo run' },
      { id: '2', type: 'build', content: '   Compiling hesap_makinesi v0.1.0 (/rust_workspace/hesap_makinesi)' },
      { id: '3', type: 'build', content: '    Finished dev [unoptimized + debuginfo] target(s) in 0.34s' },
      { id: '4', type: 'build', content: '     Running `target/debug/hesap_makinesi`' },
      { id: '5', type: 'output', content: '=== Rust Hesap Makinesi ===' },
      { id: '6', type: 'output', content: 'Hazırlayan / Geliştirici: Enes Öztürk\n' },
      { id: '7', type: 'prompt', content: 'İlk sayıyı giriniz:' },
    ];

    setLines(initialLines);
    setCurrentStep('num1');
  };

  useEffect(() => {
    // Start automatically once on load
    startProgram();
  }, []);

  const handleInputSubmit = (textOverride?: string) => {
    const val = (textOverride !== undefined ? textOverride : userInput).trim();
    if (!val && textOverride === undefined) return;

    setUserInput('');

    if (currentStep === 'num1') {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        setLines((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', content: val },
          { id: Math.random().toString(), type: 'error', content: 'thread \'main\' panicked at \'Hata: Geçerli bir sayı girilmedi! (ParseFloatError)\'' },
          { id: Math.random().toString(), type: 'error', content: 'note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace' },
        ]);
        setCurrentStep('finished');
        return;
      }

      setNum1(parsed);
      setLines((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'input', content: val },
        { id: Math.random().toString(), type: 'prompt', content: 'Yapılacak işlemi giriniz (+, -, *, /):' },
      ]);
      setCurrentStep('op');
    } else if (currentStep === 'op') {
      if (!['+', '-', '*', '/'].includes(val)) {
        setLines((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', content: val },
          { id: Math.random().toString(), type: 'error', content: `Hata: Geçersiz işlem '${val}'. Lütfen +, -, * veya / giriniz.` },
          { id: Math.random().toString(), type: 'error', content: 'Program hata koduyla sonlandı (exit code 1).' },
        ]);
        setCurrentStep('finished');
        return;
      }

      setOpSymbol(val);
      setLines((prev) => [
        ...prev,
        { id: Math.random().toString(), type: 'input', content: val },
        { id: Math.random().toString(), type: 'prompt', content: 'İkinci sayıyı giriniz:' },
      ]);
      setCurrentStep('num2');
    } else if (currentStep === 'num2') {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        setLines((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', content: val },
          { id: Math.random().toString(), type: 'error', content: 'thread \'main\' panicked at \'Hata: Geçerli bir sayı girilmedi! (ParseFloatError)\'' },
        ]);
        setCurrentStep('finished');
        return;
      }

      // Calculate result
      const a = num1!;
      const b = parsed;
      let variantName = '';
      let result = 0;
      let extraWarn = '';

      switch (opSymbol) {
        case '+':
          variantName = `Ekleme(${a}, ${b})`;
          result = a + b;
          break;
        case '-':
          variantName = `Cikarma(${a}, ${b})`;
          result = a - b;
          break;
        case '*':
          variantName = `Carpma(${a}, ${b})`;
          result = a * b;
          break;
        case '/':
          variantName = `Bolme(${a}, ${b})`;
          if (b === 0) {
            extraWarn = 'Uyarı: Sıfıra bölme işlemi yapıldı! Sonuç: inf';
          }
          result = a / b;
          break;
      }

      const outputLines: TerminalLine[] = [
        { id: Math.random().toString(), type: 'input', content: val },
      ];

      if (extraWarn) {
        outputLines.push({ id: Math.random().toString(), type: 'error', content: extraWarn });
      }

      outputLines.push(
        { id: Math.random().toString(), type: 'output', content: '--------------------------------' },
        { id: Math.random().toString(), type: 'output', content: `Seçilen Operasyon : Operasyon::${variantName}` },
        { id: Math.random().toString(), type: 'output', content: `Hesaplanan Sonuç  : ${result}` },
        { id: Math.random().toString(), type: 'output', content: '--------------------------------' },
        { id: Math.random().toString(), type: 'success', content: 'Program başarıyla tamamlandı (exit code 0).' }
      );

      setLines((prev) => [...prev, ...outputLines]);
      setCurrentStep('finished');
    }
  };

  // Run automated demo
  const runAutoDemo = async (d1: string, op: string, d2: string) => {
    setIsAutoPlaying(true);
    startProgram();

    setTimeout(() => {
      handleInputSubmit(d1);
      setTimeout(() => {
        handleInputSubmit(op);
        setTimeout(() => {
          handleInputSubmit(d2);
          setIsAutoPlaying(false);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-white text-sm">Etkileşimli Rust Terminali</h3>
            <p className="text-xs text-slate-400">
              Rust standart girdi/çıktı akışı (<code className="font-mono text-amber-300">std::io::stdin()</code> ve <code className="font-mono text-amber-300">println!()</code>)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runAutoDemo('45.5', '+', '14.5')}
            disabled={isAutoPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Otomatik Demo Çalıştır</span>
          </button>

          <button
            onClick={startProgram}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>cargo run (Yeniden Başlat)</span>
          </button>

          <button
            onClick={() => setLines([])}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            title="Konsolu Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs sm:text-sm">
        
        {/* Terminal Header Bar */}
        <div className="bg-[#121826] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-slate-400 text-xs font-mono ml-2">bash - cargo run --bin hesap_makinesi</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Rust 1.85.0 (stable)
          </div>
        </div>

        {/* Terminal Content Screen */}
        <div className="p-4 sm:p-6 min-h-[360px] max-h-[520px] overflow-y-auto space-y-1.5 selection:bg-amber-500/30">
          {lines.map((line) => {
            switch (line.type) {
              case 'cmd':
                return (
                  <div key={line.id} className="text-emerald-400 font-bold">
                    {line.content}
                  </div>
                );
              case 'build':
                return (
                  <div key={line.id} className="text-slate-400">
                    {line.content}
                  </div>
                );
              case 'prompt':
                return (
                  <div key={line.id} className="text-amber-300 font-semibold pt-1">
                    {line.content}
                  </div>
                );
              case 'input':
                return (
                  <div key={line.id} className="text-white font-bold flex items-center gap-1.5 pl-2">
                    <span className="text-slate-500">&gt;</span>
                    <span className="bg-slate-800/80 px-2 py-0.5 rounded text-amber-200">{line.content}</span>
                  </div>
                );
              case 'output':
                return (
                  <div key={line.id} className="text-slate-200 whitespace-pre-wrap">
                    {line.content}
                  </div>
                );
              case 'error':
                return (
                  <div key={line.id} className="text-red-400 font-semibold">
                    {line.content}
                  </div>
                );
              case 'success':
                return (
                  <div key={line.id} className="text-emerald-400 font-semibold pt-1">
                    ✓ {line.content}
                  </div>
                );
              default:
                return null;
            }
          })}

          {/* Active Prompt Input Line */}
          {currentStep !== 'finished' && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-amber-400 font-bold">&gt;</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInputSubmit();
                }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    currentStep === 'num1'
                      ? 'İlk sayıyı yazın (örn: 25.5)'
                      : currentStep === 'op'
                      ? 'İşlemi yazın (+, -, *, /)'
                      : 'İkinci sayıyı yazın (örn: 5)'
                  }
                  disabled={isAutoPlaying}
                  className="bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none flex-1 placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={isAutoPlaying || !userInput.trim()}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-40"
                >
                  <span>Enter</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </form>
            </div>
          )}

          {currentStep === 'finished' && (
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={startProgram}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tekrar Çalıştır</span>
              </button>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Quick Click Assist Bar */}
        {currentStep !== 'finished' && (
          <div className="bg-[#121826] border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              Hızlı Seçenek:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentStep === 'num1' && (
                <>
                  {['10', '25.5', '100', '-7.2', '3.14'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleInputSubmit(val)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </>
              )}
              {currentStep === 'op' && (
                <>
                  {[
                    { s: '+', l: 'Topla' },
                    { s: '-', l: 'Çıkar' },
                    { s: '*', l: 'Çarp' },
                    { s: '/', l: 'Böl' },
                  ].map((o) => (
                    <button
                      key={o.s}
                      onClick={() => handleInputSubmit(o.s)}
                      className="px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {o.s} ({o.l})
                    </button>
                  ))}
                </>
              )}
              {currentStep === 'num2' && (
                <>
                  {['2', '5.0', '10', '0.0', '4'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleInputSubmit(val)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer"
                    >
                      {val}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
