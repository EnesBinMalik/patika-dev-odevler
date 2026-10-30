/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Navigation Header
 */
import React from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  Database, 
  Code2, 
  RotateCcw, 
  Sparkles,
  Users,
  Calendar,
  MapPin,
  UserCheck
} from 'lucide-react';
import { db } from '../graphql/database';

interface HeaderProps {
  activeTab: 'playground' | 'tests' | 'explorer' | 'code';
  setActiveTab: (tab: 'playground' | 'tests' | 'explorer' | 'code') => void;
  onReset: () => void;
  state: {
    usersCount: number;
    eventsCount: number;
    locationsCount: number;
    participantsCount: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  state
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Signature */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-pink-400 font-bold text-lg">◈</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  GraphQL Ödev 2
                </h1>
                <span className="px-2 py-0.5 text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-md">
                  16 Mutation
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-slate-500">Hazırlayan:</span>
                <span className="font-semibold text-purple-300">Enes Öztürk</span>
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 text-[11px]">Apollo / GraphQL Engine</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              GraphQL Studio
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Otomatik Test Suite (16/16)
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'explorer'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Canlı Veri Gezgini
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Şema & Kodlar
            </button>
          </nav>

          {/* Quick Metrics & Reset */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-900 border border-slate-800/80 rounded-lg text-xs text-slate-300">
              <span className="flex items-center gap-1" title="User sayısı">
                <Users className="w-3 h-3 text-pink-400" />
                {state.usersCount}
              </span>
              <span className="flex items-center gap-1" title="Event sayısı">
                <Calendar className="w-3 h-3 text-purple-400" />
                {state.eventsCount}
              </span>
              <span className="flex items-center gap-1" title="Location sayısı">
                <MapPin className="w-3 h-3 text-indigo-400" />
                {state.locationsCount}
              </span>
              <span className="flex items-center gap-1" title="Participant sayısı">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                {state.participantsCount}
              </span>
            </div>

            <button
              onClick={onReset}
              title="Varsayılan tohum verilerine sıfırla"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-800 hover:border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Verileri Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'playground' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            GraphQL Studio
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'tests' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Test Suite (16/16)
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'explorer' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Veri Gezgini
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'code' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Şema & Kodlar
          </button>
        </div>
      </div>
    </header>
  );
};
