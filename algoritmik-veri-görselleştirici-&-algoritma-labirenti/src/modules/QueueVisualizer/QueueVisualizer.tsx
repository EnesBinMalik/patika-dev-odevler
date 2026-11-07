import React, { useState, useRef } from 'react';
import { FastForward, ArrowRight, ArrowLeft, RotateCcw, Clock, Cpu, Play, Terminal } from 'lucide-react';

interface QueueItem {
  id: string;
  value: string;
}

export const QueueVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'circular' | 'eventloop'>('standard');

  // Standard Queue State
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', value: 'Müşteri #1' },
    { id: '2', value: 'Müşteri #2' },
    { id: '3', value: 'Müşteri #3' },
  ]);
  const [inputValue, setInputValue] = useState<string>('Yeni Müşteri');
  const [standardLog, setStandardLog] = useState<string>('Kuyruk hazır. FIFO (First-In-First-Out) prensibiyle çalışır.');

  // Circular Queue State (Fixed size array of 6 slots)
  const CIRCULAR_SIZE = 6;
  const [circularSlots, setCircularSlots] = useState<(string | null)[]>(['A', 'B', 'C', null, null, null]);
  const [frontPtr, setFrontPtr] = useState<number>(0);
  const [rearPtr, setRearPtr] = useState<number>(2);
  const [circularCount, setCircularCount] = useState<number>(3);
  const [circularInput, setCircularInput] = useState<string>('D');
  const [circularLog, setCircularLog] = useState<string>('Dairesel kuyruk hazır. (rear + 1) % size formülüyle bellek verimli kullanılır.');

  // JavaScript Event Loop State
  const eventLoopScript = [
    {
      code: 'console.log("1: Senkron Başladı");',
      action: 'stack',
      stack: ['console.log("1")'],
      webApi: [],
      micro: [],
      macro: [],
      console: ['1: Senkron Başladı'],
      expl: '1. Adım: İlk senkron satır Call Stack\'e girer ve anında konsola yazıp yığından çıkar (Pop).',
    },
    {
      code: 'setTimeout(() => console.log("2: setTimeout Callback"), 0);',
      action: 'webapi',
      stack: ['setTimeout(fn, 0)'],
      webApi: ['Timer (0ms) -> fn'],
      micro: [],
      macro: [],
      console: ['1: Senkron Başladı'],
      expl: '2. Adım: setTimeout bir Web API\'dir. Callback tarayıcı arka plan zamanlayıcısına (Web API) devredilir.',
    },
    {
      code: '// Web API süresi bitti -> Macrotask kuyruğuna aktarıldı',
      action: 'macro',
      stack: [],
      webApi: [],
      micro: [],
      macro: ['callback: console.log("2")'],
      console: ['1: Senkron Başladı'],
      expl: '3. Adım: 0ms dolduğu an callback Web API\'den "Macrotask (Callback) Queue" kuyruğuna sıraya girer.',
    },
    {
      code: 'Promise.resolve().then(() => console.log("3: Microtask Promise"));',
      action: 'micro',
      stack: ['Promise.then(fn)'],
      webApi: [],
      micro: ['then: console.log("3")'],
      macro: ['callback: console.log("2")'],
      console: ['1: Senkron Başladı'],
      expl: '4. Adım: Promise.then bir Microtask\'tir! Callback öncelikli "Microtask Queue" kuyruğuna itilir.',
    },
    {
      code: 'console.log("4: Senkron Bitti");',
      action: 'stack',
      stack: ['console.log("4")'],
      webApi: [],
      micro: ['then: console.log("3")'],
      macro: ['callback: console.log("2")'],
      console: ['1: Senkron Başladı', '4: Senkron Bitti'],
      expl: '5. Adım: Son senkron satır Call Stack\'te çalışır ve konsola yazar. Senkron kodlar bitti!',
    },
    {
      code: '// Event Loop Tıklar: Call Stack boşaldı! Öncelik Microtask Kuyruğunda!',
      action: 'micro-exec',
      stack: ['then: console.log("3")'],
      webApi: [],
      micro: [],
      macro: ['callback: console.log("2")'],
      console: ['1: Senkron Başladı', '4: Senkron Bitti', '3: Microtask Promise'],
      expl: '6. Adım: Event Loop, Microtask kuyruğunun Macrotask\'e göre ÖNCELİKLİ olduğunu bilir. Promise callback Call Stack\'e alınır ve çalıştırılır.',
    },
    {
      code: '// Event Loop Tıklar: Microtask boş. Sıradaki Macrotask kuyruktan alınıyor!',
      action: 'macro-exec',
      stack: ['callback: console.log("2")'],
      webApi: [],
      micro: [],
      macro: [],
      console: ['1: Senkron Başladı', '4: Senkron Bitti', '3: Microtask Promise', '2: setTimeout Callback'],
      expl: '7. Adım: Microtask kuyruğu tamamen temizlendikten sonra setTimeout callback Call Stack\'e girer ve tamamlanır.',
    },
  ];

  const [eventStep, setEventStep] = useState<number>(0);
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(false);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Standard Queue Handlers ---
  const handleEnqueue = () => {
    if (!inputValue.trim()) return;
    if (queue.length >= 8) {
      setStandardLog('Kuyruk Dolu: Maksimum kapasite (8) aşılamaz!');
      return;
    }
    const newItem: QueueItem = { id: Date.now().toString(), value: inputValue.trim() };
    setQueue([...queue, newItem]);
    setStandardLog(`enqueue("${newItem.value}"): Yeni eleman kuyruğun arkasına (Rear) katıldı. O(1)`);
    setInputValue('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setStandardLog('Kuyruk Boş: Çıkarılacak eleman yok (Underflow).');
      return;
    }
    const dequeued = queue[0];
    setQueue(queue.slice(1));
    setStandardLog(`dequeue(): En öndeki eleman ("${dequeued.value}") işlem görüp ayrıldı. O(1)`);
  };

  // --- Circular Queue Handlers ---
  const handleCircularEnqueue = () => {
    if (!circularInput.trim()) return;
    if (circularCount === CIRCULAR_SIZE) {
      setCircularLog('Dairesel Kuyruk Dolu (Overflow)! front == (rear + 1) % size');
      return;
    }

    const nextRear = circularCount === 0 ? frontPtr : (rearPtr + 1) % CIRCULAR_SIZE;
    const newSlots = [...circularSlots];
    newSlots[nextRear] = circularInput.trim();

    setCircularSlots(newSlots);
    setRearPtr(nextRear);
    setCircularCount(circularCount + 1);
    setCircularLog(`enqueue("${circularInput}") -> Slot [${nextRear}]'e yazıldı. Yeni Rear: ${nextRear}. Formül: (rear + 1) % 6`);
    setCircularInput(String.fromCharCode(circularInput.charCodeAt(0) + 1));
  };

  const handleCircularDequeue = () => {
    if (circularCount === 0) {
      setCircularLog('Dairesel Kuyruk Boş (Underflow)! Çıkarılacak eleman yok.');
      return;
    }

    const removedVal = circularSlots[frontPtr];
    const newSlots = [...circularSlots];
    newSlots[frontPtr] = null;

    const nextFront = (frontPtr + 1) % CIRCULAR_SIZE;
    setCircularSlots(newSlots);
    setFrontPtr(nextFront);
    setCircularCount(circularCount - 1);
    setCircularLog(`dequeue() -> Slot [${frontPtr}] ("${removedVal}") serbest bırakıldı. Yeni Front: ${nextFront}`);
  };

  // --- Event Loop Step Handler ---
  const handleNextEventStep = () => {
    if (eventStep >= eventLoopScript.length - 1) {
      setEventStep(0);
    } else {
      setEventStep(eventStep + 1);
    }
  };

  const handleResetEventLoop = () => {
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    setIsLoopPlaying(false);
    setEventStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <span>03. Veri Yapısı</span>
              <span>·</span>
              <span>FIFO (First In, First Out) & Asenkron Mimari</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Kuyruk (Queue) & JS Event Loop Simülatörü
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Kuyruk prensibinde ilk gelen ilk çıkar (FIFO). Yazıcı kuyrukları, web sunucusu istek havuzları ve JavaScript'in asenkron çalışma motoru olan Event Loop (Microtask vs Macrotask) bu yapı üzerine kuruludur.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Klasik Kuyruk
            </button>
            <button
              onClick={() => setActiveTab('circular')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'circular'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dairesel Kuyruk (Ring)
            </button>
            <button
              onClick={() => setActiveTab('eventloop')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'eventloop'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JS Event Loop
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Standard Queue */}
      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ArrowLeft className="w-4 h-4" />
                  FRONT (Çıkış Noktası)
                </span>
                <span>Eleman Sayısı: {queue.length} / 8</span>
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  REAR (Giriş Noktası)
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>

              {/* Horizontal Queue Pipe */}
              <div className="relative p-4 rounded-2xl border-y-2 border-indigo-500/40 bg-slate-950/60 min-h-[160px] flex items-center overflow-x-auto shadow-inner">
                <div className="flex items-center gap-3 w-full">
                  {queue.map((item, index) => {
                    const isFront = index === 0;
                    const isRear = index === queue.length - 1;
                    return (
                      <div
                        key={item.id}
                        className={`min-w-[120px] p-4 rounded-xl border flex flex-col items-center justify-between transition-all duration-300 ${
                          isFront
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950 scale-105'
                            : isRear
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-md shadow-indigo-950'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full text-[10px] font-mono opacity-70 mb-1">
                          <span>pos #{index}</span>
                          {isFront && <span className="text-emerald-400 font-bold">FRONT</span>}
                          {isRear && !isFront && <span className="text-indigo-400 font-bold">REAR</span>}
                        </div>
                        <div className="text-sm font-bold font-mono py-1 text-center">
                          {item.value}
                        </div>
                      </div>
                    );
                  })}

                  {queue.length === 0 && (
                    <div className="w-full text-center text-xs text-slate-500 font-mono py-8">
                      Kuyruk Boş (Hiçbir işlem sırası yok)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Console Log */}
            <div className="mt-6 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              {standardLog}
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-sm font-semibold text-white">Kuyruk Kontrolleri</h2>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">Kuyruğa Eleman Ekle:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Müşteri veya Görev Adı"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleEnqueue}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    enqueue()
                  </button>
                </div>
              </div>

              <button
                onClick={handleDequeue}
                disabled={queue.length === 0}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>dequeue() (En Öndekini İşle)</span>
              </button>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-slate-400 font-semibold">Karmaşıklık Analizi:</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">enqueue (Ekleme):</span>
                  <span className="text-emerald-400 font-bold">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">dequeue (Çıkarma):</span>
                  <span className="text-emerald-400 font-bold">O(1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Circular Queue */}
      {activeTab === 'circular' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Dairesel Kuyruk (Circular Buffer)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sabit boyutlu dizilerde baştan silinen elemanların alanını boşa harcamamak için `(rear + 1) % size` formülüyle başa saran halka bellek mimarisidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Ring Representation */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="grid grid-cols-3 gap-3 w-72">
                {circularSlots.map((slot, idx) => {
                  const isFront = frontPtr === idx && circularCount > 0;
                  const isRear = rearPtr === idx && circularCount > 0;
                  return (
                    <div
                      key={idx}
                      className={`h-24 rounded-xl border flex flex-col items-center justify-between p-2 text-center transition-all ${
                        slot !== null
                          ? 'bg-slate-900 border-indigo-500/60 text-white'
                          : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-500">[{idx}]</div>
                      <div className="text-lg font-bold font-mono">
                        {slot || '—'}
                      </div>
                      <div className="flex gap-1 text-[9px] font-mono">
                        {isFront && <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">F</span>}
                        {isRear && <span className="bg-indigo-500/20 text-indigo-400 px-1 rounded">R</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-4 text-xs font-mono">
                <span className="text-emerald-400">Front İndeks: {frontPtr}</span>
                <span className="text-indigo-400">Rear İndeks: {rearPtr}</span>
                <span className="text-slate-400">Dolu: {circularCount}/{CIRCULAR_SIZE}</span>
              </div>
            </div>

            {/* Circular Controls */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={circularInput}
                  onChange={(e) => setCircularInput(e.target.value)}
                  placeholder="Veri"
                  className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                />
                <button
                  onClick={handleCircularEnqueue}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Dairesel enqueue()
                </button>
              </div>

              <button
                onClick={handleCircularDequeue}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Dairesel dequeue()
              </button>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                {circularLog}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: JavaScript Event Loop Simulator */}
      {activeTab === 'eventloop' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">JavaScript Event Loop, Microtask & Macrotask Kuyrukları</h2>
              <p className="text-xs text-slate-400 mt-1">
                JS tek iş parçacığında çalışırken asenkron işlemleri nasıl çözer? Microtask (Promise) vs Macrotask (setTimeout) öncelik farkı.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextEventStep}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <FastForward className="w-4 h-4" />
                <span>Sonraki Adım ({eventStep + 1}/{eventLoopScript.length})</span>
              </button>
              <button
                onClick={handleResetEventLoop}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Step Explanation */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 font-mono">
            <strong>Adım {eventStep + 1}:</strong> {eventLoopScript[eventStep].expl}
          </div>

          {/* Event Loop Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Call Stack */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="font-bold text-white">1. Call Stack</span>
                <span className="text-[10px] text-indigo-400">LIFO</span>
              </div>
              <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                {eventLoopScript[eventStep].stack.map((item, i) => (
                  <div key={i} className="p-2 bg-indigo-600/30 border border-indigo-500 text-indigo-200 rounded text-xs font-mono text-center">
                    {item}
                  </div>
                ))}
                {eventLoopScript[eventStep].stack.length === 0 && (
                  <div className="text-center text-slate-600 text-xs font-mono py-8">Boş</div>
                )}
              </div>
            </div>

            {/* 2. Web APIs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="font-bold text-white">2. Web APIs</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                {eventLoopScript[eventStep].webApi.map((item, i) => (
                  <div key={i} className="p-2 bg-amber-950/40 border border-amber-600 text-amber-200 rounded text-xs font-mono text-center">
                    {item}
                  </div>
                ))}
                {eventLoopScript[eventStep].webApi.length === 0 && (
                  <div className="text-center text-slate-600 text-xs font-mono py-8">İşlem Yok</div>
                )}
              </div>
            </div>

            {/* 3. Microtask Queue (Promises) */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="font-bold text-purple-300">3. Microtask Queue</span>
                <span className="text-[10px] text-purple-400 font-bold">ÖNCELİKLİ</span>
              </div>
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                {eventLoopScript[eventStep].micro.map((item, i) => (
                  <div key={i} className="p-2 bg-purple-950/50 border border-purple-500 text-purple-200 rounded text-xs font-mono text-center">
                    {item}
                  </div>
                ))}
                {eventLoopScript[eventStep].micro.length === 0 && (
                  <div className="text-center text-slate-600 text-xs font-mono py-8">Kuyruk Boş</div>
                )}
              </div>
            </div>

            {/* 4. Macrotask Queue (setTimeout) */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="font-bold text-blue-300">4. Macrotask Queue</span>
                <span className="text-[10px] text-blue-400">Callback</span>
              </div>
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                {eventLoopScript[eventStep].macro.map((item, i) => (
                  <div key={i} className="p-2 bg-blue-950/50 border border-blue-500 text-blue-200 rounded text-xs font-mono text-center">
                    {item}
                  </div>
                ))}
                {eventLoopScript[eventStep].macro.length === 0 && (
                  <div className="text-center text-slate-600 text-xs font-mono py-8">Kuyruk Boş</div>
                )}
              </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400 pb-2 mb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Konsol Çıktısı (Console Output):</span>
            </div>
            <div className="space-y-1 text-emerald-400">
              {eventLoopScript[eventStep].console.map((line, i) => (
                <div key={i}>&gt; {line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
