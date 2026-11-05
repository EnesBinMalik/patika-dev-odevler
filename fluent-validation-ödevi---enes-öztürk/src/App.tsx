import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractivePlayground } from './components/InteractivePlayground';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureFlow } from './components/ArchitectureFlow';
import { AssignmentReport } from './components/AssignmentReport';
import { Footer } from './components/Footer';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>('playground');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenReport={() => handleTabChange('report')}
      />

      <main className="flex-1">
        <HeroSection
          onExplorePlayground={() => handleTabChange('playground')}
          onExploreCode={() => handleTabChange('code')}
        />

        {/* Canlı Test Simülatörü */}
        <InteractivePlayground />

        {/* C# Kaynak Kodları Gezgini */}
        <CodeExplorer />

        {/* Mimari Akış ve Karşılaştırma */}
        <ArchitectureFlow />

        {/* Resmi Ödev Teslim Raporu (Yazdırılabilir / Enes Öztürk İmzalı) */}
        <AssignmentReport />
      </main>

      <Footer onSelectTab={handleTabChange} />
    </div>
  );
}
