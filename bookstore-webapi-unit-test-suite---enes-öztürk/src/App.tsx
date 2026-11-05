/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TestRunner } from './components/TestRunner';
import { CodeViewer } from './components/CodeViewer';
import { ScenarioPlayground } from './components/ScenarioPlayground';
import { HomeworkReport } from './components/HomeworkReport';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'runner' | 'explorer' | 'playground' | 'report'>('runner');
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top 3-Zone Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDownloading={isDownloading}
        setIsDownloading={setIsDownloading}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'runner' && <TestRunner />}
        {activeTab === 'explorer' && <CodeViewer />}
        {activeTab === 'playground' && <ScenarioPlayground />}
        {activeTab === 'report' && <HomeworkReport />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
