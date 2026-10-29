import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { GraphQLStudio } from './components/GraphQLStudio.tsx';
import { DataExplorer } from './components/DataExplorer.tsx';
import { SchemaDocs } from './components/SchemaDocs.tsx';
import { ApiGuide } from './components/ApiGuide.tsx';
import { Footer } from './components/Footer.tsx';
import { CONTINENTS, COUNTRIES, LANGUAGES } from './graphql/data.ts';
import { Sparkles, Globe, Terminal, Database, BookOpen, Code2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [studioQuery, setStudioQuery] = useState<string | undefined>(undefined);

  const handleOpenQueryInStudio = (query: string) => {
    setStudioQuery(query);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
        }}
        serverStatus="online"
      />

      {/* Hero / Project Header Banner */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Proje 1 — GraphQL Backend & Interactive Studio</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Countries, Continents & Languages GraphQL API
              </h1>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Kıtaları, ülkeleri ve bu ülkelerde konuşulan dilleri ilişkili bir biçimde sorgulayabileceğiniz tam teşekküllü GraphQL backend servisi ve geliştirici stüdyosu.{' '}
                <span className="text-white font-semibold underline decoration-pink-500 underline-offset-4">
                  Enes Öztürk imzasıyla
                </span>.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Kıtalar</div>
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  {CONTINENTS.length}
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Ülkeler</div>
                <div className="text-xl font-bold font-mono text-pink-400 tabular-nums">
                  {COUNTRIES.length}+
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">Diller</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {LANGUAGES.length}
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400 font-medium">İlişkiler</div>
                <div className="text-xl font-bold text-cyan-400 font-mono">
                  Çift Yönlü
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tab Switcher on Mobile/Tablet */}
          <div className="flex md:hidden items-center gap-1 mt-6 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'studio' ? 'bg-pink-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Studio
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'explorer' ? 'bg-pink-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Gezgin
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'schema' ? 'bg-pink-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Şema
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'guide' ? 'bg-pink-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Rehber
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'studio' && <GraphQLStudio initialQuery={studioQuery} />}
        {activeTab === 'explorer' && (
          <DataExplorer onOpenQueryInStudio={handleOpenQueryInStudio} />
        )}
        {activeTab === 'schema' && <SchemaDocs />}
        {activeTab === 'guide' && <ApiGuide />}
      </main>

      {/* Signature & Author Footer */}
      <Footer />
    </div>
  );
}
