import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResearchExecutiveSummary } from './components/ResearchExecutiveSummary';
import { SixFactorsExplorer } from './components/SixFactorsExplorer';
import { HistoricalEvolutionView } from './components/HistoricalEvolutionView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { CountryComparisonTool } from './components/CountryComparisonTool';
import { HappinessSimulator } from './components/HappinessSimulator';
import { AnalystSignatureNote } from './components/AnalystSignatureNote';
import { Footer } from './components/Footer';
import { HAPPINESS_DATASET } from './data/happinessData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // CSV Data Export functionality
  const handleExportCSV = () => {
    const headers = [
      'Country',
      'Country_TR',
      'Region',
      'Rank_2017',
      'Score_2017',
      'GDP_per_Capita',
      'Social_Support',
      'Healthy_Life_Expectancy',
      'Freedom',
      'Absence_of_Corruption',
      'Generosity',
      'Dystopia_Residual',
      'Rank_2016',
      'Score_2016',
      'Rank_2015',
      'Score_2015',
      'Score_Delta_2015_2017',
      'Rank_Delta_2015_2017',
    ];

    const rows = HAPPINESS_DATASET.map((c) => [
      `"${c.name}"`,
      `"${c.nameTr}"`,
      `"${c.regionTr}"`,
      c.rank2017,
      c.score2017,
      c.gdpPerCapita,
      c.socialSupport,
      c.healthyLifeExpectancy,
      c.freedom,
      c.trustGovCorruption,
      c.generosity,
      c.dystopiaResidual,
      c.rank2016,
      c.score2016,
      c.rank2015,
      c.score2015,
      c.scoreDelta1517,
      c.rankDelta1517,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `World_Happiness_Report_Enes_Ozturk_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCSV={handleExportCSV}
      />

      <main className="flex-1">
        {/* Editorial Hero Banner */}
        <Hero
          onExploreClick={() => setActiveTab('factors')}
          onViewExecutiveAnswers={() => setActiveTab('overview')}
        />

        {/* View Routing / Tabs */}
        {activeTab === 'overview' && (
          <>
            <ResearchExecutiveSummary onSelectTab={setActiveTab} />
            <SixFactorsExplorer />
            <HistoricalEvolutionView />
            <CaseStudiesView />
            <section className="py-12 bg-[#FAF7F2] border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <CountryComparisonTool />
                <HappinessSimulator />
              </div>
            </section>
            <AnalystSignatureNote />
          </>
        )}

        {activeTab === 'factors' && (
          <div className="py-6">
            <SixFactorsExplorer />
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="py-6">
            <HistoricalEvolutionView />
          </div>
        )}

        {activeTab === 'casestudies' && (
          <div className="py-6">
            <CaseStudiesView />
          </div>
        )}

        {activeTab === 'compare' && (
          <section className="py-12 bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <CountryComparisonTool />
              <HappinessSimulator />
            </div>
          </section>
        )}

        {activeTab === 'signature' && (
          <div className="py-6">
            <AnalystSignatureNote />
          </div>
        )}
      </main>

      {/* Institutional Signed Footer */}
      <Footer
        onExportCSV={handleExportCSV}
        onSelectTab={scrollToSection}
      />
    </div>
  );
}
