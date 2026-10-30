import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'subscriptions' | 'playground' | 'database' | 'schema';
  setActiveTab: (tab: 'subscriptions' | 'playground' | 'database' | 'schema') => void;
  onRunVerification: () => void;
  isVerifying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunVerification,
  isVerifying,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('subscriptions');
              }}
              className="text-lg font-semibold tracking-tight text-white whitespace-nowrap hover:text-indigo-400 transition-colors"
            >
              GraphQL Subscriptions Studio
            </a>
            <span className="hidden sm:inline-block text-xs font-medium text-indigo-400/90 tracking-wide">
              by Enes Öztürk
            </span>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'subscriptions'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Canlı Akışlar
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'playground'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              GraphQL Playground
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'database'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Veri Modeli
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'schema'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Şema & Çözücüler
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRunVerification}
              disabled={isVerifying}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Test Ediliyor...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ödevi Doğrula</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-2 py-2 border-t border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'subscriptions' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Canlı Akışlar
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'playground' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'database' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Veri Modeli
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Şema
          </button>
        </div>
      </div>
    </header>
  );
};
