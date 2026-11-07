import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Search, Plus, Trash2, ArrowRight, Zap, Info, ArrowDown } from 'lucide-react';

interface ArrayItem {
  id: string;
  value: number;
  address: string;
}

export const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([
    { id: '1', value: 15, address: '0x1000' },
    { id: '2', value: 42, address: '0x1004' },
    { id: '3', value: 8, address: '0x1008' },
    { id: '4', value: 23, address: '0x100C' },
    { id: '5', value: 67, address: '0x1010' },
    { id: '6', value: 31, address: '0x1014' },
    { id: '7', value: 94, address: '0x1018' },
  ]);

  const [capacity, setCapacity] = useState<number>(10);
  const [accessIndex, setAccessIndex] = useState<string>('2');
  const [searchValue, setSearchValue] = useState<string>('23');
  const [newValue, setNewValue] = useState<string>('50');
  const [insertIndex, setInsertIndex] = useState<string>('2');
  
  // Animation / simulation states
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [lowHighPointers, setLowHighPointers] = useState<{ low: number; mid: number; high: number } | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Dizi hazır. Bellek adresi ve indeks üzerinden O(1) erişimi veya O(n) doğrusal / O(log n) ikili aramayı test edebilirsiniz.'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastAccessedAddress, setLastAccessedAddress] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearSimulation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSimulating(false);
    setActiveIndices([]);
    setFoundIndex(null);
    setLowHighPointers(null);
    setEliminatedIndices([]);
    setLastAccessedAddress(null);
  };

  // 1. Direct Access O(1)
  const handleAccess = () => {
    clearSimulation();
    const idx = parseInt(accessIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setStatusMessage(`Hata: İndeks ${idx} geçersiz! Dizi boyutu: ${array.length}`);
      return;
    }
    const item = array[idx];
    setActiveIndices([idx]);
    setFoundIndex(idx);
    setLastAccessedAddress(item.address);
    setStatusMessage(
      `O(1) Doğrudan Erişim: array[${idx}] = ${item.value}. Bellek Adresi: 0x1000 + (${idx} × 4 Byte) = ${item.address}`
    );
  };

  // 2. Linear Search O(n)
  const handleLinearSearch = () => {
    clearSimulation();
    const target = parseInt(searchValue, 10);
    if (isNaN(target)) return;

    setIsSimulating(true);
    let step = 0;

    const checkNext = () => {
      if (step >= array.length) {
        setIsSimulating(false);
        setActiveIndices([]);
        setStatusMessage(`Doğrusal Arama Tamamlandı: ${target} dizide bulunamadı. Yapılan karşılaştırma: ${array.length} (En kötü durum: O(n))`);
        return;
      }

      setActiveIndices([step]);
      if (array[step].value === target) {
        setFoundIndex(step);
        setIsSimulating(false);
        setStatusMessage(`Değer Bulundu! array[${step}] === ${target}. Adım sayısı: ${step + 1}. Karmaşıklık: O(n)`);
        return;
      } else {
        setStatusMessage(`Adım ${step + 1}: array[${step}] (${array[step].value}) !== ${target}. Sonraki elemana geçiliyor...`);
        step++;
        timeoutRef.current = setTimeout(checkNext, 600);
      }
    };

    checkNext();
  };

  // 3. Binary Search O(log n)
  const handleBinarySearch = () => {
    clearSimulation();
    const target = parseInt(searchValue, 10);
    if (isNaN(target)) return;

    // Check if sorted, if not sort first
    const isSorted = array.every((item, i) => i === 0 || item.value >= array[i - 1].value);
    let currentArray = array;
    if (!isSorted) {
      const sorted = [...array].sort((a, b) => a.value - b.value).map((item, i) => ({
        ...item,
        address: `0x${(0x1000 + i * 4).toString(16).toUpperCase()}`
      }));
      setArray(sorted);
      currentArray = sorted;
      setStatusMessage('İkili Arama için dizi önce sıralandı (Binary Search önkoşulu).');
    }

    setIsSimulating(true);
    let low = 0;
    let high = currentArray.length - 1;
    const eliminated: number[] = [];

    const searchStep = () => {
      if (low > high) {
        setIsSimulating(false);
        setLowHighPointers(null);
        setActiveIndices([]);
        setStatusMessage(`İkili Arama: ${target} bulunamadı! [low > high]. Karmaşıklık: O(log n)`);
        return;
      }

      const mid = Math.floor((low + high) / 2);
      setLowHighPointers({ low, mid, high });
      setActiveIndices([mid]);

      if (currentArray[mid].value === target) {
        setFoundIndex(mid);
        setIsSimulating(false);
        setStatusMessage(`Hedef Bulundu! array[${mid}] === ${target}. [low: ${low}, mid: ${mid}, high: ${high}]. O(log n) hızında ulaşıldı.`);
        return;
      } else if (currentArray[mid].value < target) {
        setStatusMessage(`array[${mid}] (${currentArray[mid].value}) < ${target} olduğu için sol yarı elendi.`);
        for (let i = low; i <= mid; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        setEliminatedIndices([...eliminated]);
        low = mid + 1;
        timeoutRef.current = setTimeout(searchStep, 800);
      } else {
        setStatusMessage(`array[${mid}] (${currentArray[mid].value}) > ${target} olduğu için sağ yarı elendi.`);
        for (let i = mid; i <= high; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        setEliminatedIndices([...eliminated]);
        high = mid - 1;
        timeoutRef.current = setTimeout(searchStep, 800);
      }
    };

    timeoutRef.current = setTimeout(searchStep, 400);
  };

  // 4. Insert Operations
  const handlePush = () => {
    clearSimulation();
    const val = parseInt(newValue, 10);
    if (isNaN(val)) return;

    if (array.length >= capacity) {
      const newCap = capacity * 2;
      setCapacity(newCap);
      setStatusMessage(`Dinamik Dizi Yeniden Boyutlandırma: Kapasite dolduğu için 2 katına çıkarıldı (${capacity} -> ${newCap}).`);
    }

    const nextAddr = `0x${(0x1000 + array.length * 4).toString(16).toUpperCase()}`;
    const newItem: ArrayItem = { id: Date.now().toString(), value: val, address: nextAddr };
    const newArr = [...array, newItem];
    setArray(newArr);
    setActiveIndices([newArr.length - 1]);
    setStatusMessage(`Sona Ekleme (push): array[${newArr.length - 1}] = ${val}. O(1) karmaşıklık.`);
  };

  const handleUnshift = () => {
    clearSimulation();
    const val = parseInt(newValue, 10);
    if (isNaN(val)) return;

    if (array.length >= capacity) {
      setCapacity(capacity * 2);
    }

    const newArr = [
      { id: Date.now().toString(), value: val, address: '0x1000' },
      ...array.map((item, i) => ({
        ...item,
        address: `0x${(0x1000 + (i + 1) * 4).toString(16).toUpperCase()}`
      }))
    ];
    setArray(newArr);
    setActiveIndices([0]);
    setStatusMessage(`Başa Ekleme (unshift): Mevcut tüm elemanlar 1 birim sağa kaydırıldı (Shift). Karmaşıklık: O(n).`);
  };

  const handleInsertAt = () => {
    clearSimulation();
    const val = parseInt(newValue, 10);
    const idx = parseInt(insertIndex, 10);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx > array.length) {
      setStatusMessage(`Hata: İndeks 0 ile ${array.length} arasında olmalıdır.`);
      return;
    }

    if (array.length >= capacity) setCapacity(capacity * 2);

    const newArr = [...array];
    newArr.splice(idx, 0, { id: Date.now().toString(), value: val, address: '' });
    const formatted = newArr.map((item, i) => ({
      ...item,
      address: `0x${(0x1000 + i * 4).toString(16).toUpperCase()}`
    }));
    setArray(formatted);
    setActiveIndices([idx]);
    setStatusMessage(`İndekse Ekleme: array.splice(${idx}, 0, ${val}). ${idx}. indeksten sonraki elemanlar kaydırıldı. O(n).`);
  };

  // 5. Delete Operations
  const handlePop = () => {
    clearSimulation();
    if (array.length === 0) return;
    const removed = array[array.length - 1];
    setArray(array.slice(0, -1));
    setStatusMessage(`Sondan Silme (pop): Değer ${removed.value} kaldırıldı. Bellek kaydırma gerekmez: O(1).`);
  };

  const handleShift = () => {
    clearSimulation();
    if (array.length === 0) return;
    const removed = array[0];
    const newArr = array.slice(1).map((item, i) => ({
      ...item,
      address: `0x${(0x1000 + i * 4).toString(16).toUpperCase()}`
    }));
    setArray(newArr);
    setStatusMessage(`Baştan Silme (shift): ${removed.value} silindi. Geri kalan tüm elemanlar sola kaydı: O(n).`);
  };

  const handleReset = () => {
    clearSimulation();
    setArray([
      { id: '1', value: 15, address: '0x1000' },
      { id: '2', value: 42, address: '0x1004' },
      { id: '3', value: 8, address: '0x1008' },
      { id: '4', value: 23, address: '0x100C' },
      { id: '5', value: 67, address: '0x1010' },
      { id: '6', value: 31, address: '0x1014' },
      { id: '7', value: 94, address: '0x1018' },
    ]);
    setCapacity(10);
    setStatusMessage('Dizi başlangıç durumuna sıfırlandı.');
  };

  return (
    <div className="space-y-6">
      {/* Module Intro Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <span>01. Veri Yapısı</span>
              <span>·</span>
              <span>Sıralı Bellek Düzeni (Contiguous Memory)</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Dizi (Array) & Bellek İndeksleme Simülatörü
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Diziler elemanları bellekte yan yana sıralı tutar. İndeks bazlı erişim matematiksel olarak hesaplandığı için O(1)'dir; arama ve kaydırma işlemleri ise O(n) süre gerektirir.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Diziyi Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Live Status Callout */}
        <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 font-mono leading-relaxed">
            {statusMessage}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: The Memory Array Representation */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Bellek Görünümü (RAM Representation) · Eleman Sayısı: {array.length} / Kapasite: {capacity}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>
              Aktif / İncelenen
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
              Bulunan (Match)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block"></span>
              Elenen Bölge
            </span>
          </div>
        </div>

        {/* Pointers / Indicators Bar */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[650px]">
            {/* Pointer labels (Low, Mid, High if active) */}
            {lowHighPointers && (
              <div className="flex gap-2 mb-2 text-xs font-mono">
                {array.map((_, i) => {
                  const isLow = lowHighPointers.low === i;
                  const isMid = lowHighPointers.mid === i;
                  const isHigh = lowHighPointers.high === i;
                  return (
                    <div key={i} className="flex-1 text-center font-bold">
                      {isMid && <span className="text-amber-400 flex flex-col items-center"><ArrowDown className="w-3.5 h-3.5 animate-bounce" />MID</span>}
                      {isLow && !isMid && <span className="text-blue-400 flex flex-col items-center"><ArrowDown className="w-3.5 h-3.5" />LOW</span>}
                      {isHigh && !isMid && <span className="text-purple-400 flex flex-col items-center"><ArrowDown className="w-3.5 h-3.5" />HIGH</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* The Array Cells */}
            <div className="flex gap-2">
              {array.map((item, index) => {
                const isActive = activeIndices.includes(index);
                const isFound = foundIndex === index;
                const isEliminated = eliminatedIndices.includes(index);

                let bgClass = 'bg-slate-950/90 border-slate-800 text-slate-200';
                if (isFound) {
                  bgClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950';
                } else if (isActive) {
                  bgClass = 'bg-indigo-950/90 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-950 scale-105';
                } else if (isEliminated) {
                  bgClass = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-40';
                }

                return (
                  <div
                    key={item.id}
                    className={`flex-1 min-w-[70px] p-3 rounded-xl border flex flex-col items-center justify-between transition-all duration-300 ${bgClass}`}
                  >
                    {/* Index */}
                    <div className="text-[11px] font-mono text-slate-500">
                      [{index}]
                    </div>

                    {/* Value */}
                    <div className="my-2 text-xl font-bold font-mono tabular-nums">
                      {item.value}
                    </div>

                    {/* Address */}
                    <div className="text-[10px] font-mono text-slate-400 tracking-tight">
                      {item.address}
                    </div>
                  </div>
                );
              })}

              {/* Empty Capacity Slots (demonstrating dynamic array buffer) */}
              {Array.from({ length: Math.max(0, capacity - array.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex-1 min-w-[70px] p-3 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/20 flex flex-col items-center justify-between opacity-30"
                >
                  <div className="text-[11px] font-mono text-slate-600">[{array.length + i}]</div>
                  <div className="my-2 text-sm text-slate-600 font-mono">null</div>
                  <div className="text-[10px] font-mono text-slate-700">Ayrılmış</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mathematical Formula Inspection */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Adres Hesaplama Formülü:</span>
            <span className="text-indigo-300 font-semibold">
              Adres(i) = BaseAddr + (i × 4 byte)
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Erişim Süresi (Access):</span>
            <span className="text-emerald-400 font-semibold">O(1) Sabit Zaman</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block mb-1">Arama & Kaydırma (Search/Shift):</span>
            <span className="text-amber-400 font-semibold">O(n) Doğrusal Zaman</span>
          </div>
        </div>
      </div>

      {/* Control Decks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: O(1) Index Access */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>1. Doğrudan Erişim: array[index]</span>
          </div>
          <p className="text-xs text-slate-400">
            İndeks vererek hafıza adresini anında hesaplar ve veriyi çeker.
          </p>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={array.length - 1}
              value={accessIndex}
              onChange={(e) => setAccessIndex(e.target.value)}
              placeholder="İndeks (örn: 2)"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAccess}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Eriş
            </button>
          </div>
        </div>

        {/* Panel 2: Searching (Linear vs Binary) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>2. Arama Algoritmaları</span>
          </div>
          <p className="text-xs text-slate-400">
            Değeri dizide arayın. Doğrusal O(n) veya sıralı dizi üzerinde İkili O(log n).
          </p>

          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Aranacak Değer"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isSimulating}
              onClick={handleLinearSearch}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Doğrusal (O(n))
            </button>
            <button
              disabled={isSimulating}
              onClick={handleBinarySearch}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              İkili (O(log n))
            </button>
          </div>
        </div>

        {/* Panel 3: Insertion & Deletion */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Plus className="w-4 h-4 text-blue-400" />
            <span>3. Ekleme & Silme Operasyonları</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Yeni Değer"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              placeholder="Hedef İndeks"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
            <button
              onClick={handlePush}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              push() (Sona)
            </button>
            <button
              onClick={handleUnshift}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              unshift() (Başa)
            </button>
            <button
              onClick={handleInsertAt}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              splice(idx)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handlePop}
              className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              pop() (Sondan Sil)
            </button>
            <button
              onClick={handleShift}
              className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              shift() (Baştan Sil)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
