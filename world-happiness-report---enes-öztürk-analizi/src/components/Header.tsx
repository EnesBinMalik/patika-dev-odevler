import React from 'react';
import { Download, FileText, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExportCSV }) => {
  const navItems = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'factors', label: '6 Faktör Analizi' },
    { id: 'evolution', label: '2015-2017 Değişim' },
    { id: 'casestudies', label: 'Vaka İncelemeleri' },
    { id: 'compare', label: 'Kıyas & Simülatör' },
    { id: 'signature', label: 'Enes Öztürk Notu' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200 text-stone-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-sm font-bold shadow-xs">
              WH
            </div>
            <a
              href="#overview"
              onClick={() => setActiveTab('overview')}
              className="text-lg font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap hover:text-amber-900 transition-colors"
            >
              World Happiness Report
            </a>
          </div>

          {/* Zone 2: Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap transition-colors relative py-1 hover:text-stone-900 ${
                  activeTab === item.id
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-600'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-800 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 border border-stone-300 rounded-md hover:bg-stone-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span>Veri İndir (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav rail */}
      <div className="lg:hidden border-t border-stone-200 overflow-x-auto py-2 px-4 flex gap-4 scrollbar-none bg-[#FAF7F2]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`text-xs font-medium whitespace-nowrap px-3 py-1 rounded-md transition-colors ${
              activeTab === item.id
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
