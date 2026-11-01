import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { ThreadWorker, ThreadLog } from '../types';

interface SimulationTabProps {
  onGoToCode?: () => void;
}

const TOTAL_COUNT = 10000;
const CHUNK_SIZE = 2500;

const INITIAL_THREADS: ThreadWorker[] = [
  {
    id: 1,
    name: 'Thread-1',
    rangeStart: 1,
    rangeEnd: 2500,
    totalItems: 2500,
    processedCount: 0,
    currentNumber: null,
    status: 'IDLE',
    oddFound: 0,
    evenFound: 0,
    color: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    progressPercent: 0,
    lostCount: 0,
  },
  {
    id: 2,
    name: 'Thread-2',
    rangeStart: 2501,
    rangeEnd: 5000,
    totalItems: 2500,
    processedCount: 0,
    currentNumber: null,
    status: 'IDLE',
    oddFound: 0,
    evenFound: 0,
    color: 'from-purple-500 to-indigo-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    progressPercent: 0,
    lostCount: 0,
  },
  {
    id: 3,
    name: 'Thread-3',
    rangeStart: 5001,
    rangeEnd: 7500,
    totalItems: 2500,
    processedCount: 0,
    currentNumber: null,
    status: 'IDLE',
    oddFound: 0,
    evenFound: 0,
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    progressPercent: 0,
    lostCount: 0,
  },
  {
    id: 4,
    name: 'Thread-4',
    rangeStart: 7501,
    rangeEnd: 10000,
    totalItems: 2500,
    processedCount: 0,
    currentNumber: null,
    status: 'IDLE',
    oddFound: 0,
    evenFound: 0,
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    progressPercent: 0,
    lostCount: 0,
  },
];

