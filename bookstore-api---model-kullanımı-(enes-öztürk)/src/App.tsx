import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSignature } from './components/HeroSignature';
import { ArchitectureFlow } from './components/ArchitectureFlow';
import { ModelSpecs } from './components/ModelSpecs';
import { InteractivePlayground } from './components/InteractivePlayground';
import { CodeViewer } from './components/CodeViewer';
import { AssignmentReport } from './components/AssignmentReport';
import { Footer } from './components/Footer';
import { generateCompleteAssignmentMarkdown } from './utils/markdownGenerator';

export default function App() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAll = () => {
    const fullMarkdown = generateCompleteAssignmentMarkdown();
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 3-Zone Top Bar */}
      <Header onCopyAll={handleCopyAll} copied={copied} />

      <main className="flex-1">
        {/* Enes Öztürk Signature & Hero */}
        <HeroSignature />

        {/* Core Architecture Rationale: Entity vs Model */}
        <ArchitectureFlow />

        {/* Detailed Input / Output Model Specifications */}
        <ModelSpecs />

        {/* Interactive Working Playground: Test GetById & UpdateBook Live */}
        <InteractivePlayground />

        {/* Full C# Code Solution Explorer */}
        <CodeViewer />

        {/* Formal Homework Report Signed by Enes Öztürk */}
        <AssignmentReport onCopyAll={handleCopyAll} copied={copied} />
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}
