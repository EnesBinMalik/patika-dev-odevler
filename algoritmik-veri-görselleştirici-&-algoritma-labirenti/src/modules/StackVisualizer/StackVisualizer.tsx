import React, { useState, useRef } from 'react';
import { Layers, ArrowDown, ArrowUp, Eye, RotateCcw, Play, CheckCircle2, AlertCircle, Code, FastForward } from 'lucide-react';

interface StackItem {
  id: string;
  value: string;
  color?: string;
}

interface CallStackFrame {
  id: string;
  name: string;
  args: string;
  returnVal?: string;
  line: number;
}

export const StackVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'parentheses' | 'callstack'>('standard');

  // Standard Stack State
  const [stack, setStack] = useState<StackItem[]>([
    { id: '1', value: '42' },
    { id: '2', value: '88' },
    { id: '3', value: '19' },
  ]);
  const [inputValue, setInputValue] = useState<string>('99');
  const [peekedItem, setPeekedItem] = useState<string | null>(null);
  const [standardLog, setStandardLog] = useState<string>('Yığıt hazır. LIFO (Last-In-First-Out) prensibiyle çalışır.');

  // Parentheses Checker State
  const [expr, setExpr] = useState<string>('{ [ ( 10 + 5 ) * 2 ] }');
  const [parenStack, setParenStack] = useState<string[]>([]);
  const [parenStep, setParenStep] = useState<number>(-1);
  const [parenStatus, setParenStatus] = useState<string>('İfadeyi kontrol etmek için "Adım Adım Doğrula" butonuna tıklayın.');
  const [parenResult, setParenResult] = useState<'valid' | 'invalid' | 'running' | null>(null);

  // JS Call Stack State
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [callStackStep, setCallStackStep] = useState<number>(0);
  const [callStackScenario, setCallStackScenario] = useState<'factorial' | 'nested'>('factorial');
  const [callStackLogs, setCallStackLogs] = useState<string[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Standard Stack Handlers ---
  const handlePush = () => {
    if (!inputValue.trim()) return;
    if (stack.length >= 8) {
      setStandardLog('Stack Overflow Uyarısı: Maksimum yığıt kapasitesi (8) aşılamaz!');
      return;
    }
    const newItem: StackItem = {
      id: Date.now().toString(),
      value: inputValue.trim(),
    };
    setStack([newItem, ...stack]); // Top of stack is at index 0 for UI presentation
    setStandardLog(`push("${newItem.value}"): Yeni eleman yığıtın tepesine (Top) eklendi. O(1)`);
    setInputValue('');
    setPeekedItem(null);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setStandardLog('Stack Underflow Uyarısı: Yığıt boş, pop() yapılamaz!');
      return;
    }
    const popped = stack[0];
    setStack(stack.slice(1));
    setStandardLog(`pop(): En üstteki eleman ("${popped.value}") çıkarıldı. O(1)`);
    setPeekedItem(null);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setStandardLog('Yığıt boş, peek() görüntülenecek eleman yok.');
      return;
    }
    const top = stack[0];
    setPeekedItem(top.id);
    setStandardLog(`peek(): En üstteki eleman incelendi: "${top.value}". Yığıttan silinmedi. O(1)`);
  };

  const handleClear = () => {
    setStack([]);
    setPeekedItem(null);
    setStandardLog('Yığıt temizlendi.');
  };

  // --- 2. Parentheses Checker Simulation ---
  const runParenthesesCheck = () => {
    setParenResult('running');
    const tokens = expr.split('').filter((c) => ['(', ')', '{', '}', '[', ']'].includes(c));
    let localStack: string[] = [];
    let idx = 0;

    const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

    const stepFn = () => {
      if (idx >= tokens.length) {
        if (localStack.length === 0) {
          setParenResult('valid');
          setParenStatus('Tebrikler! Tüm açılan parantezler doğru sırada kapatıldı. İfade dengeli (Balanced).');
        } else {
          setParenResult('invalid');
          setParenStatus(`Hata: Kapatılmayan parantezler kaldı (${localStack.join(', ')}). İfade dengesiz!`);
        }
        return;
      }

      const char = tokens[idx];
      setParenStep(idx);

      if (['(', '{', '['].includes(char)) {
        localStack = [char, ...localStack];
        setParenStack([...localStack]);
        setParenStatus(`'${char}' açılış parantezi görüldü -> Yığıta PUSH edildi.`);
      } else {
        const expected = pairs[char];
        if (localStack.length === 0 || localStack[0] !== expected) {
          setParenResult('invalid');
          setParenStatus(`Hata: '${char}' için beklenen '${expected}' bulunamadı! İfade dengesiz.`);
          return;
        } else {
          localStack = localStack.slice(1);
          setParenStack([...localStack]);
          setParenStatus(`'${char}' kapanış parantezi görüldü -> Eşleşen '${expected}' yığıttan POP edildi.`);
        }
      }

      idx++;
      timeoutRef.current = setTimeout(stepFn, 700);
    };

    stepFn();
  };

  // --- 3. JavaScript Call Stack Simulation ---
  const factorialSteps = [
    { frame: { id: 'f4', name: 'factorial(4)', args: 'n = 4', line: 1 }, action: 'push', log: 'factorial(4) çağrıldı -> Call Stack\'e eklendi. (Bekliyor: 4 * factorial(3))' },
    { frame: { id: 'f3', name: 'factorial(3)', args: 'n = 3', line: 1 }, action: 'push', log: 'factorial(3) çağrıldı -> Call Stack\'e eklendi. (Bekliyor: 3 * factorial(2))' },
    { frame: { id: 'f2', name: 'factorial(2)', args: 'n = 2', line: 1 }, action: 'push', log: 'factorial(2) çağrıldı -> Call Stack\'e eklendi. (Bekliyor: 2 * factorial(1))' },
    { frame: { id: 'f1', name: 'factorial(1)', args: 'n = 1', line: 2 }, action: 'push', log: 'factorial(1) çağrıldı -> Temel durum (Base Case): 1 döndürüyor!' },
    { frameId: 'f1', action: 'pop', returnVal: '1', log: 'factorial(1) bitti -> 1 döndü ve Stack\'ten POP edildi.' },
    { frameId: 'f2', action: 'pop', returnVal: '2', log: 'factorial(2) bitti -> 2 * 1 = 2 döndü ve Stack\'ten POP edildi.' },
    { frameId: 'f3', action: 'pop', returnVal: '6', log: 'factorial(3) bitti -> 3 * 2 = 6 döndü ve Stack\'ten POP edildi.' },
    { frameId: 'f4', action: 'pop', returnVal: '24', log: 'factorial(4) bitti -> 4 * 6 = 24 nihai sonuç üretildi!' },
  ];

  const handleStepCallStack = () => {
    if (callStackStep >= factorialSteps.length) {
      setCallStackStep(0);
      setCallStack([]);
      setCallStackLogs(['Simülasyon sıfırlandı. Tekrar adım adım ilerleyebilirsiniz.']);
      return;
    }

    const current = factorialSteps[callStackStep];
    if (current.action === 'push' && current.frame) {
      setCallStack((prev) => [current.frame as CallStackFrame, ...prev]);
    } else if (current.action === 'pop') {
      setCallStack((prev) => prev.slice(1));
    }

    setCallStackLogs((prev) => [current.log, ...prev]);
    setCallStackStep((prev) => prev + 1);
  };

  const handleResetCallStack = () => {
    setCallStack([]);
    setCallStackStep(0);
    setCallStackLogs(['Call Stack sıfırlandı.']);
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <span>02. Veri Yapısı</span>
              <span>·</span>
              <span>LIFO (Last In, First Out) & JS Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Yığıt (Stack) & JavaScript Call Stack Simülatörü
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Yığıt prensibinde son giren ilk çıkar (LIFO). Tarayıcı geçmişi (Back tuşu), metin düzenleyicideki Geri Al (Undo/Redo), parantez doğrulaması ve JavaScript motorunun fonksiyon çağrı yığını (Execution Context Stack) tamamen bu veri yapısıyla çalışır.
            </p>
          </div>

          {/* Sub-tabs selector */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Klasik Yığıt
            </button>
            <button
              onClick={() => setActiveTab('parentheses')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'parentheses'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Parantez Dengesi
            </button>
            <button
              onClick={() => setActiveTab('callstack')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'callstack'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JS Call Stack
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Standard Stack */}
      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Container */}
          <div className="lg:col-span-7 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between min-h-[460px]">
            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
              <span>Yığıt Görünümü (Top: En Üst)</span>
              <span>Boyut: {stack.length} / 8</span>
            </div>

            {/* Vertical Stack Tank */}
            <div className="w-72 relative flex flex-col justify-end p-3 rounded-b-2xl border-x-4 border-b-4 border-indigo-600/60 bg-slate-950/60 min-h-[320px] shadow-inner shadow-black">
              {/* Top pointer marker */}
              {stack.length > 0 && (
                <div className="absolute -top-7 left-0 right-0 flex items-center justify-center gap-1.5 text-xs font-mono text-indigo-400">
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  <span>TOP (En Üst Eleman)</span>
                </div>
              )}

              {/* Items in Stack */}
              <div className="space-y-2 w-full">
                {stack.map((item, index) => {
                  const isTop = index === 0;
                  const isPeeked = peekedItem === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`w-full py-3 px-4 rounded-xl border text-center font-mono font-bold transition-all duration-300 transform ${
                        isPeeked
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 scale-105 shadow-lg shadow-amber-950'
                          : isTop
                          ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs opacity-60 mb-0.5">
                        <span>slot #{stack.length - 1 - index}</span>
                        {isTop && <span className="text-[10px] bg-indigo-500/20 px-1 rounded text-indigo-300">TOP</span>}
                      </div>
                      <div className="text-lg">{item.value}</div>
                    </div>
                  );
                })}

                {stack.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-xs text-slate-600 font-mono">
                    <Layers className="w-8 h-8 mb-2 opacity-40" />
                    <span>Yığıt Boş (Underflow Durumu)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Base */}
            <div className="w-80 h-3 bg-indigo-700/80 rounded-full mt-2 shadow-lg shadow-indigo-900"></div>

            {/* Console Log */}
            <div className="w-full mt-6 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              {standardLog}
            </div>
          </div>

          {/* Controls Deck */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-sm font-semibold text-white">Yığıt İşlemleri (Operations)</h2>

              <div className="space-y-3">
                <label className="text-xs text-slate-400 block">Değer Girin:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Örn: 99 veya 'Sayfa'"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handlePush}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>push()</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handlePop}
                  disabled={stack.length === 0}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900 disabled:opacity-40 border border-rose-800/60 text-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>pop() (Çıkar)</span>
                </button>
                <button
                  onClick={handlePeek}
                  disabled={stack.length === 0}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-950/60 hover:bg-amber-900 disabled:opacity-40 border border-amber-800/60 text-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>peek() (İncele)</span>
                </button>
              </div>

              <button
                onClick={handleClear}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Yığıtı Boşalt (Clear)
              </button>
            </div>

            {/* Big O Reference */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
              <div className="text-slate-300 font-semibold mb-2">Zaman Karmaşıklığı (Big-O):</div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">push() Ekleme:</span>
                <span className="text-emerald-400 font-bold">O(1)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">pop() Çıkarma:</span>
                <span className="text-emerald-400 font-bold">O(1)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">peek() Zirve İnceleme:</span>
                <span className="text-emerald-400 font-bold">O(1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arama (Search):</span>
                <span className="text-amber-400 font-bold">O(n)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Parentheses Balance Checker */}
      {activeTab === 'parentheses' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Parantez Dengesi Doğrulayıcısı (Parentheses Matching)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Derleyiciler (Compilers) ve JavaScript sözdizimi ayrıştırıcıları kod bloklarının doğruluğunu yığıt yapısı ile test eder.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="Test edilecek matematiksel veya kod ifadesi..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={runParenthesesCheck}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Adım Adım Doğrula</span>
            </button>
          </div>

          {/* Visualization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2">Aktif Parantez Yığıtı:</div>
                <div className="flex gap-2 min-h-[60px] items-center p-3 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
                  {parenStack.length === 0 ? (
                    <span className="text-xs text-slate-500 font-mono">Yığıt boş</span>
                  ) : (
                    parenStack.map((char, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-mono font-bold rounded-md shadow-sm"
                      >
                        {char}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-mono text-slate-400 mb-1">Durum:</div>
                <div className="text-xs text-indigo-300 font-mono leading-relaxed">{parenStatus}</div>
              </div>
            </div>

            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center">
              {parenResult === 'valid' && (
                <div className="text-emerald-400 space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto" />
                  <div className="text-base font-bold">İfade Dengeli (Balanced)</div>
                  <p className="text-xs text-slate-400">Tüm açılan parantezler kurallara uygun kapatıldı.</p>
                </div>
              )}
              {parenResult === 'invalid' && (
                <div className="text-rose-400 space-y-2">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <div className="text-base font-bold">Hatalı Sözdizimi (Unbalanced)</div>
                  <p className="text-xs text-slate-400">Açılan parantez kapatılmadı veya yanlış türle kapatıldı.</p>
                </div>
              )}
              {parenResult !== 'valid' && parenResult !== 'invalid' && (
                <div className="text-slate-500 text-xs font-mono">
                  İfadeyi test etmek için "Adım Adım Doğrula"ya basın.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: JS Call Stack */}
      {activeTab === 'callstack' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">JavaScript Call Stack & Execution Context</h2>
              <p className="text-xs text-slate-400 mt-1">
                JavaScript tek iş parçacıklıdır (single-threaded). Her fonksiyon çağrıldığında yeni bir Yürütme Bağlamı (Frame) Call Stack'e itilir; `return` olduğunda yığıttan çıkarılır.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStepCallStack}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <FastForward className="w-4 h-4" />
                <span>Sonraki Adım ({callStackStep + 1}/{factorialSteps.length})</span>
              </button>
              <button
                onClick={handleResetCallStack}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* JS Code Window */}
            <div className="lg:col-span-5 p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500 pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>factorial.js</span>
                </div>
                <span>JavaScript Core</span>
              </div>
              <pre className="text-slate-300 space-y-1">
                <code>
                  <span className="text-purple-400">function</span> <span className="text-blue-400">factorial</span>(n) {'{'}{'\n'}
                  {'  '}<span className="text-purple-400">if</span> (n &lt;= 1) <span className="text-purple-400">return</span> <span className="text-amber-400">1</span>;{'\n'}
                  {'  '}<span className="text-purple-400">return</span> n * <span className="text-blue-400">factorial</span>(n - <span className="text-amber-400">1</span>);{'\n'}
                  {'}'}{'\n\n'}
                  <span className="text-purple-400">const</span> result = <span className="text-blue-400">factorial</span>(<span className="text-amber-400">4</span>);{'\n'}
                  console.<span className="text-blue-400">log</span>(result); <span className="text-slate-500">// 24</span>
                </code>
              </pre>
            </div>

            {/* Live Stack View */}
            <div className="lg:col-span-4 p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-end min-h-[260px]">
              <div className="text-xs font-mono text-slate-400 mb-3 text-center">
                Call Stack (Zirve: Aktif Çalışan Fonksiyon)
              </div>
              <div className="space-y-2">
                {callStack.map((frame, idx) => (
                  <div
                    key={frame.id}
                    className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                      idx === 0
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{frame.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{frame.args}</span>
                    </div>
                  </div>
                ))}
                {callStack.length === 0 && (
                  <div className="text-center text-xs text-slate-600 font-mono py-8">
                    Call Stack Boş (Tüm bağlamlar tamamlandı)
                  </div>
                )}
              </div>
            </div>

            {/* Execution Log */}
            <div className="lg:col-span-3 p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-y-auto max-h-[260px]">
              <div className="text-xs font-mono text-slate-400 mb-2">Çalışma Günlüğü:</div>
              <div className="space-y-2 text-[11px] font-mono">
                {callStackLogs.map((log, i) => (
                  <div key={i} className="text-slate-300 pb-1 border-b border-slate-900">
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
