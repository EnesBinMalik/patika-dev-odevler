import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  Download, 
  Sun, 
  Moon, 
  Coffee, 
  Columns, 
  Square, 
  LayoutTemplate,
  Trash2,
  FileDown,
  Printer,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { SAMPLES } from '../data/samples';

export type ViewMode = 'split' | 'editor' | 'preview';
export type ThemeMode = 'dark' | 'light' | 'sepia';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  syncScroll: boolean;
  setSyncScroll: (sync: boolean) => void;
  onOpenHelp: () => void;
  onLoadSample: (content: string) => void;
  onClear: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  theme,
  setTheme,
  syncScroll,
  setSyncScroll,
  onOpenHelp,
  onLoadSample,
  onClear,
  onExportMd,
  onExportHtml,
  onPrint,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
      if (templateRef.current && !templateRef.current.contains(event.target as Node)) {
        setTemplateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('sepia');
    else setTheme('dark');
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 select-none z-20">
      {/* Zone 1: Brand & Enes Öztürk Signature Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 font-bold text-base shadow-sm">
            M↓
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-bold text-white tracking-tight whitespace-nowrap">
                Markdown Studio
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 whitespace-nowrap">
                Enes Öztürk
              </span>
            </div>
            <span className="hidden md:block text-[11px] text-slate-400 -mt-0.5 whitespace-nowrap">
              Canlı Ön İzleyici & Tasarım Editörü
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: View Switcher & Template Selector */}
      <div className="hidden lg:flex items-center gap-2 shrink-0">
        {/* Templates Dropdown */}
        <div className="relative" ref={templateRef}>
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-sky-400" />
            <span>Şablonlar</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {templateOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1.5 z-30">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hazır Örnekler
              </div>
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onLoadSample(s.content);
                    setTemplateOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <span className="truncate">{s.title}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-400 font-mono">
                    Yükle
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Bölünmüş Ekran (Editör & Ön İzleme)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Bölünmüş</span>
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Sadece Editör"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Editör</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Sadece Ön İzleme"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ön İzleme</span>
          </button>
        </div>

        {/* Sync Scroll Toggle */}
        <button
          onClick={() => setSyncScroll(!syncScroll)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
            syncScroll
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
          }`}
          title="Kaydırmayı Senkronize Et"
        >
          <RefreshCw className={`w-3 h-3 ${syncScroll ? 'animate-spin-once' : ''}`} />
          <span className="hidden xl:inline">Senkron Kaydırma</span>
        </button>
      </div>

      {/* Zone 3: Actions + Rightmost Prominent Question Mark (?) Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Clear Button */}
        <button
          onClick={onClear}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
          title="İçeriği Temizle"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Tema Değiştir (${theme === 'dark' ? 'Koyu' : theme === 'light' ? 'Açık' : 'Sepia'})`}
        >
          {theme === 'dark' && <Moon className="w-4 h-4 text-sky-400" />}
          {theme === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
          {theme === 'sepia' && <Coffee className="w-4 h-4 text-orange-400" />}
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dışa Aktar</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-30">
              <button
                onClick={() => {
                  onExportMd();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-sky-400" />
                <span>Markdown (.md) İndir</span>
              </button>
              <button
                onClick={() => {
                  onExportHtml();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>HTML (.html) İndir</span>
              </button>
              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={() => {
                  onPrint();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Yazdır / PDF Olarak Kaydet</span>
              </button>
            </div>
          )}
        </div>

        {/* PRIMARY QUESTION MARK BUTTON (?) - EXACT REQUIREMENT */}
        <button
          onClick={onOpenHelp}
          className="relative group flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          title="Örnek Markdown & Canlı Kılavuz"
          aria-label="Örnek Markdown & Kılavuz"
        >
          <HelpCircle className="w-4 h-4 text-slate-950" />
          <span className="font-semibold text-[13px]">?</span>
          <span className="hidden md:inline font-semibold">Örnek & Kılavuz</span>
        </button>
      </div>
    </header>
  );
};
