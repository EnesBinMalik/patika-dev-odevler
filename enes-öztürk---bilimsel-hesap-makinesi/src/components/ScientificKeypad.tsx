import React, { useState } from 'react';
import { TemelMatematikMotoru, IleriMatematikMotoru } from '../math/scratchMath';
import { HistoryItem, SquareRootStep } from '../types/calculator';
import { RotateCcw, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';

interface KeypadProps {
  onSelectCalculusTab?: () => void;
}

export const ScientificKeypad: React.FC<KeypadProps> = ({ onSelectCalculusTab }) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState<boolean>(false);
  const [lastCalculation, setLastCalculation] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSteps, setShowSteps] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAlgorithmNote, setActiveAlgorithmNote] = useState<string>('Hazır Math sınıfı kullanılmadan Newton-Raphson, Horner ve İkili Üs algoritmaları devrededir.');

  const handleDigit = (digit: string) => {
    if (waitingForNewNumber) {
      setDisplayValue(digit);
      setWaitingForNewNumber(false);
    } else {
      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit);
      } else {
        setDisplayValue(displayValue + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (waitingForNewNumber) {
      setDisplayValue('0.');
      setWaitingForNewNumber(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setPendingOp(null);
    setWaitingForNewNumber(false);
    setActiveAlgorithmNote('Hazır Math sınıfı kullanılmadan Newton-Raphson, Horner ve İkili Üs algoritmaları devrededir.');
  };

  const handleDelete = () => {
    if (waitingForNewNumber) return;
    if (displayValue.length <= 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(displayValue);
    if (isNaN(val) || val === 0) return;
    const flipped = TemelMatematikMotoru.cikar(0, val);
    setDisplayValue(flipped.toString());
  };

  // 1-parametre anlık işlemler (Karekök, Faktöriyel, Mutlak Değer)
  const handleImmediateOperation = (op: 'sqrt' | 'fact' | 'abs') => {
    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    try {
      if (op === 'sqrt') {
        const { sonuc, adimlar } = IleriMatematikMotoru.karekok(current);
        const stepsFormatted = adimlar.map(
          (s) => `İterasyon #${s.iteration}: x_n = ${s.guess.toFixed(8)} → x_{n+1} = ${s.nextGuess.toFixed(8)} (Fark: ${s.difference.toExponential(4)})`
        );
        stepsFormatted.unshift(`Newton-Raphson Karekök Algoritması (x_{n+1} = 0.5 * (x_n + ${current}/x_n)):`);

        const histItem: HistoryItem = {
          id: Date.now().toString(),
          operation: 'Karekök',
          expression: `√(${current})`,
          result: sonuc,
          steps: stepsFormatted,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
        };

        setDisplayValue(sonuc.toString());
        setLastCalculation(histItem);
        setHistory((prev) => [histItem, ...prev.slice(0, 9)]);
        setActiveAlgorithmNote(`Babil / Newton-Raphson Yakınsaması (${adimlar.length} adımda 10⁻¹⁴ hassasiyete ulaştı)`);
        setWaitingForNewNumber(true);
      } else if (op === 'fact') {
        const { sonuc, adimlar } = IleriMatematikMotoru.faktoriyel(current);
        const histItem: HistoryItem = {
          id: Date.now().toString(),
          operation: 'Faktöriyel',
          expression: `${current}!`,
          result: sonuc,
          steps: adimlar,
          timestamp: new Date().toLocaleTimeString('tr-TR'),
        };

        setDisplayValue(sonuc.toString());
        setLastCalculation(histItem);
        setHistory((prev) => [histItem, ...prev.slice(0, 9)]);
        setActiveAlgorithmNote('Ardışık Çarpım Algoritması (0! = 1 tanımı korundu)');
        setWaitingForNewNumber(true);
      } else if (op === 'abs') {
        const sonuc = TemelMatematikMotoru.mutlakDeger(current);
        const histItem: HistoryItem = {
          id: Date.now().toString(),
          operation: 'Mutlak Değer',
          expression: `|${current}|`,
          result: sonuc,
          steps: [
            `Sayı: ${current}`,
            current < 0 ? `${current} < 0 olduğu için -(${current}) = ${sonuc}` : `${current} >= 0 olduğu için sonuç = ${sonuc}`
          ],
          timestamp: new Date().toLocaleTimeString('tr-TR'),
        };

        setDisplayValue(sonuc.toString());
        setLastCalculation(histItem);
        setHistory((prev) => [histItem, ...prev.slice(0, 9)]);
        setActiveAlgorithmNote('Koşullu İşaret İnversiyonu (Math.abs kullanılmadı)');
        setWaitingForNewNumber(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hesaplama Hatası';
      setDisplayValue('HATA');
      setActiveAlgorithmNote(msg);
    }
  };

  // 2-parametre ikili işlemler (+, -, *, /, power, mod)
  const handleBinaryOp = (op: '+' | '-' | '*' | '/' | '^' | 'mod') => {
    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    if (previousValue !== null && pendingOp && !waitingForNewNumber) {
      // Önceki işlemi tamamla
      executeCalculation(previousValue, current, pendingOp);
    } else {
      setPreviousValue(current);
      setPendingOp(op);
      setWaitingForNewNumber(true);
    }
  };

  const executeCalculation = (a: number, b: number, op: string) => {
    try {
      let sonuc = 0;
      let expr = '';
      let steps: string[] = [];
      let algoNote = '';

      switch (op) {
        case '+':
          sonuc = TemelMatematikMotoru.topla(a, b);
          expr = `${a} + ${b}`;
          steps = [`Toplama İşlemi: ${a} + ${b} = ${sonuc}`];
          algoNote = 'Temel Aritmetik Toplayıcı Metodu';
          break;
        case '-':
          sonuc = TemelMatematikMotoru.cikar(a, b);
          expr = `${a} - ${b}`;
          steps = [`Çıkarma İşlemi: ${a} - ${b} = ${sonuc}`];
          algoNote = 'Temel Aritmetik Çıkarıcı Metodu';
          break;
        case '*':
          sonuc = TemelMatematikMotoru.carp(a, b);
          expr = `${a} × ${b}`;
          steps = [`Çarpma İşlemi: ${a} × ${b} = ${sonuc}`];
          algoNote = 'Temel Aritmetik Çarpma Metodu';
          break;
        case '/':
          sonuc = TemelMatematikMotoru.bol(a, b);
          expr = `${a} ÷ ${b}`;
          steps = [`Bölme İşlemi: ${a} ÷ ${b} = ${sonuc}`, `Bölen: ${b} (0 kontrolü doğrulandı)`];
          algoNote = 'Sıfıra Bölme Korumalı Bölücü Metodu';
          break;
        case '^': {
          const powerRes = IleriMatematikMotoru.usAl(a, b);
          sonuc = powerRes.sonuc;
          expr = `${a} ^ ${b}`;
          steps = [
            `Üs Alma: Taban = ${a}, Üs = ${b}`,
            `Uygulanan Yöntem: ${powerRes.yontem}`,
            `Sonuç: ${sonuc}`
          ];
          algoNote = powerRes.yontem;
          break;
        }
        case 'mod':
          sonuc = TemelMatematikMotoru.modAl(a, b);
          expr = `${a} mod ${b}`;
          const q = (a / b) >= 0 ? Math.floor(a / b) : Math.ceil(a / b);
          steps = [
            `Mod Alma Bağıntısı: a - (⌊a/b⌋ · b)`,
            `Tam Sayı Bölümü (q): ${q}`,
            `Kalan = ${a} - (${q} · ${b}) = ${sonuc}`
          ];
          algoNote = 'Tam Sayı Bölüm Truncation Kalan Algoritması';
          break;
        default:
          return;
      }

      const histItem: HistoryItem = {
        id: Date.now().toString(),
        operation: op,
        expression: expr,
        result: sonuc,
        steps,
        timestamp: new Date().toLocaleTimeString('tr-TR'),
      };

      setDisplayValue(sonuc.toString());
      setLastCalculation(histItem);
      setHistory((prev) => [histItem, ...prev.slice(0, 9)]);
      setPreviousValue(null);
      setPendingOp(null);
      setWaitingForNewNumber(true);
      setActiveAlgorithmNote(algoNote);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hesaplama Hatası';
      setDisplayValue('HATA');
      setActiveAlgorithmNote(msg);
      setPreviousValue(null);
      setPendingOp(null);
    }
  };

  const handleEquals = () => {
    if (previousValue === null || !pendingOp) return;
    const current = parseFloat(displayValue);
    if (isNaN(current)) return;
    executeCalculation(previousValue, current, pendingOp);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Signature Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded bg-slate-900/80 border border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            ENES ÖZTÜRK İMZALI BİLİMSEL HESAP MAKİNESİ
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Java <code>Math</code> kütüphanesi kullanılmadan tamamen saf algoritmalarla çalışan bilimsel hesaplayıcı.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-emerald-400">● Aktif OOP Motoru</span>
          <span aria-hidden="true">·</span>
          <span>Sıfır Hazır Sınıf</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-300">Enes Öztürk</span>
        </div>
      </div>

      {/* Main Grid: Calculator & History / Algorithm Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Keypad Unit */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded p-5 space-y-4 shadow-xl">
          {/* LCD Display */}
          <div className="bg-slate-950 border border-slate-800/80 rounded p-4 text-right space-y-1 relative group">
            {/* Expression line */}
            <div className="text-xs font-mono text-slate-400 min-h-[1.25rem] flex items-center justify-between">
              <span className="text-cyan-400/80 text-[11px] truncate max-w-[200px]">
                {pendingOp ? `${previousValue} ${pendingOp}` : (lastCalculation ? lastCalculation.expression : 'HAZIR')}
              </span>
              <button
                onClick={copyResult}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1"
                title="Sonucu Kopyala"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            {/* Primary numeric display */}
            <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white tabular-nums overflow-x-auto scrollbar-none py-1">
              {displayValue}
            </div>

            {/* Active algorithm feedback tag */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-slate-400 truncate max-w-[80%]">{activeAlgorithmNote}</span>
              <span className="text-cyan-400 shrink-0">v1.0 (Java OOP)</span>
            </div>
          </div>

          {/* Keypad Buttons */}
          <div className="grid grid-cols-4 gap-2 text-sm font-medium">
            {/* Row 1: Specialized Functions */}
            <button
              onClick={() => handleImmediateOperation('sqrt')}
              className="py-3 px-2 bg-slate-800/90 hover:bg-slate-700/80 text-cyan-300 rounded border border-cyan-500/20 transition-colors font-mono flex flex-col items-center justify-center gap-0.5"
              title="Karekök Alma (Newton-Raphson Algoritması)"
            >
              <span className="text-base font-bold">√x</span>
              <span className="text-[10px] text-cyan-400/70">Newton-Raphson</span>
            </button>
            <button
              onClick={() => handleBinaryOp('^')}
              className={`py-3 px-2 rounded border transition-colors font-mono flex flex-col items-center justify-center gap-0.5 ${
                pendingOp === '^'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-800/90 hover:bg-slate-700/80 text-cyan-300 border-cyan-500/20'
              }`}
              title="Üs Alma (x^y) - İkili Hızlı Üs Alma"
            >
              <span className="text-base font-bold">xʸ</span>
              <span className="text-[10px] text-cyan-400/70">İkili / Taylor</span>
            </button>
            <button
              onClick={() => handleImmediateOperation('fact')}
              className="py-3 px-2 bg-slate-800/90 hover:bg-slate-700/80 text-cyan-300 rounded border border-cyan-500/20 transition-colors font-mono flex flex-col items-center justify-center gap-0.5"
              title="Faktöriyel (n!)"
            >
              <span className="text-base font-bold">n!</span>
              <span className="text-[10px] text-cyan-400/70">Ardışık Çarpım</span>
            </button>
            <button
              onClick={() => handleBinaryOp('mod')}
              className={`py-3 px-2 rounded border transition-colors font-mono flex flex-col items-center justify-center gap-0.5 ${
                pendingOp === 'mod'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-800/90 hover:bg-slate-700/80 text-cyan-300 border-cyan-500/20'
              }`}
              title="Mod Alma (a mod b)"
            >
              <span className="text-base font-bold">mod</span>
              <span className="text-[10px] text-cyan-400/70">Kalan Bağıntısı</span>
            </button>

            {/* Row 2: Secondary Functions & Clear */}
            <button
              onClick={() => handleImmediateOperation('abs')}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors font-mono"
              title="Mutlak Değer |x|"
            >
              |x|
            </button>
            <button
              onClick={handleClear}
              className="py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded border border-rose-800/40 transition-colors font-mono font-semibold"
            >
              C
            </button>
            <button
              onClick={handleDelete}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors font-mono"
            >
              DEL
            </button>
            <button
              onClick={() => handleBinaryOp('/')}
              className={`py-2.5 px-3 rounded border transition-colors font-mono text-lg font-bold ${
                pendingOp === '/'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border-slate-700'
              }`}
            >
              ÷
            </button>

            {/* Row 3: Numbers 7, 8, 9, Multiply */}
            <button
              onClick={() => handleDigit('7')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              9
            </button>
            <button
              onClick={() => handleBinaryOp('*')}
              className={`py-2.5 px-3 rounded border transition-colors font-mono text-lg font-bold ${
                pendingOp === '*'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border-slate-700'
              }`}
            >
              ×
            </button>

            {/* Row 4: Numbers 4, 5, 6, Subtract */}
            <button
              onClick={() => handleDigit('4')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              6
            </button>
            <button
              onClick={() => handleBinaryOp('-')}
              className={`py-2.5 px-3 rounded border transition-colors font-mono text-lg font-bold ${
                pendingOp === '-'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border-slate-700'
              }`}
            >
              −
            </button>

            {/* Row 5: Numbers 1, 2, 3, Add */}
            <button
              onClick={() => handleDigit('1')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              3
            </button>
            <button
              onClick={() => handleBinaryOp('+')}
              className={`py-2.5 px-3 rounded border transition-colors font-mono text-lg font-bold ${
                pendingOp === '+'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border-slate-700'
              }`}
            >
              +
            </button>

            {/* Row 6: Sign, 0, Dot, Equals */}
            <button
              onClick={handleToggleSign}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-slate-300 rounded border border-slate-800 transition-colors font-mono text-base"
              title="İşaret Değiştir (±)"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="py-3 px-3 bg-slate-800/60 hover:bg-slate-750 text-white rounded border border-slate-800 transition-colors font-mono text-lg"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="py-3 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded border border-cyan-400 transition-colors font-mono text-xl shadow"
            >
              =
            </button>
          </div>

          {/* Quick link to Calculus tab */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>Polinom Türevi ve İntegrali için:</span>
            {onSelectCalculusTab && (
              <button
                onClick={onSelectCalculusTab}
                className="text-cyan-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>Türev & İntegral Laboratuvarı →</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Step-by-Step Mathematical Explanation & History */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Mathematical Steps Card */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Matematiksel Algoritma İzleyici
                </h3>
              </div>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
              >
                {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showSteps && (
              <div className="space-y-2">
                {lastCalculation && lastCalculation.steps && lastCalculation.steps.length > 0 ? (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    <div className="text-xs font-semibold text-cyan-300 font-mono">
                      İşlem: {lastCalculation.expression} = {lastCalculation.result}
                    </div>
                    {lastCalculation.steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/60 leading-relaxed"
                      >
                        {st}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded border border-slate-800/40 leading-relaxed">
                    <p className="font-semibold text-slate-300 mb-1">Hazır Kütüphanesiz Aritmetik Mantığı:</p>
                    <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                      <li><strong>Karekök (√x):</strong> Babil / Newton-Raphson iterasyonu ile hesaplanır.</li>
                      <li><strong>Üs Alma (xʸ):</strong> İkili hızlı üs alma (Binary Exponentiation) ve Taylor ln(x)/e^z serisi.</li>
                      <li><strong>Mod (a mod b):</strong> Tam sayı bölme truncation formülü ile kalan bulunur.</li>
                      <li><strong>Mutlak Değer (|x|):</strong> Koşullu işaret tersleme fonksiyonu.</li>
                      <li><strong>Faktöriyel (n!):</strong> 64-bit hassasiyetli ardışık döngü çarpımı.</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calculation History */}
          <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Hesaplama Geçmişi
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Temizle</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center">
                Henüz bir hesaplama yapılmadı.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setDisplayValue(item.result.toString());
                      setLastCalculation(item);
                    }}
                    className="p-2.5 bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/50 rounded cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {item.expression}
                      </div>
                      <div className="text-sm font-mono font-semibold text-cyan-300">
                        = {item.result}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
