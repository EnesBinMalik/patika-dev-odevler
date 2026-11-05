import React from 'react';
import { TargetVariable } from '../types/energy';
import { Zap, Euro, Activity, Sparkles, Github, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  target: TargetVariable;
  setTarget: (target: TargetVariable) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  target,
  setTarget,
}) => {
  const tabs = [
    { id: 'eda', label: '1. Veri & EDA', icon: Database, badge: '4 Yıllık İspanya' },
    { id: 'preprocessing', label: '2. Ön İşleme & Outlier', icon: Sparkles, badge: 'IQR & Z-Score' },
    { id: 'split-metrics', label: '3. Bölme & Metrikler', icon: Activity, badge: 'RMSE / RMSLE' },
    { id: 'models', label: '4. Model Kıyaslama', icon: Zap, badge: '6 Model & Şampiyon' },
    { id: 'municipality', label: '5. Belediye Simülatörü', icon: Euro, badge: 'Dinamik Tarife' },
    { id: 'repo', label: '6. GitHub Repo & Kod', icon: Github, badge: 'Enes Öztürk' },
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner with Author Signature & Project Credentials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title and Signature */}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
              </span>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Saatlik Enerji Talebi, Üretimi ve Hava Durumu ML Platformu</span>
                </h1>
                <p className="text-xs text-slate-400">
                  İspanya 4 Yıllık Elektrik & 5 Şehir Meteoroloji Veri Seti ile Saatlik Talep & Fiyat Modellemesi
                </p>
              </div>
            </div>
          </div>

          {/* Author Badge & Target Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Signature badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-950/80 to-purple-950/80 border border-blue-700/50 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">Araştırmacı & Geliştirici:</span>
              <strong className="text-amber-300 font-semibold tracking-wide">Enes Öztürk</strong>
            </div>

            {/* Target Variable Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-lg text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Hedef (Target):</span>
              <button
                onClick={() => setTarget('total_load_actual')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer font-medium ${
                  target === 'total_load_actual'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Talep (MW)</span>
              </button>
              <button
                onClick={() => setTarget('price_actual')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer font-medium ${
                  target === 'price_actual'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Euro className="w-3.5 h-3.5" />
                <span>Fiyat (€/MWh)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
