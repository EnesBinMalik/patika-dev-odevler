import React from 'react';
import { Cpu, FileCode2, Terminal, FileText, GitBranch, Download, CheckCircle2 } from 'lucide-react';
import { AppTab } from '../types';
import { SINGLE_FILE_JAVA_CODE } from '../data/javaCode';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onResetSimulation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const downloadJavaFile = () => {
    const blob = new Blob([SINGLE_FILE_JAVA_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Main.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: 'simulation' as AppTab, label: 'Canlı Simülatör', icon: Cpu },
    { id: 'code' as AppTab, label: 'Java Kodu', icon: FileCode2 },
    { id: 'terminal' as AppTab, label: 'Konsol Çıktısı', icon: Terminal },
    { id: 'architecture' as AppTab, label: 'Mimari Şema', icon: GitBranch },
    { id: 'report' as AppTab, label: 'Ödev Raporu', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100">
      {/* Top Banner with Student Signature & Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
            <span className="font-mono text-base tracking-tighter">10K</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Java Multithreading Ödevi
              </h1>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                10.000 Sayı / 4 Thread
              </span>
            </div>
            <p className="text-xs text-slate-400">
              1-10000 arası sayıların 4 eş parçaya bölünüp tek ve çift listelerine ayrıştırılması
            </p>
          </div>
        </div>

        {/* Signature Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              EÖ
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200">Enes Öztürk</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-amber-400/90 block font-medium">
                Ödev Hazırlayan & İmza
              </span>
            </div>
          </div>

          <button
            onClick={downloadJavaFile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/20 active:scale-95"
            title="Hazır Main.java dosyasını indir"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Main.java İndir</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
