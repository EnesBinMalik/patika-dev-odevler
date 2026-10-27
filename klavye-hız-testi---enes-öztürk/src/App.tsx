import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HUD } from './components/HUD';
import { TypingArea } from './components/TypingArea';
import { ResultsModal } from './components/ResultsModal';
import { InfoModal } from './components/InfoModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { HistoryModal } from './components/HistoryModal';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { generateRandomWords } from './data/wordLists';
import { TestStatus, WordItem, TestResult, TimelinePoint, Language, SoundTheme } from './types';
import { soundManager } from './utils/soundEffects';
import { Clock, SlidersHorizontal, Sparkles, Award } from 'lucide-react';

const DEFAULT_DURATION = 60; // 60 seconds as required

export default function App() {
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);
  const [status, setStatus] = useState<TestStatus>('READY');
  const [language, setLanguage] = useState<Language>('tr');
  const [soundTheme, setSoundTheme] = useState<SoundTheme>('mechanical');

  // Word state
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');

  // Keystroke statistics
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [wrongKeystrokes, setWrongKeystrokes] = useState<number>(0);
  const [correctWordsCount, setCorrectWordsCount] = useState<number>(0);
  const [wrongWordsCount, setWrongWordsCount] = useState<number>(0);

  // Timeline for line chart
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);

  // Results & History
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [bestWpm, setBestWpm] = useState<number>(0);

  // Modals & UI Toggles
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('enes_typing_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        const maxWpm = Math.max(...parsed.map((p: TestResult) => p.wpm), 0);
        setBestWpm(maxWpm);
      }
    } catch {
      // ignore
    }
  }, []);

  // Initialize words
  const initTest = useCallback((lang: Language = language, dur: number = duration) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const rawWords = generateRandomWords(lang, 250);
    const wordItems: WordItem[] = rawWords.map((word, idx) => ({
      id: idx,
      word,
      status: idx === 0 ? 'CURRENT' : 'PENDING',
    }));

    setWords(wordItems);
    setCurrentWordIndex(0);
    setInputVal('');
    setTimeLeft(dur);
    setStatus('READY');
    setCorrectKeystrokes(0);
    setWrongKeystrokes(0);
    setCorrectWordsCount(0);
    setWrongWordsCount(0);
    setTimeline([]);
    setLatestResult(null);
    startTimeRef.current = null;
  }, [language, duration]);

  useEffect(() => {
    initTest(language, duration);
  }, [initTest, language, duration]);

  // Synchronize sound manager theme
  useEffect(() => {
    soundManager.setTheme(soundTheme);
  }, [soundTheme]);

  // Track physical keypresses for visual keyboard
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      setActiveKey(e.key);

      // Shortcut: Tab + Enter or Esc to restart
      if (e.key === 'Escape') {
        initTest();
      }
    };

    const handleGlobalKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [initTest]);

  // End of test calculation
  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('FINISHED');
    soundManager.playFinishChime();

    const elapsedMinutes = duration / 60;
    const netWpm = Math.max(0, Math.round((correctKeystrokes / 5) / elapsedMinutes));
    const rawWpm = Math.max(0, Math.round(((correctKeystrokes + wrongKeystrokes) / 5) / elapsedMinutes));
    const totalHits = correctKeystrokes + wrongKeystrokes;
    const accuracy = totalHits > 0 ? Math.round((correctKeystrokes / totalHits) * 100) : 100;

    const result: TestResult = {
      duration,
      wpm: netWpm,
      rawWpm,
      accuracy,
      correctWords: correctWordsCount,
      wrongWords: wrongWordsCount,
      correctChars: correctKeystrokes,
      wrongChars: wrongKeystrokes,
      totalKeystrokes: totalHits,
      timeline,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      language,
    };

    setLatestResult(result);

    // Save to local storage history
    try {
      const updated = [result, ...history.slice(0, 49)];
      setHistory(updated);
      localStorage.setItem('enes_typing_history', JSON.stringify(updated));
      if (netWpm > bestWpm) {
        setBestWpm(netWpm);
      }
    } catch {
      // ignore
    }
  }, [
    duration,
    correctKeystrokes,
    wrongKeystrokes,
    correctWordsCount,
    wrongWordsCount,
    timeline,
    language,
    history,
    bestWpm,
  ]);

  // Handle countdown interval
  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }

          // Sample timeline point every second
          const elapsed = duration - (prev - 1);
          const elapsedMins = elapsed / 60;
          const currentNetWpm = elapsedMins > 0 ? Math.round((correctKeystrokes / 5) / elapsedMins) : 0;
          const currentRawWpm = elapsedMins > 0 ? Math.round(((correctKeystrokes + wrongKeystrokes) / 5) / elapsedMins) : 0;

          setTimeline((old) => [
            ...old,
            {
              second: elapsed,
              wpm: currentNetWpm,
              rawWpm: currentRawWpm,
              errors: wrongKeystrokes,
            },
          ]);

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, finishTest, duration, correctKeystrokes, wrongKeystrokes]);

  // Handle Input Changes (Starts timer automatically on first character!)
  const handleInputChange = (val: string) => {
    if (status === 'FINISHED') return;

    // Requirement: "Input'a herhangi karakter girdiği anda geri sayım başlamalıdır."
    if (status === 'READY' && val.length > 0) {
      setStatus('RUNNING');
      startTimeRef.current = Date.now();
    }

    setInputVal(val);
  };

  // Handle Word Submission via Space bar
  const handleWordSubmit = (typedWord: string) => {
    if (status === 'FINISHED') return;
    const cleanTyped = typedWord.trim();
    if (!cleanTyped) return;

    const currentItem = words[currentWordIndex];
    if (!currentItem) return;

    const targetWord = currentItem.word;
    const isCorrect = cleanTyped === targetWord;

    soundManager.playWordComplete(isCorrect);

    // Keystroke metrics calculation:
    // For correct word: targetWord.length + 1 for space
    // For incorrect word: correct matching prefix counts as correct, remainder as wrong
    let matchedLetters = 0;
    for (let i = 0; i < Math.min(cleanTyped.length, targetWord.length); i++) {
      if (cleanTyped[i] === targetWord[i]) matchedLetters++;
    }
    const unMatchedLetters = Math.max(cleanTyped.length, targetWord.length) - matchedLetters;

    if (isCorrect) {
      setCorrectWordsCount((prev) => prev + 1);
      setCorrectKeystrokes((prev) => prev + targetWord.length + 1); // +1 space
    } else {
      setWrongWordsCount((prev) => prev + 1);
      setCorrectKeystrokes((prev) => prev + matchedLetters);
      setWrongKeystrokes((prev) => prev + unMatchedLetters + 1); // +1 space
    }

    // Update word status in array
    setWords((prevWords) => {
      const copy = [...prevWords];
      copy[currentWordIndex] = {
        ...currentItem,
        typed: cleanTyped,
        status: isCorrect ? 'CORRECT' : 'WRONG',
      };
      if (copy[currentWordIndex + 1]) {
        copy[currentWordIndex + 1].status = 'CURRENT';
      }
      return copy;
    });

    // Advance to next word and clear input field
    setCurrentWordIndex((prev) => prev + 1);
    setInputVal('');
  };

  // Live real-time WPM calculation during the test
  const elapsedSeconds = duration - timeLeft;
  const elapsedMinutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0.01;
  const liveWpm = status === 'RUNNING' && elapsedSeconds > 0
    ? Math.max(0, Math.round((correctKeystrokes / 5) / elapsedMinutes))
    : 0;

  const totalHits = correctKeystrokes + wrongKeystrokes;
  const liveAccuracy = totalHits > 0 ? Math.round((correctKeystrokes / totalHits) * 100) : 100;

  const handleClearHistory = () => {
    setHistory([]);
    setBestWpm(0);
    localStorage.removeItem('enes_typing_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Header
        language={language}
        onLanguageChange={(newLang) => {
          setLanguage(newLang);
          initTest(newLang, duration);
        }}
        soundTheme={soundTheme}
        onSoundChange={setSoundTheme}
        onRestart={() => initTest(language, duration)}
        onOpenInfo={() => setShowInfo(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center gap-6">
        {/* Hero Section / Mode Bar */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                60 Saniyelik Hız Testi
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Kelimeler karmaşık olarak listelenir. Yazmaya başladığınız an sayaç devreye girer.
            </p>
          </div>

          {/* Duration Selector (Default: 60s) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
            <div className="flex items-center gap-1 text-slate-500 text-xs px-2 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Süre:</span>
            </div>
            {[15, 30, 60, 120].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  setDuration(dur);
                  initTest(language, dur);
                }}
                disabled={status === 'RUNNING'}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors ${
                  duration === dur
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white disabled:opacity-50'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        {/* HUD Section: Timer, Live WPM, Accuracy, Words */}
        <HUD
          status={status}
          timeLeft={timeLeft}
          totalTime={duration}
          wpm={liveWpm}
          accuracy={liveAccuracy}
          correctKeystrokes={correctKeystrokes}
          wrongKeystrokes={wrongKeystrokes}
          correctWords={correctWordsCount}
          wrongWords={wrongWordsCount}
        />

        {/* Typing Word Stream & Input Section */}
        <TypingArea
          words={words}
          currentWordIndex={currentWordIndex}
          inputVal={inputVal}
          onInputChange={handleInputChange}
          onWordSubmit={handleWordSubmit}
          status={status}
          onRestart={() => initTest(language, duration)}
        />

        {/* Results Screen (Displays when countdown completes) */}
        {status === 'FINISHED' && latestResult && (
          <ResultsModal
            result={latestResult}
            onRestart={() => initTest(language, duration)}
            bestWpm={bestWpm}
          />
        )}

        {/* Optional Virtual Keyboard Visualizer */}
        <VirtualKeyboard
          activeKey={activeKey}
          language={language}
          isVisible={showKeyboard}
          onToggle={() => setShowKeyboard((prev) => !prev)}
        />

        {/* Bottom Feature Cards (Craft & Guidance) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-400 border-t border-slate-900">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Geri Sayım Otomasyonu</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Herhangi bir harfe bastığınız milisaniyede 60 saniyelik geri sayım başlar. Boşluk tuşu kelimeyi onaylar.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Renk Kodlu Anlık Geri Bildirim</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Doğru girilen her kelime yeşil, hatalı kelimeler anında kırmızı renkle vurgulanır.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>El Emeği & Usta İmzası</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Enes Öztürk imzalı özel daktilo sesleri, akış analitiği grafiği ve uluslararası WPM algoritması.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Klavye Hız Testi</span>
            <span aria-hidden="true">·</span>
            <span>Özel El Emeği Yazılım</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/90 font-medium">Enes Öztürk İmzalı</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600">
            10 Parmak Daktilo Antrenmanı · 60 Saniye Standartı
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
