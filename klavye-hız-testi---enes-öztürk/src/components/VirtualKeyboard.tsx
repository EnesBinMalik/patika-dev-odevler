import React from 'react';
import { Keyboard } from 'lucide-react';
import { Language } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  language: Language;
  isVisible: boolean;
  onToggle: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  language,
  isVisible,
  onToggle,
}) => {
  // Turkish Q keyboard rows vs English
  const trRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'],
  ];

  const enRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const rows = language === 'tr' ? trRows : enRows;
  const currentNormalizedKey = activeKey?.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US');

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-medium text-xs"
        >
          <Keyboard className="w-3.5 h-3.5 text-amber-400" />
          <span>{isVisible ? 'Sanal Klavyeyi Gizle' : 'Parmak Yerleşim Rehberini Göster (Q Klavye)'}</span>
        </button>
        {isVisible && (
          <span className="text-[11px] font-mono text-slate-500">
            F ve J tuşları 10 parmak ana sıra konumlandırma noktalarıdır
          </span>
        )}
      </div>

      {isVisible && (
        <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 select-none animate-in fade-in duration-200">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 sm:gap-2 justify-center">
              {row.map((k) => {
                const isActive = currentNormalizedKey === k;
                const isHomeBump = k === 'f' || k === 'j';

                return (
                  <div
                    key={k}
                    className={`w-7 h-8 sm:w-11 sm:h-11 rounded-lg flex flex-col items-center justify-center font-mono text-xs sm:text-sm font-semibold uppercase transition-all shadow-sm relative ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                        : isHomeBump
                        ? 'bg-slate-800/90 text-slate-200 border border-amber-500/30'
                        : 'bg-slate-800/70 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <span>{k}</span>
                    {isHomeBump && (
                      <span className="w-2 sm:w-3 h-0.5 bg-amber-400/80 rounded-full mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Spacebar row */}
          <div className="flex gap-2 justify-center w-full mt-1">
            <div
              className={`h-8 sm:h-10 w-48 sm:w-80 rounded-lg flex items-center justify-center font-mono text-xs font-semibold tracking-wider transition-all shadow-sm border ${
                currentNormalizedKey === ' '
                  ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                  : 'bg-slate-800/70 text-slate-400 border-slate-700/60'
              }`}
            >
              BOŞLUK (SPACE)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
