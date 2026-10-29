import React from 'react';
import { Terminal, Plus, Play, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'blog' | 'console' | 'code' | 'guide';
  setActiveTab: (tab: 'blog' | 'console' | 'code' | 'guide') => void;
  onOpenNewPost: () => void;
  onRunSimulation: () => void;
  isRunningSimulation: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPost,
  onRunSimulation,
  isRunningSimulation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('blog')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                  Enes Öztürk Blog
                </span>
                <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 font-medium whitespace-nowrap hidden sm:inline-block">
                  Post Sıralama & Ekleme
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('blog')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
                activeTab === 'blog'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Blog Yazıları
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
                activeTab === 'console'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Konsol & Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
                activeTab === 'code'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Kaynak Kod (Node.js)
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
                activeTab === 'guide'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Asenkron Kılavuz
            </button>
          </nav>

          {/* Zone 3: Primary action controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRunSimulation}
              disabled={isRunningSimulation}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                isRunningSimulation
                  ? 'bg-amber-100 text-amber-800 cursor-wait'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98'
              }`}
              title="Konsol üzerinde önce mevcut postları sıralar, yeni post ekler ve tekrar sıralar"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningSimulation ? 'animate-spin' : ''}`} />
              <span>{isRunningSimulation ? 'Konsol Çalışıyor...' : 'Konsolda Çalıştır'}</span>
            </button>

            <button
              onClick={onOpenNewPost}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yeni Post Ekle</span>
              <span className="sm:hidden">Ekle</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-1 ${activeTab === 'blog' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Yazılar
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`py-1 flex items-center gap-1 ${activeTab === 'console' ? 'text-indigo-600 font-bold' : ''}`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-1 ${activeTab === 'code' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Kod
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-1 ${activeTab === 'guide' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Rehber
          </button>
        </div>
      </div>
    </header>
  );
};
