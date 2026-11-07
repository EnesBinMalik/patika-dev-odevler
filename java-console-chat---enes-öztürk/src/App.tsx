/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import JSZip from 'jszip';
import { ViewTab } from './types';
import { Header } from './components/Header';
import { TerminalStudio } from './components/TerminalStudio';
import { ThreadVisualizer } from './components/ThreadVisualizer';
import { CodeExplorer } from './components/CodeExplorer';
import { LanGuide } from './components/LanGuide';
import { JAVA_PROJECT_FILES } from './data/javaSources';
import { Terminal, Cpu, Code2, Network, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('simulator');
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const zip = new JSZip();

      // Create a root folder inside zip
      const folder = zip.folder('java-console-chat-enes-ozturk');
      if (folder) {
        for (const file of JAVA_PROJECT_FILES) {
          folder.file(file.name, file.content);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'java-console-chat-enes-ozturk.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP oluşturulurken hata:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Navigation Tabs for Mobile / Tablet View */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Konsol Simülatörü</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>İplik & Soket</span>
          </button>

          <button
            onClick={() => setActiveTab('sourcecode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'sourcecode'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java Kodları</span>
          </button>

          <button
            onClick={() => setActiveTab('languide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'languide'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>LAN Rehberi</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'simulator' && <TerminalStudio />}
        {activeTab === 'architecture' && <ThreadVisualizer />}
        {activeTab === 'sourcecode' && (
          <CodeExplorer
            onDownloadZip={handleDownloadZip}
            isDownloadingZip={isDownloadingZip}
          />
        )}
        {activeTab === 'languide' && <LanGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">Enes Öztürk</span>
            <span>·</span>
            <span>Java Çok İplikli (Multi-Threaded) Soket Chat Uygulaması</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Standart Java SE Kütüphanesi</span>
            <span>·</span>
            <span className="text-slate-500">enesbino38@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
