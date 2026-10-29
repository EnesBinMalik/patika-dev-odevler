/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Server, CheckCircle2, Play, Square, Award, Code2, Terminal, BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  isServerRunning: boolean;
  onToggleServer: () => void;
  activeTab: 'simulator' | 'code' | 'tests' | 'guide' | 'submission';
  setActiveTab: (tab: 'simulator' | 'code' | 'tests' | 'guide' | 'submission') => void;
  passedTestsCount: number;
  totalTestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isServerRunning,
  onToggleServer,
  activeTab,
  setActiveTab,
  passedTestsCount,
  totalTestsCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Assignment Info */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-mono font-bold text-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ödev 5
                </span>
                <span className="text-xs text-slate-400 font-medium">Node.js Web Sunucusu</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Port: 5000
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Kendi Web Sunucumuz
                <span className="text-slate-400 font-normal text-sm hidden sm:inline">
                  (createServer)
                </span>
              </h1>
            </div>
          </div>

          {/* Developer Signature & Server Status Switch */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Enes Öztürk Signature Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
                EÖ
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 leading-none">İmza & Geliştirici</div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  Enes Öztürk
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Server Status & Toggle Button */}
            <button
              onClick={onToggleServer}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-sm ${
                isServerRunning
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
              }`}
              title="Sunucuyu Durdur / Başlat"
            >
              <span className="relative flex h-2.5 w-2.5">
                {isServerRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isServerRunning ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span>
                {isServerRunning ? 'Port 5000: Aktif' : 'Sunucu: Kapalı'}
              </span>
              {isServerRunning ? (
                <Square className="w-3 h-3 ml-1 fill-current opacity-70" />
              ) : (
                <Play className="w-3 h-3 ml-1 fill-current opacity-70" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Canlı Simülatör (localhost:5000)
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Kaynak Kod (index.js)
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'tests'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ödev Testleri ({passedTestsCount}/{totalTestsCount})
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Nasıl Çalıştırılır? (Rehber)
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'submission'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4 text-yellow-400" />
            Teslimat Kartı (Enes Öztürk)
          </button>
        </div>
      </div>
    </header>
  );
};
