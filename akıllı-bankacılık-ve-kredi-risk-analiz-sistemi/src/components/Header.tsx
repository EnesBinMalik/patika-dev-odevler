import React from 'react';
import { Terminal, Shield, Layers, GitBranch, Share2, Sparkles, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLinkedInModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenLinkedInModal }) => {
  const navItems = [
    { id: 'terminal', label: 'Canlı Konsol', icon: Terminal },
    { id: 'module1', label: 'Modül 1: OOP & Hesaplar', icon: Shield },
    { id: 'module2', label: 'Modül 2: Stack & Queue', icon: Layers },
    { id: 'module3', label: 'Modül 3: Kredi Risk Motoru', icon: Sparkles },
    { id: 'module4', label: 'Modül 4: Dosya & Git', icon: GitBranch },
    { id: 'architecture', label: 'Katmanlı Mimari (C#)', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark & Developer Signature */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-sm">
              C#
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                SmartBanking.Core
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span className="text-emerald-400 font-medium">Enes Öztürk</span>
                <span aria-hidden="true">·</span>
                <span>.NET 9</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action - LinkedIn Post & Screenshot Generator */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLinkedInModal}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
              title="LinkedIn için optimize edilmiş ekran görüntüsü ve gönderi metni oluştur"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>LinkedIn Paylaşım Modu</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 -mx-4 px-4 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
