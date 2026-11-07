/**
 * Top Navigation Header - 3 Zone Contract
 * Research: Enes Öztürk
 */
import React from 'react';
import { ShieldAlert, FileText, Sparkles, MapPin, Activity, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenReport: () => void;
  onOpenAiAnalyst: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReport, onOpenAiAnalyst }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark Brand */}
        <a 
          href="#top" 
          className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2.5 whitespace-nowrap shrink-0 group hover:text-amber-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-100">UK ACCIDENTS</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 hidden sm:inline-block">
            1.6M RECORD
          </span>
        </a>

        {/* Zone 2: Concise Nav Links (Single line) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
          <a href="#traffic-flow" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            Trafik Akışı
          </a>
          <a href="#risk-factors" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            Risk Faktörleri
          </a>
          <a href="#forecasting" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Gelecek Tahmini
          </a>
          <a href="#rural-urban" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Kırsal vs Kentsel
          </a>
          <a href="#regional-map" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            Bölgesel Harita
          </a>
        </nav>

        {/* Zone 3: Primary Action & Author Signature Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiAnalyst}
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Yapay Zeka Destekli Analiz Raporu"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Analist</span>
          </button>

          <button
            onClick={onOpenReport}
            type="button"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/20"
          >
            <FileText className="w-3.5 h-3.5 text-slate-900" />
            <span>Rapor & İmza</span>
          </button>
        </div>

      </div>
    </header>
  );
};
