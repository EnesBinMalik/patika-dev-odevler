import React, { useState, useEffect } from 'react';
import { ExecutionStep } from '../types/rust';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Layers, Database, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface MemoryVisualizerProps {
  steps: ExecutionStep[];
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <section id="bellek-gorsellestirici" className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              İnteraktif Bellek &amp; Sahiplik Simülatörü
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Yığın (Stack), Öbek (Heap) ve Dize Dilimleri (<code className="text-amber-300 font-mono">&amp;str</code>) referanslarının adım adım donanım davranışı
          </p>
        </div>

        {/* Step counter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-slate-400">Adım:</span>
          <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {step.stepNumber} / {steps.length}
          </span>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Başa Dön"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-30"
            title="Önceki Adım"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                Durdur
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Oynat
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-30"
            title="Sonraki Adım"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Slider / Scrubber */}
        <div className="flex-1 w-full max-w-lg flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Current action badge */}
        <div className="text-xs font-mono text-slate-300 truncate max-w-xs">
          <span className="text-amber-400 font-semibold">{step.codeSnippet}</span>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>{step.title}</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              (Satır {step.line})
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{step.explanation}</p>
          {step.borrowCheckerNote && (
            <div className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{step.borrowCheckerNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two-Column Memory Split: Stack (Left) and Heap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* STACK MEMORY COLUMN */}
        <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Yığın Belleği (Stack Memory)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">LIFO · Hızlı &amp; Sabit Boyut</span>
          </div>

          {step.variables.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-8 text-center">
              Yığında henüz değişken tanımlanmadı.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Filter by frame */}
              {['concatenate_strings', 'main'].map((frameName) => {
                const varsInFrame = step.variables.filter((v) => v.scope === frameName);
                if (varsInFrame.length === 0) return null;
                const isFrameActive = step.activeFunction === frameName;

                return (
                  <div
                    key={frameName}
                    className={`p-3 rounded-lg border transition-all ${
                      isFrameActive
                        ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Çerçeve: <code className="text-amber-300">{frameName}()</code>
                      </span>
                      {isFrameActive && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          Aktif Çerçeve
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {varsInFrame.map((v) => (
                        <div
                          key={v.name + v.scope}
                          className={`p-2.5 rounded border text-xs font-mono transition-all ${
                            v.status === 'borrowed'
                              ? 'bg-amber-950/20 border-amber-800/40'
                              : v.status === 'dropped'
                              ? 'bg-slate-950/80 border-slate-800/80 opacity-50 line-through'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-slate-200 font-semibold mb-1">
                            <span className="text-amber-300">
                              {v.isMut ? 'mut ' : ''}
                              {v.name}: <span className="text-sky-300 font-normal">{v.type}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">{v.stackAddress}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-1.5 rounded">
                            <div>
                              <span className="text-slate-500 block text-[9px] uppercase">ptr</span>
                              <span className="text-amber-400">{v.ptr || 'null'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px] uppercase">len</span>
                              <span className="text-slate-200">{v.len ?? 0}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px] uppercase">cap</span>
                              <span className="text-slate-200">{v.capacity !== undefined ? v.capacity : 'N/A'}</span>
                            </div>
                          </div>

                          {v.borrowedFrom && (
                            <div className="text-[10px] text-sky-400 mt-1 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              <span>{v.borrowedFrom} verisine &amp;str dilimi ile referans veriyor</span>
                            </div>
                          )}

                          {v.status === 'borrowed' && (
                            <div className="text-[10px] text-amber-400/90 mt-1">
                              Değişmez (immutable) olarak ödünç verildi
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* HEAP MEMORY COLUMN */}
        <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Öbek Belleği (Heap Memory)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Dinamik Boyutlu Bayt Tamponları</span>
          </div>

          {step.heap.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-8 text-center">
              Heap belleğinde henüz dinamik tahsis yapılmadı.
            </div>
          ) : (
            <div className="space-y-3">
              {step.heap.map((block) => (
                <div
                  key={block.address}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold">{block.address}</span>
                    <span className="text-[11px] text-slate-400">
                      Sahip: <strong className="text-slate-200">{block.ownerVar}</strong>
                    </span>
                  </div>

                  {/* Character array preview */}
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
                      <span>Bayt Verisi (UTF-8)</span>
                      <span>Kapasite: {block.capacityBytes} bayt / Kullanılan: {block.usedBytes} bayt</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {Array.from(block.content).map((char, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-7 rounded bg-slate-900 border border-slate-700/60 flex flex-col items-center justify-center text-[11px] text-emerald-300 font-bold"
                          title={`İndeks ${idx}: '${char}'`}
                        >
                          <span>{char === ' ' ? '␣' : char}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Metin İçeriği: "{block.content}"</span>
                    <span className="text-[10px] text-emerald-400">Tahsis Adımı #{block.allocatedInStep}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Heap explanation note */}
          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">Dize Dilimleri (&amp;str) Neden Güçlüdür?</strong>
            <code className="text-amber-300">&amp;str</code> dilimleri heap üzerinde yeni bir tahsis (allocation) yapmaz! Yalnızca var olan heap tamponunun başlangıç adresini ve uzunluğunu okur. Böylece sıfır maliyetle (zero-cost) dize birleştirme fonksiyonuna veri sağlanır.
          </div>
        </div>
      </div>
    </section>
  );
};
