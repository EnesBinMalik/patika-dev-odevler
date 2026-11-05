/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React from 'react';
import { Download } from 'lucide-react';
import { generateProjectZip } from '../utils/zipExporter';

interface HeaderProps {
  activeTab: 'runner' | 'explorer' | 'playground' | 'report';
  setActiveTab: (tab: 'runner' | 'explorer' | 'playground' | 'report') => void;
  isDownloading: boolean;
  setIsDownloading: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDownloading,
  setIsDownloading,
}) => {
  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BookStore_UnitTests_EnesOzturk.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('runner')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm group-hover:bg-indigo-500 transition-colors">
              EÖ
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                BookStore Unit Test Suite
              </span>
              <span className="block text-xs text-slate-400">
                Enes Öztürk
              </span>
            </div>
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('runner')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'runner'
                  ? 'text-white border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Test Koşucusu
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'explorer'
                  ? 'text-white border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Kod Gezgini
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'playground'
                  ? 'text-white border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              İnteraktif Test
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                activeTab === 'report'
                  ? 'text-white border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              Ödev Belgeleri
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
              title="Tüm C# test ve kaynak dosyalarını .zip olarak indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Paketleniyor...' : 'Ödevi İndir (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