export const SimulationTab: React.FC<SimulationTabProps> = ({ onGoToCode }) => {
  const [threads, setThreads] = useState<ThreadWorker[]>(INITIAL_THREADS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'instant'>('fast');
  const [isSynchronized, setIsSynchronized] = useState<boolean>(true);

  // Shared ArrayLists
  const [tekSayilar, setTekSayilar] = useState<number[]>([]);
  const [ciftSayilar, setCiftSayilar] = useState<number[]>([]);
  const [lostItemsTotal, setLostItemsTotal] = useState<number>(0);

  // Execution Stats
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Search in ArrayLists
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePoolTab, setActivePoolTab] = useState<'cift' | 'tek'>('cift');
  const [poolPage, setPoolPage] = useState<number>(1);
  const itemsPerPage = 40;

  // Logs
  const [logs, setLogs] = useState<ThreadLog[]>([]);
  const [logFilter, setLogFilter] = useState<number | 'all'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (
    threadId: number,
    threadName: string,
    message: string,
    type: ThreadLog['type']
  ) => {
    const newLog: ThreadLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
      threadId,
      threadName,
      message,
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 75)]);
  };

  // Reset function
  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setThreads(INITIAL_THREADS);
    setTekSayilar([]);
    setCiftSayilar([]);
    setLostItemsTotal(0);
    setElapsedTime(0);
    startTimeRef.current = null;
    setLogs([
      {
        id: 'init-log',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        threadId: 0,
        threadName: 'Sistem',
        message: "Simülasyon sıfırlandı. 10.000 elemanlık liste ve 4 Thread hazır. (Hazırlayan: Enes Öztürk)",
        type: 'info',
      },
    ]);
  };

  // Instant calculation
  const handleInstantRun = () => {
    setIsRunning(false);
    const start = performance.now();
    const newTek: number[] = [];
    const newCift: number[] = [];
    let lostCount = 0;

    const updatedThreads = INITIAL_THREADS.map((t) => {
      let tOdd = 0;
      let tEven = 0;
      let tLost = 0;

      for (let num = t.rangeStart; num <= t.rangeEnd; num++) {
        // If not synchronized, simulate 3.5% race condition loss
        if (!isSynchronized && Math.random() < 0.035) {
          tLost++;
          lostCount++;
          continue;
        }

        if (num % 2 === 0) {
          newCift.push(num);
          tEven++;
        } else {
          newTek.push(num);
          tOdd++;
        }
      }

      return {
        ...t,
        processedCount: t.totalItems,
        progressPercent: 100,
        status: 'FINISHED' as const,
        oddFound: tOdd,
        evenFound: tEven,
        lostCount: tLost,
        currentNumber: t.rangeEnd,
      };
    });

    const finish = performance.now();
    setThreads(updatedThreads);
    setTekSayilar(newTek);
    setCiftSayilar(newCift);
    setLostItemsTotal(lostCount);
    setIsCompleted(true);
    setElapsedTime(Math.round(finish - start) + 4);

    if (isSynchronized) {
      addLog(0, 'Main Thread', `Tüm thread'ler join() ile tamamlandı. 5000 tek ve 5000 çift sayı kilitlerle güvenle eklendi! Toplam: 10.000.`, 'success');
    } else {
      addLog(0, 'Main Thread', `UYARI: Senkronizasyon (synchronized) olmadığı için ${lostCount} sayı bellek yarışında (Race Condition) kayboldu!`, 'warning');
    }
  };

  // Step function
  const handleStep = () => {
    if (isCompleted) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const stepSize = speed === 'normal' ? 35 : 125;
    let allFinished = true;
    const addedTek: number[] = [];
    const addedCift: number[] = [];
    let newLost = 0;

    setThreads((prevThreads) => {
      const nextThreads = prevThreads.map((thread) => {
        if (thread.processedCount >= thread.totalItems) {
          return { ...thread, status: 'FINISHED' as const, progressPercent: 100 };
        }

        allFinished = false;
        const currentProcessed = thread.processedCount;
        const nextProcessed = Math.min(thread.totalItems, currentProcessed + stepSize);
        let oddCount = thread.oddFound;
        let evenCount = thread.evenFound;
        let lostCount = thread.lostCount || 0;
        let lastNum = thread.currentNumber;

        for (let i = currentProcessed; i < nextProcessed; i++) {
          const num = thread.rangeStart + i;
          lastNum = num;

          if (!isSynchronized && Math.random() < 0.035) {
            lostCount++;
            newLost++;
            continue;
          }

          if (num % 2 === 0) {
            addedCift.push(num);
            evenCount++;
          } else {
            addedTek.push(num);
            oddCount++;
          }
        }

        const percent = Math.round((nextProcessed / thread.totalItems) * 100);
        const status = nextProcessed >= thread.totalItems ? ('FINISHED' as const) : ('RUNNING' as const);

        return {
          ...thread,
          processedCount: nextProcessed,
          progressPercent: percent,
          status,
          oddFound: oddCount,
          evenFound: evenCount,
          lostCount,
          currentNumber: lastNum,
        };
      });

      return nextThreads;
    });

    if (addedTek.length > 0) setTekSayilar((prev) => [...prev, ...addedTek]);
    if (addedCift.length > 0) setCiftSayilar((prev) => [...prev, ...addedCift]);
    if (newLost > 0) setLostItemsTotal((prev) => prev + newLost);

    if (allFinished) {
      setIsRunning(false);
      setIsCompleted(true);
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
      addLog(0, 'Main Thread', `Tüm 4 Thread tamamlandı! join() çağrıları sonlandı.`, 'success');
    }
  };

  // Animation interval loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isCompleted) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      const delay = speed === 'normal' ? 60 : 30;

      interval = setInterval(() => {
        handleStep();
      }, delay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isCompleted, speed, isSynchronized]);

  // Log on start
  const handleTogglePlay = () => {
    if (isCompleted) {
      handleReset();
      setIsRunning(true);
      return;
    }
    if (!isRunning) {
      if (logs.length <= 1) {
        addLog(0, 'Main Thread', `t1.start(), t2.start(), t3.start(), t4.start() çağrıldı. 4 Thread eşzamanlı çalışıyor.`, 'info');
      }
    }
    setIsRunning(!isRunning);
  };

  // Search filtered results in pool
  const currentPoolData = activePoolTab === 'cift' ? ciftSayilar : tekSayilar;
  const filteredNumbers = useMemo(() => {
    if (!searchQuery.trim()) return currentPoolData;
    const query = searchQuery.trim();
    return currentPoolData.filter((num) => num.toString().includes(query));
  }, [currentPoolData, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNumbers.length / itemsPerPage));
  const paginatedNumbers = useMemo(() => {
    const start = (poolPage - 1) * itemsPerPage;
    return filteredNumbers.slice(start, start + itemsPerPage);
  }, [filteredNumbers, poolPage, itemsPerPage]);

  const totalProcessed = threads.reduce((acc, t) => acc + t.processedCount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards & Master List Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Master ArrayList Partitioning (1-10000 -> 4x 2500) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  1. Ana ArrayList ve 4 Eşit Parçaya Bölünmesi
                </h2>
                <p className="text-xs text-slate-400">
                  1'den 10000'e sayılar <code className="text-amber-400 font-mono">subList()</code> ile 2500 elemanlık 4 parçaya paylaştırılır
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                Toplam: {TOTAL_COUNT.toLocaleString('tr-TR')} Sayı
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/30">
                4 x 2500 Eleman
              </span>
            </div>
          </div>

          {/* Visual Chunky Bar of 10,000 Numbers */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-400">Parça 1 (t1)</span>
                  <span className="text-[11px] opacity-80">2500 eleman</span>
                </div>
                <div className="text-[11px] text-slate-400">1 ... 2500</div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-purple-400">Parça 2 (t2)</span>
                  <span className="text-[11px] opacity-80">2500 eleman</span>
                </div>
                <div className="text-[11px] text-slate-400">2501 ... 5000</div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-400">Parça 3 (t3)</span>
                  <span className="text-[11px] opacity-80">2500 eleman</span>
                </div>
                <div className="text-[11px] text-slate-400">5001 ... 7500</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-400">Parça 4 (t4)</span>
                  <span className="text-[11px] opacity-80">2500 eleman</span>
                </div>
                <div className="text-[11px] text-slate-400">7501 ... 10000</div>
              </div>
            </div>

            {/* Total progress visual bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
              {threads.map((t) => (
                <div
                  key={t.id}
                  style={{ width: `${(t.processedCount / TOTAL_COUNT) * 100}%` }}
                  className={`h-full bg-gradient-to-r ${t.color} transition-all duration-150`}
                  title={`${t.name}: %${t.progressPercent}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Info Tip */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Her thread sadece kendi 2500 elemanlık listesini okur; ancak bulduğu çift ve tek sayıları <strong>ortak iki ArrayList</strong>'e ekler.
            </span>
          </div>
        </div>

        {/* Right: Controls & Synchronization Mode Switch */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                Simülasyon Kontrolleri
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' :
                isCompleted ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-slate-800 text-slate-400'
              }`}>
                {isRunning ? 'ÇALIŞIYOR' : isCompleted ? 'TAMAMLANDI' : 'HAZIR'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={handleTogglePlay}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all shadow-md ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> {isCompleted ? 'Tekrar Başlat' : 'Thread Başlat'}
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Sıfırla
              </button>
            </div>

            {/* Speed & Instant Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-4">
              <button
                onClick={() => setSpeed('normal')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  speed === 'normal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setSpeed('fast')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  speed === 'fast' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hızlı
              </button>
              <button
                onClick={handleInstantRun}
                className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
                title="10.000 sayıyı anında hesapla"
              >
                <Zap className="w-3.5 h-3.5" /> Anında
              </button>
            </div>
          </div>

          {/* Senkronizasyon (Thread-Safety) Toggle */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                {isSynchronized ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                )}
                Senkronizasyon (Thread-Safe):
              </span>
              <button
                onClick={() => setIsSynchronized(!isSynchronized)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  isSynchronized ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isSynchronized ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isSynchronized ? (
                <span className="text-emerald-400 font-medium">
                  ✓ 'synchronized' kilitleri aktif. 5000 tek ve 5000 çift tam ayrıştırılır.
                </span>
              ) : (
                <span className="text-rose-400 font-medium">
                  ⚠ Senkronizasyonsuz (Race Condition modu)! Çoklu thread çakışması sonucu veri kaybı gösterilir.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Worker Threads Status Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. 4 Ayrı Worker Thread Durumu
            </h3>
            <span className="text-xs text-slate-400">
              (Eşzamanlı 4 çekirdek simülasyonu)
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            İşlenen: {totalProcessed.toLocaleString('tr-TR')} / {TOTAL_COUNT.toLocaleString('tr-TR')} (%{Math.round((totalProcessed / TOTAL_COUNT) * 100)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {threads.map((thread) => {
            const isDone = thread.status === 'FINISHED';
            const isActive = thread.status === 'RUNNING';

            return (
              <div
                key={thread.id}
                className={`relative rounded-2xl bg-slate-900 border p-4 transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                    : isDone
                    ? 'border-slate-700/80'
                    : 'border-slate-800'
                }`}
              >
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${thread.color} ${isActive ? 'animate-ping' : ''}`} />
                    <span className="font-bold text-sm text-white">{thread.name}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${thread.badgeBg}`}>
                    {thread.status}
                  </span>
                </div>

                {/* Range description */}
                <div className="text-xs text-slate-400 mb-3 font-mono">
                  Aralık: [{thread.rangeStart} - {thread.rangeEnd}]
                </div>

                {/* Current Processing Indicator */}
                <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                    <span>Şu anki Sayı:</span>
                    <span className="font-mono text-white font-bold">
                      {thread.currentNumber !== null ? thread.currentNumber : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>İşlenen:</span>
                    <span className="font-mono text-slate-300">
                      {thread.processedCount} / {thread.totalItems}
                    </span>
                  </div>
                </div>

                {/* Odd / Even counters */}
                <div className="grid grid-cols-2 gap-1.5 mb-3 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40">
                    <span className="text-[10px] text-indigo-400 block font-medium">Tek Sayı</span>
                    <span className="font-mono font-bold text-indigo-200">{thread.oddFound}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-950/40">
                    <span className="text-[10px] text-emerald-400 block font-medium">Çift Sayı</span>
                    <span className="font-mono font-bold text-emerald-200">{thread.evenFound}</span>
                  </div>
                </div>

                {/* Lost count in unsafe mode */}
                {!isSynchronized && (thread.lostCount || 0) > 0 && (
                  <div className="mb-2 px-2 py-1 rounded bg-rose-950/40 border border-rose-900/50 text-[10px] text-rose-300 flex justify-between">
                    <span>Kayıp (Race Cond.):</span>
                    <span className="font-bold font-mono">-{thread.lostCount}</span>
                  </div>
                )}

                {/* Thread Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>İlerleme</span>
                    <span className="font-mono">{thread.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${thread.progressPercent}%` }}
                      className={`h-full bg-gradient-to-r ${thread.color} transition-all duration-100`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Destination ArrayLists (ciftSayilar & tekSayilar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 2 Shared Result Pools */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              3. Ortak Sonuç Listeleri (Shared ArrayLists)
            </h3>
            {elapsedTime > 0 && (
              <span className="text-xs text-slate-400 font-mono">
                Süre: <strong className="text-white">{elapsedTime} ms</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Even Numbers Pool Card */}
            <div
              onClick={() => setActivePoolTab('cift')}
              className={`rounded-2xl bg-slate-900 border p-4 cursor-pointer transition-all ${
                activePoolTab === 'cift'
                  ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  ciftSayilar (ArrayList)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Beklenen: 5.000
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {ciftSayilar.length.toLocaleString('tr-TR')}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 5.000 eleman</span>
              </div>

              {/* Progress */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div
                  style={{ width: `${Math.min(100, (ciftSayilar.length / 5000) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                4 Thread'in mod 2 = 0 olan sayıları{' '}
                <code className="text-emerald-300 font-mono">synchronized</code> kilit ile eklediği havuz.
              </p>
            </div>

            {/* Odd Numbers Pool Card */}
            <div
              onClick={() => setActivePoolTab('tek')}
              className={`rounded-2xl bg-slate-900 border p-4 cursor-pointer transition-all ${
                activePoolTab === 'tek'
                  ? 'border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  tekSayilar (ArrayList)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Beklenen: 5.000
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {tekSayilar.length.toLocaleString('tr-TR')}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 5.000 eleman</span>
              </div>

              {/* Progress */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div
                  style={{ width: `${Math.min(100, (tekSayilar.length / 5000) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-150"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                4 Thread'in mod 2 != 0 olan sayıları{' '}
                <code className="text-indigo-300 font-mono">synchronized</code> kilit ile eklediği havuz.
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          {isCompleted && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isSynchronized && ciftSayilar.length === 5000 && tekSayilar.length === 5000
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSynchronized ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {isSynchronized
                      ? 'Ödev Başarıyla Tamamlandı! (10.000/10.000)'
                      : `Race Condition Uyarısı! ${lostItemsTotal} Adet Sayı Kayboldu`}
                  </h4>
                  <p className="text-xs opacity-80">
                    {isSynchronized
                      ? '5000 tek ve 5000 çift sayı hiçbir veri kaybı olmadan ayrıştırıldı. Hazırlayan: Enes Öztürk'
                      : 'ArrayList eşzamanlı yazmaya dayanıklı olmadığı için synchronized kilidi olmadan elemanlar ezildi.'}
                  </p>
                </div>
              </div>

              {onGoToCode && (
                <button
                  onClick={onGoToCode}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Kodu İncele <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Data Explorer / Search in ArrayList */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Liste İçi Arama ve Doğrulama
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {activePoolTab === 'cift' ? 'ciftSayilar' : 'tekSayilar'}
              </span>
            </div>

            {/* Quick pool switcher */}
            <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
              <button
                onClick={() => {
                  setActivePoolTab('cift');
                  setPoolPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  activePoolTab === 'cift' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Çift
              </button>
              <button
                onClick={() => {
                  setActivePoolTab('tek');
                  setPoolPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  activePoolTab === 'tek' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tek
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Örn: 2498, 5000, 9999..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPoolPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Numbers preview grid */}
          <div className="flex-1 min-h-[160px] max-h-[190px] overflow-y-auto bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 mb-3">
            {paginatedNumbers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-6">
                <span>Henüz eleman eklenmedi veya arama sonucu bulunamadı.</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {paginatedNumbers.map((num) => (
                  <span
                    key={num}
                    className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${
                      activePoolTab === 'cift'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50'
                        : 'bg-indigo-950/40 text-indigo-300 border-indigo-900/50'
                    }`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>
              Toplam {filteredNumbers.length.toLocaleString('tr-TR')} sonuç
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={poolPage <= 1}
                onClick={() => setPoolPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                &larr;
              </button>
              <span className="font-mono text-[11px] px-1">
                {poolPage} / {totalPages}
              </span>
              <button
                disabled={poolPage >= totalPages}
                onClick={() => setPoolPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Thread Logs Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Thread Konsol & Senkronizasyon Olayları (Live Logs)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Thread'ler</option>
              <option value="1">Thread-1</option>
              <option value="2">Thread-2</option>
              <option value="3">Thread-3</option>
              <option value="4">Thread-4</option>
            </select>

            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 cursor-pointer"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Logs container */}
        <div className="h-44 overflow-y-auto bg-slate-950 rounded-xl p-3 font-mono text-[11px] space-y-1.5 border border-slate-800/80">
          {logs
            .filter((l) => logFilter === 'all' || l.threadId === logFilter)
            .map((log) => {
              const colorClass =
                log.type === 'success'
                  ? 'text-emerald-400'
                  : log.type === 'warning'
                  ? 'text-amber-400'
                  : log.type === 'even'
                  ? 'text-teal-300'
                  : log.type === 'odd'
                  ? 'text-purple-300'
                  : 'text-slate-400';

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      log.threadId === 1
                        ? 'text-blue-400'
                        : log.threadId === 2
                        ? 'text-purple-400'
                        : log.threadId === 3
                        ? 'text-emerald-400'
                        : log.threadId === 4
                        ? 'text-amber-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    [{log.threadName}]
                  </span>
                  <span className={colorClass}>{log.message}</span>
                </div>
              );
            })}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};
