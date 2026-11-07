import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ChallengeTasksView } from './components/ChallengeTasksView';
import { LiteratureExplorerView } from './components/LiteratureExplorerView';
import { AiTextMiningView } from './components/AiTextMiningView';
import { BiomedicalKnowledgeGraphView } from './components/BiomedicalKnowledgeGraphView';
import { CorpusAnalyticsView } from './components/CorpusAnalyticsView';
import { PaperDetailModal } from './components/PaperDetailModal';
import { ProjectProvenanceModal } from './components/ProjectProvenanceModal';
import { CORD19_PAPERS, ChallengeTask } from './data/cord19Dataset';
import { ShieldCheck, Database, Award, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);
  const [miningInitialQuery, setMiningInitialQuery] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const selectedPaper = selectedPaperId
    ? CORD19_PAPERS.find(p => p.id === selectedPaperId) || null
    : null;

  const handleExecuteSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('explorer');
  };

  const handleMineTask = (task: ChallengeTask) => {
    setMiningInitialQuery(task.fullQuestion);
    setActiveTab('mining');
  };

  const handleMineQuery = (query: string) => {
    setMiningInitialQuery(query);
    setActiveTab('mining');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
        onQuickMine={() => {
          setMiningInitialQuery('COVID-19 tedavisinde güncel konsensüs ve en etkili antiviral stratejiler nelerdir?');
          setActiveTab('mining');
        }}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Hero Section with Problem Statement & Scientific Image */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExecuteSearch={handleExecuteSearch}
        onSelectTask={(taskId) => {
          setActiveTab('tasks');
        }}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1">
        {activeTab === 'tasks' && (
          <ChallengeTasksView
            onSelectPaper={(id) => setSelectedPaperId(id)}
            onMineTask={handleMineTask}
          />
        )}

        {activeTab === 'explorer' && (
          <LiteratureExplorerView
            onSelectPaper={(id) => setSelectedPaperId(id)}
            onMineQuery={handleMineQuery}
          />
        )}

        {activeTab === 'mining' && (
          <AiTextMiningView
            initialQuery={miningInitialQuery}
            onSelectPaper={(id) => setSelectedPaperId(id)}
          />
        )}

        {activeTab === 'graph' && (
          <BiomedicalKnowledgeGraphView
            onSearchQuery={handleExecuteSearch}
          />
        )}

        {activeTab === 'analytics' && (
          <CorpusAnalyticsView />
        )}
      </main>

      {/* Modals */}
      <PaperDetailModal
        paper={selectedPaper}
        onClose={() => setSelectedPaperId(null)}
        onMinePaper={handleMineQuery}
      />

      {isProvenanceOpen && (
        <ProjectProvenanceModal
          onClose={() => setIsProvenanceOpen(false)}
        />
      )}

      {/* Quiet Scientific Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="text-slate-300 font-semibold">
              COVID-19 Open Research Dataset Challenge (CORD-19)
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-700">·</span>
            <span className="text-cyan-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Enes Öztürk İmzalı
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono text-slate-400">
            <span>BEYAZ SARAY OSTP</span>
            <span>·</span>
            <span>ALLEN AI</span>
            <span>·</span>
            <span>KAGGLE</span>
            <span>·</span>
            <span>NLM / NIH</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
