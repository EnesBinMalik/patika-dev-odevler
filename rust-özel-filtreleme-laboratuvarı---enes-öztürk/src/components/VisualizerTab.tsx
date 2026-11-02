import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Check, X, ArrowDown, Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { generateVisualizerSteps } from '../services/rustRunner';
import { VisualizerStep } from '../types';

interface VisualizerTabProps {
  initialItems?: (number | string)[];
  initialCondition?: number | string;
}

export const VisualizerTab: React.FC<VisualizerTabProps> = ({
  initialItems = [10, 25, 42, 25, 88, 25, 100, 3],
  initialCondition = 25,
}) => {
  const [itemsInput, setItemsInput] = useState<string>(initialItems.join(', '));
  const [conditionInput, setConditionInput] = useState<string>(String(initialCondition));

  const [items, setItems] = useState<(number | string)[]>(initialItems);
  const [conditionValue, setConditionValue] = useState<number | string>(initialCondition);

  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200);

  // Initialize steps
  useEffect(() => {
    const generated = generateVisualizerSteps(items, conditionValue);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [items, conditionValue]);

  // Handle auto playback
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const handleApplyCustomData = () => {
    const rawTokens = itemsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedItems: (number | string)[] = rawTokens.map((tok) => {
      const num = Number(tok);
      return !isNaN(num) && tok !== '' ? num : tok;
    });

    const parsedCondition = !isNaN(Number(conditionInput)) && conditionInput.trim() !== ''
      ? Number(conditionInput)
      : conditionInput.trim();

    if (parsedItems.length > 0) {
      setItems(parsedItems);
      setConditionValue(parsedCondition);
    }
  };

  const currentStep: VisualizerStep | undefined = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#121622] border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Görsel Bellek ve Referans (&) Simülatörü
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Rust'ta <code className="text-orange-300 font-mono">custom_filter</code> fonksiyonunun döngü sırasında koleksiyon elemanlarını nasıl ödünç aldığını (<code className="text-orange-300 font-mono">&item</code>), <code className="text-orange-300 font-mono">FilterCondition::is_match</code> çağrısını ve yeni vektörün nasıl oluştuğunu adım adım izleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Hazırlayan: <strong className="text-amber-300">Enes Öztürk</strong></span>
        </div>
      </div>

      {/* Input Customizer Sandbox */}
      <div className="bg-[#10131d] border border-zinc-800 rounded-xl p-4 shadow-md">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          Koleksiyon ve Filtre Koşulu Değerlerini Değiştirin
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-7">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Koleksiyon Elemanları (Virgülle ayırın):
            </label>
            <input
              type="text"
              value={itemsInput}
              onChange={(e) => setItemsInput(e.target.value)}
              placeholder="10, 25, 42, 25, 88, 25, 100, 3"
              className="w-full bg-[#0a0c12] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Filtre Değeri (desired_value):
            </label>
            <input
              type="text"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              placeholder="25"
              className="w-full bg-[#0a0c12] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={handleApplyCustomData}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>

      {/* Visual Memory Representation Board */}
      <div className="bg-[#0e111a] border border-zinc-800 rounded-xl p-5 shadow-xl space-y-6">
        {/* Step Indicator & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-zinc-400">
              Adım: <span className="text-orange-400 font-bold text-sm">{currentStepIndex + 1}</span> / {steps.length}
            </div>
            <div className="text-xs text-zinc-500 hidden sm:block">•</div>
            <div className="text-xs text-zinc-400">
              {currentStep ? (
                currentStep.isMatch ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Eşleşme Bulundu (*item == desired_value)
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Eşleşmedi (*item != desired_value)
                  </span>
                )
              ) : null}
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200"
              title="Önceki Adım"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Oynat</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStepIndex >= steps.length - 1}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200"
              title="Sonraki Adım"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed toggle */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1.5 rounded-lg border border-zinc-700 outline-none"
            >
              <option value={2000}>Yavaş (2.0s)</option>
              <option value={1200}>Normal (1.2s)</option>
              <option value={600}>Hızlı (0.6s)</option>
            </select>
          </div>
        </div>

        {/* 1. Orijinal Koleksiyon (Vektör - Heap Bellek Görünümü) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              1. Orijinal Vektör: <code className="text-blue-400 font-mono">collection: &Vec&lt;i32&gt;</code>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Eleman Sayısı: {items.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-[#090b10] border border-zinc-800/80">
            {items.map((item, idx) => {
              const isCurrent = currentStep?.currentIndex === idx;
              const isAlreadyMatched =
                currentStep &&
                idx < currentStep.currentIndex &&
                String(item) === String(conditionValue);

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center min-w-[54px] h-[64px] rounded-lg border font-mono transition-all duration-300 ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-500/20 text-orange-200 ring-2 ring-orange-500/40 scale-105 shadow-lg shadow-orange-500/20'
                      : isAlreadyMatched
                      ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300'
                      : 'border-zinc-800 bg-[#121520] text-zinc-400'
                  }`}
                >
                  <span className="text-[10px] text-zinc-500 mb-0.5">[{idx}]</span>
                  <span className="text-sm font-bold">{item}</span>

                  {isCurrent && (
                    <div className="absolute -bottom-5 text-[10px] font-bold text-orange-400 whitespace-nowrap animate-bounce">
                      ▲ &item
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. FilterCondition Nesnesi ve is_match Değerlendirmesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          {/* Condition Struct Box */}
          <div className="bg-[#121622] border border-amber-500/30 rounded-xl p-4">
            <div className="text-xs font-mono font-semibold text-amber-300 mb-2 flex items-center justify-between">
              <span>FilterCondition Yapısı</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                &FilterCondition
              </span>
            </div>
            <div className="bg-[#090b10] p-3 rounded-lg font-mono text-xs text-zinc-300 border border-zinc-800">
              <div><span className="text-purple-400">struct</span> <span className="text-yellow-300">FilterCondition</span> &#123;</div>
              <div className="pl-4">
                desired_value: <span className="text-orange-400 font-bold">{conditionValue}</span>
              </div>
              <div>&#125;</div>
            </div>
          </div>

          {/* Active is_match Evaluation Box */}
          <div className={`border rounded-xl p-4 transition-all duration-300 ${
            currentStep?.isMatch
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-zinc-900/60 border-zinc-800'
          }`}>
            <div className="text-xs font-mono font-semibold text-zinc-300 mb-2 flex items-center justify-between">
              <span>is_match(&self, item: &i32) Metot Çağrısı</span>
              {currentStep && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  currentStep.isMatch
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  Sonuç: {currentStep.isMatch ? 'TRUE (Eşleşti)' : 'FALSE (Atla)'}
                </span>
              )}
            </div>

            <div className="bg-[#090b10] p-3 rounded-lg font-mono text-xs text-zinc-300 border border-zinc-800 space-y-1">
              <div className="text-zinc-400">
                // Karşılaştırma: <span className="text-orange-300">*item</span> == <span className="text-amber-300">self.desired_value</span>
              </div>
              <div className="flex items-center gap-2 text-sm pt-1">
                <span className="text-orange-400 font-bold">
                  {currentStep ? currentStep.currentItem : '-'}
                </span>
                <span>==</span>
                <span className="text-amber-400 font-bold">{conditionValue}</span>
                <span>➜</span>
                <span className={`font-bold ${currentStep?.isMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currentStep ? String(currentStep.isMatch) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow to results */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* 3. Filtrelenmiş Yeni Koleksiyon (Dönen Vektör) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Filtrelenmiş Yeni Vektör: <code className="text-emerald-400 font-mono">filtered_result: Vec&lt;i32&gt;</code>
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Eklenen Eleman: {currentStep?.currentResult.length || 0}
            </span>
          </div>

          <div className="min-h-[76px] flex flex-wrap gap-2.5 p-4 rounded-xl bg-[#090b10] border border-emerald-950/60 shadow-inner items-center">
            {currentStep && currentStep.currentResult.length > 0 ? (
              currentStep.currentResult.map((resItem, rIdx) => (
                <div
                  key={rIdx}
                  className="flex flex-col items-center justify-center min-w-[54px] h-[52px] rounded-lg border border-emerald-500/50 bg-emerald-500/20 text-emerald-200 font-mono shadow-md animate-scaleIn"
                >
                  <span className="text-[10px] text-emerald-400/70 mb-0.5">[{rIdx}]</span>
                  <span className="text-sm font-bold">{resItem}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-zinc-600 italic px-2">
                Henüz eşleşen eleman eklenmedi. (filtered_result boş)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
