import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ConceptDeepDive } from './components/ConceptDeepDive';
import { ArchitectureMap } from './components/ArchitectureMap';
import { InteractivePipeline } from './components/InteractivePipeline';
import { SecurityVulnerabilityDemo } from './components/SecurityVulnerabilityDemo';
import { CodeSolutions } from './components/CodeSolutions';
import { HomeworkQuiz } from './components/HomeworkQuiz';
import { PrintReportModal } from './components/PrintReportModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('concepts');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 3-Zone Sticky Navigation Bar */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner with Enes Öztürk Signature and Core Summary */}
        <HeroBanner
          onStartSimulation={() => handleNavigate('pipeline')}
          onExploreConcepts={() => handleNavigate('concepts')}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* 01. Concept Deep Dive & Comparison Matrix */}
        <ConceptDeepDive />

        {/* 02. Layered Architecture Map & Flow Boundaries */}
        <ArchitectureMap />

        {/* 03. Live Interactive Transformation Pipeline Sandbox */}
        <InteractivePipeline />

        {/* 04. Security Lab: Overposting & Mass Assignment Exploit Demo */}
        <SecurityVulnerabilityDemo />

        {/* 05. Multi-Language Code Templates (C#, TS, Java) */}
        <CodeSolutions />

        {/* 06. Interactive Homework Quiz & Verification */}
        <HomeworkQuiz />
      </main>

      {/* Footer Signed by Enes Öztürk */}
      <Footer
        onOpenReport={() => setIsReportOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Printable Academic Assignment Submission Modal */}
      <PrintReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
