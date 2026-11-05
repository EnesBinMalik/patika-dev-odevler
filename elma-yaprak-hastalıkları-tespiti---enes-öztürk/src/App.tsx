import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { EdaPreprocessingTab } from './components/EdaPreprocessingTab';
import { MetricsValidationTab } from './components/MetricsValidationTab';
import { ModelBenchmarkTab } from './components/ModelBenchmarkTab';
import { LiveDiagnosisTab } from './components/LiveDiagnosisTab';
import { CodeNotebookTab } from './components/CodeNotebookTab';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'eda' && <EdaPreprocessingTab />}
        {activeTab === 'metrics' && <MetricsValidationTab />}
        {activeTab === 'benchmark' && <ModelBenchmarkTab />}
        {activeTab === 'diagnosis' && <LiveDiagnosisTab />}
        {activeTab === 'code' && <CodeNotebookTab />}
      </main>

      <Footer />
    </div>
  );
}
