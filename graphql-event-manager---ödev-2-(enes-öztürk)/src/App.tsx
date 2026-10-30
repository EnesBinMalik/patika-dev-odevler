/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2
 * @description Tüm tipler (User, Event, Location, Participant) için ekleme,
 * güncelleme, silme ve tümünü silme (CRUD + DeleteAll) Mutation motoru.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Playground } from './components/Playground';
import { TestSuite } from './components/TestSuite';
import { DataExplorer } from './components/DataExplorer';
import { CodeViewer } from './components/CodeViewer';
import { db } from './graphql/database';
import { CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'tests' | 'explorer' | 'code'>('playground');
  const [dbState, setDbState] = useState(() => db.getState());
  const [resetToast, setResetToast] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setDbState(db.getState());
    });
    return () => unsubscribe();
  }, []);

  const handleResetData = () => {
    db.resetToDefaults();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleResetData}
        state={{
          usersCount: dbState.users.length,
          eventsCount: dbState.events.length,
          locationsCount: dbState.locations.length,
          participantsCount: dbState.participants.length
        }}
      />

      {/* Reset Toast */}
      {resetToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Örnek veriler başarıyla sıfırlandı ve yeniden yüklendi.</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'tests' && <TestSuite />}
        {activeTab === 'explorer' && <DataExplorer />}
        {activeTab === 'code' && <CodeViewer />}
      </main>

      {/* Footer with Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>GraphQL Ödev 2 — 16 Mutation Eksiksiz Çalışır Vaziyette</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Hazırlayan ve İmzalayan:</span>
            <strong className="text-purple-300 font-semibold tracking-wide">Enes Öztürk</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
