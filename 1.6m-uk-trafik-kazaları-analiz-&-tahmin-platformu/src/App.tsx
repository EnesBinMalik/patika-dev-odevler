/**
 * 1.6 MILLION UK TRAFFIC ACCIDENTS (2000 - 2016)
 * Main Application Hub & Analytics Platform
 * Author & Signature: Enes Öztürk
 */
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { Pillar1TrafficFlow } from './components/Pillar1TrafficFlow.tsx';
import { Pillar2RiskFactors } from './components/Pillar2RiskFactors.tsx';
import { Pillar3Forecasting } from './components/Pillar3Forecasting.tsx';
import { Pillar4RuralUrban } from './components/Pillar4RuralUrban.tsx';
import { RegionalMapSection } from './components/RegionalMapSection.tsx';
import { ExecutiveReportModal } from './components/ExecutiveReportModal.tsx';
import { AiAnalystDrawer } from './components/AiAnalystDrawer.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAiAnalystOpen, setIsAiAnalystOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Bar Navigation */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAiAnalyst={() => setIsAiAnalystOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Hero Section with Problem Definition, Questions & Generated Asset */}
        <HeroSection onScrollTo={handleScrollTo} />

        {/* Question 1: How does change in traffic flow impact accidents? */}
        <Pillar1TrafficFlow />

        {/* Question 2: What increases accident rates? */}
        <Pillar2RiskFactors />

        {/* Question 3: Can we forecast accident rates over time? */}
        <Pillar3Forecasting />

        {/* Question 4: How have rural and urban areas diverged? */}
        <Pillar4RuralUrban />

        {/* Geographic UK Regions & Hotspots Map */}
        <RegionalMapSection />
      </main>

      {/* Footer with Signature & Attribution */}
      <Footer />

      {/* Modals & Drawers */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <AiAnalystDrawer
        isOpen={isAiAnalystOpen}
        onClose={() => setIsAiAnalystOpen(false)}
      />

    </div>
  );
}
