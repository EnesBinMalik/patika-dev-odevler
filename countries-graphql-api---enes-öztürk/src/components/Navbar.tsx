import React from 'react';
import { Globe, Terminal, Database, BookOpen, Code2, Check, Copy } from 'lucide-react';

export type ActiveTab = 'studio' | 'explorer' | 'schema' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  serverStatus: 'online' | 'ready';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  serverStatus,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyEndpoint = () => {
    const fullUrl = `${window.location.origin}/graphql`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
              <Globe className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Countries GraphQL API
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                by <span className="text-pink-400 font-semibold">Enes Öztürk</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => onTabChange('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              GraphQL Studio
            </button>

            <button
              onClick={() => onTabChange('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'explorer'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Data Explorer
            </button>

            <button
              onClick={() => onTabChange('schema')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'schema'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Schema & Docs
            </button>

            <button
              onClick={() => onTabChange('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              cURL & Integration
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={copyEndpoint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-700 transition-colors whitespace-nowrap"
              title="Copy endpoint URL"
            >
              <span className="text-pink-400 font-semibold">POST</span>
              <span>/graphql</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
