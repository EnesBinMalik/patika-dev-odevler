import React from 'react';
import { CalculatorTab } from '../types/calculator';
import { Download, Code2, Terminal, Calculator, FunctionSquare, Binary } from 'lucide-react';
import { JAVA_FILES } from '../math/javaSourceCode';

interface HeaderProps {
  activeTab: CalculatorTab;
  onTabChange: (tab: CalculatorTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const downloadJavaBundle = () => {
    const singleFile = JAVA_FILES.find(f => f.filename === 'BilimselHesapMakinesiEnesOzturk.java');
    if (!singleFile) return;

    const blob = new Blob([singleFile.code], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BilimselHesapMakinesiEnesOzturk.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navItems: { id: CalculatorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'calculator', label: 'Hesap Makinesi', icon: Calculator },
    { id: 'calculus', label: 'Türev & İntegral', icon: FunctionSquare },
    { id: 'java-code', label: 'Java Kodları (OOP)', icon: Code2 },
    { id: 'terminal', label: 'Java Konsolu', icon: Terminal },
    { id: 'algorithms', label: 'Algoritma Analizi', icon: Binary },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single line brand wordmark with author signature */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              EÖ
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                ENES ÖZTÜRK
              </span>
              <span className="text-[11px] font-mono text-cyan-400 tracking-wide uppercase">
                Bilimsel Hesap Makinesi · Java OOP
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={downloadJavaBundle}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors shadow-sm whitespace-nowrap shrink-0"
              title="Sıfır kütüphane bağımlılığına sahip tam derlenebilir Java kodunu indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Java .java İndir</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Tab Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-900 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
