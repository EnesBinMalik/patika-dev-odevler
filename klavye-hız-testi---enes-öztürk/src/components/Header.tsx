import React from 'react';
import { Volume2, VolumeX, Globe, RotateCcw } from 'lucide-react';
import { Language, SoundTheme } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundTheme: SoundTheme;
  onSoundChange: (theme: SoundTheme) => void;
  onRestart: () => void;
  onOpenInfo: () => void;
  onOpenShortcuts: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  soundTheme,
  onSoundChange,
  onRestart,
  onOpenInfo,
  onOpenShortcuts,
  onOpenHistory,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRestart}
            className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
            title="Yeniden Başlat"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-mono font-bold text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform">
              60s
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Klavye Hız Testi</span>
              </div>
              <p className="text-[11px] font-medium text-amber-400/90 -mt-0.5 tracking-wide">
                Enes Öztürk İmzalı
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onOpenInfo}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Nasıl Hesaplanır?
          </button>
          <button
            onClick={onOpenShortcuts}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Klavye Kısayolları
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Geçmiş Skorlar
          </button>
        </nav>

        {/* Zone 3: Quick tools & restart action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap"
            title="Dili Değiştir"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase font-mono font-semibold">{language}</span>
          </button>

          {/* Sound Switch */}
          <button
            onClick={() => {
              const next: SoundTheme = soundTheme === 'mechanical' ? 'off' : 'mechanical';
              onSoundChange(next);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              soundTheme !== 'off'
                ? 'bg-slate-900 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title={soundTheme === 'off' ? 'Klavye Sesini Aç' : 'Klavye Sesini Kapat'}
          >
            {soundTheme !== 'off' ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {soundTheme !== 'off' ? 'Mekanik Ses' : 'Sessiz'}
            </span>
          </button>

          {/* Restart CTA */}
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            title="Testi Baştan Başlat (Esc veya Tab+Enter)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
