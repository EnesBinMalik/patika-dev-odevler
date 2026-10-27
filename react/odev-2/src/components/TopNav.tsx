import React from 'react';
import { Volume2, VolumeX, HelpCircle, Award, Layers } from 'lucide-react';
import { ViewMode } from '../types/todo';

interface TopNavProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
  onOpenDevModal: () => void;
  activeCount: number;
  totalCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  viewMode,
  onViewModeChange,
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
  onOpenDevModal,
  activeCount,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Signature Tag */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDevModal}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
              EÖ
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>Enes Öztürk</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-semibold rounded">
                  Ödev 2
                </span>
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block">
                Patika.dev React Bootcamp
              </div>
            </div>
          </button>
        </div>

        {/* View Mode Switcher (Segmented Control) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onViewModeChange('classic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'classic'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Orijinal TodoMVC HTML & CSS şablonu (Patika ödev gereksinimi)"
          >
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            <span>Klasik TodoMVC</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('modern')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'modern'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Enes Öztürk Pro Studio (Gelişmiş arayüz ve özellikler)"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pro Studio</span>
          </button>
        </div>

        {/* Utilities: Sound, Shortcuts, Info */}
        <div className="flex items-center gap-1.5 text-slate-600">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Sesleri Kapat' : 'Sesleri Aç'}
            aria-label="Ses efektlerini aç veya kapat"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Shortcuts Modal button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer text-slate-600"
            title="Klavye Kısayolları (?)"
            aria-label="Klavye kısayolları"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Developer Details Modal button */}
          <button
            type="button"
            onClick={onOpenDevModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-2xs cursor-pointer ml-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">İmza & Bilgiler</span>
          </button>
        </div>
      </div>
    </header>
  );
};
