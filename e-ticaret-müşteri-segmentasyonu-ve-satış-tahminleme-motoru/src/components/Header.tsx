import React from 'react';
import { Database, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReport: () => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenAiAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (single text element wordmark in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
          <button
            onClick={() => setActiveTab('sql_cleaning')}
            className="text-left font-bold text-base sm:text-lg tracking-tight text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Segment & Forecast Engine
          </button>
        </div>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('sql_cleaning')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 ${
              activeTab === 'sql_cleaning' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-1' : ''
            }`}
          >
            01. SQL & Veri Temizleme
          </button>
          <button
            onClick={() => setActiveTab('eda_statistics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 ${
              activeTab === 'eda_statistics' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-1' : ''
            }`}
          >
            02. EDA & Temel Matematik
          </button>
          <button
            onClick={() => setActiveTab('rfm_forecast')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 ${
              activeTab === 'rfm_forecast' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-1' : ''
            }`}
          >
            03. RFM & Satış Tahminleme
          </button>
          <button
            onClick={() => setActiveTab('git_storytelling')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 ${
              activeTab === 'git_storytelling' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500 py-1' : ''
            }`}
          >
            04. GIT & Veri Hikayeciliği
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAiAssistant}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Analist
          </button>
          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm hover:shadow-indigo-500/20 transition-all whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            Yönetici Raporu
          </button>
        </div>
      </div>
    </header>
  );
};
