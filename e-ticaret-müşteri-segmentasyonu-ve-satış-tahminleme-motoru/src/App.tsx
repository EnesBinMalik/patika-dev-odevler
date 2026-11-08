import React, { useState } from 'react';
import { Header } from './components/Header';
import { Module1SqlCleaning } from './components/Module1SqlCleaning';
import { Module2EdaStatistics } from './components/Module2EdaStatistics';
import { Module3SegmentationForecast } from './components/Module3SegmentationForecast';
import { Module4GitStorytelling } from './components/Module4GitStorytelling';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { AiAnalyticsAssistant } from './components/AiAnalyticsAssistant';
import { Database, BarChart2, Users, GitBranch, Sparkles, FileText, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('sql_cleaning');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  const modules = [
    {
      id: 'sql_cleaning',
      title: '01. SQL & Veri Temizleme',
      subtitle: 'Data Extraction & Pandas Cleaning',
      icon: Database,
    },
    {
      id: 'eda_statistics',
      title: '02. EDA & Temel Matematik',
      subtitle: 'Momentler, Dağılımlar & Korelasyon',
      icon: BarChart2,
    },
    {
      id: 'rfm_forecast',
      title: '03. RFM & Satış Tahminleme',
      subtitle: 'Segmentasyon & Seasonal ARIMA',
      icon: Users,
    },
    {
      id: 'git_storytelling',
      title: '04. GIT & Veri Hikayeciliği',
      subtitle: 'Jupyter & Enes Öztürk Raporu',
      icon: GitBranch,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Module Breadcrumb & Workflow Tabs for Quick Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/40 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {m.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{m.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Module Content View */}
        {activeTab === 'sql_cleaning' && <Module1SqlCleaning />}
        {activeTab === 'eda_statistics' && <Module2EdaStatistics />}
        {activeTab === 'rfm_forecast' && <Module3SegmentationForecast />}
        {activeTab === 'git_storytelling' && (
          <Module4GitStorytelling onOpenReportModal={() => setIsReportOpen(true)} />
        )}
      </main>

      {/* Quiet, Professional Anti-Slop Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">E-Ticaret Müşteri Segmentasyonu ve Satış Tahminleme Motoru</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>Uçtan Uca Veri Analitiği Simülasyonu</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>
              İmza: <strong className="text-slate-200">Enes Öztürk</strong> (Veri Bilimci)
            </span>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Yönetici Özeti
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ExecutiveReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <AiAnalyticsAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
