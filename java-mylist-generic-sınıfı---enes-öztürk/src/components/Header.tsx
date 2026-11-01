/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Code2, Sparkles, CheckCircle2, Download, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { MY_LIST_JAVA_CODE } from '../data/javaSource.ts';

interface HeaderProps {
  activeTab: 'visualizer' | 'code' | 'docs';
  setActiveTab: (tab: 'visualizer' | 'code' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MY_LIST_JAVA_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJava = () => {
    const blob = new Blob([MY_LIST_JAVA_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MyList.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-mono font-bold text-lg text-amber-400">&lt;T&gt;</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight font-sans">
                  MyList<span className="text-amber-400">&lt;T&gt;</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full">
                  Generic Dinamik Dizi
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded border border-slate-700">
                  Java SE 8+
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-500">Collection sınıfı kullanılmadan sıfırdan geliştirildi</span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enes Öztürk İmzalı
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Bellek Görselleştirici & Simülatör
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Java Kaynak Kodu
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Algoritma & Metotlar
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleCopyCode}
              title="Java Kaynak Kodunu Kopyala"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJava}
              title="MyList.java Dosyasını İndir"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold shadow shadow-orange-500/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>MyList.java İndir</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
