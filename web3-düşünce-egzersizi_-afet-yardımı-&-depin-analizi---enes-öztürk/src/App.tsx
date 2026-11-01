import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TableOfContents } from './components/TableOfContents';
import { ReportSections } from './components/ReportSections';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { SecondaryCases } from './components/SecondaryCases';
import { ExportModal } from './components/ExportModal';
import { AUTHOR_NAME, REPORT_DATE } from './data/reportData';

export default function App() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-stone-900 flex flex-col font-sans">
      
      {/* 3-Zone Top Navigation Contract */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* Main Publication Container */}
      <main className="flex-1">
        
        {/* Editorial Hero Section */}
        <HeroSection />

        {/* Content Container: Asymmetric 2-Column Layout (§4 Pattern D) */}
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
          <div className="flex gap-12 items-start">
            
            {/* Main Reading Column */}
            <div className="flex-1 min-w-0 max-w-3xl">
              
              {/* 4 Core Prompt Sections + Official Signature */}
              <ReportSections />

              {/* Live Protocol Simulator */}
              <InteractiveSimulator />

              {/* Web2 vs Web3 Comparative Matrix */}
              <ComparisonMatrix />

              {/* Extended Thought Exercises (DeSci & DeGrid) */}
              <SecondaryCases />

            </div>

            {/* Sticky Editorial TOC Rail */}
            <TableOfContents />

          </div>
        </div>

      </main>

      {/* Institutional Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white/60 py-12 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 text-sm">Web3 Düşünce Egzersizi</span>
            <span aria-hidden="true">·</span>
            <span>Hazırlayan: <strong className="text-stone-800">{AUTHOR_NAME}</strong></span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span>{REPORT_DATE}</span>
            <span aria-hidden="true">·</span>
            <span>Dağıtık Sistemler ve Blokzincir Mimarisi</span>
          </div>
        </div>
      </footer>

      {/* Export / Download Modal */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />

    </div>
  );
}
