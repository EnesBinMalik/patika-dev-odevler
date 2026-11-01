import React from 'react';
import { Award, BookOpen, Code, Layers, Terminal, ListCheck, FileText, CheckCircle2 } from 'lucide-react';

export type TabType = 'calculator' | 'architecture' | 'playground' | 'polymorphism' | 'code' | 'report';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReport }) => {
  const tabs = [
    { id: 'calculator' as TabType, label: 'Hesaplayıcı & Görsel', icon: Layers },
    { id: 'architecture' as TabType, label: 'OOP & Az Kod Mantığı', icon: BookOpen },
    { id: 'playground' as TabType, label: 'Canlı Konsol / Test', icon: Terminal },
    { id: 'polymorphism' as TabType, label: 'Polimorfizm Dizisi', icon: ListCheck },
    { id: 'code' as TabType, label: 'Kaynak Kodlar', icon: Code },
    { id: 'report' as TabType, label: 'Ödev Raporu', icon: FileText }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar with Title and Enes Öztürk Signature */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                  OOP
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Geometrik Şekiller Sınıf Hiyerarşisi
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ödev Tamamlandı
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sekil, Dikdortgen, Kare ve Ucgen Sınıfları • Minimum Kod Prensibi (DRY)
              </p>
            </div>
          </div>

          {/* Enes Öztürk Signature Card */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl px-4 py-2 shadow-inner">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300/80">
                Ödev Sahibi & İmza
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-signature text-2xl text-amber-300 leading-none tracking-wide font-bold">
                  Enes Öztürk
                </span>
                <span className="text-[11px] text-slate-400">| Dijital Onaylı</span>
              </div>
            </div>
            <button
              onClick={onOpenReport}
              className="ml-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer flex items-center gap-1.5"
              title="Resmi Ödev Raporunu Aç"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rapor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'report') {
                    onOpenReport();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
