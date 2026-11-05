import React from 'react';
import { 
  Sprout, 
  UserCheck, 
  FileCode2, 
  BarChart3, 
  Microscope, 
  GitBranch, 
  ExternalLink, 
  BrainCircuit,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AUTHOR_NAME, PROJECT_TITLE, KAGGLE_COMPETITION_URL } from '../data/mockData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: '1. Problem & Patojenler', icon: Sprout, badge: 'FGVC7' },
    { id: 'eda', label: '2. EDA & Outlier & Augmentasyon', icon: Sliders, badge: 'Ders Ötesi' },
    { id: 'metrics', label: '3. Error Metriği & Doğrulama', icon: BarChart3, badge: 'ROC-AUC' },
    { id: 'benchmark', label: '4. Model Benchmark (8 Model)', icon: BrainCircuit, badge: '⭐ En İyi' },
    { id: 'diagnosis', label: '5. Canlı Tanı & Grad-CAM', icon: Microscope, badge: 'AI Vision' },
    { id: 'code', label: '6. Python / PyTorch Notebook', icon: FileCode2, badge: 'Tam Kod' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Author & Competition Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              <Sprout className="w-3.5 h-3.5" />
              Kaggle Plant Pathology 2020 - FGVC7
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-slate-300">
              Bilgisayarlı Görü ile Bitki Sağlığı Teşhisi
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Author Attribution Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 border border-indigo-500/40 text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hazırlayan:</span>
              <strong className="text-emerald-300 font-semibold">{AUTHOR_NAME}</strong>
              <span className="text-slate-400 text-[10px] hidden md:inline">(enesbino38@gmail.com)</span>
            </div>

            <a
              href={KAGGLE_COMPETITION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>Kaggle</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Title & Nav */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {PROJECT_TITLE}
              </h1>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl">
              Fungal patojenlerin sebep olduğu ürün kayıpları ve gereksiz kimyasal kullanımını önlemek amacıyla derin öğrenme, 
              Stratified 5-Fold Cross Validation ve EfficientNet-B4 ile geliştirilmiş teşhis ve analiz sistemi.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col">
              <span className="text-slate-400 text-[10px]">Eğitim Verisi</span>
              <span className="font-semibold text-slate-200">1,821 Görsel</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col">
              <span className="text-slate-400 text-[10px]">Hedef Sınıflar</span>
              <span className="font-semibold text-amber-300">4 Kategori</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex flex-col">
              <span className="text-emerald-400 text-[10px]">En İyi ROC-AUC</span>
              <span className="font-bold text-emerald-300">0.9891 (Ensemble)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-emerald-700/80 text-emerald-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
