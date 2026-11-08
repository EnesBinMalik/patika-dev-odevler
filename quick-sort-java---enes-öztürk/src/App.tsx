/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Visualizer } from './components/Visualizer';
import { CodeViewer } from './components/CodeViewer';
import { AlgorithmAnalysis } from './components/AlgorithmAnalysis';
import { AuthorModal } from './components/AuthorModal';
import { JAVA_FULL_CODE } from './data/javaSourceCode';
import {
  Code2,
  PlayCircle,
  FileDown,
  Sparkles,
  Check,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'theory' | 'benchmark'>('visualizer');
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Trigger real download of QuickSort.java file
  const handleDownloadJava = () => {
    const blob = new Blob([JAVA_FULL_CODE], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'QuickSort.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleQuickCopy = () => {
    navigator.clipboard.writeText(JAVA_FULL_CODE);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-200">
      {/* Top Bar (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadJava={handleDownloadJava}
        onOpenAuthor={() => setIsAuthorModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="space-y-3 pb-2 border-b border-slate-900">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <span>Enes Öztürk</span>
            <span aria-hidden="true">&middot;</span>
            <span>Java Algoritma ve Veri Yapıları</span>
            <span aria-hidden="true">&middot;</span>
            <span>Böl ve Yönet (Divide &amp; Conquer)</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100 text-balance">
                Java Quick Sort (Hızlı Sıralama) Sınıfı
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
                Lomuto ve Hoare bölümleme şemalarını, en kötü durumu önleyen üçlü medyan (Median-of-Three) pivot optimizasyonunu,
                jenerik tip desteğini ve adım adım konsol izleme modunu içeren tam donanımlı Java uygulaması.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleQuickCopy}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Java Kodunu Kopyala</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Kaynak Kodunu İncele</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>İnteraktif Algoritma Görselleştirici</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Adım adım pivot ve işaretçi hareketleri
              </span>
            </div>
            <Visualizer />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Java QuickSort.java Kaynak Kodu</span>
              </h2>
              <span className="text-xs text-amber-400 font-mono">
                Enes Öztürk İmzalı
              </span>
            </div>
            <CodeViewer onDownloadJava={handleDownloadJava} />
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="space-y-6">
            <AlgorithmAnalysis />
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div className="space-y-6">
            <AlgorithmAnalysis />
          </div>
        )}
      </main>

      {/* Clean Human Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-400">QuickSort Java Studio</span>
            <span className="mx-2">&middot;</span>
            <span>Geliştirici: <strong className="text-slate-300">Enes Öztürk</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthorModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Yazar İmzası ve Lisans
            </button>
            <span aria-hidden="true">&middot;</span>
            <button
              onClick={handleDownloadJava}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              QuickSort.java
            </button>
          </div>
        </div>
      </footer>

      {/* Enes Öztürk Signature Modal */}
      <AuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
      />
    </div>
  );
}
