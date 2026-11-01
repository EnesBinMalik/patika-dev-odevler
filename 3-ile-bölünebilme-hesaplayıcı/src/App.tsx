/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * ÖDEV: 3 İLE BÖLÜNEBİLİRLİK HESAPLAYICI VE FORM UYGULAMASI
 * İMZA: ENES ÖZTÜRK
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultCard } from './components/ResultCard';
import { EducationalBreakdown } from './components/EducationalBreakdown';
import { HistoryList } from './components/HistoryList';
import { CodeModal } from './components/CodeModal';
import {
  girdiyiDogrula,
  ucIleBolunebilirlikKontrolu,
  DivisibilityResult,
} from './utils/divisibility';
import { playSound } from './utils/audio';
import { GraduationCap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [inputValue, setInputValue] = useState<string>('4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<DivisibilityResult | null>(() =>
    ucIleBolunebilirlikKontrolu(4)
  );
  const [history, setHistory] = useState<DivisibilityResult[]>([
    ucIleBolunebilirlikKontrolu(4),
  ]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  const executeCheck = (rawVal: string) => {
    const validation = girdiyiDogrula(rawVal);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Geçersiz değer!');
      playSound('error', soundEnabled);
      return;
    }

    setErrorMessage(null);
    const num = validation.parsedNumber!;
    const calculatedResult = ucIleBolunebilirlikKontrolu(num);
    setResult(calculatedResult);

    // Audio & Confetti Feedback
    if (calculatedResult.bolunebilirMi) {
      playSound('success', soundEnabled);
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    } else {
      playSound('warning', soundEnabled);
    }

    // Add to history (avoid duplicates at the top)
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.girilenSayi !== num);
      return [calculatedResult, ...filtered].slice(0, 9);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCheck(inputValue);
  };

  const handleSelectPreset = (presetVal: number) => {
    const strVal = presetVal.toString();
    setInputValue(strVal);
    setErrorMessage(null);
    executeCheck(strVal);
  };

  const handleSelectFromHistory = (item: DivisibilityResult) => {
    setInputValue(item.girilenSayi.toString());
    setErrorMessage(null);
    setResult(item);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* App Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Hero / Assignment Banner */}
      <div className="border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950/40 to-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bilgisayar Programlama & Matematik Ödevi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            3 ile Bölünebilirlik ve En Yakın Kat Hesaplayıcı
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Kullanıcıdan sayı değeri alan, 3 ile bölümünden kalanın 0 olup olmadığını kontrol eden ve bölünemeyen sayılar için bölünebilecek ilk sayıyı hesaplayan ödev çözümü.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-500">Ödev Hazırlayıcısı:</span>
            <span className="font-signature text-2xl text-amber-300 font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              Enes Öztürk
            </span>
          </div>
        </div>
      </div>

      {/* Main Applet Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Step 1: Input Form */}
        <CalculatorForm
          inputValue={inputValue}
          onInputChange={(val) => {
            setInputValue(val);
            if (errorMessage) setErrorMessage(null);
          }}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          onSelectPreset={handleSelectPreset}
        />

        {/* Step 2: The Core Result (Matches the prompt's example exact format) */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ResultCard result={result} />

            {/* Step 3: Math and Logic Breakdown */}
            <EducationalBreakdown result={result} />
          </div>
        )}

        {/* Step 4: History list of tested queries */}
        <HistoryList
          history={history}
          onSelect={handleSelectFromHistory}
          onClear={() => setHistory([])}
        />
      </main>

      {/* Homework Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-300 font-semibold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Ödev Teslim Projesi</span>
            </div>
            <p className="text-slate-500">
              3 ile bölünebilme kuralı ve ilk kat tespiti algoritması.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tüm hakları saklıdır</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-slate-500">İmza:</span>
              <span className="font-signature text-2xl text-amber-300 font-bold">
                Enes Öztürk
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Homework Source Code Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
