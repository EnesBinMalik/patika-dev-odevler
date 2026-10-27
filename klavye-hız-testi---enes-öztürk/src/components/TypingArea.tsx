import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, CornerDownLeft, Sparkles } from 'lucide-react';
import { WordItem, TestStatus } from '../types';
import { soundManager } from '../utils/soundEffects';

interface TypingAreaProps {
  words: WordItem[];
  currentWordIndex: number;
  inputVal: string;
  onInputChange: (val: string) => void;
  onWordSubmit: (typedWord: string) => void;
  status: TestStatus;
  onRestart: () => void;
  autoFocus?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  inputVal,
  onInputChange,
  onWordSubmit,
  status,
  onRestart,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsBoxRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const [containerClicked, setContainerClicked] = useState(false);

  // Keep input focused automatically
  useEffect(() => {
    if (status !== 'FINISHED') {
      inputRef.current?.focus();
    }
  }, [status, currentWordIndex]);

  // Smooth scroll word container to keep active word in the 2nd line
  useEffect(() => {
    if (activeWordRef.current && wordsBoxRef.current) {
      const activeEl = activeWordRef.current;
      const containerEl = wordsBoxRef.current;
      const wordTop = activeEl.offsetTop;
      const wordHeight = activeEl.offsetHeight;

      // Keep active line roughly in view (around top 40px)
      if (wordTop > 45) {
        containerEl.scrollTo({
          top: wordTop - 45,
          behavior: 'smooth',
        });
      } else {
        containerEl.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [currentWordIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Esc or Tab to restart
    if (e.key === 'Escape') {
      e.preventDefault();
      onRestart();
      return;
    }

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      // If user presses space on empty input, ignore to avoid accidental advance
      if (inputVal.trim().length === 0) {
        return;
      }
      onWordSubmit(inputVal);
      return;
    }

    // Play subtle mechanical key sound for any standard typing key
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      soundManager.playKeyClick();
    }
  };

  const handleContainerClick = () => {
    setContainerClicked(true);
    inputRef.current?.focus();
    setTimeout(() => setContainerClicked(false), 300);
  };

  const currentTargetWord = words[currentWordIndex]?.word || '';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Word Stream Display Container */}
      <div
        onClick={handleContainerClick}
        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 cursor-text relative shadow-inner overflow-hidden min-h-[170px] max-h-[190px] flex items-center transition-all select-none"
      >
        {/* Subtle background glow when active */}
        {status === 'RUNNING' && (
          <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
        )}

        <div
          ref={wordsBoxRef}
          className="w-full max-h-[125px] overflow-hidden flex flex-wrap gap-x-3 gap-y-3.5 items-center font-mono text-xl sm:text-2xl leading-relaxed tracking-normal"
        >
          {words.map((item, index) => {
            const isCurrent = index === currentWordIndex;
            const isPast = index < currentWordIndex;

            if (isCurrent) {
              // Detailed character-level rendering for the currently active word
              const targetChars = item.word.split('');
              const typedChars = inputVal.split('');
              const maxLen = Math.max(targetChars.length, typedChars.length);

              return (
                <span
                  key={item.id}
                  ref={activeWordRef}
                  className="relative px-2 py-1 rounded-md bg-slate-800 text-white font-semibold shadow-sm ring-1 ring-amber-500/40 inline-flex items-center"
                >
                  {Array.from({ length: maxLen }).map((_, charIdx) => {
                    const targetChar = targetChars[charIdx];
                    const typedChar = typedChars[charIdx];
                    const isTyped = charIdx < typedChars.length;
                    const isCursor = charIdx === typedChars.length;

                    if (isTyped) {
                      const isCorrect = typedChar === targetChar;
                      return (
                        <span
                          key={charIdx}
                          className={`relative ${
                            isCorrect
                              ? 'text-emerald-400 font-bold'
                              : 'text-rose-400 bg-rose-500/20 underline decoration-rose-400 font-bold'
                          }`}
                        >
                          {typedChar}
                          {isCursor && (
                            <span className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-amber-400 animate-blink" />
                          )}
                        </span>
                      );
                    }

                    // Remaining untyped characters
                    return (
                      <span
                        key={charIdx}
                        className="relative text-slate-400"
                      >
                        {isCursor && (
                          <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-amber-400 animate-blink" />
                        )}
                        {targetChar}
                      </span>
                    );
                  })}
                  {typedChars.length >= targetChars.length && (
                    <span className="relative w-0 inline-block">
                      <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-amber-400 animate-blink" />
                    </span>
                  )}
                </span>
              );
            }

            if (isPast) {
              const isCorrect = item.status === 'CORRECT';
              return (
                <span
                  key={item.id}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    isCorrect
                      ? 'text-emerald-400 bg-emerald-500/10 font-medium'
                      : 'text-rose-400 bg-rose-500/10 line-through font-medium opacity-90'
                  }`}
                >
                  {item.word}
                </span>
              );
            }

            // Future upcoming words
            return (
              <span
                key={item.id}
                className="text-slate-500 px-1 py-0.5 transition-colors hover:text-slate-400"
              >
                {item.word}
              </span>
            );
          })}
        </div>

        {/* Floating guidance helper on ready */}
        {status === 'READY' && (
          <div className="absolute right-4 bottom-3 text-xs text-slate-500 flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Kelimeler rastgele dizilmiştir. İlk harfle süre başlar.</span>
          </div>
        )}
      </div>

      {/* Input Action Bar */}
      <div className="w-full flex items-center gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={inputVal}
            disabled={status === 'FINISHED'}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              status === 'READY'
                ? 'Yazmaya başlayın... (Herhangi bir tuşa basınca 60 saniye başlar)'
                : status === 'RUNNING'
                ? `Hedef kelime: "${currentTargetWord}" — Kelimeyi bitirince Boşluk (Space) tuşuna basın`
                : 'Test tamamlandı! Sonuçlar aşağıda gösteriliyor.'
            }
            className={`w-full px-5 py-4 text-lg sm:text-xl font-mono rounded-xl bg-slate-900 border text-white placeholder:text-slate-500 placeholder:text-base focus:outline-none transition-all ${
              status === 'FINISHED'
                ? 'opacity-50 cursor-not-allowed border-slate-800'
                : 'border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-md'
            }`}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-slate-500 pointer-events-none font-mono">
            <span className="hidden sm:inline bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
              Boşluk (Space)
            </span>
            <CornerDownLeft className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Prominent Restart Button */}
        <button
          onClick={onRestart}
          className="h-[58px] px-5 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all font-medium text-sm shadow hover:text-white shrink-0 active:scale-95"
          title="Yeniden Başlat (Esc veya Tab+Enter)"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Yeniden Başlat</span>
        </button>
      </div>

      {/* Quick shortcuts legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <div className="flex items-center gap-3">
          <span>
            <strong className="text-slate-400">Boşluk:</strong> Kelimeyi onayla
          </span>
          <span>·</span>
          <span>
            <strong className="text-slate-400">Esc / Tab+Enter:</strong> Yeniden başlat
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/60" />
          <span>Yeşil: Doğru</span>
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-500/60 ml-2" />
          <span>Kırmızı: Yanlış</span>
        </div>
      </div>
    </div>
  );
};
