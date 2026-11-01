import React, { useState, useEffect } from 'react';
import { SIMULATION_STEPS } from '../data/reportData';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, Shield, Radio, Terminal } from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev < SIMULATION_STEPS.length - 1 ? prev + 1 : 0));
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const stepData = SIMULATION_STEPS[currentStep];

  return (
    <section id="simulasyon" className="scroll-mt-24 pt-12 pb-16 border-t border-stone-200">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
          <span>İnteraktif Mimari Simülatörü</span>
          <span aria-hidden="true">·</span>
          <span>Protokol Yürütme Motoru</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Saha Akışı: Bağıştan Teslimata Web3 Döngüsü
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          OpenRelief protokolünün 5 aşamalı güven zincirini adım adım test edin. Her adımda akıllı sözleşme olayları (events) ve sıfır bilgi doğrulaması simüle edilir.
        </p>
      </div>

      {/* Simulator Frame */}
      <div className="rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden">
        
        {/* Step Selector Bar - Interactive Segmented Control (§1.A) */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {SIMULATION_STEPS.map((s, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <button
                  key={s.step}
                  onClick={() => {
                    setCurrentStep(index);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : isPast
                      ? 'bg-stone-200/70 text-stone-800 hover:bg-stone-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono text-[11px]">{index + 1}.</span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-stone-700" />}
              <span>{isPlaying ? 'Durdur' : 'Otomatik Oynat'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              title="Başa Dön"
              className="p-1.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Step Workspace */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Narrative Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span>Adım {stepData.step} / 5</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-stone-800">{stepData.actor}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {stepData.title}
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed">
                {stepData.description}
              </p>

              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-700">
                  <Shield className="w-3.5 h-3.5 text-amber-800" />
                  <span className="font-semibold">Mekanizma:</span>
                  <span>{stepData.technicalMechanism}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
                  <span className="font-semibold">Kriptografik Durum:</span>
                  <span>{stepData.zkProofStatus}</span>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  disabled={currentStep === 0}
                  onClick={() => {
                    setCurrentStep((prev) => Math.max(0, prev - 1));
                    setIsPlaying(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki Adım</span>
                </button>
                <button
                  disabled={currentStep === SIMULATION_STEPS.length - 1}
                  onClick={() => {
                    setCurrentStep((prev) => Math.min(SIMULATION_STEPS.length - 1, prev + 1));
                    setIsPlaying(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Sonraki Adım</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Technical Console (5 cols) */}
            <div className="lg:col-span-5 rounded-lg bg-stone-900 text-stone-100 p-5 font-mono text-xs shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>On-Chain Konsensüs Günlüğü</span>
                </div>
                <span>EVM L2 Blok #19,420,118</span>
              </div>

              <div className="space-y-2">
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Tetiklenen Olay (Event)</span>
                <div className="p-2.5 rounded bg-stone-950 text-amber-300 text-xs overflow-x-auto whitespace-pre font-mono border border-stone-800">
                  {stepData.smartContractEvent}
                </div>
              </div>

              <div className="space-y-1 text-stone-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Doğrulayıcı Konsensüsü:</span>
                  <span className="text-stone-200 font-semibold">21/21 Düğüm (Nodes)</span>
                </div>
                <div className="flex justify-between">
                  <span>İşlem Masrafı (Gas):</span>
                  <span className="text-stone-200">0.00042 ETH (Sponsorlu)</span>
                </div>
                <div className="flex justify-between">
                  <span>Kesinlik Süresi (Finality):</span>
                  <span className="text-stone-200">1.2 saniye</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-500">
                Kriptografik hash değişmezliği: EIP-712 standartlarında doğrulanmış ayrık veri yükü.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
