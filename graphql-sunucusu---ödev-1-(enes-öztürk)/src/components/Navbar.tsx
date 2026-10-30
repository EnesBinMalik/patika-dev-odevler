import React from 'react';
import { Terminal, ShieldCheck, Database, Layers, CheckCircle2, Play, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'playground' | 'verifier' | 'schema' | 'dataset' | 'docs';
  setActiveTab: (tab: 'playground' | 'verifier' | 'schema' | 'dataset' | 'docs') => void;
  serverStatus: 'online' | 'connecting' | 'error';
  resetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  serverStatus,
  resetDb,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Assignment Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-bold font-mono text-lg">
              GQL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-100 text-sm tracking-wide">
                  GraphQL Sunucusu
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                  Ödev 1
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span>İmza:</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Enes Öztürk
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Playground & IDE
            </button>
            <button
              onClick={() => setActiveTab('verifier')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'verifier'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ödev Doğrulama Robotu
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'schema'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Şema & Tipler
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dataset'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Veri Seti
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              API & cURL
            </button>
          </nav>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline text-zinc-400">Endpoint:</span>
              <span className="text-purple-400 font-semibold">/graphql</span>
            </div>

            <button
              onClick={resetDb}
              title="Veri setini başlangıç haline döndür"
              className="text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800 transition"
            >
              Sıfırla
            </button>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'playground' ? 'bg-purple-600 text-white' : 'text-zinc-400 bg-zinc-900'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'verifier' ? 'bg-purple-600 text-white' : 'text-zinc-400 bg-zinc-900'
            }`}
          >
            Doğrulama Robotu
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'schema' ? 'bg-purple-600 text-white' : 'text-zinc-400 bg-zinc-900'
            }`}
          >
            Şema & Tipler
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'dataset' ? 'bg-purple-600 text-white' : 'text-zinc-400 bg-zinc-900'
            }`}
          >
            Veri Seti
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'docs' ? 'bg-purple-600 text-white' : 'text-zinc-400 bg-zinc-900'
            }`}
          >
            API & cURL
          </button>
        </div>
      </div>
    </header>
  );
};
